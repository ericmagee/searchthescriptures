// pkgKC2 replay helper: for every K-CON VC item in each run's stored Panel Payloads output, the seats whose own first verdict carries
// that pair (vcParse2024 and kvNorm from the patched node; WT = the reasoning field, as Panel Payloads reads it).
const fs=require('fs');const {load}=require('../corpus/replay_node.cjs');
const S=fs.readFileSync('pkgKC2/patched/Panel_Payloads.js','utf8');const grab=n=>{const i=S.indexOf('function '+n+'(');let d=0,j=S.indexOf('{',i);for(;j<S.length;j++){if(S[j]==='{')d++;else if(S[j]==='}'){d--;if(!d)break;}}return S.slice(i,j+1);};
const KV=S.match(/const kvNorm=[^\n;]*;?/)[0];const L=new Function(KV+'\n'+grab('vcParse2024')+'\nreturn {kvNorm,vcParse2024};')();
const runs=fs.readdirSync('corpus/raw').filter(f=>/^nodes_\d+\.json\.gz$/.test(f)).map(f=>f.slice(6,11)).sort();const out=[];
for(const run of runs){const N=load(run);const pp=N.nodes['Panel Payloads'];const J=pp[pp.length-1][0];const W=[];
 for(const b of J.bodies||[]){const p=(typeof b==='string'?JSON.parse(b):b).payload||{};let raw=String(p.verdict_raw||'').split(/\n\n\[AUDIT /)[0];let WT=raw;try{const j=JSON.parse(raw.slice(0,raw.lastIndexOf('}')+1));WT=j.reasoning!=null?j.reasoning:(j.reason||'');}catch(e){}W.push({seat:p.seat||p.judge_seat||'?',WT});}
 const seats=(J.summary||[]).map(s=>s.seat);W.forEach((w,i)=>{if(w.seat==='?')w.seat=seats[i];});
 const fires=[];for(const s of J.summary||[])for(const x of s.drv||[])if(x.rule==='K-CON'&&/^VERIFIED/.test(x.link))fires.push({who:s.seat,link:x.link,line:x.line});for(const v of J.vc_single||[])fires.push({who:'single judge',link:v.item,line:v.flagged_line});
 for(const x of fires){const s={seat:x.who};const m=String(x.line).match(/EARLIER \[([CD]R\d)\] "([\s\S]*?)" -- LATER \[([CD]R\d)\] "([\s\S]*?)"/);if(!m)continue;
  const n1=L.kvNorm(m[2]).slice(0,60),n2=L.kvNorm(m[4]).slice(0,60);const by=W.filter(w=>L.vcParse2024(w.WT).some(c=>c.ek.toUpperCase()===m[1]&&c.lk.toUpperCase()===m[3]&&L.kvNorm(c.q1).includes(n1.slice(0,40))&&L.kvNorm(c.q2).includes(n2.slice(0,40)))).map(w=>w.seat);
  out.push(run+' charged '+s.seat+' '+x.link+' | pair written by: '+(by.join(', ')||'none')+' ('+new Set(by).size+') -> '+(new Set(by).size>=2?'KEPT':'DROPPED')+'\n   EARLIER '+m[2].slice(0,90)+'\n   LATER   '+m[4].slice(0,90));}}
console.log(out.join('\n'));module.exports=out;
