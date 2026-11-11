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
const fs=require('fs');process.chdir(__dirname+'/..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
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
 const C=[['a',t=>toCLB(t)],['b',t=>addF('DR3')(toCLB(t))],['c',t=>addF('CR3')(toCLB(t))],['d',t=>toCLB(t).replace('CHALLENGER LINK BROKEN --','CHALLENGER LINK BROKEN -- the defender\'s press is left unanswered by the challenger --')],['e',t=>toCLB(t).replace('RESULT: DEFENDER WINS','RESULT: UNDERDETERMINED')],
  ['f',(t,p)=>{p.challenger_conceded_links=1;p.challenge_standing='PROP-DEPENDENT';return toCLB(t).replace(/CHALLENGER CONCEDED LINKS: 0/,'CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED').replace(/CHALLENGE STANDING: SELF-SUPPORTED -- L=6 c=0/,'CHALLENGE STANDING: PROP-DEPENDENT -- L=6 c=1');}]];
 for(const [id,f] of C){const st=plant(f,false);console.log('T1',id,'| live:',res(await run(LV,st),1),'| cand:',res(await run(CD,st),1));}
 {const st=plant(t=>toCLB(t),true);console.log('T1 g (cure path) | live:',res(await run(LV,st),1),'| cand:',res(await run(CD,st),1));}
 {const st=base;const a=await run(LV,st),b=await run(CD,st);console.log('T1 control 34780 as stored: candidate equals live',T(S(a))===T(S(b)),'| luna',res(b,0));}
 // T2
 let eq=0,df=0,er=0;for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f))){const st=mkbase(f);if(!st['Panel Payloads']||!st['Panel Cure Needed?'])continue;try{const a=await run(LV,st),b=await run(CD,st);if(T(S(a))===T(S(b)))eq++;else{df++;console.log('T2 DIFF',f);}}catch(e){er++;console.log('T2',f,'ERR',e.message.slice(0,80));}}
 for(const r of [...new Set(fs.readdirSync(H.IN).filter(f=>/_Panel_Cure_Check\.json$/.test(f)).map(f=>f.split('_')[0]))].sort()){try{const a=(await H.run(LV('Panel Cure Check'),r,'Panel Cure Needed?',{})).map(x=>x.json),b=(await H.run(CD('Panel Cure Check'),r,'Panel Cure Needed?',{})).map(x=>x.json);if(T(S(a))===T(S(b)))eq++;else{df++;console.log('T2 DIFF in',r,[0,1,2].map(i=>{try{return res(a,i)+' -> '+res(b,i);}catch(e){return '?';}}).join(' ;; '));}}catch(e){er++;console.log('T2 in',r,'ERR',e.message.slice(0,80));}}
 console.log('T2 Panel Cure Check runs: equal',eq,'| differ',df,'| errors',er);})();
