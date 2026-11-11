// pkgSGR (W1): the E-SYN item's list "THAT SIDE'S OWN SENTENCES THAT GIVE GROUND" (giveUp, Shared Library line 3163).
// 1. Admits the grant forms the old test missed: "It is granted that", "This is granted", "<verse> is granted", "which I granted",
//    "I have conceded", "I keep my earlier grants", "I keep dropped", "stays dropped", and a sentence that opens with the label
//    "Grant." / "Granted:" / "Concession:".
// 2. Drops the other side's grants: quoted text is not read (a quoted "I grant" is the other side's or a verse), and a sentence whose
//    subject is the other side ("the defender grants it to", "The defender narrowed", "conceded by the challenger") is not read.
// The call site (line 3169) passes the side. MAP lengths and the header sha are recomputed.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const rep=(i,o,n)=>{if(Lb[i].split(o).length!==2)throw new Error('line '+i+' anchor not unique');Lb[i]=Lb[i].replace(o,()=>n);};
rep(3163,String.raw`const giveUp=(T,claim)=>{const cw=new Set((N(claim).match(/[a-z]{4,}/g)||[]));const out=[];for(const p of String(T||'').split(/\n+/)){if(/\bI\s+(?:withdraw|drop|grant|concede|do\s+not\s+claim|no\s+longer\s+claim)\b|\bNARROWED\s+TO\b|\bConceded\b/i.test(p)){`,
 String.raw`const giveUp=(T,claim,sd)=>{const cw=new Set((N(claim).match(/[a-z]{4,}/g)||[]));const out=[];const os=(sd==='D'?'challenger':'defender')+'|opponent';const OS=new RegExp('\\b(?:'+os+')\\b(?![\'’]s)[^.;:]{0,60}?\\b(?:grant|conced|withdr|drop|narrow)|\\b(?:granted|conceded|dropped|withdrawn|narrowed)\\s+by\\s+(?:the\\s+)?(?:'+os+')\\b','i');for(const p of String(T||'').split(/\n+/)){if(p.replace(/"[^"\n]*"|“[^”\n]*”|‘[^’\n]*’|(?<![A-Za-z])'[^'\n]*'(?![A-Za-z])/g,' ').split(/(?<=[.!?])\s+/).some(x=>/\bI\s+(?:withdraw|drop|grant|concede|do\s+not\s+claim|no\s+longer\s+claim)\b|\bNARROWED\s+TO\b|\bConceded\b|\bI\s+(?:have\s+)?(?:granted|conceded|dropped|withdrew)\b|\bI\s+keep\s+(?:my\s+(?:earlier\s+)?(?:grants?|concessions?)|dropped)\b|\b(?:is|are|was|were)\s+(?:also\s+)?(?:granted|conceded)\b(?!\s+by\b)|\bstays?\s+dropped\b|^\s*(?:[-*>•]\s*)*(?:\[[^\]\n]{1,24}\]\s*)*(?:\*\*)?(?:grant(?:ed)?|concession)\b(?:\*\*)?\s*[.:]/i.test(x)&&!OS.test(x))){ /* pkgSGR */`);
rep(3169,"(giveUp(SIDEW[sd],s)||","(giveUp(SIDEW[sd],s,sd)||");
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3],'jsCode delta',N.parameters.jsCode.length-T.length);
