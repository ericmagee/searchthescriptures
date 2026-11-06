// W3 queue: the corrected text is not checked again. Measure (no build): raise the offline-runnable K rules on the gate text and on the final (corrected) text, list items new in the final text; and raise the line-local rules (K-F on the run rounds, K-CMT per line) on every CHANGE TO payload alone. Run from wall2024/: node corpus/recheck_corrected.cjs (base pkgKCL).
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const s=rd('pkgKCL/patched/Panel_Cure_Check.js');
const M=new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureJText,cureRounds,kfLines,kcmtLines2024,kwLines421,selfLines421,knLines,kkLines,kagLines2024,kconLines2024,rcLines,krLines};')(()=>{throw 0},null);
const T=rd('corpus/texts.jsonl').trim().split('\n').map(JSON.parse);
const raw=(run,seat,src)=>{if(src==='verdict_final'){const J=JSON.parse(rd('corpus/raw/judgments.json'));const j=J.find(j=>String(j.run)===String(run)&&j.seat===seat);return j&&j.verdict_raw;}
 const F=JSON.parse(rd('corpus/fix_'+run+'.json'));const b=[...(F.bodies||[]),...((F.alt&&F.alt.bodies)||[])].find(b=>b.seat===seat);return b&&b.verdict_raw;};
const rounds=(run,seat)=>{try{const F=JSON.parse(rd('corpus/fix_'+run+'.json'));const pool=[...(F.PB.judges||[]),...((F.alt&&F.alt.PB&&F.alt.PB.judges)||[])];const J=pool.find(q=>q.seat===seat)||pool[0];return J?M.cureRounds(J.body):{};}catch(e){return {};}};
const R={};const pairs=[...new Set(T.filter(t=>t.src==='verdict_final').map(t=>t.run+'|'+t.seat))].filter(k=>T.some(t=>t.run+'|'+t.seat===k&&/verdict_gate/.test(t.src)));
const rules={'K-F':(t,Rd)=>M.kfLines(t,Rd).items,'K-CMT':t=>M.kcmtLines2024(t).items,'K-W/K-S3':(t,Rd)=>{try{return M.kwLines421(t,Rd).items||[];}catch(e){return [{rule:'ERR',line:e.message}];}},'self421':t=>{try{return M.selfLines421(t).items||[];}catch(e){return [{rule:'ERR',line:e.message}];}},'K-N':t=>{try{return M.knLines(t).items||[];}catch(e){return [];}},'K-K':t=>{try{return M.kkLines(t).items||[];}catch(e){return [];}},'K-AG':t=>{try{return M.kagLines2024(t).items||[];}catch(e){return [];}},'K-CON':t=>{try{return M.kconLines2024(t,[]).items||[];}catch(e){return [];}},'K-R':(t,Rd)=>{try{return M.krLines(t,Rd).items||[];}catch(e){return [];}}};
const out=[];const SEEN=new Set();let nPairs=0,nChanged=0,nNew=0;const byRule={};
for(const k of pairs){const [run,seat]=k.split('|');const src=T.some(t=>t.run+'|'+t.seat===k&&t.src==='verdict_gate')?'verdict_gate':'alt_verdict_gate';
 const G=M.cureJText(raw(run,seat,src),true),Fi=M.cureJText(raw(run,seat,'verdict_final'),true);if(!G||!Fi)continue;nPairs++;
 const gl=new Set(G.split('\n').map(l=>l.trim()).filter(Boolean));const changed=Fi.split('\n').map(l=>l.trim()).filter(l=>l&&!gl.has(l));nChanged+=changed.length;const ch=new Set(changed);const Rd=rounds(run,seat);
 for(const [r,f] of Object.entries(rules)){const KEY=x=>x.rule+'|'+(x.rule==='K-CMTL'?'':(x.link||''))+'|'+String(x.line||'').replace(/^"/,'').slice(0,120);const a=f(G,Rd).filter(x=>x.rule!=='K-CMT').map(KEY);const A=new Set(a);
  for(const x of f(Fi,Rd)){if(x.rule==='K-CMT')continue;const key=KEY(x);if(A.has(key)||SEEN.has(run+seat+key))continue;SEEN.add(run+seat+key);const onChanged=[...ch].some(l=>String(x.line||'').includes(l.slice(0,60))||l.includes(String(x.line||'').replace(/^"/,'').slice(0,60)));
   nNew++;byRule[x.rule]=(byRule[x.rule]||0)+1;out.push(run+' '+seat+' '+x.rule+' NEW '+(onChanged?'[on a changed line]':'[elsewhere]')+' '+(x.link||'')+' | '+String(x.line||x.why||'').slice(0,180));}}
 out.push('# '+run+' '+seat+': '+changed.length+' changed lines');}
const cov={};for(const k of pairs){const [run,seat]=k.split('|');const src=T.some(t=>t.run+'|'+t.seat===k&&t.src==='verdict_gate')?'verdict_gate':'alt_verdict_gate';const G=M.cureJText(raw(run,seat,src),true);if(!G)continue;for(const [r,f] of Object.entries(rules))for(const x of f(G,rounds(run,seat)))cov[r+':'+x.rule]=(cov[r+':'+x.rule]||0)+1;}console.log('coverage on gate texts',cov);console.log('pairs '+nPairs+', changed lines '+nChanged+', new items '+nNew,byRule);console.log(out.join('\n'));
// where do the CHANGE TO payloads appear: gate text, final text, both?
{const c={gate:0,final:0,both:0,neither:0};const N=x=>String(x||'').replace(/[^a-z0-9]+/gi,' ').toLowerCase().trim();
 for(const t of T.filter(t=>t.src==='change_to')){const k=t.run+'|'+t.seat;if(!pairs.includes(k))continue;const src=T.some(x=>x.run+'|'+x.seat===k&&x.src==='verdict_gate')?'verdict_gate':'alt_verdict_gate';
  const G=N(M.cureJText(raw(t.run,t.seat,src),true)),F=N(M.cureJText(raw(t.run,t.seat,'verdict_final'),true));const q=N(t.jtext).slice(0,80);if(q.length<20)continue;const g=G.includes(q),f=F.includes(q);c[g&&f?'both':g?'gate':f?'final':'neither']++;}
 console.log('CHANGE TO payloads (first 80 normalised chars) found in:',c);}
// every CHANGE TO payload, raised alone by the line-local rules (K-F on the run's rounds, K-CMT per line, K-W)
{const by={};const ex=[];let n=0;for(const t of T.filter(t=>t.src==='change_to')){n++;const Rd=rounds(t.run,t.seat);const L=String(t.jtext);
  const its=[...M.kfLines(L,Rd).items,...M.kcmtLines2024(L).items.filter(x=>x.rule==='K-CMTL')];
  for(const x of its){by[x.rule]=(by[x.rule]||0)+1;ex.push(t.run+' '+t.seat+' '+x.rule+' '+(x.why||'')+' | '+L.slice(0,150));}}
 console.log('CHANGE TO payloads: '+n+'; items raised on the payload alone:',by);console.log(ex.join('\n'));}
