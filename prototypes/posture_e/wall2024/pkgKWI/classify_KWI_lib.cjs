// pkgKWI: classify every replay output that changed beyond rule text (input: the test_KWI_lib output). Run from wall2024/: node pkgKWI/classify_KWI_lib.cjs
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const SUBS=require('./kwi_lib_subs.cjs');const TX=SUBS.filter(s=>/^txt/.test(s[0]));
const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'||k==='t0'?undefined:v);
const undo=b=>{for(const [,x,y] of TX){for(let k=0;k<4;k++){const e=s=>{let r=s;for(let j=0;j<k;j++)r=JSON.stringify(r).slice(1,-1);return r;};b=b.split(e(y)).join(e(x));}}return b;};
const Q=s=>s.replace(/[\\"‘’“”]/g,'');
const sent=s=>[...s.matchAll(/(?:WITHDRAWAL TO ANSWER \(K-W; ruling 421\) -- [^:]{1,60}: |\[[CD]R\d\] [^:]{1,40}: )(I (?:do not claim|no longer claim|withdraw|grant|concede|drop)\b[^;\]\n]{0,320}?)(?=; the judge|,"|\}|$)/g)].map(m=>m[1]);
const lines=fs.readFileSync('pkgKWI/test_KWI_lib_full.txt','utf8').split('\n').filter(l=>/: changed$/.test(l)).map(l=>l.trim().replace(/: changed$/,''));
let clean=0;const bad=[];const ext=new Map();
for(const l of lines){const RUN=l.split(' ')[0],nm=l.slice(RUN.length+1),f=nm.replace(/ /g,'_')+'.js';
 const fe=feeder('/mnt/project-files/wall2024/fetchback_live_s63.json',nm);const i=[...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));
 const a=Q(st(harness(RUN)(fs.readFileSync('pkgLIB/strip_RTB4_8/patched/'+f,'utf8'),i)));const b=Q(undo(st(harness(RUN)(fs.readFileSync('pkgLIB/strip_KWI/patched/'+f,'utf8'),i))));
 if(a===b){clean++;continue;}
 const sa=sent(a),sb=sent(b);if(sa.length!==sb.length){bad.push(l+' sentence count '+sa.length+' vs '+sb.length);continue;}
 let ok=true;sa.forEach((x,k)=>{if(x!==sb[k]){if(!(sb[k].startsWith(x.replace(/\.\.\.$/,'...').trim())))ok=false;ext.set(RUN+' :: '+x+'  ==>  '+sb[k],1);}});
 let a2=a,b2=b;sa.forEach((x,k)=>{a2=a2.split(x).join('#');b2=b2.split(sb[k]).join('#');});
 if(a2!==b2){let p=0;while(a2[p]===b2[p])p++;bad.push(l+' other diff: '+a2.slice(p-80,p+120)+' || '+b2.slice(p-80,p+120));}else if(!ok)bad.push(l+' non-extension change');else clean++;}
console.log('classified clean (quote marks or sentence completion only):',clean,'of',lines.length);bad.slice(0,10).forEach(x=>console.log('BAD',x.slice(0,500)));
console.log('distinct sentence changes:',ext.size);[...ext.keys()].forEach(x=>console.log('  ',x.slice(0,400)));
