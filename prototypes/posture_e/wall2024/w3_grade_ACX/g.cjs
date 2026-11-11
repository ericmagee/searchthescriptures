// Offline grading of pkg ACX (parent_s120_ACX) vs baseline s120 on Panel Build and Build Independent Verdict. No network, no writes besides stdout.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const D='/mnt/project-files/wall2024/';
const J=f=>JSON.parse(fs.readFileSync(D+f,'utf8'));
const B=J('fetchback_live_s120.json'),C=J('parent_s120_ACX.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const NODES=['Panel Build','Build Independent Verdict'];
const find=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const k in o){const r=find(o[k]);if(r)return r;}}return null;};
const load=f=>find(J(f));
const cl=x=>JSON.parse(JSON.stringify(x));
const last=(rd,n)=>rd[n][rd[n].length-1].data.main;
const CEC='Close Enforcer Record',ACR='Anticheat Record';
const cec=rd=>last(rd,CEC)[0][0].json.cec, acx=rd=>last(rd,ACR)[0][0].json.acx;
const NAC=r=>r.status==='NOT A CONTRADICTION';
function strs(o,acc){if(typeof o==='string')acc.push(o);else if(o&&typeof o==='object')for(const k in o)strs(o[k],acc);return acc;}
function summarize(out){ if(out&&out.err)return {err:out.err,stack:out.stack};
  const S=strs(out,[]);const all=S.join('\n');const cnt=s=>all.split(s).length-1;
  const notes=S.filter(s=>s.includes('ANTI-CHEAT CHECK'));
  return {len:JSON.stringify(out).length,acNotes:cnt('[ANTI-CHEAT CHECK'),L24:cnt('earlier reading of Luke 2:4'),M119:cnt('earlier reading of Matthew 1:19'),
   promptLens:notes.map(s=>s.length)};}
async function both(rd,label,expected){
  const res={};
  for(const n of NODES){
    if(!rd[n]){res[n]={base:{len:0,acNotes:'n/a',L24:0,M119:0,promptLens:[]},cand:{len:0,acNotes:'n/a',L24:0,M119:0,promptLens:[]},equal:'NOT RUN (node absent)'};continue;}
    const ob=await run(code(B,n),n,cl(rd)),oc=await run(code(C,n),n,cl(rd));
    res[n]={base:summarize(ob),cand:summarize(oc),equal:JSON.stringify(ob)===JSON.stringify(oc)};
  }
  console.log('\n## '+label+'   EXPECTED: '+expected);
  for(const n of NODES){const r=res[n];const f=(s,x)=>x.err?s+' THROW/ERR: '+x.err:s+' len='+x.len+' notes='+x.acNotes+' Luke2:4='+x.L24+' Matt1:19='+x.M119+(x.promptLens.length?' promptLens='+x.promptLens.join(','):'');
    console.log(' '+n+'\n   '+f('base',r.base)+'\n   '+f('cand',r.cand)+'\n   equal='+r.equal);}
  return res;}
