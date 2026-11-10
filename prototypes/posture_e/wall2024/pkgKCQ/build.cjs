// W1 offline: pkgKCQ rev 2 (K-C: "that quotation ... does not assert" is a quotation's own limit, not a net-statement ground) and pkgKWQ (K-W: REASSERTED IN read with single quotation marks too).
// Surgical Shared Library edits on a live fetch-back. usage: SET=KCQ|KWQ|BOTH node pkgKCQ/build.cjs <fetch-back> <out>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};const [,,inF,outF]=process.argv;const SET=process.env.SET||'BOTH';
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const KC_OLD=String.raw`/\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert)s?\b/i,`;const KC_NEW=String.raw`/\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert(?:(?<!\b(?:that|this|its|the)\s+(?:\[[CD]R\d\]\s+)?quotation\b[^;.]{0,100}assert)|(?!s?\s+(?:the\s+)?added\b)))s?\b/i,`;
const KW_OLD='\\s*["\\u201c][^"\\u201d]{6,}["\\u201d]/i.test(t);for(const [t,w] of [[rp,\'\'],';
const E=[];
if(SET!=='KWQ')E.push([one(KC_OLD),l=>l.replace(KC_OLD,KC_NEW)]); /* rev 2 (W3 4403): only "(that|this|its|the) [round] quotation ... does not assert" is skipped; a stating verb (state, name, deny) with a quotation subject is still raised */
if(SET!=='KCQ')E.push([one(KW_OLD),l=>l.replace(KW_OLD,KW_OLD.replace('["\\u201c][^"\\u201d]{6,}["\\u201d]',"[\"\\u201c'\\u2018][^\"\\u201d]{6,}[\"\\u201d'\\u2019](?![A-Za-z])"))]);
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
for(const [i,f] of E){const o=L[i];L[i]=f(o);if(L[i]===o)throw new Error('no change at '+i);const d=L[i].length-o.length;for(const [n,v] of uses(i))v.n+=d;console.log('line',i,'+'+d,'used by',uses(i).length,'nodes');}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);
const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length<before[n].length)throw new Error('shrank '+n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok);console.log('SIZE (measured): Shared Library',c.length,'->',nc.length,'=',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'code; prompt text: none added');
fs.writeFileSync(outF,JSON.stringify(D));
