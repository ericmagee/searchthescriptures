// pkgRCS (W1): RUN COST. Every model call of the run is listed in Panel Tokens (after the panel stage), sent by Write Tokens to
// record_debate_row_tokens (new p_calls argument; the SQL prices each call and stores call_costs and run_cost_usd on debate_results),
// and printed by Plain Rule Lines as the last section of the transcript, read back from Get Row. No price is held in the code.
// Operator: "i would like to move forward with tracking and recording the cost. the cost can go at the end of the debate transcript." (13:21 CST 11-11)
// Usage: node build.cjs <parent> <out>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=n=>{const x=W.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const isM=n=>(n.type.endsWith('httpRequest')&&/openrouter\.ai|anthropic\.com|deepseek\.com/.test(String(n.parameters.url)))||n.type.endsWith('executeWorkflow');
const NAMES=W.nodes.filter(isM).map(n=>n.name).filter(n=>n!=='Early Alternate Start').concat(['Panel Judge 1 deepseek','Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter','Early Alternate Reply']);
for(const n of NAMES){N(n);if(/'/.test(n))throw new Error('quote in '+n);}
const PT_ADD="const __CL=["+NAMES.map(n=>"()=>$('"+n+"')").join(',')+"];\n"+
"const __N=v=>Number(v)||0,__CC=[],__SN=new Set();\n"+
"const __CU=(n,k,j)=>{const e={n,k,m:j.model||j.modelVersion||null};const u=j.usage,g=j.usageMetadata;\n"+
" if(g){e.f='gemini';e.cr=__N(g.cachedContentTokenCount);e.i=__N(g.promptTokenCount)-e.cr;e.o=__N(g.candidatesTokenCount)+__N(g.thoughtsTokenCount);}\n"+
" else if(!u)e.f='none';\n"+
" else if(u.input_tokens!==undefined){const c=u.cache_creation||{};e.f='anthropic';e.i=__N(u.input_tokens);e.cr=__N(u.cache_read_input_tokens);e.w1=__N(c.ephemeral_1h_input_tokens);e.w5=__N(u.cache_creation_input_tokens)-e.w1;e.o=__N(u.output_tokens);}\n"+
" else if(u.prompt_cache_hit_tokens!==undefined){e.f='deepseek';e.i=__N(u.prompt_cache_miss_tokens);e.cr=__N(u.prompt_cache_hit_tokens);e.o=__N(u.completion_tokens);}\n"+
" else{const d=u.prompt_tokens_details||{};e.f=u.cost!==undefined?'openrouter':'other';e.cr=__N(d.cached_tokens);e.w5=__N(d.cache_write_tokens);e.i=__N(u.prompt_tokens)-e.cr-e.w5;e.o=__N(u.completion_tokens);if(u.cost!==undefined)e.b=__N(u.cost)+(u.is_byok?__N(u.cost_details&&u.cost_details.upstream_inference_cost):0);}\n"+
" return e;};\n"+
"for(const f of __CL){const n=(String(f).match(/\\$\\('(.+)'\\)/)||[])[1]||'?';let a;try{if(!f().isExecuted)continue;a=f().all();}catch(x){continue;}\n"+
" a.forEach((x,k)=>{const j=(x&&x.json)||{};if(j.id){if(__SN.has(j.id))return;__SN.add(j.id);}__CC.push(__CU(n,k,j));});}\n";
const pt=N('Panel Tokens');let c=pt.parameters.jsCode;const A1='const go=!!(pre&&';if(c.split(A1).length!==2)throw new Error('PT anchor');
c=c.replace(A1,()=>PT_ADD+A1);const A2=',panel_calls:seen}}];';if(c.split(A2).length!==2)throw new Error('PT anchor 2');c=c.replace(A2,()=>',panel_calls:seen,calls:__CC}}];');pt.parameters.jsCode=c;
const wt=N('Write Tokens');let b=wt.parameters.jsonBody;const A3=" } }}";if(!b.endsWith(A3))throw new Error('WT anchor');
wt.parameters.jsonBody=b.slice(0,-A3.length)+", p_calls: $('Panel Tokens').first().json.calls"+A3;
const PR_ADD="let COST='';try{const R=$('Get Row').first().json;const L=Array.isArray(R.call_costs)?R.call_costs:null;const d=v=>v==null?'no price':'$'+Number(v).toFixed(4);const t=v=>Number(v||0).toLocaleString('en-US');\n"+
" if(!L)COST='\\n## Cost of this run\\n\\nNo cost record is stored for this run.\\n';else{const s=k=>L.filter(e=>e.src===k).reduce((a,e)=>a+Number(e.usd||0),0);const np=L.filter(e=>e.usd==null).length;\n"+
"  COST='\\n## Cost of this run\\n\\nTotal '+d(R.run_cost_usd)+' for '+L.length+' model calls: billed by OpenRouter '+d(s('billed'))+' (measured); priced from the price list '+d(s('price list'))+' (estimate)'+(np?'; '+np+' calls have no price and are not in the total':'')+'.\\n\\n| Call | Model | Input | Cache read | Cache write | Output | Cost | Source |\\n|---|---|---|---|---|---|---|---|\\n'+\n"+
"  L.map(e=>'| '+e.n+(e.k?' #'+(e.k+1):'')+' | '+(e.m||'?')+' | '+t(e.i)+' | '+t(e.cr)+' | '+t(Number(e.w5||0)+Number(e.w1||0))+' | '+t(e.o)+' | '+d(e.usd)+' | '+(e.src||'')+' |').join('\\n')+'\\n';}}catch(e){COST='\\n## Cost of this run\\n\\nThe cost record was not found.\\n';}\n";
const pr=N('Plain Rule Lines');let p=pr.parameters.jsCode;const A4='const md = md0 + AGM + TAIL;';if(p.split(A4).length!==2)throw new Error('PR anchor');
p=p.replace(A4,()=>PR_ADD+'const md = md0 + AGM + TAIL + COST;');pr.parameters.jsCode=p;
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3],'| call nodes listed',NAMES.length);
