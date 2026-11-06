// pkgBAR: add one re-call stage (<P> Build, <P> Route, 7 <P> Call copies, <P> Extract) to a workflow JSON, on the pkgOGS pattern.
// src: the node whose output 0 the stage takes over; route: the round's own Route (its 7 outputs name the Call nodes in order).
const crypto=require('crypto');
const id=()=>crypto.randomUUID();
function addStage(w,P,src,route,buildCode,extractCode){
 const N=Object.fromEntries(w.nodes.map(n=>[n.name,n]));const C=w.connections;
 if(N[P+' Build'])throw new Error(P+' stage exists');if(!N[src])throw new Error('no node '+src);if(!N[route])throw new Error('no node '+route);
 const s=N[src].position,r=N[route];const at=(dx,dy)=>[s[0]+dx,s[1]+dy];
 const outs=C[route].main.slice(0,7).map(o=>o[0].node);if(outs.length!==7)throw new Error(route+' has '+outs.length+' outputs');
 const fam=outs.map(n=>n.slice(n.lastIndexOf(' ')+1));
 const add=n=>{w.nodes.push(n);N[n.name]=n;};
 add({id:id(),name:P+' Build',type:'n8n-nodes-base.code',typeVersion:2,position:at(220,900),parameters:{jsCode:buildCode}});
 add({id:id(),name:P+' Route',type:r.type,typeVersion:r.typeVersion,position:at(440,900),parameters:{mode:'expression',numberOutputs:8,output:'={{ $json.resend ? $json.call.fam_idx : 7 }}'}});
 outs.forEach((o,i)=>{const c=JSON.parse(JSON.stringify(N[o]));c.id=id();c.name=P+' Call '+fam[i];c.position=at(660,700+i*190);delete c.webhookId;add(c);});
 add({id:id(),name:P+' Extract',type:'n8n-nodes-base.code',typeVersion:2,position:at(900,900),parameters:{jsCode:extractCode}});
 const next=(C[src].main[0]||[]).slice();C[src].main[0]=[{node:P+' Build',type:'main',index:0}];
 C[P+' Build']={main:[[{node:P+' Route',type:'main',index:0}]]};
 C[P+' Route']={main:fam.map(f=>[{node:P+' Call '+f,type:'main',index:0}]).concat([[{node:P+' Extract',type:'main',index:0}]])};
 fam.forEach(f=>{C[P+' Call '+f]={main:[[{node:P+' Extract',type:'main',index:0}],[{node:P+' Extract',type:'main',index:0}]]};});
 C[P+' Extract']={main:[next]};
 return {added:[P+' Build',P+' Route',...fam.map(f=>P+' Call '+f),P+' Extract'],next:next.map(x=>x.node),fam};}
module.exports={addStage};
