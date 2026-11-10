const fs=require('fs');process.env.LIVE='/mnt/project-files/wall2024/fetchback_live_s115.json';process.env.CAND='/mnt/project-files/wall2024/parent_s115_BRF4.json';
const src=fs.readFileSync(__dirname+'/run_brf.cjs','utf8');eval(src.slice(0,src.indexOf('const of=(h,p)'))+';globalThis.H=H;globalThis.NODES=NODES;');
let mm=0,n=0;
for(const p of JSON.parse(fs.readFileSync(__dirname+'/plants_brf4.json'))){if(p.record)continue;const outs=new Set();
 for(const nd of NODES){const h=H['cand|'+nd];const r=p.F?h.C4P.of(p.F):h.C4P.ofD(p.FD);const g=JSON.stringify({new:[...r],u:r.u||[]});outs.add(g);n++;if(g!==JSON.stringify({new:p.new,u:p.u}))mm++;}
 const hs=H['cand|Build Synthesis'];const note=p.F?hs.C4P.note(p.F):hs.C4P.noteD(p.FD);
 console.log(p.id,'|',[...outs].join(' / '),outs.size===1&&[...outs][0]===JSON.stringify({new:p.new,u:p.u})?'OK':'MISMATCH','| note tail:',JSON.stringify(note.slice(-200)));}
console.log('checks',n,'mismatches',mm);
