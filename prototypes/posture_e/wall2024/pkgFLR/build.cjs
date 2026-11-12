// pkgFLR (W1; run 35379 F2, W1 Wall 5136, confirmed by W3 w3/grade_35379.md): the alternate Merge Seats read every run of
// their Cure Normalize node, not only the last. The follow-up path loops (Normalize -> FUM Needed? -> FUM Call -> FUM Merge ->
// Normalize), so when only some alternates get a follow-up, the last Normalize run holds only those; the others' cure replies
// were lost and every item read "no cure call was made for this alternate".
// Change (own line 199 of Alternate Merge Seat and of R2 Alternate Merge Seat): CN is built from runs 0, 1, ... of the Normalize
// node (n8n $(node).all(0, run)), keeping the latest item for each cure.k; an item with no cure is kept as it comes. Prompt 0.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
for(const [node,nz] of [['Alternate Merge Seat','Alternate Cure Normalize'],['R2 Alternate Merge Seat','R2 Alternate Cure Normalize']]){
 const old="try{if($('"+nz+"').isExecuted)CN=$('"+nz+"').all().map(x=>x.json);}catch(e){CN=[];}";
 const neu="try{if($('"+nz+"').isExecuted){const __by=new Map(),__nc=[];for(let __r=0;__r<20;__r++){let __a;try{__a=$('"+nz+"').all(0,__r);}catch(e){break;}if(!Array.isArray(__a)||!__a.length)break;for(const x of __a){const j=x&&x.json;if(j&&j.cure&&j.cure.k!=null)__by.set(String(j.cure.who)+'|'+j.cure.k,j);else if(j)__nc.push(j);}}CN=[...__by.values(),...__nc];}}catch(e){CN=[];} /* pkgFLR: every run of the Normalize node; the follow-up loop's last run holds only the alternates asked again, so the latest item per alternate is kept */";
 let h=0;M[node].p=M[node].p.map(e=>{if(Array.isArray(e)&&typeof e[0]==='string'&&e[0]===old){h++;return [neu];}return e;});if(h!==1)throw new Error(node+' hits '+h);
}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
