// Worker_A3 cure-code fix harness (BB-7297 item 2). Runs cureRounds, cureQ, cureFound, cureLabel and cureAsk from each node's own source.
const fs=require('fs'),path=require('path');
const cut=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<0)throw new Error('anchor '+a);return s.slice(i,j);};
const load=f=>{const s=fs.readFileSync(f,'utf8');
 const src=cut(s,'const CURE_RULE=','function cureBroken')+cut(s,'function cureRounds','// The rounds that press')+cut(s,'const cureQ=','const CURE_KEY=');
 return new Function(src+';return {cureAsk,cureLabel,cureRounds,cureQ,cureFound};')();};
const U=fs.readFileSync('text2_user.txt','utf8');
const R0=load('base/Cure_Check.js').cureRounds({messages:[{role:'system',content:'x'},{role:'user',content:U}]});
const DR1=load('base/Cure_Check.js').cureRounds({messages:[{role:'user',content:fs.readFileSync('text1_user.txt','utf8')}]}).DR1;
// The judges' quotations as the reports print them, brackets restored ([L1] form) and as printed ((L1) form).
const qDS='Matthew 1:18: the child was "found... of the Holy Ghost" *before* "they came together." [L1] Matthew 1:25: Joseph "knew her not till she had brought forth." Round 2 reduces both to "a state at a time."';
const qDSp=qDS.replace('[L1]','(L1)');
const qSJ="Matthew 1:16: 'Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.' ... The verb becomes passive *egennēthē*, and the relative is feminine singular *ex hēs*, so Mary is the only parent the grammar names.";
const qGR='is the sexual verb of Genesis 4:1 ("Adam **knew** Eve his wife"). The narrator closes the door on Joseph at the conception and the birth.';
const items=[{rule:'K-B',side:'DEFENDER',link:'D1 vs C7',line:'D1 vs C7 (Galatians 4:4): DEFENDER LINK BROKEN -- [L1] ...'},
 {rule:'K-G1',side:'DEFENDER',link:'D2 vs C4',line:'D2 vs C4 (Matthew 1:16): DEFENDER LINK BROKEN -- K-G1 LINE'},
 {rule:'K-G4',side:'DEFENDER',link:'D6 vs C2',line:'D6 vs C2 (Matthew 1:18, 25): DEFENDER LINK BROKEN -- K-G4 LINE'},
 {rule:'K-G3',side:'CHALLENGER',link:null,line:null}];
const broken={DEFENDER:['D2 vs C4','D6 vs C2'],CHALLENGER:['D2 vs C5']};
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('  FAIL',m);}};
for(const dir of process.argv.slice(2)){let f1=0,f2=0,f3=0,n=0;
 for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js')).sort()){n++;const F=load(path.join(dir,f));
  const a=F.cureFound(qDS,R0.DR2),ap=F.cureFound(qDSp,R0.DR2),g=F.cureFound(qGR,R0.DR1)&&F.cureFound(qGR,DR1),s=F.cureFound(qSJ,R0.DR1)||F.cureFound(qSJ,DR1);
  const t=F.cureAsk(items,broken).split('\n');
  const g4=t.find(l=>l.startsWith('K-G4 D6 vs C2: ')),g3=t.find(l=>l.startsWith('K-G3 CHALLENGER: ')),g1=t.find(l=>l.startsWith('K-G1 D2 vs C4: ')),kb=t.find(l=>l.startsWith('D1 vs C7: '));
  const k4=g4==='K-G4 D6 vs C2: D6 vs C2 (Matthew 1:18, 25): DEFENDER LINK BROKEN -- K-G4 LINE';
  const k3=g3==='K-G3 CHALLENGER: CHALLENGER STANDING SELF-SUPPORTED while these CHALLENGER links are graded BROKEN: D2 vs C5';
  const k1=g1==='K-G1 D2 vs C4: D2 vs C4 (Matthew 1:16): DEFENDER LINK BROKEN -- K-G1 LINE';
  const kbok=kb==='D1 vs C7: D1 vs C7 (Galatians 4:4): DEFENDER LINK BROKEN -- [L1] ...';
  if(a)f1++;if(!s&&g)f2++;if(k4&&k3&&k1&&kbok)f3++;
  if(dir.startsWith('new')){ok(a,f+' F1 deepseek quotation found ([L1] form; the report prints brackets as parentheses)');ok(g,f+' grok bold quotation still found');ok(!s,f+' F2 single judge altered quotation not found');ok(k4,f+' F3 K-G4 own line');ok(k3&&k1&&kbok,f+' F3 K-G3/K-G1/K-B unchanged');}}
 console.log(dir,'nodes',n,'| F1 deepseek quote found',f1,'| F2 altered quote refused and grok kept',f2,'| F3 cureAsk right',f3);}
console.log('fail',fail);
