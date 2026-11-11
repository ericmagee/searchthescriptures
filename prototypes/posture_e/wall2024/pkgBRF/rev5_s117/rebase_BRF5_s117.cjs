// Rebase pkgBRF rev 5 onto s117 (= s116 + pkgOON3, written by W4 18:40 CST from parent_s116_OON3.json): take every node rev 5 changes against s116 and put it on s117.
const fs=require('fs'),c=require('crypto');const W='/mnt/project-files/wall2024/';const S=JSON.stringify;const raw=f=>JSON.parse(fs.readFileSync(W+f,'utf8'));const wf=d=>{d=d.data||d;return d.workflow||d;};
const L=wf(raw('fetchback_live_s116.json')),R5=wf(raw('parent_s116_BRF5.json')),O=raw('parent_s116_OON3.json'),Ow=wf(O);
const ch=R5.nodes.filter(n=>S(n)!==S(L.nodes.find(x=>x.name===n.name))).map(n=>n.name);const oc=Ow.nodes.filter(n=>S(n)!==S(L.nodes.find(x=>x.name===n.name))).map(n=>n.name);
console.log('rev 5 changes',ch.length,'nodes:',ch.join(', '),'\nOON3 changes:',oc.join(', '),'| overlap',ch.filter(n=>oc.includes(n)).join(',')||'none');
const out=JSON.parse(S(O));const ow=wf(out);for(const n of ch){const i=ow.nodes.findIndex(x=>x.name===n);ow.nodes[i]=JSON.parse(S(R5.nodes.find(x=>x.name===n)));}
const {nodes:_a,...ra}=Ow,{nodes:_b,...rb}=ow;console.log('nodes',Ow.nodes.length,ow.nodes.length,'| rest equal s117',S(ra)===S(rb));
let d=0;for(const n of ow.nodes){const o=Ow.nodes.find(x=>x.name===n.name);if(S(o)!==S(n))d+=n.parameters.jsCode.length-o.parameters.jsCode.length;}console.log('size vs s117: code',d);
let d5=0;for(const n of R5.nodes){const o=L.nodes.find(x=>x.name===n.name);if(S(o)!==S(n))d5+=n.parameters.jsCode.length-o.parameters.jsCode.length;}console.log('size rev 5 vs s116 (rev 4 live):',d5);
fs.writeFileSync(W+'parent_s117_BRF5.json',S(out));console.log('wrote parent_s117_BRF5.json sha',c.createHash('sha256').update(fs.readFileSync(W+'parent_s117_BRF5.json')).digest('hex').slice(0,16));
