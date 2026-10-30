const fs=require('fs');
const getD=src=>{const out=[];const re=/const D=('(?:[^'\\]|\\.)*');/g;let m;while((m=re.exec(src)))out.push(new Function('return '+m[1])());return out;};
let diffs=0,sites=0;
for(const f of ['Alternate_Payloads.js','Extract_Independent_Verdict.js','Panel_Payloads.js']){
 const A=getD(fs.readFileSync('old/'+f,'utf8')),B=getD(fs.readFileSync('new/'+f,'utf8'));if(A.length!==B.length)throw f;
 for(let n=0;n<A.length;n++){sites++;
  const pats=[[A[n],B[n]],['[\\s:'+A[n].slice(3,-1)+']','[\\s:'+B[n].slice(3,-1)+']']];
  for(const [pa,pb] of pats){const ra=new RegExp(pa),rb=new RegExp(pb);for(let c=0;c<=0x2FFF;c++){const s=String.fromCodePoint(c);if(ra.test(s)!==rb.test(s))diffs++;}}}}
const ra=/;|\.(?=\s)|--|—/;const nb=fs.readFileSync('new/Alternate_Build.js','utf8');const lit=nb.match(/pre\.split\((\/;\|[^\n]*?--\|—\/)\)/)[1];const rlit=new Function('return '+lit)();
const specs=['a; b','a. b','a -- b','a — b','x—y. z; w'];let sd=0;for(const s of specs)if(JSON.stringify(s.split(ra))!==JSON.stringify(s.split(rlit)))sd++;
console.log('D sites',sites,'(D and its SEP slice) classification diffs over 0..0x2FFF:',diffs,'| form (a) split diffs',sd,'of',specs.length);
