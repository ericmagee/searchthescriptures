// ASK 596 standing set (W4): shared helpers. Nothing is fetched and nothing is written.
const fs=require('fs');const crypto=require('crypto');
const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const load=f=>JSON.parse(fs.readFileSync(f,'utf8'));
function cut(W){const N=W.nodes.find(n=>n.name==='Shared Library');if(!N)throw new Error('no Shared Library node');const T=N.parameters.jsCode;const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c0=b+8,e=T.lastIndexOf('\n/*END*/');return {L:JSON.parse(T.slice(a,b)),M:JSON.parse(T.slice(c0,e))};}
const CACHE=new WeakMap();const lib=W=>{if(!CACHE.has(W))CACHE.set(W,cut(W));return CACHE.get(W);};
function joined(W,key){const {L,M}=lib(W);const v=M[key];return v.p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');}
// the code a node runs: its MAP list joined when the library builds it, else its own jsCode
function code(W,name){const {M}=lib(W);if(M[name]&&Array.isArray(M[name].p))return joined(W,name);const n=W.nodes.find(x=>x.name===name);if(!n)throw new Marker('node not found: '+name);return (n.parameters&&n.parameters.jsCode)||'';}
// every code source of a workflow: [name, code, kind]
function sources(W){const {M}=lib(W);const out=[];for(const n of W.nodes){if(n.name==='Shared Library')continue;const c=n.parameters&&n.parameters.jsCode;if(!c)continue;out.push([n.name,M[n.name]&&Array.isArray(M[n.name].p)?joined(W,n.name):c,M[n.name]?'library-built':'node']);}return out;}
class Marker extends Error{constructor(m){super(m);this.marker=true;}}
// the one library line that holds the marker; a missing or doubled marker is a FAIL "marker not found"
function line(W,marker){const {L}=lib(W);const hits=[];L.forEach((l,i)=>{if(l.includes(marker))hits.push(i);});if(hits.length!==1)throw new Marker('marker not found'+(hits.length?' once ('+hits.length+' lines)':'')+': '+JSON.stringify(marker));return hits[0];}
module.exports={md5,load,cut:lib,joined,code,sources,line,Marker};
