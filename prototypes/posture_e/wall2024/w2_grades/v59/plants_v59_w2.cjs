// pkgV59 builder's test (W1). EXPECTED, written before the first run:
// T1 plants on chatgpt's 34780 text (the confirmed closing contradiction removed from the store, so no engine break) (both standings SELF-SUPPORTED, counts 0 and 0), one collision line changed to CHALLENGER LINK BROKEN and RESULT to DEFENDER WINS, no-cure path (drv emptied):
//   a no FORCED line -> live DEFENDER WINS, candidate UNDERDETERMINED with the RULING 459 trigger;
//   b FORCED line with ANSWER [DR3] -> DEFENDER WINS on both, no trigger;
//   c FORCED line with ANSWER [CR3] (the defender's answer) -> candidate UNDERDETERMINED;
//   d the line says "left unanswered by the challenger", no FORCED -> candidate UNDERDETERMINED;
//   e as a but RESULT UNDERDETERMINED -> equal live (no trigger: nothing to undo);
//   f as a but CHALLENGER CONCEDED LINKS 1 and CHALLENGE STANDING PROP-DEPENDENT -> DEFENDER WINS on both (the count carries it), trigger recorded.
//   g as a, cure path (stored drv kept) -> candidate UNDERDETERMINED.
// T2 stored Panel Cure Check on every stored execution: candidate equals live wherever no first text writes DEFENDER WINS on an unqualified CHALLENGER LINK BROKEN line; every difference listed.
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};const A=wf('fetchback_live_s119.json'),B=wf(process.argv[2]||'parent_s119_V59.json');
const ld=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);const c={};return n=>c[n]||(c[n]=rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode));};const LV=ld(A),CD=ld(B);
const T=s=>s.replace(/"at":"[^"]+"/g,'"at":0').replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z/g,'TS');const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});const J=o=>JSON.parse(S(o));
const mkbase=f=>{const ex=JSON.parse(fs.readFileSync(W+f,'utf8'));const r=(ex.data||ex).resultData.runData;const b={};for(const [n,rs] of Object.entries(r)){const l=rs[rs.length-1];b[n]=(l&&l.data&&l.data.main)||null;}return b;};
const run=async(L,st,tok)=>(await H.run(L('Panel Cure Check'),tok||'x','Panel Cure Needed?',mk(st))).map(x=>x.json);
const res=(out,i)=>{const o=out[0];const b=JSON.parse(o.bodies[i]);const t=String(b.payload.verdict_raw);const r=(t.match(/RESULT:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)[^\n]{0,0}/)||[])[1];const tr=/RULING 459/.test(t);return (r||'?')+(tr?' +RULING 459':'')+' | challenge '+b.payload.challenge_standing;};
(async()=>{const base=mkbase('ex34780_full.json');
 const plant=(edit,keepDrv)=>{const st=Object.assign({},base);st['Close Enforcer Record']=null;st['Judge Contradiction Record']=null;st['Panel Payloads']=J(base['Panel Payloads']);const pp=st['Panel Payloads'][0][0].json;const b=JSON.parse(pp.bodies[1]);let t=b.payload.verdict_raw;t=edit(t,b.payload);b.payload.verdict_raw=t;pp.bodies[1]=JSON.stringify(b);if(!keepDrv)pp.summary[1].drv=[];return st;};
 const toCLB=t=>t.replace(/D1 vs C3 \(Matthew 1:25\): UNDERDETERMINED/,'D1 vs C3 (Matthew 1:25): CHALLENGER LINK BROKEN').replace(/RESULT: UNDERDETERMINED/,'RESULT: DEFENDER WINS');
 const addF=src=>t=>{const i=t.indexOf('D1 vs C3 (Matthew 1:25): CHALLENGER LINK BROKEN');const e=t.indexOf('\n',i);return t.slice(0,e)+'\nFORCED: D1 vs C3 -- MEANS [DR2]: "the knowing was within the espousal" -- ANSWER ['+src+']: "I grant the abstinence is bounded" -- FAILS: "till"'+t.slice(e);};

 const F=(line)=>t=>{const i=t.indexOf('D1 vs C3 (Matthew 1:25): CHALLENGER LINK BROKEN');const e=t.indexOf('\n',i);return t.slice(0,e)+'\n'+line+t.slice(e);};
 const q=' -- MEANS [DR2]: "the knowing was within the espousal" -- ';
 const C=[
  ['P1',t=>F('FORCED (Commitment 5): D1 vs C3'+q+'ANSWER [DR3]: "it fits the link" -- FAILS: "till"')(toCLB(t))],
  ['P2',t=>F('- FORCED: D1 vs C3'+q+'ANSWER [DR3]: "it fits the link" -- FAILS: "till"')(toCLB(t))],
  ['P3',t=>F('FORCED: D1 vs C3'+q+'ANSWER: [DR3] "it fits the link" -- FAILS: "till"')(toCLB(t))],
  ['P4',t=>F('FORCED: D2 vs C3'+q+'ANSWER [DR3]: "it fits the link" -- FAILS: "till"')(toCLB(t))],
  ['P5',t=>{t=toCLB(t).replace(/D2 vs C4 \(Matthew 1:20\): UNDERDETERMINED/,'D2 vs C4 (Matthew 1:20): CHALLENGER LINK BROKEN');const i=t.indexOf('D2 vs C4 (Matthew 1:20): CHALLENGER LINK BROKEN');const e=t.indexOf('\n',i);return t.slice(0,e)+'\nFORCED: D2 vs C4'+q+'ANSWER [DR3]: "it fits" -- FAILS: "of the Holy Ghost"'+t.slice(e);}],
  ['P6',t=>F('FORCED: D1 vs C3'+q+'ANSWER [DR4]: "it fits the link" -- FAILS: "till"')(toCLB(t))],
  ['P7',t=>F('**FORCED:** D1 vs C3'+q+'ANSWER [DR3]: "it fits the link" -- FAILS: "till"')(toCLB(t))],
  ['P8',t=>F('FORCED: D1 vs. C3'+q+'ANSWER [DR3]: "it fits the link" -- FAILS: "till"')(toCLB(t))],
  ['P9',t=>toCLB(t).replace('RESULT: DEFENDER WINS','RESULT: DEFENDER WINS.')]];
 for(const [id,f] of C){const st=plant(f,false);console.log(id,'| live:',res(await run(LV,st),1),'| cand:',res(await run(CD,st),1));}
})();
