// pkgKDV plants (from W2's pkgKBG plants): run 33798, terra, E-ANS Job 14:1 [CR3] (flagged answer bare: "I grant it is said of all men."), whole Send Back Record node.
// Base = pkgKVQ on s94 (pkgKBG/base_s94_KVQ.json) against pkgKBG/parent_s94_KBG.json. Aimed at over-cutting: real answers next to bare sentences must stay CURED.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g(process.env.BASE||'pkgKBG/parent_s94_KBG.json'),PK=g(process.env.CAND||'pkgKDV/parent_s94_KDV.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const cl=x=>JSON.parse(JSON.stringify(x));let ok=0,bad=0;const chk=(c,s)=>{if(c){ok++;console.log('OK   '+s);}else{bad++;console.log('FAIL '+s);}};
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const pcn=R=>{const m=cl(PCN);m.forEach(a=>a&&a.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\\nSENDBACK: S4');if(b<0)throw new Error('no S4 anchor');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const row=async(W,R,line)=>{const o=await H.run(code(W,'Send Back Record'),RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)});return o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));};
const cr=r=>{const s=String(r.cure_reason);const i=s.indexOf('CURE (');return s.slice(i,i+200);};
const SWAP='I grant it. [L2] paralambanō (G3880, "to receive near, associate with oneself") is a different word';if(!R0.CR3.includes(SWAP))throw new Error('anchor');
const R1=Object.assign({},R0,{CR3:R0.CR3.replace(SWAP,'I grant it, for paralambanō (G3880, "to receive near, associate with oneself") is a different word')});
(async()=>{const out=[];
 const cases=[
  ['K1 KEEP quoting only the side deferral "Matthew 17:5 is answered under Luke 9:34"',R0,'SENDBACK: S3 || KEEP || [CR3] says "Matthew 17:5 is answered under Luke 9:34."','CURED','UNCURED'],
  ['K2 KEEP quoting only the side deferral "Isaiah 8:3 is answered with Isaiah 7:14"',R0,'SENDBACK: S3 || KEEP || [CR3]: Isaiah 8:3 is answered with Isaiah 7:14.','CURED','UNCURED'],
  ['K3 the deferral then the side reasoned sentence in one KEEP',R0,'SENDBACK: S3 || KEEP || [CR3]: "Matthew 17:5 is answered under Luke 9:34." and "Presence and sonship stand together in both places."','CURED','CURED'],
  ['K4 reasoned sentence of the side (Luke 9:34 item)',R0,'SENDBACK: S3 || KEEP || [CR3]: "Presence and sonship stand together in both places."','CURED','CURED'],
  ['K5 another bare grant still UNCURED (pkgKBG unchanged)',R0,'SENDBACK: S3 || KEEP || [CR3]: "I grant it states what the Spirit begets in men who are born again."','UNCURED','UNCURED'],
  ['K6 reasoned sentence after "I grant it." still CURED',R0,'SENDBACK: S3 || KEEP || [CR3] says paralambanō "is a different word from synerchomai (G4905, \'to cohabit conjugally\') of 1:18."','CURED','CURED']];
 for(const [nm,R,line,wb,wk] of cases){const l=await row(BS,R,line),k=await row(PK,R,line);out.push(k);console.log('     base '+l.cure_status+' | KDV '+k.cure_status+' | '+cr(k));chk(l.cure_status===wb&&k.cure_status===wk,nm+': base '+wb+', KDV '+wk+(wk==='UNCURED'?(/pkgKBG/.test(k.cure_reason)?' (pkgKBG reason)':' (other reason)'):''));
  const strip=r=>{const c={...r};delete c.at;delete c.cure_status;delete c.cure_reason;return JSON.stringify(c);};chk(strip(l)===strip(k),nm+': every other field equal');}
 {const o1=await H.run(code(BS,'Send Back Record'),'34108','Send Back Call openrouter'),o2=await H.run(code(PK,'Send Back Record'),'34108','Send Back Call openrouter');const s=o=>JSON.stringify(o[0].json.sb_rows.map(r=>{const c={...r};delete c.at;return c;}));chk(s(o1)===s(o2),'34108 stored send-back rows: all equal to the base ('+o1[0].json.sb_rows.length+' rows)');}
 fs.writeFileSync(__dirname+'/w2_rows.json',JSON.stringify(out.map(r=>({...r,run_token:'W2-ROLLBACK-TEST-KDV'}))));console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
