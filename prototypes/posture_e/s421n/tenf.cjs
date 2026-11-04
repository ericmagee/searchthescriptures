const fs=require('fs');const [,,nodeFile,exf]=process.argv;const code=fs.readFileSync(nodeFile,'utf8');
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;
const out=n=>{const r=rd[n];if(!r)return null;return r.flatMap(x=>x.data.main[0]);};
const $=n=>{const items=out(n);return {isExecuted:!!items,first:()=>items[0],all:()=>items||[]};};
const j=new Function('$','$execution',code)($,{id:1})[0].json;const u=j.body.messages[1].content;
console.log('groups',j.groups,'answers',j.ids.length,'not found:',(u.match(/sentence not found/g)||[]).length,'unavailable:',(u.match(/round text not available/g)||[]).length);
