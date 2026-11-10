// pkgKVL plants: 33798 terra Job 14:1 (bare flagged answer), whole Send Back Record node; live s98 against pkgKVL (and against pkgKVL on pkgKBG rev 3 with KVL_ON=<file>): run 33798, terra, E-ANS Job 14:1 [CR3] (flagged answer bare: "I grant it is said of all men."), whole Send Back Record node.
// Base = pkgKVQ on s94 (pkgKBG/base_s94_KVQ.json) against pkgKBG/parent_s94_KBG.json. Aimed at over-cutting: real answers next to bare sentences must stay CURED.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s98.json'),PK=g(process.env.CAND||'pkgKVL/parent_s98_KVL.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
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
 const put=(k,l,at)=>Object.assign({},R0,{[k]:R0[k].replace(at,l+'\n'+at)});const AT4='- [L4] I grant two objects of one verb.';const AT3='## LINK 4: SUPPORTED';if(!R0.CR4.includes(AT4)||!R0.CR3.includes(AT3))throw new Error('anchor');
 const cases=[
  ['K1 KEEP quoting the Romans 1:3 words that CR4 gives on a line with no reference (stored)',R0,'SENDBACK: S3 || KEEP || [CR4] gives "which was made of the seed of David according to the flesh."','CURED','UNCURED'],
  ['K2 KEEP quoting the side own sentence on the same no-reference passage (stored)',R0,'SENDBACK: S3 || KEEP || [CR4] says "I do not claim a verse that names Mary\'s line."','CURED','CURED'],
  ['K3 own claim in quotes on a no-reference line (planted): not a verse, not cut',put('CR4','- [L4] "the flesh made of the woman is the flesh of the seed"',AT4),'SENDBACK: S3 || KEEP || [CR4] says "the flesh made of the woman is the flesh of the seed."','CURED','CURED'],
  ['K4 verse words plus own words in one quoted span (planted): not cut',put('CR4','- [L4] "made of the seed of David according to the flesh, and so of Mary her line"',AT4),'SENDBACK: S3 || KEEP || [CR4] says "according to the flesh, and so of Mary her line."','CURED','CURED'],
  ['K5 verse quoted with a reference only by the other side, quoted by this side with none (planted)',put('CR3','- [L1] "And declared to be the Son of God with power"',AT3),'SENDBACK: S3 || KEEP || [CR3] gives "And declared to be the Son of God with power."','CURED','UNCURED'],
  ['K6 a 5-word verse fragment on a no-reference line (planted): under 6 words, not cut',put('CR4','- [L1] "the seed of David according" is the flesh named in the row by this round',AT4),'SENDBACK: S3 || KEEP || [CR4]: the seed of David according is the flesh named in the row by this round.','CURED','CURED'],
  ['K7 pkgKVQ case stands: Job 14:1 text on its verse line',R0,'SENDBACK: S3 || KEEP || [CR3] quotes "of few days, and full of trouble."','UNCURED','UNCURED'],
  ['K8 the CR2 fuller answer stays',R0,'SENDBACK: S3 || KEEP || [CR2]: "I accept it as a phrase said of all men, and I make no claim from Galatians 4:4 alone."','CURED','CURED']];
 for(const [nm,R,line,wb,wk] of cases){const l=await row(BS,R,line),k=await row(PK,R,line);out.push(k);console.log('     base '+l.cure_status+' | KVL '+k.cure_status+' | '+cr(k));chk(l.cure_status===wb&&k.cure_status===wk,nm+': base '+wb+', KVL '+wk+(wk==='UNCURED'?(/pkgKVQ\)/.test(k.cure_reason)?' (pkgKVQ reason)':' (other reason)'):''));
  const strip=r=>{const c={...r};delete c.at;delete c.cure_status;delete c.cure_reason;return JSON.stringify(c);};chk(strip(l)===strip(k),nm+': every other field equal');}
 {const o1=await H.run(code(BS,'Send Back Record'),'34108','Send Back Call openrouter'),o2=await H.run(code(PK,'Send Back Record'),'34108','Send Back Call openrouter');const s=o=>JSON.stringify(o[0].json.sb_rows.map(r=>{const c={...r};delete c.at;return c;}));chk(s(o1)===s(o2),'34108 stored send-back rows: all equal to the base ('+o1[0].json.sb_rows.length+' rows)');}
 fs.writeFileSync(__dirname+'/w2_rows.json',JSON.stringify(out.map(r=>({...r,run_token:'W2-ROLLBACK-TEST-KVL'}))));console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
