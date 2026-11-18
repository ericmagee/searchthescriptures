// ASK 397 DoD 5.1: per Send Back node, target rows = base rows + new TRIAL rows only; every other output key equal
const o=require(require('path').resolve(process.argv[2]));const K=r=>JSON.stringify({...r,at:undefined});
for(const k of Object.keys(o.s262)){const A=o.s262[k],Z=o.target[k];A.forEach((a,i)=>{const z=Z[i];
 const other=Object.keys({...a,...z}).filter(f=>f!=='sb_rows'&&f!=='sb_not_sent'&&f!=='sendback'&&JSON.stringify(a[f])!==JSON.stringify(z[f]));
 const sbo=a.sendback&&z.sendback?Object.keys({...a.sendback,...z.sendback}).filter(f=>JSON.stringify(a.sendback[f])!==JSON.stringify(z.sendback[f])):[];
 const cnt=new Map();(a.sb_rows||[]).forEach(r=>cnt.set(K(r),(cnt.get(K(r))||0)+1));const added=[];(z.sb_rows||[]).forEach(r=>{const c=cnt.get(K(r));if(c)cnt.set(K(r),c-1);else added.push(r);});const lost=[...cnt.values()].reduce((s,v)=>s+v,0);
 const ns0=(a.sb_not_sent||[]).length,ns1=(z.sb_not_sent||[]);const nsPrefixSame=JSON.stringify(a.sb_not_sent||[])===JSON.stringify(ns1.slice(0,ns0));
 console.log(k,'#'+i,'| other keys changed:',other.join(',')||'none','| sendback keys changed:',sbo.join(',')||'none','| rows',(a.sb_rows||[]).length,'->',(z.sb_rows||[]).length,'added',added.length,'lost',lost,'| not_sent prefix equal',nsPrefixSame,'+'+(ns1.length-ns0));
 for(const r of added)console.log('   +',r.seat,r.kind,r.rule,r.item,'| status',r.cure_status,'|',String(r.cure_reason).slice(0,70),'| line',String(r.flagged_line).slice(0,50));});}
