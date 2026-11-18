// ASK 381 (Wall 8075, 8082, 8085): psGrades reads "not X but Y" (X, Y grade words) at Y. Shared Library only; engine + child copy byte-equal. Offline.
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);const d=JSON.parse(fs.readFileSync(IN));
if(d.versionId!=='90451490-638d-41d1-abcd-899d9d6648b9')throw new Error('base is not s262: '+d.versionId);
const U=T.unpack(d);const L=U.L,M=U.M;
const O="const c=c0.replace(/\\bnone\\s+counted\\b/ig,' ')";
const GW="VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS";
const NEW="const c=c0.replace(/\\b(?:(?:are|is|were|was|be|been)\\s+)?(?:not|never)\\s+(?:"+GW+")\\s*,?\\s+but\\s+(?:(?:it\\s+is|is|are|rather)\\s+)?((?:not|never)\\s+)?("+GW+")\\b/ig,(x,ng,y)=>' '+(ng||'')+y+' ') /* ASK 381: \"not X but Y\" reads at Y */.replace(/\\bnone\\s+counted\\b/ig,' ')";
const hit=[];L.forEach((x,i)=>{const k=x.split(O).length-1;if(k){if(k!==1)throw new Error('L'+i+' count '+k);hit.push(i);}});
if(hit.length!==2)throw new Error('expected 2 lines, got '+hit);for(const i of hit)L[i]=L[i].replace(O,()=>NEW);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('lines patched',hit.join(','),'| MAP lengths changed',ch.length,ch.join(', '),'| lib sha',lsha);
