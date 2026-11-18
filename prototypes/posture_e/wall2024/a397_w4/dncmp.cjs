// ASK 397: downstream nodes. enforcer_log as multiset (added/lost), md as line diff, every other key equal (sendback compared key by key)
const o=require(require('path').resolve(process.argv[2]));const K=r=>JSON.stringify({...r,at:undefined});
const ldiff=(a,b)=>{const A=String(a||'').split('\n'),B=String(b||'').split('\n');const ca=new Map();A.forEach(l=>ca.set(l,(ca.get(l)||0)+1));const add=[];B.forEach(l=>{const c=ca.get(l);if(c)ca.set(l,c-1);else add.push(l);});const lost=[];for(const [l,c] of ca)for(let i=0;i<c;i++)lost.push(l);return {add,lost};};
for(const k of Object.keys(o.s262)){if(/Send Back/.test(k))continue;const A=o.s262[k],Z=o.target[k];A.forEach((a,i)=>{const z=Z[i]||{};
 const other=Object.keys({...a,...z}).filter(f=>!['enforcer_log','md','sendback'].includes(f)&&JSON.stringify(a[f])!==JSON.stringify(z[f]));
 const sbo=a.sendback&&z.sendback?Object.keys({...a.sendback,...z.sendback}).filter(f=>JSON.stringify(a.sendback[f])!==JSON.stringify(z.sendback[f])).map(f=>f+' '+JSON.stringify(a.sendback[f])+'->'+JSON.stringify(z.sendback[f])):[];
 let el='';if(a.enforcer_log||z.enforcer_log){const cnt=new Map();(a.enforcer_log||[]).forEach(r=>cnt.set(K(r),(cnt.get(K(r))||0)+1));const added=[];(z.enforcer_log||[]).forEach(r=>{const c=cnt.get(K(r));if(c)cnt.set(K(r),c-1);else added.push(r);});const lost=[...cnt.values()].reduce((s,v)=>s+v,0);
  el=' | enforcer_log '+(a.enforcer_log||[]).length+'->'+(z.enforcer_log||[]).length+' added '+added.length+' (all t397 TRIAL E-LAY: '+added.every(r=>r.rule==='E-LAY'&&/^TRIAL rule \(recorded only/.test(r.cure_reason||'')&&r.cure_status==null&&r.silent!==true)+') lost '+lost;}
 let md='';if(a.md!==undefined||z.md!==undefined){const d=ldiff(a.md,z.md);md=' | md lines added '+d.add.length+' lost '+d.lost.length;if(process.env.MD)d.add.concat(d.lost.map(x=>'LOST '+x)).forEach(l=>md+='\n     '+l.slice(0,260));}
 console.log(k,'| other keys changed:',other.join(',')||'none','| sendback:',sbo.join('; ')||'same'+el+md);});}
