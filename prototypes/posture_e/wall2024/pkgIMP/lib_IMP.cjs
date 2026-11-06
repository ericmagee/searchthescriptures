// pkgIMP test helper: IMP with the pkgECL layer count (pkgECL/libload.cjs) and its replay verse data as the context.
const fs=require('fs');const L=require('../pkgECL/libload.cjs');const ECL=L.load(()=>({isExecuted:false}));const D=L.data();
const IMP=new Function('ECL',fs.readFileSync(__dirname+'/src_IMP.js','utf8')+'\nreturn IMP;')(ECL);
module.exports={...IMP,ctx:{rows:D.rows,ow:D.ow,lex:D.lex}};
