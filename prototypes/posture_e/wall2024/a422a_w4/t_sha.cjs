const fs=require('fs'),cr=require('crypto');const src=fs.readFileSync(__dirname+'/sha.js','utf8');const F=new Function(src+';return {__SHA422,__LIBSHA422};')();
const R=s=>cr.createHash('sha256').update(s).digest('hex');let bad=0;
for(const s of ['','abc','a'.repeat(55),'a'.repeat(56),'a'.repeat(64),'é‐—−😀 mixed ‐',String.fromCharCode(0xd800)+'x','x'+String.fromCharCode(0xdc00),String.fromCharCode(0xd800)])if(F.__SHA422(s)!==R(s)){bad++;console.log('DIFF',JSON.stringify(s));}
for(let i=0;i<200;i++){let s='';const n=Math.floor(Math.random()*300);for(let j=0;j<n;j++)s+=String.fromCharCode(Math.floor(Math.random()*0x10000));if(F.__SHA422(s)!==R(s))bad++;}
console.log('vectors+random differ',bad);
for(const f of process.argv.slice(2)){const w=JSON.parse(fs.readFileSync(f));const code=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const t0=Date.now();const x=F.__LIBSHA422(code);const ms=Date.now()-t0;const a=code.indexOf('\n/*LIB*/'),b=code.indexOf('\n/*MAP*/');console.log(f,'plain',x,'crypto',R(JSON.stringify(JSON.parse(code.slice(a+8,b)))).slice(0,16),'ms',ms,'header',(code.match(/library sha ([0-9a-f]{16})/)||[])[1]);}
