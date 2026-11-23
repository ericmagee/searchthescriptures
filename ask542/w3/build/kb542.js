// ASK 542 known-bad and known-good unit test (W3 build). Real Library code from the live and target engine files:
// UNX_MW (index 433), unxPresses (436-440), unxAcFail (452), and the exemption condition cut verbatim from index 479.
// Rounds: ask516/w4/b/run41418/rounds516_41418.txt (md5 checked below). Judge text: sol's ANSWER CHECK lines from
// debate_enforcer_log 51422 full_reply (md5 b4584a75 of the whole reply), premises 1 to 3, copied verbatim into ac542_51422.txt.
const fs=require('fs');const crypto=require('crypto');process.chdir(__dirname);const ld=require('./loadlib542.js');
const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const RT=fs.readFileSync('/mnt/project-files/ask516/w4/b/run41418/rounds516_41418.txt','utf8');
const R={};const lines=RT.split('\n');let cur=null;for(const l of lines){const m=l.match(/^\[((?:CR|DR)[1-4])\]\s*$/);if(m&&!(m[1] in R)){cur=m[1];R[cur]='';continue;}if(cur)R[cur]+=l+'\n';}
const AC=fs.readFileSync('ac542_51422.txt','utf8');
const cond=L=>{const s=L[479];const a=s.indexOf('if([...PR,'),b=s.indexOf(')continue;',a);return s.slice(a+3,b);};
const mk=f=>{const {L,F}=ld(f,['UNX_MW','unxPresses','unxAcFail']);const c=cond(L);
 return {c,fn:new Function('unxPresses','unxAcFail','return (PR,R,side,j,text,rk)=>('+c+');')(F.unxPresses,F.unxAcFail),F};};
const O=mk('live542_engine.json'),N=mk('target_engine_542.json');
console.log('rounds md5 '+md5(RT)+' | AC text md5 '+md5(AC)+' | round lengths '+Object.keys(R).map(k=>k+' '+R[k].length).join(', '));
console.log('OLD condition: '+O.c);console.log('NEW condition: '+N.c);
const side='DEFENDER',rk='CR3';const PR=O.F.unxPresses(R.DR3);
for(const j of [1,2,3]){const ps=[...PR,...O.F.unxPresses(R.DR2)].filter(p=>p.n===j);
 console.log('premise '+j+': presses '+ps.map(p=>p.ref).join(', ')+' | OLD exempt '+O.fn(PR,R,side,j,AC,rk)+' | NEW exempt '+N.fn(PR,R,side,j,AC,rk));}
// unit cases on synthetic ANSWER CHECK lines (W1's t542 cases), one press each
const U=(ref,lines)=>{const P=[{n:9,ref}];const t=lines.join('\n');return 'OLD '+O.fn(P,{DR2:''},side,9,t,rk)+' NEW '+N.fn(P,{DR2:''},side,9,t,rk);};
console.log('U1 Luke 1:34 [CR4] MISSES: '+U('Luke 1:34',['ANSWER CHECK: Luke 1:34 -- [CR4; defender premise 2] -- MEANS: "x" -- ANSWER: "y" -- MISSES (Commitments 3 and 8) -- z']));
console.log('U2 Matthew 1:16 [CR2] MISSES: '+U('Matthew 1:16',['ANSWER CHECK: Matthew 1:16 -- [CR2; defender premise 3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z']));
console.log('U3 [CR4] MISSES and [CR4] MEETS: '+U('Matthew 1:20',['ANSWER CHECK: Matthew 1:20 -- [CR4] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z','ANSWER CHECK: Matthew 1:20 -- [CR4] -- MEANS: "x" -- ANSWER: "y" -- MEETS -- z']));
console.log('U4 [CR3] MISSES and [CR4] MEETS (the 12 groups): '+U('Acts 2:30',['ANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z','ANSWER CHECK: Acts 2:30 -- [CR4] -- MEANS: "x" -- ANSWER: "y" -- MEETS -- z']));
console.log('U5 [CR40] MISSES: '+U('Acts 2:30',['ANSWER CHECK: Acts 2:30 -- [CR40] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z']));
console.log('U6 [CR1] MISSES: '+U('Acts 2:30',['ANSWER CHECK: Acts 2:30 -- [CR1] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z']));
console.log('U7 [DR4] MISSES on a DEFENDER premise: '+U('Acts 2:30',['ANSWER CHECK: Acts 2:30 -- [DR4] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- z']));
