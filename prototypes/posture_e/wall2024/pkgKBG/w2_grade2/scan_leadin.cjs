const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs';const s=JSON.parse(fs.readFileSync('pkgKBG/parent_s94_KBG2.json')).nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;
const i=s.indexOf('const __lm=');const lm=new Function('return '+s.slice(i+11,s.indexOf('}; /* pkgKBG rev 2',i)+1))();
const re=/^(?:On|For|At|In|To|Of|Under|As\s+to)\s+(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–]\s*\d+)?\s*,\s*(?:I\s+(?:grant|concede|accept|allow|affirm)\b)/;
const re2=/^[^.]{0,60},\s*I\s+(?:grant|concede|accept|allow|affirm)\b/;let n=0,n2=0;const seen=new Set();const ex=[],ex2=[];
for(const f of fs.readdirSync(IN).filter(f=>/Panel_Cure_Normalize_1\.json$/.test(f))){const R=[];JSON.parse(fs.readFileSync(IN+'/'+f,'utf8'),(k,v)=>{if(k==='rounds'&&v&&typeof v==='object')R.push(v);return v;});
 if(!R[0])continue;for(const k in R[0])String(R[0][k]).split(/(?<=[.!?]["”’)\]*_]*)\s+|\n+/).forEach(x=>{const y=lm(x);const key=f.split('_')[0]+k+y;if(seen.has(key))return;seen.add(key);if(re.test(y)){n++;ex.push(f.split('_')[0]+' '+k+' '+y.slice(0,120));}else if(re2.test(y)){n2++;ex2.push(f.split('_')[0]+' '+k+' '+y.slice(0,120));}});}
console.log('verse lead-in with comma before grant:',n);ex.slice(0,8).forEach(x=>console.log('  '+x));console.log('other short lead-in + comma + I grant:',n2);ex2.slice(0,12).forEach(x=>console.log('  '+x));
