const fs=require('fs');const walk=(v,f)=>{if(typeof v==='string')f(v);else if(v&&typeof v==='object')Object.values(v).forEach(x=>walk(x,f));};
for(const fn of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+fn,'utf8')).data.resultData.runData;
 for(const last of ['Alternate Merge','Panel Cure Check','Cure Check'].filter(n=>rd[n])){const seen=new Map();
 walk(rd[last],s=>{if(!/stand graded CHALLENGER LINK BROKEN|no collision line stands graded/.test(s)||s.length<500)return;const said=+((s.match(/(\d+) collision line\(s\) stand graded CHALLENGER LINK BROKEN/)||[])[1]||0);
  const act=(s.match(/(?:^|\n)\s*(?:FORCED\s*:\s*)?D\d+\s+vs\.?\s+C\d+[^\n]{0,80}?:\s*CHALLENGER LINK BROKEN/g)||[]).length;const k=s.slice(0,200);seen.set(k,[said,act]);});
 console.log(fn,last,[...seen.values()].map(x=>x.join('/')).join(' '));}}
