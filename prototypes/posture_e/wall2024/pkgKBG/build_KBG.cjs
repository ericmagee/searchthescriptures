// pkgKBG (W3; coordinator 00:15Z 11-10, from W3's open note on Wall 3831/3850). Base: live s94 plus pkgKVQ (pkgKVQ graded file rebuilt on s94). STACKS ON pkgKVQ (same three nodes).
// Gap: enf428Cure (E-ANS send-back cure reader, record-only, ruling 428). When the flagged answer is a bare grant or deferral, a KEEP is read CURED on six words in a row
// of the answering side's rounds outside that answer. Six words of ANOTHER bare grant of the same side pass (33798, Job 14:1 item, flagged "I grant it is said of all men.":
// a KEEP quoting "I grant it is said of Joseph.", the side's Luke 2:4 grant, reads CURED). A second bare grant is not a fuller answer.
// Fix (only when the flagged answer is bare): each round is also searched with its bare sentences cut out. A sentence is bare by pkgKQG's own test (a grant with no
// so/because/for/but... after it, or a deferral of 15 words or fewer). A window found only in such a sentence, or running into one, does not count.
// Changes the E-ANS KEEP line of enf428Cure in Send Back Record, Alt Send Back Record, R2 Alt Send Back Record. No node added, no connection changed.
//   node pkgKBG/build_KBG.cjs <base with pkgKVQ> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const FB=process.argv[2],OUT=process.argv[3];if(!FB||!OUT)die('usage: build_KBG.cjs <base with pkgKVQ> <out>');
const A0=String.raw`/* pkgKVQ: the side's verse quotations of 6 words or more are cut out of each round */`;
const A1=A0+String.raw`const __bq=s=>String(s).split(/(?<=[.!?]["”’)\]]*)\s+|\n+/).map(x=>{const y=x.trim();return y&&(__gr(y)||__df(y))?' . zqbz . ':x;}).join(' ');const __cutB=k=>{const t=R&&typeof R[k]==='string'?' '+N(__bq(__vq(R[k])))+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;}; /* pkgKBG: with a bare flagged answer, the side's other bare grant and deferral sentences are cut out of each round */`;
const B0=String.raw`if(!SR.some(k=>__cutV(k).includes(' '+r+' '))){__qv=__qv||r;continue;}q=r;break;}}`;
const B1=String.raw`if(!SR.some(k=>__cutV(k).includes(' '+r+' '))){__qv=__qv||r;continue;}if(__fa&&!SR.some(k=>__cutB(k).includes(' '+r+' '))){__qb=__qb||r;continue;}q=r;break;}} /* pkgKBG: a window found only in another bare grant or deferral of the side, or running into one, is not a fuller answer */`;
const C0=String.raw`let q=null,__qf=null,__qv=null;`;const C1=String.raw`let q=null,__qf=null,__qv=null,__qb=null;`;
const D0=String.raw`not the side\'s own answer (pkgKVQ)':`;
const D1=D0+String.raw`__qb?'KEEP whose reason quotes only another bare grant or deferral of the answering side ("'+__qb+'"), not a fuller answer (pkgKBG)':`;
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes, expected 418');
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];const changed=[];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(!s.includes('pkgKVQ'))die(nm+' lacks pkgKVQ');if(s.includes('pkgKBG'))die(nm+' already has pkgKBG');
 for(const [a,b,w] of [[A0,A1,'cut'],[B0,B1,'loop'],[C0,C1,'vars'],[D0,D1,'reason']]){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+w);s=s.split(a).join(b);}
 n.parameters.jsCode=s;new Function('$','$input','return (async()=>{\n'+s+'\n})();');changed.push(nm);}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(require('path').basename(OUT)+': '+d.nodes.length+' nodes; changed '+changed.join(', '));
