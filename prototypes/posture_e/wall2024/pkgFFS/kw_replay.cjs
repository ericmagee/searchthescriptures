// Stored LIVE K-W UNCURED rows through the CURRENT reader (s113) and pkgKWQ; one item per call, synthetic reply "RESPONSE: K-W <item> | <resp>", no rounds (estimate for NOT HELD quote checks that use rounds).
const fs=require('fs');const mk=f=>{const s=fs.readFileSync(f,'utf8');return new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts};')(()=>{throw 0},null);};
const O=mk('pkgLIB/strip_S113L/patched/Panel_Cure_Check.js'),N=mk('pkgLIB/strip_KCQW/patched/Panel_Cure_Check.js');const rows=JSON.parse(fs.readFileSync('pkgFFS/kw_rows.json','utf8'));
for(const r of rows){const it=[{rule:'K-W',link:r.item,side:r.item.split(' ')[0],line:r.line}];const rep={ok:true,text:'RESPONSE: K-W '+r.item+' | '+r.resp};
 const a=O.cureVerdicts(JSON.parse(JSON.stringify(it)),rep,{},{})[0],b=N.cureVerdicts(JSON.parse(JSON.stringify(it)),rep,{},{})[0];console.log(r.id,r.run,r.seat,'| s113',a.status,'| KWQ',b.status,'|',String(a.why).slice(0,70));}
