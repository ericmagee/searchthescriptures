// pkgKWH (W2; Worker_A3 Wall 5200 item 3b, confirmed W2 Wall 5204 and W1 00:26 CST 2026-11-12):
// kwLines421 (K-W) matched "I grant" and "I withdraw" inside the heading "What I grant and what I withdraw." (35379, every seat).
// A K-W match is skipped when it is only a heading-shaped "what I <verb>" clause: the clause starts its sentence or line with "What",
// may chain "and/or/, what I <verb>", and ends at once with . ! or ?, or with a colon that ends the line. A sentence such as "What I withdraw is LINK 3." is NOT skipped.
// Usage: node build_KWH.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const one=(re)=>{const h=Lb.map((l,i)=>re.test(l)?i:-1).filter(i=>i>=0);if(h.length!==1)throw new Error('anchor '+re+' hits '+h.length);return h[0];};
const rep=(i,x,y)=>{if(Lb[i].split(x).length!==2)throw new Error('line '+i+' anchor not once: '+x);Lb[i]=Lb[i].replace(x,()=>y);};
const VB=String.raw`(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)`;
const i0=one(/^\s*for\(const m of t\.matchAll\(RX\)\)\{if\(n>=10\)break;/);
const A="if((/^\\s*#/.test(ln)&&!/[.!?][\"\\u201d']?\\s*$/.test(ln))||";
rep(i0,A,A+"(/(?:^|[.!?:][\"\\u201d')]?\\s+)[\\s#>-]*what\\s+(?:I\\s+"+VB+"\\s*(?:,\\s*(?:and|or)?|and|or)\\s*what\\s+)*$/i.test(bf)&&/^I\\s+"+VB+"(?:\\s*(?:,\\s*(?:and|or)?|and|or)\\s*what\\s+I\\s+"+VB+")*\\s*(?:[.!?]|:\\s*(?:\\n|$))/i.test(t.slice(m.index)))/* pkgKWH: heading-shaped \"What I grant and what I withdraw.\" */||");
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');const n0={};for(const e in M)n0[e]=M[e].n;for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
console.log('line',i0,'| Shared Library',T.length,'->',N.parameters.jsCode.length,'(+'+(N.parameters.jsCode.length-T.length)+')');for(const e in M)if(M[e].n!==n0[e])console.log('  rebuilt',e,n0[e],'->',M[e].n,'(+'+(M[e].n-n0[e])+')');
const out=JSON.stringify(W);fs.writeFileSync(process.argv[3],out);console.log('written',process.argv[3],'sha256',crypto.createHash('sha256').update(out).digest('hex').slice(0,16));
