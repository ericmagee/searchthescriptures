// BB-8403 S3 harness (DoD 5 of BB-8455): the request body at each of the 12 OpenRouter body sites, base (draft 64e6d7b7) vs new,
// for every seat that can reach it. The harness proves the body each node builds, not the provider's reply.
const fs=require('fs');const src=(d,f)=>fs.readFileSync(`${d}/${f}.js`,'utf8');
const cut=(c,a,z)=>{const i=c.indexOf(a);if(i<0)throw new Error('no anchor '+a);const j=c.indexOf(z,i);if(j<0)throw new Error('no end '+z);return c.slice(i,j+z.length);};
const DEB=['D1_Build','C1_Build','D2_Build','C2_Build','D3_Build','C3_Build'],SYN=['Build_Synthesis','Build_Independent_Verdict','Build_Diagnostic_Prompt'];
const site={};
for(const f of DEB)site[f]=d=>{const fn=new Function(cut(src(d,f),'const bodyFor=','return {model,max_tokens:tok,messages:m};};')+'\nreturn bodyFor;')();return s=>fn(s.fam,s.model,s.mt,'SYS',[{role:'user',content:'U'}]);};
for(const f of SYN)site[f]=d=>{const fn=new Function('__fam2','__model2','__base2','__sys2','__usr2','__m2',cut(src(d,f),'let __nb;','else __nb={model:__model2,max_tokens:__base2,messages:__m2};')+'\nreturn __nb;');return s=>fn(s.fam,s.model,s.mt,'SYS','U',[{role:'system',content:'SYS'},{role:'user',content:'U'}]);};
const judge=(f,a,z)=>d=>{const fn=new Function('j','SYS','user','let body;'+cut(src(d,f),a,z)+'\nreturn body;');return s=>fn({seat:s.seat,fam:s.fam,api_model:s.model,max_tokens:s.mt},'SYS','U');};
site.Panel_Build=judge('Panel_Build',"if(j.fam==='gemini')body=","else body={model:j.api_model,max_tokens:j.max_tokens,messages:m};}");
site.Reserve_Build=judge('Reserve_Build',"if(j.fam==='gemini')body=","else body={model:j.api_model,max_tokens:j.max_tokens,messages:m};}");
site.Alternate_Build=d=>{const fn=new Function('a','msgs',cut(src(d,'Alternate_Build'),' const body=',"messages:msgs};")+'\nreturn body;');return s=>fn({seat:s.seat,api_model:s.model,max_tokens:s.mt},[{role:'system',content:'SYS'},{role:'user',content:'U'}]);};
// seats as each site receives them (fam as routed under S1; mt = the value the site is handed)
const SEATS=[{seat:'chatgpt',fam:'openrouter',model:'openai/gpt-6.1-terra',mt:32000},{seat:'glm',fam:'openrouter',model:'z-ai/glm-5.3',mt:32000},{seat:'qwen',fam:'openrouter',model:'qwen/qwen3.8-max-0902',mt:32000},
 {seat:'alt_minimax3',fam:'openrouter',model:'minimax/minimax-m3',mt:32000},{seat:'deepseek',fam:'deepseek',model:'deepseek-flash',mt:65536},{seat:'gemini',fam:'gemini',model:'gemini-3.1-pro-preview',mt:32000},
 {seat:'grok',fam:'grok',model:'grok-4.7',mt:32000},{seat:'mimo',fam:'mimo',model:'mimo-v2.6-pro',mt:32000},{seat:'claude',fam:'anthropic',model:'claude-sonnet-5-5',mt:32000}];
const OR_ONLY=new Set(['Alternate_Build']);
let pass=0,fail=0;const out=[];const ok=(c,m)=>{if(c)pass++;else{fail++;out.push('FAIL '+m);}};
const eff=b=>b&&b.reasoning&&b.reasoning.effort;
let shapeFailsOnBase=0;
for(const f of Object.keys(site)){const B=site[f]('base'),N=site[f]('new');
 for(const s of SEATS){if(OR_ONLY.has(f)&&s.fam!=='openrouter')continue;
  let b,n;try{b=B(s);n=N(s);}catch(e){ok(false,`${f} ${s.seat} threw ${e.message}`);continue;}
  if(s.seat==='chatgpt'){
   ok(eff(n)==='medium'&&n.max_tokens===64000&&n.model==='openai/gpt-6.1-terra',`${f} chatgpt new effort ${eff(n)} max_tokens ${n.max_tokens}`);
   // 8451 failure shape: effort max for openai/ at max_tokens 32000; must be present on base
   if(eff(b)==='max'&&b.max_tokens===32000)shapeFailsOnBase++;else out.push(`NOTE ${f} base chatgpt effort ${eff(b)} max_tokens ${b.max_tokens}`);
   out.push(`${f} chatgpt: base ${eff(b)}/${b.max_tokens} -> new ${eff(n)}/${n.max_tokens}`);
  }else if(s.seat==='glm'&&f==='Panel_Build'){
   ok(eff(b)==='max'&&eff(n)==='medium'&&n.max_tokens===b.max_tokens&&JSON.stringify({...n,reasoning:null})===JSON.stringify({...b,reasoning:null}),`${f} glm primary base ${eff(b)} new ${eff(n)}`);
   out.push(`${f} glm primary: base ${eff(b)}/${b.max_tokens} -> new ${eff(n)}/${n.max_tokens}`);
  }else ok(JSON.stringify(b)===JSON.stringify(n),`${f} ${s.seat} body moved: ${JSON.stringify(b).slice(0,120)} -> ${JSON.stringify(n).slice(0,120)}`);
 }}
ok(shapeFailsOnBase===12,`failure shape present on base at ${shapeFailsOnBase} of 12 sites`);
console.log(out.join('\n'));console.log(`sites ${Object.keys(site).length}; failure shape on base ${shapeFailsOnBase}/12; PASS ${pass} FAIL ${fail}`);
