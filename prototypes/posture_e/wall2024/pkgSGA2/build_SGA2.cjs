// pkgSGA2 (W1 2695, W3 ruling): a send-back change with no line label that pkgSGA puts into one "Premise N" sentence of a count line, and that moves
// premise N between counted (UNEXHIBITED, CONCEDED) and not counted (spared, VOID, NOT VOID, SUPPORTED), would leave the line's count number
// stale. It is NOT APPLIED and goes to the gate, where the judge writes the whole line with its count. VOID to NOT VOID (33218) moves nothing and
// stays applied. Base: pkgSGA/patched (33fd73a, graded PASS). Run from wall2024/: node pkgSGA2/build_SGA2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const N=['Alternate Merge Seat','Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge'];
const A="if(__ix.length===1){__ss[__ix[0]]=to;to=__ss.join(' ');}else{";
const B="const __cnt=t=>{const g=psGrades(t);return g&&g.g&&(__pn in g.g)?g.g[__pn]==='COUNTED':null;};if(__ix.length===1){const __s0=__ss.join(' ');__ss[__ix[0]]=to;const __nw=__ss.join(' ');const __a=__cnt(__s0),__b=__cnt(__nw); /* pkgSGA2 (W1 2695): a sentence change that moves its premise into or out of the count leaves the line's number stale */\n"
 +"    if(__a!=null&&__b!=null&&__a!==__b){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change moves premise '+__pn+(__b?' into':' out of')+' the '+__lo+' count, so the line\\'s count number would be stale: write the whole line with its label and count (pkgSGA2, W1 2695)',to,lines:[o]});continue;}to=__nw;}else{";
const plan={base:'pkgSGA/patched (33fd73a)',nodes:[]};fs.mkdirSync('pkgSGA2/base',{recursive:true});fs.mkdirSync('pkgSGA2/patched',{recursive:true});
for(const n of N){const f=n.replace(/ /g,'_')+'.js';const s0=fs.readFileSync('pkgSGA/patched/'+f,'utf8');const c=s0.split(A).length-1;if(c!==1)throw new Error(n+': anchor x'+c);const s=s0.split(A).join(B);
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgSGA2/base/'+f,s0);fs.writeFileSync('pkgSGA2/patched/'+f,s);plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(n.padEnd(22),sha(s0),'->',sha(s));}
fs.writeFileSync('pkgSGA2/plan_SGA2.json',JSON.stringify(plan,null,1));
