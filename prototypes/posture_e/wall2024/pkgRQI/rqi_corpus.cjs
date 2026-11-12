const fs=require('fs');
const o=t=>/\bREASSERTED\s+IN\s+\[?[CD]R\d+\]?\s*(?:[:,]|--|—)?\s*["“'‘][^"”]{6,}["”'’](?![A-Za-z])/i.test(t);
const n=t=>/\bREASSERTED\s+IN\s+\[?[CD]R\d+\]?\s*(?:[:,]|--|—)?\s*["“'‘](?:[^"”]{6,}|[^\n]{6,}?)["”'’](?![A-Za-z])/i.test(t);
const seen=new Set();let tot=0,flip=[],back=0;
const files=fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>'/mnt/project-files/wall2024/'+f);
const R=require('/mnt/project-files/w4/sds/replies.json');
const walk=(x,f)=>{if(typeof x==='string'){for(const l of x.split('\n')){if(!/REASSERTED\s+IN/i.test(l)||seen.has(l))continue;seen.add(l);tot++;const a=o(l),b=n(l);if(a&&!b)back++;if(!a&&b)flip.push(f+' '+l.slice(0,220));}}else if(x&&typeof x==='object')for(const k in x)walk(x[k],f);};
for(const f of files)walk(JSON.parse(fs.readFileSync(f,'utf8')),f.slice(-18,-10));walk(R,'r35379');
console.log('distinct REASSERTED lines',tot,'old true new false',back,'old false new true',flip.length);flip.forEach(x=>console.log(' ',x));
