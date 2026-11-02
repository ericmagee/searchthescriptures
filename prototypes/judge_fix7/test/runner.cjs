// judge_fix5 test runner: runs a Code node's file as n8n does (a function body), with $ stubbed from a map {nodeName: json | [json,...] | {all:[...]} }.
const fs=require('fs');const D=__dirname+'/../';
function stub(map){return name=>{if(!(name in map))return {isExecuted:false,first:()=>{throw new Error('node not stubbed: '+name);},all:()=>{throw new Error('node not stubbed: '+name);}};
 const v=map[name];const items=Array.isArray(v)?v.map(j=>({json:j})):[{json:v}];return {isExecuted:true,first:()=>items[0],all:()=>items,item:items[0]};};}
function runNode(v,node,map,input){const src=fs.readFileSync(D+v+'/'+node+'.js','utf8');const ex={id:'test',customData:{set:()=>{}}};
 const inp={first:()=>({json:input||{}}),all:()=>[{json:input||{}}]};return new Function('$','$input','$execution',src)(stub(map),inp,ex);}
const src=(v,node)=>fs.readFileSync(D+v+'/'+node+'.js','utf8');
// a top-level block of a node: from the start anchor to the end anchor (inclusive), evaluated with the names it defines returned
function block(v,node,a,b,names,pre){const s=src(v,node);const i=s.indexOf(a);const j=s.indexOf(b,i);if(i<0||j<0)throw new Error(node+': block not found '+a.slice(0,40));
 return new Function((pre||'')+s.slice(i,j+b.length)+'\n;const __g=n=>{try{return eval(n);}catch(e){return null;}};return {'+names.map(n=>n+':__g("'+n+'")').join(',')+'};')();}
const REFP_END='\n return {parse,keys,book,BK,BOOKS};})();';
const refp=(v,node)=>block(v,node,'const REFP=(()=>',REFP_END,['REFP']).REFP;
const run=n=>JSON.parse(fs.readFileSync(D+'data/run'+n+'.json','utf8'));
module.exports={runNode,stub,src,block,refp,run,D,REFP_END};
