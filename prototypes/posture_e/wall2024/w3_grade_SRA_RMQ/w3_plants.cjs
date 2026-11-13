// pkgCNV test: g4Ac2024 at raising, and cureVerdicts (Panel Cure Check build) on the stored 35856 terra K-G4 item and plants.
// usage: node pkgCNV/test.cjs <base json> <new json>
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const lib=(wf,node)=>{let d=JSON.parse(fs.readFileSync(wf,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);
 const s=rebuild(by[node].parameters.jsCode,by['Shared Library'].parameters.jsCode);
 const T=by['Shared Library'].parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
 const P=M[node].p;const k0=P.findIndex((x,i)=>i>0&&Array.isArray(x)&&typeof x[0]==='string');const src=P.slice(0,k0<0?P.length:k0).map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
 const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],last:()=>({json:{}}),item:{json:{}}});
 return new Function('$','$input','$json','$execution','$node','$workflow',src+'\n;return {cureVerdicts:typeof cureVerdicts==="function"?cureVerdicts:null,g4Ac2024:typeof g4Ac2024==="function"?g4Ac2024:null,g4Label2024:typeof g4Label2024==="function"?g4Label2024:null,drvCheck:typeof drvCheck==="function"?drvCheck:null};')($,{all:()=>[],first:()=>({json:{}})},{},{id:'x',customData:{set(){}}},{},{});};
// W1 pkgRMQ test (run 36156 finding A form). usage: node pkgRMQ/test.cjs <base json> <new json>
const CR3='LINK 4: NARROWED TO: the sign.\n- **Isaiah 7:16** "before the child shall know". Matthew 1:22 gives its own reading of the word, and the fulfilment is stated there.\n- Other text here.';
const R={CR1:'x',DR1:'x',CR2:'x',DR2:'the sign is bounded in Isaiah\'s own day',CR3,DR3:'x',CR4:'- **Isaiah 7:16** The verse reads "before the child shall know to refuse the evil", and I answer the timing: the near sign in the day of Ahaz does not exhaust the word, as Isaiah 8:8 carries the name beyond that day.\n- The conception is of the Holy Ghost in Matthew 1:20 and that source governs how the sign is read.',DR4:'x'};
const LINE='D4 vs C2 (Isaiah 7:16): DEFENDER LINK BROKEN (Commitment 5) -- The answer does not meet the timing press -- PRESSED: D4 vs C2 | [DR2] | "the sign is bounded in Isaiah\'s own day" -- GROUND: [L1] Isaiah 7:16 "before the child shall know to refuse the evil, and choose the good"';
const MISSP='ANSWER CHECK: Isaiah 7:16 -- (CR3) -- MEANS: "the sign is bounded in Isaiah\'s own day" -- ANSWER: "Matthew 1:22 gives its own reading of the word" -- MISSES (Commitment 5) -- "all this was done, that it might be fulfilled" addresses fulfillment, not the timing pressed.';
const MISSB=MISSP.replace('(CR3)','[CR3]'),MEETB=MISSB.replace('-- MISSES (Commitment 5)','-- MEETS');
const RETQ='RETRACTED: D4 vs C2 -- [CR3] "Matthew 1:22 gives its own reading of the word" engages the relationship between the sign and its fulfillment.\nCORRECTED RESULT: HELD-1\nRESPONSE: K-G4 D4 vs C2 | retracted with the quoted reason.';
const RETO='RETRACTED: D4 vs C2 -- [CR3] "and the fulfilment is stated there" answers the timing press.\nCORRECTED RESULT: HELD-1\nRESPONSE: K-G4 D4 vs C2 | retracted with the quoted reason.';
const REPLY=t=>({ok:true,text:t});
const B=lib(process.argv[2],'Panel Cure Check'),N=lib(process.argv[3],'Panel Cure Check');
const NX=(()=>{let d=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));d=d.data||d;d=d.workflow||d;const T=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));return Lb;})();
const H=new Function('__RL',NX[677].slice(NX[677].indexOf('function g4Aq2024'))+';return {g4Aq2024,rmqHit,g4Ac2024};');
const RL=(()=>{const L=lib(process.argv[3],'Panel Cure Check');return null;})();
let ok=0,n=0;const T=(nm,c,info)=>{n++;if(c)ok++;console.log((c?'OK   ':'FAIL ')+nm+(info?' | '+info:''));};
// raise-time helpers, through the node's own library (N built with g4Ac2024; get g4Aq2024 by a second lib call)
const libX=(wf,node)=>{let d=JSON.parse(fs.readFileSync(wf,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);const T=by['Shared Library'].parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));const P=M[node].p;const k0=P.findIndex((x,i)=>i>0&&Array.isArray(x)&&typeof x[0]==='string');const src=P.slice(0,k0<0?P.length:k0).map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],last:()=>({json:{}}),item:{json:{}}});
 return new Function('$','$input','$json','$execution','$node','$workflow',src+'\n;return {cureVerdicts:typeof cureVerdicts==="function"?cureVerdicts:null,g4Ac2024:typeof g4Ac2024==="function"?g4Ac2024:null,g4Aq2024:typeof g4Aq2024==="function"?g4Aq2024:null,g4Label2024:typeof g4Label2024==="function"?g4Label2024:null};')($,{all:()=>[],first:()=>({json:{}})},{},{id:'x',customData:{set(){}}},{},{});};
