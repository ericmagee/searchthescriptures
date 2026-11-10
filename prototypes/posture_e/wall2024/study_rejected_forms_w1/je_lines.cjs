// W1: every line of every stored judge enforcer reply (Judge, Alt, Retry calls), classified by the live s108 Judge Enforcer Record's own line patterns
// (taken from pkgLIB/strip_R1/patched/Judge_Enforcer_Record.js, which is the live source). Offline.
const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const src=fs.readFileSync('pkgLIB/strip_R1/patched/Judge_Enforcer_Record.js','utf8');
const grab=(start)=>{const i=src.indexOf(start);let j=i+start.length,depth=0;// regex literal up to the closing "/i"
 const k=src.indexOf('$/i',j);return new RegExp(src.slice(j,k+1),'i');};
const SF=grab("const __sf=__t.match(/"),M=grab("const m=__t.match(/"),S=grab("const s=__t.match(/");
const files=fs.readdirSync(IN).filter(f=>/_(Alt_)?Judge_Enforcer_(Retry_)?Call_deepseek\.json$/.test(f)).sort();
const cls={},ex={};const add=(k,v)=>{cls[k]=(cls[k]||0)+1;(ex[k]=ex[k]||[]).length<6&&ex[k].push(v);};let replies=0,lines=0;
for(const f of files){const d=JSON.parse(fs.readFileSync(IN+f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);if(!m||!m[0])continue;
 m[0].forEach((it,ci)=>{let txt;try{txt=String(it.json.choices[0].message.content||'');}catch(e){add('NO REPLY (call error)',f+' call '+(ci+1));return;}if(!txt.trim()){add('EMPTY REPLY',f+' call '+(ci+1));return;}replies++;
  for(const l of txt.split('\n')){let t=l.replace(/[*_`]+/g,'').trim();if(!t)continue;lines++;const where=f.replace('.json','')+' call '+(ci+1)+': ';
   const sf=t.match(SF);if(sf&&!/^[BVKYHZPRS]\d/i.test(sf[1])){add('read: seat-first label',where+t.slice(0,140));continue;}
   const mm=t.match(M);if(mm){add(/\./.test(mm[1])?'read: item id':'read: bare item number (mapped if unique)',where+t.slice(0,140));continue;}
   const s=t.match(S);if(s&&!/^[BVKYHZPRS]\d/i.test(s[1])){add('read: judge name only (mapped by order)',where+t.slice(0,140));continue;}
   const looks=/\b(AGREE|DISAGREE|NO ANSWER)\b/.test(t)||/^\W*ENFORCER\b/i.test(t)||/\b[BVKYHZPRS]\d+\.\d+\b/.test(t);
   add(looks?'NOT READ, carries a verdict word or item id':'not read, plain text',where+t.slice(0,180));}});}
console.log('reply files',files.length,'replies',replies,'non-empty lines',lines);
for(const [k,v] of Object.entries(cls).sort((a,b)=>b[1]-a[1])){console.log(String(v).padStart(6),k);(k.startsWith('NOT READ')||k.startsWith('not read')||k.startsWith('NO ')||k.startsWith('EMPTY')||k.includes('seat-first')||k.includes('bare')||k.includes('name only'))&&ex[k].forEach(x=>console.log('         '+x));}
if(process.argv[2]==='all'){for(const k of Object.keys(cls))if(k.startsWith('NOT READ'))console.log(k);}
