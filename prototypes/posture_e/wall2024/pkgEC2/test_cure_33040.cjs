// The E-ANS / E-PREM LIVE cure reading (pkgEC2/enf428Cure.js) on every 33040 send-back row. Run from wall2024/.
const fs=require('fs');eval(fs.readFileSync('pkgPS/psGrades.js','utf8'));eval(fs.readFileSync('pkgEC2/enf428Cure.js','utf8'));
let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK  ':'FAIL')+' '+n);c?ok++:bad++;};
const AM=fs.readFileSync('pkgPAY/patched/Alternate_Merge.js','utf8');const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gatePromptText2024,ciRounds};')(()=>{throw 0},null);
const X=JSON.parse(fs.readFileSync('corpus/fix_33040.json','utf8'));const RR={};for(const G of [X,X.alt])for(const j of G.PB.judges)RR[j.seat]=L.ciRounds(L.gatePromptText2024(j.body));
const rows=JSON.parse(fs.readFileSync('pkgEC2/sb_33040.json','utf8'));const parse=r=>{const m=r.response_line&&r.response_line.replace(/^"reasoning":\s*"/,'').match(/SENDBACK\s*:?\s*(S\d+)\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);return m?{ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(m[4]||'').trim()}:{ans:'NO ANSWER'};};
const res=rows.map(r=>{const reason=(r.cure_reason.match(/\| ENFORCER: (.*?) \(ruling 428; the judge keeps/)||[])[1]||'';const named=new Set(rows.filter(y=>y.rule==='E-PREM'&&y.seat===r.seat&&y.flagged_line===r.flagged_line).map(y=>+((y.item.match(/(\d+)\s*$/)||[])[1])));
 const c=enf428Cure({rule:r.rule,item:r.item,line:r.flagged_line,reason},parse(r),RR[r.seat],r.rule==='E-PREM'?named:null);return {id:r.id,rule:r.rule,seat:r.seat,...c};});
res.filter(x=>x.status==='UNCURED').forEach(x=>console.log('   UNCURED '+x.id+' '+x.rule+' '+x.seat+': '+x.why));
const U=res.filter(x=>x.status==='UNCURED').map(x=>x.id).sort().join(',');
T('55 send-back rows read (44 E-ANS, 11 E-PREM)',res.length===55&&res.filter(x=>x.rule==='E-ANS').length===44);
T('UNCURED: exactly 7669 (chatgpt Luke 1:27, MEETS on the same bare grant), 7709 and 7710 (grok S18 and S19, refused by the scope check)',U==='7669,7709,7710');
T('every KEEP with a quoted reason cures (sol 7821, 7830 to 7833)',[7821,7830,7831,7832,7833].every(i=>res.find(x=>x.id===i).status==='CURED'));
T('gemini S5 and S6 (one line, premises 2 and 3) cure together',[7690,7691].every(i=>res.find(x=>x.id===i).status==='CURED'));
T('chatgpt 7672 (the answer moved from [CR3] to [CR4], found there) cures, per W3 2446 ruling 3',res.find(x=>x.id===7672).status==='CURED');
// units
{const R={CR3:'I grant the use. The link does not depend on it. The question is "how", and the answer is "the Holy Ghost".',DR3:'Granted: the mother also names.'};const line='ANSWER CHECK: Luke 9:34 -- [CR3] -- MEANS: "x y z" -- ANSWER: "I grant the use." -- MEETS -- r';
 const c=to=>enf428Cure({rule:'E-ANS',line},{ans:'CHANGE',to},R).status;
 T('unit: a MEETS whose answer is not in the named round stays UNCURED',c('ANSWER CHECK: Luke 9:34 -- [CR3] -- MEANS: "x y z" -- ANSWER: "I grant the use, and it fits well." -- MEETS -- r')==='UNCURED');
 T('unit: a MEETS that moves to the other side\'s round stays UNCURED',c('ANSWER CHECK: Luke 9:34 -- [DR3] -- MEANS: "x y z" -- ANSWER: "Granted: the mother also names." -- MEETS -- r')==='UNCURED');
 T('unit: a MEETS with the fuller answer found in the round cures',c('ANSWER CHECK: Luke 9:34 -- [CR3] -- MEANS: "x y z" -- ANSWER: "I grant the use"; "The link does not depend on it." -- MEETS -- r')==='CURED');
 T('unit: a KEEP with no 6 words of the round stays UNCURED; NO ANSWER stays UNCURED',enf428Cure({rule:'E-ANS',line},{ans:'KEEP',why:'the answer is fine as it stands'},R).status==='UNCURED'&&enf428Cure({rule:'E-ANS',line},{ans:'NO ANSWER'},R).status==='UNCURED');}
console.log(ok+' OK, '+bad+' FAIL');
