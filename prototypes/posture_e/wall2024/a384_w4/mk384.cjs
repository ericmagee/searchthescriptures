// ASK 384 (plan 8097 rev 3, 8114, 8121): build the new REFP text from the live text. Only line 5 (BARE, rule R1) and line 20 (keys, rules R2 and R3) change; the line count stays 22.
const fs=require('fs');const R=fs.readFileSync(__dirname+'/refp_live.txt','utf8');const L=R.split('\n');if(L.length!==22)throw new Error('live REFP is not 22 lines');
const P=fs.readFileSync(__dirname+'/refp_proto.cjs','utf8');const bare=P.match(/ BARE=\/.*?\/(?=;\n)/s);if(!bare)throw new Error('proto BARE not found');
const ce=fs.readFileSync(__dirname+'/ce66.txt','utf8').trim();if(!/^[0-9,;]+$/.test(ce)||ce.split(';').length!==66)throw new Error('ce66 bad');
const old5=L[5];const i5=old5.indexOf(' BARE=');if(i5<0||!old5.endsWith(';'))throw new Error('line 5 shape');
L[5]=old5.slice(0,i5)+bare[0]+';';
const old20=' const keys=(t,o)=>{const cap=(o&&o.cap)||30;const out=[];for(const r of parse(t,o)){const b=r.book||r.ctx;if(!b)continue;const z=r.v2-r.v1>cap?r.v1:r.v2;for(let v=r.v1;v<=z;v++)out.push({key:b+\' \'+r.c+\':\'+v,pos:r.at,ref:b+\' \'+r.label});}return out;};';
if(L[20]!==old20)throw new Error('line 20 differs from expected live text');
L[20]=' const CE={};"'+ce+'".split(\';\').forEach((s,i)=>{CE[BOOKS[i]]=s.split(\',\').map(Number);});'
 +'const keys=(t,o)=>{const cap=(o&&o.cap)||30;const RF=o&&Array.isArray(o.refused)?o.refused:null,CT=o&&Array.isArray(o.cut)?o.cut:null;const out=[];for(const r of parse(t,o)){const b=r.book||r.ctx;if(!b)continue;'
 +'const mx=(CE[b]||[])[r.c-1];if(!mx||r.v1<1||r.v1>mx){if(RF)RF.push(b+\' \'+r.label);continue;}'
 +'let z=Math.min(r.v2,mx);if(z-r.v1+1>cap){z=r.v1+cap-1;if(CT)CT.push(b+\' \'+r.label+\' (cut at \'+cap+\')\');}'
 +'for(let v=r.v1;v<=z;v++)out.push({key:b+\' \'+r.c+\':\'+v,pos:r.at,ref:b+\' \'+r.label});}return out;};';
const N=L.join('\n');fs.writeFileSync(__dirname+'/refp_new.txt',N);
fs.writeFileSync(__dirname+'/refp_new.cjs',N+'\nmodule.exports=REFP;\n');fs.writeFileSync(__dirname+'/refp_old.cjs',R+'\nmodule.exports=REFP;\n');
console.log('old',R.length,'new',N.length,'lines',N.split('\n').length);
