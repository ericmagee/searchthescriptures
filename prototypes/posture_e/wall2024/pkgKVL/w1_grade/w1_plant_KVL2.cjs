// W1 grade of pkgKVL rev 2 (commit 48d8f49): run 33798, terra, E-ANS Job 14:1 [CR3], whole Send Back Record node; base pkgKDV/parent_s98_KDV2.json, candidate parent_s98_KVL2.json; verses the run serves (Cited Verses).
// Planted verse 1 Samuel 1:20 (not in the stored rounds). Source line in DR2 (other side) in several reference forms; the answering side quotes the verse
// words with no reference in CR4 in four formatted forms; the KEEP quotes them. Plus ordinary-phrase fragments and a debater sentence after a verse label.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g('pkgKDV/parent_s98_KDV2.json'),PK=g('pkgKVL/parent_s98_KVL2.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const pcn=R=>{const m=cl(PCN);m.forEach(a=>a&&a.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\\nSENDBACK: S4');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const row=async(W,R,line)=>{const o=await H.run(code(W,'Send Back Record'),RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)});return o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));};
const add=(o)=>{const R=Object.assign({},R0);for(const k in o)R[k]=R[k]+'\n'+o[k];return R;};
const K=q=>'SENDBACK: S3 || KEEP || [CR4] gives "'+q+'"';let ok=0,bad=0,miss=[];
const Q='The Holy Ghost shall come upon thee';
const C=[
 ['F1 Luke 1:35 words, bullet + layer tag',{CR4:'- [L1] "'+Q+'"'},Q,'UNCURED'],
 ['F2 bold quoted line',{CR4:'**"'+Q+'"**'},Q,'UNCURED'],
 ['F3 block quote',{CR4:'> "'+Q+'"'},Q,'UNCURED'],
 ['F4 numbered, curly quotes',{CR4:'2. “'+Q+'”'},Q,'UNCURED'],
 ['F5 lower case and a comma added',{CR4:'- [L1] "the Holy Ghost, shall come upon thee"'},'the Holy Ghost, shall come upon thee','UNCURED'],
 ['B1 Job 14:1 quoted with its italic words, brackets dropped',{CR4:'- [L1] "Man that is born of a woman is of few days"'},'Man that is born of a woman is of few days','UNCURED'],
 ['B2 Job 14:1 with the italic words left out (wording differs: limit)',{CR4:'- [L1] "Man born of a woman, of few days"'},'Man born of a woman, of few days','CURED'],
 ['X1 a quotation crossing Luke 1:34 and 1:35 (limit)',{CR4:'- [L1] "seeing I know not a man? And the angel answered"'},'seeing I know not a man? And the angel answered','CURED'],
 ['D1 verse words plus own words in one span',{CR4:'- [L4] "The Holy Ghost shall come upon thee, so no man begat"'},'The Holy Ghost shall come upon thee, so no man begat','CURED'],
 ['D2 own claim beside a reference, repeated with none (W1 P1 form)',{CR2:'- **Luke 1:34:** "I hold her question shows she knew no man then."',CR4:'- [L4] "I hold her question shows she knew no man then."'},'I hold her question shows she knew no man then.','CURED'],
 ['D3 own claim in parentheses form beside a reference',{CR2:'"Joseph is the husband and not the begetter" (Matthew 1:16)',CR4:'- [L4] "Joseph is the husband and not the begetter"'},'Joseph is the husband and not the begetter','CURED'],
 ['D4 5-word KJV fragment (under 6; the KEEP quotes under 6 words, so live reads it UNCURED too)',{CR4:'- [L1] "shall come upon thee, and"'},'shall come upon thee, and','UNCURED'],
 ['V1 verse the run does not serve (1 Samuel 1:20; limit)',{CR4:'- [L1] "after Hannah had conceived, that she bare a son"'},'after Hannah had conceived, that she bare a son','CURED'],
 ['V2 Luke 1:35 words on a line that names a reference (pkgKVQ, unchanged)',{CR4:'- [L1] Luke 1:35: "'+Q+'"'},Q,'UNCURED']];
(async()=>{const out=[];for(const [nm,o,q,want] of C){const R=add(o);const l=await row(BS,R,K(q)),k=await row(PK,R,K(q));const good=k.cure_status===want;if(good)ok++;else{bad++;miss.push(nm);}
 const cr=r=>{const s=String(r.cure_reason);const i=s.indexOf('CURE (');return s.slice(i+31,i+170);};
 console.log((good?'OK   ':'MISS ')+nm+' | want '+want+' | base '+l.cure_status+' | KVL2 '+k.cure_status+' | '+cr(k));out.push(k);}
 console.log(ok+' as wanted, '+bad+' not: '+miss.join('; '));fs.writeFileSync(__dirname+'/w1_rows2.json',JSON.stringify(out.slice(0,2).map(r=>({...r,run_token:'W1-ROLLBACK-TEST-KVL2'}))));})();
