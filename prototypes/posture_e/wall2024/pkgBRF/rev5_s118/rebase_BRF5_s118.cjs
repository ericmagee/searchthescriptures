// pkgBRF rev 5 on s118: s118 fetch-back with the 12 C4P nodes of parent_s117_BRF5.json (which equal rev 5 on s116; no C4P node changed s116 -> s118).
const fs=require('fs'),c=require('crypto');const W='/mnt/project-files/wall2024/';const S=JSON.stringify;const raw=f=>JSON.parse(fs.readFileSync(W+f,'utf8'));const wf=d=>{d=d.data||d;return d.workflow||d;};
const L7=wf(raw('fetchback_live_s117.json')),R5=wf(raw('parent_s117_BRF5.json')),Fr=raw('fetchback_live_s118.json'),F=wf(Fr);
const ch=R5.nodes.filter(n=>S(n)!==S(L7.nodes.find(x=>x.name===n.name))).map(n=>n.name);const c78=F.nodes.filter(n=>S(n.parameters)!==S((L7.nodes.find(x=>x.name===n.name)||{}).parameters)).map(n=>n.name);
console.log('s117 -> s118 changed nodes:',c78.join(', '),'| overlap with rev 5:',ch.filter(n=>c78.includes(n)).join(',')||'none');
const out=JSON.parse(S(Fr));const ow=wf(out);for(const n of ch){const i=ow.nodes.findIndex(x=>x.name===n);ow.nodes[i].parameters=JSON.parse(S(R5.nodes.find(x=>x.name===n).parameters));}
let d=0,k=0;for(const n of ow.nodes){const o=F.nodes.find(x=>x.name===n.name);if(S(o)!==S(n)){k++;d+=n.parameters.jsCode.length-o.parameters.jsCode.length;}}const {nodes:_a,...ra}=F,{nodes:_b,...rb}=ow;
console.log('nodes changed',k,'| code',d,'| node count',F.nodes.length,ow.nodes.length,'| rest equal s118',S(ra)===S(rb),'| each node equals rev 5 node',ch.every(n=>S(ow.nodes.find(x=>x.name===n).parameters)===S(R5.nodes.find(x=>x.name===n).parameters)));
fs.writeFileSync(W+'parent_s118_BRF5.json',S(out));console.log('wrote parent_s118_BRF5.json sha',c.createHash('sha256').update(fs.readFileSync(W+'parent_s118_BRF5.json')).digest('hex').slice(0,16),'| s118 fetch-back sha',c.createHash('sha256').update(fs.readFileSync(W+'fetchback_live_s118.json')).digest('hex').slice(0,16));
