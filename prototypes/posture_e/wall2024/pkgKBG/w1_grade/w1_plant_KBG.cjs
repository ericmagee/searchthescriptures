// W1 grade of pkgKBG: planted rounds on 33798 (terra, Job 14:1, flagged bare grant), the same sentence with and without leading markup. Uses W3's probe helpers.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LV=g(__dirname+'/../base_s94_KVQ.json'),PK=g(__dirname+'/../parent_s94_KBG.json'),S94=g('/mnt/project-files/wall2024/fetchback_live_s94.json');const code=(X,n)=>X.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
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
 ['M7 the same grant after a verse label ("- **Job 14:1** I grant ...")',add('CR4','- **Job 14:1** '+G),'"'+G+'"']];
(async()=>{const out=[];for(const [nm,R,why] of CASES){const b=await row(LV,R,K(why)),c=await row(PK,R,K(why));const cr=r=>{const t=String(r.cure_reason);const j=t.indexOf('CURE (');return t.slice(j,j+190);};
 console.log(nm+'\n   base '+b.cure_status+' | KBG '+c.cure_status+' | '+cr(c));out.push([nm,b.cure_status,c.cure_status]);}
 fs.writeFileSync(__dirname+'/w1_plant_KBG.json',JSON.stringify(out));})();
