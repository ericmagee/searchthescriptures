// W2 grade of pkgACO: for every node that names another node in $('...'), does every path from the triggers to the reader pass the named node? old vs new.
const {A,B}=require('./structure.cjs');
const lib=A.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=lib.lastIndexOf('\n/*MAP*/'),e=lib.lastIndexOf('\n/*END*/');const LL=JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,i)),M=JSON.parse(lib.slice(i+8,e));
const src=n=>{const x=A.nodes.find(z=>z.name===n);if(n in M)return M[n].p.map(e=>typeof e==='number'?LL[e]:typeof e[0]==='string'?e[0]:LL.slice(e[0],e[1]+1).join('\n')).join('\n');return JSON.stringify(x.parameters);};
const G=d=>{const g=new Map();d.nodes.forEach(n=>g.set(n.name,[]));for(const [s,o] of Object.entries(d.connections))for(const brs of Object.values(o))(brs||[]).forEach(br=>(br||[]).forEach(t=>g.get(s).push(t.node)));return g;};
const ga=G(A),gb=G(B);const indeg=g=>{const c=new Map([...g.keys()].map(k=>[k,0]));for(const v of g.values())v.forEach(t=>c.set(t,c.get(t)+1));return c;};
const starts=[...indeg(ga)].filter(([k,v])=>v===0&&ga.get(k).length).map(x=>x[0]);console.log('trigger-like starts:',starts.join(', '));
const reach=(g,from,avoid)=>{const s=new Set();const q=[...from].filter(x=>x!==avoid);while(q.length){const n=q.pop();if(s.has(n))continue;s.add(n);for(const t of g.get(n)||[])if(t!==avoid)q.push(t);}return s;};
const ra=reach(ga,starts),rb=reach(gb,starts);console.log('reachable nodes old',ra.size,'new',rb.size,'same set',ra.size===rb.size&&[...ra].every(x=>rb.has(x)));
// guarantee: reader R reached; does every path to R pass X?  (R not reachable when X removed)
const always=(g,R,X)=>!reach(g,starts,X).has(R);const ever=(g,R,X)=>{/* X can run before R on some path: X reachable and R reachable from X */return reach(g,[X]).has(R);};
const rows=[];for(const n of A.nodes){if(!ra.has(n.name))continue;const s=src(n.name);const refs=[...new Set([...s.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]))];
 for(const X of refs){if(X===n.name||!ga.has(X))continue;const oa=always(ga,n.name,X),ob=always(gb,n.name,X),va=ever(ga,n.name,X),vb=ever(gb,n.name,X);if(oa!==ob||va!==vb)rows.push(n.name+' reads '+X+' | before R on every path: '+oa+' -> '+ob+' | on some path: '+va+' -> '+vb);}}
console.log('READ RELATIONS THAT CHANGE ('+rows.length+'):\n  '+rows.join('\n  '));
// who reads Regrade After Quotes? / Anticheat nodes anywhere
for(const X of ['Regrade After Quotes?','Anticheat Only?','Anticheat Needed?','Anticheat Call deepseek','Anticheat Build','Anticheat Record','Check Save'])console.log('readers of',X+':',A.nodes.filter(n=>n.name!==X&&src(n.name).includes("$('"+X+"')")).map(n=>n.name).join(', ')||'none');
// order along the live single-judge path in the new graph: shortest path Close Enforcer Record -> Build Save Body -> Panel Build
const sp=(g,a,b)=>{const prev=new Map([[a,null]]);const q=[a];while(q.length){const n=q.shift();if(n===b)break;for(const t of g.get(n))if(!prev.has(t)){prev.set(t,n);q.push(t);}}if(!prev.has(b))return null;const p=[];for(let x=b;x;x=prev.get(x))p.unshift(x);return p;};
console.log('NEW Close Enforcer Record -> Build Save Body:',(sp(gb,'Close Enforcer Record','Build Save Body')||[]).join(' > '));
console.log('NEW Save -> Panel Build:',(sp(gb,'Build Save Body','Panel Build')||[]).join(' > '));
console.log('OLD Close Enforcer Record -> Build Save Body:',(sp(ga,'Close Enforcer Record','Build Save Body')||[]).join(' > '));
console.log('nodes on error settings, anticheat chain:',['Anticheat Build','Anticheat Needed?','Anticheat Call deepseek','Anticheat Record','Anticheat Only?'].map(n=>{const x=A.nodes.find(z=>z.name===n);return n+' onError='+x.onError+' retry='+x.retryOnFail+' tries='+x.maxTries+' timeout='+((x.parameters.options||{}).timeout);}).join(' | '));
