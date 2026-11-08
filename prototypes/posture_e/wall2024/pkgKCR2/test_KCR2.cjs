// pkgKCR v2 test. Run from wall2024/: node --max-old-space-size=8000 pkgKCR2/test_KCR2.cjs
// Base = live library sources (pkgLIB/strip_KFN with pkgLIB/strip_GSU over it = pkgLIB_v13_GSU); patched = pkgLIB/strip_KCR2.
// 1. Targets: 33482 gemini K-C REASONING, 33345 CHAIN MARK, 33497 gemini K-C CHALLENGER CHAIN MARK (W3 3009 false KEEP) go CURED.
// 2. Narrow gate units (W2 2981) on Cure Check's cureLines.
// 3. Replay: every saved run x all 22 library nodes; every changed output listed with each K-C / K-S2 (and any other) status flip.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s52.json';
const B0=f=>fs.readFileSync(fs.existsSync('pkgLIB/strip_GSU/patched/'+f)?'pkgLIB/strip_GSU/patched/'+f:'pkgLIB/strip_KFN/patched/'+f,'utf8'),P1=f=>fs.readFileSync('pkgLIB/strip_KCR2/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const rows=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.seat&&x.item&&'cure_status' in x)r.push(x);for(const v of Object.values(x))w(v);}};w(o);
 const m=new Map();for(const x of r)m.set(x.seat+'|'+x.rule+'|'+x.item,x.cure_status+(x.cure_why?' ('+String(x.cure_why).slice(0,90)+')':''));return m;};
const files=fs.readdirSync('pkgLIB/strip_KCR2/patched').filter(f=>f.endsWith('.js')).sort();
// 2. unit: cureLines from Cure Check source, sliced out and run alone
{const src=P1('Cure_Check.js'),src0=B0('Cure_Check.js');
 const probe=(s,lines)=>{try{const H=harness('33497');}catch(e){}return null;};
 const LAB=/const LAB=\/\^\(REASONING\|/.test(src),LAB0=/const LAB=\/\^\(REASONING\|/.test(src0);T(LAB&&!LAB0,'Cure Check: LAB gains REASONING');
 T(src.includes("(R.form==null&&R.tried==='RESTATED')")&&!src.includes('||LAB.test(r)))'),'narrow gate (W2 2981): R.form==null && R.tried===RESTATED; v1 wide gate absent');}
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'||k==='t0'?undefined:v);let n=0;const flips=[];const allch=[];
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const f of files){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+' | '+e1+')');continue;}n++;if(st(a)===st(b))continue;
 const ra=rows(a),rb=rows(b);const ch=[...new Set([...ra.keys(),...rb.keys()])].filter(k=>ra.get(k)!==rb.get(k)).map(k=>k+': '+ra.get(k)+' -> '+rb.get(k));allch.push(...ch.map(c=>RUN+' '+nm+' '+c));
 flips.push(RUN+' '+nm+': '+(ch.length?ch.join('; '):'text change only, no cure status change'));}}
log('replay: '+n+' node runs over '+runs.length+' runs; changed outputs: '+flips.length);for(const f of flips)log('   '+f);
const has=(r,re)=>allch.some(c=>c.startsWith(r)&&re.test(c));
T(has('33482',/gemini\|K-C\|.*UNCURED.* -> CURED/),'33482 gemini K-C REASONING UNCURED -> CURED');
T(has('33345',/K-C\|.*CHAIN MARK.*UNCURED.* -> CURED/),'33345 K-C CHAIN MARK UNCURED -> CURED');
T(has('33497',/gemini\|K-C\|.*CHAIN MARK.*UNCURED.* -> CURED/),'33497 gemini K-C CHALLENGER CHAIN MARK UNCURED -> CURED (W3 3009 false KEEP)');
const down=allch.filter(c=>/: CURED[^>]*-> UNCURED/.test(c));T(down.length===0,'no item goes CURED -> UNCURED ('+down.length+')');T(n>0,'replay ran');
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgKCR2/test_KCR2.txt',out.join('\n')+'\n');
