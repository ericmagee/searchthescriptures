// pkgEAC (W1; run 35296, W3 Wall 5107, W4 Wall 5108): the early alternate reply gets its call_costs row.
// Panel Tokens lists every paid call node in __CL. pkgEAS (s147) uses a stored early reply seat by seat; when not every
// seat has one, Early Alternate Reply does not run, and the stored reply (read by Get Early Alternate) is paid for but
// has no row. In run 35296 that was grok's early reply for luna (openrouter BYOK, upstream cost 0.611172 USD).
// Change (Panel Tokens only): Get Early Alternate is read after Early Alternate Reply; each row's .reply is costed when
// it has usage. The existing reply-id check stops a double row when Early Alternate Reply also ran. Prompt 0.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Panel Tokens');if(!W.nodes.find(z=>z.name==='Get Early Alternate'))throw new Error('no Get Early Alternate');
const one=(s,o,n,what)=>{if(s.split(o).length!==2)throw new Error('anchor not unique: '+what);return s.replace(o,()=>n);};
let c=N.parameters.jsCode;
c=one(c,"()=>$('Early Alternate Reply')];","()=>$('Early Alternate Reply'),()=>$('Get Early Alternate')];",'__CL');
c=one(c,"a.forEach((x,k)=>{const j=(x&&x.json)||{};if(j.id){","a.forEach((x,k)=>{let j=(x&&x.json)||{};if(n==='Get Early Alternate'){j=(j.reply&&typeof j.reply==='object')?j.reply:{};if(!j.usage)return;} /* pkgEAC: the stored early alternate reply is costed; the id check below stops a second row */if(j.id){",'forEach');
N.parameters.jsCode=c;fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
