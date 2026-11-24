// find the full "const L2C=(()=>{ ... })();" statement: smallest prefix ending at "})()" (+";"?) that parses
const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
function cut(s){const i=s.indexOf('const L2C=(()=>{');if(i<0)return null;let j=i;
 while((j=s.indexOf('})()',j+1))>=0){let e=j+4;if(s[e]===';')e++;const st=s.slice(i,e);try{new Function(st);return {i,e,st};}catch(x){}}return null;}
module.exports={cut,md5};
if(require.main===module){const W=JSON.parse(fs.readFileSync(process.argv[2]||'/mnt/project-files/fairjudge/w4build/base_engine.json'));const by={};
for(const x of W.nodes){const s=x.parameters&&x.parameters.jsCode;if(!s||x.name==='Shared Library')continue;const c=cut(s);if(!c)continue;
 (by[md5(c.st)]=by[md5(c.st)]||{len:c.st.length,nodes:[]}).nodes.push(x.name);
 const ci=s.indexOf('const CAPC=');console.log(x.name.padEnd(18),c.i,c.e,c.st.length,md5(c.st),'CAPC',ci>c.i&&ci<c.e?'IN':ci<0?'none':'OUT','tail',JSON.stringify(c.st.slice(-150)));}
console.log(JSON.stringify(by,null,0));}
