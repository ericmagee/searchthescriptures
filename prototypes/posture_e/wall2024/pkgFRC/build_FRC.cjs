// pkgFRC (W1, 11-08; W4 3047, run 33530): the two flash judges get a reasoning budget so they leave room for the verdict.
// 33530: qwen/qwen3.8-flash (panel slot 3) and z-ai/glm-5.3-flash (reserve) each spent all 64,000 completion tokens on reasoning and returned no content.
// Change: in the shared OpenRouter body transform (36 HTTP call nodes' jsonBody and Panel Judges Prep's ORF, 3 copies), right after the z-ai provider line:
//   a body for exactly qwen/qwen3.8-flash or z-ai/glm-5.3-flash, with no reasoning field of its own, gets reasoning {max_tokens: 24000}.
// Every other model's body is unchanged. Base: live s53. Run from wall2024/: node pkgFRC/build_FRC.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s53.json','utf8'));
const A="if(/^z-ai\\//.test(md))o=Object.assign({},o,{provider:{order:['z-ai'],allow_fallbacks:false} });";
const B=A+"if(/^(?:qwen\\/qwen3\\.8-flash|z-ai\\/glm-5\\.3-flash)$/.test(md)&&!o.reasoning)o=Object.assign({},o,{reasoning:{max_tokens:24000} });";
const plan={base:'live s53 (fetchback_live_s53.json)',budget:24000,nodes:{}};fs.mkdirSync('pkgFRC/patched',{recursive:true});
for(const n of W.nodes){for(const k of ['jsonBody','jsCode']){const v=n.parameters[k];if(typeof v!=='string'||!v.includes(A))continue;
 const c=v.split(A).length-1;if(k==='jsonBody'&&c!==1)throw new Error(n.name+' '+c);if(k==='jsCode'&&n.name!=='Panel Judges Prep')throw new Error('unexpected code node '+n.name);
 const v2=v.split(A).join(B);if(v2.includes('}}')&&k==='jsonBody'){const inner=v2.replace(/^=\{\{/,'').replace(/\}\}\s*$/,'');if(inner.includes('}}'))throw new Error(n.name+': inner }}');}
 const p2={...n.parameters,[k]:v2};plan.nodes[n.name]={field:k,copies:c,params_base:h(JSON.stringify(n.parameters)),params_patched:h(JSON.stringify(p2))};
 fs.writeFileSync('pkgFRC/patched/'+n.name.replace(/[ ?]/g,'_')+'.json',JSON.stringify(p2,null,1));}}
fs.writeFileSync('pkgFRC/plan_FRC.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes; copies '+Object.values(plan.nodes).reduce((a,x)=>a+x.copies,0));
