const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');
const api=new Function(src+';return {preCheckSide,preCheckBlock};')();
const r=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
console.log(api.preCheckBlock(r));
