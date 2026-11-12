const run=require('./rep.cjs');const mask=s=>JSON.stringify(s).replace(/20\d\d-\d\d-\d\dT[\d:.]+Z/g,'T');let eq=0,tot=0,err=0;
const N=['Cure Normalize','Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3','Panel Cure Check','Alternate Cure Normalize','Alternate Merge Seat','R2 Alternate Merge Seat','R2 Alternate Cure Normalize'];
run(process.argv[2]||'parent_s148_KWP.json',N,(fn,n,a,b)=>{tot++;if(a.ERR||b.ERR){err++;console.log('ERR',fn,n,a.ERR,b.ERR);return;}if(mask(a)===mask(b)){eq++;return;}
 // find K-W status differences
 const kw=o=>{const out=[];const w=(v,p)=>{if(v&&typeof v==='object'){if(v.rule==='K-W'&&v.status)out.push(p+' '+(v.link||'')+' '+v.status+' | '+String(v.why||'').slice(0,90));for(const k in v)w(v[k],p);}};w(o,'');return out;};
 const A=kw(a),B=kw(b);console.log('==',fn,n);B.forEach((x,i)=>{if(x!==A[i])console.log('   was:',A[i],'\n   now:',x);});
 if(JSON.stringify(A)===JSON.stringify(B))console.log('   (no K-W status change; other difference)',mask(a).length,mask(b).length);
}).then(()=>console.log('node runs',tot,'equal',eq,'errors',err));
