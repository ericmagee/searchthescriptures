const fs=require('fs');const fnOf=f=>{const X=JSON.parse(fs.readFileSync(f,'utf8'));const W=X.data&&X.data.nodes?X.data:X;const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/')));const i=L.findIndex(l=>/^function gdsDash2024/.test(l));return new Function(L.slice(i,i+3).join('\n')+'\nreturn gdsDash2024;')();};
const O=fnOf('/mnt/project-files/wall2024/fetchback_live_s147.json'),N=fnOf('/mnt/project-files/wall2024/parent_s147_GDC.json');
const P=[
['P1 reason opens with quote','SENDBACK: S2 -- CHANGE TO: ANSWER CHECK: Ezra 2:59 -- [CR4] -- MEANS: "a" -- ANSWER: "b" -- MISSES (Commitment 3) -- "house and seed" decides it.'],
['P2 grade word in reason','SENDBACK: S2 -- CHANGE TO: ANSWER CHECK: Ezra 2:59 -- [CR4] -- MEANS: "a" -- ANSWER: "b" -- MISSES -- The answer FAILS -- MEETS no test.'],
['P3 unspaced em dashes, plain reason','SENDBACK: S2 -- CHANGE TO: ANSWER CHECK: Ezra 2:59—[CR4]—MEANS: "a"—ANSWER: "b"—MISSES (Commitment 3)—The answer supplies acts.'],
['P4 reason opens with bracket round tag','SENDBACK: S2 -- CHANGE TO: ANSWER CHECK: Ezra 2:59 -- [CR4] -- MEANS: "a" -- ANSWER: "b" -- MISSES (Commitment 3) -- [CR4] supplies acts, not seed.'],
['P5 reason opens with bare round tag','SENDBACK: S2 -- CHANGE TO: ANSWER CHECK: Ezra 2:59 -- [CR4] -- MEANS: "a" -- ANSWER: "b" -- MISSES (Commitment 3) -- CR4 supplies acts, not seed.'],
['P6 collision, no field after grade','GATE: G2 -- CHANGE TO: D5 vs C1 (Hebrews 7:14): UNDERDETERMINED -- CR3 and CR4 answer the witness.'],
['P7 collision with layer, reason quote','GATE: G2 -- CHANGE TO: D1 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- [L1] Luke 1:35 "that holy thing" -- "that holy thing" is the record.'],
['P8 en dashes spaced','SENDBACK: S2 – CHANGE TO: ANSWER CHECK: Ezra 2:59 – [CR4] – MEANS: "a" – ANSWER: "b" – MISSES – The answer supplies acts.'],
['P9 KEEP with fields','SENDBACK: S2 -- KEEP -- ANSWER CHECK: Ezra 2:59 -- [CR4] -- the reason.'],
['P10 lowercase grade in reason','SENDBACK: S2 -- CHANGE TO: ANSWER CHECK: Ezra 2:59 -- [CR4] -- MEANS: "a" -- ANSWER: "b" -- MISSES -- the answer misses -- "seed" decides.'],
];
const show=(f,l)=>{const r=f(l);if(r==null)return 'null';const p=r.split(' || ');return 'TO=['+(p[1]||'').replace(/^CHANGE TO:?\s*/,'')+']\n         WHY=['+(p.slice(2).join(' || '))+']';};
for(const [k,l] of P){console.log(k);console.log('  old',show(O,l));console.log('  new',show(N,l));}
