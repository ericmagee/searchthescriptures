// pkgKNC (ASK 135 option 1, item c): the 10-item cap per side of the key-word reader kwLines421 (Shared Library) no longer
// drops a withdrawal. Live s164 stops a side after 10 plain-form matches (grant, concede, withdraw, drop, do not claim, no
// longer claim; skipped matches included), so a withdrawal after a run of plain grants is never shown. Now only listed plain
// "I grant" / "I concede" items take the 10 slots (a skipped match takes none), and a plain grant past them is passed over (the
// loop goes on), unless its listed text names a link.
// Every withdrawal form, every adverb or admit form (as pkgKGL), and (rev 2, W3 Wall 5456) a plain grant whose listed text
// (with what it points back to) names a link (D1-D9, C1-C9, LINK n, link n) is always read and takes no slot. Numbering stays in match order.
// MAP lengths and the header sha are recomputed (as pkgOAD). Usage: node build_KNC.cjs <parent json> <out json> [nocap]
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const one=(re)=>{const h=Lb.map((l,i)=>re.test(l)?i:-1).filter(i=>i>=0);if(h.length!==1)throw new Error('anchor hits '+h.length+' '+re);return h[0];};
const i0=one(/^function kwLines421\(/),i1=i0+1,i3=i0+3;
const rep=(i,o,nw)=>{if(Lb[i].split(o).length!==2)throw new Error('anchor '+o);Lb[i]=Lb[i].replace(o,typeof nw==='function'?nw:()=>nw);};
// Variant B (4th argument "nocap"): no cap at all; every match is read (MEASURED far larger; for the operator's choice).
const NOCAP=process.argv[4]==='nocap';
rep(i1,'let n=0,xn=0;',NOCAP?'let n=0;':'let n=0,gn=0;');
rep(i3,String.raw`for(const m of t.matchAll(RX)){if(n-xn>=10)break;if(!/^I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)$/i.test(m[0]))xn++;`,NOCAP?'for(const m of t.matchAll(RX)){/* pkgKNC B: no cap */':String.raw`for(const m of t.matchAll(RX)){const pg=/^I\s+(?:grant|concede)$/i.test(m[0]);/* pkgKNC */`);
if(!NOCAP)rep(i3+1,"n++;const id=side+' '+rk",()=>String.raw`if(pg&&!/\b(?:[DC][1-9]|LINK\s*\d|[Ll]ink\s+\d)\b/.test(s)&&gn++>=10)continue;n++;const id=side+' '+rk`);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('lines',i0,i3,'jsCode delta',N.parameters.jsCode.length-T.length,'sha',N.parameters.jsCode.match(/library sha ([0-9a-f]{16})/)[1]);
