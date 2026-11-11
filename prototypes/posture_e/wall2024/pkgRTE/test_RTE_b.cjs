// pkgRTE builder's test, part b (W3): (1) what differs in Send Back Build on stored 34726; (2) the reasoned retraction gives the same gate output as the bare form gives on live.
const fs=require('fs');process.chdir(__dirname+'/..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=wf(W+'fetchback_live_s116.json'),B=wf(W+(process.argv[2]||'parent_s116_RTE.json'));
const load=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);const c={};return n=>c[n]||(c[n]=rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode));};const LIVE=load(A),CAND=load(B);
const mkbase=f=>{const ex=JSON.parse(fs.readFileSync(W+f,'utf8'));const r=(ex.data||ex).resultData.runData;const base={};for(const [n,runs] of Object.entries(r)){const last=runs[runs.length-1];base[n]=(last&&last.data&&last.data.main)||null;}return base;};
const J=o=>JSON.parse(S(o));const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});const T=s=>s.replace(/"at":"[^"]+"/g,'"at":0');
const run=async(src,node,inp,st)=>(await H.run(src(node),'x',inp,mk(st))).map(x=>x.json);
(async()=>{
 const b0=mkbase('ex34726_full.json');const a=await run(LIVE,'Send Back Build','Judge Enforcer Record',b0),b=await run(CAND,'Send Back Build','Judge Enforcer Record',b0);
 const ns=x=>(x.find(z=>z.sb_not_sent)||{}).sb_not_sent||[];console.log('34726 not_sent live',ns(a).length,S(ns(a).map(z=>z.seat+' '+z.item)),'cand',ns(b).length,S(ns(b).map(z=>z.seat+' '+z.item)));
 const key=i=>i.rule+'|'+i.item+'|'+String(i.line||i.flagged_line||'');for(const x of a){const y=b.find(z=>z.seat===x.seat)||{};const li=x.items||[],ci=y.items||[];console.log('34726',x.seat,'items live',li.length,'cand',ci.length);li.filter(i=>!ci.some(j=>key(j)===key(i))).forEach(i=>console.log('   GONE:',key(i).slice(0,330)));}
 console.log('34726 confirmed:',S((b0['Close Enforcer Record'][0][0].json.cec.confirmed||[]).map(y=>y.side+' '+y.link)),S((b0['Judge Contradiction Record'][0][0].json.jcc.confirmed||[]).map(y=>y.side+' '+y.link)));
 const base=mkbase('ex34780_full.json');const store=to=>{const o=Object.assign({},base);o['Send Back Record']=J(base['Send Back Record']);const it=o['Send Back Record'][0][0].json.sb_items;const x=it.find(z=>z.seat==='sol'&&z.sid==='S4');x.to=to;const y=it.find(z=>z.seat==='sol'&&z.sid==='S5');y.ans='KEEP';y.to='';return o;};
 const lb=await run(LIVE,'Gate Build','Reread Record',store('RETRACTED: D1 vs C3'));
 for(const to of ['RETRACTED: D1 vs C3 -- the meaning-based forced-link ruling is withdrawn (Commitments 3 and 13).','RETRACTED: D1 vs C3 — withdrawn','retracted: d1 vs c3 -- withdrawn']){const cb=await run(CAND,'Gate Build','Reread Record',store(to));const strip=arr=>S(arr.map(s=>({seat:s.seat,items:(s.items||[]).map(i=>({k:i.kind,s:i.src,w:i.why})),F:s.F})));console.log('T3b',S(to).slice(0,50),'| candidate gate items and text equal live with the bare form:',strip(lb)===strip(cb));}
 const ll=await run(LIVE,'Gate Build','Reread Record',store('retracted: d1 vs c3'));console.log('live reads lower-case bare form:',!(ll.find(z=>z.seat==='sol').items||[]).some(i=>/S4/.test(i.src||'')));
})();
