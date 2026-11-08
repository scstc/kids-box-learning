// One-time extraction from the bundled scans' OCR. The runtime uses fixed reviewed regions.
import { readFile, writeFile } from 'node:fs/promises';
import { verifiedBookActivities, bookSections } from '../src/data/bookActivities.ts';
const root=new URL('../',import.meta.url),out={};
const activities=[...Object.values(verifiedBookActivities).flat(),...bookSections.flatMap(section=>section.activities.map((title,index)=>({title,page:section.page+Math.floor(index/2)})))];
const norm=text=>text.toLowerCase().replace(/[^a-z]/g,'');
const add=(page,word,rows,padding=5)=>{
 if(!word||!rows.length)return;
 const x=Math.min(...rows.map(r=>r.x))-padding,y=Math.min(...rows.map(r=>r.y))-padding;
 const width=Math.max(...rows.map(r=>r.x+r.w))-x+padding,height=Math.max(...rows.map(r=>r.y+r.h))-y+padding;
 if(x<0||y<0||x+width>1259||y+height>1600)return;
 (out[page]??=[]).push({word,kind:'text',x:x/1259*100,y:y/1600*100,width:width/1259*100,height:height/1600*100});
};
const scan=async(page)=>{
 const data=JSON.parse(await readFile(new URL(`artifacts/ocr-results/${String(page-2).padStart(2,'0')}.json`,root),'utf8'));
 return data.tsv.trim().split('\n').filter(r=>r.startsWith('5\t')).map(r=>{const p=r.split('\t');return{text:p[11],x:+p[6],y:+p[7],w:+p[8],h:+p[9],confidence:+p[10],line:p.slice(1,5).join(':')};});
};
for(let page=4;page<=95;page++){
 if(page>=94)continue; // This spread uses the reviewed full sentences in bookReadingRegions.
 const rows=await scan(page);
 const titles=[...new Set(activities.filter(a=>a.page===page).map(a=>a.title))];
 const joined=rows.map(r=>norm(r.text)).join('');
 const positions=rows.flatMap((r,index)=>Array(norm(r.text).length).fill(index));
 for(const title of titles){
  const key=norm(title),start=joined.indexOf(key);
  if(start<0)continue;
  const span=rows.slice(positions[start],positions[start+key.length-1]+1);
  if(Math.max(...span.map(r=>r.y))-Math.min(...span.map(r=>r.y))<100)add(page,title,span);
 }
}

await writeFile(new URL('src/data/bookPrintedText.ts',root),`import type { BookHotspot } from "./bookHotspots";\n\n// Printed activity headings. Footers are reviewed separately in bookFooterRegions.ts.\nexport const bookPrintedText: Record<number, BookHotspot[]> = ${JSON.stringify(out,null,2)};\n`);
console.log({pages:Object.keys(out).length,regions:Object.values(out).flat().length});
