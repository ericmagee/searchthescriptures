// pkgJGR rev 6 test (haiku the alternate, operator 08:31Z 11-09); from the rev 4 test (operator 07:14Z "we mimo as an alternate", 07:27Z "add luna 6.1 as a judge"). Run from wall2024/: node pkgJGR/test_JGR_luna.cjs
// Base live s72 vs pkgJGR/haiku/patched. Every saved run with Init Seats input, twice: as saved, and with the defender engine set to mimo.
//  As saved: panel chatgpt, sol, luna; mimo the reserve (the alternate). mimo debating: panel chatgpt, sol, luna, no reserve.
//  Resolve Seats: judges as the panel, luna = openai/gpt-6-luna on openrouter. Panel Build (runs 33530 and >= 33800): mimo body max_tokens 131072 and effort medium (operator 07:46Z);
//  luna, terra, sol bodies carry no reasoning. Accept Build asks chatgpt, sol, mimo, luna (minus debaters).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B=process.env.JGR_BASE||'/mnt/project-files/wall2024/fetchback_live_s72.json';const W=JSON.parse(fs.readFileSync(B));
const D='/mnt/project-files/wall2024/inputs/';const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');const fin=(R,n)=>feeder(B,n).find(x=>has(R,x));
const NO='pkgJGR/haiku/patched';const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const pat=n=>{const f=NO+'/'+n.replace(/ /g,'_')+'.js';return fs.existsSync(f)?fs.readFileSync(f,'utf8'):live(n);};
const rows=(R,n)=>{const d=JSON.parse(fs.readFileSync(D+R+'_'+n.replace(/ /g,'_')+'.json'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const ROW=(seat,prov,model,fam)=>({json:{seat,provider:prov,role:'engine',api_model:model,max_tokens:64000,family:fam,active:true,jfl_move:false,jfl_block:'',jfl_counts:null}});
const ADD=[ROW('mimo','xiaomi','xiaomi/mimo-v2.6-pro','xiaomi'),ROW('luna','openrouter','openai/gpt-6-luna','openai'),ROW('haiku','openrouter','anthropic/claude-haiku-5.5','anthropic')];
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);}console.log((c?'OK ':'FAIL ')+m);};const S=a=>JSON.stringify(a);
const runs=fs.readdirSync(D).filter(f=>/_Init_Seats\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>has(r,'Fetch Models')).sort();
const M={chatgpt:'chatgpt=openai/gpt-6.1-terra/openrouter',mimo:'mimo=xiaomi/mimo-v2.6-pro/openrouter',sol:'sol=openai/gpt-6.1-sol/openrouter',luna:'luna=openai/gpt-6-luna/openrouter',haiku:'haiku=anthropic/claude-haiku-5.5/openrouter'};
const bodies=x=>{const o=[];const w=v=>{if(v&&typeof v==='object'){if(typeof v.model==='string'&&Array.isArray(v.messages))o.push(v);for(const k of Object.keys(v))w(v[k]);}};w(x);return o;};
const setEng=(x,eng)=>{let n=0;const w=v=>{if(v&&typeof v==='object'){if(v.defender&&typeof v.defender==='object'&&'engine' in v.defender&&v.challenger&&v.challenger.engine!==eng){v.defender.engine=eng;n++;}for(const k of Object.keys(v))w(v[k]);}};w(x);return n;};
(async()=>{let fills=0;
for(const R of runs)for(const variant of ['saved','haiku debates']){
 const add=a=>ADD.reduce((acc,r)=>acc.some(x=>x.json&&x.json.seat===r.json.seat)?acc:acc.concat([r]),a);const FM=add(rows(R,'Fetch Models'));const AM=has(R,'Accept Models')?add(rows(R,'Accept Models')):FM;
 const FN=fin(R,'Init Seats');const IN=JSON.parse(JSON.stringify(rows(R,FN)));
 const it=IN;for(const x of it){const j=x.json||x;if(j&&j.acc&&Array.isArray(j.acc.seats))for(const s of ['mimo','luna','haiku'])if(!j.acc.seats.some(z=>z.seat===s))j.acc.seats.push({seat:s,placed:true});}
 const tag=R+' ['+variant+']';
 if(variant!=='saved'&&!setEng(IN,'haiku')){let e0=null;try{harness(R,{'Fetch Models':FM,'Accept Models':AM,[FN]:IN})(live('Init Seats'),FN);}catch(x){e0=x.message;}T(e0!==null,tag+': input has no seats (live refuses it too), skipped');continue;}
 const ov={'Fetch Models':FM,'Accept Models':AM,[FN]:IN};let b;try{b=harness(R,ov)(pat('Init Seats'),FN)[0].json;}catch(e){let e0=null;try{harness(R,ov)(live('Init Seats'),FN);}catch(x){e0=x.message;}T(e0!==null&&e0.split(' run_token')[0]===e.message.split(' run_token')[0],tag+' Init Seats refuses, as live does: '+e.message.slice(0,100));continue;}
 const deb=[b.defender.engine,b.challenger.engine];const oai=deb.some(d=>/^(chatgpt|sol|luna)$/.test(d));
 const mv=new Set(AM.map(x=>x.json).filter(x=>x&&x.jfl_move===true).map(x=>x.seat)); /* the engine's failure ledger moves a seat to the back and never makes it the reserve */
 const f0=['chatgpt','sol','luna','haiku'].filter(s=>deb.indexOf(s)<0&&!(oai&&/^(chatgpt|sol|luna)$/.test(s)));const free=f0.filter(s=>!mv.has(s)).concat(f0.filter(s=>mv.has(s)));const want=free.slice(0,3).sort();const res=(free[3]&&!mv.has(free[3]))?free[3]:null;if(want.includes('luna'))fills++;
 T(S(b.panel_order.slice().sort())===S(want)&&(b.panel_reserve||null)===res&&!/gemini|grok|qwen_flash/.test(S([b.panel_order,b.single_judge])),tag+' ('+deb.join(' v ')+') panel '+S(b.panel_order)+' single '+b.single_judge+' reserve '+b.panel_reserve+' alt '+S(b.alt_order));
 let r=null;if(has(R,'Resolve Seats')){try{r=harness(R,{...ov,'Init Seats':[{json:b}]})(pat('Resolve Seats'),fin(R,'Resolve Seats'))[0].json;}catch(e){T(false,tag+' Resolve Seats threw '+e.message.slice(0,140));continue;}
  T(S(r.judges.map(x=>x.seat+'='+x.api_model+'/'+x.fam).sort())===S(want.map(s=>M[s]).sort())&&((r.reserve&&r.reserve.seat)||null)===res,tag+' Resolve Seats judges '+S(r.judges.map(x=>x.seat+'='+x.api_model+'/'+x.fam))+' reserve '+S(r.reserve&&r.reserve.seat));}
 if(r&&(R>='33800'||R==='33530')&&has(R,fin(R,'Panel Build'))){let p;try{p=await Promise.resolve(harness(R,{...ov,'Init Seats':[{json:b}],'Resolve Seats':[{json:r}]})('return (async()=>{'+pat('Panel Build')+'\n})();',fin(R,'Panel Build')));}catch(e){T(false,tag+' Panel Build threw '+e.message.slice(0,140));continue;}
  const bs=bodies(p);const mm=bs.filter(z=>/^xiaomi\//.test(z.model)),ot=bs.filter(z=>!/^xiaomi\//.test(z.model));
  T(mm.length===0&&(want.includes('haiku')===ot.some(z=>z.model==='anthropic/claude-haiku-5.5'))&&mm.every(z=>S(z.reasoning)==='{"effort":"medium"}'&&z.max_tokens===131072)&&ot.every(z=>z.max_tokens!==131072&&!z.reasoning)&&ot.every(z=>!z.reasoning)&&(want.includes('luna')===ot.some(z=>z.model==='openai/gpt-6-luna')),tag+' Panel Build bodies '+S(bs.map(z=>z.model+(z.reasoning?' '+S(z.reasoning):''))));
  if(variant!=='saved'&&R==='33530'){const lb=ot.find(z=>z.model==='openai/gpt-6-luna');if(lb)fs.writeFileSync('pkgJGR/haiku/check_body_luna_33530.json',JSON.stringify(lb));}}
 if(variant==='saved'&&has(R,'Accept Build')){let q;try{q=harness(R,{...ov})(pat('Accept Build'),fin(R,'Accept Build'));}catch(e){T(false,tag+' Accept Build threw '+e.message.slice(0,140));continue;}
  const asked=q.map(x=>x.json.acc&&x.json.acc.seat).filter(Boolean);
  T(S(asked)===S(['chatgpt','sol','luna','haiku'].filter(s=>deb.indexOf(s)<0)),tag+' Accept Build asks '+S(asked));}}
 for(const n of ['Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt'])T(pat(n).includes("sol:'openrouter',luna:'openrouter',haiku:'openrouter'}")&&pat(n).length-live(n).length===37,n+': family map knows luna; nothing else changed');
 for(const f of ['Alternate_Build.js','R2_Alternate_Build.js']){const c=fs.readFileSync('pkgLIB/strip_JGR_HAIKU/patched/'+f,'utf8');T(c.includes("o.max_tokens=131072;if(!o.reasoning)o.reasoning={effort:'medium'};")&&!c.includes("effort:'low'}; /* pkgJGR rev 3"),'library '+f+': mimo max tokens and medium effort');T(c.includes("(d.family===a.family&&a.api_model!=='anthropic/claude-haiku-5.5')"),'library '+f+': G1 exempts haiku only');}
 {const c=pat('Accept Build');T(c.includes("o.max_tokens=131072;if(!o.reasoning)o.reasoning={effort:'medium'};"),'Accept Build: mimo max tokens and medium effort');}
 out.push('variants where luna sits on the panel: '+fills);out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.slice(-2).join('\n'));fs.writeFileSync('pkgJGR/haiku/test_JGR_haiku.txt',out.join('\n')+'\n');})();
