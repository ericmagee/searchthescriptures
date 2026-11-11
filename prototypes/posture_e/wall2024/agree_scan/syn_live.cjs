// E-SYN item text as live s143 builds it, for named synthesis sentences
const fs=require('fs');const [,,exF,...keys]=process.argv;const rd=JSON.parse(fs.readFileSync(exF,'utf8')).data.resultData.runData;
const mk=n=>{const r=rd[n];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}};};
(async()=>{const node='Judge Enforcer Build';const src=fs.readFileSync('w2_grades/ekr_live/pkgEKR/src/Judge_Enforcer_Build.new.js','utf8');const inp=mk(rd[node][0].source[0].previousNode);
const out=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,{all:()=>inp.all(),first:()=>inp.first(),item:inp.first()});
for(const i of out){const b=JSON.stringify(i.json.body||'');for(const k of keys){let p=0;while((p=b.indexOf(k,p))>=0){const s=b.lastIndexOf('ITEM Y',p);console.log('----',k,'\n',JSON.parse('\"'+b.slice(s,b.indexOf('ANSWER ID',p)).replace(/\\\\(?!n|")/g,'\\\\\\\\')+'\"').slice(0,1500));p+=k.length;break;}}}})();
