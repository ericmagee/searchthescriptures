// gate/replay.cjs: the one required replay gate for every library change (W1, item 2 of the list Eric approved 11-09, Wall 3627).
// Usage (from wall2024/):
//   node gate/replay.cjs --base pkgLIB/strip_A --cand pkgLIB/strip_B [--targets pkgX/targets.json] [--ms 60000] [--jobs 4] [--runs 34016,33846 | none]
//        [--fb <fetchback>] [--cases gate/cases] [--out pkgX/gate_B.txt]
// What it does, for every saved run in /mnt/project-files/wall2024/inputs (a run with an <run>_index.json) and every near-miss case:
//  1. CHAIN REPLAY. The library nodes (the strip folder's 30 sources) run in dependency order on the run's saved inputs, once with the base sources
//     and once with the candidate sources. A library node reads the recomputed output of every library node upstream of it (through $input and $()),
//     so a change in a Normalize node reaches Panel Cure Check, Cure Check, the Merge nodes and the Gate Records. Non-library nodes keep their saved output.
//  2. BYTE-EQUAL. Each node's base and candidate output are compared (timestamps ignored). Equal is the expected result.
//  3. ITEM CHECK (W2's unasked-item check, through Panel Cure Check and every other library node). Every item row in a node's output (an object with a
//     rule and an item or link, e.g. enforcer_log rows, summary cure and drv rows) is compared field by field. A changed, new or missing row is
//     allowed only when it matches a target in --targets; every other change FAILS. Outside item rows, every changed text line (strings are
//     compared line by line) FAILS unless it matches a targets.allow_lines entry (e.g. the audit line of a targeted item).
//  4. NEAR-MISS CASES (gate/cases/*.json, the shared trick-line set). Each case edits a judge reply in a saved run, replays the chain, and states
//     the item results the candidate must give. Every case must pass on the candidate. A case that carries its own "targets" (same form as
//     --targets) also goes through step 3, so an edit aimed at one item must not move any other; a case without targets is judged by its checks.
//  5. TIME LIMIT. Each node run (one node, one side, one run or case) has --ms milliseconds (default 60000). A run that goes over is stopped
//     (the worker thread is terminated, so even an endless loop stops) and reported as TIMEOUT with the node and side; that is a FAIL.
// targets.json: {"why":"...","items":[{"rule":"K-RUL","item":"regex","link":"regex","seat":"luna","run":"34016","node":"regex","field":"cure_status"}],
//                "allow_lines":[{"node":"regex","re":"ITEM: keystone; RULE: K-RUL"}]}  allow_lines tests each changed line, prefixed "- " (base) or "+ " (cand); optional "path" regex on the value's path  every key of an item target is optional; strings other than rule/seat/run/field are regexes; item is tested against the row's item, or its link when it has no item.
// Exit code 0 only when there is no FAIL.
const fs=require('fs'),path=require('path'),os=require('os');const {Worker,isMainThread,parentPort,workerData}=require('worker_threads');
const W=path.resolve(__dirname,'..');const D='/mnt/project-files/wall2024/inputs/';
const STRIP=(x,k)=>JSON.stringify(x,(k2,v)=>(k2==='at'||k2==='created_at'||k2==='t0')?undefined:v);

