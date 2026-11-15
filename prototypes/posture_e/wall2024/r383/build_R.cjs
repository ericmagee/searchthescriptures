// R383 removal: take ASK 296 (pkgFBD), 300 (pkgFBA), 301-303 (pkgKDA) and 304 (pkgKDG) out of the judge path. Base: s207 fetchback. Ruling 383.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, f206, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));const N=W.nodes||W.data.nodes;
const W6=JSON.parse(fs.readFileSync(f206,'utf8'));const N6=W6.nodes||W6.data.nodes;
const L=N.find(n=>n.name==='Shared Library');const T=L.parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const T6=N6.find(n=>n.name==='Shared Library').parameters.jsCode;const LIB6=JSON.parse(T6.slice(T6.indexOf('\n/*LIB*/')+8,T6.lastIndexOf('\n/*MAP*/')));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
const out=[];const cut=(i,a)=>{const l=LIB[i];if(l.split(a).length!==2)throw new Error('anchor at '+i);LIB[i]=l.replace(a,()=>'');out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
// KDA/KDG lines: only those packages touched them; restore s206 text
for(const i of [689,2280,2281,2286]){const b=LIB[i];if(!/pkgKD[AG]/.test(b))throw new Error('no KDA/KDG at '+i);LIB[i]=LIB6[i];out.push('LIB '+i+' '+b.length+'->'+LIB[i].length+' (s206 text)');}
// FBD hook at 1448 and FBD code at 1530; BNS kept
cut(1448,"{const __fb=typeof fbdRefuse2024==='function'?fbdRefuse2024(to):null;if(__fb){items.push({sid:x.sid,kind:'NOT APPLIED',why:__fb,to,lines:[o],fbd:true});continue;}} /* pkgFBD, ASK 296 */");
{const l=LIB[1530];const a=l.indexOf(' /* pkgFBD, ASK 296'),b=l.indexOf(' /* pkgBNS, ASK 295');if(a<0||b<a)throw new Error('1530 anchors');LIB[1530]=l.slice(0,a)+l.slice(b);out.push('LIB 1530 '+l.length+'->'+LIB[1530].length);}
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);L.parameters.jsCode=T1;out.push('Shared Library '+T.length+'->'+T1.length+' users '+users.length+' '+users.join(', '));
// Assume Check Record: reverse the six pkgFBA edits
const A=N.find(n=>n.name==='Assume Check Record');let c=A.parameters.jsCode;const c0=c.length;
const rep=(a,b)=>{if(c.split(a).length!==2)throw new Error('ACR anchor: '+a.slice(0,70));c=c.replace(a,()=>b);};
{const a=c.indexOf('/* pkgFBA, ASK 300: the DG-8 FORBIDDEN triggers'),b=c.indexOf('\nconst facts=[],items=[];');if(a<0||b<a)throw new Error('ACR head');c=c.slice(0,a)+c.slice(b+1);}
rep("fx.forbidden=fbaHit2024(x.fact);facts.push(fx); /* pkgFBA */","facts.push(fx);");
rep("if(both||fx.forbidden)for(const j of spared)if(j.grade==='SPARED')items.push({seat:j.seat,side:p.side,n:p.n,k:x.k,fact:x.fact,both,fbd:fx.forbidden});","if(both)for(const j of spared)if(j.grade==='SPARED')items.push({seat:j.seat,side:p.side,n:p.n,k:x.k,fact:x.fact});");
rep("cure_status:f.forbidden?'ITEM (DG-8 FORBIDDEN, '+f.forbidden.f+')'+(f.both_not_stated?' | BOTH NOT STATED':''):f.both_not_stated?'BOTH NOT STATED'","cure_status:f.both_not_stated?'BOTH NOT STATED'");
rep("+(f.forbidden?' -- DG-8 FORBIDDEN (pkgFBA, ASK 300): '+f.forbidden.f+', \"'+f.forbidden.q+'\"; an inferred act on that ground is an item, not NO ITEM':'')+' -- JUDGES: '+gtxt(f.grades)+' -- RECORD-ONLY TRIAL (VP4)'}))","+' -- JUDGES: '+gtxt(f.grades)+' -- RECORD-ONLY TRIAL (VP4)'}))");
rep("cure_reason:'E-ASSUME: the judge SPARED premise '+it.n+'; '+(it.fbd?'its assumed fact \"'+it.fact+'\" is DG-8 FORBIDDEN ('+it.fbd.f+', \"'+it.fbd.q+'\"; pkgFBA, ASK 300)'+(it.both?', and both readers find no verse quoted in the answering block that states it':''):'both readers find no verse quoted in the answering block that states \"'+it.fact+'\", and the ruling names none')+'.","cure_reason:'E-ASSUME: the judge SPARED premise '+it.n+'; both readers find no verse quoted in the answering block that states \"'+it.fact+'\", and the ruling names none.");
A.parameters.jsCode=c;out.push('Assume Check Record '+c0+'->'+c.length);
fs.writeFileSync(fout,JSON.stringify(W));console.log(out.join('\n'));
