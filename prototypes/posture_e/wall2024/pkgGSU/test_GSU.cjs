// pkgGSU test. Run from wall2024/: node --max-old-space-size=8000 pkgGSU/test_GSU.cjs
// 1. 33490 Gate Record: gemini drv_uncured 12 -> 9; G1, G3, G5 CURED by the apply record; the 9 RETRACTED-without-reason items stay.
// 2. Replay: every saved run x the 6 gate nodes, base (pkgLIB/strip_KFN = v13 sources) vs patched (strip_GSU); every changed output listed;
//    FAIL if any item goes CURED -> UNCURED (W3 2996 grade bar).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s51.json';
const B0=f=>fs.readFileSync('pkgLIB/strip_KFN/patched/'+f,'utf8'),P1=f=>fs.readFileSync('pkgLIB/strip_GSU/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const rows=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.kind==='send_back'&&x.seat&&x.item&&'cure_status' in x)r.push(x);for(const v of Object.values(x))w(v);}};w(o);
 const m=new Map();for(const x of r)m.set(x.seat+'|'+x.rule+'|'+x.item,x.cure_status);return m;};
const du=o=>{const m={};for(const it of (Array.isArray(o)?o:[]))for(const x of ((it&&it.json&&it.json.bodies)||[])){try{const j=JSON.parse(x);const q=j.payload||j;if(q&&'drv_uncured' in q)m[q.judge_seat]=q.drv_uncured;}catch(e){}}return m;};
{const H=harness('33490');const i=fin('33490','Gate Record');const a=H(B0('Gate_Record.js'),i),b=H(P1('Gate_Record.js'),i);const ra=rows(a),rb=rows(b);
 const g=k=>[...k].filter(([kk])=>/^gemini\|E-GATE\|G[135] /.test(kk));T(g(ra).every(([,v])=>v==='UNCURED')&&g(ra).length===3,'33490 base: gemini G1/G3/G5 '+g(ra).map(([k,v])=>k.split('|')[2].split(' ')[0]+' '+v).join(', '));
 T(g(rb).every(([,v])=>v==='CURED')&&g(rb).length===3,'33490 patched: gemini G1/G3/G5 '+g(rb).map(([k,v])=>k.split('|')[2].split(' ')[0]+' '+v).join(', '));
 const ch=[...ra].filter(([k,v])=>rb.get(k)!==v);T(ch.length===3,'33490 only those 3 rows change status ('+ch.length+')');
 const ua=[...ra].filter(([k,v])=>k.startsWith('gemini|')&&v==='UNCURED').length,ub=[...rb].filter(([k,v])=>k.startsWith('gemini|')&&v==='UNCURED').length;log('   gemini UNCURED send-back rows: '+ua+' -> '+ub);
 const da=du(a),db=du(b);T(da.gemini===12&&db.gemini===9&&da.sol===db.sol&&da.chatgpt===db.chatgpt,'33490 drv_uncured base '+JSON.stringify(da)+' -> patched '+JSON.stringify(db)+' (gemini 12 -> 9, others unchanged)');}
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);let n=0,down=0;const flips=[];
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const nm of ['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge','Alternate Merge Seat']){if(!fs.existsSync(D+RUN+'_'+nm.replace(/ /g,'_')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;const f=nm.replace(/ /g,'_')+'.js';
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+' | '+e1+')');continue;}n++;const sa=st(a),sb=st(b);if(sa===sb)continue;
 const ra=rows(a),rb=rows(b);const ch=[...new Set([...ra.keys(),...rb.keys()])].filter(k=>ra.get(k)!==rb.get(k)).map(k=>k+': '+ra.get(k)+' -> '+rb.get(k));down+=ch.filter(c=>/CURED -> UNCURED$/.test(c)&&!/UNCURED -> /.test(c)).length;
 const da=du(a),db=du(b);const dd=Object.keys({...da,...db}).filter(k=>da[k]!==db[k]).map(k=>k+' '+da[k]+'->'+db[k]);
 flips.push(RUN+' '+nm+': '+(ch.length?ch.join('; '):'no send-back status change')+(dd.length?' | drv_uncured '+dd.join(', '):''));}}
log('replay: '+n+' node runs over '+runs.length+' runs; changed outputs: '+flips.length);for(const f of flips)log('   '+f);T(down===0,'no item goes CURED -> UNCURED ('+down+')');T(n>0,'replay ran');
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgGSU/test_GSU.txt',out.join('\n')+'\n');
