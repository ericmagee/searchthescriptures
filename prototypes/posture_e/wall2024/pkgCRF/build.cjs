// pkgCRF (W2): cure calls stop sending response_format json_schema "cure_lines", so their prefix matches the judge's earlier call and the cache can be read.
// Library lines edited in place; every stub that rebuilds an edited line gets its length n adjusted; library sha comment updated. Prompt text unchanged (ANSWER FORMAT note kept).
// Option BLANK=1 also empties the now-unused xkRF line (L[3338]).
const fs=require('fs'),crypto=require('crypto');const W='/mnt/project-files/wall2024/';const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const raw=JSON.parse(fs.readFileSync(W+(process.env.BASE||'fetchback_live_s133.json'),'utf8'));let d=raw.data||raw;d=d.workflow||d;
const node=d.nodes.find(n=>n.name==='Shared Library');const lib=node.parameters.jsCode;
const a=lib.indexOf('\n/*LIB*/'),i=lib.lastIndexOf('\n/*MAP*/'),e=lib.lastIndexOf('\n/*END*/');
const L=JSON.parse(lib.slice(a+8,i)),M=JSON.parse(lib.slice(i+8,e));
// edit 1: the cure request no longer carries the schema. edit 2 (rev 2): the follow-up ask keeps the ANSWER FORMAT note, now chosen by whether the cure ask itself ends with that note
// (cureBody appends it exactly when it used to add the schema), instead of by the schema's presence. xkJsonNote is defined in every Normalize node; xkJsonModels is not (rev 2 draft used it and the follow-up was silently lost: caught by verify2).
const ED=[["b.response_format=xkRF();",""],["((src.body.response_format&&src.body.response_format.type==='json_schema')?xkJsonNote():'')","(String((src.body.messages.slice(-1)[0]||{}).content||'').endsWith(xkJsonNote())?xkJsonNote():'')"]];
const edits=ED.map(([o,n])=>{const ks=L.map((l,j)=>l.includes(o)?j:-1).filter(j=>j>=0);if(ks.length!==1||L[ks[0]].split(o).length!==2)throw new Error('anchor '+o);return [ks[0],L[ks[0]].split(o).join(n)];});
if(process.env.BLANK){const f=L.findIndex(l=>l.startsWith('function xkRF(){'));if(L.some((l,j)=>{const e=edits.find(x=>x[0]===j);return j!==f&&/xkRF\(/.test(e?e[1]:l);}))throw new Error('xkRF still used');edits.push([f,'']);}
const uses=j=>Object.keys(M).filter(n=>M[n].p.some(p=>p===j||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=j&&j<=p[1])));
const touched={};for(const [j,nl] of edits){const dl=nl.length-L[j].length;for(const n of uses(j)){M[n].n+=dl;touched[n]=(touched[n]||0)+dl;}L[j]=nl;}
const LJ=JSON.stringify(L);let head=lib.slice(0,a);head=head.replace(/library sha [0-9a-f]{16}, (\d+) lines/,(m,c)=>'library sha '+sha(LJ)+', '+c+' lines');
node.parameters.jsCode=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+lib.slice(e);
const out=process.env.OUT||'parent_s133_CRF.json';fs.writeFileSync(W+out,JSON.stringify(raw));
console.log('edited lines',edits.map(x=>x[0]).join(','),'| stubs touched',JSON.stringify(touched),'| library',lib.length,'->',node.parameters.jsCode.length,'(',node.parameters.jsCode.length-lib.length,')','| wrote',out,sha(fs.readFileSync(W+out)));
