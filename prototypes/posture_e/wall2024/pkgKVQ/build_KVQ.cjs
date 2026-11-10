// pkgKVQ (W1; coordinator 23:57Z 11-09, from W3's note on Wall 3820). Base: pkgKQG rev 2 parent (parent_s90_KQG2.json, on live s90). Stacks on pkgKQG rev 2.
// Gap: enf428Cure reads an E-ANS send-back KEEP CURED when its reason quotes 6 words in a row of the answering side's rounds, even when those 6 words
// are only scripture text the side itself quoted (33798: "of few days, and full of trouble", Job 14:1). A quoted verse is not the side's answer.
// Fix: for every E-ANS KEEP, each round is searched with its verse quotations cut out: on a line that names a verse (Book c:v), each span in quotation
// marks ("..." or “...”, paired in order) of 6 words or more is cut (a shorter quote inside the side's own sentence is kept). A window found only inside such a span (or running into it) does not count. A window found in
// the side's own words still counts. pkgKQG rev 2's bare-answer cut stands unchanged.
// Changes the E-ANS KEEP line of enf428Cure in Send Back Record, Alt Send Back Record, R2 Alt Send Back Record. No node added, no connection changed.
//   node pkgKVQ/build_KVQ.cjs [base] [out]
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const FB=process.argv[2]||__dirname+'/../pkgKQG/parent_s90_KQG2.json',OUT=process.argv[3]||__dirname+'/parent_s90_KVQ.json';
const A0=String.raw`const __cut=k=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;};`;
const A1=String.raw`const __vq=s=>String(s).split('\n').map(l=>/\b(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+/.test(l)?l.replace(/"[^"\n]*"|“[^”\n]*”/g,m=>m.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').length>=6?' . zqvz . ':m):l).join('\n');const __cut=k=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;};const __cutV=k=>{const t=R&&typeof R[k]==='string'?' '+N(__vq(R[k]))+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;}; /* pkgKVQ: the side's verse quotations of 6 words or more are cut out of each round */`;
const B0=String.raw`let q=null,__qf=null;for(let i=0;i+6<=__w.length;i++){const r=__w.slice(i,i+6).join(' ');if(SR.some(k=>has(k,r))){if(__fa&&(__fa.includes(' '+r+' ')||!SR.some(k=>__cut(k).includes(' '+r+' ')))){__qf=__qf||r;continue;}q=r;break;}}`;
const B1=String.raw`let q=null,__qf=null,__qv=null;for(let i=0;i+6<=__w.length;i++){const r=__w.slice(i,i+6).join(' ');if(SR.some(k=>has(k,r))){if(__fa&&(__fa.includes(' '+r+' ')||!SR.some(k=>__cut(k).includes(' '+r+' ')))){__qf=__qf||r;continue;}if(!SR.some(k=>__cutV(k).includes(' '+r+' '))){__qv=__qv||r;continue;}q=r;break;}} /* pkgKVQ: a window found only in a verse the side quoted, or running into one, is not the side's answer */`;
const C0=String.raw`__qf?'KEEP whose reason quotes only the bare flagged answer itself, or words running into it ("'+__qf+'"), not a fuller answer from the answering side\'s rounds (pkgKQG)':`;
const C1=C0+String.raw`__qv?'KEEP whose reason quotes only scripture the answering side quoted ("'+__qv+'"), not the side\'s own answer (pkgKVQ)':`;
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes, expected 418');
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];const changed=[];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(!s.includes('pkgKQG rev 2'))die(nm+' lacks pkgKQG rev 2');if(s.includes('pkgKVQ'))die(nm+' already has pkgKVQ');
 for(const [a,b,w] of [[A0,A1,'cut'],[B0,B1,'loop'],[C0,C1,'reason']]){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+w);s=s.split(a).join(b);}
 n.parameters.jsCode=s;new Function('$','$input','return (async()=>{\n'+s+'\n})();');changed.push(nm);}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(require('path').basename(OUT)+': '+d.nodes.length+' nodes; changed '+changed.join(', '));
