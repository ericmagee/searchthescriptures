// pkgSDS (W2, 2026-11-11): the cure reader accepts " -- " (or a spaced em or en dash) in place of " | " after the item label
// of a STATEMENT or RESPONSE line, when the line has no "|" and the label starts with a K-rule. Run 35379: sol wrote all 54 item
// lines that way and all 27 items fell to "no written response; malformed line". Builds on live s149. Touches cureLines only.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SRC='/mnt/project-files/wall2024/fetchback_live_s149.json',OUT='/mnt/project-files/wall2024/parent_s149_SDS.json';
const X=JSON.parse(fs.readFileSync(SRC,'utf8'));const W=X.data&&X.data.nodes?X.data:X;const node=W.nodes.find(n=>n.name==='Shared Library');const c=node.parameters.jsCode;
const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));
const i=L.findIndex(l=>/^function cureLines\(text\)/.test(l))+3;
const OLD="const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;";
if(!L[i].includes(OLD)||L[i].split(OLD).length!==2)throw new Error('line '+(i+1)+' is not the expected cureLines loop line');
const NEW="let l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;if(!l.includes('|')){const __sd=l.match(/^((?:STATEMENT|RESPONSE)[ \\t]*:[ \\t]*K-[A-Z]+\\d*\\b[^|]*?)\\s+(?:--|\\u2014|\\u2013)\\s+/);if(__sd)l=__sd[1]+' | '+l.slice(__sd[0].length);} /* pkgSDS: a K-rule STATEMENT/RESPONSE label closed by a spaced dash instead of \"|\" is read as if closed by \"|\" (run 35379, sol) */";
L[i]=L[i].replace(OLD,()=>NEW);const delta=NEW.length-OLD.length;
const uses=Object.keys(M).filter(k=>M[k].p.some(e=>typeof e==='number'?e===i:(Array.isArray(e)&&typeof e[0]==='number'&&e[0]<=i&&i<=e[1])));
for(const k of uses)M[k].n+=delta;const LJ=JSON.stringify(L);
let head=c.slice(0,a-8).replace(/library sha [0-9a-f]{16}, (\d+) lines/,(_,n)=>'library sha '+sha(LJ)+', '+n+' lines');
node.parameters.jsCode=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+'\n/*END*/\n';
fs.writeFileSync(OUT,JSON.stringify(X));
console.log('line',i+1,'delta',delta,'nodes rebuilt',uses.length,uses.join(', '));console.log('Shared Library jsCode',c.length,'->',node.parameters.jsCode.length,'(+'+(node.parameters.jsCode.length-c.length)+')');
console.log('out sha256',crypto.createHash('sha256').update(fs.readFileSync(OUT)).digest('hex').slice(0,16));
