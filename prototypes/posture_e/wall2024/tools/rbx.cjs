// rbx.cjs: workflow readback (ASK 420a). Compares a live n8n workflow version with a graded target JSON.
// Usage: NODE_PATH=<tools>/node_modules node rbx.cjs <live.json> <target.json> <label>
// Prints: node count; per-node diffs in parameters, type, typeVersion, credentials, disabled; NEW/GONE nodes;
// connections equal; Shared Library equal; library sha16 and whether the header carries it; MAP entries whose line count n fails.
// MATCH = diffs 0, conn eq true, lib eq true, in hdr true, MAP n fail 0.
const T=require(__dirname+"/lib.cjs");const crypto=require("crypto");
const norm=o=>{if(Array.isArray(o))return o.map(norm);if(o&&typeof o==="object"){const r={};for(const k of Object.keys(o).sort())r[k]=norm(o[k]);return r;}return o;};
const J=x=>JSON.stringify(norm(x));
const [lf,bf,lab]=process.argv.slice(2);const L=require(lf),B=require(bf);const mb=new Map(B.nodes.map(n=>[n.name,n]));let d=[];
for(const n of L.nodes){const e=mb.get(n.name);if(!e){d.push("NEW "+n.name);continue;}for(const k of["parameters","type","typeVersion","credentials","disabled"])if(J(n[k])!==J(e[k]))d.push(n.name+"["+k+"]");}
for(const k of mb.keys())if(!L.nodes.find(n=>n.name===k))d.push("GONE "+k);
const ul=T.unpack(L),ub=T.unpack(B);const sha=crypto.createHash("sha256").update(JSON.stringify(ul.L)).digest("hex").slice(0,16);
let bad=0;for(const k of Object.keys(ul.M)){const m=ul.M[k];if(m&&m.p&&typeof m.n==="number"&&T.rb(ul.L,m).length!==m.n)bad++;}
console.log(lab,L.versionId,"nodes",L.nodes.length,B.nodes.length,"diffs",d.length,d.join("|"),"conn eq",J(L.connections)===J(B.connections),"lib eq",J(ul.L)===J(ub.L),"sha",sha,"in hdr",ul.hdr.includes(sha),"MAP n fail",bad);
