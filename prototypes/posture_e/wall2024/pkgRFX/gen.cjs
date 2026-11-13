// usage: node gen.cjs <in.json> <out.json>  writes rfx_src.cjs into all 17 round Extract nodes; prints per-node size change.
const fs=require('fs');const {NODES,gen,span}=require('./rfx_lib.cjs');const [,,IN,OUT]=process.argv;const w=JSON.parse(fs.readFileSync(IN,'utf8'));
let seen=0,tot=0,ch=[];for(const n of w.nodes){const k=NODES[n.name];if(!k)continue;seen++;const s=n.parameters.jsCode;const [a,b]=span(s);const t=gen(k[0],k[1]);
 const o=s.slice(0,a)+t+s.slice(b);if(o!==s)ch.push(n.name);tot+=o.length-s.length;n.parameters.jsCode=o;}
if(seen!==17)throw new Error('nodes found '+seen);fs.writeFileSync(OUT,JSON.stringify(w));console.log(JSON.stringify({nodes:seen,changed:ch.length,changed_nodes:ch,code_change:tot}));
