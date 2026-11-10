// pkgKBG rev 2 (W3; W1 FAIL Wall 3857, one fix; W2 PASS 3856). Base: live s94 plus pkgKVQ (base_s94_KVQ.json). STACKS ON pkgKVQ (same three nodes). Replaces rev 1.
// Gap: enf428Cure (E-ANS send-back cure reader, record-only, ruling 428). With a bare flagged answer, a KEEP that quotes six words of ANOTHER bare grant of the same side reads CURED.
// Fix (only when the flagged answer is bare): each round is also searched with its bare sentences cut out; a window found only in such a sentence, or running into one, does not count.
// Rev 2:
//  (1) W1 3857: opening formatting is taken off a sentence before the bare test (__lm): bullet, numbering, ">", a bold label, a [..] tag, a verse label ("Job 14:1.", "On Job 14:1."), stray * _ ` #.
//      The same strip is applied to the sentences of the flagged answer in pkgKQG's bare test (the same miss stood there: a flagged answer quoted with its label was not read as bare).
//  (2) W1's question: a grant joined to a further clause of its own (", and ...", "; ...", "and I ...") is NOT cut from the rounds. "I accept it as a phrase said of all men, and I make
//      no claim from Galatians 4:4 alone." (33798 CR2) says more than the grant, so a KEEP quoting it stays CURED, now by rule and not by the accident of its heading.
//      This exception applies to the round cut only; pkgKQG's test of the flagged answer is unchanged apart from (1).
//   node pkgKBG/build_KBG2.cjs <base with pkgKVQ> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const FB=process.argv[2],OUT=process.argv[3];if(!FB||!OUT)die('usage: build_KBG2.cjs <base with pkgKVQ> <out>');
const A0=String.raw`/* pkgKVQ: the side's verse quotations of 6 words or more are cut out of each round */`;
const A1=A0+String.raw`const __bq=s=>String(s).split(/(?<=[.!?]["”’)\]*_]*)\s+|\n+/).map(x=>{const y=__lm(x);return y&&((__gr(y)&&!/,\s*and\b|;\s|\band\s+I\b/i.test(y))||__df(y))?' . zqbz . ':x;}).join(' ');const __cutB=k=>{const t=R&&typeof R[k]==='string'?' '+N(__bq(__vq(R[k])))+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;}; /* pkgKBG rev 2: with a bare flagged answer, the side's other bare grant and deferral sentences are cut out of each round; opening formatting is taken off first (W1 3857); a grant joined to a further clause (", and", ";", "and I") is left */`;
const E0=String.raw`const __bare=__S.length>0&&__S.every(x=>__gr(x)||__df(x));`;
const E1=String.raw`const __lm=x=>{let y=String(x),p;do{p=y;y=y.replace(/^\s+/,'').replace(/^(?:[-•–—>]|\d{1,2}[.)])\s+/,'').replace(/^\*\*[^*\n]{1,80}\*\*[:.]?\s+(?=\S)/,'').replace(/^\[[^\]\n]{1,24}\]\s*/,'').replace(/^(?:On\s+)?(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–,]\s*\d+)*[.:]?[*_]*\s+(?=\S)/,'').replace(/^[*_\x60#]+\s*/,'');}while(y!==p);return y.trim();}; /* pkgKBG rev 2 (W1 3857): opening formatting (bullet, numbering, >, bold label, [..] tag, verse label) is not part of the sentence */const __bare=__S.length>0&&__S.every(x=>__gr(__lm(x))||__df(__lm(x)));`;
const B0=String.raw`if(!SR.some(k=>__cutV(k).includes(' '+r+' '))){__qv=__qv||r;continue;}q=r;break;}}`;
const B1=String.raw`if(!SR.some(k=>__cutV(k).includes(' '+r+' '))){__qv=__qv||r;continue;}if(__fa&&!SR.some(k=>__cutB(k).includes(' '+r+' '))){__qb=__qb||r;continue;}q=r;break;}} /* pkgKBG: a window found only in another bare grant or deferral of the side, or running into one, is not a fuller answer */`;
const C0=String.raw`let q=null,__qf=null,__qv=null;`;const C1=String.raw`let q=null,__qf=null,__qv=null,__qb=null;`;
const D0=String.raw`not the side\'s own answer (pkgKVQ)':`;
const D1=D0+String.raw`__qb?'KEEP whose reason quotes only another bare grant or deferral of the answering side ("'+__qb+'"), not a fuller answer (pkgKBG)':`;
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes, expected 418');
const NODES=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];const changed=[];
for(const nm of NODES){const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(!s.includes('pkgKVQ'))die(nm+' lacks pkgKVQ');if(s.includes('pkgKBG'))die(nm+' already has pkgKBG');
 for(const [a,b,w] of [[E0,E1,'bare'],[A0,A1,'cut'],[B0,B1,'loop'],[C0,C1,'vars'],[D0,D1,'reason']]){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+w);s=s.split(a).join(b);}
 n.parameters.jsCode=s;new Function('$','$input','return (async()=>{\n'+s+'\n})();');changed.push(nm);}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(require('path').basename(OUT)+': '+d.nodes.length+' nodes; changed '+changed.join(', '));
