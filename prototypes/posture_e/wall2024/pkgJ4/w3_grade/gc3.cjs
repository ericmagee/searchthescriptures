// W3: where do struck out-of-round rows sit in the saved verdict, live against a candidate (W3_W)?
const {run,store,base}=require('../../pkgGK1/w3_grade/k.cjs');const S=JSON.stringify;const C=process.env.W3_W||'A2';const Q='names the espoused man';
(async()=>{
 const gb=await run(C,'Gate Build','Reread Record',store());const lu=gb.find(x=>x.seat==='luna');
 const old=base['Gate Build'].flat().filter(Boolean).map(x=>x.json).find(x=>x.seat==='luna').items;
 const c0=base['Gate Call openrouter'][0][0].json.choices[0].message.content;const lines=c0.split('\n');
 const rep=lu.items.map(n=>{const o=old.find(z=>z.key===n.key).gid;return lines.find(l=>new RegExp('^\\s*GATE: '+o+' \\|\\|').test(l)).replace('GATE: '+o+' ||','GATE: '+n.gid+' ||');}).join('\n');
 const st=store({'Gate Call openrouter':o=>{o[0][0].json.choices[0].message.content=rep;},'Gate Build':o=>{o.length=0;o.push(gb.map(j=>({json:j})));}});
 const a=(await run('LIVE','Gate Record','Gate Call openrouter',store()))[0],b=(await run(C,'Gate Record','Gate Call openrouter',st))[0];
 const P=g=>{let bd=g.bodies.find(x=>S(x).includes('gpt-6-luna'));if(typeof bd==='string')bd=JSON.parse(bd);let p=bd.payload;if(typeof p==='string')p=JSON.parse(p);return p;};
 const vr=(tag,p)=>{const ls=String(p.verdict_raw).split('\n');console.log(tag,'verdict_raw lines',ls.length,'drv_uncured',p.drv_uncured);
  ls.forEach((l,i)=>{if(l.includes(Q))console.log('   line',i,':',l.slice(0,170));});
  const rows=ls.map((l,i)=>[i,l]).filter(([i,l])=>/^\s*(DEFENDER|CHALLENGER) \| \[?[CD]R\d\]? \|/.test(l));console.log('   out-of-round row lines:',rows.length,'at',rows.map(r=>r[0]).join(','));
  const hd=ls.map((l,i)=>[i,l]).filter(([i,l])=>/OUT-OF-ROUND CONCESSIONS\s*:/.test(l));console.log('   list headers:',hd.map(([i,l])=>i+': '+l.slice(0,90)).join(' ## '));
  const mk=ls.filter(l=>/SEND-BACK APPLIED|E-APPLY/.test(l)&&/espoused|struck|STRUCK|row/.test(l)).map(l=>l.slice(0,230));console.log('   apply marks:',mk.slice(0,3).join(' ## ')||'none');};
 vr('LIVE',P(a));vr(C,P(b));
})();
// second pass: what records a struck row
(async()=>{
 const gb=await run(C,'Gate Build','Reread Record',store());const lu=gb.find(x=>x.seat==='luna');
 const old=base['Gate Build'].flat().filter(Boolean).map(x=>x.json).find(x=>x.seat==='luna').items;
 const c0=base['Gate Call openrouter'][0][0].json.choices[0].message.content;const lines=c0.split('\n');
 const rep=lu.items.map(n=>{const o=old.find(z=>z.key===n.key).gid;return lines.find(l=>new RegExp('^\\s*GATE: '+o+' \\|\\|').test(l)).replace('GATE: '+o+' ||','GATE: '+n.gid+' ||');}).join('\n');
 const st=store({'Gate Call openrouter':o=>{o[0][0].json.choices[0].message.content=rep;},'Gate Build':o=>{o.length=0;o.push(gb.map(j=>({json:j})));}});
 const b=(await run(C,'Gate Record','Gate Call openrouter',st))[0];let bd=b.bodies.find(x=>S(x).includes('gpt-6-luna'));if(typeof bd==='string')bd=JSON.parse(bd);let p=bd.payload;if(typeof p==='string')p=JSON.parse(p);
 const t=String(p.verdict_raw);for(const q of ['S12','STRUCK','struck','SEND-BACK APPLIED','SUPERSEDED LINE','OUT-OF-ROUND']){const n=t.split(q).length-1;const i=t.indexOf(q);console.log('SECOND',JSON.stringify(q),n,i>=0?JSON.stringify(t.slice(Math.max(0,i-120),i+260)):'');}
 const j=JSON.parse(t.split('\n')[0]);console.log('SECOND json keys',Object.keys(j).join(','));const r=String(j.reasoning||'');console.log('SECOND rows in reasoning',r.split('\n').filter(l=>/^\s*(DEFENDER|CHALLENGER) \| /.test(l)).length,'| has row',r.includes(Q));
})();
