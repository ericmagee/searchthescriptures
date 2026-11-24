// ASK 581 (W1): LAY before and after, rebuilt from the Shared Library of the base and target engine files named by env BASE_E and TARGET_E (MAP LAY, length checked).
const fs=require('fs');
const lay=f=>{const T=JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/'))).LAY;
 const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('LAY length '+S.length+' != '+M.n+' in '+f);return S;};
const base=lay(process.env.BASE_E),after=lay(process.env.TARGET_E);const mk=S=>new Function('$',S+'\nreturn LAY;')(undefined);
module.exports={B:mk(base),A:mk(after),base,after};
