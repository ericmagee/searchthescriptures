// W3 second grade of R1b: every stub rebuilt by its own stub code from the candidate library; compared with what live s119 runs
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),B=g('/mnt/project-files/wall2024/parent_s119_R1b.json');
const src=(W,n)=>{const c=n.parameters.jsCode;const i=c.indexOf("const __LT=$('Shared Library')");if(i<0)return {plain:c};
 const lib=W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;const j=c.indexOf('return await new Function(',i);if(j<0)return {err:'no loader tail'};
 try{const S=new Function('$',c.slice(i,j)+'\nreturn __S;')(()=>({params:{jsCode:lib}}));return {S,head:c.slice(0,i),tail:c.slice(j)};}catch(e){return {err:e.message};}};
const by={};A.nodes.forEach(n=>by[n.name]=n);let stubsA=0,stubsB=0,eq=0,bad=[],newly=0,parseBad=[],headDiff=[],dup=[];
const libB=B.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;
for(const n of B.nodes){if(n.type!=='n8n-nodes-base.code'||n.name==='Shared Library')continue;const b=src(B,n),a=src(A,by[n.name]);if(a.S!==undefined)stubsA++;if(b.S===undefined){if(b.err)bad.push(n.name+' '+b.err);continue;}stubsB++;
 const live=a.S!==undefined?a.S:a.plain;if(a.S===undefined)newly++;
 if(b.S===live)eq++;else bad.push(n.name+' rebuilt '+b.S.length+' live '+live.length);
 try{new Function('$','$input','return (async()=>{\n'+b.S+'\n})();');new Function('$','$input','return (async()=>{\n'+n.parameters.jsCode+'\n})();');}catch(e){parseBad.push(n.name+' '+e.message);}
 // the if(false) read list must name every literal $('...') in the source, and the head of an existing stub must be unchanged
 const reads=new Set([...b.S.matchAll(/\$\(\s*(['"])([^'"]+)\1\s*\)/g)].map(m=>m[2]));const named=new Set([...b.head.matchAll(/\$\(\s*(['"])([^'"]+)\1\s*\)/g)].map(m=>m[2]));
 const missR=[...reads].filter(r=>!named.has(r)&&r!=='Shared Library');if(missR.length)headDiff.push(n.name+' reads not named in the stub head: '+missR.join(', '));
 const nonlit=(b.S.match(/\$\(\s*[^'"\s)]/g)||[]).length;if(nonlit)dup.push(n.name+' non-literal $() calls in source: '+nonlit+(a.S===undefined?' (also in live plain code: '+((a.plain.match(/\$\(\s*[^'"\s)]/g)||[]).length)+')':''));}
console.log('stubs live',stubsA,'| stubs candidate',stubsB,'| newly packed',newly,'| rebuilt equal to live',eq,'| not equal or error',bad.length);bad.forEach(x=>console.log('  FAIL',x));
console.log('parse failures',parseBad.length);parseBad.forEach(x=>console.log('  ',x));
console.log('read-list gaps',headDiff.length);headDiff.forEach(x=>console.log('  ',x));
console.log('non-literal $() in sources',dup.length);dup.forEach(x=>console.log('  ',x));
console.log('library header:',libB.split('\n').slice(0,4).map(l=>l.slice(0,140)).join(' / '));
const L=JSON.parse(libB.slice(libB.indexOf('\n/*LIB*/')+8,libB.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(libB.slice(libB.lastIndexOf('\n/*MAP*/')+8,libB.lastIndexOf('\n/*END*/')));console.log('library lines',L.length,'map entries',Object.keys(M).length);
