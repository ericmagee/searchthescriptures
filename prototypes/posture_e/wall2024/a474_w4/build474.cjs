// ASK 474: one psGrades text. The 3 Send Back Record stubs take the psGrades text the other 15 copies use (with ri3Head2024, which it calls).
// Shared Library only; engine and child copies stay byte-equal. Unreferenced library lines are dropped and the MAP renumbered. Offline.
// usage: node a474_w4/build474.cjs ENGINE.json CHILD.json OUT_ENGINE.json OUT_CHILD.json
const fs=require('fs'),cr=require('crypto'),path=require('path');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));const T=require('../tools/lib.cjs');
const [EI,CI,EO,CO]=process.argv.slice(2);const E=JSON.parse(fs.readFileSync(EI)),C=JSON.parse(fs.readFileSync(CI));
const EB='828dc91d-3cc1-4fe4-9f0b-5f4c4b6acca1',CB='33adc248-b0ea-4666-a092-fd3be311847e';
if(E.versionId!==EB)throw new Error('engine base is not '+EB+': '+E.versionId);if(C.versionId!==CB)throw new Error('child base is not '+CB+': '+C.versionId);
const slE=E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode,slC=C.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const U=T.unpack(E);const L=U.L,M=U.M;const UC=T.unpack(C);const MC=UC.M;
if(UC.hdr!==U.hdr||JSON.stringify(UC.L)!==JSON.stringify(L)||UC.tail!==U.tail)throw new Error('engine and child library lines differ');
for(const k of Object.keys(MC))if(JSON.stringify(MC[k])!==JSON.stringify(M[k]))throw new Error('child MAP entry differs: '+k);
const onlyE=Object.keys(M).filter(k=>!MC[k]);if(JSON.stringify(onlyE)!=='["REFP"]')throw new Error('engine-only MAP entries: '+onlyE);
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
const fns=s=>{const o={};const w=x=>{if(!x||typeof x.type!=='string')return;if(x.type==='FunctionDeclaration'&&!o[x.id.name])o[x.id.name]={t:s.slice(x.start,x.end),a:x.start,b:x.end};for(const k in x){const v=x[k];if(Array.isArray(v))v.forEach(w);else if(v&&typeof v.type==='string')w(v);}};w(P(s));return o;};
const SBX=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'],CCX=['Cure Check','Panel Cure Check'];
const before={};for(const k of Object.keys(M))before[k]=T.rb(L,M[k]);
const usedB=(()=>{const u=new Set();for(const k of Object.keys(M))for(const e of M[k].p){if(typeof e==='number')u.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)u.add(i);}return u;})();
const GA=fns(before['Gate Build']);const A=GA.psGrades.t,RI=GA.ri3Head2024.t;
const holders=Object.keys(M).filter(k=>fns(before[k]).psGrades);const SB=holders.filter(k=>fns(before[k]).psGrades.t!==A);
if(JSON.stringify(SB.slice().sort())!==JSON.stringify(SBX.concat(CCX).sort()))throw new Error('nodes not on text A: '+SB);
const tok=s=>{const o=[];for(const t of acorn.tokenizer(s,{ecmaVersion:'latest'}))o.push(t.type.label+':'+(t.value===undefined?'':String(t.value)));return o.join(' ');};
for(const k of CCX)if(tok(fns(before[k]).psGrades.t)!==tok(A))throw new Error(k+': text is not token-equal to A');
const news={};
for(const k of SB){const s=before[k];const f=fns(s);const addRI=!f.ri3Head2024;if(SBX.includes(k)!==addRI)throw new Error(k+': ri3Head2024 presence unexpected');
 if(f.ri3Head2024&&f.ri3Head2024.t!==RI)throw new Error(k+': ri3Head2024 differs');
 news[k]=s.slice(0,f.psGrades.a)+(addRI?RI+'\n':'')+A+s.slice(f.psGrades.b);P(news[k]);const g=fns(news[k]);if(g.psGrades.t!==A||g.ri3Head2024.t!==RI)throw new Error(k+': splice');}
