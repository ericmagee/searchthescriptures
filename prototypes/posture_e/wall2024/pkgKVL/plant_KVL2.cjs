// pkgKVL rev 2 plants: run 33798, terra, E-ANS Job 14:1 [CR3] (flagged answer bare), whole Send Back Record node.
// Base = pkgKDV rev 2 (KBG rev 5 + KDV rev 2, no KVL) against pkgKVL rev 2 built on it. Verse text = the run's Cited Verses (KJV rows).
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g(process.env.BASE||'pkgKDV/parent_s98_KDV2.json'),PK=g(process.env.CAND||'pkgKVL/parent_s98_KVL2.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const cl=x=>JSON.parse(JSON.stringify(x));let ok=0,bad=0;const chk=(c,s)=>{if(c){ok++;console.log('OK   '+s);}else{bad++;console.log('FAIL '+s);}};
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const pcn=R=>{const m=cl(PCN);m.forEach(a=>a&&a.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\\nSENDBACK: S4');if(b<0)throw new Error('no S4 anchor');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const row=async(W,R,line,over)=>{const o=await H.run(code(W,'Send Back Record'),RUN,'Send Back Call openrouter',Object.assign({'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)},over||{}));return o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));};
const cr=r=>{const s=String(r.cure_reason);const i=s.indexOf('CURE (');return s.slice(i,i+170);};
const AT='## LINK 4: SUPPORTED';if(!R0.CR3.includes(AT))throw new Error('anchor');const put=(...l)=>Object.assign({},R0,{CR3:R0.CR3.replace(AT,l.join('\n')+'\n\n'+AT)});
const K=q=>'SENDBACK: S3 || KEEP || [CR3] says "'+q+'"';
const V='the power of the Highest shall overshadow thee',G='Jehoshabeath, the daughter of the king, took',J='Joseph is the husband and not the begetter of the child',P='I hold her question shows she knew no man then.';
const cases=[ // [name, rounds, line, want base, want KVL2, over]
 ['V1 KJV words (Luke 1:35) quoted on a no-reference line: "- [L1] \\"...\\""',put('- [L1] "'+V+'"'),K(V),'CURED','UNCURED'],
 ['V2 block quote',put('> "'+V+'"'),K(V),'CURED','UNCURED'],
 ['V3 bold quoted line',put('**"'+V+'"**'),K(V),'CURED','UNCURED'],
 ['V4 numbered, curly quotes',put('1. “'+V+'”'),K(V),'CURED','UNCURED'],
 ['V5 bullet, bold layer tag',put('- **[L3]** "'+V+'"'),K(V),'CURED','UNCURED'],
 ['V6 KJV words with commas (2 Chronicles 22:11)',put('- [L1] "'+G+'"'),K(G),'CURED','UNCURED'],
 ['V7 W3 A2: own claim in quotes beside a reference, repeated with no reference',put('"'+J+'" (Matthew 1:16)','- [L4] "'+J+'"'),K(J),'CURED','CURED'],
 ['V8 W1 P1: own sentence after a verse label, repeated with no label',put('- **Luke 1:34:** "'+P+'"','- [L2] "'+P+'"'),K(P.replace(/\.$/,'')),'CURED','CURED'],
 ['V9 W3 A3: the other side\'s claim after a verse label, repeated in quotes',put('- [L2] The challenger says "the begetting is by the husband in every line"'),K('the begetting is by the husband in every line'),'CURED','CURED'],
 ['V10 verse words plus own words in one quotation',put('- [L1] "'+V+', and that power is no man"'),K(V+', and that power is no man'),'CURED','CURED'],
 ['V11 W1 scan form: reference ending inside a quotation, then a quoted verse',put('"I grant that pater names a father in Luke 1:62." -- SUPPORTS: C4. Luke 1:62 reads "they made signs to his father"','- [L2] " -- SUPPORTS: C4. Luke 1:62 reads "'),K('-- SUPPORTS: C4. Luke 1:62 reads'),'CURED','CURED'],
 ['V12 KJV words of a verse the run does not serve (1 Samuel 1:20): not cut (limit)',put('- [L1] "that she bare a son, and called his name Samuel"'),K('that she bare a son, and called his name Samuel'),'CURED','CURED'],
 ['V13 no Cited Verses served at all: not cut (limit)',put('- [L1] "'+V+'"'),K(V),'CURED','CURED',{'Cited Verses':null}],
 ['V14 words of a served verse out of order: not cut',put('- [L1] "the Highest shall overshadow the power of thee"'),K('the Highest shall overshadow the power of thee'),'CURED','CURED']];
(async()=>{const out=[];
 for(const [nm,R,line,wb,wk,over] of cases){const l=await row(BS,R,line,over),k=await row(PK,R,line,over);out.push(k);console.log('     base '+l.cure_status+' | KVL2 '+k.cure_status+' | '+cr(k));
  chk(l.cure_status===wb&&k.cure_status===wk,nm+': base '+wb+', KVL2 '+wk);const st=r=>{const c={...r};delete c.at;delete c.cure_status;delete c.cure_reason;return JSON.stringify(c);};chk(st(l)===st(k),nm+': every other field equal');}
 {const o1=await H.run(code(BS,'Send Back Record'),'34108','Send Back Call openrouter'),o2=await H.run(code(PK,'Send Back Record'),'34108','Send Back Call openrouter');const s=o=>JSON.stringify(o[0].json.sb_rows.map(r=>{const c={...r};delete c.at;return c;}));chk(s(o1)===s(o2),'34108 stored send-back rows equal to the base ('+o1[0].json.sb_rows.length+')');}
 fs.writeFileSync(__dirname+'/w2_rows_KVL2.json',JSON.stringify(out.slice(0,1).concat(out.slice(6,7)).map(r=>({...r,run_token:'W2-ROLLBACK-TEST-KVL2'}))));console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
