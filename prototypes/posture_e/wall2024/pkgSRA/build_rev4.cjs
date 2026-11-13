// pkgSRA rev 4 (W2, ASK 185 item a; plan Wall 5787): the same-round section no longer repeats a line already served as THE ANSWER IN FULL.
// sraSame takes the answer block (__eb.t) as a 6th argument and leaves out of its top two any line found inside it. The block is not
// added to the paragraph pool, so the rarity weights and every other item's choice stay as live; the freed place goes to the next line.
// usage: node pkgSRA/build_rev4.cjs <parent in> <parent out>
const fs=require('fs'),crypto=require('crypto');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const before={};for(const e in M)before[e]=reb(e);
const A="g.answer,__ol);return s?",B="g.answer,__ol,__eb?__eb.t:'');return s?";
const F1="function sraSame(T,verse,means,ans,ol){",F2="function sraSame(T,verse,means,ans,ol,eb){";
const G1=".filter(x=>x.v>=0.5&&ks.some(k=>df[k]<=3&&S[x.i].has(k))).sort(",G2=".filter(x=>x.v>=0.5&&ks.some(k=>df[k]<=3&&S[x.i].has(k))&&!(EB&&EB.includes(NN(x.p)))).sort(";
const H1="const S=P.map(st);const df={};",H2="const S=P.map(st);const df={};const EB=NN(eb); /* pkgSRA rev 4: no line of THE ANSWER IN FULL */";
const sub1=(A,B,what)=>{const n=Lb.reduce((t,l)=>t+l.split(A).length-1,0);if(n!==1)throw new Error('anchor '+what+' '+n);const i=Lb.findIndex(l=>l.includes(A));Lb[i]=Lb[i].replace(A,()=>B);return i;};
const i=sub1(A,B,'call');if(!Lb.slice(0,i+1).some(l=>l.includes('const __eb=__eg(')))throw new Error('__eb not before');
const i2=sub1(F1,F2,'signature');sub1(G1,G2,'filter');sub1(H1,H2,'EB');
const ch=[];for(const e in M){const s=reb(e);if(s!==before[e])ch.push(e+' '+(s.length-before[e].length));M[e].n=s.length;}
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('lines',i,i2,'nodes rebuilt changed:',ch.join('; '),'| Shared Library jsCode',(N.parameters.jsCode.length-T.length>=0?'+':'')+(N.parameters.jsCode.length-T.length),'| sha256',crypto.createHash('sha256').update(s).digest('hex').slice(0,16));
