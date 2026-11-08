// pkgJGR body test (the pkgPNL3 rule, qwen_flash only). Run from wall2024/: node pkgJGR/test_JGR_bodies.cjs
// Base live s68 vs pkgJGR/patched; library Alternate Build stub rebuilt from strip_RTB4_8 vs strip_JGR full sources.
// Every difference between base and patched output must be a reasoning:{effort:'low'} field added to a body whose model is qwen/qwen3.8-flash.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B='/mnt/project-files/wall2024/fetchback_live_s68.json';const W=JSON.parse(fs.readFileSync(B));
const D='/mnt/project-files/wall2024/inputs/';const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');const fin=(R,n)=>feeder(B,n).find(x=>has(R,x));
const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const pat=n=>fs.readFileSync(__dirname+'/patched/'+n.replace(/ /g,'_')+'.js','utf8');
const rows=(R,n)=>{const d=JSON.parse(fs.readFileSync(D+R+'_'+n.replace(/ /g,'_')+'.json'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);}console.log((c?'OK ':'FAIL ')+m);};
// deep diff: list [path, a, b] where a and b differ
const diff=(a,b,p='',acc=[])=>{if(JSON.stringify(a)===JSON.stringify(b))return acc;if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p+'/'+k,acc);return acc;}acc.push([p,a,b]);return acc;};
const modelAt=(o,p)=>{const ks=p.split('/').filter(Boolean);ks.pop();let x=o;for(const k of ks)x=x&&x[k];return x&&x.model;};
const onlyQF=(a,b)=>{const d=diff(a,b);return {d,ok:d.every(([p,x,y])=>/\/reasoning$/.test(p)&&x===undefined&&JSON.stringify(y)==='{"effort":"low"}'&&modelAt(b,p)==='qwen/qwen3.8-flash')};};
const AW=c=>'return (async()=>{'+c+'\n})();';
(async()=>{
 const run=async(R,src,n,ov)=>{try{return await Promise.resolve(harness(R,ov||{})(/^return/.test(src)?src:AW(src),fin(R,n)));}catch(e){return {ERR:String(e.message||e).slice(0,140)};}};
 // 1 Panel Build: 33530 (saved panel gemini, terra, qwen_flash) and the latest runs
 for(const R of ['33530','33815','33828'].filter(r=>has(r,'Panel Build'))){const a=await run(R,live('Panel Build'),'Panel Build'),b=await run(R,pat('Panel Build'),'Panel Build');const r=onlyQF(a,b);
  T(!a.ERR&&!b.ERR&&r.ok,R+' Panel Build: '+r.d.length+' difference(s), each a reasoning effort low on a qwen/qwen3.8-flash body: '+JSON.stringify(r.d.map(x=>x[0])));}
 // 2 Reserve Build 33530 (reserve glm_flash: no change), then with the reserve's model set to qwen/qwen3.8-flash (the rule fires)
 if(has('33530','Reserve Build')){const a=await run('33530',live('Reserve Build'),'Reserve Build'),b=await run('33530',pat('Reserve Build'),'Reserve Build');const r=onlyQF(a,b);
  T(!a.ERR&&r.ok&&r.d.length===0,'33530 Reserve Build (glm_flash): unchanged ('+r.d.length+' differences)');
  const RS=JSON.parse(JSON.stringify(rows('33530','Resolve Seats')));let hit=0;for(const it of RS){const j=it.json||it;if(j.reserve&&j.reserve.api_model){j.reserve.api_model='qwen/qwen3.8-flash';hit++;}}
  if(hit){const a2=await run('33530',live('Reserve Build'),'Reserve Build',{'Resolve Seats':RS}),b2=await run('33530',pat('Reserve Build'),'Reserve Build',{'Resolve Seats':RS});const r2=onlyQF(a2,b2);
   T(!a2.ERR&&r2.ok&&r2.d.length>0,'33530 Reserve Build with a qwen/qwen3.8-flash reserve: '+r2.d.length+' difference(s), each a reasoning effort low: '+JSON.stringify(r2.d.map(x=>x[0])));}
  else T(false,'33530 Resolve Seats has no reserve to swap');}
 // 3 Accept Build 33530 (asked gemini, terra, qwen_flash, glm_flash, mimo, sol, grok): base s68 vs pkgJGR node with the s68 ORDER kept, so only __orc differs
 if(has('33530','Accept Build')){const src=pat('Accept Build').replace("const ORDER=['chatgpt','sol','qwen_flash','qwen'];","const ORDER=['gemini','chatgpt','qwen','sol','grok','qwen_flash'];");
  const a=await run('33530',live('Accept Build').replace("const ORDER=['gemini','chatgpt','qwen','sol','grok'];","const ORDER=['gemini','chatgpt','qwen','sol','grok','qwen_flash'];").replace("sol:'sol'}","sol:'sol',qwen_flash:'qwen_flash'}"),'Accept Build'),b=await run('33530',src,'Accept Build');const r=onlyQF(a,b);
  T(!a.ERR&&!b.ERR&&r.ok&&r.d.length>0,'33530 Accept Build: '+r.d.length+' difference(s), each a reasoning effort low on the qwen_flash posture body: '+JSON.stringify(r.d.map(x=>x[0]))+(a.ERR?' baseERR '+a.ERR:'')+(b.ERR?' patERR '+b.ERR:''));}
 // 4 library: Alternate Build and R2 Alternate Build full sources differ only by the rule line
 for(const f of ['Alternate_Build.js','R2_Alternate_Build.js']){const a=fs.readFileSync('pkgLIB/'+(process.env.JGR_LIB_BASE||'strip_RTB4_8')+'/patched/'+f,'utf8'),b=fs.readFileSync('pkgLIB/'+(process.env.JGR_LIB_OUT||'strip_JGR')+'/patched/'+f,'utf8');
  const QFR="if(!o.reasoning&&/^qwen\\/qwen3\\.8-flash$/.test(String(model)))o.reasoning={effort:'low'}; /* pkgJGR (pkgPNL3 rule, qwen_flash only): the flash judge leaves room for the verdict (33530) */";
  T(b.replace(QFR,'')===a&&b.split(QFR).length===2,'library '+f+': only the qwen_flash rule line is added, once');}
 // 5 the rule itself, run from the patched Panel Build's __orc text
 {const c=pat('Panel Build');const i=c.indexOf('const __orc=');const j=c.indexOf('\n',i);const orc=new Function(c.slice(i,j)+'\nreturn __orc;')();
  const m=[{role:'user',content:'x'}];const q=orc({model:'qwen/qwen3.8-flash',messages:m},'openrouter','qwen/qwen3.8-flash','k'),qm=orc({model:'qwen/qwen3.8-max-0902',messages:m},'openrouter','qwen/qwen3.8-max-0902','k'),
   t=orc({model:'openai/gpt-6.1-terra',messages:m},'openrouter','openai/gpt-6.1-terra','k'),qk=orc({model:'qwen/qwen3.8-flash',messages:m,reasoning:{effort:'high'}},'openrouter','qwen/qwen3.8-flash','k');
  T(JSON.stringify(q.reasoning)==='{"effort":"low"}'&&!qm.reasoning&&!t.reasoning&&JSON.stringify(qk.reasoning)==='{"effort":"high"}','__orc: qwen/qwen3.8-flash gets effort low; qwen max and terra get nothing; a body that sets reasoning keeps it');}
 out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out[out.length-1]);fs.writeFileSync(__dirname+'/test_JGR_bodies.txt',out.join('\n')+'\n');})();
