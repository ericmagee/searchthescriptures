// ASK 612 S4 (W4): every n8n expression of the engine and the child compiles in n8n's own expression parser (@n8n/tournament, version recorded).
// An expression is any parameter string that starts with "=" and holds "{{". Run 42283 failed at the judges on two that did not compile (inner "}}").
const path=require('path');
const TP=path.join(__dirname,'..','tools','parser','node_modules','@n8n','tournament');
module.exports=ctx=>{ctx.group('S4 expressions compile in n8n parser',['S4.engine','S4.child'],()=>{
 const {Tournament}=require(TP);const ver=require(path.join(TP,'package.json')).version;const t=new Tournament(e=>{throw e;});
 for(const [id,W] of [['S4.engine',ctx.E],['S4.child',ctx.C]]){let n=0;const bad=[];
  const walk=(o,p,name)=>{if(typeof o==='string'){if(o.startsWith('=')&&o.indexOf('{{')>=0){n++;try{t.getExpressionCode(o.slice(1));}catch(e){bad.push(name+p);}}}else if(o&&typeof o==='object')for(const k of Object.keys(o))walk(o[k],p+'.'+k,name);};
  for(const x of W.nodes)walk(x.parameters,'',x.name);
  ctx.T(id,n>0&&bad.length===0,(n-bad.length)+' of '+n+' compile (@n8n/tournament '+ver+')'+(bad.length?'; FAIL: '+bad.join(', '):''));}
});};
