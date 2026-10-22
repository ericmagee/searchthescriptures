const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const a=s.indexOf('function drvPromptText(');const b=s.indexOf('function drvCheck(');
const {drvLedger}=new Function(s.slice(a,b)+';return {drvLedger};')();
const P='AGAINST THE DEFENDER, answered in [CR3]:\npremise 1: Luke 1:35 NOT NAMED: Luke 1:35\npremise 2: Matt 1:18 named\npremise 3: Matt 1:25 NOT NAMED: Matt 1:25\nAGAINST THE CHALLENGER, answered in [DR3]:\npremise 1: x named\nA verse marked NOT NAMED is unanswered';
const C={
 'E1 count both':['CONCEDED LINKS: 2 (premise 1 UNEXHIBITED; premise 3 UNEXHIBITED)','none'],
 'E2 negated':['CONCEDED LINKS: 0 (premise 1 not conceded; premise 3 answered, not conceded)','1, 3'],
 'E3 word first':['CONCEDED LINKS: 2 (UNEXHIBITED: premise 1, premise 3)','none'],
 'E4 joint':['CONCEDED LINKS: 2 (premises 1 and 3 UNEXHIBITED)','none'],
 'E5 zero':['CONCEDED LINKS: 0','1, 3'],
 'E6 premise 10':['CONCEDED LINKS: 1 (premise 10 CONCEDED)','1, 3'],
 'E7 prompt tag x2':['CONCEDED LINKS: 2 -- premise 1 UNEXHIBITED (no footing offered), premise 3 UNEXHIBITED (no footing offered)','none'],
 'E8 tag then conceded':['CONCEDED LINKS: 2 -- Premise 1 UNEXHIBITED (no footing offered) and Premise 3 CONCEDED (stated)','none'],
 'E9 except':['CONCEDED LINKS: 1 -- no premise was conceded except premise 1, which is UNEXHIBITED','3'],
 'E10 grok style':['CONCEDED LINKS: 2 -- Premise 1 UNEXHIBITED (no footing offered): [DR2] pressed "Every row (2 Samuel 7:12; Psalm 132:11) stops" and [CR3] never names Psalms 132:11. Premise 3 UNEXHIBITED (no footing offered): [CR3] never names Matthew 1:3.','none'],
 'E11 never then word':['CONCEDED LINKS: 2 -- [CR3] never names Psalms 132:11, so premise 1 is UNEXHIBITED; premise 3 UNEXHIBITED','none'],
 'E12 LINK3 nospace':['CONCEDED LINKS: 2 -- LINK1 UNEXHIBITED; LINK3 CONCEDED','none'],
};
let bad=0;for(const [k,[t,exp]] of Object.entries(C)){const r=drvLedger(t+'\nCHALLENGER CONCEDED LINKS: 0',P,0,0,'SELF-SUPPORTED','SELF-SUPPORTED');const got=r.items.map(x=>x.link.replace('DEFENDER premise ','')).join(', ')||'none';const ok=got===exp;bad+=!ok;console.log((ok?'ok  ':'FAIL'),k.padEnd(22),'got',got.padEnd(6),'want',exp);}
console.log(process.argv[2],'fails',bad);
