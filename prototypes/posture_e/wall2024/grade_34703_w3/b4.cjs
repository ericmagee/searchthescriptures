const {RD,out}=require('./x.cjs');
const ms=out('Alternate Merge Seat')[0].json;
console.log('alternates_seated',JSON.stringify(ms.alternates_seated),'tried',JSON.stringify(ms.alternates_tried).slice(0,1500),'removed',JSON.stringify(ms.drv_removed).slice(0,800));
const s=JSON.stringify(ms);
// find haiku body text
function walk(o,p,d){if(d>5||!o)return;if(typeof o==='string'){if(o.includes('withdrawn-keystone')&&o.includes('AUDIT'))console.log('BODY AT',p,o.length);return}if(typeof o==='object')for(const k in o)walk(o[k],p+'.'+k,d+1)}
walk(ms,'ms',0);
const n=out('Alternate Cure Normalize')[0].json;console.log(Object.keys(n));walk(n,'n',0);
const all=[];function walk2(o,d){if(d>6||!o)return;if(typeof o==='string'){if(o.includes('withdrawn-keystone')&&/AUDIT v2/.test(o))all.push(o);return}if(typeof o==='object')for(const k in o)walk2(o[k],d+1)}
walk2(n,0);walk2(ms,0);
if(all.length){const b=all.sort((a,b)=>b.length-a.length)[0];for(const l of b.split('\n'))if(/AUDIT/.test(l)&&/K-G7|K-C\b|K-F|K-RUL|NOT SEATED|UNCURED|CLOSE-CONTRA|D6|KEYSTONE|uncured/i.test(l))console.log('>>',l.slice(0,1100))}
