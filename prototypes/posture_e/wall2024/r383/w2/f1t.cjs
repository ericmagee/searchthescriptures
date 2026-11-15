const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.env.TF,'utf8'));const N=W.nodes||W.data.nodes;
const T=N.find(n=>n.name==='Shared Library').parameters.jsCode;const LIB=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),MAP=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
const node=process.env.NODE||'Gate Build';const src=rb(MAP[node],LIB);
const mk=facts=>{const $=nm=>nm==='Assume Check Record'?{isExecuted:true,first:()=>({json:{acx:{facts}}}),all:()=>[{json:{acx:{facts}}}]}:{isExecuted:false,first:()=>({json:{}}),all:()=>[]};
 const fn=new Function('$','$input','items','$json','$node','$execution','$workflow','require','return {nsg:typeof nsgRefuse2024==="function"?nsgRefuse2024:null,ps:typeof psGrades==="function"?psGrades:null};\n'+src);return fn($,null,[],{},{},{},{},require);};
module.exports={mk};
