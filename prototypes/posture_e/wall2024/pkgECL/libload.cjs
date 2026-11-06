const fs=require('fs');const P=__dirname+'/';
const LIBSRC=['src_REFP.js','src_L2C.js','src_kkjv.js','src_ECL.js'].map(f=>fs.readFileSync(P+f,'utf8')).join('\n');
module.exports={LIBSRC,load:($)=>new Function('$',LIBSRC+'\nreturn ECL;')($||(()=>{throw new Error('no $')})),
 data:(keys)=>{const D=JSON.parse(fs.readFileSync(P+'data_replay.json','utf8'));if(!keys)return {rows:D.kjv,ow:D.ow,lex:D.lex};const K=new Set(keys);const k=r=>r.book+' '+r.chapter+':'+r.verse;return {rows:D.kjv.filter(r=>K.has(k(r))),ow:D.ow.filter(r=>K.has(k(r))),lex:D.lex};}};
