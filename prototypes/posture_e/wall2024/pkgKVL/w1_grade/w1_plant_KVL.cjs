// W1 grade of pkgKVL (commit ddcd7ae9): run 33798, terra, E-ANS Job 14:1 [CR3], whole Send Back Record node; base live s98, candidate parent_s98_KVL.json.
// Planted verse 1 Samuel 1:20 (not in the stored rounds). Source line in DR2 (other side) in several reference forms; the answering side quotes the verse
// words with no reference in CR4 in four formatted forms; the KEEP quotes them. Plus ordinary-phrase fragments and a debater sentence after a verse label.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g('/mnt/project-files/wall2024/fetchback_live_s98.json'),PK=g(process.env.CAND||'pkgKVL/parent_s98_KVL.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const pcn=R=>{const m=cl(PCN);m.forEach(a=>a&&a.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\\nSENDBACK: S4');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const row=async(W,R,line)=>{const o=await H.run(code(W,'Send Back Record'),RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)});return o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));};
if(/Hannah/.test(JSON.stringify(R0)))throw new Error('1 Samuel 1:20 already in rounds');
const V='Wherefore it came to pass, when the time was come about after Hannah had conceived, that she bare a son, and called his name Samuel.';
const Q='after Hannah had conceived, that she bare a son';
const add=(o)=>{const R=Object.assign({},R0);for(const k in o)R[k]=R[k]+'\n'+o[k];return R;};
const K=q=>'SENDBACK: S3 || KEEP || [CR4] gives "'+q+'"';let ok=0,bad=0,miss=[];
const C=[
 // four formatted no-reference forms, source "1 Samuel 1:20: ..."
 ['F1 bullet + layer tag',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 ['F2 bold quoted line',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'**"'+Q+'"**'},Q,'UNCURED'],
 ['F3 block quote',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'> "'+Q+'"'},Q,'UNCURED'],
 ['F4 numbered, curly quotes',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'2. “'+Q+'”'},Q,'UNCURED'],
 // source reference forms
 ['S1 source bold label "- **1 Samuel 1:20** \\"...\\""',{DR2:'- **1 Samuel 1:20** "'+V+'"',CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 ['S2 source "> 1 Samuel 1:20 -- \\"...\\"" (dash)',{DR2:'> 1 Samuel 1:20 — "'+V+'"',CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 ['S3 source "1 Samuel 1:20 (KJV): \\"...\\""',{DR2:'1 Samuel 1:20 (KJV): "'+V+'"',CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 ['S4 source "1 Samuel 1:20 says, \\"...\\""',{DR2:'1 Samuel 1:20 says, "'+V+'"',CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 ['S5 source "\\"...\\" (1 Samuel 1:20)"',{DR2:'"'+V+'" (1 Samuel 1:20)',CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 ['S6 source verse in a ruling-style line "[L1] 1 Samuel 1:20 reads \\"...\\""',{DR2:'- [L1] 1 Samuel 1:20 reads "'+V+'"',CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 // ordinary phrases and controls
 ['O1 6-word verse run that is also ordinary speech ("when the time was come about after")',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'- [L4] "when the time was come about after" is how I read the birth'},'when the time was come about after','UNCURED'],
 ['O2 verse words plus own words in one span',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'- [L4] "after Hannah had conceived, that she bare a son, so Joseph is no begetter"'},'after Hannah had conceived, that she bare a son, so Joseph is no begetter','CURED'],
 ['O3 5-word fragment',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'- [L4] "that she bare a son" holds for Mary too, I say'},'that she bare a son','CURED'],
 ['O4 own 6-word claim that shares words but not order',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'- [L4] "she bare a son after the time was come"'},'she bare a son after the time was come','CURED'],
 ['O5 no source anywhere: verse words with no reference in any round',{CR4:'- [L1] "'+Q+'"'},Q,'CURED'],
 ['P1 debater sentence after a verse label, repeated with no label',{CR2:'- **Luke 1:34:** "I hold her question shows she knew no man then."',CR4:'- [L4] "I hold her question shows she knew no man then."'},'I hold her question shows she knew no man then.','CURED']];
(async()=>{const out=[];for(const [nm,o,q,want] of C){const R=add(o);const l=await row(BS,R,K(q)),k=await row(PK,R,K(q));const good=k.cure_status===want;if(good)ok++;else{bad++;miss.push(nm);}
 const cr=r=>{const s=String(r.cure_reason);const i=s.indexOf('CURE (');return s.slice(i+31,i+170);};
 console.log((good?'OK   ':'MISS ')+nm+' | want '+want+' | base '+l.cure_status+' | KVL '+k.cure_status+' | '+cr(k));out.push(k);}
 console.log(ok+' as wanted, '+bad+' not: '+miss.join('; '));fs.writeFileSync(__dirname+'/w1_rows.json',JSON.stringify(out.slice(0,2).map(r=>({...r,run_token:'W1-ROLLBACK-TEST-KVL'}))));})();
