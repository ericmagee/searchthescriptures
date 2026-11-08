// pkgPNL n8n test. Run from wall2024/: node pkgPNL/test_PNL.cjs
// Saved runs (33218 on): Init Seats -> Resolve Seats -> Alternate Build (live LIB stub, unchanged) and Accept Build, base s52 vs pkgPNL.
// Fetch Models / Accept Models are the saved rows plus the two pkgPNL model_config rows (fix_PNL.sql values).
// Expected: panel gemini, chatgpt, qwen_flash (was gemini, chatgpt, sol); reserve glm_flash (was grok); single judge unchanged; alt_order
// glm_flash, mimo, grok (was grok); Resolve Seats judges carry qwen/qwen3.8-flash and the alternates their ids and families; Alternate Build
// offers glm_flash first, then mimo (thinking off), then grok; Accept Build asks qwen_flash, glm_flash and mimo (thinking off), not sol;
// the single-judge nodes' family maps know the new seats.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B='/mnt/project-files/wall2024/fetchback_live_s52.json';const W=JSON.parse(fs.readFileSync(B));
const D='/mnt/project-files/wall2024/inputs/';const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');const fin=(R,n)=>feeder(B,n).find(x=>has(R,x));
const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const pat=n=>fs.existsSync(__dirname+'/patched/'+n.replace(/ /g,'_')+'.js')?fs.readFileSync(__dirname+'/patched/'+n.replace(/ /g,'_')+'.js','utf8'):live(n);
const {rebuild}=require('../pkgLIB/unpack.cjs');const LIBJS=live('Shared Library');const ALTB=rebuild(live('Alternate Build'),LIBJS);
const AW=c=>'return (async()=>{'+c+'\n})();';const rows=(R,n)=>{const d=JSON.parse(fs.readFileSync(D+R+'_'+n.replace(/ /g,'_')+'.json'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const NEW=[{seat:'qwen_flash',provider:'openrouter',role:'engine',api_model:'qwen/qwen3.8-flash',max_tokens:64000,family:'qwen',active:true,jfl_move:false,jfl_block:'',jfl_counts:null},
 {seat:'glm_flash',provider:'openrouter',role:'engine',api_model:'z-ai/glm-5.3-flash',max_tokens:64000,family:'zhipu',active:true,jfl_move:false,jfl_block:'',jfl_counts:null}].map(json=>({json}));
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);}console.log((c?'OK ':'FAIL ')+m);};
const runs=fs.readdirSync(D).filter(f=>/_Init_Seats\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
const S=a=>JSON.stringify(a);
(async()=>{for(const R of runs){const FM=has(R,'Fetch Models')?rows(R,'Fetch Models').concat(NEW):null;const ov={...(FM?{'Fetch Models':FM,'Accept Models':FM}:{})};
 let i0,i1,e0=null,e1=null;try{i0=harness(R)(live('Init Seats'),fin(R,'Init Seats'));}catch(e){e0=e.message.slice(0,90);}try{i1=harness(R,ov)(pat('Init Seats'),fin(R,'Init Seats'));}catch(e){e1=e.message.slice(0,90);}
 if(e0||e1){T(String(e0).replace(/run_token=\S+/,'')===String(e1).replace(/run_token=\S+/,''),R+' Init Seats refuses the same way on base and patched (saved input): '+e0);continue;}
 const a=i0[0].json,b=i1[0].json;const dfam=[a.defender.engine,a.challenger.engine];
 T(S(b.panel_order)===S(['gemini','chatgpt','qwen_flash'])&&b.panel_reserve==='glm_flash'&&b.single_judge===a.single_judge&&S(b.alt_order)===S(['glm_flash','mimo','grok']),
   R+' ('+dfam.join(' v ')+') panel '+S(a.panel_order)+' -> '+S(b.panel_order)+'; reserve '+a.panel_reserve+' -> '+b.panel_reserve+'; alt_order '+S(a.alt_order)+' -> '+S(b.alt_order)+'; single '+a.single_judge+' -> '+b.single_judge);
 if(!FM||!has(R,'Resolve Seats'))continue;const rf=fin(R,'Resolve Seats');let r1;try{r1=harness(R,{...ov,'Init Seats':i1})(pat('Resolve Seats'),rf);}catch(e){T(false,R+' Resolve Seats threw '+e.message.slice(0,140));continue;}
 const J=r1[0].json;T(S(J.judges.map(x=>x.seat+'='+x.api_model))===S(['gemini=google/gemini-3.8-flash','chatgpt=openai/gpt-6.1-terra','qwen_flash=qwen/qwen3.8-flash'])&&J.judges.every(x=>x.fam==='openrouter'&&x.max_tokens===64000),R+' Resolve Seats judges '+S(J.judges.map(x=>x.seat+'='+x.api_model+'/'+x.fam+'/'+x.max_tokens)));
 T(J.reserve&&J.reserve.seat==='glm_flash'&&J.reserve.api_model==='z-ai/glm-5.3-flash'&&J.reserve.fam==='openrouter',R+' reserve '+S(J.reserve));
 T(S(J.alternates.map(x=>x.seat+'='+x.api_model+'/'+x.family))===S(['glm_flash=z-ai/glm-5.3-flash/zhipu','mimo=xiaomi/mimo-v2.6-pro/xiaomi','grok=x-ai/grok-4.7/xai']),R+' alternates '+S(J.alternates.map(x=>x.seat+'='+x.api_model+'/'+x.family)));
 // live Resolve Seats on the patched Init Seats: the new seats have no family map there, so they would not resolve
 let rl=null;try{rl=harness(R,{...ov,'Init Seats':i1})(live('Resolve Seats'),rf);}catch(e){rl={err:e.message.slice(0,100)};}
 T(rl.err||!(rl[0].json.judges||[]).every(x=>x.fam==='openrouter'),R+' control: live Resolve Seats cannot serve the pkgPNL seats ('+(rl.err?rl.err:'judge fam '+S(rl[0].json.judges.map(x=>x.fam)))+')');
 if(!has(R,'Alternate Build'))continue;const af=fin(R,'Alternate Build');
 for(const [lab,keep] of [['all three',null],['glm_flash taken',['mimo','grok']],['glm_flash and mimo taken',['grok']]]){const r2=JSON.parse(JSON.stringify(r1));if(keep)r2[0].json.alternates=r2[0].json.alternates.filter(x=>keep.includes(x.seat));
  let b1;try{b1=await harness(R,{...ov,'Init Seats':i1,'Resolve Seats':r2})(AW(ALTB),af);}catch(e){T(false,R+' Alternate Build ('+lab+') threw '+e.message.slice(0,140));continue;}
  const al=b1.map(x=>x.json.alt).filter(Boolean);const first=al.find(x=>!x.skip);const want=keep?keep[0]:'glm_flash';
  if(!al.length){out.push('-- '+R+' Alternate Build ('+lab+'): no removed seat in this run');console.log('-- '+R+' no removed seat');break;}
  const gp=(a.panel_order||[]).includes('grok')&&want==='grok';if(gp&&!first){const sk=b1.flatMap(x=>x.json.skips||[]).map(x=>x.skip);T(sk.some(z=>/G3: x-ai\/grok-4\.7 already sits on this panel/.test(String(z||''))),R+' Alternate Build ('+lab+'): grok refused by G3 because the SAVED panel of this run seated grok (an input artifact; under pkgPNL grok is not on the panel): '+S(sk));continue;}
  T(first&&first.pool_seat===want&&(want!=='mimo'||(first.body&&first.body.reasoning&&first.body.reasoning.enabled===false))&&first.body&&first.body.model===J.alternates.find(x=>x.seat===want).api_model,
    R+' Alternate Build ('+lab+') offers '+(first?first.pool_seat+' '+first.body.model+(first.body.reasoning?' reasoning '+S(first.body.reasoning):''):'none')+'; rows '+S(al.map(x=>(x.pool_seat||x.seat||'')+(x.skip?' SKIP '+String(x.skip).slice(0,50):''))));}}
// Accept Build
for(const R of runs){if(!has(R,'Accept Build')||!has(R,'Accept Models'))continue;const f=fin(R,'Accept Build');const AM=rows(R,'Accept Models').concat(NEW);
 let a0,a1;try{a0=harness(R)(live('Accept Build'),f);a1=harness(R,{[f]:AM})(pat('Accept Build'),f);}catch(e){T(false,R+' Accept Build threw '+e.message.slice(0,140));continue;}
 const s0=a0.map(x=>x.json.acc&&x.json.acc.seat),s1=a1.map(x=>x.json.acc&&x.json.acc.seat);const m=a1.map(x=>x.json.acc).find(x=>x&&x.seat==='mimo');
 const same=s0.filter(s=>s!=='sol').every(s=>{const p=a0.find(x=>x.json.acc.seat===s).json.acc.body,q=a1.find(x=>x.json.acc.seat===s).json.acc.body;return S(p)===S(q);});
 T(S(s1)===S(['gemini','chatgpt','qwen_flash','glm_flash','mimo','grok'])&&!!m&&m.body.reasoning&&m.body.reasoning.enabled===false&&same,R+' Accept Build seats '+S(s0)+' -> '+S(s1)+'; bodies of kept seats identical: '+same+(m?'; mimo '+m.body.model+' reasoning '+S(m.body.reasoning):''));
 const q=a1.map(x=>x.json.acc).find(x=>x.seat==='qwen_flash'),g=a1.map(x=>x.json.acc).find(x=>x.seat==='glm_flash');T(q.body.model==='qwen/qwen3.8-flash'&&g.body.model==='z-ai/glm-5.3-flash'&&q.fam==='openrouter'&&g.fam==='openrouter',R+' posture bodies qwen_flash '+q.body.model+' / glm_flash '+g.body.model+', max_tokens '+q.body.max_tokens+'/'+g.body.max_tokens);break;}
// single-judge family maps
for(const n of ['Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt']){const c=pat(n),c0=live(n);const A="sol:'openrouter'};",B="sol:'openrouter',qwen_flash:'openrouter',glm_flash:'openrouter'}; /* pkgPNL */";T(c===c0.replace(A,()=>B)&&c0.split(A).length===2,n+' __JFAM2 knows qwen_flash and glm_flash (the only change in the node)');}
// every edit is one of the listed anchors: diff size per node
for(const p of JSON.parse(fs.readFileSync(__dirname+'/patched.plan.json')).nodes)out.push('-- '+p.name+' '+p.base_sha+' -> '+p.final_sha+' bytes '+p.bytes.join(' -> '));
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_PNL.txt',out.join('\n')+'\n');})();
