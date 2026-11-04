const fs=require('fs');const c=fs.readFileSync('base/D4 Extract.js','utf8');const RENUM=eval(c.match(/const RENUM=(\/[^;]+\/[a-z]*);/)[1]);
const o=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).data.resultData.runData['Build Save Body'][0].data.main[0][0].json;
for(const [sd,t] of [['D',o.cr4||''],['C',o.dr4||'']]){const old=t.match(RENUM);const nw=[...t.matchAll(new RegExp(RENUM.source,RENUM.flags.replace('g','')+'g'))].find(m=>!/\b(?:not|no|never|nor|without)\b[^.\n]{0,40}$/i.test(t.slice(Math.max(0,m.index-60),m.index)))||null;
 const ctx=m=>m?'"'+t.slice(Math.max(0,m.index-50),m.index+60).replace(/\s+/g,' ')+'"':'none';console.log(sd,'old',ctx(old),'| new',ctx(nw));}
