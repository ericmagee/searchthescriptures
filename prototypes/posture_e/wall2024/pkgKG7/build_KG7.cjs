// pkgKG7 (D40; W3 3093 ruling 3, HIGH; W1 owns, W3 3179): K-G7 offered the CORRECTED COUNT cure for any DEFENDER/CHALLENGER LINK BROKEN line
// not counted, even when the line itself records an answer (33592 grok D2 vs C4 and D5 vs C5: "answered in [CR3]" -- both CURED by
// "counted"). Ruling 421 / E-PREM: a break on an answered witness is one of meaning; it stands only with a FORCED line and is not counted.
// Change (library, every node that carries cureVerdicts):
//  (1) kg7Ans2024(x,R): the K-G4 answered test on the K-G7 line: the line does not say the witness went unanswered (g4Unans2024 false), or it
//      does but a later round of that side names every pressed witness it quotes (kg4Split, unanswered-false).
//  (2) cure: such a K-G7 item is CURED only by a FORCED line for the pair or a RETRACTED line; a count leaves it UNCURED with the reason.
//  (3) kNeed: such a premise is not required in a side's CORRECTED COUNT.
//  (4) rule text (CURE_RULE_G K-G7): states (1)-(2) to the judge.
// Run from wall2024/: node pkgKG7/build_KG7.cjs [base strip] [dest strip] [plan]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_GDA19')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_KG7')+'/patched/',PLAN=process.argv[4]||'pkgKG7/plan_KG7.json';fs.mkdirSync(DST,{recursive:true});
const A0='function kg4Witnesses(';
const FN="/* pkgKG7 (D40, W3 3093 ruling 3): the K-G4 answered test applied to a K-G7 line; a break on an answered witness is one of meaning (ruling 421) and is not cured by a count */\n"
 +"function kg7Ans2024(x,R){try{const line=String((x&&x.line)||'');const side=x&&x.side;if(!line||!CURE_PRESS[side])return null;R=R||{};\n"
 +" if(!g4Unans2024(line))return 'the line records an answer and does not say the witness went unanswered, so the break is one of meaning (ruling 421)';\n"
 +" const hits=[];for(const seg of line.split(/(?=\\[(?:CR|DR)[1-4]\\])/)){const rm=seg.match(/^\\[((?:CR|DR)[1-4])\\]/);if(!rm||!CURE_PRESS[side].includes(rm[1])||typeof R[rm[1]]!=='string')continue;\n"
 +"  for(const m of seg.matchAll(/[\"\\u201c]([^\"\\u201d]{8,})[\"\\u201d]/g))if(cureFoundAll(m[1],R[rm[1]]))hits.push({round:rm[1],q:m[1],line:seg.trim()});}\n"
 +" if(!hits.length)return null;const ks=kg4Split(side,line,hits,R);if(!ks.rests.length||ks.open.length)return null;\n"
 +" return 'unanswered-false: a later '+side.toLowerCase()+' round names every pressed witness the line rests on ('+kg4Txt(ks.answered)+'), so the break is one of meaning (ruling 421)';}catch(e){return null;}}\n";
const A1="  if(x.rule==='K-G7'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));\n   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}";
const B1="  if(x.rule==='K-G7'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));\n"
 +"   {const __a7=kg7Ans2024(x,R);if(__a7){const fz=(typeof KF_LINE==='undefined'||!reply||!reply.ok)?[]:String(cureUnwrap(reply.text)).split('\\n').map(l=>l.trim().replace(/[*_`]+/g,'')).filter(l=>{const m=l.match(KF_LINE);return !!m&&U(m[1].replace(/\\s+vs\\.?\\s+/i,' vs '))===U(x.link)&&(!x.side||(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')===U(x.side));});\n"
 +"    if(fz.length)return res('CURED','forced link: a FORCED line for '+x.link+' (ruling 421); the premise is not counted (pkgKG7)',fz);\n"
 +"    const cs7=o.count.filter(c=>c.side===x.side).map(c=>c.line);return res('UNCURED',__a7+': a count does not cure it; cure it with one FORCED line for '+x.link+', or a RETRACTED line with one CORRECTED RESULT (pkgKG7)',cs7);}}\n"
 +"   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}";
const A2="if(y.rule==='K-G7'&&!wd.has(U(y.link)))";const B2="if(y.rule==='K-G7'&&!wd.has(U(y.link))&&!kg7Ans2024(y,R))";
const A3='is counted. Cure it either by counting it: CORRECTED COUNT ';
const B3='is counted. When your line records an answer to the witness (it does not say the witness went unanswered, or a later round of that side names the pressed witness), the break is one of meaning (ruling 421): the premise is not counted, and the only cures are one FORCED line for the pair or a RETRACTED line with one CORRECTED RESULT. Otherwise cure it either by counting it: CORRECTED COUNT ';
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s0.includes(A1)){for(const a of [A0,A1,A2,A3])if(s0.split(a).length!==2)throw new Error(f+' anchor '+a.slice(0,40)+' x'+(s0.split(a).length-1));
  s=s.replace(A0,()=>FN+A0).replace(A1,()=>B1).replace(A2,()=>B2).replace(A3,()=>B3);new Function('$','$input',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes');
