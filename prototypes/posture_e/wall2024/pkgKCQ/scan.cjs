// pkgKCQ scan: netLines (K-C) and ks2Lines (K-S2) on every stored judge text, live s113 against the candidate NET_REPORT.
const fs=require('fs');const src=fs.readFileSync('pkgLIB/strip_S113L/patched/Panel_Cure_Check.js','utf8');
const OLD="const NET_REPORT=/\\b(?:stated|granted|says|said|conceded|argued|admitted)\\s+that\\b|";
if(!src.includes(OLD))throw new Error('anchor');const NEWT=OLD+"\\bquotation\\b|";
const mk=s=>new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {netLines,ks2Lines,netKeeps,ks2Keeps,cureJText};')(()=>{throw 0},null);
const O=mk(src),N=mk(fs.readFileSync(process.env.NEWF||'pkgLIB/strip_KCQW/patched/Panel_Cure_Check.js','utf8'));module.exports={O,N,OLD,NEWT};
if(require.main!==module)return;
const texts=[];for(const l of fs.readFileSync('corpus/texts.jsonl','utf8').split('\n'))if(l.trim()){const r=JSON.parse(l);texts.push({id:r.run+' '+r.seat+' '+r.src+' '+r.tid,t:r.jtext||r.text});}
// later runs: verdict texts from saved executions
const ld=f=>{const X=JSON.parse(fs.readFileSync(f,'utf8'));return (X.data||X).resultData.runData;};
for(const e of (process.env.EXS||'33149 33371 33490 34299 34626 34703 34726').split(' ')){const RD=ld('/mnt/project-files/wall2024/ex'+e+'_full.json');
 for(const n of ['Panel Payloads','Alternate Payloads','R2 Alternate Payloads']){for(const r of RD[n]||[])for(const b of ((r.data||{}).main||[]))for(const i of b||[]){for(const x of (i.json.bodies||[])){let p;try{p=JSON.parse(x).payload;}catch(e){continue;}if(p&&p.verdict_raw)texts.push({id:e+' '+(p.judge_seat||'?')+' '+n,t:O.cureJText(p.verdict_raw,true)});}}}}
let n=0,kc=0,ks=0;const diffs=[];
for(const x of texts){n++;const a=O.netLines(x.t,null,null),b=N.netLines(x.t,null,null);kc+=a.length;const k=v=>v.map(y=>y.item+'|'+y.line.slice(0,60)).join(' ## ');if(k(a)!==k(b))diffs.push(['K-C',x.id,a.filter(y=>!b.some(z=>z.item===y.item&&z.line===y.line)).map(y=>y.item+': '+y.line.slice(0,400))]);
 const c=O.ks2Lines(x.t,null),d=N.ks2Lines(x.t,null);const ki=v=>JSON.stringify(v.items||v);ks+=(c.items||[]).length;if(ki(c)!==ki(d))diffs.push(['K-S2',x.id,(c.items||[]).map(y=>JSON.stringify(y).slice(0,300))]);}
console.log('texts',n,'K-C raises live',kc,'K-S2 raises live',ks,'texts that differ',diffs.length);for(const d of diffs)console.log(JSON.stringify(d,null,1));
