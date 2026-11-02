// Population count over every stored judge text (debate_judgments.verdict_raw: the payload's reasoning; debate_results.independent_verdict_raw:
// the reply before its audit lines), read by SQL into data/population.json (663 texts). drvCheck base vs new (Panel Payloads' copy). For each
// rule: items old and new, texts hit; K-C removed and added items; a sample of 20 per new rule (seeded) with the line, for a read.
const fs=require('fs');const D=__dirname+'/../';const {drvLib}=require('./lib.cjs');
const O=drvLib(D+'base/Panel Payloads.js'),N=drvLib(D+'new/Panel Payloads.js');
const P=JSON.parse(fs.readFileSync(D+'data/population.json','utf8'));
function worked(x){let t=x.t||'';if(x.k[0]==='j'){const a=t.indexOf('{');if(a>=0){let d=0,q=false,e=-1;for(let i=a;i<t.length;i++){const c=t[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0){e=i+1;break;}}
 if(e>0){try{const o=JSON.parse(t.slice(a,e));const w=o.reasoning!=null?o.reasoning:o.reason;if(typeof w==='string')return w;}catch(err){}}}return t;}const i=t.indexOf('\n\n[AUDIT');return i<0?t:t.slice(0,i);}
const RULES=['K-X','K-N','K-SC','K-K','K-DG8','K-C'];const cnt={};RULES.forEach(r=>cnt[r]={old:0,new:0,textsNew:0,hits:[]});const kcRem=[],kcAdd=[];
for(const x of P){const w=worked(x);const a=O.drvCheck(w,null,null,null,null,false).items,b=N.drvCheck(w,null,null,null,null,false).items;
 for(const r of RULES){const A=a.filter(i=>i.rule===r),B=b.filter(i=>i.rule===r);cnt[r].old+=A.length;cnt[r].new+=B.length;cnt[r].textsNew+=B.length>0;for(const i of B)cnt[r].hits.push({k:x.k,link:i.link,line:i.line});}
 const ka=a.filter(i=>i.rule==='K-C').map(i=>i.link),kb=b.filter(i=>i.rule==='K-C').map(i=>i.link);
 for(const l of ka)if(!kb.includes(l))kcRem.push(x.k+' '+l);for(const i of b.filter(i=>i.rule==='K-C'))if(!ka.includes(i.link))kcAdd.push({k:x.k,link:i.link,line:i.line});}
console.log('texts',P.length);for(const r of RULES)console.log(r.padEnd(6),'items old',cnt[r].old,'new',cnt[r].new,'| texts hit (new)',cnt[r].textsNew);
console.log('K-C removed',kcRem.length,kcRem.join('; '));console.log('K-C added',kcAdd.length);
let seed=7;const rnd=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;
const sample=(arr,n)=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,n);};
const out={};for(const r of ['K-X','K-N','K-SC','K-K','K-DG8'])out[r]=sample(cnt[r].hits,20);out['K-C added']=sample(kcAdd,20);
fs.writeFileSync(__dirname+'/population_sample.json',JSON.stringify(out,null,1));
for(const r of Object.keys(out)){console.log('\n=== SAMPLE',r,out[r].length);out[r].forEach((h,i)=>console.log('#'+(i+1),h.k,h.link,'::',String(h.line).replace(/\s+/g,' ').slice(0,420)));}
