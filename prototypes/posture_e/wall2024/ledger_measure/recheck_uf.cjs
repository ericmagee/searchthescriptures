const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';
const files=fs.readdirSync(D).filter(f=>new RegExp(process.argv[2]).test(f));const out=[];
for(const f of files){const s=fs.readFileSync(D+f,'utf8');const run=f.split('_')[0];const alt=/Alt_/.test(f);
 const re=/unanswered-false: ([^\]"]{0,40}?)(?:found in|quotes) ([^,]*), but a later (\w+) round names every pressed witness the line rests on: ([^"\]]*?)(?:;? ?\(?counted|\.|"|$)/g;let m;
 // find seat context: nearest "SEAT: x" before
 while((m=re.exec(s))){const pre=s.slice(Math.max(0,m.index-3000),m.index);const sm=[...pre.matchAll(/SEAT: (\w+)|"seat": ?"(\w+)"|"seat":"(\w+)"/g)].pop();
  const refs=[...m[4].matchAll(/[\[(]([CD]R\d)[\])] ([1-3]?\s?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d+:\d+)/g)].map(x=>x[1]+' '+x[2]);
  out.push({run,alt,seat:sm?(sm[1]||sm[2]||sm[3]):'?',side:m[3],refs:[...new Set(refs)].join('; ')});}}
const u=[...new Map(out.map(o=>[JSON.stringify(o),o])).values()];console.log(u.length);u.forEach(o=>console.log(JSON.stringify(o)));
