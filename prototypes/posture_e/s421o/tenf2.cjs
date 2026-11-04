const fs=require('fs');const [,,nodeFile,exf,probe]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;
const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const j=new Function('$','$execution',code)($,{id:1})[0].json;const u=j.body.messages[1].content;
console.log('groups',j.groups,'answers',j.ids.length,'prompt chars',u.length,'not found:',(u.match(/sentence was not found/g)||[]).length,'no block:',(u.match(/no block of this link/g)||[]).length);
u.split('\n\nITEM G').slice(1).forEach(x=>{const h=x.slice(0,x.indexOf('\n'));const bl=(x.match(/\n\[(?:CR|DR)\d\] /g)||[]).length+(x.match(/:\n\[(?:CR|DR)\d\] /g)||[]).length;console.log('  G'+h.slice(0,70),'| blocks',(x.match(/\[(?:CR|DR)\d\] /g)||[]).length,'| chars',x.length,x.includes('not found')?'NOT FOUND':'');});
if(probe){const i=u.indexOf(probe);const s=u.lastIndexOf('ITEM G',i);console.log('----\n'+u.slice(s,s+1800));}
