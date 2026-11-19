// ASK 418 (b): the ASK 374 challenger path with built facts (plan rev 1 (b), W2-C1 form, W2-C2 negatives).
// Usage: node b374.cjs LIVE.json PRE374.json b374_stored.txt
// Each step's code is cut by replay418.cjs from the workflow: step 1 the whole node "Assume Check Build", step 2 the whole node
// "Assume Check Record", step 3 bnsRefuse2024 with bnsFacts2024 and __RL from "Gate Build". Only $() and $input are stubbed.
// The model call between steps 1 and 2 is not made; its reply is built. Stored text: run 39266, challenger round 3 LINK 2 block
// (first 1452 characters, md5 88c2e566920b18f7931a103dda8e76ea, checked by SQL) and the stored text of its defender round 3
// challenger premise 2; the STEP/ASSUMES/ROWS GIVE line is planted in D3 Build's form.
const fs=require('fs');const R=require('./replay418.cjs');
const [LIVE,PRE,STORED]=process.argv.slice(2);const WL=R.ld(LIVE),WP=R.ld(PRE);const dr3=fs.readFileSync(STORED,'utf8').replace(/\n$/,'');
const P2Q='"The text assigns the begetting (gennaō) directly to the Holy Ghost (ek pneumatos estin hagiou), and grounds the resulting holy thing in the overshadowing of power; therefore, the generation in Mary was wrought by the Spirit without a human male begetter, footed on Luke 1:35, Matthew 1:20, and the begetting word gennaō."';
const PW='PRESSED WITH:\nMatthew 1:20 "But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream, saying, Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Ghost." -- MEANS: The row joins the Spirit phrase to the named Davidic husband and wife.';
const CFACT='Mary was a virgin of the tribe of Levi';
const STEP='STEP: the Spirit alone is the begetter -- ASSUMES: '+CFACT+' -- ROWS GIVE: Luke 1:35 "therefore also that holy thing which shall be born of thee shall be called the Son of God." --';
const cr3=(num,label)=>"CHALLENGER'S UNSUPPORTED-L4 PREMISES\n"+num+'. '+(label?'LINK '+label+' -- ':'')+P2Q+'\n'+STEP+'\n'+PW+'\n';
const DFACT='Joseph was of the tribe of Levi';
const gr2D="DEFENDER'S UNSUPPORTED-L4 PREMISES\n3. LINK 4 -- Quote [CR1]: \"Christ had a biological father, Joseph, who knew Mary his wife within the espousal\"\nSTEP: Joseph begat the child -- ASSUMES: "+DFACT+" -- ROWS GIVE: Matthew 1:16 \"And Jacob begat Joseph the husband of Mary\" --\nPRESSED WITH:\nMatthew 1:18 \"before they came together, she was found with child of the Holy Ghost.\"\n";
const line=(side,n,fact,ans,rest)=>'ASSUME-CHECK: '+side+' PREMISE '+n+' -- FACT 1 "'+fact+'" -- '+ans+' -- '+rest;
const NS='no verse words quoted in the block give the fact.';
const ST='Luke 1:35 "that holy thing which shall be born of thee" -- the quoted words give it.';
const S1=(side,n)=>({content:line(side,n,side==='CHALLENGER'?CFACT:DFACT,'NOT STATED',NS)});
const SC=[
 {id:'1 W2-C1 form, BOTH NOT STATED (premise 2)',F:{gr1:'',gr2:'',cr3:cr3(2),dr3},reply:[S1('CHALLENGER',2)],
  want1:{side:'CHALLENGER',n:2,link:2},want2:[{side:'CHALLENGER',n:2,link:2,both_not_stated:true}],
  changes:[['D4 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x',true],['D4 vs C2 (Luke 1:35): CHALLENGER LINK BROKEN -- GROUND: x',false],['D4 vs C2 (Luke 1:35): STANDS -- GROUND: x',false],['FORCED (D4 vs C2): D4 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x',true]]},
 {id:'2 same plant, STATED reply',F:{gr1:'',gr2:'',cr3:cr3(2),dr3},reply:[{content:line('CHALLENGER',2,CFACT,'STATED',ST)}],
  want1:{side:'CHALLENGER',n:2,link:2},want2:[],changes:[['D4 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x',false]]},
 {id:'3 W2-C2 (i): the fact on premise 3',F:{gr1:'',gr2:'',cr3:cr3(3),dr3},reply:[S1('CHALLENGER',3)],
  want1:{side:'CHALLENGER',n:3,link:3},want2:[{side:'CHALLENGER',n:3,link:3,both_not_stated:true}],changes:[['D4 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x',false]]},
 {id:'4 W2-C2 (ii): premise 2 labelled LINK 4',F:{gr1:'',gr2:'',cr3:cr3(2,4),dr3},reply:[S1('CHALLENGER',2)],
  want1:{side:'CHALLENGER',n:2,link:4},want2:[{side:'CHALLENGER',n:2,link:4,both_not_stated:true}],changes:[['D1 vs C2 (Matthew 1:16): DEFENDER LINK BROKEN -- GROUND: x',true],['D4 vs C4 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x',false]]},
 {id:'5 W2-C2 (iii): a defender fact on link 4 beside the challenger fact',F:{gr1:'',gr2:gr2D,cr3:cr3(2),dr3},reply:[S1('DEFENDER',3),S1('CHALLENGER',2)],
  want1:{side:'CHALLENGER',n:2,link:2},want2:[{side:'DEFENDER',n:3,link:4,both_not_stated:true},{side:'CHALLENGER',n:2,link:2,both_not_stated:true}],
  changes:[['D4 vs C2 (Luke 1:35): STANDS -- GROUND: x',true],['D4 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x',true],['D3 vs C2 (Luke 1:35): STANDS -- GROUND: x',false]]}];
