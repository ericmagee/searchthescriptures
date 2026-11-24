const fs=require('fs');
const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));if(j.data)j=j.data;if(j.target)j=j.target;return j;};
const K=['type','typeVersion','parameters','credentials','onError','retryOnFail','disabled','position'];
const sortc=c=>JSON.stringify(Object.keys(c).sort().map(k=>[k,c[k]]));
function cmp(a,b){const A=load(a),B=load(b);const ma=new Map(A.nodes.map(n=>[n.name,n])),mb=new Map(B.nodes.map(n=>[n.name,n]));const d=[];
 for(const [k,n] of ma){const m=mb.get(k);if(!m){d.push('missing '+k);continue;}for(const f of K)if(JSON.stringify(n[f]??null)!==JSON.stringify(m[f]??null))d.push(k+'.'+f);}
 for(const k of mb.keys())if(!ma.has(k))d.push('extra '+k);
 if(sortc(A.connections)!==sortc(B.connections))d.push('CONNECTIONS');
 return `${A.nodes.length}/${B.nodes.length} diffs ${d.length}${d.length?': '+d.slice(0,12).join(', '):''}`;}
const pairs=process.argv.slice(2);for(let i=0;i<pairs.length;i+=3)console.log(pairs[i].padEnd(34),cmp(pairs[i+1],pairs[i+2]));
