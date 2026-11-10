// pkgKVQ probe: KEEP replies through the whole Send Back Record node (run 33798, terra, E-ANS Job 14:1 [CR3]) and run 34108's stored KEEP. Base pkgKQG rev 2 parent against parent_s90_KVQ.json.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LV=g('/mnt/project-files/wall2024/fetchback_live_s93.json'),PK=g(__dirname+'/../parent_s93_KVQ.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const cl=x=>JSON.parse(JSON.stringify(x));let ok=0,bad=0;const chk=(c,s)=>{if(c){ok++;console.log('OK   '+s);}else{bad++;console.log('FAIL '+s);}};
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const R1=Object.assign({},R0,{CR3:R0.CR3.replace(' (Job 14:1)',''),CR4:R0.CR4.split('\n').filter(l=>!/Job 14:1/.test(l)).join('\n')});
const pcn=R=>{const m=cl(PCN);m.forEach(a=>a&&a.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\\nSENDBACK: S4');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const row=async(W,R,line)=>{const o=await H.run(code(W,'Send Back Record'),RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)});return o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));};
const cr=r=>{const s=String(r.cure_reason);const i=s.indexOf('CURE (');return s.slice(i,i+230);};
(async()=>{
 const cases=[
  ['W2-1 KEEP quoting the side own words on a verse line, no quote marks around them',R0,'SENDBACK: S3 || KEEP || [CR3] says, "I rest on the verb that is the same as Romans 1:3\'s, as above."','CURED','CURED'],
  ['W2-2 KEEP quoting Romans 1:3 verse text: also stands unquoted-by-reference in [CR4] lines 133 and 136 (no verse reference on those lines; stated limit), so CURED as live',R0,'SENDBACK: S3 || KEEP || [CR3] quotes "which was made of the seed of David according to the flesh".','CURED','CURED'],
  ['W2-5 KEEP quoting only the Job 14:1 text (row kept for the rolled-back insert)',R0,'SENDBACK: S3 || KEEP || [CR3] quotes "of few days, and full of trouble."','CURED','UNCURED'],
  ['W2-3 KEEP straddling the Job 14:1 quote and the bare grant after it',R0,'SENDBACK: S3 || KEEP || [CR3]: "of few days, and full of trouble. I grant it is said of all men."','CURED','UNCURED'],
  ['W2-4 KEEP quoting the side\'s MEANS sentence with a one-word quote inside it',R0,'SENDBACK: S3 || KEEP || [CR3] says the same verb "made" is said of the woman and of David\'s seed.','CURED','CURED']];
 for(const [nm,R,line,wl,wk] of cases){const l=await row(LV,R,line),k=await row(PK,R,line);(globalThis.__R=globalThis.__R||[]).push(k);console.log('     KQG2 '+l.cure_status+' | KVQ '+k.cure_status+' | '+cr(k));chk(l.cure_status===wl&&k.cure_status===wk,nm+': KQG2 '+wl+', KVQ '+wk);
  const strip=r=>{const c={...r};delete c.at;delete c.cure_status;delete c.cure_reason;return JSON.stringify(c);};chk(strip(l)===strip(k),nm+': every other field equal');}
 // 34108 stored: terra KEEP quoting the LINK 4 sentence stays CURED
 {const o1=await H.run(code(LV,'Send Back Record'),'34108','Send Back Call openrouter'),o2=await H.run(code(PK,'Send Back Record'),'34108','Send Back Call openrouter');const f=o=>o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Luke 1:34/.test(r.item));chk(f(o1).cure_status==='CURED'&&f(o2).cure_status==='CURED'&&f(o1).cure_reason===f(o2).cure_reason,'6 34108 terra KEEP quoting CR3 LINK 4 ("i grant the conception is future"): CURED, row byte-equal');}
 fs.writeFileSync(__dirname+'/w2_rows.json',JSON.stringify(globalThis.__R));console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