const stub1="const __F=row.F;const $=n=>{if(n==='Init Seats')return {first:()=>({json:{run_token:'BUILT-418b'}})};if(n==='Resolve Seats')return {first:()=>({json:{deepseek:{api_model:'built',max_tokens:8000}}})};if(n==='Regrade Load')return {isExecuted:false};if(n==='Final Output')return {first:()=>({json:__F})};throw new Error('step 1 reads '+n);};";
const stub2="const $=n=>{if(n==='Judge Contradiction Record')return {first:()=>({json:{jcr:1}})};if(n==='Assume Check Build')return {first:()=>({json:row.B})};if(n==='Panel Payloads')return {first:()=>({json:{bodies:[]}})};if(n==='Extract Independent Verdict')return {isExecuted:false};throw new Error('step 2 reads '+n);};const $input={first:()=>({json:{choices:[{message:{content:row.reply}}]}})};";
const stub3="const $=n=>{if(n==='Assume Check Record')return {isExecuted:true,first:()=>({json:{acx:{facts:row.facts}}})};throw new Error('step 3 reads '+n);};";
const sp1={cut:[{from:'node:Assume Check Build',whole:'acb'}],stubs:stub1,call:'acb()'},sp2={cut:[{from:'node:Assume Check Record',whole:'acr'}],stubs:stub2,call:'acr()'},sp3={cut:[{from:'node:Gate Build',names:['bnsRefuse2024','bnsFacts2024','__RL']}],stubs:stub3,call:'bnsRefuse2024(row.to)'};
const out=[];const P=s=>out.push(s);P('live '+WL.versionId+' | before ASK 374 '+WP.versionId+' | stored excerpt md5 88c2e566920b18f7931a103dda8e76ea');
const B={};for(const [k,s] of [['1',sp1],['2',sp2],['3',sp3]]){B[k]=R.build(WL,s,'live');B[k].shas.forEach(x=>P('CUT step '+k+' '+x));P('FREE NAMES step '+k+': '+(B[k].free.join(', ')||'none'));}
const B3p=R.build(WP,sp3,'pre-374');B3p.shas.forEach(x=>P('CUT step 3 '+x));
const r1=R.runner(B['1'],3000),r2=R.runner(B['2'],3000),r3=R.runner(B['3'],3000),r3p=R.runner(B3p,3000);let fail=0;const ck=(c,msg)=>{if(!c)fail++;P((c?'  PASS ':'  FAIL ')+msg);};
for(const s of SC){P('== '+s.id);const o1=r1({F:s.F});if(!o1.ok){ck(false,'step 1 '+o1.s);continue;}const j1=o1.v[0].json;
 const cp=(j1.prem||[]).find(p=>p.side==='CHALLENGER');ck(!j1.acx_skip&&cp&&cp.n===s.want1.n&&cp.link===s.want1.link,'step 1 Assume Check Build: CHALLENGER premise n '+(cp&&cp.n)+' link '+(cp&&cp.link)+' ASSUMES "'+(cp&&cp.assumes)+'" | block '+(cp&&cp.block.length)+' chars, quotes '+(cp&&cp.quotes.length)+' | answer round '+(cp&&cp.answer_round)+' | premises '+(j1.prem||[]).length+' | prompt carries it: '+(!!j1.body&&j1.body.messages[1].content.includes('CHALLENGER PREMISE '+s.want1.n)));
 const o2=r2({B:j1,reply:s.reply.map(x=>x.content).join('\n')});if(!o2.ok){ck(false,'step 2 '+o2.s);continue;}const acx=o2.v[0].json.acx;const facts=(acx.facts||[]).filter(f=>f.both_not_stated);
 const got=facts.map(f=>({side:f.side,n:f.n,link:f.link,both_not_stated:f.both_not_stated}));ck(JSON.stringify(got)===JSON.stringify(s.want2),'step 2 Assume Check Record: BOTH NOT STATED facts '+JSON.stringify(got)+' | all facts '+JSON.stringify((acx.facts||[]).map(f=>[f.side,f.n,f.deepseek,f.code])));
 for(const [to,want] of s.changes){const n=r3({facts:acx.facts,to}),p=r3p({facts:acx.facts,to});if(!n.ok){ck(false,'step 3 '+n.s);continue;}const ref=n.v!=null;
  ck(ref===want,'step 3 "'+to.slice(0,60)+'": live '+(ref?'REFUSED: '+String(n.v).slice(0,150):'applied')+' (want '+(want?'REFUSED':'applied')+') | before 374: '+(p.ok?(p.v!=null?'REFUSED':'applied'):p.s));}}
P('RESULT: '+(fail?'FAIL ('+fail+')':'PASS'));fs.writeFileSync('b374_out.txt',out.join('\n')+'\n');console.log(out.join('\n'));process.exit(fail?1:0);
