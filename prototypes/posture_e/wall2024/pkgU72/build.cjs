// pkgU72 (W1; W4 Wall 5207, Worker_A3 Wall 5200 C5; run 35296 argon, log 30854): K-UNX-A path B asked a judge to drop an UNEXHIBITED
// count as "answered" because the block quotes the press's MEANS, although the judge's own ANSWER CHECK on that press grades the answer
// MISSES or FAILS. Under ruling 372 such a witness is unanswered, so the count stands. Change (kunxLines, library lines 452, 459, 466):
// path B does not fire for a press when the judge's own ANSWER CHECK lines on that reference in the answering round read MISSES or FAILS
// and none reads MEETS. Path A (ASSUMES), the layer-name path and the plain path are unchanged. Prompt 0.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const E=[
 [452,"function unxaCheck(all,blk,k,P){","function unxaCheck(all,blk,k,P,TX,RK){"],
 [459,"if(L.some(l=>UNX_MRUN(l,p.means,8)))return {a:'UNANSWERED'","if(L.some(l=>UNX_MRUN(l,p.means,8))&&!unxAcFail(TX,p.ref,RK))return {a:'UNANSWERED'"],
 [466,"unxaCheck(all,bk,lbFoot(bk,true),PR.filter(p=>p.n===j))","unxaCheck(all,bk,lbFoot(bk,true),PR.filter(p=>p.n===j),text,rk)"],
];
for(const [li,o,n] of E){if(Lb[li].split(o).length!==2)throw new Error('anchor at '+li+': '+o.slice(0,40));Lb[li]=Lb[li].replace(o,()=>n);}
// helper placed at the head of line 452, before unxaCheck
const H="function unxAcFail(TX,ref,RK){if(typeof TX!=='string'||!ref||!RK)return false;const rf=String(ref).replace(/\\s+/g,'\\\\s+').replace(/\\./g,'\\\\.');const re=new RegExp('^[\\\\s>*_-]*ANSWER\\\\s+CHECK\\\\s*:?[\\\\s*_]*'+rf+'\\\\b(?!\\\\s*[-\\u2013]?\\\\d)[^\\\\n]*?--\\\\s*\\\\[?\\\\s*'+RK+'\\\\s*\\\\]?','i');let f=0,m=0;for(const l of TX.split('\\n')){if(!re.test(l))continue;const i=l.search(/--\\s*ANSWER\\s*:/i);const g=(i<0?l:l.slice(i)).match(/--\\s*\\**\\s*(MEETS|MISSES|FAILS)\\b/);if(!g)continue;if(g[1].toUpperCase()==='MEETS')m++;else f++;}return f>0&&m===0;} /* pkgU72: under ruling 372 an answer the judge's own ANSWER CHECK grades MISSES or FAILS leaves the witness unanswered, so K-UNX-A path B does not ask to drop that count */\n";
Lb[452]=H+Lb[452];
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
