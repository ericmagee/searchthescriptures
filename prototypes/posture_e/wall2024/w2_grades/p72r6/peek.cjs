const fs=require('fs');const D='/mnt/project-files/wall2024/';
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
(async()=>{const X=JSON.parse(fs.readFileSync(D+'parent_s145_P72r5.json','utf8'));const PW=(X.data||X).workflow||(X.data||X);const lib=PW.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const rd=JSON.parse(fs.readFileSync(D+'ex33371_full.json','utf8')).data.resultData.runData;const node='Judge Enforcer Build';
const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}};};
const src=rebuild(PW.nodes.find(n=>n.name===node).parameters.jsCode,lib);const inp=mk(rd[node][0].source[0].previousNode);const o=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,{all:()=>inp.all(),first:()=>inp.first(),item:inp.first()});
for(const it of o){const s=JSON.stringify(it.json);const k=s.indexOf('ruling 372): ');if(k>=0){console.log(Object.keys(it.json));console.log(s.slice(k-400,k+300));break;}}console.log('items',o.length,Object.keys(o[0].json));})();
