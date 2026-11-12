// pkgGDC (W2, 2026-11-11): the pkgGDS dash rewrite of a CHANGE TO reply puts the reason bar after the LAST field of the corrected line
// (GROUND:, MEANS:, ANSWER:, FAILS:, [L1-4], a round tag, or a grade word), not at the last dash before a round tag or quote mark.
// Run 35296: sol's S2, S8, S9, S10 (ANSWER CHECK) and S11 (collision) were cut inside the line. Builds on live s147.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SRC='/mnt/project-files/wall2024/fetchback_live_s147.json',OUT='/mnt/project-files/wall2024/parent_s147_GDC.json';
const X=JSON.parse(fs.readFileSync(SRC,'utf8'));const W=X.data&&X.data.nodes?X.data:X;const node=W.nodes.find(n=>n.name==='Shared Library');const c=node.parameters.jsCode;
const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));
const i=L.findIndex(l=>/^function gdsDash2024/.test(l))+1;const OLD=" const rest=m[3];let at=-1,len=0;for(const x of rest.matchAll(/\\s*(?:--|—|–)\\s*(?=\\[\\s*(?:CR|DR)[1-4]|\\(\\s*(?:CR|DR)[1-4]|(?:CR|DR)[1-4]\\b|[\"“‘'])/gi)){at=x.index;len=x[0].length;}";
if(L[i]!==OLD)throw new Error('line '+(i+1)+' is not the expected pkgGDS line:\n'+L[i]);
const NEW=" const rest=m[3];let at=-1,len=0;const __fm=/^CHANGE/i.test(m[2])?[...rest.matchAll(/\\s(?:--|—|–)\\s*(?=GROUND\\s*:|MEANS\\s*(?:\\[[^\\]\\n]*\\])?\\s*:|ANSWER\\s*(?:\\[[^\\]\\n]*\\])?\\s*:|FAILS\\s*:|\\[L[1-4]\\]|\\[\\s*(?:CR|DR)[1-4]|(?:MEETS|MISSES|FAILS|BROKEN|STANDS|UNDERDETERMINED|WITHDRAWN|FORCED|SPARED|VOID|COUNTED|UNEXHIBITED|CONCEDED|NOT HELD|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN)\\b)/g)].pop():null;const __lf=__fm?__fm.index:-1; /* pkgGDC: in a CHANGE TO, the reason bar never goes before the corrected line's last field (round tag, MEANS, ANSWER, GROUND, FAILS, a layer or a grade word); with no dash after that field the whole rest stays the line */"
 +" for(const x of rest.matchAll(/\\s*(?:--|—|–)\\s*(?=\\[\\s*(?:CR|DR)[1-4]|\\(\\s*(?:CR|DR)[1-4]|(?:CR|DR)[1-4]\\b|[\"“‘'])/gi)){if(x.index<=__lf)continue;at=x.index;len=x[0].length;}";
// keep the library one line per entry: join the two new lines with a space instead of a newline
const NEW1=NEW;const delta=NEW1.length-OLD.length;L[i]=NEW1;
const uses=Object.keys(M).filter(k=>M[k].p.some(e=>typeof e==='number'?e===i:(Array.isArray(e)&&typeof e[0]==='number'&&e[0]<=i&&i<=e[1])));
for(const k of uses)M[k].n+=delta;const LJ=JSON.stringify(L);
let head=c.slice(0,a-8).replace(/library sha [0-9a-f]{16}, (\d+) lines/,(_,n)=>'library sha '+sha(LJ)+', '+n+' lines');
node.parameters.jsCode=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+'\n/*END*/\n';
fs.writeFileSync(OUT,JSON.stringify(X));
console.log('line',i+1,'delta',delta,'nodes rebuilt',uses.length,uses.join(', '));console.log('Shared Library jsCode',c.length,'->',node.parameters.jsCode.length,'(+'+(node.parameters.jsCode.length-c.length)+')');
console.log('out sha256',crypto.createHash('sha256').update(fs.readFileSync(OUT)).digest('hex').slice(0,16));
