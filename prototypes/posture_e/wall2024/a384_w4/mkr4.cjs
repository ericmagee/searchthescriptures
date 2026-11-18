// ASK 384 rev 4 target text (W1 Wall 8405): R1 narrow (lines 5 and 16 of refp_new4), R3 option b, R2 split 4a (book named: pass through) / 4b (book inferred: refused).
const fs=require('fs');const L=fs.readFileSync(__dirname+'/refp_new4.txt','utf8').split('\n');const ce=fs.readFileSync(__dirname+'/ce66.txt','utf8').trim();
L[20]=' const CE={};"'+ce+'".split(\';\').forEach((s,i)=>{CE[BOOKS[i]]=s.split(\',\').map(Number);});'
 +'const keys=(t,o)=>{const cap=(o&&o.cap)||30;const RF=o&&Array.isArray(o.refused)?o.refused:null,CT=o&&Array.isArray(o.cut)?o.cut:null;const out=[];for(const r of parse(t,o)){const b=r.book||r.ctx;if(!b)continue;let v2=r.v2;'
 +'if(!r.book){const mx=(CE[b]||[])[r.c-1];if(!mx||r.v1<1||r.v1>mx){if(RF)RF.push(b+\' \'+r.label);continue;}if(v2>mx)v2=mx;}' /* ASK 384 R2: a key whose book was inferred is refused past the chapter end; a named book passes through */
 +'let z=v2;if(z-r.v1>cap){z=r.v1+cap;if(CT)CT.push(b+\' \'+r.label+\' (cut at \'+(cap+1)+\')\');}' /* ASK 384 R3: a long range binds its first cap+1 verses */
 +'for(let v=r.v1;v<=z;v++)out.push({key:b+\' \'+r.c+\':\'+v,pos:r.at,ref:b+\' \'+r.label});}return out;};';
const N=L.join('\n');fs.writeFileSync(__dirname+'/refp_r4.txt',N);fs.writeFileSync(__dirname+'/refp_r4.cjs',N+'\nmodule.exports=REFP;\n');console.log('len',N.length,'lines',N.split('\n').length);
