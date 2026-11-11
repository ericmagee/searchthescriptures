// Joint pkgEKR + pkgSGR on the s142 base (= ASK 87 joint parent 3aa73d1c). Applies pkgSGR's two Shared Library lines (3163, 3169) from its s141 parent onto the pkgEKR parent.
// usage: node jointEKR_SGR/build.cjs <EKR parent> <SGR parent> <s141 fetch-back> <out>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const [,,eF,sF,bF,outF]=process.argv;const ld=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));return [D,(D.data||D).workflow||(D.data||D)];};
const [D,W]=ld(eF),[,S]=ld(sF),[,B]=ld(bF);const W0=JSON.parse(JSON.stringify(W));
const parts=W=>{const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');return {c,a,b,e,L:JSON.parse(c.slice(a,b)),M:JSON.parse(c.slice(b+8,e))};};
const P=parts(W),PS=parts(S),PB=parts(B);if(PS.L.length!==PB.L.length||P.L.length!==PB.L.length)throw new Error('line count');
const sg=PB.L.map((l,i)=>l!==PS.L[i]?i:-1).filter(i=>i>=0);console.log('pkgSGR lines',sg);
const by={};W.nodes.forEach(n=>by[n.name]=n);const before={};for(const n of Object.keys(P.M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,P.c);
const has=(v,i)=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1]));
for(const i of sg){if(P.L[i]!==PB.L[i])throw new Error('line '+i+' already changed in the EKR parent');const d=PS.L[i].length-P.L[i].length;P.L[i]=PS.L[i];for(const [n,v] of Object.entries(P.M))if(has(v,i))v.n+=d;console.log('line',i,'+'+d,Object.entries(P.M).filter(([n,v])=>has(v,i)).map(x=>x[0]).join(', '));}
// stubs: pkgSGR changed no stub; check
for(const n of S.nodes)if(n.name!=='Shared Library'){const o=B.nodes.find(z=>z.name===n.name);if(JSON.stringify(o.parameters)!==JSON.stringify(n.parameters))throw new Error('pkgSGR changes node '+n.name);}
const LJ=JSON.stringify(P.L);let nc=P.c.slice(0,P.a)+LJ+'\n/*MAP*/'+JSON.stringify(P.M)+P.c.slice(P.e);const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+P.L.length+' lines');
by['Shared Library'].parameters.jsCode=nc;let ok=0,ch=[];for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==P.M[n].n)throw new Error('length '+n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');if(s!==before[n])ch.push(n+' +'+(s.length-before[n].length));}
console.log('stubs rebuilt and compiled',ok,'| changed vs EKR parent',ch.join('; '));
const code=x=>x.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);console.log('SIZE vs EKR parent',code(W)-code(W0),'| vs s142 base: run mapcheck');
fs.writeFileSync(outF,JSON.stringify(D));console.log('sha256',crypto.createHash('sha256').update(fs.readFileSync(outF)).digest('hex').slice(0,16));
