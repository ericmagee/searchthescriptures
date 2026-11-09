// pkgKBL targeted test on run 33846 (grok, D2 vs C2; W3 ruling Wall 3441). Run from wall2024/: node pkgKBL/test_KBL.cjs
// 1. Panel Payloads (where the K-B items are raised): base flags K-B D2 vs C2 with kinds [L1]; patched reads L1, L2, L3 and raises no K-B item for it.
// 2. Panel Cure Check, fed the saved (base) items: base logs grok K-B UNCURED "no written response"; patched reads grok's RESTATED line and cures it.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s63.json';
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const B=f=>fs.readFileSync('pkgLIB/strip_KWI/patched/'+f,'utf8'),P=f=>fs.readFileSync('pkgLIB/strip_KBL/patched/'+f,'utf8');
const fin=nm=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+'33846_'+x.replace(/ /g,'_')+'.json'));};
const kb=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.rule==='K-B'&&x.link==='D2 vs C2')r.push(x);for(const k in x)w(x[k]);}};w(o);return r;};
(async()=>{const H=harness('33846');
 for(const f of ['Panel_Payloads.js']){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const i=fin(nm);const a=await H(B(f),i),b=await H(P(f),i);
  const ka=kb(a),kp=kb(b);log(nm+' (input '+i+'): base K-B D2 vs C2 items '+ka.length+(ka[0]?' kinds '+JSON.stringify(ka[0].kinds):'')+'; patched '+kp.length);
  T(ka.length>0&&JSON.stringify(ka[0].kinds)==='["L1"]','base flags D2 vs C2 with kinds [L1] (the live misread)');T(kp.length===0,'patched raises no K-B item for D2 vs C2');}
 for(const f of ['Panel_Cure_Check.js']){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const i=fin(nm);const a=await H(B(f),i),b=await H(P(f),i);
  const st=o=>kb(o).filter(x=>x.status||x.cure_status).map(x=>(x.status||x.cure_status)+': '+(x.why||x.cure_reason||'')+(x.kinds?' '+JSON.stringify(x.kinds):''));
  const sa=st(a),sb=st(b);log(nm+' (input '+i+'): base '+JSON.stringify([...new Set(sa)])+' | patched '+JSON.stringify([...new Set(sb)]));
  T(sa.some(s=>/UNCURED: no written response/.test(s)),'base logs grok K-B UNCURED "no written response"');T(sb.length>0&&sb.every(s=>/^CURED/.test(s)),'patched cures it from grok\'s RESTATED line');
  const other=o=>JSON.stringify(o,(k,v)=>k==='at'||k==='created_at'?undefined:v).replace(/D2 vs C2[^"]*/g,'');log('   output outside the D2 vs C2 K-B item: '+(other(a)===other(b)?'identical':'differs (see replay)'));}
 log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgKBL/test_KBL.txt',out.join('\n')+'\n');})();
