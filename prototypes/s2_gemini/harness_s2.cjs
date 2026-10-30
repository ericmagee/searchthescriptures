// Order BB-8510 S2/S3 harness: (A) every ordered debater pair through Init Seats and Resolve Seats, base vs new (gemini row moved to
// OpenRouter): panel, single, reserve and alternates unchanged; gemini's family 'openrouter' wherever it sits. (B) every body site, base
// vs new: gemini gets an OpenRouter body (effort medium, max_tokens and temperature equal to its former generationConfig); qwen as reserve
// and alternate gets effort medium, max(mt*2,8000), JSON kept; every other seat's body byte-equal. Proves bodies and seating, not replies.
const fs=require('fs');const src=(d,f)=>fs.readFileSync(`${d}/${f}.js`,'utf8');
const cut=(c,a,z)=>{const i=c.indexOf(a);if(i<0)throw new Error('no anchor '+a);const j=c.indexOf(z,i);if(j<0)throw new Error('no end '+z);return c.slice(i,j+z.length);};
let pass=0,fail=0;const out=[];const ok=(c,m)=>{if(c)pass++;else{fail++;out.push('FAIL '+m);}};
// ---- (A) seating
const MC0=JSON.parse(fs.readFileSync('mc.json','utf8')).map(r=>r.seat==='chatgpt'?{...r,provider:'openrouter',api_model:'openai/gpt-6.1-terra'}:r);
const MCn=MC0.map(r=>r.seat==='gemini'?{...r,provider:'openrouter',api_model:'google/gemini-3.8-flash'}:r);
function run(code,ctx){return new Function('$input','$execution','$',code)(ctx.$input,ctx.$execution,ctx.$);}
const initS=(d,body)=>run(src(d,'Init_Seats'),{$input:{first:()=>({json:{body}})},$execution:{id:'1',customData:{set(){}}},$:()=>{throw new Error('no $');}})[0].json;
const resolve=(d,S,MC)=>run(src(d,'Resolve_Seats'),{$input:null,$execution:{customData:{set(){}}},$:n=>{if(n==='Init Seats')return{first:()=>({json:S})};if(n==='Fetch Models')return{all:()=>MC.map(json=>({json}))};if(n==='Fetch Drift Guards'||n==='Fetch Tensions')return{all:()=>[]};throw new Error('no node '+n);}})[0].json;
const ENGS=['claude','chatgpt','gemini','grok','mimo','glm','qwen','deepseek'];let pairs=0;
for(const d of ENGS)for(const c of ENGS){if(d===c)continue;const body={topic:'t',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'oracle'}};
 let Sb,Sn;try{Sb=initS('base',body);Sn=initS('new',body);}catch(e){continue;}pairs++;
 for(const k of ['panel_order','single_judge','panel_reserve','alt_order'])ok(JSON.stringify(Sb[k])===JSON.stringify(Sn[k]),`${d} vs ${c} ${k} ${Sb[k]} -> ${Sn[k]}`);
 for(const k of ['defender','challenger']){const en=Sn[k];ok(en.engine==='gemini'?en.fam==='openrouter':en.fam===Sb[k].fam,`${d} vs ${c} ${k} fam ${Sb[k].fam}->${en.fam}`);}
 let Rb,Rn;try{Rb=resolve('base',Sb,MC0);Rn=resolve('new',Sn,MCn);}catch(e){ok(false,`${d} vs ${c} resolve threw ${e.message.slice(0,80)}`);continue;}
 ok(JSON.stringify(Rb.alternates.map(a=>a.seat))===JSON.stringify(Rn.alternates.map(a=>a.seat)),`${d} vs ${c} alternates`);
 for(const j of Rn.judges)ok(j.seat==='gemini'?(j.fam==='openrouter'&&j.api_model==='google/gemini-3.8-flash'):true,`${d} vs ${c} judge gemini ${j.fam} ${j.api_model}`);
 for(const s of [Rn.defender,Rn.challenger])if(s.engine==='gemini')ok(s.fam==='openrouter'&&s.model==='google/gemini-3.8-flash'&&s.tok===32000,`${d} vs ${c} gemini debater ${s.fam} ${s.model} ${s.tok}`);}
