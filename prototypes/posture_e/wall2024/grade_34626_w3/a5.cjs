const {out,RD,fs}=require('./x.cjs');const S=JSON.stringify;
const am=out('Alternate Merge');console.log('Alternate Merge items',am.length,Object.keys(am[0].json).join(','));
const j=am[0].json;for(const k of Object.keys(j)){const v=j[k];const s=typeof v==='string'?v:S(v);console.log('  '+k+' ('+s.length+'): '+s.slice(0,240).replace(/\n/g,' / '));}
// find log rows
let log=null;for(const k of Object.keys(j)){if(Array.isArray(j[k])&&j[k].length>100&&j[k][0]&&j[k][0].rule!==undefined){log=j[k];console.log('LOG key',k,log.length);}}
if(log){fs.writeFileSync('log.json',S(log));const c={};for(const r of log){const key=[r.seat,r.kind,r.rule,r.cure_status].join(' | ');c[key]=(c[key]||0)+1;}Object.keys(c).sort().forEach(k=>console.log('  '+c[k]+'  '+k));}
