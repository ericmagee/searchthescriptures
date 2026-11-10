// pkgGCP SURGICAL build (W1): edits the base Shared Library in place (no re-pack). Every library node source is rebuilt from the base, the pkgGCP patches
// (pkgGCP/patches L1 x10, P1 P2 P3 x3) are applied, MAP entries of changed nodes are recomputed, lines no node uses any more give their slots to new lines,
// and the rest are appended. Usage (from wall2024/): node pkgGCP/build_GCP_s.cjs <base fetch-back> <out json>
const fs=require('fs'),cr=require('crypto');const {rebuild}=require('../pkgLIB/unpack.cjs');
const [BASE,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(BASE,'utf8'));d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));
let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const LN=d.nodes.find(n=>n.name==='Shared Library');const T=LN.parameters.jsCode;const i=T.indexOf('\n/*LIB*/'),j=T.lastIndexOf('\n/*MAP*/'),k=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(i+8,j)),MAP=JSON.parse(T.slice(j+8,k));const n0=LIB.length;
const P=[['L1',10],['P1',3],['P2',3],['P3',3]].map(([id,n])=>({id,n,find:fs.readFileSync(__dirname+'/patches/'+id+'.find','utf8'),to:fs.readFileSync(__dirname+'/patches/'+id+'.to','utf8')}));
const stubOf=n=>d.nodes.find(x=>x.name===n).parameters.jsCode;const full=n=>{const c=stubOf(n);try{return rebuild(c,T);}catch(e){const L=c.split('\n');const q=L.findIndex(l=>l.startsWith('if(__S.length!==__N)'));return rebuild(L.slice(0,q+1).join('\n')+'\nreturn await new Function(',T);}};
const OLD={},NEW={},hits={};for(const name of Object.keys(MAP)){const s0=full(name);OLD[name]=s0;let s=s0;for(const p of P){const c=s.split(p.find).length-1;if(!c)continue;if(c!==1){say(false,p.id+' found '+c+' times in '+name);continue;}hits[p.id]=(hits[p.id]||0)+1;s=s.replace(p.find,p.to);}
 if(s!==s0){new Function('$','$input','return (async()=>{\n'+s+'\n})();');NEW[name]=s;}}
for(const p of P)say(hits[p.id]===p.n,'B1 '+p.id+': applied in '+(hits[p.id]||0)+' sources (expected '+p.n+')');
const idxOf=e=>typeof e==='number'?[e]:(typeof e[0]==='number'?Array.from({length:e[1]-e[0]+1},(_,q)=>e[0]+q):[]);
const used=new Set();for(const [nm,v] of Object.entries(MAP))if(!NEW[nm])for(const e of v.p||[])idxOf(e).forEach(x=>used.add(x));
const need=new Set(Object.values(NEW).flatMap(s=>s.split('\n')));const IDX=new Map();LIB.forEach((l,x)=>{if(!IDX.has(l))IDX.set(l,x);});
const FREE=[];for(let x=0;x<LIB.length;x++)if(!used.has(x)&&!need.has(LIB[x])&&IDX.get(LIB[x])===x&&Object.values(MAP).some(v=>(v.p||[]).some(e=>idxOf(e).includes(x))))FREE.push(x);
console.log('slots freed by the change: '+FREE.length);
for(const [name,s] of Object.entries(NEW)){const OWN=new Set((MAP[name].p||[]).filter(e=>Array.isArray(e)&&typeof e[0]==='string').map(e=>e[0]));const p=[];
 for(const l of s.split('\n')){let x=IDX.get(l);if(x===undefined&&OWN.has(l)){p.push([l]);continue;}if(x===undefined){if(FREE.length){x=FREE.shift();IDX.delete(LIB[x]);LIB[x]=l;}else{x=LIB.length;LIB.push(l);}IDX.set(l,x);}const t=p[p.length-1];
  if(typeof t==='number'&&x===t+1)p[p.length-1]=[t,x];else if(Array.isArray(t)&&typeof t[0]==='number'&&x===t[1]+1)t[1]=x;else p.push(x);}
 MAP[name]={...MAP[name],n:s.length,p};}
const sha=x=>cr.createHash('sha256').update(x).digest('hex').slice(0,16);say(sha(T.slice(i+8,j))===(T.match(/library sha ([0-9a-f]+)/)||[])[1],'U3 header sha formula reproduced on the base library');
const LJ=JSON.stringify(LIB);LN.parameters.jsCode=T.slice(0,i).replace(/library sha [0-9a-f]+, \d+ lines/,'library sha '+sha(LJ)+', '+LIB.length+' lines')+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(k);
const NL=LN.parameters.jsCode;const bad=[];for(const name of Object.keys(MAP)){const c=stubOf(name);let got;try{got=rebuild(c,NL);}catch(e){const L=c.split('\n');const q=L.findIndex(l=>l.startsWith('if(__S.length!==__N)'));got=rebuild(L.slice(0,q+1).join('\n')+'\nreturn await new Function(',NL);}if(got!==(NEW[name]||OLD[name]))bad.push(name);}
say(!bad.length,'B2 every stub rebuilds: the '+Object.keys(NEW).length+' changed sources to their new text, all others to their base text'+(bad.length?': '+bad.join(', '):''));
const B={};base.nodes.forEach(n=>B[n.name]=n);const ch=d.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(B[n.name])).map(n=>n.name);
const strip0=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};
say(d.nodes.every(n=>strip0(n)===strip0(B[n.name]))&&JSON.stringify(d.connections)===JSON.stringify(base.connections),'B3 only Code text changes; nodes changed: '+ch.join(', '));
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);console.log('LIB lines '+n0+' -> '+LIB.length+' (unused freed slots left: '+FREE.length+')');
console.log('SIZE (measured): all Code text '+code(base)+' -> '+code(d)+' = '+(code(d)-code(base)>=0?'+':'')+(code(d)-code(base))+' against the base; prompt text: none added');
fs.mkdirSync(__dirname+'/surgical',{recursive:true});for(const [n,s] of Object.entries(NEW))fs.writeFileSync(__dirname+'/surgical/'+n.replace(/ /g,'_')+'.js',s);
fs.writeFileSync(OUT,JSON.stringify(d));console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