// ---- (B) bodies
const DEB=['D1_Build','C1_Build','D2_Build','C2_Build','D3_Build','C3_Build'],SYN=['Build_Synthesis','Build_Independent_Verdict','Build_Diagnostic_Prompt'];const site={};
for(const f of DEB)site[f]=d=>{const fn=new Function(cut(src(d,f),'const bodyFor=','return {model,max_tokens:tok,messages:m};};')+'\nreturn bodyFor;')();return s=>fn(s.fam,s.model,s.mt,'SYS',[{role:'user',content:'U'}]);};
for(const f of SYN)site[f]=d=>{const fn=new Function('__fam2','__model2','__base2','__sys2','__usr2','__m2',cut(src(d,f),'let __nb;','else __nb={model:__model2,max_tokens:__base2,messages:__m2};')+'\nreturn __nb;');return s=>fn(s.fam,s.model,s.mt,'SYS','U',[{role:'system',content:'SYS'},{role:'user',content:'U'}]);};
const judge=f=>d=>{const fn=new Function('j','SYS','user','let body;'+cut(src(d,f),"if(j.fam==='gemini')body=","else body={model:j.api_model,max_tokens:j.max_tokens,messages:m};}")+'\nreturn body;');return s=>fn({seat:s.seat,fam:s.fam,api_model:s.model,max_tokens:s.mt},'SYS','U');};
site.Panel_Build=judge('Panel_Build');site.Reserve_Build=judge('Reserve_Build');
site.Alternate_Build=d=>{const fn=new Function('a','msgs',cut(src(d,'Alternate_Build'),' const body=',"messages:msgs};")+'\nreturn body;');return s=>fn({seat:s.seat,api_model:s.model,max_tokens:s.mt},[{role:'system',content:'SYS'},{role:'user',content:'U'}]);};
const SEATS=[{seat:'chatgpt',fam:'openrouter',model:'openai/gpt-6.1-terra',mt:32000},{seat:'glm',fam:'openrouter',model:'z-ai/glm-5.3',mt:32000},{seat:'qwen',fam:'openrouter',model:'qwen/qwen3.8-max-0902',mt:32000},{seat:'deepseek',fam:'deepseek',model:'deepseek-flash',mt:65536},{seat:'grok',fam:'grok',model:'grok-4.7',mt:32000},{seat:'mimo',fam:'mimo',model:'mimo-v2.6-pro',mt:32000},{seat:'claude',fam:'anthropic',model:'claude-sonnet-5-5',mt:32000}];
const G0={seat:'gemini',fam:'gemini',model:'gemini-3.1-pro-preview',mt:32000},G1={seat:'gemini',fam:'openrouter',model:'google/gemini-3.8-flash',mt:32000};
const eff=b=>b&&b.reasoning&&b.reasoning.effort;let gsites=0;
for(const f of Object.keys(site)){const B=site[f]('base'),N=site[f]('new');const orOnly=f==='Alternate_Build';
 if(!orOnly){const b=B(G0),n=N(G1);const gc=b.generationConfig||{};
  ok(eff(n)==='medium'&&n.model==='google/gemini-3.8-flash'&&n.max_tokens===gc.maxOutputTokens&&(gc.temperature===undefined?n.temperature===undefined:n.temperature===gc.temperature),`${f} gemini new ${JSON.stringify({e:eff(n),mt:n.max_tokens,t:n.temperature})} vs base ${JSON.stringify(gc)}`);
  gsites++;out.push(`${f} gemini: base generationConfig ${JSON.stringify(gc)} -> new ${eff(n)}/${n.max_tokens}${n.temperature!==undefined?'/t'+n.temperature:''}`);}
 for(const s of SEATS){if(orOnly&&s.fam!=='openrouter')continue;const b=B(s),n=N(s);
  if(s.seat==='qwen'&&(f==='Reserve_Build'||f==='Alternate_Build')){ok(eff(b)==='max'&&eff(n)==='medium'&&n.max_tokens===64000&&n.response_format&&n.response_format.type==='json_object',`${f} qwen ${eff(b)}/${b.max_tokens} -> ${eff(n)}/${n.max_tokens}`);out.push(`${f} qwen: ${eff(b)}/${b.max_tokens} -> ${eff(n)}/${n.max_tokens}`);}
  else ok(JSON.stringify(b)===JSON.stringify(n),`${f} ${s.seat} body moved`);}}
// ---- maps
const mp={Init_Seats:[/gemini:\{fam:'(\w+)'/,/JFAM_I=\{[^}]*gemini:'(\w+)'/],Resolve_Seats:[/JFAM=\{[^}]*gemini:'(\w+)'/],Build_Synthesis:[/__JFAM2=\{[^}]*gemini:'(\w+)'/],Build_Independent_Verdict:[/__JFAM2=\{[^}]*gemini:'(\w+)'/],Build_Diagnostic_Prompt:[/__JFAM2=\{[^}]*gemini:'(\w+)'/]};
let nm=0;for(const [f,rxs] of Object.entries(mp))for(const rx of rxs){const m=src('new',f).match(rx);nm++;ok(m&&m[1]==='openrouter',`map ${f} ${rx} ${m&&m[1]}`);}
console.log(out.join('\n'));console.log(`pairs ${pairs}; gemini body sites ${gsites}; maps ${nm}; PASS ${pass} FAIL ${fail}`);
