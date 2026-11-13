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
const R={CR1:'x',DR1:'x',CR2:'x',DR2:'the sign is bounded in Isaiah\'s own day',CR3,DR3:'x',CR4:'x',DR4:'x'};
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
T('A2 new: "[CR3]" MISSES line tags isaiah 7:16',JSON.stringify(acm(NN,MISSB))==='["isaiah 7:16"]');
T('A3 new: "[CR3]" tags as base',JSON.stringify(acm(NN,MISSB))===JSON.stringify(acm(NB,MISSB)));
T('A4 new: g4Aq2024 returns the graded answer',JSON.stringify(NN.g4Aq2024(MISSB,LINE,'DEFENDER'))==='[{"a":"Matthew 1:22 gives its own reading of the word","r":["CR3"]}]');
T('A5 MEETS: no answer returned',NN.g4Aq2024(MEETB,LINE,'DEFENDER').length===0);
T('A6 side filter: [DR3] MISSES gives none for a DEFENDER item',NN.g4Aq2024(MISSB.replace('[CR3]','[DR3]'),LINE,'DEFENDER').length===0);
T('A7 another verse: none',NN.g4Aq2024(MISSB.replace('Isaiah 7:16','Luke 1:27'),LINE,'DEFENDER').length===0);
const item=(acm,acq)=>[{rule:'K-G4',side:'DEFENDER',link:'D4 vs C2',line:LINE,...(acm===undefined?{}:{acm}),...(acq===undefined?{}:{acq})}];
const run=(L,acm,acq,txt)=>L.cureVerdicts(item(acm,acq),REPLY(txt),null,R)[0];
const AQ=[{a:'Matthew 1:22 gives its own reading of the word',r:['CR3']}];
const b1=run(NB,undefined,undefined,RETQ),n1=run(NN,['isaiah 7:16'],AQ,RETQ);
T('C1 base: the 36156 retraction quoting the missed answer is CURED',b1.status==='CURED',b1.status+' '+String(b1.why).slice(0,100));
T('C2 new: the same retraction is UNCURED with the pkgRMQ reason',n1.status==='UNCURED'&&/pkgRMQ/.test(n1.why),n1.status+' '+String(n1.why).slice(-220));
const n2=run(NN,['isaiah 7:16'],AQ,RETQ+'\n'+MEETB);T('C3 new: a MEETS restated in the cure does not clear it (the grade as raised governs)',n2.status==='UNCURED',n2.status);
const b4=run(NB,undefined,undefined,RETO),n4=run(NN,['isaiah 7:16'],AQ,RETO);T('C4 a different 6-word quotation of the round still cures as base',b4.status===n4.status&&n4.status==='CURED',b4.status+' / '+n4.status+' '+String(n4.why).slice(0,100));
const n5=run(NN,undefined,undefined,RETQ);T('C5 untagged item (no acq): same as base',n5.status===b1.status&&n5.why===b1.why);
const n6=run(NN,[],AQ,RETQ.replace('"Matthew 1:22 gives its own reading of the word"','"Matthew 1:22 gives its own reading of the word itself here"'));T('C6 a longer quotation holding the 6 words is refused',n6.status==='UNCURED',n6.status);
{const LB=libX(process.argv[3],'Panel Cure Build 1'),LB0=libX(process.argv[2],'Panel Cure Build 1');const x=item(['isaiah 7:16'],AQ)[0],y=item(undefined,undefined)[0],z=item(['isaiah 7:16'],undefined)[0];const s1=LB.g4Label2024(x),s0=LB0.g4Label2024(y),s2=LB.g4Label2024(y),s3=LB.g4Label2024(z),s30=LB0.g4Label2024(z);
// rev 2: W3's F1 plants (w3/grade_RMQ/w3_plants.cjs), graded answers in [CR3], retraction quoting [CR4]
const R3={CR1:'x',DR1:'x',CR2:'x',DR2:'the sign is bounded in Isaiah\'s own day',CR3,DR3:'x',CR4:'- **Isaiah 7:16** The verse reads "before the child shall know to refuse the evil", and I answer the timing: the near sign in the day of Ahaz does not exhaust the word, as Isaiah 8:8 carries the name beyond that day.\n- The conception is of the Holy Ghost in Matthew 1:20 and that source governs how the sign is read.',DR4:'x'};
const ret4=q=>'RETRACTED: D4 vs C2 -- [CR4] "'+q+'" answers the timing press.\nCORRECTED RESULT: HELD-1\nRESPONSE: K-G4 D4 vs C2 | retracted with the quoted reason.';
const ret3=q=>ret4(q).replace('[CR4]','[CR3]');
const W3=(nm,ans,q,want,rt)=>{const rr=rt||ret4;const b=NB.cureVerdicts(item(undefined,undefined),REPLY(rr(q)),null,R3)[0],v=NN.cureVerdicts(item(['isaiah 7:16'],[{a:ans,r:['CR3']}]),REPLY(rr(q)),null,R3)[0];T(nm,b.status==='CURED'&&v.status===want,'base '+b.status+' new '+v.status+' '+String(v.why).slice(0,90));};
W3('F1-W1 short missed answer, CR4 sentence holding it: cures','of the Holy Ghost','The conception is of the Holy Ghost in Matthew 1:20 and that source governs how the sign is read','CURED');
W3('F1-W2 missed answer holds verse words, CR4 answer quoting the verse: cures','The verse says before the child shall know to refuse the evil and stops there','before the child shall know to refuse the evil", and I answer the timing: the near sign in the day of Ahaz does not exhaust the word','CURED');
W3('F1-W2b quotation without the verse words: cures','The verse says before the child shall know to refuse the evil and stops there','the near sign in the day of Ahaz does not exhaust the word','CURED');
{const q='the near sign in the day of Ahaz does not exhaust the word, granted that it is near';const b=NB.cureVerdicts(item(undefined,undefined),REPLY(ret4(q)),null,R3)[0],v=NN.cureVerdicts(item(['isaiah 7:16'],[{a:'Granted',r:['CR3']}]),REPLY(ret4(q)),null,R3)[0];T('F1-W4 one-word missed answer: same as base (the quotation does not stand in [CR4] word for word)',b.status===v.status,b.status+' / '+v.status);}
W3('F1-S3 six words from inside the answer, same round: refused','Matthew 1:22 gives its own reading of the word','gives its own reading of the word','UNCURED',ret3);
W3('F1-S4 a quotation the answer does not hold, same round: cures','Matthew 1:22 gives its own reading of the word','and the fulfilment is stated there','CURED',ret3);

 T('P1 prompt: item with acq gets the sentence',/Quoting an answer your own ANSWER CHECK grades MISSES or FAILS does not cure it either\./.test(s1),String(s1.length-s3.length)+' chars added');T('P2 untagged item text equals base',s2===s0);T('P3 pkgCNV-only tag equals base',s3===s30);}
console.log('checks',ok,'of',n);
