// W1 grade of pkgDFR: OPEN (library line 1898) of base b6d0d27a and parent 03b0e907 run on every distinct line that
// carries "UNDERDETERMINED" in the 12 exports (any node, any string), and on the send-back items that carry the fault.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const L=w=>{const T=un(w).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const rx=l=>new Function(l.trim()+';return OPEN;')();
const O=rx(L('/mnt/project-files/wall2024/parent_s142_JOINT_A21_SRH.json')[1898]),N=rx(L(process.argv[2]||'/mnt/project-files/wall2024/parent_s143_DFR.json')[1898]);
const W='/mnt/project-files/wall2024/';const seen=new Set();let n=0,f2p=0,p2f=0;const out=[];
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 const walk=o=>{if(typeof o==='string'){if(!o.includes('UNDERDETERMINED'))return;for(const l0 of o.split('\n')){const l=l0.replace(/\\+"/g,'"');if(!/D\d+\s+vs\.?\s+C\d+[^\n]{0,200}?:\s*\**\s*UNDERDETERMINED/.test(l))continue;if(seen.has(l))continue;seen.add(l);n++;const a=O.test(l),b=N.test(l);if(a!==b){if(b)f2p++;else p2f++;out.push(f.slice(2,7)+' '+(b?'FAIL->PASS':'PASS->FAIL')+' | '+l.slice(0,260));}}}else if(o&&typeof o==='object')for(const k in o)walk(o[k]);};
 for(const k in rd)rd[k].forEach(r=>walk(r.data));}
out.forEach(x=>console.log(x));console.log('distinct UNDERDETERMINED collision lines',n,'| fail->pass',f2p,'| pass->fail',p2f);
const P=[['The parties differ on the temporal force of the clause.',1],['Both accept the stated tribe and differ on the last step of descent.',1],['The sides differed as to what the register shows.',1],['while disputing its biological implication',1],['They differ over its bearing on begetting.',1],['They differ in tone only.',0],['[CR3] and [CR4] answer the press.',0],['The readings are different.',0],['Their accounts differing, the link is broken.',0],['The sides do not differ on the timing.',1]];
let ok=0;for(const [t,w] of P){const g=N.test(t)?1:0;if(g===w)ok++;console.log(g===w?'OK  ':'FAIL','new',g?'pass':'fail','old',O.test(t)?'pass':'fail','|',t);}console.log('plants',P.length,'as expected',ok,'(the last is the recorded limit)');
