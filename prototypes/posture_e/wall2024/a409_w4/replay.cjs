// ASK 409 plant 4c: replay stored runs through the L2 chain (Citation Scan and L2 Count Plan are changed nodes) on live w408 and t409; compare every node output.
const fs=require('fs'),cr=require('crypto');const C=require('./chain409.cjs');
const rd=p=>JSON.parse(fs.readFileSync(p));const A=rd('rdf/fetchback_w408.json'),B=rd('a409/t409.json');
const D=rd('a405/debates.json').sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at)));const pick=D.slice(-2);
const md5=s=>cr.createHash('md5').update(s).digest('hex');let diff=0;
for(const r of pick){const ma=C.replay(A,r),mb=C.replay(B,r);const ks=Object.keys(ma).filter(k=>!k.startsWith('__'));let d=[];for(const k of ks){if(JSON.stringify(ma[k])!==JSON.stringify(mb[k]))d.push(k);}diff+=d.length;
 console.log(r.run_token,'nodes compared',ks.length,'differ',d.length,d.join(','),'| L2 Count Plan md5',md5(JSON.stringify(ma['L2 Count Plan'])),'| Citation Scan items',(ma['Citation Scan']||[]).length);}
C.save();console.log('network reads',C.net(),'| RESULT',diff?'DIFFER':'IDENTICAL');
