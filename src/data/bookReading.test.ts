import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bookHotspots } from "./bookHotspots";
import { bookReadingRegions } from "./bookReadingRegions";
import { bookFooterRegions } from "./bookFooterRegions";
import { audioKey } from "./course";
import { bookSubtitles } from "./bookSubtitles";
import { relatedBookAudio } from "./bookAudio";
import { bookVideos } from "./bookMedia";
import { activeSubtitle, visibleSubtitle, type SubtitleDocument } from "./subtitles";

describe("课本文字直接点读", () => {
  it("P12对话与P13/P17交际用语按完整句子点读，所有35页页脚都有覆盖", () => {
    expect(bookHotspots[12].filter(r=>r.y<90).map(r=>r.word)).toEqual(expect.arrayContaining(["Who's that?","That's Meera.","She's eight."]));
    expect(bookFooterRegions[13].map(r=>r.word)).toEqual(["Functions","How are you?","I'm fine, thank you."]);
    expect(bookFooterRegions[17].map(r=>r.word)).toEqual(["Functions","Great!","Come on!","Let's play.","OK."]);
    expect(Object.keys(bookFooterRegions).map(Number)).toEqual([5,6,7,11,12,13,17,19,20,25,26,31,35,36,41,42,46,47,49,50,55,56,60,65,66,71,72,76,77,79,80,85,86,90,91]);
    for(const regions of Object.values(bookFooterRegions)) for(const r of regions) {
      const cx=r.x+r.width/2,cy=r.y+r.height/2;
      expect(regions.filter(other=>cx>other.x&&cx<other.x+other.width&&cy>other.y&&cy<other.y+other.height)).toHaveLength(1);
    }
  });
  it("多词词组和跨行对白保持完整含义，长句目标之间不抢占点击中心", () => {
    expect(bookHotspots[79].map(r=>r.word)).toEqual(expect.arrayContaining(["dining room","living room","No, he isn't. He's in the bedroom."]));
    expect(bookHotspots[91].map(r=>r.word)).toEqual(expect.arrayContaining(["clean your teeth","wash apples","wash your hands"]));
    for(const page of [6,12,20,21,30,32,41,42,43,60,72,76,79,80,86,92,93]) {
      const regions=bookReadingRegions[page];
      for(const r of regions) {
        const cx=r.x+r.width/2,cy=r.y+r.height/2;
        expect(regions.filter(other=>cx>other.x&&cx<other.x+other.width&&cy>other.y&&cy<other.y+other.height),`${page}: ${r.word}`).toHaveLength(1);
      }
    }
  });
  it("自然拼读覆盖12单元的词和完整例句，不再依赖白色标签或CD资源", () => {
    for (const page of [8,14,22,28,38,44,52,58,68,74,82,88]) {
      expect(bookReadingRegions[page].some(r=>r.word==="Monty's phonics")).toBe(true);
      expect(bookReadingRegions[page].some(r=>/[.!]$/.test(r.word))).toBe(true);
    }
    expect(bookHotspots[14].map(r=>r.word)).toEqual(expect.arrayContaining(["pink","blue","Who's that?","He's Mr Star.","A pink pen and a blue bag."]));
    expect(bookHotspots[26].filter(r=>r.y>93).map(r=>r.word)).toEqual(expect.arrayContaining(["He's","She's","beautiful","ugly","happy","sad","old","young"]));
    expect(bookHotspots[49].filter(r=>r.y>94).map(r=>r.word)).toEqual(expect.arrayContaining(["crocodile","elephant","giraffe","hippo","monkey","snake","tiger"]));
    expect(bookHotspots[51].map(r=>r.word)).toEqual(expect.arrayContaining(["Act it out and say.","What am I?","You're an elephant."]));
  });
  it("每个点击区域在书页内，且配套发音已打包，避免点击后404", () => {
    for (const [page,regions] of Object.entries(bookHotspots)) for(const region of regions) {
      expect(region.x,`${page}: ${region.word}`).toBeGreaterThanOrEqual(0);
      expect(region.y).toBeGreaterThanOrEqual(0);
      expect(region.x+region.width).toBeLessThanOrEqual(100.01);
      expect(region.y+region.height).toBeLessThanOrEqual(100.01);
      const bytes=readFileSync(new URL(`../../public/course-audio/${audioKey(region.word)}.mp3`,import.meta.url));
      expect(bytes.length,region.word).toBeGreaterThan(1000);
      expect(bytes.toString('ascii',0,3)==='ID3'||(bytes[0]===255&&(bytes[1]&224)===224),region.word).toBe(true);
    }
  });
});

