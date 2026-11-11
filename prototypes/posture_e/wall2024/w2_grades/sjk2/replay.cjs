// W2 grade of pkgSJK: (A) Build Save Body base vs SJK on every stored export, review_notes split into items; (B) new plants on 35067.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};
const P={base:L(process.env.BASE||'parent_s133_NBR2.json'),cand:L(process.env.CAND||'parent_s133_NBR2_SJK.json')};
const code=(k,n)=>P[k].nodes.find(x=>x.name===n).parameters.jsCode;
const predOf=n=>{for(const [s,o] of Object.entries(P.base.connections))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,over)=>{const lo=n=>{if(over&&n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];return {isExecuted:!!(rd[n]||(over&&n in over)),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const out=async(k,rd,over)=>{const n='Build Save Body';const [$,lo]=mk(rd,over);return (await runSrc(code(k,n),$,lo(predOf(n))||[]))[0].json;};
const rnOf=o=>{const s=JSON.stringify(o);const m=s.match(/"review_notes":"((?:[^"\\]|\\.)*)"/);return m?JSON.parse('"'+m[1]+'"'):'';};
const CT="CURED by the single judge's cure reply";
(async()=>{
console.log('== (A) replay');let T={items:0,changed:0,kw:0,s3:0,bad:0};
for(const e of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>f.match(/\d+/)[0]).sort()){
 const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;if(!rd['Build Save Body']){console.log(e,'no Build Save Body');continue;}
 let x,y;try{x=await out('base',rd);y=await out('cand',rd);}catch(er){console.log(e,'replay error',er.message);continue;}
 const sx=JSON.stringify(x),sy=JSON.stringify(y);const ra=rnOf(x),rb=rnOf(y);
 const sa=sx.split(JSON.stringify(ra).slice(1,-1)).join('@@RN@@'),sb=sy.split(JSON.stringify(rb).slice(1,-1)).join('@@RN@@');
 const SP=s=>s.split(/(?<=\]) (?=\[)|\n/);const la=SP(ra),lb=SP(rb);let ch=0,kw=0,s3=0,bad=0;
 for(let i=0;i<Math.max(la.length,lb.length);i++)if(la[i]!==lb[i]){ch++;const ok=la[i]&&lb[i]&&/REVIEW THIS ROW/.test(la[i])&&lb[i].includes(CT)&&/SINGLE JUDGE/.test(la[i]);if(!ok){bad++;console.log('   BAD',e,i,'\n    ',String(la[i]).slice(0,200),'\n    ',String(lb[i]).slice(0,200));}else if(/\(K-W;/.test(la[i]))kw++;else if(/\(S3;/.test(la[i]))s3++;else{bad++;console.log('   OTHER RULE',la[i].slice(0,160));}}
 console.log(e,'| fields outside review_notes equal',sa===sb,'| note lines',la.length,lb.length,'| changed',ch,'K-W',kw,'S3',s3,'bad',bad);T.items+=la.length;T.changed+=ch;T.kw+=kw;T.s3+=s3;T.bad+=bad;}
console.log('TOTAL',JSON.stringify(T));
if(process.env.NOPLANT)return;
console.log('== (B) plants on 35067');
const X=JSON.parse(fs.readFileSync(W+'ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const pn=predOf('Build Save Body');const src=Object.keys(rd).filter(n=>{const o=rd[n].slice(-1)[0].data.main[0]||[];return o.some(it=>it.json&&typeof it.json.independent_verdict_raw==='string');});
console.log('nodes holding independent_verdict_raw:',src.join(', '));
const base=out;const show=async(name,f,probe,exp)=>{const over={};for(const n of src){const o=JSON.parse(JSON.stringify(rd[n].slice(-1)[0].data.main[0]));o.forEach(it=>{if(it.json&&typeof it.json.independent_verdict_raw==='string')it.json.independent_verdict_raw=f(it.json.independent_verdict_raw);});over[n]=o;}
 const y=rnOf(await out('cand',rd,over)),x=rnOf(await out('base',rd,over));
 const st=s=>{const ls=s.split(/(?<=\]) (?=\[)|\n/).filter(l=>l.includes(probe));return ls.length?ls.map(l=>l.includes(CT)?'Cured':/REVIEW THIS ROW/.test(l)?'Review':'?').join(','):'missed';};
 const g=st(y);const pass=g===exp;console.log((pass?'OK  ':'FAIL')+' '+name+' | SJK: '+g+' | base: '+st(x)+' | expected '+exp);return pass;};
const IVs=src.map(n=>String(rd[n].slice(-1)[0].data.main[0][0].json.independent_verdict_raw));src.forEach((n,i)=>console.log('  ',n,IVs[i].length,(IVs[i].match(/DEBATE RULE VIOLATION REPORT/g)||[]).length));const IV=IVs.reduce((a,b)=>b.length>a.length?b:a);
const kwl=IV.split('\n').filter(l=>/\(K-W; ruling \d+\) -- .+? #\d+: /.test(l)&&/REVIEW THIS ROW/.test(l));const s3l=IV.split('\n').filter(l=>/\(S3; ruling/.test(l)&&/REVIEW THIS ROW/.test(l));
console.log('35067 single judge: K-W flags',kwl.length,'S3 flags',s3l.length);console.log('  K-W sample:',kwl[0]&&kwl[0].slice(0,220));console.log('  S3 sample:',s3l[0]&&s3l[0].slice(0,260));
const rep=IV.split('\n').filter(l=>/RULE: (K-W|K-S3); RESULT/.test(l));console.log('  reports',rep.length,'sample:',rep[0]&&rep[0].slice(0,260));
module.exports={show,IV,kwl,s3l,rep};
global.__G={show,IV,kwl,s3l,rep};if(process.env.PLANTS)await require(process.env.PLANTS)(global.__G);
})();
