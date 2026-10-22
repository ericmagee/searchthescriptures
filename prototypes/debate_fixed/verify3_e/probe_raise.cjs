const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const a=s.indexOf('function drvPromptText(');const b=s.indexOf('function drvCheck(');
const {drvLedger}=new Function(s.slice(a,b)+';return {drvLedger};')();
const P='AGAINST THE DEFENDER, answered in [CR3]:\npremise 1: Luke 1:35 NOT NAMED: Luke 1:35\npremise 2: Matt 1:18 named\npremise 3: Matt 1:25 NOT NAMED: Matt 1:25\nAGAINST THE CHALLENGER, answered in [DR3]:\npremise 1: x named\nA verse marked NOT NAMED is unanswered';
const C={
 'count both':'CONCEDED LINKS: 2 (premise 1 UNEXHIBITED; premise 3 UNEXHIBITED)\nCHALLENGER CONCEDED LINKS: 0',
 'negated':'CONCEDED LINKS: 0 (premise 1 not conceded; premise 3 answered, not conceded)\nCHALLENGER CONCEDED LINKS: 0',
 'word first':'CONCEDED LINKS: 2 (UNEXHIBITED: premise 1, premise 3)\nCHALLENGER CONCEDED LINKS: 0',
 'joint':'CONCEDED LINKS: 2 (premises 1 and 3 UNEXHIBITED)\nCHALLENGER CONCEDED LINKS: 0',
 'zero':'CONCEDED LINKS: 0\nCHALLENGER CONCEDED LINKS: 0',
 'premise 10':'CONCEDED LINKS: 1 (premise 10 CONCEDED)\nCHALLENGER CONCEDED LINKS: 0',
};
for(const [k,t] of Object.entries(C)){const r=drvLedger(t,P,0,0,'SELF-SUPPORTED','SELF-SUPPORTED');console.log(k.padEnd(12),'=>',r.items.map(x=>x.link).join(', ')||'none');}
