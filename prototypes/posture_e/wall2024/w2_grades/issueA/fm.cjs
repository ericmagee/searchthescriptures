// W2 second reading of W1 Wall 4840 (Issue A): replay s132 Format Markdown on stored exports; classify review flags.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
let d=JSON.parse(fs.readFileSync(W+'fetchback_live_s132.json','utf8'));d=d.data||d;d=d.workflow||d;
const FM=d.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
// downstream chain from Format Markdown
const seen=new Set();const q=['Format Markdown'];while(q.length){const n=q.shift();for(const br of ((d.connections[n]||{}).main||[]))for(const t of br||[])if(!seen.has(t.node)){seen.add(t.node);q.push(t.node);}}
console.log('downstream of Format Markdown:',[...seen].join(' > '));
// who reads Format Markdown by name
console.log('nodes that name $("Format Markdown"):',d.nodes.filter(n=>n.parameters&&JSON.stringify(n.parameters).includes("$('Format Markdown')")).map(n=>n.name).join(', ')||'none');
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
(async()=>{for(const e of (process.argv[2]||'35067').split(',')){
 const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
 const lo=n=>{const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};
 const $=n=>{const o=lo(n)||[];return {isExecuted:!!rd[n],first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};};
 let pred=null;for(const [s,o] of Object.entries(d.connections))for(const br of o.main||[])for(const t of br||[])if(t.node==='Format Markdown')pred=s;
 const inp=lo(pred)||lo('Format Markdown');let out;try{out=(await runSrc(FM,$,inp))[0].json;}catch(x){console.log(e,'replay error',x.message);continue;}
 const md=JSON.stringify(out);const stored=JSON.stringify(lo('Format Markdown')[0].json);
 const rows=(out.markdown||out.md||Object.values(out).find(v=>typeof v==='string'&&v.includes('Review flag'))||'').split('\n').filter(l=>/^\| (Review|Cured) flag/.test(l));
 const c={};for(const l of rows){const kind=l.startsWith('| Cured')?'cured':'review';const form=(l.match(/-- ([A-Z][A-Z -]+?)(?: \(| --|:)/)||l.match(/\((K-[A-Z0-9]+|S3)[;)]/)||[,'?'])[1];const rm=/removes the seat/.test(l)?'removes':'other';const k=kind+' | '+rm+' | '+(l.match(/\((K-W|S3|K-[A-Z0-9]+)[;)]/)||[,'?'])[1];c[k]=(c[k]||0)+1;}
 console.log('ex'+e,'| s132 replay equals stored output:',md===stored,'| flag rows',rows.length,JSON.stringify(c));
 // cure reports in the same judgments
 const J=[];for(const n in rd)for(const r of rd[n])for(const br of (r.data&&r.data.main)||[])for(const it of br||[])if(it&&it.json&&typeof it.json.verdict_raw==='string'&&it.json.judge_seat)J.push(it.json);
 const byseat={};for(const j of J)byseat[j.judge_seat]=j.verdict_raw;let cur=0,unc=0;
 for(const v of Object.values(byseat)){for(const m of v.matchAll(/(K-W|K-S3)[^\n]*?\b(CURED|UNCURED)\b/g))m[2]==='CURED'?cur++:unc++;}
 console.log('   seats',Object.keys(byseat).join(','),'| K-W/K-S3 report lines CURED',cur,'UNCURED',unc);
}})();
