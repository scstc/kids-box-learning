// Derived artwork only. Original PDF pages and flashcard JPGs stay unchanged.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { courseUnits } from '../src/data/course.ts';
import { originalWordArt, originalFlashcardArt, wordArtFallbacks } from '../src/data/originalArt.ts';
import { bookFlashcards } from '../src/data/bookMedia.ts';
import { audioKey } from '../src/data/course.ts';
const clear={r:0,g:0,b:0,alpha:0};
const art={...originalWordArt},fallbacks=[...wordArtFallbacks];
const cutouts={
 star:[8,226,560,170,135], ugly:[26,365,545,240,300], old:[26,160,775,230,350], young:[26,367,1000,180,310], beautiful:[26,1020,575,200,610],
 dirty:[36,300,220,455,200], clean:[36,865,260,250,470], frog:[44,95,525,180,160], arm:[50,790,325,100,220],
 Lily:[68,220,245,170,200], duck:[74,110,240,165,195], walking:[74,140,975,190,225],
 playing:[82,140,1030,220,180], driving:[82,420,1030,215,180], flying:[82,675,1030,225,180], eating:[82,935,1030,240,180],
 reading:[82,135,1260,220,190], swimming:[82,675,1260,235,190], watching:[82,945,1260,235,190], draw:[80,180,615,385,280],
};
const extracted={};
for(const [en,[page,left,top,width,height]] of Object.entries(cutouts)){
 const file=`book-art/extra-${audioKey(en)}.webp`;
 const result=await sharp(`public/book-pages/page-${String(page).padStart(3,'0')}.jpg`).extract({left,top,width,height}).resize({width:480,height:480,fit:'inside',withoutEnlargement:true}).webp({quality:90}).toFile('public/'+file);
 extracted[audioKey(en)]={file,width:result.width,height:result.height,source:{kind:'pdf',page,rect:[left,top,width,height]}};
}
// Plurals show two original book objects, rather than reusing a singular picture.
const plurals={ears:'6:ear',eyes:'6:eye',feet:'6:foot',arms:'arm',hands:'6:hand',legs:'7:leg',tails:'7:tail',heads:'6:head',mouths:'6:mouth',noses:'6:nose'};
for(const [en,key] of Object.entries(plurals)){
 const source=art[key]??extracted[key],file=`book-art/extra-${en}.png`;
 const tile=await sharp('public/'+source.file).resize(220,380,{fit:'inside'}).png().toBuffer();
 const meta=await sharp(tile).metadata();
 await sharp({create:{width:520,height:440,channels:4,background:clear}}).composite([{input:tile,left:20,top:Math.round((440-meta.height)/2)},{input:tile,left:280,top:Math.round((440-meta.height)/2)}]).png().toFile('public/'+file);
 extracted[en]={file,width:520,height:440,source:source.source};
}
for(const [en,y] of [['on',300],['under',495]]){
 const chair=art['2:chair'],ball=art['3:ball'],file=`book-art/extra-${en}.png`;
 const chairTile=await sharp('public/'+chair.file).resize(300,420,{fit:'contain',background:clear}).png().toBuffer();
 const ballTile=await sharp('public/'+ball.file).resize(75,75,{fit:'contain',background:clear}).png().toBuffer();
 await sharp({create:{width:600,height:600,channels:4,background:clear}}).composite([{input:chairTile,left:150,top:130},{input:ballTile,left:275,top:y}]).png().toFile('public/'+file);
 extracted[en]={file,width:600,height:600,source:chair.source};
}
const aliases={piano:'play the piano',guitar:'play the guitar',riding:'ride a bike','school-bus':'bus'};
const noPicture=new Set(['in','next-to','like']);
for(const unit of courseUnits)for(const word of unit.words){const key=`${unit.id}:${word.id}`;
 if(art[key]||fallbacks.some(f=>f.unitId===unit.id&&f.id===word.id))continue;
 if(noPicture.has(word.id)){fallbacks.push({unitId:unit.id,id:word.id,zh:''});continue;}
 const card=bookFlashcards.find(card=>audioKey(card.name)===audioKey(aliases[word.id]??word.en));
 const existing=Object.entries(art).find(([key])=>key.endsWith(':'+word.id))?.[1];
 const image=extracted[word.id]??(card&&originalFlashcardArt[card.number])??existing;
 if(!image)throw Error(`Missing picture or context for ${key}`);
 art[key]=image;
}
let source=await readFile('src/data/originalArt.ts','utf8');
source=source.replace(/export const originalWordArt: Record<string, OriginalArt> = [\s\S]*?;\r?\n/,`export const originalWordArt: Record<string, OriginalArt> = ${JSON.stringify(art,null,2)};\n`);
source=source.replace(/export const wordArtFallbacks = [\s\S]*?;\r?\n/,`export const wordArtFallbacks = ${JSON.stringify(fallbacks,null,2)};\n`);
await writeFile('src/data/originalArt.ts',source);console.log({pictures:Object.keys(art).length,contextClues:fallbacks.length});
