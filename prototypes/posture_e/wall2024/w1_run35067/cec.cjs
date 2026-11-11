// W1, run 35067: Close Enforcer Record confirmed lines; pkgSYL lines in the saved synthesis; pkgCLK/CLG link vs closing block.
const fs=require('fs');const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;
const out=n=>rd[n]?rd[n].map(r=>(r.data&&r.data.main&&r.data.main[0]||[]).map(x=>x.json)):null;
const cer=out('Close Enforcer Record');console.log('Close Enforcer Record runs',cer&&cer.length);
const j=cer[cer.length-1][0];const cec=j.cec||j;console.log('keys',Object.keys(j).slice(0,30).join(','));
const conf=(j.cec&&j.cec.confirmed)||j.confirmed;console.log('confirmed',JSON.stringify(conf,null,1).slice(0,4000));
const sb=out('Build Save Body');const b=sb[sb.length-1][0];const s=JSON.stringify(b);
for(const m of s.matchAll(/\|\s*D\d+ \(engine\)[^\\]{0,300}|\*\*ENGINE: D\d+ BROKEN\*\*[^\\]{0,300}/g))console.log('SYL line:',m[0]);
