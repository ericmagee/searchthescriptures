const fs=require('fs');
function parseLib(code){const L=JSON.parse(code.slice(code.indexOf('\n/*LIB*/')+8,code.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(code.slice(code.lastIndexOf('\n/*MAP*/')+8,code.lastIndexOf('\n/*END*/')));return {L,M};}
function src(L,M,name){const m=M[name];return m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');}
module.exports={parseLib,src};
if(require.main===module){const code=fs.readFileSync(process.argv[2],'utf8');const {L,M}=parseLib(code);let ok=0,bad=0;for(const n of Object.keys(M)){const s=src(L,M,n);if(s.length===M[n].n)ok++;else{bad++;console.log('len',n,s.length,M[n].n);}}console.log('length match',ok,'bad',bad);}
