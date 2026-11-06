// pkgGL test (W3 2341). Run from wall2024/ after the build: node pkgGL/test_GL.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgGL/plan_GL.json'));
T('6 nodes: base (pkgKS) and final shas match the plan',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgKS/patched/'+n.file))===n.base_sha&&sha(rd('pkgGL/patched/'+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgGL/patched/'+n.file));return true;}catch(e){console.log('   '+e.message);return false;}}));
T('only LIVE K re-read items are attributed (a new TRIAL item stays record-only)',plan.nodes.every(n=>rd('pkgGL/patched/'+n.file).includes("z.src==='K re-read'&&z.live")));
T('Gate Record and Alt Gate Record name the change that raised a new item in the E-GATE NEW row',['Gate_Record','Alt_Gate_Record'].every(n=>rd('pkgGL/patched/'+n+'.js').split("raised by the gate change of '+f.by+'").length===3));
const mk=(file)=>{const AM=rd(file);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateCure2024,gateItems2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw new Error('offline');},null);};
const O=mk('pkgKS/patched/Alternate_Merge.js'),N=mk('pkgGL/patched/Alternate_Merge.js');const st=r=>r.cured?'CURED':'UNCURED';
const replay=(name,X)=>{let n=0,d=0;const out=[];for(const b of X.bodies){const its=X.sb_items.filter(x=>x.seat===b.seat);const rep=X.gate_replies[b.seat];if(!its.length||!rep)continue;
  const j=X.PB.judges.find(q=>q.seat===b.seat);const PT=N.gatePromptText2024(j.body);const ctx={R:N.ciRounds(PT),DL:N.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const G=O.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx).items;const ca=O.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx),cb=N.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx);
  ca.res.forEach((r,i)=>{n++;const s=cb.res[i];const t=name+' '+b.seat+' '+r.gid+' '+r.kind+': pkgKS '+st(r)+', pkgGL '+st(s);if(r.cured!==s.cured||r.why!==s.why){d++;out.push({t:t+' -- '+s.why,seat:b.seat,gid:r.gid,a:r,b:s});}});
  out.push({t:'   '+name+' '+b.seat+': counted pkgKS '+ca.uncured+', pkgGL '+cb.uncured+'; new items after the gate on pkgGL: '+(cb.fresh.map(f=>f.kind+' ('+f.src+')'+(f.by?' by '+f.by:' record-only')).join('; ')||'none'),info:true,seat:b.seat,ca,cb});}
 return {n,d,out};};
// 33020 (execution data): grok G2 now UNCURED; every other gate item unchanged
{const r=replay('33020',JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json')));r.out.forEach(x=>console.log('   '+x.t));
 const ch=r.out.filter(x=>!x.info);
 T('33020: exactly one gate decision changes, grok G2 CURED -> UNCURED, naming the new K-G4',ch.length===1&&ch[0].seat==='grok'&&ch[0].gid==='G2'&&ch[0].a.cured&&!ch[0].b.cured&&/K-G4/.test(ch[0].b.why));
 const g=r.out.find(x=>x.info&&x.seat==='grok');T('33020 grok: counted 0 -> 1 (once), and the new K-G4 row names G2',g.ca.uncured===0&&g.cb.uncured===1&&g.cb.fresh.length===1&&g.cb.fresh[0].by==='G2');
 T('33020: the other '+(r.n-1)+' gate items are unchanged (cure and reason)',r.n===5&&r.d===1);}
// 32998 (fixture): unchanged
{const FX=JSON.parse(rd('pkgGD/fixture_32998.json'));let n=0,d=0;for(const X of [FX,FX.alt]){const r=replay('32998',X);n+=r.n;d+=r.d;r.out.filter(x=>!x.info).forEach(x=>console.log('   CHANGE '+x.t));}
 T('32998: all '+n+' gate items on pkgKS keep the same decision on pkgGL (live had 8 on pkgG4W; pkgGD/pkgKS raise 5 here)',n===5&&d===0);}
console.log('33006: the execution kept no gate data (crashed). Its log has no "NEW RULE" row after the gate (only NEW CONTRADICTION and NEW NOT APPLIED rows, which are not K re-read items), so pkgGL changes no 33006 decision. 33014 raised no gate item.');
console.log('\n'+ok+' OK, '+bad+' FAIL');
