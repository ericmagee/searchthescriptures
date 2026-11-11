const fs=require('fs');const W='/mnt/project-files/wall2024/';const seen=new Set();let n=0;
const walk=(o,f)=>{if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach(x=>walk(x,f));return;}f(o);for(const k in o)walk(o[k],f);};
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 for(const nd of Object.keys(rd))walk(rd[nd],o=>{for(const k of Object.keys(o)){const v=o[k];if(typeof v==='string'&&/not found word for word in \[/.test(v)){const m=v.match(/not found word for word in \[[^\]]*\][^\n"]{0,80}/);const key=f+(o.seat||'')+(o.flagged_line||o.line||'').slice(0,80)+m[0];if(seen.has(key))continue;seen.add(key);n++;if(n<=8)console.log(f.slice(2,7),nd,k,o.seat,'|',m[0].slice(0,110));}}});}
console.log('distinct',n);
