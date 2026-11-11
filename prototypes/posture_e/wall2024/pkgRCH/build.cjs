const fs=require('fs');const src='/mnt/project-files/wall2024/fetchback_live_s130.json';
let D=JSON.parse(fs.readFileSync(src));const W=(D.data||D).workflow||(D.data||D);
const n=W.nodes.find(x=>x.name==='Close Enforcer Build');const c=n.parameters.jsCode;
const OLD=String.raw`st(l).match(/^LINK\s+(\d+)\s*:\s*(NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b.*$/i)`;
const NEW=String.raw`st(l).match(/^LINK\s+(\d+)\s*(?:\[[^\]\n]*\]|\([^)\n]*\))?\s*:\s*(NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b.*$/i)`;
const k=c.split(OLD).length-1;if(k!==1)throw new Error('anchor count '+k);
n.parameters.jsCode=c.replace(OLD,()=>NEW);
fs.writeFileSync('/mnt/project-files/wall2024/parent_s130_RCH.json',JSON.stringify(D));
console.log('code change',n.parameters.jsCode.length-c.length,'node len',c.length,'->',n.parameters.jsCode.length);
