const fs=require('fs');const W='/mnt/project-files/wall2024/';const out={};
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const run=f.match(/\d+/)[0];const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 let p=null;for(const n of Object.keys(rd)){if(p)break;if(!/Panel Build|Build Independent Verdict/.test(n))continue;for(const r of rd[n]){const j=r.data&&r.data.main&&r.data.main[0]&&r.data.main[0][0]&&r.data.main[0][0].json;if(j&&j.judges&&j.judges[0]){p=j.judges[0].body.messages[0].content;break;}if(j&&j.body&&j.body.messages){p=j.body.messages[0].content;break;}}}
 out[run]=p;console.log(run,p?p.length:null,p?[/AGAINST THE KJV/.test(p),/NOT NAMED:/.test(p),/NEW IN CLOSE/.test(p),/UNPROVEN, not a witness/.test(p)].join(','):'');}
fs.writeFileSync('jprompts.json',JSON.stringify(out));