const NEWQ='UNRELATED TEXT ABOUT SOMETHING ELSE ENTIRELY';
(async()=>{
 const RD=load('ex34852_full.json');
 const c0=cec(RD),a0=acx(RD);
 const X1=c0.rows.find(NAC);
 console.log('PLANT FIELDS: cec = last(rd,"Close Enforcer Record")[0][0].json.cec ; rows[].{side,status,answer,closing_q,earlier_q}; the NAC row is id',X1.id,'side',X1.side,'closing_q',JSON.stringify(X1.closing_q));
 console.log('anticheat = last(rd,"Anticheat Record")[0][0].json.acx ; reversed.D[].{verse,close_q,earlier_q,answer,shown}; also rows[]');
 console.log('NAC rows in stored:',c0.rows.filter(NAC).map(r=>r.id).join(','),' reversed.D:',a0.reversed.D.map(r=>r.verse+' '+r.id).join(' | '),' reversed.C:',a0.reversed.C.length);
 const mut=f=>{const rd=cl(RD);f(cec(rd),acx(rd),rd);return rd;};
 const nacRow=c=>c.rows.find(NAC);
 const accRow=a=>a.reversed.D.find(r=>r.verse==='Luke 2:4');
 await both(RD,'P0 stored 34852','Luke 2:4 removed, Matthew 1:19 kept');
 await both(mut(c=>{nacRow(c).closing_q=nacRow(c).closing_q.toUpperCase().replace(/[,.]/g,'');}),'P1 closing_q upper-case, commas/periods stripped','still removed');
 await both(mut(c=>{const q=nacRow(c).closing_q;nacRow(c).closing_q=q.slice(0,Math.floor(q.length/2)).replace(/\s+\S*$/,'');console.log('   (P2 closing_q now: '+JSON.stringify(nacRow(c).closing_q)+')');}),'P2 closing_q first half only','kept');
 await both(mut(c=>{nacRow(c).status='CONFIRMED';}),'P3 NAC row status -> CONFIRMED (answer left NOT A CONTRADICTION)','kept');
 await both(mut(c=>{nacRow(c).answer='CONFIRMED';}),'P3b (extra) NAC row ANSWER -> CONFIRMED, status left NOT A CONTRADICTION','(no expectation)');
 for(const s of ['NOT CONFIRMED (form)','NOT CONFIRMED (conflicting answers)','NO ANSWER','NOT CHECKED','NOT A CANDIDATE'])
   await both(mut(c=>{nacRow(c).status=s;}),'P4 status -> '+s,'kept');
 await both(mut(c=>{const r=nacRow(c);r.earlier_q=r.closing_q;r.closing_q=NEWQ;}),'P5 closing_q unrelated, earlier_q = anticheat close sentence','kept');
 await both(mut(c=>{nacRow(c).side='CHALLENGER';}),'P6 NAC row side -> CHALLENGER (anticheat row stays D)','kept');
 await both(mut(c=>{const r=nacRow(c);c.rows.push({...cl(r),id:'X9',status:'CONFIRMED',answer:'CONFIRMED'});}),'P7 add 2nd row same closing_q CONFIRMED (original stays NAC; status left as planted)','(record only)');
 await both(mut(c=>{const r=nacRow(c);c.rows.push({...cl(r),id:'X9',status:'CONFIRMED',answer:'CONFIRMED'});r.answer='NOT A CONTRADICTION';c.rows[c.rows.length-1].status='NOT CONFIRMED (conflicting answers)';}),'P7b (extra) as the Record code would write it: the CONFIRMED copy is downgraded to NOT CONFIRMED (conflicting answers), original stays NAC','(record only)');
 await both(mut((c,a,rd)=>{last(rd,CEC)[0]=[];}),'P8a Close Enforcer Record output = empty item list','no throw, all kept, equal');
 await both(mut((c,a,rd)=>{}) && (()=>{const rd=cl(RD);delete rd[CEC];return rd;})(),'P8b Close Enforcer Record key deleted','no throw, all kept, equal');
 for(const e of ['','...']) await both(mut((c,a)=>{nacRow(c).closing_q='';const r=accRow(a);r.close_q=e;const rr=a.rows.find(x=>x.id===r.id);if(rr)rr.close_q=e;}),'P9 NAC closing_q "" and Luke 2:4 anticheat close_q '+JSON.stringify(e),'Luke 2:4 kept');
 await both(mut((c,a)=>{const r=accRow(a);r.answer='CONSISTENT';}),'P10a Luke 2:4 anticheat row answer -> CONSISTENT but left in acx.reversed.D','equal');
 await both(mut((c,a)=>{const r=accRow(a);a.reversed.D=a.reversed.D.filter(x=>x!==r);const rr=a.rows.find(x=>x.id===r.id);rr.answer='CONSISTENT';}),'P10b Luke 2:4 row answer CONSISTENT and removed from reversed (as the Record writes it)','equal');
 await both(mut((c,a)=>{const r=accRow(a);r.quotes_ok=false;r.close_ok=false;r.shown=false;r.note='QUOTE NOT FOUND';}),'P10c Luke 2:4 row QUOTE NOT FOUND, shown=false, left in reversed.D','equal');
 await both(mut(c=>{c.rows.filter(NAC).forEach(r=>{r.closing_q=NEWQ;});}),'P11 every NAC closing_q unrelated','equal byte for byte');
 for(const f of ['ex34726_full.json','ex34780_full.json']){
   console.log('\n### STEP 3 '+f);const rd=load(f);
   const have=n=>!!rd[n];console.log(' nodes present:',NODES.concat([CEC,ACR]).map(n=>n+'='+have(n)).join(' '));
   if(NODES.some(have)){ if(have(ACR))console.log(' acx reversed D/C:',JSON.stringify(Object.fromEntries(['D','C'].map(s=>[s,(last(rd,ACR)[0][0].json.acx.reversed||{})[s]&&last(rd,ACR)[0][0].json.acx.reversed[s].map(r=>r.verse)]))));
     if(have(CEC))console.log(' cec NAC rows:',(last(rd,CEC)[0][0].json.cec.rows||[]).filter(NAC).map(r=>r.closing_q));
     await both(rd,'P0 '+f,'(equal if no overlap)');}
 }
})();
