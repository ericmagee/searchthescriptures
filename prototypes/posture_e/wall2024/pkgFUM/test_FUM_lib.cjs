// pkgFUM replay: every saved run, the 6 Normalize nodes, base (strip_WLG) vs patched (strip_FUM). Without the fum key the output must be byte-equal;
// lists every saved cure reply that would have been asked a follow-up, and what. The other 24 library sources are byte-identical (plan_FUM.json).
// Run from wall2024/: node pkgFUM/test_FUM_lib.cjs
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const R=f=>fs.readFileSync(f,'utf8');
const plan=JSON.parse(R('pkgFUM/plan_FUM.json'));const out=[];const log=s=>{out.push(s);console.log(s);};let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const ch=Object.entries(plan.library).filter(([f,x])=>x.base!==x.patched).map(([f])=>f);T(ch.length===6&&ch.every(f=>/Normalize/.test(f)),'library sources changed: '+ch.join(', '));
for(const [f,x] of Object.entries(plan.library))if(x.base===x.patched&&R('pkgLIB/strip_WLG/patched/'+f)!==R('pkgLIB/strip_FUM/patched/'+f))T(false,f+' differs');
const P={'Panel_Cure_Normalize_1.js':'Panel Cure Call 1 openrouter','Panel_Cure_Normalize_2.js':'Panel Cure Call 2 openrouter','Panel_Cure_Normalize_3.js':'Panel Cure Call 3 openrouter','Alternate_Cure_Normalize.js':'Alternate Cure Call openrouter','R2_Alternate_Cure_Normalize.js':'R2 Alternate Cure Call openrouter','Cure_Normalize.js':'Cure Call openrouter'};
const st=x=>JSON.stringify(x);const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();let n=0,same=0,asked=0,diff=0;
for(const RUN of runs){let H;try{H=harness(RUN);}catch(e){continue;}
 for(const [f,call] of Object.entries(P)){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'.json')))continue;
  const inp=fs.existsSync(D+RUN+'_'+call.replace(/ /g,'_')+'.json')?call:nm.replace('Normalize','Route');let a,b,e0=null,e1=null;
  try{a=H(R('pkgLIB/strip_WLG/patched/'+f),inp);}catch(e){e0=String(e.message).slice(0,90);}try{b=H(R('pkgLIB/strip_FUM/patched/'+f),inp);}catch(e){e1=String(e.message).slice(0,90);}
  if(e0||e1){if(e0!==e1)T(false,RUN+' '+nm+' error differs ('+e0+' | '+e1+')');continue;}n++;
  const bf=b.map(it=>it.json.fum||null);const b0=b.map(it=>{const j={...it.json};delete j.fum;return {...it,json:j};});
  if(st(a)!==st(b0)){diff++;T(false,RUN+' '+nm+' output differs beyond the fum key');continue;}
  if(bf.every(x=>!x)){same++;continue;}asked++;bf.forEach((x,i)=>{if(x)log('   ASK '+RUN+' '+nm+' ('+((b[i].json.cure||{}).model||'?')+'): '+x.asked.length+' item(s): '+x.asked.map(s=>s.slice(0,70)).join(' || '));});}}
log('replay: '+n+' Normalize runs over '+runs.length+' saved runs; byte-equal (no follow-up) '+same+'; follow-up asked '+asked+'; other differences '+diff);
T(n>0&&diff===0,'replay ran, no difference beyond the fum key');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgFUM/test_FUM_lib.txt',out.join('\n')+'\n');
