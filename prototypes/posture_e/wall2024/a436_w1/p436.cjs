// ASK 436 patch (W1): L2 Count Plan keeps a count per KJV rendering; the shown kjv list is ordered by count, first 24, and "and N more" when cut (plan a436_w1/plan_rev0.md).
// Usage: require('./p436.cjs')(L2CountPlanSource) -> patched source. Each anchor must occur exactly once. Built on the ASK 430 target (ASK 412 stacking); the anchors are not on the forms line.
const R=[
 ["const W=new Set(),PH=new Set();let run=[]","const W=new Set(),PH=new Set(),CT={};let run=[]"],
 ["if(!wd)continue;W.add(wd);","if(!wd)continue;W.add(wd);CT[wd]=(CT[wd]||0)+1;"],
 ["REN[n]={W,PH};}","REN[n]={W,PH,CT};}"],
 ["kjv:[...R0.W].sort().slice(0,24)","kjv:[...R0.W].sort((a,b)=>((R0.CT||{})[b]||0)-((R0.CT||{})[a]||0)||(a<b?-1:a>b?1:0)).slice(0,24).concat(R0.W.size>24?['and '+(R0.W.size-24)+' more']:[])"]];
module.exports=function(src){for(const [o,v] of R){const k=src.split(o).length-1;if(k!==1)throw new Error('ASK 436: anchor found '+k+' times: '+o.slice(0,40));src=src.replace(o,()=>v);}return src;};
module.exports.R=R;
