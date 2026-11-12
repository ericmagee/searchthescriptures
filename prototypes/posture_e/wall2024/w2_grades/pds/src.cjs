const fs=require('fs');const D='/mnt/project-files/wall2024/';
const ld=f=>{const X=JSON.parse(fs.readFileSync(D+f,'utf8'));return (X.data||X).workflow||(X.data||X);};
const src=(W,n)=>{const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const stub=W.nodes.find(x=>x.name===n).parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return stub;return new Function('$',stub.slice(0,i)+'\nreturn __S;')(q=>({params:{jsCode:lib}}));};
module.exports={ld,src};
if(require.main===module){const L=ld('fetchback_live_s146.json'),J=ld('parent_s146_JOINT_ESS_ERS.json');
for(const n of process.argv.slice(2)){const a=src(L,n).split('\n'),b=src(J,n).split('\n');const A=new Set(a),B=new Set(b);console.log('##',n,'lines',a.length,b.length,'chars',a.join('\n').length,b.join('\n').length);
 for(const l of b)if(!A.has(l))console.log(' +',l.slice(0,1500));for(const l of a)if(!B.has(l))console.log(' -',l.slice(0,600));}}
