// Citation replay (F7, F10): Citation Scan -> Quote Compare -> Quote Report on the stored rounds of 32255 and 32266 (close rounds included), the
// KJV reads emulated from data/kjv_rows.json (every verse of each chapter cited, read by SELECT) and data/kjv_find.json. Base against new; and new
// with the F10 switch turned on in a copy (the operator has ruled partial quotations count, so the switch stays off in the package).
const fs=require('fs');const C=require('./cite_lib.cjs');const D=__dirname+'/../';
const sw=D+'test/_sw';fs.mkdirSync(sw,{recursive:true});for(const n of ['Quote Compare','Quote Report'])fs.writeFileSync(sw+'/'+n+'.js',fs.readFileSync(D+'new/'+n+'.js','utf8').replace('const SHORTENED_CHECK=false;','const SHORTENED_CHECK=true;'));
for(const n of ['32255','32266']){const r=JSON.parse(fs.readFileSync(D+'data/run'+n+'.json','utf8'));const o={};
 for(const v of ['base','new','test/_sw']){const x=C.run(v,r);o[v]=x.report;}
 const b=o.base,w=o.new,s=o['test/_sw'];console.log(n+' | base: checked '+b.checked+', matches '+b.matches+', mismatches '+b.mismatches+', not checked '+b.not_checked+' | new: checked '+w.checked+', matches '+w.matches+', mismatches '+w.mismatches+', not checked '+w.not_checked+' | switch on: matches '+s.matches+', mismatches '+s.mismatches);
 b.items.forEach((i,k)=>{const j=w.items[k];if(!j||j.status!==i.status)console.log('  changed: '+i.side+' '+i.round+' '+i.ref+' "'+String(i.quote).slice(0,60)+'": '+i.status+' -> '+(j?j.status:'(gone)'));});
 const sh=s.items.filter(i=>i.status==='SHORTENED');console.log('  switch on: '+sh.length+' SHORTENED (defender '+sh.filter(i=>i.side==='DEFENDER').length+', challenger '+sh.filter(i=>i.side==='CHALLENGER').length+'); e.g. '+sh.slice(0,3).map(i=>i.ref+' "'+String(i.quote).slice(0,40)+'"').join('; '));
 const nm=w.items.filter(i=>i.status!=='MATCHES'&&i.status!=='NOT CHECKED');console.log('  new non-matching items: '+nm.map(i=>i.ref+' '+i.status).join('; '));}
fs.rmSync(sw,{recursive:true});
