// ASK 287: move AUDIT v51 (pkgACL b) from Build Save Body (where Alternate Merge has not run) into Alternate Merge,
// appending record-only lines to each judge body's verdict_raw before Write Judgment 1-3. Widen the label to [CRn ...] and (CRn).
const fs=require('fs');const [,,IN,OUT]=process.argv;const W=JSON.parse(fs.readFileSync(IN,'utf8'));
const g=n=>W.nodes.find(k=>k.name===n);const BSB=g('Build Save Body'),AM=g('Alternate Merge');
let b=BSB.parameters.jsCode;
const s0=b.indexOf("{try{const __acl=(T,R)=>");const e0=b.indexOf("try{const __OR=(t)=>");
if(s0<0||e0<0||e0<s0)throw new Error('BSB anchors');
const old=b.slice(s0,e0);if(!old.includes("$('Alternate Merge').first().json.bodies")||!old.includes('AUDIT v51'))throw new Error('BSB block not v51');
b=b.slice(0,s0)+"/* pkgACL v51 moved to Alternate Merge, ASK 287 */\n"+b.slice(e0);
const ACL=String.raw`const __acl=(T,R)=>{const N=x=>String(x==null?'':x).toLowerCase().replace(/[‘’“”"'${'`'}*_]/g,'').replace(/[^a-z0-9]+/g,' ').trim();const RN={};for(const k of ['CR1','CR2','CR3','CR4','DR1','DR2','DR3','DR4'])RN[k]=' '+N(R[k])+' ';const out=[];
 for(const l0 of String(T||'').replace(/\\n/g,'\n').replace(/\\"/g,'"').split('\n')){const l=l0.replace(/[*_${'`'}]+/g,'').replace(/^\s*(?:[-•]\s*)?/,'');const m=l.match(/^ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*[\[(]\s*([CD]R[1-4])\b[^\]\)\n]*[\])]/i);if(!m)continue;const a=l.match(/(?:--|—)\s*ANSWER\s*:\s*["“]([^"”\n]+)/);if(!a)continue;
  const q=N(a[1].split(/\.\.\.|…/)[0]);if(q.split(' ').length<5)continue;const key=' '+q.split(' ').slice(0,10).join(' ')+' ';const lab=m[2].toUpperCase();const hit=k=>RN[k].includes(key);const inC=['CR1','CR2','CR3','CR4'].filter(hit),inD=['DR1','DR2','DR3','DR4'].filter(hit);
  const own=lab[0]==='C'?inC:inD,oth=lab[0]==='C'?inD:inC;if(!own.length&&oth.length)out.push({verse:m[1].trim(),lab,found:oth,answer:a[1].slice(0,160)});}
 return out;};`;
let a=AM.parameters.jsCode;if(a.includes('pkgACL'))throw new Error('AM already has pkgACL');
a="const __AMOUT=(()=>{\n"+a+"\n})();\n"+
"try{"+ACL+"\n"+
"const d=$('Build Save Body').first().json;const __RR={CR1:d.cr1,CR2:d.cr2,CR3:d.cr3,CR4:d.cr4,DR1:d.gr1,DR2:d.gr2,DR3:d.dr3,DR4:d.dr4};\n"+
"const o=__AMOUT&&__AMOUT[0]&&__AMOUT[0].json;if(o&&Array.isArray(o.bodies))o.bodies=o.bodies.map(s=>{try{const j=JSON.parse(s);const p=j.payload||{};const L=__acl(p.verdict_raw,__RR).slice(0,12).map(x=>'[AUDIT v51: ANSWER CHECK ROUND LABEL (pkgACL, ASK 277/287; TRIAL, record-only) -- SEAT: '+(p.judge_seat||'?')+'; '+x.verse+' ['+x.lab+']: the quoted ANSWER \"'+x.answer.slice(0,120).replace(/[\\[\\]\"]/g,'').replace(/RESULT/gi,'result')+'\" stands only in '+x.found.join(', ')+', the other side\\'s round; the engine reads the label as the round that holds the answer. REVIEW THIS ROW.]');if(!L.length)return s;p.verdict_raw=String(p.verdict_raw==null?'':p.verdict_raw)+'\\n'+L.join('\\n');j.payload=p;return JSON.stringify(j);}catch(e){return s;}});}catch(e){}\n"+
"return __AMOUT; /* pkgACL v51 here, ASK 287 */";
AM.parameters.jsCode=a;BSB.parameters.jsCode=b;fs.writeFileSync(OUT,JSON.stringify(W));
console.log('BSB',BSB.parameters.jsCode.length,'removed',old.length,'AM',a.length);
