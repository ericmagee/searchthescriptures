// pkgJGR test. Run from wall2024/: node pkgJGR/test_JGR.cjs [base workflow=fetchback_live_s67]
// Saved runs with Init Seats input: base vs patched Init Seats, then patched Resolve Seats and Accept Build.
// The saved agreement (Accept Final) never asked qwen_flash, so the test marks qwen_flash placed in it (as the live posture call will once
// Accept Build asks it); Fetch Models / Accept Models gain the live qwen_flash row if a saved run lacks it.
// Expected: panel chatgpt, sol, qwen_flash; single judge chatgpt; no reserve; no alternates; gemini and grok nowhere;
// Resolve Seats judges terra, sol, qwen/qwen3.8-flash, all openrouter; Accept Build asks chatgpt, sol, qwen_flash only.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s67.json';const W=JSON.parse(fs.readFileSync(B));
const D='/mnt/project-files/wall2024/inputs/';const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');const fin=(R,n)=>feeder(B,n).find(x=>has(R,x));
const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const pat=n=>fs.readFileSync(__dirname+'/patched/'+n.replace(/ /g,'_')+'.js','utf8');
const rows=(R,n)=>{const d=JSON.parse(fs.readFileSync(D+R+'_'+n.replace(/ /g,'_')+'.json'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const QF={json:{seat:'qwen_flash',provider:'openrouter',role:'engine',api_model:'qwen/qwen3.8-flash',max_tokens:64000,family:'qwen',active:true,jfl_move:false,jfl_block:'',jfl_counts:null}};
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);}console.log((c?'OK ':'FAIL ')+m);};const S=a=>JSON.stringify(a);
const runs=fs.readdirSync(D).filter(f=>/_Init_Seats\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>has(r,'Fetch Models')).sort();
for(const R of runs){const add=a=>a.some(x=>x.json&&x.json.seat==='qwen_flash')?a:a.concat([QF]);const FM=add(rows(R,'Fetch Models'));const AM=has(R,'Accept Models')?add(rows(R,'Accept Models')):FM;
 const f=fin(R,'Init Seats');const IN=JSON.parse(JSON.stringify(f));
 // the saved Init Seats input carries the agreement (acc.seats); mark qwen_flash placed, as the live posture call will
 const it=Array.isArray(IN)?IN:[IN];for(const x of it){const j=x.json||x;if(j&&j.acc&&Array.isArray(j.acc.seats)&&!j.acc.seats.some(s=>s.seat==='qwen_flash'))j.acc.seats.push({seat:'qwen_flash',placed:true});}
 const ov={'Fetch Models':FM,'Accept Models':AM};let a,b,e0=null,e1=null;
 try{a=harness(R,ov)(live('Init Seats'),f)[0].json;}catch(e){e0=e.message.slice(0,120);}try{b=harness(R,ov)(pat('Init Seats'),IN)[0].json;}catch(e){e1=e.message.slice(0,160);}
 if(e1){T(!!e0,R+' patched Init Seats refuses ('+e1+'); base '+(e0?'refuses too: '+e0:'did not'));continue;}
 const deb=[b.defender.engine,b.challenger.engine];const openaiDeb=deb.some(x=>/chatgpt|sol/.test(x));
 const pass=S(b.panel_order.slice().sort())===S(['chatgpt','qwen_flash','sol'])&&b.single_judge==='chatgpt'&&!b.panel_reserve&&S(b.alt_order)==='[]';
 T(pass&&!/gemini|grok/.test(S([b.panel_order,b.single_judge,b.panel_reserve,b.alt_order])),R+' ('+deb.join(' v ')+') panel '+S(a&&a.panel_order)+' -> '+S(b.panel_order)+'; single '+(a&&a.single_judge)+' -> '+b.single_judge+'; reserve '+(a&&a.panel_reserve)+' -> '+b.panel_reserve+'; alt '+S(a&&a.alt_order)+' -> '+S(b.alt_order));
 if(has(R,'Resolve Seats')){let r;try{r=harness(R,{...ov,'Init Seats':[{json:b}]})(pat('Resolve Seats'),fin(R,'Resolve Seats'))[0].json;}catch(e){T(false,R+' Resolve Seats threw '+e.message.slice(0,140));continue;}
  T(S(r.judges.map(x=>x.seat+'='+x.api_model+'/'+x.fam).sort())===S(['chatgpt=openai/gpt-6.1-terra/openrouter','qwen_flash=qwen/qwen3.8-flash/openrouter','sol=openai/gpt-6.1-sol/openrouter'])&&!r.reserve&&(!r.alternates||!r.alternates.length),R+' Resolve Seats judges '+S(r.judges.map(x=>x.seat+'='+x.api_model+'/'+x.fam))+' reserve '+S(r.reserve)+' alternates '+S(r.alternates||[]));}
 if(has(R,'Accept Build')){let r;try{r=harness(R,{...ov})(pat('Accept Build'),fin(R,'Accept Build'));}catch(e){T(false,R+' Accept Build threw '+e.message.slice(0,140));continue;}
  const asked=r.map(x=>x.json.acc&&x.json.acc.seat).filter(Boolean);const qb=r.map(x=>x.json.acc).find(x=>x&&x.seat==='qwen_flash');
  T(S(asked)===S(['chatgpt','sol','qwen_flash'].filter(s=>deb.indexOf(s)<0))&&qb&&qb.body&&qb.body.model==='qwen/qwen3.8-flash',R+' Accept Build asks '+S(asked)+'; qwen_flash body model '+(qb&&qb.body&&qb.body.model));}}
// single-judge family maps
for(const n of ['Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt'])T(pat(n).includes("sol:'openrouter',qwen_flash:'openrouter'}")&&pat(n).length-live(n).length===24,n+': family map knows qwen_flash; nothing else changed');
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out[out.length-1]);fs.writeFileSync(__dirname+'/test_JGR.txt',out.join('\n')+'\n');
