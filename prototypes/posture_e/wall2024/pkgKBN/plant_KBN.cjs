// pkgKBN plants (W2): 33798 terra Job 14:1 [CR3] (bare flagged answer), whole Send Back Record node; live s100 against pkgKBN. From my pkgKBG rev 5 grade plants.
// W2 regrade plants for pkgKBG rev 5: grants planted in CR3 in each opening-markup form; KVQ base against KBG rev 2: run 33798, terra, E-ANS Job 14:1 [CR3] (flagged answer bare: "I grant it is said of all men."), whole Send Back Record node.
// Base = pkgKVQ on s94 (pkgKBG/base_s94_KVQ.json) against pkgKBG/parent_s94_KBG.json. Aimed at over-cutting: real answers next to bare sentences must stay CURED.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s100.json'),PK=g(process.env.CAND||'pkgKBN/parent_s100_KBN.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
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
 // labeled before any run (W2, 2026-11-10): [name, rounds, KEEP line, want live s100, want KBN, reason must match (KBN) or null]
 const cases=[
  ['L1 "On Luke 3:23, I grant ..."',put('- On Luke 3:23, '+G),Q,'CURED','UNCURED',/pkgKBG/],
  ['L2 bold layer tag then "On Luke 3:23, I grant ..."',put('- **[L2]** On Luke 3:23, '+G),Q,'CURED','UNCURED',/pkgKBG/],
  ['L3 "In Luke 3:23, I grant ..."',put('In Luke 3:23, '+G),Q,'CURED','UNCURED',/pkgKBG/],
  ['L4 "As to Luke 3:23, I grant ..."',put('- As to Luke 3:23, '+G),Q,'CURED','UNCURED',/pkgKBG/],
  ['L5 "Regarding Luke 3:23, I grant ..."',put('- Regarding Luke 3:23, '+G),Q,'CURED','UNCURED',/pkgKBG/],
  ['L6 "On Luke 3:23-24, I grant ..." (range)',put('- On Luke 3:23-24, '+G),Q,'CURED','UNCURED',/pkgKBG/],
  ['L7 "On Luke 3:23 I grant ..." (no comma, already stripped)',put('- On Luke 3:23 '+G),Q,'UNCURED','UNCURED',/pkgKBG/],
  ['L8 lead-in with content of its own stays CURED',put('- On Luke 3:23, the name stands written in the register of Nazareth, so the begetting is not there.'),'SENDBACK: S3 || KEEP || [CR3] says "the name stands written in the register of Nazareth, so the begetting is not there."','CURED','CURED',null],
  ['L9 lead-in grant with a reason stays CURED',put('- On Luke 3:23, I grant the name stands written in the register of Nazareth, because the register records legal names.'),'SENDBACK: S3 || KEEP || [CR3] says "the name stands written in the register of Nazareth, because the register records legal names."','CURED','CURED',null],
  ['L10 "For Luke 3:23, see LINK 2." a bare deferral after a lead-in (label corrected after the run: my first label CURED was wrong; the sentence is a bare deferral and live already cuts it)',put('- For Luke 3:23, see LINK 2.'),'SENDBACK: S3 || KEEP || [CR3] says "For Luke 3:23, see LINK 2."','UNCURED','UNCURED',/pkgKBG/],
  ['A1 "I affirm ..." thesis: reading unchanged (UNCURED), reason now names affirmations',put('- I affirm that the name stands written in the register of Nazareth.'),Q,'UNCURED','UNCURED',/bare grant, affirmation or deferral/],
  ['A2 plain grant: reason text also reads "grant, affirmation or deferral"',put('- '+G),Q,'UNCURED','UNCURED',/bare grant, affirmation or deferral/]];

 for(const [nm,R,line,wb,wk,rx] of cases){const l=await row(BS,R,line),k=await row(PK,R,line);out.push(k);console.log('     live '+l.cure_status+' | KBN '+k.cure_status+' | '+cr(k));chk(l.cure_status===wb&&k.cure_status===wk&&(!rx||rx.test(k.cure_reason)),nm+': live '+wb+', KBN '+wk);
  const strip=r=>{const c={...r};delete c.at;delete c.cure_status;delete c.cure_reason;return JSON.stringify(c);};chk(strip(l)===strip(k),nm+': every other field equal');}
 {const o1=await H.run(code(BS,'Send Back Record'),'34108','Send Back Call openrouter'),o2=await H.run(code(PK,'Send Back Record'),'34108','Send Back Call openrouter');const s=o=>JSON.stringify(o[0].json.sb_rows.map(r=>{const c={...r};delete c.at;return c;}));chk(s(o1)===s(o2),'34108 stored send-back rows: all equal to the base ('+o1[0].json.sb_rows.length+' rows)');}
 fs.writeFileSync(__dirname+'/w2_rows_KBN.json',JSON.stringify(out.map(r=>({...r,run_token:'W2-ROLLBACK-TEST-KBN'}))));console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
