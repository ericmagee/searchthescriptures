// W2: run named nodes on every stored export with live s148 and with a parent; return both outputs per export
const fs=require('fs');const {ld,libOf}=require('./diff.cjs');const D='/mnt/project-files/wall2024/';
const rebuild=(W,n)=>{const stub=W.nodes.find(x=>x.name===n).parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return stub;return new Function('$',stub.slice(0,i)+'\nreturn __S;')(q=>({params:{jsCode:libOf(W)}}));};
module.exports=async function(parent,nodes,each,over){const L=ld('fetchback_live_s148.json'),P=ld(parent);const S={};for(const n of nodes){S[n]=[rebuild(L,n),rebuild(P,n)];}
 for(const fn of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x))){let __raw=fs.readFileSync(D+fn,'utf8');if(global.PLANT)__raw=global.PLANT(__raw,fn);const rd=JSON.parse(__raw).data.resultData.runData;
  const mk=W=>name=>{if(over&&over[name])return over[name](rd);const r=rd[name];const it=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=W.nodes.find(n=>n.name===name)||{};return {isExecuted:!!r,first:()=>it[0],all:()=>it,last:()=>it[it.length-1],item:it[0],params:nd.parameters||{}};};
  for(const n of nodes){if(!rd[n])continue;const src=rd[n][0].source&&rd[n][0].source[0];const prevName=src&&src.previousNode;const prev=prevName?mk(L)(prevName).all():[];const $i={all:()=>prev,first:()=>prev[0],item:prev[0]};
   const go=async(k,W)=>{try{return await new Function('$','$input','return (async()=>{\n'+S[n][k]+'\n})();')(mk(W),$i);}catch(e){return {ERR:String(e.message).slice(0,200)};}};
   const a=await go(0,L),b=await go(1,P);await each(fn.slice(2,7),n,a,b,rd);}}};
