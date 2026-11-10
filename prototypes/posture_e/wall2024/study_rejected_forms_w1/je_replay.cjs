// W1: replay the live s108 Judge Enforcer Record and Alt Judge Enforcer Record on every stored run, and list what each records about reply lines it could not use.
const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W=g(process.env.CANDF||'/mnt/project-files/wall2024/fetchback_live_s108.json');
const code=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
const run=(RUN,node,inputNode)=>{const mk=n=>{const it=n==='Shared Library'?[]:saved(RUN,n);const params={get jsCode(){return code(n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&saved(RUN,inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',"return (async()=>{\n"+code(node)+"\n})();")(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const runs=[...new Set(fs.readdirSync(IN).filter(f=>/_Judge_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const strs=(x,o,p)=>{if(x&&typeof x==='object'){for(const [k,v] of Object.entries(x)){if(/prompt_sent|^bodies$|verdict_raw|response|^body$/.test(k))continue;if(k==='errors'&&Array.isArray(v))v.forEach(e=>o.push(p+'.errors: '+String(e).slice(0,260)));else if(/^(eid|__eid|label_fault|esr)$/i.test(k))o.push(p+'.'+k+': '+JSON.stringify(v).slice(0,260));else strs(v,o,p+'.'+k);}}return o;};
(async()=>{for(const [node,call] of [['Judge Enforcer Record','Judge Enforcer Call deepseek'],['Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek']]){let n=0;
 for(const r of runs){if(saved(r,call)===null)continue;n++;let o;try{o=await run(r,node,call);}catch(e){console.log(node+' '+r+' THROWS '+e.message);continue;}
  const j=o&&o[0]&&o[0].json;const hits=[...new Set(strs(j,[],''))];if(hits.length){console.log('== '+node+' '+r);hits.slice(0,12).forEach(h=>console.log('   '+h));}}
 console.log('-- '+node+': '+n+' stored runs replayed');}})();
