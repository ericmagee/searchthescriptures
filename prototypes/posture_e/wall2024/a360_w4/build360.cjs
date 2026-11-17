// ASK 360 (plan Wall 7583; agreed W1 7589 A1 A2, W2 7591, W3 7596 A3): pkgRMR removal text subtracts the pkgGCP count-offs. Base: live s245 (aefe76c1).
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]||'../rdf/fetchback_s245.json'));const BASEV=process.argv[3]||'aefe76c1-9054-4420-aa3f-ceca3a65369e';if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const u=unpack(w);const L=u.L.slice();
const rep=(i,o,n)=>{const c=L[i].split(o).length-1;if(c!==1)throw new Error('line '+i+' anchor count '+c);L[i]=L[i].replace(o,()=>n);};
rep(1579,"function rmrOf(raw,drv,isLive){const by={};const add=(k,n)=>{by[k]=(by[k]||0)+n;};",
 String.raw`function rmrOf(raw,drv,isLive){const by={};const add=(k,n)=>{by[k]=(by[k]||0)+n;};const __gN=s=>String(s==null?'':s).replace(/\\+/g,'').replace(/[*_`+'`'+String.raw`"“”]+/g,'').replace(/\s+/g,' ').trim().toUpperCase();const __gOff={};for(const l of String(raw==null?'':raw).split('\n')){const q=l.match(/^\[AUDIT v52: CURE COUNT OFF \(pkgGCP\) -- SEAT: [^;]*; ITEM: (.*?); RULE: ([^;]+?); /);if(q){const k=q[2].trim()+'|'+__gN(q[1]);__gOff[k]=(__gOff[k]||0)+1;}} /* ASK 360: a count pkgGCP took off (AUDIT v52) is not read as a counted line, one for one on RULE and ITEM */`);
rep(1582,"(?:SEAT: [^;]*; )?ITEM: [^;]*; RULE: ([^;]+); RESULT: ([A-Z ]+?)(?:;|\\])/);","(?:SEAT: [^;]*; )?ITEM: ([^;]*); RULE: ([^;]+); RESULT: ([A-Z ]+?)(?:;|\\])/);");
rep(1583,"if(m){if(m[2].trim()!=='CURED'&&isLive(m[1].trim()))add(m[1].trim()+' (cure)',1);continue;}",
 "if(m){if(m[3].trim()!=='CURED'&&isLive(m[2].trim())){const __gk=m[2].trim()+'|'+__gN(m[1]);if(__gOff[__gk]>0){__gOff[__gk]--;continue;}add(m[2].trim()+' (cure)',1);}continue;}");
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[4]||'target_360.json',JSON.stringify(w));console.log('MAP n updated',fixed.length,fixed.join(', '));
