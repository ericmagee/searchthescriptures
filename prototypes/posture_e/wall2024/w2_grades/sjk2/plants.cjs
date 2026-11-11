// W2 new plants for pkgSJK on 35067 (single judge). Each edit fails loudly if its anchor text is missing.
module.exports=async G=>{
const seen=new Set();const rep=(a,b)=>v=>{if(!v.includes(a))return v;seen.add(a);return v.split(a).join(b);};
const seq=(...f)=>v=>f.reduce((x,g)=>g(x),v);
const K1F='-- DEFENDER CR2 no link heading #1: "',K1R='ITEM: DEFENDER CR2 no link heading #1; RULE: K-W; RESULT: CURED';
const S1F='-- DEFENDER CR4: “I grant the taking is the step that follows the angel’s word.”',S1L='LINE: DEFENDER CR4: “I grant the taking is the step that follows the angel’s word.”';
const P=[
 ['Q0 control: K-W #1 as stored',v=>v,'no link heading #1:','Cured'],
 ['Q0b control: S3 #1 as stored',v=>v,'the step that follows the angel','Cured'],
 ['Q1 K-W item with a colon, flag and report',seq(rep(K1F,'-- DEFENDER CR2: LINK 2 #1: "'),rep(K1R,'ITEM: DEFENDER CR2: LINK 2 #1; RULE: K-W; RESULT: CURED')),'CR2: LINK 2 #1:','Cured'],
 ['Q2 flag #10 cured only as #1 (report #10 set UNCURED)',rep('ITEM: DEFENDER CR3 LINK 1 #10; RULE: K-W; RESULT: CURED','ITEM: DEFENDER CR3 LINK 1 #10; RULE: K-W; RESULT: UNCURED'),'LINK 1 #10:','Review'],
 ['Q3 flag item lower case, report upper',rep(K1F,'-- defender cr2 no link heading #1: "'),'defender cr2 no link heading #1','Cured'],
 ['Q4 S3 flag curly quotes, report straight quotes',rep(S1L,'LINE: DEFENDER CR4: "I grant the taking is the step that follows the angel\'s word."'),'the step that follows the angel','Cured'],
 ['Q5 S3 report names CHALLENGER DR4, flag DEFENDER CR4',rep(S1L,'LINE: CHALLENGER DR4: “I grant the taking is the step that follows the angel’s word.”'),'the step that follows the angel','Review'],
 ['Q6 K-W item with two bracket pairs, flag and report',seq(rep(K1F,'-- DEFENDER CR2 LINK 6 [premise 1] [premise 2] #1: "'),rep(K1R,'ITEM: DEFENDER CR2 LINK 6 [premise 1] [premise 2] #1; RULE: K-W; RESULT: CURED')),'[premise 2] #1:','Cured'], /* probe avoids the harness item split at "] [" */
 ['Q7 LIMIT: K-W report as AUDIT v22 (not read)',v=>{const i=v.indexOf(K1R);if(i<0)return v;seen.add('Q7');const s=v.lastIndexOf('[AUDIT v21: DEBATE RULE VIOLATION REPORT',i);return v.slice(0,s)+'[AUDIT v22'+v.slice(s+10);},'no link heading #1:','Review'],
 ['Q8 K-W report for #1 removed entirely',v=>{const i=v.indexOf(K1R);if(i<0)return v;seen.add('Q8');const s=v.lastIndexOf('[AUDIT v21',i);const e=v.indexOf(']',i);return v.slice(0,s)+v.slice(e+1);},'no link heading #1:','Review'],
 ['Q9 K-W report item without "#N" (ITEM: DEFENDER CR2 no link heading)',rep(K1R,'ITEM: DEFENDER CR2 no link heading; RULE: K-W; RESULT: CURED'),'no link heading #1:','Review'],
 ['Q10 S3 report sentence curly apostrophe dropped, rest equal',rep(S1L,'LINE: DEFENDER CR4: “I grant the taking is the step that follows the angels word.”'),'the step that follows the angel','Cured'],
 ['Q11 S3 report round CR3 vs flag CR4',rep(S1L,'LINE: DEFENDER CR3: “I grant the taking is the step that follows the angel’s word.”'),'the step that follows the angel','Review'],
 ['Q12 K-W report RESULT lower case "cured"',rep(K1R,'ITEM: DEFENDER CR2 no link heading #1; RULE: K-W; RESULT: cured'),'no link heading #1:','Review'],
];
let ok=0;for(const [n,f,p,e] of P){seen.clear();try{if(await G.show(n,f,p,e))ok++;}catch(er){console.log('ERR',n,er.message);}console.log('   anchors applied:',seen.size);}console.log('plants as expected',ok,'of',P.length);};
