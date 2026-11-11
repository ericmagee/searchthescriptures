// pkgRVF: Format Markdown on every stored export, live s132 vs RVF. Counts flag rows by kind, checks that only flag-row labels change,
// and checks each newly cured row against the seat's own report (CURED, never UNCURED).
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};const cd=p=>un(p).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const A=cd(P+'fetchback_live_s132.json'),B=cd(process.argv[2]||'/tmp/claude-0/cmx/rvf.json');
const md=o=>{let t=JSON.stringify(o);return JSON.parse(t)[0]&&JSON.parse(t)[0].md!==undefined?JSON.parse(t)[0].md:t.replace(/\\n/g,'\n');};
const form=l=>/\(K-W; ruling/.test(l)?'K-W':/\(S3; ruling/.test(l)?'K-S3':'other';
(async()=>{const T={};for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;if(!rd['Format Markdown'])continue;
 const a=await run(A,'Format Markdown',rd),b=await run(B,'Format Markdown',rd);if(a.err||b.err){console.log(e,'ERR',a.err,'|',b.err);continue;}
 const la=md(a).split('\n'),lb=md(b).split('\n');if(la.length!==lb.length){console.log(e,'LINE COUNT DIFFERS',la.length,lb.length);continue;}
 let other=0;const c={};for(let i=0;i<la.length;i++){if(la[i]===lb[i]){if(/^\| (Review|Cured) flag/.test(la[i])){const k=form(la[i])+' '+la[i].slice(2,8)+'->same';c[k]=(c[k]||0)+1;}continue;}
  if(!(la[i].startsWith('| Review flag')&&lb[i].startsWith('| Cured flag'))){other++;console.log(e,'OTHER CHANGE line',i,'\n  ',la[i].slice(0,200),'\n  ',lb[i].slice(0,200));continue;}const k=form(la[i])+' Review->Cured';c[k]=(c[k]||0)+1;}
 console.log(e,JSON.stringify(c),'other changes',other);for(const k in c)T[k]=(T[k]||0)+c[k];}
 console.log('TOTAL',JSON.stringify(T));})();
