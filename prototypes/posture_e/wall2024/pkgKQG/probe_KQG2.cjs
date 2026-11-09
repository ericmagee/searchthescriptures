// pkgKQG rev 2 probe (rev 1 cases plus W3 3820 straddle cases): planted KEEP replies through the whole Send Back Record node (run 33798, terra, E-ANS Job 14:1 [CR3]) and run 34108's stored KEEP. Live s90 against parent_s90_KQG.json.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LV=g('/mnt/project-files/wall2024/fetchback_live_s90.json'),PK=g(__dirname+'/parent_s90_KQG2.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
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
  ['1 planted bare rounds, KEEP quoting only the bare grant',R1,'SENDBACK: S3 || KEEP || [CR3] says, "I grant it is said of all men."','CURED','UNCURED'],
  ['2 planted bare rounds, KEEP with no quote',R1,'SENDBACK: S3 || KEEP || The grant is enough.','UNCURED','UNCURED'],
  ['3 stored rounds, KEEP quoting the CR2 fuller answer',R0,'SENDBACK: S3 || KEEP || [CR2] says, "I accept it as a phrase said of all men, and I make no claim from Galatians 4:4 alone."','CURED','CURED'],
  ['4 stored rounds, KEEP quoting the bare grant and then the CR3 Galatians 4:4 answer',R0,'SENDBACK: S3 || KEEP || "I grant it is said of all men." [CR3] also says "I rest on the verb that is the same as Romans 1:3\'s, as above."','CURED','CURED'],
  ['5 stored rounds, KEEP quoting only the bare grant (the fuller answer exists but is not quoted)',R0,'SENDBACK: S3 || KEEP || [CR3] says, "I grant it is said of all men."','CURED','UNCURED'],
  ['7 W3 straddle: grant tail plus next line verse label',R0,'SENDBACK: S3 || KEEP || [CR3] says "said of all men. - **Luke 2:4**".','CURED','UNCURED'],
  ['8 W3 straddle: quoted verse end plus grant head',R0,'SENDBACK: S3 || KEEP || [CR3] says "and full of trouble." I grant it is.','CURED','UNCURED'],
  ['9 bare grant quoted, then six words wholly outside it',R0,'SENDBACK: S3 || KEEP || "I grant it is said of all men." [CR3] also says "I rest on the verb that is the same as Romans 1:3\'s, as above."','CURED','CURED']];
 for(const [nm,R,line,wl,wk] of cases){const l=await row(LV,R,line),k=await row(PK,R,line);console.log('     live '+l.cure_status+' | KQG '+k.cure_status+' | '+cr(k));chk(l.cure_status===wl&&k.cure_status===wk,nm+': live '+wl+', KQG '+wk);
  const strip=r=>{const c={...r};delete c.at;delete c.cure_status;delete c.cure_reason;return JSON.stringify(c);};chk(strip(l)===strip(k),nm+': every other field equal');}
 // 34108 stored: terra KEEP quoting the LINK 4 sentence stays CURED
 {const o1=await H.run(code(LV,'Send Back Record'),'34108','Send Back Call openrouter'),o2=await H.run(code(PK,'Send Back Record'),'34108','Send Back Call openrouter');const f=o=>o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Luke 1:34/.test(r.item));chk(f(o1).cure_status==='CURED'&&f(o2).cure_status==='CURED'&&f(o1).cure_reason===f(o2).cure_reason,'6 34108 terra KEEP quoting CR3 LINK 4 ("i grant the conception is future"): CURED, row byte-equal');}
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
