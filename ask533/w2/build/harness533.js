// Loads the Library part of a MAP package (everything before the node's own body) with a stub $ so its functions can be called offline.
const fs=require('fs');
function pkg(file,name,stubJson){const W=JSON.parse(fs.readFileSync(file,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c=b+8,e=T.lastIndexOf('\n/*END*/');const L=JSON.parse(T.slice(a,b)),M=JSON.parse(T.slice(c,e));
 const p=M[name].p;const cut=p.findIndex(x=>Array.isArray(x)&&typeof x[0]==='string'&&/^const base=\$\(|^const bodies=\[\];|^P\.judges\.forEach/.test(x[0]));
 const s=(cut<0?p:p.slice(0,cut)).map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
 const $=nm=>{if(stubJson&&stubJson[nm])return {isExecuted:true,first:()=>({json:stubJson[nm]}),all:()=>[{json:stubJson[nm]}]};return {isExecuted:false,first:()=>{throw new Error('not executed: '+nm);},all:()=>[]};};
 const names=['cureVerdicts','kl2gLines','kl2Lines','enfSilent','enfUncured','enfTrialWhy','cureLabel','cureOwn','cureRest','l2Data'];
 const ret='return {'+names.map(n=>n+':(typeof '+n+"!=='undefined'?"+n+':null)').join(',')+'};';
 return new Function('$','$input','$json',s+'\n'+ret)($,{all:()=>[],first:()=>({json:{}})},{});}
module.exports={pkg};
