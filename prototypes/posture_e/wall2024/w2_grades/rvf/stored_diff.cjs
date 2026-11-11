// why the live replay of Format Markdown differs from the stored output on 35067
const fs=require('fs');const W='/mnt/project-files/wall2024/';
let d=JSON.parse(fs.readFileSync(W+'fetchback_live_s132.json','utf8'));d=d.data||d;d=d.workflow||d;const FM=d.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const X=JSON.parse(fs.readFileSync(W+'ex'+(process.argv[2]||'35067')+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const lo=n=>{const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};const $=n=>{const o=lo(n)||[];return {isExecuted:!!rd[n],first:()=>o[0],all:()=>o,item:o[0]};};
(async()=>{const inp=lo('Get Guards');const out=(await new Function('$','$input','return (async()=>{\n'+FM+'\n})();')($,{first:()=>inp[0],all:()=>inp,item:inp[0]}))[0].json;
const a=String(rd['Format Markdown'][0].data.main[0][0].json.md).split('\n'),b=String(out.md).split('\n');
const sa=a.slice().sort().join('\n'),sb=b.slice().sort().join('\n');console.log('lines',a.length,b.length,'same multiset of lines:',sa===sb);
let n=0;for(let i=0;i<a.length&&n<6;i++)if(a[i]!==b[i]&&!b.includes(a[i])){n++;console.log('stored-only:',a[i].slice(0,150));}
console.log('judges stored order:',a.filter(l=>/^- Panel judge \d/.test(l)).map(l=>l.slice(0,40)).join(' || '));
console.log('judges replay order:',b.filter(l=>/^- Panel judge \d/.test(l)).map(l=>l.slice(0,40)).join(' || '));
console.log('Get Judgments order:',lo('Get Judgments').map(x=>x.json.judge_seat).join(','));})();
// second check: multiset of lines equal once the run-time line and the judge order are set aside
(async()=>{const inp=lo('Get Guards');const out=(await new Function('$','$input','return (async()=>{\n'+FM+'\n})();')($,{first:()=>inp[0],all:()=>inp,item:inp[0]}))[0].json;
const f=s=>String(s).split('\n').filter(l=>!/^\*\*Run time:\*\*/.test(l)).map(l=>l.replace(/Panel judge \d:/,'Panel judge N:')).sort().join('\n');
console.log('multiset equal apart from run time and judge numbering:',f(rd['Format Markdown'][0].data.main[0][0].json.md)===f(out.md));})();
