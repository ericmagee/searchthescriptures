// ASK 664 b1 rev 3 (W3 Wall 12413, W1 C2 of Wall 12411): LIB 3858 comment wording only, to match the code (fz reads any E-HOLD send-back answered CHANGE, a STANDS line included). No logic change.
// In: target_664r2.json. Out: target_664r3.json. Recomputes MAP n for entries holding LIB 3858 and the library header.
const fs=require('fs'),cr=require('crypto');
const [IN,OUT]=process.argv.slice(2);const W=JSON.parse(fs.readFileSync(IN,'utf8'));
const node=W.nodes.find(n=>n.name==='Shared Library');const T=node.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');
const L=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const OLD='/* ASK 664 A3 (W3 Amendment F): the pairs a send-back E-HOLD item made the judge regrade (UNDERDETERMINED to BROKEN) */';
const NEW='/* ASK 664 A3 (W3 Amendment F; wider reading kept, W3 Wall 12413): the pairs of every E-HOLD send-back item the judge answered CHANGE, whatever the grade it changed (a STANDS line included, as well as UNDERDETERMINED to BROKEN) */';
if(L[3858].split(OLD).length!==2)throw new Error('old comment not found once');
const before=L.slice();L[3858]=L[3858].replace(OLD,NEW);
const build=(LL,P)=>P.map(e=>typeof e==='number'?LL[e]:typeof e[0]==='string'?e[0]:LL.slice(e[0],e[1]+1).join('\n')).join('\n');
const holds=[];for(const k of Object.keys(M)){const P=M[k].p;const h=P.some(e=>typeof e==='number'?e===3858:typeof e[0]!=='string'&&e[0]<=3858&&3858<=e[1]);if(h){if(build(before,P).length!==M[k].n)throw new Error('pre n mismatch '+k);M[k].n=build(L,P).length;holds.push(k);}}
const sha=cr.createHash('sha256').update(JSON.stringify(L),'utf8').digest('hex').slice(0,16);
let head=T.slice(0,a);const re=/library sha [0-9a-f]{16}, \d+ lines/;if((head.match(new RegExp(re,'g'))||[]).length!==1)throw new Error('header');head=head.replace(re,'library sha '+sha+', '+L.length+' lines');
node.parameters.jsCode=head+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+'\n/*END*/'+T.slice(c+8);
fs.writeFileSync(OUT,JSON.stringify(W));console.log(JSON.stringify({holds,sha,lines:L.length,delta:NEW.length-OLD.length}));
