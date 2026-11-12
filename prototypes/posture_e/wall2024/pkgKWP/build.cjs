// pkgKWP (W1; run 35296, W3 Wall 5107, W4 Wall 5108 item 1): the K-W NOT HELD run test also tries the flagged quote with
// every parenthetical removed. Luna's K-W #4 quoted "I grant that her 'know' is present" from the flagged sentence
// "I grant that her 'know' is present (Luke 1:31, 'thou shalt conceive' is future)." The parenthetical holds more than a
// reference, so KWR_REF keeps it, and every 6-word run crosses into it. New runs: the quote (and each nhqFull part) with
// "( ... )" removed and the lead "I grant" etc. stripped, only when 4 or more words remain. One library line (1201). Prompt 0.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const one=(s,o,n,what)=>{if(s.split(o).length!==2)throw new Error('anchor not unique: '+what);return s.replace(o,()=>n);};
const i=Lb.findIndex(l=>l.includes("if(x.rule==='K-W'){")&&l.includes('KWR_REF'));if(i!==1201)throw new Error('K-W line at '+i);
const LEAD="/^\\s*I\\s+(?:do\\s+not\\s+claim|no\\s+longer\\s+claim|withdraw|grant|concede|drop)\\b/i";
const anc="''))))); /* pkgKWQ: also the runs with the verse references kept */";
Lb[i]=one(Lb[i],anc,"'')))),...[(a>=0&&b>a?q.slice(a+1,b):q)].concat(nhqFull(x.line,R)).map(f=>{const w=nw(String(f||'').replace(/\\s*\\([^()]*\\)/g,' ').replace("+LEAD+",''));return w.length>=4?__rn(w):[];})); /* pkgKWQ: also the runs with the verse references kept */ /* pkgKWP: and the runs with every parenthetical removed, when 4 or more words remain */",'runs end');
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
