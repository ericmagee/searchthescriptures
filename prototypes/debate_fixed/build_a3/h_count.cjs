// FALSIFIERS2 harness (Worker_A3, BB-7417/7418): drvLedger cut from a raise node, cureSet cut from a cure node, each from its own source.
// Usage: node h_count.cjs <dir>
const fs=require('fs');const [dir]=process.argv.slice(2);
const s=fs.readFileSync(dir+'/Panel_Payloads.js','utf8');const a=s.indexOf('function drvPromptText(');const b=s.indexOf('function drvCheck(');
const L=new Function(s.slice(a,b)+';return drvLedger;')();
const pl=(n,nn)=>'premise '+n+' (LINK '+n+'): carried; NOT NAMED: '+nn;
const ptext=['AGAINST THE DEFENDER, answered in [CR3]:',pl(1,'Psalm 132:11'),pl(2,'none'),pl(3,'Matthew 1:3'),pl(4,'none'),pl(5,'none'),pl(6,'none'),
 'AGAINST THE CHALLENGER, answered in [DR3]:',pl(1,'none'),pl(2,'none'),'A verse marked NOT NAMED is unanswered by the rule.'].join('\n');
const C={A:'CONCEDED LINKS: 2 -- premises 1 and 3 UNEXHIBITED',B:'CONCEDED LINKS: 2 -- UNEXHIBITED: premise 1, premise 3',C:'CONCEDED LINKS: 0 -- premise 1 not conceded',
 D:'CONCEDED LINKS: 0 -- No challenger-listed premise was CONCEDED (stated) or UNEXHIBITED (no footing offered) in [CR3]; premises 1-6 were all answered with layer footing',
 E:'CONCEDED LINKS: 1 -- premise 1 CONCEDED, premise 3 not conceded',F:'CONCEDED LINKS: 1 -- premise 3 was not answered and is UNEXHIBITED',
 G:'CONCEDED LINKS: 2 -- LINK 1 and LINK 3 UNEXHIBITED',H:'CONCEDED LINKS: 3 -- premises 1-3 UNEXHIBITED',
 O:'CONCEDED LINKS: 2 -- premise 1 UNEXHIBITED (no footing offered), premise 3 UNEXHIBITED (no footing offered)',P:'CONCEDED LINKS: 2 -- premise 1 CONCEDED (stated), premise 3 UNEXHIBITED (no footing offered)',Q:'CONCEDED LINKS: 1 -- premise 1 UNEXHIBITED (no footing offered), premise 3 not conceded',R:'CONCEDED LINKS: 1 -- no premise was conceded except premise 1, which is UNEXHIBITED'};
const X={A:'none',B:'none',C:'premise 1, premise 3',D:'premise 1, premise 3',E:'premise 3',F:'premise 1',G:'none',H:'none',O:'none',P:'none',Q:'premise 3',R:'premise 3'};
let bad=0;
for(const k of Object.keys(C)){const r=L(C[k]+'\nCHALLENGER CONCEDED LINKS: 0',ptext,0,0,'SELF-SUPPORTED','SELF-SUPPORTED');
 const got=r.items.map(x=>x.link.replace('DEFENDER ','')).join(', ')||'none';const ok=got===X[k];if(!ok)bad++;console.log(k,ok?'PASS':'FAIL','got:',got,'| expected:',X[k]);}
const t=fs.readFileSync(dir+'/Panel_Cure_Check.js','utf8');const i=t.indexOf('\nfunction cureCorrected');const ca=t.indexOf('function cureSet(');const cb=t.indexOf('const cureCorrLine=');
const S=new Function(t.slice(0,i)+'\n'+t.slice(ca,cb)+'\n;return cureSet;')();
const it=(rule,link,status,why)=>({rule,side:'DEFENDER',link,status,why});
const R=x=>({ok:true,text:x.join('\n')});
const CS={I:[[it('K-G6','DEFENDER premise 1','CURED','statement quotes the transcript (CR3)'),it('K-G6','DEFENDER premise 3','UNCURED','x')],['CORRECTED COUNT: DEFENDER 0','CORRECTED STANDING: DEFENDER COLLAPSED'],'not written'],
 J:[[it('K-G6','DEFENDER premise 1','CURED','counted: DEFENDER COUNT 2, STANDING PROP-DEPENDENT'),it('K-G6','DEFENDER premise 3','CURED','counted: DEFENDER COUNT 2, STANDING PROP-DEPENDENT')],['CORRECTED COUNT: DEFENDER 2','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'2 PROP-DEPENDENT'],
 K:[[it('K-G6','DEFENDER premise 1','CURED','statement quotes the transcript (CR3)'),it('K-G6','DEFENDER premise 3','CURED','statement quotes the transcript (CR3)')],['CORRECTED COUNT: DEFENDER 0','CORRECTED STANDING: DEFENDER COLLAPSED'],'not written'],
 L:[[it('K-G3',null,'CURED','x')],['CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],'null PROP-DEPENDENT']};
for(const k of Object.keys(CS)){const [v,lines,exp]=CS[k];const r=S(R(lines),v);const got=r&&r.DEFENDER?r.DEFENDER.n+' '+r.DEFENDER.st:'not written';const ok=got===exp;if(!ok)bad++;console.log(k,ok?'PASS':'FAIL','got:',got,'| expected:',exp);}
const d=fs.readFileSync(dir+'/../derive_new.sql','utf8');const n4=(d.match(/inserts the single judge''s tag/g)||[]).length;console.log('4',n4===0?'PASS':'FAIL','"inserts the single judge\'s tag" occurs',n4);if(n4)bad++;
console.log('FAILS',bad);
