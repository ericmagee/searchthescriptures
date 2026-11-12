// pkgESS (W1; run 35296 F1, W4 first reading; W1 Wall 5087 second reading): stored early alternate replies are used seat by seat.
// Before: the Alternate Build stub used stored replies only when every replaced seat had one (all or nothing), so in 35296 grok's
// matching reply for luna was discarded and grok was called again because sol's alternate (argon) had none.
// 1. Alternate Build stub: each item with a matching stored reply is marked early_all:true with __early_reply; the others are unchanged.
// 2. Early Reply? (unchanged) now routes item by item: early items to Early Alternate Reply, the rest to Alternate Call openrouter.
// 3. New IF "Early All?" after Early Alternate Reply passes on to Alternate Payloads only when every item was early, so
//    Alternate Payloads runs once. Early Alternate Reply still runs, so Panel Tokens (cost) and Alt Send Back Build (grok reasoning) read it.
// 4. Alternate Payloads own line: ALTB carries the stored replies (ALTB.__eb); Library line 2415 (shared with R2 Alternate Payloads)
//    takes the stored reply for an early seat and the call output, in order, for the rest. R2 has no __eb, so R2 is unchanged.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const byN=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('no node '+n);return x;};
const one=(s,o,n,what)=>{if(s.split(o).length!==2)throw new Error('anchor not unique: '+what);return s.replace(o,()=>n);};
// 1. Alternate Build stub
const AB=byN('Alternate Build');
AB.parameters.jsCode=one(AB.parameters.jsCode,"if(!(__EM.length>0&&__EM.every(m=>m.r)))return __R0; /* all or nothing: otherwise the output is exactly today's and the normal call runs */",
 "if(!__EM.some(m=>m.r))return __R0; /* pkgESS: seat by seat; an item with a stored reply takes it, the others are called (before: all or nothing) */",'AB gate');
AB.parameters.jsCode=one(AB.parameters.jsCode,"const m=__EM.find(z=>z.x===x);return m?","const m=__EM.find(z=>z.x===x&&z.r);return m?",'AB map');
// 3. new IF Early All?
const EAR=byN('Early Alternate Reply');const ifT=JSON.parse(JSON.stringify(byN('Early Reply?')));
const EA={...ifT,id:crypto.randomUUID(),name:'Early All?',position:[EAR.position[0]+110,EAR.position[1]]};
EA.parameters.conditions.conditions[0]={id:'early-all-ess',leftValue:"={{ $('Alternate Build').all().filter(x=>x.json.alt&&!x.json.alt.skip).every(x=>x.json.early_all===true) }}",operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''};
W.nodes.push(EA);
const C=W.connections;if(JSON.stringify(C['Early Alternate Reply'].main)!==JSON.stringify([[{node:'Alternate Payloads',type:'main',index:0}]]))throw new Error('Early Alternate Reply wiring differs');
C['Early Alternate Reply'].main=[[{node:'Early All?',type:'main',index:0}]];C['Early All?']={main:[[{node:'Alternate Payloads',type:'main',index:0}],[]]};
// 4. Library
const N=byN('Shared Library');const T=N.parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
Lb[2415]=one(Lb[2415],"const callOut=$input.all().map(x=>x.json);","const callOut=(()=>{const IN=$input.all().map(x=>x.json),EB=ALTB.__eb||[];let c=0;return ALTB.map((a,k)=>EB[k]||IN[c++]);})(); /* pkgESS: a stored reply for an early seat, the call output in order for the rest */",'lib 2415');
let hit=0;M['Alternate Payloads'].p=M['Alternate Payloads'].p.map(e=>{if(Array.isArray(e)&&typeof e[0]==='string'&&e[0].includes("const ALTB=$('Alternate Build').all().map(x=>x.json.alt).filter(a=>a&&!a.skip);")){hit++;return [one(e[0],"const ALTB=$('Alternate Build').all().map(x=>x.json.alt).filter(a=>a&&!a.skip);","const __AB=$('Alternate Build').all().map(x=>x.json).filter(j=>j.alt&&!j.alt.skip);const ALTB=__AB.map(j=>j.alt);ALTB.__eb=__AB.map(j=>j.early_all===true&&j.__early_reply||null); /* pkgESS */",'AP own')];}return e;});
if(hit!==1)throw new Error('Alternate Payloads own line hits '+hit);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
