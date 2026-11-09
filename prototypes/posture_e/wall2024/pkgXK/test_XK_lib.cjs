// pkgXK replay (base live s79: strip_RPN; patched strip_XK). Harness from pkgKBL/fold/test_KBF_lib.cjs. Every saved run, every library node: base vs patched output, changed K-B items, cure flips, uncured-count changes.
// base vs patched output; lists every changed K-B item, cure-status flip and uncured-count change for ruling. Run from wall2024/: node pkgXK/test_XK_lib.cjs
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s63.json';
const plan=JSON.parse(fs.readFileSync('pkgXK/plan_XK.json','utf8'));const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s79.json','utf8'));
const JOBS=[...Object.keys(plan.library).map(f=>({nm:f.replace(/\.js$/,'').replace(/_/g,' '),a:fs.readFileSync('pkgLIB/strip_RPN/patched/'+f,'utf8'),b:fs.readFileSync('pkgLIB/strip_XK/patched/'+f,'utf8')})),
 ...Object.entries(plan.nodes||{}).map(([nm,p])=>({nm,a:W.nodes.find(n=>n.name===nm).parameters.jsCode,b:fs.readFileSync('pkgKBL/fold/patched/'+nm.replace(/ /g,'_')+'.js','utf8')}))];
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const fin=(RUN,nm)=>{let fe;try{fe=feeder(BASEW,nm);}catch(x){return null;}return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'||k==='t0'?undefined:v);
const rowsOf=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.seat&&x.rule&&x.item&&x.cure_status&&x.kind)r.push(x);for(const k in x)w(x[k]);}};w(o);return r;};
const kbOf=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(/^K-(F|CMT|CMTL)$/.test(x.rule||'')&&x.link)r.push(x.rule+' '+(x.side||'')+' '+x.link+(x.status?' '+x.status:'')+(x.kinds?' ['+x.kinds+']':''));for(const k in x)w(x[k]);}};w(o);return [...new Set(r)];};
const drvOf=o=>{const r={};const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.seat&&typeof x.uncured==='number')r[x.seat]=x.uncured;for(const k in x)w(x[k]);}};w(o);return r;};
let n=0,same=0;const ch=[],kbGone=[],kbNew=[],flips=[],unc=[];
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const j of JOBS){if(!fs.existsSync(D+RUN+'_'+j.nm.replace(/ /g,'_')+'.json'))continue;const i=fin(RUN,j.nm);if(!i)continue;
 let a,b,e0=null,e1=null;try{a=H(j.a,i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(j.b,i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){if(e0!==e1)T(false,RUN+' '+j.nm+' same error both ('+e0+' | '+e1+')');continue;}n++;if(st(a)===st(b)){same++;continue;}ch.push(RUN+' '+j.nm);
 {const ka=kbOf(a),kb=kbOf(b);for(const z of ka)if(!kb.includes(z))kbGone.push(RUN+' '+j.nm+' '+z);for(const z of kb)if(!ka.includes(z))kbNew.push(RUN+' '+j.nm+' '+z);}
 const ra=rowsOf(a),rb=rowsOf(b);const key=r=>r.seat+'|'+r.kind+'|'+r.rule+'|'+r.item;const ma=new Map(ra.map(r=>[key(r),r]));
 for(const r of rb){const o=ma.get(key(r));if(o&&o.cure_status!==r.cure_status)flips.push(RUN+' '+j.nm+' '+r.seat+' '+r.rule+' '+r.item+': '+o.cure_status+' -> '+r.cure_status);}
 const da=drvOf(a),db=drvOf(b);for(const s of Object.keys(db))if(da[s]!==db[s])unc.push(RUN+' '+j.nm+' '+s+' uncured '+da[s]+' -> '+db[s]);}}
log('replay: '+n+' node runs over '+runs.length+' runs; byte-equal '+same+'; changed '+ch.length);ch.forEach(x=>log('   '+x));
log('K-F/K-CMT/K-CMTL items gone or changed (base side): '+kbGone.length);kbGone.forEach(x=>log('   '+x));log('K-F/K-CMT/K-CMTL items new or changed (patched side): '+kbNew.length);kbNew.forEach(x=>log('   '+x));
log('cure flips: '+flips.length);[...new Set(flips)].forEach(x=>log('   '+x));log('uncured count changes: '+unc.length);[...new Set(unc)].forEach(x=>log('   '+x));
T(n>0,'replay ran');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgXK/test_XK_lib.txt',out.join('\n')+'\n');
