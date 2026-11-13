const fs=require('fs');const C='/mnt/project-files/wall2024/pkgWVL/corpus/';let x;for(const f of ['corpus_F.json','corpus2_F.json']){const a=JSON.parse(fs.readFileSync(C+f));(Array.isArray(a)?a:Object.values(a)).forEach(r=>{if(r.run==='ODV1-32725-pu2chngi')x=r;});}
const T=[x.cr1,x.cr2,x.cr3,x.cr4].join('\n');
const mk=f=>{const w0=JSON.parse(fs.readFileSync(f));const W=(w0.data||w0).workflow||(w0.data||w0);const s=W.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;const z=s.indexOf('const SY=String(d.synthesis');
 const cut=(a,b)=>{const i=s.indexOf(a,z);const j=s.indexOf(b,i);return s.slice(i,j);};
 return new Function('T','s','verb','const d={};'+cut('const QF=','\n const DEF=')+cut('const STOPW=','const qheld=')+cut('const objs=','\n   const held=')+"const fr=FAM[verb[0]==='w'?'w':verb[0]==='c'?'c':verb[0]==='r'?'r':'d'];return {objs,ok:affirmed(T,fr,objs)};");};
const s='The defender formally conceded in Round 2: *"My ellipsis dropped \'of the house of David\', and the phrase belongs to Joseph.';
for(const f of ['fetchback_live_s168.json','parent_s168_SEG.json','parent_s168_SEG2.json','parent_s168_SEG3.json']){const r=mk('/mnt/project-files/wall2024/'+f)(T,s,'conceded');console.log(f,JSON.stringify(r));}
