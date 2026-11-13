// W2 pkgKFV (measure only; outside review of run 35856, point 5): K-FC tested sol's FORCED D4 vs C3 CARRIED BY (Isaiah 7:16 words)
// against Luke 1:27. Cause: kfcVerse takes the FIRST line of the pressing round that holds the MEANS sentence's opening words; in
// [DR2] that is a prose [L4] line ("The sign is bounded in Isaiah's day (7:16) ... (Luke 1:27)") that comes before the press line
// "Isaiah 7:16 "..." -- MEANS: the sign is bounded in Isaiah's day.", and with no MEANS: on it the code took its first full reference.
// Fix: prefer a line where the words stand AFTER "MEANS:"; else the old line. Shared Library line 385 only; MAP and sha recomputed.
// usage: node pkgKFV/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const A="const line=fm?__kfLB(rt).replace(/[*_`]+/g,'').split('\\n').find(x=>kkjvFold(x).includes(fm)):null;";
const B="const ls=fm?__kfLB(rt).replace(/[*_`]+/g,'').split('\\n'):[];const line=ls.find(x=>{const i=x.search(/MEANS\\s*:/i);return i>=0&&kkjvFold(x.slice(i)).includes(fm);})||ls.find(x=>kkjvFold(x).includes(fm))||null;";
const i=Lb.findIndex(l=>l.includes(A));if(i<0||Lb.filter(l=>l.includes(A)).length!==1)throw new Error('anchor');Lb[i]=Lb[i].replace(A,()=>B);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(fout,JSON.stringify(raw));console.log('line',i,'Shared Library jsCode +'+(N.parameters.jsCode.length-T.length),'sha',N.parameters.jsCode.match(/library sha ([0-9a-f]{16})/)[1]);