describe("英文字幕跟随媒体时间", () => {
  it("暂停或换资源由播放器控制；时间定位包含起点、不包含终点，空白段不展示别句字幕", () => {
    const cues=[{start:1,end:2,text:'pink'},{start:3,end:4,text:"Who's that?"}];
    expect(activeSubtitle(cues,0)).toBeUndefined();
    expect(activeSubtitle(cues,1)?.text).toBe('pink');
    expect(activeSubtitle(cues,2)).toBeUndefined();
    expect(activeSubtitle(cues,3.5)?.text).toBe("Who's that?");
    expect(activeSubtitle(cues,4)).toBeUndefined();
    expect(activeSubtitle([],5)).toBeUndefined();
  });
  it("244段原版音频和47个视频各有离线字幕数据，字幕时间有序且不超出媒体", () => {
    const files=[...relatedBookAudio,...bookVideos].map(item=>item.file);
    expect(files).toHaveLength(291);
    for(const file of files) {
      expect(bookSubtitles[file],file).toBeTruthy();
      const document=JSON.parse(readFileSync(new URL(`../../public/${bookSubtitles[file]}`,import.meta.url),'utf8')) as SubtitleDocument;
      expect(document.language).toBe('en');
      expect(document.duration).toBeGreaterThan(0);
      if (bookVideos.some(video=>video.file===file&&video.kind==='karaoke')) expect(document.cues,file).toHaveLength(0);
      let previousEnd=0;
      for(const cue of document.cues) {
        expect(cue.start,file).toBeGreaterThanOrEqual(previousEnd-.02);
        expect(cue.end,file).toBeGreaterThan(cue.start);
        expect(cue.end,file).toBeLessThanOrEqual(document.duration+.1);
        expect(cue.text.trim()).not.toBe('');
        previousEnd=cue.end;
      }
    }
  });
  it("短停顿不会让字幕闪空，提前显示下一句仍保留真正的静音间隔", () => {
    const cues=[{start:1,end:2,text:'pink'},{start:3,end:4,text:'blue'}];
    expect(visibleSubtitle(cues,.9)?.text).toBe('pink');
    expect(visibleSubtitle(cues,2.15)?.text).toBe('pink');
    expect(visibleSubtitle(cues,2.5)).toBeUndefined();
    expect(visibleSubtitle(cues,2.9)?.text).toBe('blue');
    expect(visibleSubtitle(cues,5)).toBeUndefined();
    const quickReply=[{start:1,end:2,text:'Hello.'},{start:2.05,end:3,text:'Hi!'}];
    expect(visibleSubtitle(quickReply,1.95)?.text).toBe('Hello.');
    expect(visibleSubtitle(quickReply,2.02)?.text).toBe('Hi!');
  });
  it("短音和背景音乐不会让整段字幕丢失：保留pink/blue与家人歌曲的实际内容", () => {
    const read=(file:string)=>JSON.parse(readFileSync(new URL(`../../public/${bookSubtitles[file]}`,import.meta.url),'utf8')) as SubtitleDocument;
    const phonics=read('音频/u4_pb_p14_9.mp3');
    expect(phonics.pipeline).toBe('continuous-speech-v2');
    expect(phonics.cues.some(c=>c.start<21&&/pink/i.test(c.text))).toBe(true);
    expect(phonics.cues.some(c=>c.start>21&&c.end<27&&/blue/i.test(c.text))).toBe(true);
    const song=read('视频/Unit4/unit_4_song.mp4');
    expect(song.cues.some(c=>/family/i.test(c.text))).toBe(true);
    expect(song.cues.flatMap(c=>c.text.split(/\s+/)).length).toBeGreaterThan(40);
  });
});
