// pkgKBG rev 4 (W3; W2 FAIL Wall 3883 on rev 3, one narrow fix: a clause that only says the side keeps its position is not a clause of its own; W1 FAIL 3867 on rev 2). Base: a fetch-back with pkgKVQ live (s95 or later). Changes the same three nodes. Replaces revs 1 to 3.
// Gap, fix, and rev 2's formatting strip: see README. Rev 3 narrows rev 2's exception. A grant sentence is left uncut only when it carries a further clause OF ITS OWN (kbg4_own.cjs):
//  - text in parentheses and in quotation marks is set aside first (a ";" inside a verse list no longer counts);
//  - the sentence is split at ", and", ";" and "and I"; a later part does NOT count when it only continues the grant: it opens with "that", or with "I (also) grant/concede/accept/allow/affirm",
//    or is a verse reference alone, or has no subject of its own ("and of Mary", "and not rested on");
//  - after a colon ("I grant both: ..., and ...") the parts are the content of the grant; only a part opening with I or my counts;
//  - rev 4: a part of eight words or fewer whose verb is keep, hold, maintain, stand, support, follow, remain or retain, with no number, no quotation and no negation or reason word, only says the side keeps its position and does not count;
//  - otherwise a part counts when it opens with a subject (I, my, the, this, it, he, she, they, we, nothing, both, each, all, a capitalised name) and has three words or more; "no"/"neither" need five.
//   node pkgKBG/build_KBG4.cjs <fetch-back with pkgKVQ> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const FB=process.argv[2],OUT=process.argv[3];if(!FB||!OUT)die('usage: build_KBG4.cjs <base with pkgKVQ> <out>');
const A0=String.raw`/* pkgKVQ: the side's verse quotations of 6 words or more are cut out of each round */`;
const OC=fs.readFileSync(__dirname+'/kbg4_own.cjs','utf8').split('\n').filter(l=>!l.startsWith('//')).join(' ').replace(/^module\.exports=/,'').replace(/;\s*$/,'');if(/`|\$\{/.test(OC))die('kbg4_own.cjs holds a backtick or ${');
const A1=A0+'const __oc='+OC+'; /* pkgKBG rev 4 (W1 3867, W2 3883): a further clause of its own; a part that only continues the grant, a verse list in parentheses, the content after a colon, and a part that only says the side keeps its position do not count */'+String.raw`const __bq=s=>String(s).split(/(?<=[.!?]["”’)\]*_]*)\s+|\n+/).map(x=>{const y=__lm(x);return y&&((__gr(y)&&!__oc(y))||__df(y))?' . zqbz . ':x;}).join(' ');const __cutB=k=>{const t=R&&typeof R[k]==='string'?' '+N(__bq(__vq(R[k])))+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;}; /* pkgKBG rev 2: with a bare flagged answer, the side's other bare grant and deferral sentences are cut out of each round; opening formatting is taken off first (W1 3857); a grant that carries a further clause of its own (__oc) is left */`;
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
