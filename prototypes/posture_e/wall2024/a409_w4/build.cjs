// ASK 409 build (plan W3 8738, rev 2 8741; W2 8739, W1 8740, W4 8743). Hold the REFP block once in the Shared Library.
// Shared Library: MAP gains "REFP" {n:8133,p:[[490,511]]}; no library line changes (library sha unchanged).
// 30 nodes: the inline block is replaced by one loader declaration (one text in all 30). D1 Build and C1 Build: the block is deleted (declared, never read).
// Usage: node a409/build.cjs IN OUT
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const ENT={n:8133,p:[[490,511]]};const REF=T.rb(U.L,ENT);
if(REF.length!==8133||cr.createHash('md5').update(REF).digest('hex')!=='37d0a6bd75175086cc89d22a9fbb5c2a')throw new Error('library lines 490-511 do not rebuild the REFP block');
if(U.M.REFP)throw new Error('MAP already holds REFP');
U.M.REFP=ENT;
const lib=d.nodes.find(n=>n.name==='Shared Library');lib.parameters.jsCode=U.hdr+'\n/*LIB*/'+JSON.stringify(U.L)+'\n/*MAP*/'+JSON.stringify(U.M)+U.tail;
const LOADER="const REFP=(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/'))).REFP;if(!M)throw new Error('pkgREFP: the Shared Library holds no REFP entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('pkgREFP: rebuilt REFP is '+S.length+', expected '+M.n);return new Function(S+'\\nreturn REFP;')();})($('Shared Library').params.jsCode); /* ASK 409: the REFP block is held once, in the Shared Library under the MAP key REFP */";
const DEL=new Set(['D1 Build','C1 Build']);const rep=[],del=[];
for(const n of d.nodes){const j=n.parameters&&n.parameters.jsCode;if(typeof j!=='string'||n.name==='Shared Library')continue;const k=j.split(REF).length-1;if(!k)continue;if(k!==1)throw new Error(n.name+': '+k+' copies');
 if(DEL.has(n.name)){const s=j.replace(REF,()=>'');if(/\bREFP\b/.test(s))throw new Error(n.name+' reads REFP');n.parameters.jsCode=s;del.push(n.name);}
 else{n.parameters.jsCode=j.replace(REF,()=>LOADER);rep.push(n.name);}
 acorn.parse(n.parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}
if(rep.length!==30||del.length!==2)throw new Error('counts '+rep.length+'/'+del.length);
fs.writeFileSync(OUT,JSON.stringify(d));console.log('loader nodes',rep.length,'| deleted in',del.join(', '),'| MAP REFP',JSON.stringify(ENT),'| loader length',LOADER.length,'| lib length',lib.parameters.jsCode.length);
