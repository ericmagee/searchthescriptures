// pkgCRF (W2): cure calls stop sending response_format json_schema "cure_lines", so their prefix matches the judge's earlier call and the cache can be read.
// One library line edited in place (L[3335]); the six stubs that rebuild it get their length n lowered; library sha comment updated. Prompt text unchanged (ANSWER FORMAT note kept).
// Option BLANK=1 also empties the now-unused xkRF line (L[3338]).
const fs=require('fs'),crypto=require('crypto');const W='/mnt/project-files/wall2024/';const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const raw=JSON.parse(fs.readFileSync(W+(process.env.BASE||'fetchback_live_s133.json'),'utf8'));let d=raw.data||raw;d=d.workflow||d;
const node=d.nodes.find(n=>n.name==='Shared Library');const lib=node.parameters.jsCode;
const a=lib.indexOf('\n/*LIB*/'),i=lib.lastIndexOf('\n/*MAP*/'),e=lib.lastIndexOf('\n/*END*/');
const L=JSON.parse(lib.slice(a+8,i)),M=JSON.parse(lib.slice(i+8,e));
const OLD='b.response_format=xkRF();';const k=L.findIndex(l=>l.includes(OLD));if(k<0||L.filter(l=>l.includes(OLD)).length!==1)throw new Error('anchor');
const edits=[[k,L[k].split(OLD).join('')]];
if(process.env.BLANK){const f=L.findIndex(l=>l.startsWith('function xkRF(){'));if(L.some((l,j)=>j!==f&&/xkRF\(/.test(edits[0][0]===j?edits[0][1]:l)))throw new Error('xkRF still used');edits.push([f,'']);}
const uses=j=>Object.keys(M).filter(n=>M[n].p.some(p=>p===j||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=j&&j<=p[1])));
const touched={};for(const [j,nl] of edits){const dl=nl.length-L[j].length;for(const n of uses(j)){M[n].n+=dl;touched[n]=(touched[n]||0)+dl;}L[j]=nl;}
const LJ=JSON.stringify(L);let head=lib.slice(0,a);head=head.replace(/library sha [0-9a-f]{16}, (\d+) lines/,(m,c)=>'library sha '+sha(LJ)+', '+c+' lines');
node.parameters.jsCode=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+lib.slice(e);
const out=process.env.OUT||'parent_s133_CRF.json';fs.writeFileSync(W+out,JSON.stringify(raw));
console.log('edited lines',edits.map(x=>x[0]).join(','),'| stubs touched',JSON.stringify(touched),'| library',lib.length,'->',node.parameters.jsCode.length,'(',node.parameters.jsCode.length-lib.length,')','| wrote',out,sha(fs.readFileSync(W+out)));
