// Pull the module definitions the absence cure needs out of one rebuilt node source (s184 or patched), and evaluate them.
const fs=require('fs');const {parseLib,src}=require(__dirname+'/rebuild.cjs');
function block(A,start){const i=A.findIndex(x=>x.startsWith(start));if(i<0)throw new Error('no '+start);for(let j=i;j<Math.min(A.length,i+3000);j++){const t=A.slice(i,j+1).join('\n');try{new Function(t);return t;}catch(e){}}throw new Error('unclosed '+start);}
function load(code,node){const {L,M}=parseLib(code);const A=src(L,M,node).split('\n');const parts=[];
 for(const s of ['const L2C=(()=>{','const REFP=(()=>{'])parts.push(block(A,s));
 for(const x of A)if(/^function kkjv[A-Za-z]*\(/.test(x)||/^const KKJV_[A-Z_]*=/.test(x))parts.push(block(A,x));
 parts.push(block(A,'const ECL=(()=>{'));parts.push(block(A,'const ABS=(()=>{'));
 const s=parts.join('\n');return new Function('$','__L',s+'\nreturn {ABS,ECL};')(()=>{throw new Error('no $');},{});}
module.exports={load};
if(require.main===module){const m=load(fs.readFileSync(process.argv[2],'utf8'),process.argv[3]||'Send Back Record');console.log(Object.keys(m.ABS),Object.keys(m.ECL));}
