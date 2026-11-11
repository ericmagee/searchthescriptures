// W3: express merged file as line terms over the base (v103) plus literal lines; verify by reassembly.
const fs=require('fs');const crypto=require('crypto');const [baseF,outF]=process.argv.slice(2);
const B=fs.readFileSync(baseF,'utf8').split('\n'),O=fs.readFileSync(outF,'utf8').split('\n');
const T=[(l)=>l,(l)=>l.trim().replace(/^- /,''),(l)=>l.replace(/^### /,'')];
const idx=[new Map(),new Map(),new Map()];B.forEach((l,j)=>{T.forEach((f,m)=>{const k=f(l);if(k.length<4)return;if(!idx[m].has(k))idx[m].set(k,[]);idx[m].get(k).push(j);});});
const terms=[];const lits=[];let prevJ=-5;
for(const o of O){let hit=null;
 // prefer continuation of previous run
 for(let m=0;m<3&&!hit;m++){for(let p=0;p<=o.length&&p<=40&&!hit;p++){const pre=o.slice(0,p),rest=o.slice(p);if(rest.length<4)break;if(!/^[ \-(a-z by later rule)]*$/.test(pre)&&pre!=='  - (replaced by a later rule) ')continue;const c=idx[m].get(rest);if(!c)continue;const j=c.includes(prevJ+1)?prevJ+1:c[0];if(T[m](B[j])===rest)hit={j,m,pre};}}
 if(hit){const last=terms[terms.length-1];if(last&&last.t==='R'&&last.m===hit.m&&last.pre===hit.pre&&last.b+1===hit.j)last.b=hit.j;else terms.push({t:'R',a:hit.j,b:hit.j,m:hit.m,pre:hit.pre});prevJ=hit.j;}
 else{const last=terms[terms.length-1];if(last&&last.t==='L')last.n++;else terms.push({t:'L',k:lits.length,n:1});lits.push(o);prevJ=-5;}}
// prefixes table
const P=[...new Set(terms.filter(x=>x.t==='R').map(x=>x.pre))];
const plan=terms.map(x=>x.t==='R'?('R'+(x.a+1)+','+(x.b+1)+','+x.m+','+P.indexOf(x.pre)):('L'+x.n)).join(' ');
// reassemble
let out=[];let li=0;for(const tk of plan.split(' ')){if(tk[0]==='R'){const [a,b,m,p]=tk.slice(1).split(',').map(Number);for(let j=a;j<=b;j++)out.push(P[p]+T[m](B[j-1]));}else{const n=+tk.slice(1);for(let q=0;q<n;q++)out.push(lits[li++]);}}
const md5=s=>crypto.createHash('md5').update(s).digest('hex');const ok=out.join('\n')===O.join('\n');
fs.writeFileSync('plan.txt',plan);fs.writeFileSync('prefixes.json',JSON.stringify(P));const LEADT=lits.find(x=>x.startsWith('- RULES WRITTEN AFTER s82'));const lt=lits.map(x=>x===LEADT?'@LEAD@':x);fs.writeFileSync('literals.txt',lt.join('\n'));const g=[];for(let i=0;i<lt.length;i+=10)g.push((i+1)+':'+md5(lt.slice(i,i+10).join('\n')).slice(0,6));console.log('tokenized literal chars',lt.join('\n').length,'md5',md5(lt.join('\n')),'groups',g.join(' '));
console.log('reassembly ok',ok,'| terms',terms.length,'| plan chars',plan.length,'| prefixes',JSON.stringify(P),'| literal lines',lits.length,'chars',lits.join('\n').length,'| out md5',md5(O.join('\n')),'len',O.join('\n').length);