// pack each new source onto existing lines: greedy, preferring the next line, else the longest match; a line found nowhere becomes an inline string.
const byHead=new Map();L.forEach((x,i)=>{const h=x.split('\n')[0];if(!byHead.has(h))byHead.set(h,[]);byHead.get(h).push(i);});
function pack(s){const out=[];let pos=0,prev=-2;while(pos<=s.length){const nl=s.indexOf('\n',pos);const head=s.slice(pos,nl<0?s.length:nl);const cand=(byHead.get(head)||[]).filter(i=>s.startsWith(L[i],pos)&&(pos+L[i].length===s.length||s[pos+L[i].length]==='\n'));
  let pick=null;if(cand.includes(prev+1))pick=prev+1;else if(cand.length)pick=cand.reduce((a,b)=>L[b].length>L[a].length?b:a);
  if(pick!==null){out.push(pick);prev=pick;pos+=L[pick].length;}else{out.push([head]);prev=-2;pos+=head.length;}
  if(pos>=s.length)break;pos++;}
 const p=[];for(const e of out){const t=p[p.length-1];if(typeof e==='number'&&t!=null&&typeof t!=='string'){if(typeof t==='number'&&e===t+1){p[p.length-1]=[t,e];continue;}if(Array.isArray(t)&&typeof t[0]==='number'&&e===t[1]+1){t[1]=e;continue;}}p.push(e);}return p;}
for(const k of SB){const p=pack(news[k]);const m={n:news[k].length,p};if(T.rb(L,m)!==news[k])throw new Error(k+': pack does not rebuild');M[k]=m;MC[k]=JSON.parse(JSON.stringify(m));}
// drop lines no stub reads, renumber
const usedBy=MM=>{const u=new Set();for(const k of Object.keys(MM))for(const e of MM[k].p){if(typeof e==='number')u.add(e);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)u.add(i);}return u;};
const used=usedBy(M);
const keep=L.map((x,i)=>used.has(i)||!usedB.has(i)); /* drop only lines this change leaves unread; lines already unread in the base stay */const nmap=[];let j=0;L.forEach((x,i)=>{if(keep[i])nmap[i]=j++;});const dropped=L.map((x,i)=>i).filter(i=>!keep[i]);
const L2=L.filter((x,i)=>keep[i]);
for(const MM of [M,MC])for(const k of Object.keys(MM))MM[k].p=MM[k].p.map(e=>typeof e==='number'?nmap[e]:typeof e[0]==='number'?[nmap[e[0]],nmap[e[1]]]:e);
for(const k of Object.keys(M)){const s=T.rb(L2,M[k]);const want=SB.includes(k)?news[k]:before[k];if(s!==want)throw new Error(k+': rebuild differs after renumber');if(s.length!==M[k].n)throw new Error(k+': n');}
const LJ=JSON.stringify(L2);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L2.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const SL=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail,SLC=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MC)+U.tail;
for(const k of Object.keys(MC))if(T.rb(L2,MC[k])!==T.rb(L2,M[k]))throw new Error('child '+k+' differs from engine');
E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=SL;C.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=SLC;
fs.writeFileSync(EO,JSON.stringify(E));fs.writeFileSync(CO,JSON.stringify(C));
console.log('psGrades holders',holders.length,'| stubs changed',SB.join(', '),'| lines',L.length,'->',L2.length,'dropped',dropped.length,JSON.stringify(dropped),'| lib sha',U.hdr.match(/library sha (\w+)/)[1],'->',lsha);
for(const k of SB)console.log(k,'length',before[k].length,'->',news[k].length);
console.log('dropped line texts:');for(const i of dropped)console.log(' L'+i+': '+JSON.stringify(L[i]).slice(0,200));
