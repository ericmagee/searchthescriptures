// pkgKRC on luna's own run 34016 reply (W1, 11-09). Run from wall2024/: node pkgKRC/probe_KRC_34016.cjs
// Runs every cure-check node saved for 34016 under base (strip_WLG = live s75) and patched (strip_KRC), and prints each K-RUL and K-W row.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s75.json';
const H=harness('34016');const rows=o=>{const r=[];const w=(x,st,pth)=>{if(Array.isArray(x))x.forEach((y,i)=>w(y,st,pth+'['+i+']'));else if(x&&typeof x==='object'){const s2=(typeof x.seat==='string'&&x.seat)||(typeof x.model==='string'&&x.model)||(typeof x.judge_model==='string'&&x.judge_model)||st;if((x.rule==='K-RUL'||x.rule==='K-W')&&x.status&&x.link)r.push(s2+' '+x.rule+' '+x.link+' '+x.status+' ('+String(x.why||'').replace(/^TRIAL rule[^:]*: /,'').slice(0,60)+')');for(const k in x)w(x[k],s2,pth+'.'+k);}};w(o,'?','');return [...new Set(r)].sort();};
const out=[];const log=s=>{out.push(s);console.log(s);};
for(const nm of ['Panel Cure Check','Cure Check','Alternate Merge Seat','Alternate Merge 1']){const f=nm.replace(/ /g,'_');if(!fs.existsSync(D+'34016_'+f+'.json'))continue;
 const i=feeder(BASEW,nm).find(x=>fs.existsSync(D+'34016_'+x.replace(/ /g,'_')+'.json'));if(!i){log(nm+': no saved feeder');continue;}
 let a,b;try{a=rows(H(fs.readFileSync('pkgLIB/strip_WLG/patched/'+f+'.js','utf8'),i));b=rows(H(fs.readFileSync('pkgLIB/strip_KRC/patched/'+f+'.js','utf8'),i));}catch(e){log(nm+': '+e.message.slice(0,120));continue;}
 log(nm+' via '+i);const all=[...new Set([...a,...b].map(x=>x.replace(/ (CURED|UNCURED) .*/,'')))];for(const k of all){const x=a.find(z=>z.startsWith(k+' ')),y=b.find(z=>z.startsWith(k+' '));log('   '+(x===y?'same  ':'CHANGE')+' '+(x||'-')+(x===y?'':'  ->  '+(y||'-')));}}
fs.writeFileSync('pkgKRC/probe_KRC_34016.txt',out.join('\n')+'\n');