if(isMainThread){
 const A={};for(let i=2;i<process.argv.length;i+=2)A[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
 if(!A.base||!A.cand){console.error('usage: node gate/replay.cjs --base pkgLIB/strip_A --cand pkgLIB/strip_B [--targets t.json] [--ms 60000] [--jobs 4] [--runs a,b] [--cases dir] [--out file]');process.exit(2);}
 const FB=path.resolve(A.fb||fs.readFileSync(__dirname+'/LIVE','utf8').trim());const MS=+(A.ms||60000);const JOBS=+(A.jobs||Math.max(1,Math.min(4,os.cpus().length)));
 const TG=A.targets?JSON.parse(fs.readFileSync(A.targets,'utf8')):{};TG.items=TG.items||[];TG.allow_lines=TG.allow_lines||[];
 const files=[...new Set([...fs.readdirSync(A.base+'/patched'),...fs.readdirSync(A.cand+'/patched')])].filter(f=>f.endsWith('.js')&&f!=='Shared_Library.js').sort();
 const src={};for(const f of files){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const rd=d=>fs.existsSync(d+'/patched/'+f)?fs.readFileSync(d+'/patched/'+f,'utf8'):null;src[nm]={base:rd(A.base),cand:rd(A.cand)};}
 const LIB=Object.keys(src);const WF=JSON.parse(fs.readFileSync(FB,'utf8'));const C=WF.connections;
 const feeders=nm=>Object.entries(C).filter(([k,v])=>JSON.stringify(v).includes('"node":"'+nm+'"')).map(([k])=>k);
 const FEED={};const DEP={};for(const nm of LIB){FEED[nm]=feeders(nm);const reads=new Set();for(const s of [src[nm].base,src[nm].cand])if(s)for(const m of s.matchAll(/\$\('([^']+)'\)/g))reads.add(m[1]);
  DEP[nm]=[...new Set([...FEED[nm],...reads])].filter(x=>x!==nm&&LIB.includes(x));}
 const ORDER=[];const seen=new Set(),on=new Set();const visit=n=>{if(seen.has(n))return;if(on.has(n))return;on.add(n);DEP[n].forEach(visit);on.delete(n);seen.add(n);ORDER.push(n);};LIB.forEach(visit);
 const runs=(A.runs==='none'?[]:A.runs?A.runs.split(','):fs.readdirSync(D).filter(f=>/^\d+_index\.json$/.test(f)).map(f=>f.split('_')[0])).sort();
 const CD=A.cases||W+'/gate/cases';const cases=fs.existsSync(CD)?fs.readdirSync(CD).filter(f=>f.endsWith('.json')).sort().flatMap(f=>JSON.parse(fs.readFileSync(CD+'/'+f,'utf8')).map(c=>({...c,file:f}))):[];
 const jobs=[...runs.map(r=>({kind:'run',run:r,id:r})),...cases.map(c=>({kind:'case',run:c.run,id:c.file+' '+c.id,edits:c.edits,checks:c.checks,targets:c.targets||null}))];
 const out=[];const log=s=>{out.push(s);console.log(s);};let fails=0;const F=m=>{fails++;log('FAIL '+m);};
 log('gate/replay: base '+A.base+', cand '+A.cand+', fetch-back '+path.basename(FB)+', '+LIB.length+' library nodes, '+runs.length+' saved runs, '+cases.length+' near-miss cases, time limit '+MS+' ms per node run');
 const res=[];let next=0;
 const startOne=()=>{if(next>=jobs.length)return null;const job=jobs[next++];return new Promise(done=>{
   const w=new Worker(__filename,{workerData:{job,ORDER,FEED,src,D},resourceLimits:{maxOldGenerationSizeMb:3072}});let timer=null,cur=null,fin=false;
   const end=r=>{if(fin)return;fin=true;clearTimeout(timer);w.terminate();res.push({job,...r});done();};
   w.on('message',m=>{if(m.t==='case'){cur=m;clearTimeout(timer);timer=setTimeout(()=>end({timeout:cur}),MS);}else if(m.t==='done')end({r:m.r});});
   w.on('error',e=>end({error:String(e&&e.stack||e)}));w.on('exit',c=>{if(!fin)end({error:'worker exited '+c+(cur?' during '+cur.node+' ('+cur.side+')':'')});});});};
 const pool=async()=>{let p;while((p=startOne()))await p;};
 (async()=>{await Promise.all(Array.from({length:JOBS},pool));
  res.sort((a,b)=>jobs.indexOf(a.job)-jobs.indexOf(b.job));
  const match=(t,row,node,run)=>(!t.rule||t.rule===row.rule)&&(!t.seat||t.seat===row.seat)&&(!t.run||t.run===run)&&(!t.item||new RegExp(t.item).test(row.item||row.link||''))&&(!t.link||new RegExp(t.link).test(row.link||''))&&(!t.node||new RegExp(t.node).test(node));
  let nr=0,eq=0,tgt=0,cOK=0;
  for(const x of res){const tag=x.job.kind==='run'?'run '+x.job.id:'case '+x.job.id;
   if(x.timeout){F(tag+': TIMEOUT after '+MS+' ms in '+x.timeout.node+' ('+x.timeout.side+')');continue;}
   if(x.error){F(tag+': '+x.error.split('\n')[0]);continue;}
   const caseInfo=x.job.kind==='case'&&!x.job.targets;let infoN=0; /* a case without its own targets is judged by its checks only; its item changes are counted, not failed */
   const TGx=x.job.kind==='case'&&x.job.targets?{items:[...TG.items,...(x.job.targets.items||[])],allow_lines:[...TG.allow_lines,...(x.job.targets.allow_lines||[])]}:TG;
   for(const n of x.r.nodes){nr++;if(caseInfo&&!n.err&&!n.same){infoN+=n.rows.length+(n.outside||[]).length;continue;}if(n.err){if(n.err.base!==n.err.cand)F(tag+' '+n.node+': errors differ (base '+n.err.base+' | cand '+n.err.cand+')');else eq++;continue;}
    if(n.same){eq++;continue;}
    let bad=0;for(const d of n.rows){const ok=TGx.items.some(t=>match(t,d.row,n.node,x.job.run)&&(!t.field||d.fields.every(f=>f===t.field)));
     if(ok){tgt++;log('   target '+tag+' '+n.node+' '+d.desc);}else{bad++;F(tag+' '+n.node+' unasked item changed: '+d.desc);}}
    const rest=(n.outside||[]).filter(l=>!TGx.allow_lines.some(a=>(!a.node||new RegExp(a.node).test(n.node))&&(!a.path||new RegExp(a.path).test(l.path))&&(!a.re||new RegExp(a.re).test(l.line))));
    const allowed=(n.outside||[]).length-rest.length;if(allowed)log('   target '+tag+' '+n.node+': '+allowed+' changed text line(s) match allow_lines');
    rest.slice(0,8).forEach(l=>F(tag+' '+n.node+': output changed outside item rows at '+l.path.slice(0,80)+': '+l.line.slice(0,200)));if(rest.length>8)F(tag+' '+n.node+': '+(rest.length-8)+' more changed lines outside item rows');}
   if(caseInfo&&infoN)log('   info '+tag+': '+infoN+' changed item rows or text lines (the case sets no targets, so its checks decide)');
   if(x.job.kind==='case')for(const c of x.r.checks){if(c.ok)cOK++;else F(tag+' check: '+c.desc);if(c.ok)log('OK   '+tag+': '+c.desc);}}
  log('node runs '+nr+', byte-equal or same error '+eq+', target item changes '+tgt+', near-miss checks passed '+cOK);
  log(fails?'GATE FAIL ('+fails+')':'GATE PASS');if(A.out)fs.writeFileSync(A.out,out.join('\n')+'\n');process.exit(fails?1:0);})();
}else{
 const {job,ORDER,FEED,src,D}=workerData;const {harness}=require(W+'/pkgGSL/harness.cjs');
 const saved=n=>D+job.run+'_'+n.replace(/ /g,'_')+'.json';
 const edited={};if(job.edits){for(const fn of fs.readdirSync(D).filter(x=>x.startsWith(job.run+'_')&&!/_index(_\w+)?\.json$/.test(x))){const raw=fs.readFileSync(D+fn,'utf8');
   const ap=s=>job.edits.reduce((t,e)=>t.replace(new RegExp(e.find,e.flags||'g'),e.replace),s);if(!job.edits.some(e=>e.where?raw.includes(e.where):new RegExp(e.find,(e.flags||'g').replace('g','')).test(raw)))continue; /* fast skip: the file's raw JSON text must show the edit (give "where", a plain literal, when the find needs characters JSON escapes) */
   const d=JSON.parse(raw);const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;const it=(m&&m[0])||[];const s0=JSON.stringify(it);
   const ed=JSON.parse(s0,(k,v)=>typeof v==='string'?ap(v):v);if(JSON.stringify(ed)!==s0)edited[fn.slice(job.run.length+1,-5).replace(/_/g,' ')]=ed;}
  if(job.edits.length&&!Object.keys(edited).length)throw new Error('near-miss case edits matched nothing in run '+job.run);}
 const rowsOf=o=>{const r=[];const w=(x,ctx,p)=>{if(Array.isArray(x)){x.forEach((y,i)=>w(y,ctx,p+'[]'));return;}if(!x||typeof x!=='object')return;
   const c={...ctx};for(const k of ['seat','judge_model','seat_role','kind','side'])if(typeof x[k]==='string')c[k]=x[k];
   if(typeof x.rule==='string'&&(x.item||x.link))r.push({key:[p,c.seat||'',c.judge_model||'',c.kind||'',x.rule,x.side||c.side||'',x.item||'',x.link||''].join('|'),row:{...x,seat:x.seat||c.seat}});
   for(const k in x)w(x[k],c,p+'.'+k);};w(o,{},'');return r;};
 const one=async(side)=>{const over={...edited};const H=harness(job.run,over);const outs={};
  for(const nm of ORDER){const code=src[nm][side];if(code===null){outs[nm]={err:'(node absent on this side)'};continue;}
   if(!fs.existsSync(saved(nm))&&!(nm in over))continue; /* the node did not run in this saved run */
   const fe=FEED[nm];const inp=[...fe.filter(x=>x in over&&!(x in edited)),...fe.filter(x=>/Call/.test(x)),...fe].find(x=>x in over||fs.existsSync(saved(x)));
   if(!inp)continue;parentPort.postMessage({t:'case',node:nm,side});
   try{let o=H(code,inp);o=await o;outs[nm]={o};over[nm]=o;}catch(e){outs[nm]={err:String(e&&e.message||e).slice(0,120)};}}
  return outs;};
 (async()=>{const a=await one('base'),b=await one('cand');const nodes=[];
  for(const nm of ORDER){if(!(nm in a)&&!(nm in b))continue;const x=a[nm]||{err:'(not run)'},y=b[nm]||{err:'(not run)'};
   if(x.err||y.err){nodes.push({node:nm,err:{base:x.err||'(output)',cand:y.err||'(output)'}});continue;}
   const sa=STRIP(x.o),sb=STRIP(y.o);if(sa===sb){nodes.push({node:nm,same:true});continue;}
   const ra=new Map(rowsOf(x.o).map(r=>[r.key,r.row])),rb=new Map(rowsOf(y.o).map(r=>[r.key,r.row]));const rows=[];
   for(const [k,r] of rb){const o=ra.get(k);if(!o){rows.push({row:r,fields:['(new)'],desc:'NEW '+r.rule+' '+(r.seat||'')+' '+(r.item||r.link)+' '+(r.cure_status||r.status||'')});continue;}
    const fs2=[...new Set([...Object.keys(o),...Object.keys(r)])].filter(f=>f!=='at'&&STRIP(o[f])!==STRIP(r[f]));
    if(fs2.length)rows.push({row:r,fields:fs2,desc:r.rule+' '+(r.seat||'')+' '+(r.item||r.link)+': '+fs2.map(f=>f+' '+String(STRIP(o[f])).slice(0,60)+' -> '+String(STRIP(r[f])).slice(0,60)).join('; ')});}
   for(const [k,r] of ra)if(!rb.has(k))rows.push({row:r,fields:['(gone)'],desc:'GONE '+r.rule+' '+(r.seat||'')+' '+(r.item||r.link)+' '+(r.cure_status||r.status||'')});
   const blank=o=>{const z=JSON.parse(STRIP(o));const w=x=>{if(Array.isArray(x)){for(let i=x.length-1;i>=0;i--){const y=x[i];if(y&&typeof y==='object'&&!Array.isArray(y)&&typeof y.rule==='string'&&(y.item||y.link))x.splice(i,1);else w(y);}}else if(x&&typeof x==='object')for(const k in x)w(x[k]);};w(z);return JSON.stringify(z);};
   const leaves=o=>{const L=new Map();const w=(x,p)=>{if(Array.isArray(x))x.forEach((y,i)=>w(y,p+'['+i+']'));else if(x&&typeof x==='object')for(const k in x)w(x[k],p+'.'+k);else{if(typeof x==='string'&&/^\s*[\[{]/.test(x)){let j;try{j=JSON.parse(x);}catch(e){}if(j&&typeof j==='object'){w(j,p+'<json>');return;}}L.set(p,String(x));}};w(JSON.parse(blank(o)),'');return L;};
   const la=leaves(x.o),lb=leaves(y.o);const lines=[];
   for(const k of new Set([...la.keys(),...lb.keys()])){const u=la.get(k),v=lb.get(k);if(u===v)continue;
    if(u===undefined||v===undefined){lines.push({path:k,line:(u===undefined?'+ ':'- ')+String(u===undefined?v:u).slice(0,200)});continue;}
    const A2=u.split('\n'),B2=v.split('\n');const cA=new Map();A2.forEach(l=>cA.set(l,(cA.get(l)||0)+1));const cB=new Map();B2.forEach(l=>cB.set(l,(cB.get(l)||0)+1));
    for(const [l,c] of cA)if((cB.get(l)||0)<c)lines.push({path:k,line:'- '+l});for(const [l,c] of cB)if((cA.get(l)||0)<c)lines.push({path:k,line:'+ '+l});}
   const outside=lines;
   nodes.push({node:nm,same:false,rows,outside});}
  const checks=[];for(const c of (job.checks||[])){const o=(b[c.node]||{}).o;const ob=(a[c.node]||{}).o;
   const pick=o0=>o0?rowsOf(o0).map(r=>r.row).filter(r=>(!c.rule||r.rule===c.rule)&&(!c.seat||r.seat===c.seat)&&(!c.item||new RegExp(c.item).test(r.item||r.link||''))&&(!c.link||new RegExp(c.link).test(r.link||''))&&(!c.judge||new RegExp(c.judge).test(r.judge_model||''))&&(!c.has||c.has in r)):[];
   const rs=pick(o);const t=v=>c.expect.re?new RegExp(c.expect.re).test(String(v)):String(v)===String(c.expect.eq);
   const ok=rs.length>0&&rs.every(r=>t(r[c.field]));const rb2=pick(ob);
   checks.push({ok,desc:(c.say||'')+' ['+c.node+' '+(c.rule||'')+' '+(c.item||c.link||'')+' '+c.field+' '+(c.expect.re?'~/'+c.expect.re+'/':'= '+c.expect.eq)+']: cand '+(rs.length?rs.map(r=>String(r[c.field]).slice(0,50)).join(' | '):'no matching row')+'; base '+(rb2.length?rb2.map(r=>String(r[c.field]).slice(0,50)).join(' | '):'no matching row')});}
  parentPort.postMessage({t:'done',r:{nodes,checks}});})().catch(e=>{throw e;});
}
