// Stub reader to test the driver only. Reads KEYSTONE lines per spec s.2 after s.0 normalisation (simplified).
const norm=l=>l.replace(/\\"/g,'"').replace(/[*_`]/g,'').replace(/^\s*(?:[-•>]|\d+[.)])\s*/,'').replace(/[ \t]+/g,' ').trim();
exports.readLines=text=>{const out=[];text.split('\n').forEach((l,n)=>{const m=norm(l).match(/^KEYSTONE:\s*(D\d+)\s*(?:--|–|—)\s*(STANDS|BROKEN|WITHDRAWN)\b/);if(m)out.push({n,form:'KEYSTONE',fields:{link:m[1],grade:m[2]}});});return out;};
