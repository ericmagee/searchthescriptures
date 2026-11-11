// pkgVP1B (W3, offline): gateAnsOpen2024 ties a MISSES/FAILS ANSWER CHECK to the link whose entry holds its MEANS when the verse stands under more than one link.
// Surgical Shared Library edit (two library lines). usage: node pkgVP1B/build_VP1B.cjs <parent> <out>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};const [,,inF,outF]=process.argv;
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o);return s.replace(o,()=>n);};
const A1="return {keys:p.keys,link:h?+h[1]:(sd==='CHALLENGER'?p.n:null)};",N1="return {keys:p.keys,link:h?+h[1]:(sd==='CHALLENGER'?p.n:null),seg:p.seg};";
const A2="const links=[...new Set(L.filter(p=>p.link!=null&&[...K].some(k=>p.keys.has(k))).map(p=>p.link))];";
const N2="let links=[...new Set(L.filter(p=>p.link!=null&&[...K].some(k=>p.keys.has(k))).map(p=>p.link))];"
+"if(links.length>1){const nz=s=>String(s==null?'':s).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\\s+/g,' ').trim();const mm=nz(one?a.means:(l.match(/(?:--|\\u2014)\\s*MEANS\\s*:\\s*(.+?)\\s*(?:--|\\u2014)\\s*ANSWER\\b/i)||[])[1]);if(mm){const w=mm.split(' ');const rn=w.length<=6?[mm]:w.slice(0,w.length-5).map((_,i)=>w.slice(i,i+6).join(' '));"
+"const hit=links.filter(n=>L.some(p=>p.link===n&&String(p.seg||'').split('\\n').some(x=>{let kx;try{kx=ciKeys(x.split(/--|\\u2014/)[0]);}catch(e){return false;}const t=' '+nz((x.match(/MEANS\\s*:\\s*(.*?)(?:\\s+(?:--|\\u2014)\\s+|\\s*\\|\\s*PROVEN\\b|$)/i)||[])[1])+' ';return [...K].some(k=>kx.has(k))&&rn.some(r=>t.includes(' '+r+' '));})));if(hit.length)links=hit;}} /* pkgVP1B rev 2: a verse under two links is tied by the MEANS the check quotes, read against the entry's MEANS only */";
const E=[[one(A1),l=>rep(l,A1,N1)],[one(A2),l=>rep(l,A2,N2)]];
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
let tot=0;for(const [i,f] of E){const o=L[i];L[i]=f(o);if(L[i]===o)throw new Error('no change at '+i);const d=L[i].length-o.length;tot+=d;for(const [n,v] of uses(i))v.n+=d;console.log('library line',i,(d>=0?'+':'')+d,'used by',uses(i).length,'nodes:',uses(i).map(x=>x[0]).join(', '));}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);
const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
const tc=w=>w.nodes.reduce((s,n)=>s+String((n.parameters||{}).jsCode||'').length,0);
console.log('stubs rebuilt and compiled:',ok);console.log('SIZE (measured): Shared Library',c.length,'->',nc.length,'=',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'code; all code now',tc(W),'; source lines',(tot>=0?'+':'')+tot,'; prompt text 0');
fs.writeFileSync(outF,JSON.stringify(D));console.log('out sha256',crypto.createHash('sha256').update(fs.readFileSync(outF)).digest('hex').slice(0,16));
