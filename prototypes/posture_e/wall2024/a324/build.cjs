const fs=require('fs'),cr=require('crypto');
const d=JSON.parse(fs.readFileSync('../a323b/target_323.json'));const ns=d.nodes||d;
const H=String.raw`function __gLab(t){const S=new Set();for(const m of String(t||'').matchAll(/^[ \t]*(?:\*\*)?G0*(\d{1,5})(?:\*\*)?[ \t]*\[(?:CR|DR)/gm))S.add('G'+m[1]);return S;}function __gCit(s,i){return /(?:[*_][^*_\n]{1,60}[*_]|[Ͱ-Ͽἀ-῿֐-׿])\s?\($/.test(String(s).slice(Math.max(0,i-80),i));}function __gSkip(s,w,GL){if(!GL||!GL.has(w))return false;const mm=String(w).match(/^G(\d+)$/);if(!mm)return false;let any=false;for(const x of String(s).matchAll(new RegExp('\\bG0*'+mm[1]+'\\b','g'))){any=true;if(__gCit(s,x.index))return false;}return any;}function __gTw(s,GL){return tagWords(s).filter(w=>!(w.kind==='strongs'&&__gSkip(s,w.w,GL)));}function __gLast(pre,GL){let r=[];for(const x of String(pre).matchAll(/\b([GH])0*(\d{1,5})\b/g)){if(GL&&GL.has(x[1]+x[2])&&!__gCit(pre,x.index))continue;r=x;}return r;}/* pkgGLB ASK 324 */ `;
const R=[["let wds=tagWords(seg);if(!wds.length){","const __GL=__gLab(t);let wds=__gTw(seg,__GL);if(!wds.length){"],["const w2=tagWords(seg2);","const w2=__gTw(seg2,__GL);"]];
const RC=["const num=(pre.match(/\\b([GH])0*(\\d{1,5})\\b(?![\\s\\S]*\\b[GH]\\d)/)||[]);","const num=__gLast(pre,__gLab(t));"];
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k+' for '+a.slice(0,40));return s.replace(a,()=>b);};
const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const rep=[];
// Shared Library
const sl=ns.find(n=>n.name==='Shared Library');let c=sl.parameters.jsCode;const before=c.length,bs=sha(c);
const iL=c.indexOf('\n/*LIB*/'),iM=c.lastIndexOf('\n/*MAP*/'),iE=c.lastIndexOf('\n/*END*/');const hdr=c.slice(0,iL);const L=JSON.parse(c.slice(iL+8,iM));const M=JSON.parse(c.slice(iM+8,iE));
const ti=L.findIndex(x=>/^\s*function tags\(/.test(x));const ci=L.findIndex(x=>/^\s*function countClaims\(/.test(x));
if(ti!==158||ci!==198)throw new Error('lines '+ti+' '+ci);
L[158]=L[158].replace('function tags(',H+'function tags(');
L[161]=once(once(L[161],R[0][0],R[0][1],'L161a'),R[1][0],R[1][1],'L161b');
const nl=L.findIndex((x,i)=>i>ci&&x.includes('const num=(pre.match'));if(nl!==201)throw new Error('num line '+nl);
L[201]=once(L[201],RC[0],RC[1],'L201');
const rb=m=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
const ch=[];for(const k of Object.keys(M)){const n2=rb(M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
// header sha
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==L.length)throw new Error('line count');return 'library sha '+lsha+', '+n+' lines';});
if(h2===hdr)throw new Error('header');
const body='\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(iE);
c=h2+body;sl.parameters.jsCode=c;rep.push(['Shared Library',before,c.length,bs,sha(c),'MAP changed: '+ch.length]);
// inline nodes
for(const n of ns){const s=n.parameters&&n.parameters.jsCode;if(!s||n.name==='Shared Library'||!s.includes('function tagWords('))continue;
 let x=s;x=once(x,'function tags(',H+'function tags(',n.name+' tags');x=once(x,R[0][0],R[0][1],n.name);x=once(x,R[1][0],R[1][1],n.name);
 if(x.includes('function countClaims('))x=once(x,RC[0],RC[1],n.name+' cc');
 n.parameters.jsCode=x;rep.push([n.name,s.length,x.length,sha(s),sha(x),x.includes('__gLast(pre')?'tags+cc':'tags']);}
fs.writeFileSync('target_324.json',JSON.stringify(d));
for(const r of rep)console.log(r.join('\t'));console.log('nodes',rep.length);
