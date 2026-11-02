// K-B layer kinds, base reader (live drvKinds) against the new shared reader (drvLayers), on every "D<n> vs C<m> ... LINK BROKEN" line and the line under it
// in the stored judgments of 32293, 32284, 32266 and 32255 (panel rows, removed rows, the single judge).
const fs=require('fs');const L=require('./lib6.cjs');const RL=require('./replay_lib.cjs');
const OB=L.chk('base','Panel Payloads'),NB=L.chk('new','Panel Payloads');let n=0,d=0;
for(const run of ['32293','32284','32266','32255']){const r=RL.run(run);const texts=r.judgments.map(j=>[j.judge_seat,j.verdict_raw]).concat((r.drv_removed||[]).map(x=>[x.seat+' (removed)',x.verdict_raw]),[['single',r.independent_verdict_raw]]);
 for(const [seat,raw] of texts){let t=String(raw||'');const a=t.indexOf('{');if(a>=0&&seat!=='single'){try{const J=RL.judgment(t,true);t=J.text;}catch(e){}}
  const LS=String(t).replace(/\\n/g,'\n').split('\n');LS.forEach((l,i)=>{const u=l.toUpperCase().replace(/[*_`]+/g,'');if(!/^\s*(?:[-•]|\d+[.)])?\s*D\d+\s+VS\.?\s+C\d+/.test(u)||!/LINK BROKEN/.test(u))return;n++;
   const nx=LS[i+1]||'';const ob=[...new Set([...OB.drvKinds(l),...OB.drvKinds(nx)])].sort(),nb=[...new Set([...NB.drvKinds(l),...NB.drvKinds(nx)])].sort();
   if(ob.join()!==nb.join()){d++;console.log(run,seat,'| base',ob.join('+')||'none','-> new',nb.join('+')||'none','|',l.slice(0,300));}});}}
console.log('BROKEN lines read',n,'| kinds differ on',d);
