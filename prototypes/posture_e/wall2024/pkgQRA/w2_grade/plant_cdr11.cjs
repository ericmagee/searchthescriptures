// W2 grade of pkgQRA rev 2 rebuilt on pkgCDR rev 11: plants where question-round answers meet pkgCDR's post-panel pairs (34299 fixture). Expectations written before the run.
//   node pkgQRA/w2_grade/plant_cdr11.cjs <pkgCDR rev 11 file> <stacked file>
const fs=require('fs');const [,,CDR,PAT]=process.argv;const ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const code=(f,nm)=>ld(f).nodes.find(n=>n.name===nm).parameters.jsCode;const FX=JSON.parse(fs.readFileSync(__dirname+'/../fixture_34299.json','utf8'));const clone=o=>JSON.parse(JSON.stringify(o));
const run=async(src,fx)=>{const $=nm=>{const has=Object.prototype.hasOwnProperty.call(fx,nm);return {isExecuted:has,first:()=>{if(!has)throw new Error('no data '+nm);return {json:fx[nm]};},all:()=>has?[{json:fx[nm]}]:[]};};
 return (await new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,{first:()=>({json:{}}),all:()=>[{json:{}}]}))[0].json;};
const base=()=>{const f=clone(FX);delete f['Judge Contradiction Build'];return f;};const CB=code(CDR,'Judge Contradiction Build'),PB=code(PAT,'Judge Contradiction Build');
const U=o=>(((o.body||{}).messages||[])[1]||{}).content||'';let ok=0,bad=0;const T=(id,w,c,x)=>{console.log((c?'OK   ':'FAIL ')+id+'  '+w+(x?'  ['+x+']':''));c?ok++:bad++;};
(async()=>{const c0=await run(CB,base()),p0=await run(PB,base());
 T('N1','candidates equal pkgCDR rev 11 (QRA changes none), J2 ordinary-means pair among them',JSON.stringify(c0.cands)===JSON.stringify(p0.cands)&&p0.cands.some(c=>c.id==='J2'&&/ordinary means/.test(c.earlier_q)),p0.cands.map(c=>c.id).join(','));
 const J2=p0.cands.find(c=>c.id==='J2');
 {const f=base();f['QR Merge'].qa.push({judge:'sol',side:'defender',round:J2.closing_round,quote:J2.closing_q,earlier_round:J2.earlier_round,earlier_quote:J2.earlier_q,question:'How do these agree?',answer:'They agree: the ordinary means is granted only of Cain.',finish:'stop'});const p=await run(PB,f);const u=U(p);
  T('N2','an answer on the J2 pair (added by pkgCDR) is printed and matched to J2',u.includes('the ordinary means is granted only of Cain')&&/ANSWER[^\n]*J2|J2[^\n]*ANSWER/.test(u.slice(u.indexOf('=== [CRQ'))),JSON.stringify(p.qra));
  T('N3','candidates still unchanged with that answer',JSON.stringify(p.cands)===JSON.stringify(c0.cands));}
 {const f=base();f['QR Merge'].qa.push({judge:'luna',side:'defender',round:'CR4',quote:'A sentence no judge named in CR4.',earlier_round:'CR3',earlier_quote:J2.earlier_q,question:'How do these agree?',answer:'They agree.',finish:'stop'});const p=await run(PB,f);
  T('N4','an answer sharing only the earlier quote of J2 is not matched to J2',!/ANSWER[^\n]*J2[^\n]*\n[^\n]*A sentence no judge named/.test(U(p)),JSON.stringify(p.qra));}
 console.log(ok+' OK, '+bad+' FAIL');})();
