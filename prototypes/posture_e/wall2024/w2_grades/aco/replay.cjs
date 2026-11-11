// W2 grade of pkgACO: Build Independent Verdict, Cure Build and Build Save Body (s135 code) with Anticheat Record hidden (live today) and present (after pkgACO),
// on every export; then fresh plants of the Anticheat Record.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
let D=JSON.parse(fs.readFileSync(W+'fetchback_live_s135.json','utf8'));D=D.data||D;D=D.workflow||D;
const code=n=>D.nodes.find(x=>x.name===n).parameters.jsCode;
const predOf=n=>{for(const [s,o] of Object.entries(D.connections))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,over,hide)=>{const lo=n=>{if(hide&&hide.includes(n))return null;if(over&&n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};
 return [n=>{const o=lo(n)||[];const nd=D.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const run=async(n,rd,over,hide)=>{const [$,lo]=mk(rd,over,hide);return await runSrc(code(n),$,lo(predOf(n))||[]);};
const TM=s=>s.replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z/g,'<now>');
const HIDE=['Anticheat Record','Anticheat Build'];
const msgs=o=>{const b=o[0].json.verdictBody||o[0].json.body;return b.messages;};
const diffLines=(a,b)=>{const la=a.split('\n'),lb=b.split('\n');let j=0;const add=[];for(const l of lb){if(j<la.length&&l===la[j])j++;else add.push(l);}return {sub:j===la.length,add};};
const rnOf=o=>{const s=JSON.stringify(o);const m=s.match(/"review_notes":"((?:[^"\\]|\\.)*)"/);return m?JSON.parse('"'+m[1]+'"'):'';};
async function one(e,rd,over,label){
 const oldB=await run('Build Independent Verdict',rd,over,HIDE),newB=await run('Build Independent Verdict',rd,over,null);
 const st=rd['Build Independent Verdict']?rd['Build Independent Verdict'].slice(-1)[0].data.main[0]:null;
 const eqStored=st?TM(JSON.stringify(oldB.map(x=>x.json)))===TM(JSON.stringify(st.map(x=>x.json))):null;
 const mo=msgs(oldB),mn=msgs(newB);let rep=[];
 if(mo.length!==mn.length)rep.push('MESSAGE COUNT DIFFERS');
 const ko=Object.keys(oldB[0].json).filter(k=>JSON.stringify(oldB[0].json[k])!==JSON.stringify(newB[0].json[k]));
 let added=[],sub=true;mo.forEach((m,i)=>{const d=diffLines(String(m.content),String(mn[i].content));if(!d.sub)sub=false;added=added.concat(d.add.map(l=>i+':'+m.role+': '+l));});
 const acx=(over&&over['Anticheat Record']||rd['Anticheat Record'].slice(-1)[0].data.main[0])[0].json.acx;
 // Cure Build fed the new Build Independent Verdict: is the new Verdict request still an exact prefix of the cure request?
 let cureNote='no Cure Build run';if(rd['Cure Build']){const cb=await run('Cure Build',rd,Object.assign({},over,{'Build Independent Verdict':newB}),null);const c=cb[0].json.cure&&cb[0].json.cure.body;if(c){const vs=JSON.stringify(mn),cs=JSON.stringify(c.messages);cureNote='cure messages start with the new verdict messages: '+cs.startsWith(vs.slice(0,-1))+' ('+c.messages.length+' vs '+mn.length+' messages)';}}
 // Build Save Body
 let bsNote='no Build Save Body run';if(rd['Build Save Body']){const o=(await run('Build Save Body',rd,over,HIDE))[0].json,n=(await run('Build Save Body',rd,over,null))[0].json;const ra=rnOf(o),rb=rnOf(n);const other=Object.keys(o).filter(k=>TM(JSON.stringify(o[k]))!==TM(JSON.stringify(n[k]))&&!JSON.stringify(o[k]).includes(JSON.stringify(ra).slice(1,40)));
  const cnt=s=>(s.match(/ANTI-CHEAT/g)||[]).length;bsNote='review_notes ANTI-CHEAT mentions '+cnt(ra)+' -> '+cnt(rb)+' | old notes a prefix/subsequence of new: '+(rb.startsWith(ra)||rb.includes(ra))+' | other fields differing: '+JSON.stringify(other.filter(k=>k!=='review_notes'))+' | added '+(rb.length-ra.length)+' chars';}
 console.log('==',label,'| AR counts',JSON.stringify({rev:acx.counts&&acx.counts.reversed,shown:acx.counts&&acx.counts.shown,qnf:acx.counts&&acx.counts.quote_not_found,skipped:acx.skipped,record_only:acx.record_only}),'| hidden == stored:',eqStored,'| BIV fields differing',JSON.stringify(ko),'| old text kept in order:',sub,'| added lines',added.length,'chars',added.reduce((s,l)=>s+l.length,0));
 added.forEach(l=>console.log('    +',l.slice(0,230)));console.log('   ',cureNote);console.log('   ',bsNote);return {added,newB};}
module.exports={one,run,mk};
if(require.main===module)(async()=>{for(const e of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>f.match(/\d+/)[0]).sort()){const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
 if(!rd['Build Independent Verdict']||!rd['Anticheat Record']){console.log('==',e,'BIV',!!rd['Build Independent Verdict'],'AR',!!rd['Anticheat Record'],'(skipped)');continue;}
 try{await one(e,rd,null,e);}catch(er){console.log('==',e,'ERROR',er.message);}}})();
