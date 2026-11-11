// pkgUOW rev 2 (W2): UND.OPEN, the "what the record leaves open" pattern used by undOk (pkgUND send-back cure, E-HOLD cure on UNDERDETERMINED, pkgUNA),
// takes up to 8 words between "leave(s)" and "open|disputed|..."; a word is any run without space . ; : , ! ? ( ) em/en dash, and never the "--" separator.
// Built on live s140 with the pkgLIB form-3 map: the edited library line's length change is added to every node map entry that uses it (pattern of pkgCMX/build.cjs).
// usage: node pkgUOW/build.cjs   (reads /mnt/project-files/wall2024/fetchback_live_s140.json, writes /mnt/project-files/wall2024/parent_s140_UOW2.json)
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const inF='/mnt/project-files/wall2024/fetchback_live_s140.json',outF='/mnt/project-files/wall2024/parent_s140_UOW2.json';
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);if(W.versionId!=='5062d21e-5b22-4ca6-9a4c-2468dc869540')throw new Error('base is not s140');
const W0=JSON.parse(JSON.stringify(W));const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o.slice(0,80));return s.replace(o,()=>n);};
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
const own=s=>Object.entries(M).filter(([n,v])=>v.p.some(p=>Array.isArray(p)&&typeof p[0]==='string'&&p[0].includes(s))).map(x=>x[0]);
const edLib=(o,nw)=>{if(own(o).length)throw new Error('anchor also in a node-own line: '+own(o));const i=one(o);const s=L[i];L[i]=rep(s,o,nw);const d=L[i].length-s.length;for(const [n,v] of uses(i))v.n+=d;console.log('lib line',i,'+'+d,'used by',uses(i).map(x=>x[0]).join(', '));};
edLib(String.raw`const OPEN=/\b(?:leaves?\s+(?:\w+\s+){0,3}(?:open|`,String.raw`const OPEN=/\b(?:leaves?\s+(?:(?!--)[^\s.;:,!?()—–]+\s+){0,8}(?:open|`);
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0,changed=[];for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');if(s!==before[n])changed.push(n);}
console.log('stubs rebuilt and compiled:',ok,'| rebuilt sources that changed:',changed.length,changed.join(', '));
console.log('SIZE (measured): Shared Library',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'(regex line +'+(String.raw`(?:(?!--)[^\s.;:,!?()—–]+\s+){0,8}`.length-String.raw`(?:\w+\s+){0,3}`.length)+', map lengths and sha header the rest) | prompt 0');
const diff=W.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(W0.nodes.find(z=>z.name===n.name))).map(n=>n.name);
console.log('workflow nodes changed',diff,'| node count',W.nodes.length,'| connections equal',JSON.stringify(W.connections)===JSON.stringify(W0.connections));
// the decoded OPEN equals the replay candidate
const lo=L[one('const OPEN=/')];const src=lo.slice(lo.indexOf('const OPEN=/')+12,lo.indexOf('/i;',lo.indexOf('const OPEN=/')));
console.log('OPEN equals replay candidate',src===fs.readFileSync('/mnt/project-files/wall2024/uow_newsrc.txt','utf8'));
fs.writeFileSync(outF,JSON.stringify(D));console.log('sha256',crypto.createHash('sha256').update(fs.readFileSync(outF)).digest('hex').slice(0,16));
