// W2 regrade plants for pkgKBG rev 4: grants planted in CR3 in each opening-markup form; KVQ base against KBG rev 2: run 33798, terra, E-ANS Job 14:1 [CR3] (flagged answer bare: "I grant it is said of all men."), whole Send Back Record node.
// Base = pkgKVQ on s94 (pkgKBG/base_s94_KVQ.json) against pkgKBG/parent_s94_KBG.json. Aimed at over-cutting: real answers next to bare sentences must stay CURED.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g('/mnt/project-files/wall2024/fetchback_live_s98.json'),PK=g('pkgKBG/parent_s98_KBG4.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
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
 const AT='## LINK 4: SUPPORTED';if(!R0.CR3.includes(AT))throw new Error('anchor');const put=l=>Object.assign({},R0,{CR3:R0.CR3.replace(AT,l+'\n\n'+AT)});
 const G='I grant the name stands written in the register of Nazareth.';const Q='SENDBACK: S3 || KEEP || [CR3] says "the name stands written in the register of Nazareth."';
 const cases=[
  ['F1 bullet',put('- '+G),Q,'CURED','UNCURED'],
  ['F3 bold label',put('- **Luke 3:23.** '+G),Q,'CURED','UNCURED'],
  ['F4 layer tag',put('- **[L3]** '+G),Q,'CURED','UNCURED'],
  ['F6 verse label',put('Luke 3:23. '+G),Q,'CURED','UNCURED'],
  ['F8 bullet, bold tag and verse label',put('- **[L2] Luke 3:23:** '+G),Q,'CURED','UNCURED'],
  ['C1 bold label + continuation ", and that ..."',put('- **Luke 3:23.** '+G.replace(/\.$/,', and that the register is kept at Nazareth.')),Q,'CURED','UNCURED'],
  ['C2 layer tag + second grant "and I grant ..."',put('- **[L3]** '+G.replace(/\.$/,' and I grant the register is old.')),Q,'CURED','UNCURED'],
  ['C3 verse label + ";" inside parentheses',put('Luke 3:23. '+G.replace(/\.$/,' (Luke 2:4; Luke 3:23).')),Q,'CURED','UNCURED'],
  ['O1 bold label + own clause with a reason',put('- **Luke 3:23.** '+G.replace(/\.$/,', and the begetting is not in the register.')),'SENDBACK: S3 || KEEP || [CR3] says "the name stands written in the register of Nazareth, and the begetting is not in the register."','CURED','CURED'],
  ['O2 KEEP quoting only the own clause of a formatted grant',put('- **[L3]** '+G.replace(/\.$/,', and the begetting is not in the register.')),'SENDBACK: S3 || KEEP || [CR3] says "the begetting is not in the register."','CURED','CURED'],
  ['J1 bullet + ", and I keep my link." (no reason)',put('- '+G.replace(/\.$/,', and I keep my link.')),Q,'CURED','UNCURED'],
  ['J3 bold label + ", and I hold it as written." (stored form, no reason)',put('- **Luke 3:23.** '+G.replace(/\.$/,', and I hold it as written.')),Q,'CURED','UNCURED'],
  ['J4 ", and both support my link." (stored form, no reason)',put('- '+G.replace(/\.$/,', and both support my link.')),Q,'CURED','UNCURED'],
  ['J5 narrowing clause stays CURED: ", and I keep only the legal limb of it."',put('- '+G.replace(/\.$/,', and I keep only the legal limb of it.')),'SENDBACK: S3 || KEEP || [CR3] says "the name stands written in the register of Nazareth, and I keep only the legal limb of it."','CURED','CURED'],
  ['J6 clause with a verse stays CURED: ", and D6 still stands on Luke 1:35."',put('- '+G.replace(/\.$/,', and D6 still stands on Luke 1:35.')),'SENDBACK: S3 || KEEP || [CR3] says "the name stands written in the register of Nazareth, and D6 still stands on Luke 1:35."','CURED','CURED'],
  ['J7 agreeing-verse clause: ", and Matthew 1:20 reflects it." (W1)',put('- **[L3]** '+G.replace(/\.$/,', and Matthew 1:20 reflects it.')),Q,'CURED','UNCURED'],
  ['J8 stated limit: ", and my link is unmoved." stays CURED',put('- '+G.replace(/\.$/,', and my link is unmoved.')),Q,'CURED','CURED'],
  ['J9 position clause with a denial stays CURED: ", and I do not keep the begetting from it."',put('- '+G.replace(/\.$/,', and I do not keep the begetting from it.')),'SENDBACK: S3 || KEEP || [CR3] says "the name stands written in the register of Nazareth, and I do not keep the begetting from it."','CURED','CURED']];
 for(const [nm,R,line,wb,wk] of cases){const l=await row(BS,R,line),k=await row(PK,R,line);out.push(k);console.log('     live '+l.cure_status+' | KBG4 '+k.cure_status+' | '+cr(k));chk(l.cure_status===wb&&k.cure_status===wk,nm+': live '+wb+', KBG4 '+wk+(wk==='UNCURED'?(/pkgKBG/.test(k.cure_reason)?' (pkgKBG reason)':' (other reason)'):''));
  const strip=r=>{const c={...r};delete c.at;delete c.cure_status;delete c.cure_reason;return JSON.stringify(c);};chk(strip(l)===strip(k),nm+': every other field equal');}
 {const o1=await H.run(code(BS,'Send Back Record'),'34108','Send Back Call openrouter'),o2=await H.run(code(PK,'Send Back Record'),'34108','Send Back Call openrouter');const s=o=>JSON.stringify(o[0].json.sb_rows.map(r=>{const c={...r};delete c.at;return c;}));chk(s(o1)===s(o2),'34108 stored send-back rows: all equal to the base ('+o1[0].json.sb_rows.length+' rows)');}
 fs.writeFileSync(__dirname+'/w2_rows.json',JSON.stringify(out.map(r=>({...r,run_token:'W2-ROLLBACK-TEST-KBG4'}))));console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
