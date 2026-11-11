// W2 grade of pkgNBR: (A) replay Format Markdown and Build Save Body, RVF vs RVF_NBR and s132 vs NBR, on every export;
// (B) planted flag forms on 35067 through RVF_NBR Format Markdown and Build Save Body.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;d=d.workflow||d;return d;};
const P={s132:L('fetchback_live_s132.json'),NBR:L('parent_s132_NBR.json'),RVF:L('parent_s132_RVF.json'),RVF_NBR:L('parent_s132_RVF_NBR.json')};
const code=(k,n)=>P[k].nodes.find(x=>x.name===n).parameters.jsCode;
const predOf=n=>{for(const [s,o] of Object.entries(P.s132.connections))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,over)=>{const lo=n=>{if(over&&n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];return {isExecuted:!!(rd[n]||(over&&n in over)),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const out=async(k,n,rd,over)=>{const [$,lo]=mk(rd,over);return (await runSrc(code(k,n),$,lo(predOf(n))||[]))[0].json;};
const text=(n,o)=>n==='Format Markdown'?String(o.md||''):String(JSON.stringify(o));
const rnOf=o=>{const s=JSON.stringify(o);const m=s.match(/"review_notes":"((?:[^"\\]|\\.)*)"/);return m?JSON.parse('"'+m[1]+'"'):'';};
(async()=>{
console.log('== (A) replay');
for(const e of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>f.match(/\d+/)[0]).sort()){
 const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
 for(const [b,c] of [['RVF','RVF_NBR'],['s132','NBR']])for(const n of ['Format Markdown','Build Save Body']){if(!rd[n])continue;
  let x,y;try{x=await out(b,n,rd);y=await out(c,n,rd);}catch(er){console.log(e,n,b,'replay error',er.message);continue;}
  if(n==='Format Markdown'){const RT=s=>s.replace(/^\*\*Run time:\*\*.*$/m,'**Run time:** (masked)');const la=RT(text(n,x)).split('\n'),lb=RT(text(n,y)).split('\n');let j=0,kept=0;const add=[];for(const l of lb){if(j<la.length&&l===la[j]){j++;kept++;}else add.push(l);}
   const isF=l=>/^\| (Review|Cured) flag/.test(l)&&/\[/.test(l);const addInner=add.filter(isF).length;const other=add.filter(l=>!isF(l));
   console.log(e,n,b+'->'+c,'| base lines kept in order',kept+'/'+la.length,'| added',add.length,'(flag rows with inner bracket',addInner+')','| other added lines',other.length,other.map(l=>l.slice(0,50)).slice(0,2).join(' || '));}
  else{const ka=Object.keys(x),diff=ka.filter(k=>JSON.stringify(x[k])!==JSON.stringify(y[k]));const ra=rnOf(x),rb=rnOf(y);
   const cnt=s=>(s.match(/SINGLE JUDGE/g)||[]).length;const fa={length:cnt(ra)},fb={length:cnt(rb)};const keptAll=rb.length>=ra.length;let pi=0;for(const ch of ra){pi=rb.indexOf(ch,pi);if(pi<0)break;pi++;}const sub=pi>=0;const added={filter:()=>[],length:fb.length-fa.length};
   console.log(e,n,b+'->'+c,'| fields differing',JSON.stringify(diff.map(k=>k.slice(0,30))),'| review_notes single-judge flag lines',fa.length,'->',fb.length,'| old review_notes is a subsequence of new',sub,'| added',added.length, '| saveBody length',JSON.stringify(x).length,'->',JSON.stringify(y).length);}}}
console.log('== (B) plants on 35067 (RVF_NBR)');
const X=JSON.parse(fs.readFileSync(W+'ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;const GJ=rd['Get Judgments'].slice(-1)[0].data.main[0];
const KW1='[AUDIT v30: WITHDRAWAL TO ANSWER (K-W; ruling 421) -- DEFENDER CR2 no link heading #1: ';
const base=GJ.find(x=>x.json.judge_seat==='luna').json.verdict_raw;const line=base.split('\n').find(l=>l.startsWith(KW1));
const plants=[
 ['N1 K-W item with [premise 1], report CURED with same item',v=>v.split('DEFENDER CR2 no link heading #1').join('DEFENDER CR2 LINK 6 [premise 1] #1'),'LINK 6 [premise 1] #1','Cured'],
 ['N2 same, report UNCURED',v=>v.split('DEFENDER CR2 no link heading #1').join('DEFENDER CR2 LINK 6 [premise 1] #1').replace('ITEM: DEFENDER CR2 LINK 6 [premise 1] #1; RULE: K-W; RESULT: CURED','ITEM: DEFENDER CR2 LINK 6 [premise 1] #1; RULE: K-W; RESULT: UNCURED'),'LINK 6 [premise 1] #1','Review'],
 ['N3 two bracket pairs in one flag',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "PRESSED: [DR2] premise 5 -- [CR3]". REVIEW THIS ROW.]','PRESSED: [DR2] premise 5 -- [CR3]','Review'],
 ['N4 bracket after REVIEW THIS ROW',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "x". REVIEW THIS ROW. See [CR3].]','See [CR3]','Review'],
 ['N5 parenthesised bracket (pressed: [DR2])',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ (pressed: [DR2] premise 5). REVIEW THIS ROW.]','(pressed: [DR2] premise 5)','Review'],
 ['N6 bold bracket **[CR3]**',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: **[CR3]** line. REVIEW THIS ROW.]','**[CR3]** line','Review'],
 ['N7 LIMIT two levels [[CR3]] (stored form)',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "PRESSED: LUKE 3:31 -- [[CR3]] -- x". REVIEW THIS ROW.]','LUKE 3:31 -- [[CR3]]','missed'],
 ['N8 LIMIT unclosed bracket "[THE" (stored form)',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "LUKE 3:31 \\"WHICH WAS [THE ". REVIEW THIS ROW.]','WHICH WAS [THE','missed'],
 ['N9 empty brackets []',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "x []". REVIEW THIS ROW.]','"x []"','Review'],
 ['N10 control: plain flag, no bracket',v=>v+'\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "plain control". REVIEW THIS ROW.]','plain control','Review'],
];
let ok=0;for(const [nm,f,probe,exp] of plants){const J=JSON.parse(JSON.stringify(GJ));const j=J.find(x=>x.json.judge_seat==='luna').json;j.verdict_raw=f(j.verdict_raw);
 const m=String((await out('RVF_NBR','Format Markdown',rd,{'Get Judgments':J})).md);const rows=m.split('\n').filter(l=>/^\| (Review|Cured) flag/.test(l)&&l.includes('(panel judge luna)')&&l.includes(probe));
 const m0=String((await out('RVF','Format Markdown',rd,{'Get Judgments':J})).md);const rows0=m0.split('\n').filter(l=>/^\| (Review|Cured) flag/.test(l)&&l.includes('(panel judge luna)')&&l.includes(probe));
 const got=rows.length?rows.map(l=>l.startsWith('| Cured')?'Cured':'Review').join(','):'missed';const pass=got===exp;if(pass)ok++;
 console.log((pass?'OK  ':'FAIL')+' '+nm+' | RVF_NBR: '+got+' | RVF (before): '+(rows0.length?rows0.map(l=>l.startsWith('| Cured')?'Cured':'Review').join(','):'missed')+' | expected '+exp);}
console.log('plants as expected',ok,'of',plants.length);
})();
