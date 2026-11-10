// W1 regrade of pkgKBG rev 3 (candidate parent_s98_KBG4.json, base live s98): planted rounds on 33798 (terra, Job 14:1, flagged bare grant), the same sentence with and without leading markup. Uses W3's probe helpers.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LV=g('/mnt/project-files/wall2024/fetchback_live_s98.json'),PK=g(__dirname+'/../parent_s98_KBG4.json');const code=(X,n)=>X.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\nSENDBACK: S4');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const pcn=R=>{const m=cl(PCN);m.forEach(x=>x&&x.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const all=async(X,R,line)=>(await H.run(code(X,'Send Back Record'),RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)}))[0].json.sb_rows;
const row=async(X,R,line)=>(await all(X,R,line)).find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));
const K=l=>'SENDBACK: S3 || KEEP || '+l;let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const RD=Object.assign({},R0,{CR4:R0.CR4+'\nI answer it under LINK 2 of my chain.'});

const add=(k,line)=>Object.assign({},R0,{[k]:R0[k]+'\n'+line});
const G='I grant the phrase covers Hezekiah and Josiah, kings named by their fathers.';
const CASES=[
 ['M1 CR2 heading sentence as stored ("**On Job 14:1.** I accept ...")',R0,'"I accept it as a phrase said of all men, and I make no claim from Galatians 4:4 alone."'],
 ['M2 same CR2 sentence with the bold heading removed',Object.assign({},R0,{CR2:R0.CR2.replace('**On Job 14:1.** I accept','I accept')}),'"I accept it as a phrase said of all men, and I make no claim from Galatians 4:4 alone."'],
 ['M3 planted bare grant, plain line',add('CR4',G),'"'+G+'"'],
 ['M4 the same grant as a bullet ("- I grant ...")',add('CR4','- '+G),'"'+G+'"'],
 ['M5 the same grant after a bold heading ("**On Job 14:1.** I grant ...")',add('CR4','**On Job 14:1.** '+G),'"'+G+'"'],
 ['M6 the same grant after a layer tag ("[L1] I grant ...")',add('CR4','[L1] '+G),'"'+G+'"'],
 ['M7 the same grant after a verse label ("- **Job 14:1** I grant ...")',add('CR4','- **Job 14:1** '+G),'"'+G+'"'],
 ['J1 bare grant plus ", and of Mary" (joined clause adds nothing)',add('CR4','- I grant it is said of Joseph, and of Mary.'),'"I grant it is said of Joseph, and of Mary."'],
 ['J2 two grants joined ("I grant the dating, and I grant the espousal.")',add('CR4','I grant the dating, and I grant the espousal.'),'"I grant the dating, and I grant the espousal."'],
 ['J3 grant; verse reference ("I grant it is said of kings; Matthew 1:6.")',add('CR4','I grant it is said of kings; Matthew 1:6.'),'"I grant it is said of kings; Matthew 1:6."'],
 ['J4 grant plus a reasoned clause ("I grant it, and the verse still names no father of Jesus.")',add('CR4','I grant it, and the verse still names no father of Jesus.'),'"I grant it, and the verse still names no father of Jesus."'],
 ['J5 grant plus keep-position clause ("I grant it, and I keep my link.")',add('CR4','I grant it, and I keep my link.'),'"I grant it, and I keep my link."'],
 ['J6 grant plus "the chain follows"',add('CR4','I grant it, and the chain follows.'),'"I grant it, and the chain follows."'],
 ['J7 grant then a reason after ";" ("I grant the dating; the record still names no father.")',add('CR4','I grant the dating; the record still names no father.'),'"I grant the dating; the record still names no father."'],
 ['J8 grant with verse list in parentheses ("I grant it (Job 14:1; Matthew 11:11).")',add('CR4','I grant it (Job 14:1; Matthew 11:11).'),'"I grant it (Job 14:1; Matthew 11:11)."'],
 ['J9 grant after colon, content only ("I grant both: the dating, and the espousal.")',add('CR4','I grant both: the dating, and the espousal.'),'"I grant both: the dating, and the espousal."'],
 ['J10 grant after colon with own I-clause ("I grant both: the dating is said, and I show it binds no father.")',add('CR4','I grant both: the dating is said, and I show it binds no father.'),'"I grant both: the dating is said, and I show it binds no father."'],
 ['J11 grant plus "and I concede the rest"',add('CR4','I grant it, and I concede the rest.'),'"I grant it, and I concede the rest."'],
 ['J12 grant plus a short subject clause "and it stands."',add('CR4','I grant it, and it stands.'),'"I grant it, and it stands."'],
 ['J13 grant plus "and Matthew 1:20 reflects it"',add('CR4','I grant it, and Matthew 1:20 reflects it.'),'"I grant it, and Matthew 1:20 reflects it."'],
 ['J14 grant plus "and I stand on D6"',add('CR4','I grant it, and I stand on D6.'),'"I grant it, and I stand on D6."'],
 ['J15 grant plus "and I maintain my chain"',add('CR4','I grant it, and I maintain my chain as declared.'),'"I grant it, and I maintain my chain as declared."'],
 ['J16 grant plus keep-word clause that adds a fit ("and I hold it because Matthew 1:16 names Joseph husband, not father")',add('CR4','I grant it, and I hold D6 because Matthew 1:16 names Joseph husband, not father.'),'"I grant it, and I hold D6 because Matthew 1:16 names Joseph husband, not father."'],
 ['J17 grant plus "and the verse supports D6 since it says begat of no man"',add('CR4','I grant it, and the verse supports D6 since it says begat of no man.'),'"I grant it, and the verse supports D6 since it says begat of no man."'],
 ['J18 grant plus "and this keeps my link whole"',add('CR4','I grant it, and this keeps my link whole.'),'"I grant it, and this keeps my link whole."']];
(async()=>{const out=[];for(const [nm,R,why] of CASES){const b=await row(LV,R,K(why)),c=await row(PK,R,K(why));const cr=r=>{const t=String(r.cure_reason);const j=t.indexOf('CURE (');return t.slice(j,j+190);};
 console.log(nm+'\n   base '+b.cure_status+' | KBG '+c.cure_status+' | '+cr(c));out.push([nm,b.cure_status,c.cure_status]);}
 fs.writeFileSync(__dirname+'/w1_plant_KBG4.json',JSON.stringify(out));})();
