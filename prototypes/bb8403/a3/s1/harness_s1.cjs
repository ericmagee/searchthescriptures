// BB-8403 step 1 harness (DoD 1): runs Init Seats and Resolve Seats, base and new, over every ordered debater pair.
const fs=require('fs');
const src=(d,f)=>fs.readFileSync(`${d}/${f}.js`,'utf8');
const MC0=JSON.parse(fs.readFileSync('data/model_config_active.json','utf8'));
const MCnew=MC0.map(r=>r.seat==='chatgpt'?{...r,api_model:'openai/gpt-6.1-terra',provider:'openrouter'}:r);
const ENGS=['claude','chatgpt','gemini','grok','mimo','glm','qwen','deepseek'];
const NEW_ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok'];
function run(code,ctx){const f=new Function('$input','$execution','$',code);return f(ctx.$input,ctx.$execution,ctx.$);}
function initSeats(dir,body){const cd={set(){}};return run(src(dir,'Init_Seats'),{$input:{first:()=>({json:{body}})},$execution:{id:'1',customData:cd},$:()=>{throw new Error('no $ in Init');}})[0].json;}
function resolve(dir,S,MC){const $=n=>{if(n==='Init Seats')return{first:()=>({json:S})};if(n==='Fetch Models')return{all:()=>MC.map(json=>({json}))};if(n==='Fetch Drift Guards'||n==='Fetch Tensions')return{all:()=>[]};throw new Error('no node '+n);};
 return run(src(dir,'Resolve_Seats'),{$input:null,$execution:{customData:{set(){}}},$})[0].json;}
let pass=0,fail=0;const out=[];const ok=(c,m)=>{if(c)pass++;else{fail++;out.push('FAIL '+m);}};
for(const d of ENGS)for(const c of ENGS){if(d===c)continue;
 const body={topic:'t',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'oracle'}};
 let Sb,Sn;try{Sb=initSeats('base',body);Sn=initSeats('new',body);}catch(e){out.push(`${d} vs ${c}: Init refused both? ${e.message.slice(0,80)}`);continue;}
 const free=NEW_ORDER.filter(s=>s!==d&&s!==c);
 ok(JSON.stringify(Sn.panel_order)===JSON.stringify(free.slice(0,3)),`${d} vs ${c} panel ${Sn.panel_order}`);
 ok(Sn.single_judge===free[0],`${d} vs ${c} single ${Sn.single_judge}`);
 // routes: only chatgpt's family may move
 for(const k of ['defender','challenger']){const eb=Sb[k],en=Sn[k];ok(en.engine==='chatgpt'?en.fam==='openrouter':en.fam===eb.fam,`${d} vs ${c} ${k} fam ${eb.fam}->${en.fam}`);}
 let Rb=null,Rn=null,eb='',en='';try{Rb=resolve('base',Sb,MC0);}catch(e){eb=e.message.replace(/ run_token=.*/,'');}try{Rn=resolve('new',Sn,MCnew);}catch(e){en=e.message.replace(/ run_token=.*/,'');}
 if(Rn){for(const j of Rn.judges)ok(j.fam===(j.seat==='chatgpt'?'openrouter':({deepseek:'deepseek',gemini:'gemini',grok:'grok',mimo:'mimo',glm:'openrouter',qwen:'openrouter'})[j.seat]),`${d} vs ${c} judge ${j.seat} fam ${j.fam}`);
  for(const s of [Rn.defender,Rn.challenger])if(s.engine==='chatgpt')ok(s.model==='openai/gpt-6.1-terra'&&s.fam==='openrouter',`${d} vs ${c} chatgpt debater ${s.model} ${s.fam} tok ${s.tok}`);}
 out.push(`${d} vs ${c}: panel ${Sb.panel_order.join(',')} -> ${Sn.panel_order.join(',')}; single ${Sb.single_judge}->${Sn.single_judge}; reserve ${Sb.panel_reserve}->${Sn.panel_reserve}; alt_order ${Sb.alt_order.join(',')||'-'} -> ${Sn.alt_order.join(',')||'-'}; alternates ${Rb?Rb.alternates.map(a=>a.seat).join(',')||'-':'REFUSED'} -> ${Rn?Rn.alternates.map(a=>a.seat).join(',')||'-':'REFUSED'}`+(eb||en?` | refusals base:[${eb}] new:[${en}]`:''));
}
// maps: every chatgpt route map in the six nodes
const maps={Init_Seats:[/chatgpt:\{fam:'(\w+)'/,/JFAM_I=\{[^}]*chatgpt:'(\w+)'/],Resolve_Seats:[/JFAM=\{[^}]*chatgpt:'(\w+)'/],Build_Synthesis:[/__JFAM2=\{[^}]*chatgpt:'(\w+)'/],Build_Independent_Verdict:[/__JFAM2=\{[^}]*chatgpt:'(\w+)'/],Build_Diagnostic_Prompt:[/__JFAM2=\{[^}]*chatgpt:'(\w+)'/]};
let nmaps=0;for(const [f,rxs] of Object.entries(maps))for(const rx of rxs){const m=src('new',f).match(rx);nmaps++;ok(m&&m[1]==='openrouter',`map ${f} ${rx}: ${m&&m[1]}`);}
const fmo=src('new','Format_Markdown').match(/const ORDER = (\[[^\]]*\]);/);ok(fmo&&fmo[1]===JSON.stringify(NEW_ORDER).replace(/"/g,"'"),'Format Markdown ORDER '+(fmo&&fmo[1]));
console.log(out.join('\n'));console.log(`maps checked ${nmaps}; PASS ${pass} FAIL ${fail}`);
