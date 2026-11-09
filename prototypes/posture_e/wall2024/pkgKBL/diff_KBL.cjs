// pkgKBL: show what changed in each of the 9 changed node runs (string-level, first differing strings). node pkgKBL/diff_KBL.cjs
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s63.json';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s70.json','utf8'));const plan=JSON.parse(fs.readFileSync('pkgKBL/plan_KBL.json','utf8'));
const src=(nm,p)=>{const f=nm.replace(/ /g,'_')+'.js';if(plan.library[f])return fs.readFileSync((p?'pkgLIB/strip_KBL':'pkgLIB/strip_KWI')+'/patched/'+f,'utf8');return p?fs.readFileSync('pkgKBL/patched/'+f,'utf8'):W.nodes.find(n=>n.name===nm).parameters.jsCode;};
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const strs=o=>{const r=[];const w=(x,p)=>{if(typeof x==='string')r.push([p,x]);else if(Array.isArray(x))x.forEach((y,i)=>w(y,p+'['+i+']'));else if(x&&typeof x==='object')for(const k in x)if(k!=='at'&&k!=='created_at')w(x[k],p+'.'+k);};w(o,'');return r;};
const CASES=(process.argv[2]||'33345:Cure Check,33442:Extract Independent Verdict,33442:Panel Payloads,33461:Alt Gate Record,33497:Panel Cure Check,33682:Panel Cure Check,33705:Panel Payloads').split(',');
for(const c of CASES){const [RUN,nm]=c.split(':');const H=harness(RUN);const i=fin(RUN,nm);const a=H(src(nm,0),i),b=H(src(nm,1),i);
 const sa=new Map(strs(a)),sb=strs(b);let n=0;console.log('=== '+RUN+' '+nm);
 for(const [p,v] of sb){const o=sa.get(p);if(o===v)continue;if(++n>3)break;let k=0;while(k<o?.length&&o[k]===v[k])k++;
  console.log(' '+p+'\n   BASE: '+String(o).slice(Math.max(0,k-200),k+250).replace(/\n/g,'\\n')+'\n   NEW : '+v.slice(Math.max(0,k-200),k+250).replace(/\n/g,'\\n'));}}
