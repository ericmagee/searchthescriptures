// pkgCMX (W2): a confirmed closing contradiction does not overwrite the OTHER side's LINK BROKEN on a shared collision line.
// The line keeps the judge's break; the contradicting side's break is set on its other lines, or counted once when no line holds it.
// usage: node pkgCMX/build.cjs <fetch-back> <out>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const [,,inF,outF]=process.argv;let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o.slice(0,80));return s.replace(o,()=>n);};
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
const edLib=(o,nw)=>{const i=one(o);const s=L[i];L[i]=rep(s,o,nw);const d=L[i].length-s.length;for(const [n,v] of uses(i))v.n+=d;console.log('lib line',i,'+'+d,'used by',uses(i).map(x=>x[0]).join(', '));};
const OB=v=>`const __ob=${v}.cec||(/^(?:DEFENDER|CHALLENGER) LINK BROKEN$/.test(${v}.grade||'')&&${v}.grade!==G?${v}.grade.split(' ')[0]:'');`;
edLib("if(c.cec){if(c.cec!==x.side)trig.push('CLOSE-CONTRADICTION '+c.link+' ('+x.side+' break not set: the line already carries the '+c.cec+' break)');continue;}c.cec=x.side;",
 "{"+OB('c')+"if(__ob&&__ob!==x.side){trig.push('CLOSE-CONTRADICTION '+c.link+' ('+x.side+' break not set: the line already carries the '+__ob+' break)');hit--;continue;}}if(c.cec)continue;c.cec=x.side; /* pkgCMX */");
edLib("hit++;if(c0.cec)continue;c0.cec=x.side;","hit++;{"+OB('c0')+"if(__ob&&__ob!==x.side){hit--;continue;}}if(c0.cec)continue;c0.cec=x.side; /* pkgCMX */");
edLib("if(b.side==='DEFENDER'&&+q[1]===b.link)return 'DEFENDER LINK BROKEN';if(b.side==='CHALLENGER'&&+q[2]===b.link)return 'CHALLENGER LINK BROKEN';",
 "if(b.side==='DEFENDER'&&+q[1]===b.link&&z.grade!=='CHALLENGER LINK BROKEN')return 'DEFENDER LINK BROKEN';if(b.side==='CHALLENGER'&&+q[2]===b.link&&z.grade!=='DEFENDER LINK BROKEN')return 'CHALLENGER LINK BROKEN';");
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok,'| SIZE (measured): Shared Library',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'| prompt 0');
fs.writeFileSync(outF,JSON.stringify(D));
