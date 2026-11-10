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
 ['A1 own sentence between two quotations, the first ending in a reference (W1 fault form)',{CR2:'"Zacharias is asked for the name in Luke 1:62." The custom of the eighth day names the father, I say. "So also here."',CR4:'- [L4] "The custom of the eighth day names the father, I say."'},'The custom of the eighth day names the father, I say.','CURED'],
 ['A2 own claim in quotes with a reference in parentheses after it',{CR2:'"Joseph is the husband and not the begetter of the child" (Matthew 1:16)',CR4:'- [L4] "Joseph is the husband and not the begetter of the child"'},'Joseph is the husband and not the begetter of the child','CURED'],
 ['A3 the other side own claim after a verse label, this side repeats it in quotes',{DR2:'**Luke 2:48:** "Mary calls Joseph his father before the doctors in the temple."',CR4:'- [L4] "Mary calls Joseph his father before the doctors" and I answer it is the title of the house.'},'Mary calls Joseph his father before the doctors','CURED'],
 ['A4 verse run that is also an ordinary phrase (Luke 2:1)',{DR2:'Luke 2:1: "And it came to pass in those days, that there went out a decree from Caesar Augustus, that all the world should be taxed."',CR4:'- [L4] "it came to pass in those days" that Joseph went up, as I read it'},'it came to pass in those days','UNCURED'],
 ['A5 the same phrase inside the side own longer quoted sentence',{DR2:'Luke 2:1: "And it came to pass in those days, that there went out a decree from Caesar Augustus, that all the world should be taxed."',CR4:'- [L4] "it came to pass in those days that Joseph went up as head of his house"'},'it came to pass in those days that Joseph went up as head of his house','CURED'],
 ['A6 verse in bold-italic with curly quotes, no reference, source in parentheses form',{DR2:'"'+V+'" (1 Samuel 1:20, KJV)',CR4:'- ***“'+Q+'”***'},Q,'UNCURED'],
 ['A7 verse words in a table-style line with a tag and a dash',{DR2:'1 Samuel 1:20: "'+V+'"',CR4:'| L1 | "'+Q+'" | SUPPORTS D2 |'},Q,'UNCURED']];
(async()=>{const out=[];for(const [nm,o,q,want] of C){const R=add(o);const l=await row(BS,R,K(q)),k=await row(PK,R,K(q));const good=k.cure_status===want;if(good)ok++;else{bad++;miss.push(nm);}
 const cr=r=>{const s=String(r.cure_reason);const i=s.indexOf('CURE (');return s.slice(i+31,i+170);};
 console.log((good?'OK   ':'MISS ')+nm+' | want '+want+' | base '+l.cure_status+' | KVL '+k.cure_status+' | '+cr(k));out.push(k);}
 console.log(ok+' as wanted, '+bad+' not: '+miss.join('; '));fs.writeFileSync(__dirname+'/w3_rows.json',JSON.stringify(out.slice(0,2).map(r=>({...r,run_token:'W3-ROLLBACK-TEST-KVL'}))));})();
