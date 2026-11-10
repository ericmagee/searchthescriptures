const fs=require('fs');const files=fs.readFileSync(process.argv[2],'utf8').trim().split('\n');
const seen=new Map();const strs=(x,o)=>{if(typeof x==='string'){if(x.includes('CLOSE-CONTRADICTION'))o.push(x);}else if(x&&typeof x==='object')for(const v of Object.values(x))strs(v,o);return o;};
for(const f of files){let d;try{d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/staged_w4/'+f,'utf8'));}catch(e){continue;}
 for(const s of strs(d,[])){if(s.includes('<candidate id or NEW>')||s.includes('You are the closing enforcer'))continue; // prompt bodies
  for(const l of s.split('\n').filter(l=>/^\s*\**\s*CLOSE-CONTRADICTION:/.test(l))){if(!seen.has(l))seen.set(l,new Set());seen.get(l).add(f);}}}
const lab={};const add=(k,f,l)=>{(lab[k]=lab[k]||{n:0,files:new Set(),ex:l}).n++;lab[k].files.add(f);};
let nolab=[];
for(const [l,fs_] of seen){const f=[...fs_][0];const e=l.match(/EARLIER\s*(\[[^\]]*\]|\([^)]*\)|\S+)/),c=l.match(/CLOSING\s*(\[[^\]]*\]|\([^)]*\)|\S+)/);
 if(/CLOSE-CONTRADICTION:\s*NONE/.test(l)){add('NONE',f,l);continue;}
 if(!e||!c){nolab.push(f+' :: '+l.slice(0,200));continue;}
 const norm=x=>x.replace(/\d+/g,'N');add('EARLIER '+norm(e[1]),f,l);add('CLOSING '+norm(c[1]),f,l);}
console.log('distinct reply lines',seen.size);
for(const [k,v] of Object.entries(lab).sort((a,b)=>b[1].n-a[1].n))console.log(String(v.n).padStart(4),k.padEnd(28),[...v.files].slice(0,3).join(', '));
console.log('lines without EARLIER/CLOSING label:',nolab.length);nolab.slice(0,15).forEach(x=>console.log('  '+x));
// exact forms, pairs per line, and side/prefix agreement
const pairs={},exact={};
for(const [l,fs_] of seen){if(/NONE/.test(l.slice(0,40)))continue;const e=l.match(/EARLIER\s*(\[[^\]]*\])/)[1],c=l.match(/CLOSING\s*(\[[^\]]*\])/)[1],side=(l.match(/-- (DEFENDER|CHALLENGER) --/)||[])[1];
 for(const x of [e,c])exact[x]=(exact[x]||0)+1;const k=side+' '+e.replace(/\d/,'N')+' / '+c.replace(/\d/,'N');(pairs[k]=pairs[k]||[]).push([...fs_][0].split('/').slice(1).join('/'));}
console.log('\nexact labels:',JSON.stringify(exact));console.log('side + EARLIER / CLOSING forms per line:');
for(const [k,v] of Object.entries(pairs))console.log(String(v.length).padStart(4),k.padEnd(48),[...new Set(v)].slice(0,4).join(', '));
