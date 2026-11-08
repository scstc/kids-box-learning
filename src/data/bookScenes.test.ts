import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bookScenes, sceneReply } from "./bookScenes";
import { audioKey } from "./course";

describe("按课本场景回答当前的问题", () => {
  it("第8页同一人物会按姓名或年龄问题回答，年龄来自原书徽章", () => {
    expect(sceneReply(8,"name","stella")?.text).toBe("I'm Stella.");
    expect(sceneReply(8,"age","stella")?.text).toBe("I'm seven.");
    expect(sceneReply(8,"age","simon")?.text).toBe("I'm six.");
    expect(sceneReply(8,"age","suzy")?.text).toBe("I'm three.");
    expect(sceneReply(8,"age","meera")?.text).toBe("I'm eight.");
    expect(sceneReply(8,"unknown","meera")).toBeNull();
  });
  it("猜谜只有符合书上提示的图片会给正确反馈，其余场景按所选图片实际回答", () => {
    expect(sceneReply(58,"guess","meera")?.correct).toBe(true);
    expect(sceneReply(58,"guess","stella")?.correct).toBe(false);
    expect(sceneReply(82,"guess","four")?.correct).toBe(true);
    expect(sceneReply(44,"dog","four")?.text).toBe("No, I haven't.");
    expect(sceneReply(68,"sing","boy")?.text).toBe("Yes, I can.");
    expect(sceneReply(68,"swim","boy")?.text).toBe("No, I can't.");
  });
  it("13处场景均可独立提问与回答，所有语音离线存在且不超出书页", () => {
    expect(Object.keys(bookScenes)).toHaveLength(13);
    for(const scene of Object.values(bookScenes)) {
      for(const target of [...scene.questions,...scene.answers]) {
        const [x,y,w,h]=target.rect;
        expect(x).toBeGreaterThanOrEqual(0); expect(y).toBeGreaterThanOrEqual(0);
        expect(x+w).toBeLessThanOrEqual(1259); expect(y+h).toBeLessThanOrEqual(1600);
      }
      for(const answer of scene.answers) for(const question of scene.questions) expect(answer.replies[question.id]).toBeTruthy();
      for(const text of [...scene.questions.map(q=>q.text),...scene.answers.flatMap(a=>Object.values(a.replies))]) {
        const bytes=readFileSync(new URL(`../../public/course-audio/${audioKey(text)}.mp3`,import.meta.url));
        expect(bytes.length,text).toBeGreaterThan(1000);
      }
    }
  });
});
