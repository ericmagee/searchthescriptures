// BB-8327 step 4 harness: K-C in the patched nodes (d1/new), against the base (../live) and the stored texts (../texts, md5 = database).
const fs=require('fs');const P=__dirname;
const rd=p=>fs.readFileSync(p,'utf8');
const T=f=>rd(P+'/../texts/'+f);
// Load the library of a node up to its first n8n call ($ or $input) for a cure node; for a detection node, from the drv library to drvCheck's end.
function lib(file,names){let s=rd(file);const m=s.search(/\$\(|\$input/);
 if(s.indexOf('function cureVerdicts(')<0){const a=s.search(/\n(?:const DRV_|function drv)/);const e=s.indexOf(' return {items,marks};}',s.indexOf('function drvCheck('))+23;s=s.slice(a,e);}
 else s=s.slice(0,s.lastIndexOf("\n",m));
 return new Function(s+';return {'+names.filter(n=>new RegExp('(?:function|const)\\s+'+n+'\\b').test(s)).join(',')+'};')();}
let n=0,fail=0;const ok=(c,msg)=>{n++;if(!c){fail++;console.log('FAIL',msg);}};
const NEW=lib(P+'/new/Cure_Check.js',['drvCheck','netLines','NET_STATE','drvChains','cureVerdicts','cureAsk','cureReport','cureLines','cureLabel']);
const BASE=lib(P+'/../live/Cure_Check.js',['drvCheck']);
const EIVN=lib(P+'/new/Extract_Independent_Verdict.js',['drvCheck','netLines']);
const EIVB=lib(P+'/../live/Extract_Independent_Verdict.js',['drvCheck']);
const FILES=['837.txt','839.txt','single_29662.txt','834.txt','836.txt','single_29609.txt'];
// 1 K-C items: drvCheck (cure-node copy and EIV copy) equals netLines on every stored text; 27 on these six (the 26 + 837 KEYSTONE).
let kc=0;
for(const f of FILES){const t=T(f);const want=NEW.netLines(t).map(x=>x.item).join('|');
 for(const [nm,L] of [['cure',NEW],['eiv',EIVN]]){const r=L.drvCheck(t,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false);
  const got=r.items.filter(x=>x.rule==='K-C').map(x=>x.link).join('|');ok(got===want,nm+' '+f+' K-C items differ from netLines');
  const mk=r.marks.filter(x=>/\(K-C\) -- /.test(x));ok(mk.length===r.items.filter(x=>x.rule==='K-C').length,nm+' '+f+' one mark per item');
  if(nm==='cure')kc+=mk.length;}
 // 2 no regression: every non-K-C item and mark equals the base, both copies.
 for(const [nm,Nw,B] of [['cure',NEW,BASE],['eiv',EIVN,EIVB]]){const a=Nw.drvCheck(t,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false),b=B.drvCheck(t,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false);
  ok(JSON.stringify(a.items.filter(x=>x.rule!=='K-C'))===JSON.stringify(b.items),nm+' '+f+' non-K-C items changed');
  ok(JSON.stringify(a.marks.filter(x=>!/\(K-C\)/.test(x)))===JSON.stringify(b.marks),nm+' '+f+' non-K-C marks changed');}}
console.log('K-C marks on the six stored texts:',kc,'(26 agreed + 837 KEYSTONE = 27)');ok(kc===27,'K-C count');
// 3 the key contract of BB-8339: A3's __FK (git 9e97822) keys every K-C mark.
const FK=new Function(rd(P+'/ref/a3_d3_new_Build_Save_Body.js').match(/const __FK=x=>\{[\s\S]*?return null;\};/)[0]+';return __FK;')();
for(const f of FILES)for(const m of NEW.drvCheck(T(f),0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false).marks.filter(x=>/\(K-C\)/.test(x)))ok(/^K-C\|/.test(FK(m)||''),'__FK misses '+m.slice(0,90));
// 4 the cure test.
const item=(link,line)=>({rule:'K-C',side:'CHALLENGER',link,line:line||'x'});
const V=(items,reply)=>NEW.cureVerdicts(items,{ok:true,text:reply},{DEFENDER:[],CHALLENGER:[]},{});
let v=V([item('D4 vs C2')],'RESTATED: D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the named-father rows read together are reported speech: [L1] "Thy father and I have sought thee" with [L2] γονεῖς (goneis, G1118), answered in [CR2].\nSTATEMENT: K-C D4 vs C2 | regraded on the chain as a whole.');
ok(v[0].status==='CURED','chain footing, no stating ground: CURED ('+v[0].why+')');
v=V([item('D4 vs C2')],'RESTATED: D4 vs C2 (Luke 2:48): UNDERDETERMINED -- [L1] "Thy father and I have sought thee" with [L2] γονεῖς (G1118); the rows do not state a begetting.');
ok(v[0].status==='UNCURED'&&/keeps the ground/.test(v[0].why),'keeps "do not state": UNCURED');
v=V([item('D4 vs C2')],'RESTATED: D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the rows read together answer the point.');
ok(v[0].status==='UNCURED'&&/no chain footing/.test(v[0].why),'no layers named: UNCURED');
v=V([item('D4 vs C2')],'STATEMENT: K-C D4 vs C2 | the line stands.');ok(v[0].status==='UNCURED','no RESTATED: UNCURED');
v=V([item('REASONING')],'RESTATED: REASONING: Both chains are weighed whole: [L1] "before they came together, she was found with child" and [L2] ἐκ πνεύματος ἁγίου carry the defender, and the challenger rows read together are reputation speech.');
ok(v[0].status==='CURED','REASONING label parsed and CURED ('+v[0].why+')');
v=V([item('KEYSTONE')],'RESTATED: KEYSTONE: D6 -- STANDS -- [L1] Matthew 1:20 with [L2] ek; the seed rows never name Joseph.');ok(v[0].status==='UNCURED','KEYSTONE keeps "never name": UNCURED');
// The stored 29609 single-judge cure of D6 vs C4: CURED under K-S, its restatement keeps "does not by itself name" (A3, BB-8337).
v=V([item('D6 vs C4')],'RESTATED: D6 vs C4 (Acts 2:30): UNDERDETERMINED -- [CR3] Link 1 answered "loins" by [L3] Hebrews 7:10, and [L1] "fruit of his loins" does not by itself name an immediate begetter.');
ok(v[0].status==='UNCURED','29609 D6 vs C4 restatement form: UNCURED under K-C');
// 5 the report: NOT COUNTED on an uncured K-C item; the report keyed by A3's cure-set parse; drv_uncured counts it.
const rep=NEW.cureReport('glm',[{...item('D4 vs C2'),status:'UNCURED',why:'w'},{...item('REASONING'),status:'CURED'}]);
ok(/RULE: K-C; RESULT: UNCURED; NOT COUNTED \(K-C UNCURED\)/.test(rep[0])&&!/NOT COUNTED/.test(rep[1]),'report NOT COUNTED');
const cs=new Set();rep.join('\n').replace(/ITEM: ([^;\]]+); RULE: ([^;\]]+); RESULT: ([A-Z]+)/g,(z,i,r,s)=>{if(s==='CURED')cs.add(r.trim()+'|'+i.trim().toUpperCase());});
ok(cs.has('K-C|REASONING')&&!cs.has('K-C|D4 VS C2'),'cured set from the report');
ok([{status:'UNCURED'},{status:'CURED'}].filter(x=>x.status!=='CURED').length===1,'drv_uncured rule (Panel Cure Check: count of items not CURED)');
// 6 the ask: K-C label, the line and the chain.
const ask=NEW.cureAsk([{...item('D4 vs C2','D4 vs C2: UNDERDETERMINED -- the rows state no begetting.'),chain:'DEFENDER CHAIN (CR1): LINK 1 -- a || CHALLENGER CHAIN (DR1): LINK 1 -- b'}],{DEFENDER:[],CHALLENGER:[]});
ok(/K-C D4 vs C2: D4 vs C2: UNDERDETERMINED/.test(ask)&&/\n  DEFENDER CHAIN \(CR1\)/.test(ask)&&/K-C \(a line that sets aside/.test(ask)&&/that label, a colon/.test(ask),'cure ask carries rule, line, chain and form');
// 7 the chain read from a prompt built from the stored 29662 rounds (git 82023f8 rounds_29662.json; gr = the challenger's rounds).
const R=JSON.parse(rd(P+'/ref/rounds_29662.json'));
// the ledger block is built (its form as drvLedger reads it); the rounds are stored.
const pt='[CR1]\n'+R.cr1+'\n[DR1]\n'+R.gr1+'\n[CR2]\n'+R.cr2+'\n[DR2]\n'+R.gr2+'\n[CR3]\n'+R.cr3+'\n[DR3]\n'+R.dr3+'\nAGAINST THE DEFENDER, answered in [CR3]:\npremise 1 (LINK 2): Joseph\'s fear proves he knew. NOT NAMED: none\nAGAINST THE CHALLENGER, answered in [DR3]:\npremise 1: The sign of Isaiah 7:14 expires in Isaiah\'s day. NOT NAMED: none\npremise 2: Seed out of a man\'s body (2 Samuel 7:12). NOT NAMED: Numbers 1:2\nA verse marked NOT NAMED is unanswered by the rule.';
const ch=NEW.drvChains(pt,{link:'D4 vs C2',side:'CHALLENGER'});console.log('chains on 29662 rounds:',ch.slice(0,400));
ok(/^DEFENDER CHAIN \(DECLARED CHAIN\): LINK 1 -- Matthew 1:16 breaks the "begat" pattern/.test(ch)&&/\|\| CHALLENGER CHAIN \(LEDGER \[DR3\]\): C1 -- The sign of Isaiah 7:14 expires in Isaiah's day\.; C2 -- Seed out of a man's body \(2 Samuel 7:12\)\.$/.test(ch),'both chains quoted on a collision line');
ok(/CHALLENGER CHAIN: not found/.test(NEW.drvChains('[CR1]\nDECLARED CHAIN\n1. a link\n',{link:'D1 vs C1',side:'CHALLENGER'})),'no ledger: said so');
ok(!/ \|\| /.test(NEW.drvChains(pt,{link:'D5',side:'CHALLENGER'})),'one chain on a STANDS line');
console.log(`asserts ${n}, fail ${fail}`);process.exit(fail?1:0);
