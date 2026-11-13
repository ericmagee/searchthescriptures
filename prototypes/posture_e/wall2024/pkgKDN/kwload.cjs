// Load kwLines421 and every top-level function it needs from the rebuilt "Panel Payloads" source of a workflow.
const fs=require('fs');const {parseLib,src}=require(__dirname+'/rebuild.cjs');
function block(A,i){for(let j=i;j<Math.min(A.length,i+400);j++){const t=A.slice(i,j+1).join('\n');try{new Function(t);return t;}catch(e){}}throw new Error('unclosed at '+i+': '+A[i].slice(0,60));}
function load(file,node){const raw=JSON.parse(fs.readFileSync(file,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
 const code=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const {L,M}=parseLib(code);const A=src(L,M,node||'Panel Payloads').split('\n');
 const defs=new Map();A.forEach((l,i)=>{const m=l.match(/^(?:function\s+([A-Za-z_$][\w$]*)\s*\(|const\s+([A-Za-z_$][\w$]*)\s*=)/);if(m)defs.set(m[1]||m[2],i);});
 const need=new Set(),order=[];const visit=id=>{if(need.has(id)||!defs.has(id))return;need.add(id);const b=block(A,defs.get(id));if(/\$\(/.test(b)){need.delete(id);return;}for(const m of b.matchAll(/\b([A-Za-z_$][\w$]*)\b/g))if(m[1]!==id&&defs.has(m[1]))visit(m[1]);order.push(b);};
 visit('kwLines421');if(process.env.DBG)order.forEach(b=>{if(/\$\(/.test(b))console.log('USES $:',b.slice(0,160));});return new Function('$',order.join('\n')+'\nreturn kwLines421;')(()=>{throw new Error('no $');});}
module.exports={load};
if(require.main===module){const f=load(process.argv[2]);console.log(typeof f);}
