// W2 grade of pkgDCT: write each Code node's effective source, live s126 and pkgDCT s126, to w2_grades/dct/{live,trim}/; plus the node diff summary.
const fs=require('fs');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const L=g('/mnt/project-files/wall2024/fetchback_live_s126.json'),T=g('/mnt/project-files/wall2024/parent_s126_DCT.json');
const eff=W=>{const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const o={};for(const n of W.nodes){const c=n.parameters&&n.parameters.jsCode;if(typeof c!=='string'||n.name==='Shared Library')continue;let s=c;if(c.startsWith('// pkgLIB stub'))s=rebuild(c,lib);o[n.name]=s;}return o;};
const A=eff(L),B=eff(T);const D='w2_grades/dct/';for(const k of ['live','trim'])fs.mkdirSync(D+k,{recursive:true});
const fn=n=>n.replace(/[^A-Za-z0-9]+/g,'_')+'.js';let ch=0,same=0;
for(const n of Object.keys(A)){fs.writeFileSync(D+'live/'+fn(n),A[n]);fs.writeFileSync(D+'trim/'+fn(n),B[n]);if(A[n]!==B[n])ch++;else same++;}
console.log('nodes',L.nodes.length,T.nodes.length,'| names equal',JSON.stringify(L.nodes.map(n=>n.name))===JSON.stringify(T.nodes.map(n=>n.name)),'| connections equal',JSON.stringify(L.connections)===JSON.stringify(T.connections));
const strip=n=>{const c=JSON.parse(JSON.stringify(n));if(c.parameters)delete c.parameters.jsCode;return JSON.stringify(c);};
console.log('nodes differing outside jsCode:',L.nodes.filter((n,i)=>strip(n)!==strip(T.nodes[i])).map(n=>n.name));
console.log('Code nodes',Object.keys(A).length,'| effective source changed',ch,'| unchanged',same,'| set equal',JSON.stringify(Object.keys(A))===JSON.stringify(Object.keys(B)));
const code=W=>W.nodes.reduce((s,n)=>s+((n.parameters||{}).jsCode||'').length,0);console.log('code',code(L),'->',code(T),'=',code(T)-code(L));
const pr=W=>JSON.stringify(W.nodes.map(n=>{const p={...(n.parameters||{})};delete p.jsCode;return p;}));console.log('non-code parameters equal (prompts etc.):',pr(L)===pr(T));