const NB=libX(process.argv[2],'Panel Cure Check'),NN=libX(process.argv[3],'Panel Cure Check');
const acm=(L,t,sd)=>L.g4Ac2024(t,LINE,/^(?:MISSES|FAILS)$/i,0,sd||'DEFENDER');

const item=(acm,acq)=>[{rule:'K-G4',side:'DEFENDER',link:'D4 vs C2',line:LINE,...(acm===undefined?{}:{acm}),...(acq===undefined?{}:{acq})}];
const run=(L,acm,acq,txt)=>L.cureVerdicts(item(acm,acq),REPLY(txt),null,R)[0];
const ret=q=>'RETRACTED: D4 vs C2 -- [CR4] "'+q+'" answers the timing press.\nCORRECTED RESULT: HELD-1\nRESPONSE: K-G4 D4 vs C2 | retracted with the quoted reason.';
const show=(nm,acq,q)=>{const b=run(NB,undefined,undefined,ret(q)),n=run(NN,['isaiah 7:16'],acq,ret(q));console.log(nm,'| base',b.status,'| new',n.status,'|',String(n.why).slice(0,160));};
// W1: the missed answer is short (under 6 words); the judge quotes ANOTHER sentence, of a later round, that holds those words
show('W1 short missed answer "of the Holy Ghost"; quotes a CR4 sentence',['of the Holy Ghost'],'The conception is of the Holy Ghost in Matthew 1:20 and that source governs how the sign is read');
// W2: the missed answer holds verse text; the judge quotes a later, different answer that quotes the same verse
show('W2 missed answer holds the verse words; quotes the CR4 answer',['The verse says before the child shall know to refuse the evil and stops there'],'before the child shall know to refuse the evil", and I answer the timing: the near sign in the day of Ahaz does not exhaust the word');
show('W2b same, quotation without the verse words',['The verse says before the child shall know to refuse the evil and stops there'],'the near sign in the day of Ahaz does not exhaust the word');
// W3: real 36156 quotation against the real answer
show('W3 real 36156',['Matthew 1:22 gives its own reading of the word'],'Matthew 1:22 gives its own reading of the word');
// W4: missed answer of one word
show('W4 one-word missed answer "Granted"',['Granted'],'the near sign in the day of Ahaz does not exhaust the word, granted that it is near');
// raise-time: two ANSWER CHECK lines on the verse, one MISSES [CR3], one MEETS [CR4]
const two=MISSB+'\n'+MISSB.replace('[CR3]','[CR4]').replace('Matthew 1:22 gives its own reading of the word','the near sign in the day of Ahaz does not exhaust the word').replace('-- MISSES (Commitment 5)','-- MEETS');
console.log('W5 acq with a MISSES [CR3] and a MEETS [CR4]:',JSON.stringify(NN.g4Aq2024(two,LINE,'DEFENDER')));
console.log('W6 same answer graded MISSES then MEETS on two lines:',JSON.stringify(NN.g4Aq2024(MISSB+'\n'+MEETB,LINE,'DEFENDER')));
