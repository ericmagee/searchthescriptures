const {r,out}=require('./x.cjs');
const sb=out('Send Back Build');console.log(sb.length, Object.keys(sb[0]).join(','));
const find=(o,p=[])=>{if(typeof o==='string'){if(o.includes('RETRACTED')&&o.length>3000)console.log('STR at',p.join('.'),o.length);}else if(o&&typeof o==='object')for(const k of Object.keys(o))find(o[k],p.concat(k));};
find(sb);
