// pkgCNV test: g4Ac2024 at raising, and cureVerdicts (Panel Cure Check build) on the stored 35856 terra K-G4 item and plants.
// usage: node pkgCNV/test.cjs <base json> <new json>
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const lib=(wf,node)=>{let d=JSON.parse(fs.readFileSync(wf,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);
 const s=rebuild(by[node].parameters.jsCode,by['Shared Library'].parameters.jsCode);
 const T=by['Shared Library'].parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
 const P=M[node].p;const k0=P.findIndex((x,i)=>i>0&&Array.isArray(x)&&typeof x[0]==='string');const src=P.slice(0,k0<0?P.length:k0).map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
 const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],last:()=>({json:{}}),item:{json:{}}});
 return new Function('$','$input','$json','$execution','$node','$workflow',src+'\n;return {cureVerdicts:typeof cureVerdicts==="function"?cureVerdicts:null,g4Ac2024:typeof g4Ac2024==="function"?g4Ac2024:null,g4Label2024:typeof g4Label2024==="function"?g4Label2024:null,drvCheck:typeof drvCheck==="function"?drvCheck:null};')($,{all:()=>[],first:()=>({json:{}})},{},{id:'x',customData:{set(){}}},{},{});};
const R0=require('/mnt/project-files/w3/grade_35856/rounds.json');const R={CR1:R0.claude_r1,DR1:R0.engine_r1,CR2:R0.claude_r2,DR2:R0.engine_r2,CR3:R0.engine_r3,DR3:R0.challenger_r3,CR4:R0.defender_r4,DR4:R0.challenger_r4};
const LINE='D4 vs C3 (Isaiah 7:16): DEFENDER LINK BROKEN (Commitment 5) -- The timing meaning was not met -- PRESSED: D4 vs C3 | [DR2] | "the sign is bounded in Isaiah\'s day." -- GROUND: [L1] Isaiah 7:16 "before the child shall know to refuse the evil, and choose the good" | [L3] Isaiah 8:8 "the stretching out of his wings shall fill the breadth of thy land, O Immanuel"; the defender\'s answer identifies the land and the virgin but does not address the claimed timing.';
const AC_MISS='ANSWER CHECK: Isaiah 7:16 -- [CR3] -- MEANS: "the sign is bounded in Isaiah\'s day." -- ANSWER: "Isaiah 8:8 \'O Immanuel\' addresses the land as Immanuel\'s, which is a statement about Immanuel, and Isaiah 7:14 states the sign as \'a virgin shall conceive\'." -- MISSES (Commitment 5) -- The answer identifies the land and the sign but does not address the asserted timing.';
const AC_MEETS=AC_MISS.replace('-- MISSES (Commitment 5)','-- MEETS (Commitment 5)');
const AC_OTHER=AC_MISS.replace('ANSWER CHECK: Isaiah 7:16','ANSWER CHECK: Luke 1:27');
const REPLY=t=>({ok:true,text:t});
const RET='RETRACTED: D4 vs C3 -- [CR3] addresses Isaiah 7:16 and Isaiah 8:8, so the timing witness was named in a later defender round.\nCORRECTED RESULT: HELD-1\nRESPONSE: K-G4 D4 vs C3 | I accept the mark: [CR3] names Isaiah 7:16 and Isaiah 8:8 in its answer.\nSTATEMENT: K-G4 D4 vs C3 | The earlier grade is retracted because [CR3] names and addresses the witness.';
const B=lib(process.argv[2],'Panel Cure Check'),N=lib(process.argv[3],'Panel Cure Check');const NP=N;const mapHas=(wf,node,i)=>{let d=JSON.parse(fs.readFileSync(wf,'utf8'));d=d.data||d;d=d.workflow||d;const T=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const M=JSON.parse(T.slice(b+8,c));return M[node].p.some(x=>typeof x==='number'?x===i:typeof x[0]!=='string'&&i>=x[0]&&i<=x[1]);};
let ok=0,n=0;const T=(nm,c,info)=>{n++;if(c)ok++;console.log((c?'OK   ':'FAIL ')+nm+(info?' | '+info:''));};
T('H0 helper present in the cure build; absent in base; its line 677 is in every node holding line 788 or 1072',!!N.g4Ac2024&&!B.g4Ac2024&&['Alt Gate Build','Alt Gate Record','Alternate Cure Normalize','Alternate Merge Seat','Alternate Payloads','Cure Check','Cure Normalize','Extract Independent Verdict','Gate Build','Gate Record','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3','Panel Payloads','R2 Alt Gate Build','R2 Alt Gate Record','R2 Alternate Cure Normalize','R2 Alternate Merge Seat','R2 Alternate Payloads'].every(nd=>mapHas(process.argv[3],nd,677)));
const tag=t=>NP.g4Ac2024(t,LINE,/^(?:MISSES|FAILS)$/i);
T('H1 judge text with MISSES on Isaiah 7:16 tags the item',JSON.stringify(tag('x\n'+AC_MISS+'\ny'))==='["isaiah 7:16"]',JSON.stringify(tag(AC_MISS)));
T('H2 MEETS on Isaiah 7:16 does not tag',tag(AC_MEETS).length===0);
T('H3 MISSES on a verse not in the line does not tag',tag(AC_OTHER).length===0);
T('H4 FAILS tags',tag(AC_MISS.replace('MISSES','FAILS')).length===1);
T('H5 no ANSWER CHECK line, no tag',tag('D4 vs C3 something').length===0);
const item=acm=>[{rule:'K-G4',side:'DEFENDER',link:'D4 vs C3',line:LINE,...(acm===undefined?{}:{acm})}];
const run=(L,acm,txt)=>L.cureVerdicts(item(acm),REPLY(txt),null,R)[0];
const b0=run(B,undefined,RET),n0=run(N,undefined,RET),n1=run(N,['isaiah 7:16'],RET);
T('C1 base: the stored retraction is CURED by "names" (as in run 35856)',b0.status==='CURED'&&/names Isaiah/.test(b0.why),b0.status+' '+String(b0.why).slice(0,90));
T('C2 new, untagged item: same as base',n0.status===b0.status&&n0.why===b0.why);
T('C3 new, tagged item: UNCURED with the pkgCNV reason',n1.status==='UNCURED'&&/pkgCNV/.test(n1.why),n1.status+' '+String(n1.why).slice(0,160));
const n2=run(N,['isaiah 7:16'],RET+'\n'+AC_MEETS);T('C4 new, tagged, reply restates ANSWER CHECK MEETS on Isaiah 7:16: CURED as base',n2.status==='CURED',n2.status+' '+String(n2.why).slice(0,80));
const FQ='RETRACTED: D4 vs C3 -- [CR3] "The press needs the two to be one, and the names differ in the verses themselves."\nCORRECTED RESULT: HELD-1\nRESPONSE: K-G4 D4 vs C3 | the quoted words answer it.';
const bq=run(B,undefined,FQ),nq=run(N,['isaiah 7:16'],FQ);T('C5 route (a), 6-word quote: unchanged by pkgCNV',bq.status===nq.status&&bq.why===nq.why,bq.status+' / '+nq.status+' '+String(nq.why).slice(0,80));
const FZ='FORCED: D4 vs C3 -- MEANS [DR2]: "the sign is bounded in Isaiah\'s day." -- ANSWER [CR3]: "The press needs the two to be one" -- FAILS: "The press needs the two to be one"\nRESPONSE: K-G4 D4 vs C3 | forced.';
const bz=run(B,undefined,FZ),nz=run(N,['isaiah 7:16'],FZ);T('C6 FORCED line: unchanged by pkgCNV',bz.status===nz.status&&bz.why===nz.why,nz.status+' '+String(nz.why).slice(0,70));
{const LB=lib(process.argv[3],'Panel Cure Build 1');const LB0=lib(process.argv[2],'Panel Cure Build 1');if(LB.g4Label2024){const x=item(['isaiah 7:16'])[0],y=item(undefined)[0];const s1=LB.g4Label2024(x),s0=LB0.g4Label2024(y),s2=LB.g4Label2024(y);
 T('P1 prompt: tagged item gets the sentence',/Naming the verse does not cure it here: your own ANSWER CHECK on isaiah 7:16 reads MISSES or FAILS\./.test(s1),String(s1.length-s0.length)+' chars added');T('P2 prompt: untagged item text equals base',s2===s0);}else T('P1 g4Label2024 found in Panel Cure Build 1',false);}
console.log('checks',ok,'of',n);
