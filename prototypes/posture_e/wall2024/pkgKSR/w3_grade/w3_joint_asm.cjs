// W3 J1, J2, J7: assembly and source checks of the joint files.
const fs=require('fs');const {rebuild}=require('../../pkgLIB/unpack.cjs');process.chdir(__dirname+'/../..');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};const by=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));
const F={S:'/mnt/project-files/wall2024/fetchback_live_s110.json',R3:'pkgKSR/parent_s110_ALL.json',GFS:'/mnt/project-files/wall2024/parent_s110_GFS.json',QRD:'pkgQRD/parent_s110_QRD.json',F3A:'pkgF3A/parent_s110_F3A2s_ALL.json',JB:'pkgKSR/joint_GFS_QRD_F3A2s.json',JC:'/mnt/project-files/wall2024/joint_GFS_QRD_F3A2s_plus_KSR_ECB_rev3.json'};
const W={},B={};for(const k in F){W[k]=g(F[k]);B[k]=by(W[k]);}let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const js=(k,n)=>(B[k][n].parameters||{}).jsCode||'';const same=(a,b,n)=>JSON.stringify(B[a][n])===JSON.stringify(B[b][n]);const names=W.S.nodes.map(n=>n.name);
const diff=(a,b)=>names.filter(n=>!same(a,b,n));const code=k=>W[k].nodes.reduce((s,n)=>s+(((n.parameters||{}).jsCode)||'').length,0);
const dJB=diff('JB','S');console.log('JB vs s110 nodes: '+dJB.join(', ')+' | code '+(code('JB')-code('S')));
T(dJB.sort().join()===['Alternate Merge','QR Check','QR Final','Second Alternate?','Shared Library'].sort().join(),'J1 JB differs from s110 in exactly the five expected nodes');
T(same('JB','QRD','QR Check')&&same('JB','QRD','QR Final'),'J1 QR Check, QR Final equal the pkgQRD file');T(same('JB','F3A','Second Alternate?')&&same('JB','F3A','Alternate Merge'),'J1 Second Alternate?, Alternate Merge equal the pkgF3A rev 2s file');T(same('JB','GFS','Shared Library'),'J1 Shared Library equals the pkgGFC rev s file');
const dJC=diff('JC','JB');console.log('JC vs JB nodes: '+dJC.map(n=>n+' '+(js('JC',n).length-js('JB',n).length)).join(', ')+' | code '+(code('JC')-code('JB'))+' | JC vs s110 code '+(code('JC')-code('S')));
T(dJC.sort().join()===['Alt Send Back Build','R2 Alt Send Back Build','Send Back Build','Shared Library'].sort().join(),'J1 JC differs from JB in exactly the four rev 3 nodes');
T(['Send Back Build','Alt Send Back Build','R2 Alt Send Back Build'].every(n=>same('JC','R3',n)),'J1 the three Send Back Build nodes in JC equal those of the s110 rev 3 candidate');
T(['QR Check','QR Final','Second Alternate?','Alternate Merge'].every(n=>same('JC','JB',n)),'J7 the pkgQRD and pkgF3A nodes in JC equal JB');
for(const k of ['JB','JC'])T(JSON.stringify(W[k].connections)===JSON.stringify(W.S.connections)&&W[k].nodes.length===W.S.nodes.length,'J1 '+k+' connections and node count equal s110');
// J2 source level
const src=(k,n)=>{const c=js(k,n);if(!/^\/\/ pkgLIB stub/.test(c))return c;try{return rebuild(c,js(k,'Shared Library'));}catch(e){return null;}};
let stubs=0,skipped=[],badn=[];for(const n of names){if(!/^\/\/ pkgLIB stub/.test(js('S',n)))continue;const s=src('S',n),r=src('R3',n),gf=src('GFS',n),jc=src('JC',n);if([s,r,gf,jc].some(x=>x===null)){skipped.push(n);continue;}stubs++;
 const L=x=>x.split('\n');const sl=L(s),rl=L(r),gl=L(gf),jl=L(jc);
 // lines GFS changes or adds relative to s110 (multiset), and lines rev 3 changes relative to s110
 const ms=a=>{const m=new Map();a.forEach(x=>m.set(x,(m.get(x)||0)+1));return m;};const sub=(a,b)=>{const m=ms(b);const o=[];a.forEach(x=>{const c=m.get(x)||0;if(c)m.set(x,c-1);else o.push(x);});return o;};
 const gAdd=sub(gl,sl),gDel=sub(sl,gl),jAdd=sub(jl,rl),jDel=sub(rl,jl);if(JSON.stringify(gAdd)!==JSON.stringify(jAdd)||JSON.stringify(gDel)!==JSON.stringify(jDel))badn.push(n+' (GFS +'+gAdd.length+'/-'+gDel.length+', JC-R3 +'+jAdd.length+'/-'+jDel.length+')');}
T(!badn.length,'J2 '+stubs+' library stub nodes: JC against s110 rev 3 differs in exactly the lines pkgGFC rev s changes against s110'+(badn.length?': '+badn.join('; '):'')+(skipped.length?' | not unpacked by this tool: '+skipped.join(', '):''));
console.log(ok+' OK, '+bad+' FAIL');
