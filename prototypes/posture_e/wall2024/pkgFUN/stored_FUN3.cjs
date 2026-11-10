// pkgFUN rev 3 on real data: every stored K-S3 RESPONSE answer in the saved debates' cure and follow-up calls (inputs/*Cure*Call*.json),
// read by the live s98 K-S3 line and by the rev 3 line (the same predicates as allplants_FUN3.cjs). Lists every answer that reads differently.
const fs=require('fs');const D=__dirname;const IN='/mnt/project-files/wall2024/inputs';
const pred=f=>{const L=fs.readFileSync(f,'utf8').trim();const m=L.match(/^\{const c0=(.*?);if\((.*)\)return res\('CURED'/);return new Function('rp','const c0='+m[1]+';return !!('+m[2]+');');};
const LV=pred(D+'/live_s98_line.txt'),F3=pred(D+'/fun3_line.txt');
const seen=new Map();let files=0;
for(const f of fs.readdirSync(IN).filter(f=>/Cure.*(?:Call|Follow).*\.json$/i.test(f))){files++;const txt=fs.readFileSync(IN+'/'+f,'utf8');
 const S=[];JSON.parse(txt,(k,v)=>{if(typeof v==='string'&&v.includes('RESPONSE:'))S.push(v);return v;});
 for(const s of S)for(const l of s.split('\n')){const m=l.match(/^\s*RESPONSE:\s*(K-S3\b[^|]*)\|\s*(.*)$/);if(!m)continue;const a=m[2].trim();const k=a;if(!seen.has(k))seen.set(k,{a,runs:new Set()});seen.get(k).runs.add(f.split('_')[0]);}}
let diff=0,n=0,cnt=0;const out=[];for(const {a,runs} of seen.values()){n++;cnt+=runs.size;const l=LV(a),r=F3(a);if(l!==r){diff++;out.push((l?'CURED':'UNCURED')+' -> '+(r?'CURED':'UNCURED')+' | '+a+'  [runs '+[...runs].join(',')+']');}}
const cc=[...seen.values()].filter(x=>/COUNTED/i.test(x.a));console.log("answers holding COUNTED: "+cc.length+"; live CURED "+cc.filter(x=>LV(x.a)).length+", rev 3 CURED "+cc.filter(x=>F3(x.a)).length);cc.slice(0,15).forEach(x=>console.log("  "+(LV(x.a)?"CURED  ":"UNCURED")+" "+x.a.slice(0,140)));
out.forEach(x=>console.log(x));console.log(files+' stored cure call files; '+n+' distinct K-S3 answers ('+cnt+' answer-run pairs); '+diff+' read differently from live s98.');
