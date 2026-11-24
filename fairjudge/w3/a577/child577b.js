// ASK 577 (W3), part 2: what the child's nodes ask of the library, and how the engine calls the child. Read-only.
const fs=require('fs');const E=JSON.parse(fs.readFileSync(process.argv[2])),C=JSON.parse(fs.readFileSync(process.argv[3]));
console.log('child file top-level keys (JSON chars):',Object.keys(C).map(k=>k+' '+JSON.stringify(C[k]===undefined?null:C[k]).length).join(', '));
const lib=C.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,lib.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(lib.slice(lib.lastIndexOf('\n/*MAP*/')+8,lib.lastIndexOf('\n/*END*/')));
const RD=/\$\(\s*['"]Shared Library['"]\s*\)/;const used=new Map();const readers=[];
for(const n of C.nodes){const c=n.parameters&&n.parameters.jsCode;if(!c||n.name==='Shared Library')continue;if(!RD.test(c))continue;const ks=Object.keys(M).filter(k=>c.includes(JSON.stringify(k))||c.includes("'"+k+"'")||new RegExp('\\)\\)\\.'+k.replace(/[^\w$]/g,'\\$&')+'\\b').test(c));readers.push(n.name+' ['+ks.join(' | ')+']');ks.forEach(k=>used.set(k,(used.get(k)||0)+1));}
console.log('child nodes that read the library:',readers.length);readers.forEach(r=>console.log('  '+r));
const lines=new Set();let lit=0;for(const k of used.keys())for(const e of M[k].p){if(typeof e==='number')lines.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)lines.add(i);else lit+=e[0].length;}
const ch=[...lines].reduce((a,i)=>a+JSON.stringify(L[i]).length+1,0);const mapUsed=[...used.keys()].reduce((a,k)=>a+JSON.stringify(M[k]).length+k.length+4,0);
console.log('MAP keys the child holds',Object.keys(M).length,'| keys a child node asks for',used.size,'| keys no child node asks for:',Object.keys(M).filter(k=>!used.has(k)).length);
console.log('library lines those asked keys serve:',lines.size,'of',L.length,'| chars as stored',ch,'| their MAP entries',mapUsed,'| whole library node',lib.length,'| not needed by any child node:',lib.length-ch-mapUsed);
console.log('rebuilt text served per asked key (n):',[...used.keys()].map(k=>k+' '+M[k].n).join('; '));
// engine side: how the child is called
const ex=E.nodes.filter(n=>/executeWorkflow$/.test(n.type));console.log('\nengine Execute Workflow nodes:',ex.length);ex.forEach(n=>console.log('  '+n.name+' | '+JSON.stringify(n.parameters).slice(0,330)));
const cx=C.nodes.filter(n=>/executeWorkflow$/.test(n.type));console.log('child Execute Workflow nodes:',cx.length);cx.forEach(n=>console.log('  '+n.name+' | '+JSON.stringify(n.parameters).slice(0,260)));
const tr=C.nodes.find(n=>/executeWorkflowTrigger$/.test(n.type));console.log('child trigger:',tr.name,JSON.stringify(tr.parameters).slice(0,300));
const eLibReaders=E.nodes.filter(n=>n.parameters&&n.parameters.jsCode&&n.name!=='Shared Library'&&RD.test(n.parameters.jsCode)).length;console.log('engine nodes that read the library:',eLibReaders);
