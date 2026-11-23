// pkgBFX build (W1) to plan rev 0 (askbfx/w1/plan_bfx.md 9d732d93, commit 1b51b5df; W2 PASS WITH 2 CONDITIONS, Wall 10890).
// Usage: node patch_bfx.js <live workflow.json> <target out.json> <engine|child>
// Shared Library only: index 466 (displayed line 467) range test uses bfx544Block; new index 3566 holds bfx544Block (lbBlockText with
// heading LINK\s+(?:\d+|none)\b). Condition A: 3566 goes into the p list of every MAP entry covering 466, right after index 767
// (lbBlockText), splitting [765,795] into [765,767],3566,[768,795]. MAP n of those entries re-measured; header sha recomputed.
const fs=require('fs');const crypto=require('crypto');const [,,SRC,OUT,WF]=process.argv;if(!/^(engine|child)$/.test(WF||''))throw new Error('third argument: engine or child');
const W=JSON.parse(fs.readFileSync(SRC,'utf8'));const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c=b+8,e=T.lastIndexOf('\n/*END*/');const L=JSON.parse(T.slice(a,b)),M=JSON.parse(T.slice(c,e));
if(L.length!==3566)throw new Error('library is '+L.length+' lines, not 3566');if(L.some(l=>l.includes('bfx544')))throw new Error('bfx544 already present');
const LB=L[767];if(!LB.startsWith('function lbBlockText(round,j){'))throw new Error('index 767 is not lbBlockText');
const OLDRX='/^[ \\t>*#_-]*LINK\\s+(\\d+)[^\\n]*/gmi';if(LB.split(OLDRX).length!==2)throw new Error('lbBlockText heading regex not found once');
const HELP=LB.replace('function lbBlockText(','function bfx544Block(').replace(OLDRX,'/^[ \\t>*#_-]*LINK\\s+(?:\\d+|none)\\b[^\\n]*/gmi')+' /* pkgBFX (ASK pending): lbBlockText with LINK none headings counted, for the K-UNX range test only */';
const FROM="for(const j of s.ns){if(!lbBlockText(R[rk],j)){let mx=0;for(let q=1;q<j;q++)if(lbBlockText(R[rk],q))mx=q;";
const TO="for(const j of s.ns){if(!bfx544Block(R[rk],j)){let mx=0;for(let q=1;q<j;q++)if(bfx544Block(R[rk],q))mx=q; /* pkgBFX */";
if(L[466].split(FROM).length!==2)throw new Error('index 466 range test anchor not found once');L[466]=L[466].replace(FROM,()=>TO);
L.push(HELP);const NEW=L.length-1;
const cov=(p,i)=>p.some(x=>typeof x==='number'?x===i:typeof x[0]==='number'&&i>=x[0]&&i<=x[1]);
const src=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');const ch=[];
for(const k of Object.keys(M)){if(!cov(M[k].p,466))continue;const p=M[k].p;const at=p.findIndex(x=>Array.isArray(x)&&x[0]===765&&x[1]===795);if(at<0)throw new Error(k+': no [765,795] entry');
 p.splice(at,1,[765,767],NEW,[768,795]);const n=src(p).length;ch.push(k+' '+M[k].n+'->'+n);M[k].n=n;}
if(ch.length!==15)throw new Error('expected 15 MAP entries, got '+ch.length);
const LS=fs.readFileSync('/mnt/project-files/ask519/w4/libcheck/libcheck.js','utf8');const SHA=new Function(LS.slice(0,LS.indexOf('const __LIBSHA422'))+'\nreturn __SHA422;')();
const T2=T.slice(0,a)+JSON.stringify(L)+T.slice(b,c);const sha=SHA(JSON.stringify(L)).slice(0,16);const H0=T2.match(/library sha ([0-9a-f]{16})/);if(!H0)throw new Error('no header sha');
N.parameters.jsCode=T2.replace(/library sha [0-9a-f]{16}/,'library sha '+sha)+JSON.stringify(M)+T.slice(e);
fs.writeFileSync(OUT,JSON.stringify(W));
console.log(WF+': header sha '+H0[1]+' -> '+sha+'; library '+L.length+' lines; MAP entries re-measured ('+ch.length+'): '+ch.join(' | '));
