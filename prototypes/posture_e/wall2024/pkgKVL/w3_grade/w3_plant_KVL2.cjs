// pkgKVL rev 2 plants: run 33798, terra, E-ANS Job 14:1 [CR3] (flagged answer bare), whole Send Back Record node.
// Base = pkgKDV rev 2 (KBG rev 5 + KDV rev 2, no KVL) against pkgKVL rev 2 built on it. Verse text = the run's Cited Verses (KJV rows).
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
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
const cases=[
 ['B1 Matthew 1:19 with the italic word as served ("a just man")',put('- [L1] "Then Joseph her husband, being a just man, and not willing"'),K('Then Joseph her husband, being a just man, and not willing'),'UNCURED'],
 ['B2 the same with the italic word in brackets',put('- [L1] "Then Joseph her husband, being a just [man], and not willing"'),K('Then Joseph her husband, being a just [man], and not willing'),'UNCURED'],
 ['B3 Galatians 3:29 with curly apostrophes',put('- [L1] “if ye be Christ’s, then are ye Abraham’s seed”'),K('if ye be Christ’s, then are ye Abraham’s seed'),'UNCURED'],
 ['B4 lower case and no punctuation (Matthew 1:18)',put('- "when as his mother mary was espoused to joseph before they came together"'),K('when as his mother mary was espoused to joseph before they came together'),'UNCURED'],
 ['B5 verse words then own words in one quotation',put('- [L4] "before they came together, she was found with child, and so no man begat him"'),K('before they came together, she was found with child, and so no man begat him'),'CURED'],
 ['B6 own paraphrase sharing five verse words in a row',put('- [L4] "she was found with child while only betrothed to Joseph, as I read it"'),K('she was found with child while only betrothed to Joseph, as I read it'),'CURED'],
 ['B7 own sentence in quotes, ordinary words',put('- [L4] "The verse names the husband and it names no begetter at all."'),K('The verse names the husband and it names no begetter at all.'),'CURED'],
 ['B8 words of the translators note only ("that is, Saviour, Heb" is not long enough; Genesis 4:25 note)',put('- [L4] "Seth: Heb. Sheth: that is Appointed, or, Put"'),K('Seth: Heb. Sheth: that is Appointed, or, Put'),'CURED'],
 ['B9 verse quotation, then an own sentence on the next line; KEEP quotes the own sentence',put('- [L1] "before they came together, she was found with child of the Holy Ghost"','This places the conceiving before any act of the husband.'),K('This places the conceiving before any act of the husband.'),'CURED'],
 ['B10 two verse quotations on one line joined by own words; KEEP quotes the joining words with one',put('- "she was found with child of the Holy Ghost" shows the cause, as "that which is conceived in her is of the Holy Ghost" also does'),K('shows the cause, as'),'UNCURED']];
(async()=>{let w=0;for(const [nm,R,line,want] of cases){const k=await row(PK,R,line),l=await row(BS,R,line);if(k.cure_status!==want)w++;console.log((k.cure_status===want?'ok   ':'DIFF ')+nm+' | want '+want+' | base '+l.cure_status+' | KVL2 '+k.cure_status+' | '+cr(k).slice(30));}
 const fn=n=>{const s=code(PK,n);const i=s.indexOf('const __VR=');return s.slice(i,s.indexOf('/* pkgKVL rev 2',i));};console.log('same __vq text in the 3 nodes: '+['Alt Send Back Record','R2 Alt Send Back Record'].every(n=>fn(n)===fn('Send Back Record')&&fn(n).length>100));console.log(w+' of '+cases.length+' differ from what W3 expects');})();
