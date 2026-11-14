// pkgBFX rev 2 (W1 6226 F1 pkgEPK LIB 2938 and F2 pkgEPS LIB 3403; W2 6227 rctCheck reads only premise j's segment, or a reason naming no premise or premise j; W3 6225 4.1: the test needs a link number; ASK 266 (Eric 10:08 'i approve all'): K-UNX range item when a count names a premise above the list, with its cure rule). rev 1 (ASK 265 + the K-UNX-A exit; team thread Wall 6210, W1 6211 C and 6217, W2 6213 B3): the pkgBCL borrowed-footing count ("footing borrowed from contested Link(s)") is not a missing-layer or ASSUMES charge (DG-61), so (1) unxaCheck, the K-UNX-A gate path, does not fire on a premise whose count carries it, and (2) rctCheck, the pkgRCT recount guard, accepts it as the reason. Shared Library only: the unxaCheck head (LIB 452 and 3465) and rctCheck (LIB 1390). MAP n of each user recomputed, header sha recomputed. usage: node build.cjs <live s195 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha 7582587ef17b5a26,'))throw new Error('not the s195 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const BFX="/footing\\s+borrowed\\s+from\\s+contested\\s+Links?\\s+\\d/i";
const A1="if(all.some(z=>UNXA_HARD.test(unxaHead(z.seg))))return null;";
const B1=A1+"if(all.some(z=>"+BFX+".test(z.seg)))return null; /* pkgBFX: a borrowed-footing count is not an ASSUMES charge */";
const A2="const txt=unxSegs(String(to)).filter(s=>s.ns.includes(j)).map(s=>s.seg).concat([String(x&&x.why||'')]);";
const B2=A2+"{const __w=String(x&&x.why||'');const __ws=unxSegs(__w);if(unxSegs(String(to)).some(s=>s.ns.includes(j)&&"+BFX+".test(s.seg))||("+BFX+".test(__w)&&(!__ws.length||__ws.some(s=>s.ns.includes(j)&&"+BFX+".test(s.seg)))))continue;} /* pkgBFX: the borrowed-footing count names its own ground (W2 6227) */";
const A3="if(k.length>=2&&!unxLack(rs,k).missing.length)i.epk=";
const B3="if(k.length>=2&&!unxLack(rs,k).missing.length&&!"+BFX+".test(rs))i.epk=";
const A4="if(unxLack(v.why,k).missing.length)return null;";
const B4="if("+BFX+".test(String(v.why)))return null; /* pkgBFX */"+A4;

const A5="for(const j of s.ns){const all=segsOf(j);";
const B5="for(const j of s.ns){if(!lbBlockText(R[rk],j)){let mx=0;for(let q=1;q<j;q++)if(lbBlockText(R[rk],q))mx=q;if(mx&&j>mx){const id=side+' premise '+j;if(!items.some(x=>x.link===id)){const why='counted UNEXHIBITED in '+lab+' as premise '+j+', but the list against the '+side.toLowerCase()+' has premises 1 to '+mx+' (pkgBFX, ASK 266)';items.push({rule:'K-UNX',a:'RANGE',side,link:id,premise:j,kinds:[],conc:n0,l1:'',l1ref:'',press:'',why,line:id+': '+why+'. Write a CHANGE TO for the '+lab+' line that gives each counted premise its number in the list (1 to '+mx+'), or write a CORRECTED COUNT for '+lab+' without this premise. A KEEP does not cure it. Your count: '+s.seg.replace(/\\s+/g,' ').trim().slice(0,400)});marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}continue;}}const all=segsOf(j);";
const A6="if(x.rule==='K-UNX'&&x.a){const st=stmtOf(x);";
const B6="if(x.rule==='K-UNX'&&x.a==='RANGE'){const cs=o.count.filter(c=>c.side===x.side);if(cs.length&&cs.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (K-UNX range, pkgBFX): CORRECTED COUNT '+cs[0].n+' takes the premise out of the count',cs.map(c=>c.line));return res('UNCURED','TRIAL rule (K-UNX range, pkgBFX): the count still names premise '+x.premise+', which is not in the list; no CHANGE TO gives it a listed number and no CORRECTED COUNT below '+(x.conc||0),null);}"+A6;
const out=[];
for(const [i,A,B] of [[452,A1,B1],[3465,A1,B1],[1390,A2,B2],[2938,A3,B3],[3403,A4,B4],[466,A5,B5],[1219,A6,B6]]){const l=LIB[i];if(l.split(A).length!==2)throw new Error('anchor at '+i);LIB[i]=l.replace(A,()=>B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);}
if(LIB.join('\n').split(A1).length!==3)throw new Error('unxaCheck head count');for(const B of [B2,B3,B4,B5,B6])if(LIB.join('\n').split(B).length!==2)throw new Error('edit not unique');
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log('edits: '+out.join('; '));console.log('users ('+users.length+'): '+users.join('; '));
console.log('jsCode',T.length,'->',T1.length,'| lib sha',sha(JSON.stringify(JSON.parse(T.slice(iL+8,iM)))),'->',sha(LJ));
