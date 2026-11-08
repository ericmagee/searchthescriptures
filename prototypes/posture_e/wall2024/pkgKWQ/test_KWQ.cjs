// pkgRI5 test (pkgKWQ) (W1, reader item 3; harness from pkgGDA/pkgKG7 tests). Run from wall2024/: node pkgRI3/test_RI3.cjs [base strip] [patched strip] [plan]
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s63.json';
const SB=process.argv[2]||'pkgLIB/strip_RCD',SP=process.argv[3]||'pkgLIB/strip_KWQ',PL=process.argv[4]||'pkgKWQ/plan_strip_KWQ.json';
const B0=f=>fs.readFileSync(SB+'/patched/'+f,'utf8'),P1=f=>fs.readFileSync(SP+'/patched/'+f,'utf8');const plan=JSON.parse(fs.readFileSync(PL,'utf8')).nodes;
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const all=fs.readdirSync(SB+'/patched').filter(f=>f.endsWith('.js')).sort();
for(const f of all){const a=B0(f),b=P1(f);if(plan[f])T(a!==b&&b.includes('/* pkgKWQ'),f+' carries ri5Rd2024');else T(a===b,f+' unchanged');}
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'||k==='t0'?undefined:v);
let n=0;const ch=[];const naGone=[],naNew=[];const flips=[];const unc=[];
const rowsOf=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.seat&&x.rule&&x.item&&x.cure_status&&x.kind)r.push(x);for(const k in x)w(x[k]);}};w(o);return r;};
const naOf=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.kind==='NOT APPLIED'&&x.sid)r.push(x.sid+': '+String(x.why||'').slice(0,90));for(const k in x)w(x[k]);}};w(o);return [...new Set(r)];};
const drvOf=o=>{const r={};const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.seat&&typeof x.uncured==='number')r[x.seat]=x.uncured;for(const k in x)w(x[k]);}};w(o);return r;};
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const f of Object.keys(plan)){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){if(e0!==e1)T(false,RUN+' '+nm+' same error both ('+e0+' | '+e1+')');continue;}n++;if(st(a)===st(b))continue;
 const ra=rowsOf(a),rb=rowsOf(b);const key=r=>r.seat+'|'+r.kind+'|'+r.rule+'|'+r.item;const ma=new Map(ra.map(r=>[key(r),r]));
 for(const r of rb){const o=ma.get(key(r));if(o&&o.cure_status!==r.cure_status)flips.push(RUN+' '+nm+' '+r.seat+' '+r.kind+' '+r.rule+' '+r.item+': '+o.cure_status+' -> '+r.cure_status+' :: '+String(r.cure_reason||'').slice(-170));}
 const da=drvOf(a),db=drvOf(b);for(const s of Object.keys(db))if(da[s]!==db[s])unc.push(RUN+' '+nm+' '+s+' uncured '+da[s]+' -> '+db[s]);
 {const na=naOf(a),nb=naOf(b);for(const z of na)if(!nb.includes(z))naGone.push(RUN+' '+nm+' '+z);for(const z of nb)if(!na.includes(z))naNew.push(RUN+' '+nm+' '+z);}
 ch.push(RUN+' '+nm+': changed');}}
log('replay: '+n+' node runs over '+runs.length+' runs; changed outputs: '+ch.length);ch.forEach(x=>log('   '+x));
log('cure flips: '+flips.length);[...new Set(flips)].forEach(x=>log('   '+x));log('uncured count changes: '+unc.length);[...new Set(unc)].forEach(x=>log('   '+x));
log('NOT APPLIED items gone: '+naGone.length);naGone.forEach(x=>log('   '+x));log('NOT APPLIED items new: '+naNew.length);naNew.forEach(x=>log('   '+x));
T(true,'flips listed above for ruling');
T(n>0,'replay ran');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(PL.replace(/plan_/,'test_').replace(/\.json$/,'.txt'),out.join('\n')+'\n');
