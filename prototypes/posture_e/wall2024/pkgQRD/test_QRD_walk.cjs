// pkgQRD rev 3 walk (labels Q8, Q9 in labels_QRD.md). Three judges, defender side, every combination of first questions, faults and second replies.
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const L=Ld('/mnt/project-files/wall2024/fetchback_live_s110.json'),N=Ld('pkgQRD/parent_s110_QRD.json');const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8')).data.resultData.runData;const out=n=>X[n]?X[n][0].data.main[0]:null;
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const fns={};const fn=(w,name)=>{const k=(w===N?'N':'L')+name;return fns[k]||(fns[k]=new AF('$','$input','$json','$execution',code(w,name)));};
const needs={};const nd=(w,name)=>{const k=(w===N?'N':'L')+name;return needs[k]||(needs[k]=RM.needs(code(w,name)));};
async function go(w,name,over,inp){const s=n=>over&&over[n]!==undefined?over[n]:out(n);
 const mk=n=>{const it=s(n);if(!it){const no=()=>{throw new Error('unexecuted '+n);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 return (await fn(w,name)(RM.gate(nd(w,name),mk),$input,inp[0]&&inp[0].json,{id:'34299'})).map(x=>x.json);}
const F=out('Regrade Load')[0].json.f;const sents=t=>String(t).split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.length>30&&!/["“”'‘’\[\]*_]/.test(x)&&!/\d:\d/.test(x));
const c4=sents(F.cr4),c3=sents(F.cr3);const S=c4.find(x=>x.split(' ').length>=16);const w=S.split(' ');const h=Math.floor(w.length/2);
const Xq=S,Yq=w.slice(0,h-1).join(' '),Zq=w.slice(h+1).join(' '),Wq=c4.find(x=>x!==S&&!S.includes(x)),Vq=c4.find(x=>x!==S&&x!==Wq&&!S.includes(x));
const E=c3[0],E2=c3.find(x=>x!==E&&!E.includes(x)&&!x.includes(E)),E3=c3.find(x=>x!==E&&x!==E2);
const CQ=(c,e)=>({round:'CR4',quote:c,earlier_round:'CR3',earlier_quote:e,question:'How do these two passages agree?'});
const OPTS=[];for(const c of [Xq,Yq,Zq,Wq])for(const e of [E,E2])OPTS.push(CQ(c,e));OPTS.push({round:'CR3',quote:E,question:'What does this passage mean here?'});
const NEWQ=CQ(Vq,E3);const BADQ=CQ('words that are not in the closing round at all',E);
const ask=out('QR Ask');const first=ask.map(i=>{const t=i.json.choices[0].message.content;return JSON.parse(t.slice(t.indexOf('{'),t.lastIndexOf('}')+1));});
const rep=o=>({json:{choices:[{message:{content:JSON.stringify(o)}}]}});const BADCH={round:'DR3',quote:'a quotation that does not stand anywhere',question:'What does this mean?'};
const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();const isC=q=>q&&q.earlier_quote;
const same=(p,q)=>isC(p)&&isC(q)&&p.round===q.round&&p.earlier_round===q.earlier_round&&(norm(p.quote).includes(norm(q.quote))||norm(q.quote).includes(norm(p.quote)))&&(norm(p.earlier_quote).includes(norm(q.earlier_quote))||norm(q.earlier_quote).includes(norm(p.earlier_quote)));
let cases=0,fails=[],redirs=0,liveRet=0;
(async()=>{
 // Q8 chain: judge0 X/E, judge1 Y/E2? need 1 repeats 0, 2 repeats 1 but not 0: 0 = (X,E), 1 = (X? ) use 1=(X,E2) (closing X inside X -> repeats 0), 2=(Yq,E3?) must repeat 1 not 0: 2=(Wq,E2) repeats 1 via earlier E2, not 0 (W not in X, E2 not E)
 {const qs=[CQ(Yq,E),CQ(Xq,E),CQ(Zq,E)];const A=qs.map((q,i)=>rep({...first[i],defender:q}));const b=await go(N,'QR Check',{},A);
  const ok=b[1].redirect.defender&&b[1].redirect.defender.of===b[0].seat&&!b[2].redirect.defender&&!b[0].redirect.defender;console.log((ok?'OK   ':'FAIL ')+'Q8 chain: judge 1 redirected against judge 0; judge 2 (repeats judge 1 only) not redirected');if(!ok)fails.push('Q8');}
 {const qs=[CQ(Xq,E),CQ(Wq,E),CQ(Xq,E2)];const A=qs.map((q,i)=>rep({...first[i],defender:q}));const b=await go(N,'QR Check',{},A);const ok=b.every(j=>!j.redirect.defender);console.log((ok?'OK   ':'FAIL ')+'Q10 same round 3 sentence against different closing sentences (and same closing against different round 3 sentences): no judge returned');if(!ok)fails.push('Q10');}
 const idx=[...Array(OPTS.length).keys()];
 for(const a of idx)for(const b2 of idx)for(const c of idx)for(let fm=0;fm<8;fm++){
  const qs=[OPTS[a],OPTS[b2],OPTS[c]];const flt=[fm&1,fm&2,fm&4].map(Boolean);
  const A=qs.map((q,i)=>rep({...first[i],defender:q,challenger:flt[i]?BADCH:first[i].challenger}));
  const chk=await go(N,'QR Check',{},A);const live=await go(L,'QR Check',{},A);if(live.some((j,i)=>j.retry&&!flt[i]))liveRet++;
  const red=chk.map(j=>!!j.redirect.defender);if(red.some(Boolean))redirs++;
  // (iii) counted askers
  const askers=new Set(chk.filter(j=>j.redirect.defender).map(j=>j.redirect.defender.of));
  const ri=red.map((r,i)=>r?i:-1).filter(i=>i>=0);const outs=[0,1,2];const combos=ri.length?outs.flatMap(o=>ri.length>1?outs.map(p=>[o,p]):[[o]]):[[]];
  for(const cmb of combos){cases++;const R=chk.map((j,i)=>{if(!j.retry)return {json:{choices:[{message:{content:'OK'}}]}};const k=ri.indexOf(i);
    const d=k>=0?[BADQ,NEWQ,qs[i]][cmb[k]]:qs[i];return rep({defender:d,challenger:flt[i]?BADCH:first[i].challenger});});
   const fin=await go(N,'QR Final',{'QR Check':chk.map(j=>({json:j}))},R);const rec=fin[0].record.filter(r=>r.side==='defender');
   const finalQ=rec.filter(r=>r.status!=='DROPPED').map(r=>({round:r.round,quote:r.quote,earlier_round:r.earlier_round,earlier_quote:r.earlier_quote,judge:r.judge}));
   const tag='['+[a,b2,c].join(',')+' f'+fm+' o'+cmb.join('')+']';
   qs.forEach((q,i)=>{if(!isC(q))return;if(!finalQ.some(f=>same(f,q)))fails.push(tag+' (i) judge '+i+' pair lost');});
   rec.forEach((r,i)=>{if(r.status==='DROPPED')fails.push(tag+' (ii) '+r.judge+' dropped');});
   for(const s of askers){const r=rec.find(x=>x.judge===s);const i=chk.findIndex(j=>j.seat===s);if(!r||r.quote!==qs[i].quote)fails.push(tag+' (iii) asker '+s+' changed');}}}
 console.log('Q9 walk: '+(OPTS.length**3*8)+' first-question settings, '+cases+' cases with second replies, '+redirs+' settings with a redirect; live returned a judge for a repeat in '+liveRet);
 console.log((fails.length?'FAIL '+fails.length+'\n'+fails.slice(0,20).join('\n'):'ALL OK'));})().catch(e=>{console.log('ERROR '+e.stack);process.exit(1);});
