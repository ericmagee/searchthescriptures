// pkgUOR (W2; run 35379 haiku E-UNG S8-S11, Wall 5154; operator's ruling 2026-11-12 06:02Z "if we have something too strict lines.. we can relax it as needed"):
// an UNDERDETERMINED CHANGE TO keeps its grounds when the open point is written in the reason after "||" instead of in the line.
// Library lines of UND (pkgUND): undOk takes the reason; cure passes a.why for E-UNG and for E-HOLD on UNDERDETERMINED. The open point, and the [L1] when the line has none, may stand in the reason.
// Usage: node build_UOR.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const one=(re)=>{const h=Lb.map((l,i)=>re.test(l)?i:-1).filter(i=>i>=0);if(h.length!==1)throw new Error('anchor '+re+' hits '+h.length);return h[0];};
const rep=(i,x,y)=>{if(Lb[i].split(x).length!==2)throw new Error('line '+i+' anchor not once: '+x);Lb[i]=Lb[i].replace(x,()=>y);};
const i0=one(/^\s*function undOk\(line,ctx\)\{/);rep(i0,'function undOk(line,ctx){','function undOk(line,ctx,why){const __W=String(why||\'\').replace(/\\\\+"/g,\'"\');');
const i1b=one(/^\s*const c=ECL\.check\('FORCED: X -- GROUND: '\+L,ctx\);if\(c\.l1==='NONE'\)/);rep(i1b,"const c=ECL.check('FORCED: X -- GROUND: '+L,ctx);","let c=ECL.check('FORCED: X -- GROUND: '+L,ctx),__lw=false;if(c.l1==='NONE'&&__W){const c1=ECL.check('FORCED: X -- GROUND: '+L+' '+__W,ctx);if(c1.l1!=='NONE'){c=c1;__lw=true;}} /* pkgUOR: the [L1] may stand in the reason after \"||\" */");
const i1=one(/if\(!OPEN\.test\(L\)\)f\.push\('the line does not state what the record leaves open/);rep(i1,"if(!OPEN.test(L))f.push(","const __ow=!OPEN.test(L)&&OPEN.test(__W); /* pkgUOR: the open point may stand in the reason after \"||\" */\n  if(!OPEN.test(L)&&!__ow)f.push(");
const i2=one(/return \{ok:!f\.length,l1:c\.l1,faults:f,why:f\.length\?f\.join\(' \| '\):'\[L1\] '\+c\.l1\+'; states what the record leaves open'\};\}/);rep(i2,"'; states what the record leaves open'","'; states what the record leaves open'+(__ow||__lw?' ('+(__lw?'[L1]':'')+(__lw&&__ow?' and ':'')+(__ow?'open point':'')+' in the reason after \"||\", pkgUOR)':'')");
const i3=one(/if\(gr==='UNDERDETERMINED'\)\{const u=undOk\(to,ctx\);/);rep(i3,"const u=undOk(to,ctx);","const u=undOk(to,ctx,a.why);");
const i4=one(/if\(\/\\bUNDERDETERMINED\\b\/\.test\(to\)\)\{const u=undOk\(to,ctx\);/);rep(i4,"const u=undOk(to,ctx);","const u=undOk(to,ctx,a.why);");
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');const n0={};for(const e in M)n0[e]=M[e].n;for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
console.log('lines',i0,i1,i2,i3,i4,'| Shared Library',T.length,'->',N.parameters.jsCode.length,'(+'+(N.parameters.jsCode.length-T.length)+')');for(const e in M)if(M[e].n!==n0[e])console.log('  rebuilt',e,n0[e],'->',M[e].n,'(+'+(M[e].n-n0[e])+')');
const out=JSON.stringify(W);fs.writeFileSync(process.argv[3],out);console.log('written',process.argv[3],'sha256',crypto.createHash('sha256').update(out).digest('hex').slice(0,16));
