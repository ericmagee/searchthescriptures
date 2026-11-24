// ASK 611 (W4): static scan of which engine/child nodes read the debaters' rounds (directly or through a node that carries them).
const E=require('/mnt/project-files/ask601/w4/b1/base_eng.json'),C=require('/mnt/project-files/ask601/w4/b1/base_child.json');
const ROUNDSRC=/^(?:[CD][1-4]B? Extract|[CD][1-4][A-Z]? Extract|Final Output|Regrade Load|Regrade Row|Check Save)$/;
function scan(W,tag){const code=n=>(n.parameters&&n.parameters.jsCode)||'';const refs=n=>[...new Set((code(n).match(/\$\('([^']+)'\)/g)||[]).map(x=>x.slice(3,-2)))];
 const carriers=new Set(W.nodes.filter(n=>ROUNDSRC.test(n.name)).map(n=>n.name));
 // propagate: a code node that reads a carrier and returns body/raw/f/transcript fields is a carrier
 let grew=true;while(grew){grew=false;for(const n of W.nodes){if(carriers.has(n.name))continue;const c=code(n);if(!c)continue;const r=refs(n).filter(x=>carriers.has(x)&&x!=='Shared Library');if(r.length&&/\bbody\b|raw|transcript|messages|cr1|dr3|F\[/.test(c)){carriers.add(n.name);grew=true;}}}
 const rows=W.nodes.filter(n=>carriers.has(n.name)||(n.type.endsWith('httpRequest')&&/\$json|\.body/.test(JSON.stringify(n.parameters.jsonBody||''))&&[...carriers].some(c=>JSON.stringify(n.parameters).includes(c)))).map(n=>({wf:tag,name:n.name,type:n.type.split('.').pop(),reads:refs(n).filter(x=>carriers.has(x))}));
 return rows;}
const out=scan(E,'engine').concat(scan(C,'child'));require('fs').writeFileSync(__dirname+'/scan611.json',JSON.stringify(out,null,1));
console.log(out.length);out.forEach(r=>console.log(r.wf,'|',r.name,'|',r.reads.slice(0,6).join(', ')));
