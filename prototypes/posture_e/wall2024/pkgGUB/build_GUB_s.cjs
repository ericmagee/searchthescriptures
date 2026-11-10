// pkgGUB rev 2 (W2, offline), SURGICAL form: edits the live Shared Library in place instead of re-packing, so nothing but the change moves.
// The three Gate Record sources (rebuilt from live) get the pkgECL/pkgUND block (lines already in the library, from Send Back Record),
// the __gub line, and the filter call; their MAP entries are recomputed; lines not yet in the library are appended at its end (old indices unchanged);
// each stub's literal $() list gains the nodes the new code reads. Usage (from wall2024/): node pkgGUB/build_GUB_s.cjs <live fetch-back> <out json>
const fs=require('fs'),cr=require('crypto');const {rebuild}=require('../pkgLIB/unpack.cjs');
const [BASE,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(BASE,'utf8'));d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));
let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const LN=d.nodes.find(n=>n.name==='Shared Library');const T=LN.parameters.jsCode;const i=T.indexOf('\n/*LIB*/'),j=T.lastIndexOf('\n/*MAP*/'),k=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(i+8,j)),MAP=JSON.parse(T.slice(j+8,k));const n0=LIB.length;
const IDX=new Map();LIB.forEach((l,x)=>{if(!IDX.has(l))IDX.set(l,x);});
const stub=n=>d.nodes.find(x=>x.name===n).parameters.jsCode;
const SBR=rebuild(stub('Send Back Record'),T).split('\n');const a=SBR.findIndex(l=>l.startsWith('const ECL=(()=>{')),z=SBR.findIndex(l=>l.startsWith(' return {rounds,pressed,graded,missing,undOk'));
say(a>0&&z>a,'U0 ECL and UND block in live Send Back Record, lines '+(a+1)+'-'+(z+1));const BLOCK=SBR.slice(a,z+1);
const GUB=fs.readFileSync(__dirname+'/gub_line.js','utf8').trim();
const GN=['Gate Record','Alt Gate Record','R2 Alt Gate Record'];const used=new Set();for(const [k,v] of Object.entries(MAP)){if(GN.includes(k))continue;for(const e of v.p||[]){if(typeof e==='number')used.add(e);else if(typeof e[0]==='number')for(let q=e[0];q<=e[1];q++)used.add(q);}}
const FREE=[];const NEWSRC={};
const F1="/^E-APPLY S\\d+$/.test(r.src)&&String(p.verdict_raw)",T1="/^E-APPLY S\\d+$/.test(r.src)&&__gub(r,g.seat,p.verdict_raw,res)&&String(p.verdict_raw)";
const NEEDS=['Cited Verses','L2 Lexicon','L2 Words'];
for(const name of ['Gate Record','Alt Gate Record','R2 Alt Gate Record']){let s=rebuild(stub(name),T);const L=s.split('\n');const q=L.findIndex(l=>/^const PASS=\$\('/.test(l));say(q>0,'U1 '+name+': PASS line '+(q+1));
 L.splice(q+1,0,GUB);L.splice(q,0,...BLOCK);s=L.join('\n');const c=s.split(F1).length-1;say(c===1,'U2 '+name+': GCCN filter found '+c+' time(s)');s=s.replace(F1,T1);
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');NEWSRC[name]=s;}
{const need=new Set(Object.values(NEWSRC).flatMap(x=>x.split('\n')));const gidx=new Set();for(const g of GN)for(const e of MAP[g].p||[]){if(typeof e==='number')gidx.add(e);else if(typeof e[0]==='number')for(let q=e[0];q<=e[1];q++)gidx.add(q);}
 for(const q of [...gidx].sort((a,b)=>a-b))if(!used.has(q)&&!need.has(LIB[q])&&IDX.get(LIB[q])===q)FREE.push(q);console.log('free library slots (used only by the old gate text): '+FREE.length);}
for(const name of GN){let s=NEWSRC[name];
 const OWN=new Set((MAP[name].p||[]).filter(e=>Array.isArray(e)&&typeof e[0]==='string').map(e=>e[0])); /* lines this node already keeps as its own strings stay own */
 const p=[];for(const l of s.split('\n')){let x=IDX.get(l);if(x===undefined&&OWN.has(l)){p.push([l]);continue;}if(x===undefined){if(FREE.length){x=FREE.shift();IDX.delete(LIB[x]);LIB[x]=l;}else{x=LIB.length;LIB.push(l);}IDX.set(l,x);}const t=p[p.length-1];
  if(typeof t==='number'&&x===t+1)p[p.length-1]=[t,x];else if(Array.isArray(t)&&typeof t[0]==='number'&&x===t[1]+1)t[1]=x;else p.push(x);}
 MAP[name]={...MAP[name],n:s.length,p};
 const st=stub(name);const m=st.match(/if\(false\)\{((?:\$\("[^"]*"\);)*)\$\(String\(\)\);\}/);const have=[...m[1].matchAll(/\$\("([^"]*)"\)/g)].map(x=>x[1]);
 const all=[...new Set([...have,...NEEDS])].sort();d.nodes.find(x=>x.name===name).parameters.jsCode=st.replace(m[0],'if(false){'+all.map(x=>'$("'+x+'");').join('')+'$(String());}');
 fs.mkdirSync(__dirname+'/surgical',{recursive:true});fs.writeFileSync(__dirname+'/surgical/'+name.replace(/ /g,'_')+'.js',s);}
const LJ=JSON.stringify(LIB);const sha=x=>cr.createHash('sha256').update(x).digest('hex').slice(0,16);
let head=T.slice(0,i).replace(/library sha [0-9a-f]+, \d+ lines/,'library sha '+sha(LJ)+', '+LIB.length+' lines');
LN.parameters.jsCode=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(k);
say(sha(T.slice(i+8,j))===(T.match(/library sha ([0-9a-f]+)/)||[])[1],'U3 live header sha formula reproduced on live library');
const NL=LN.parameters.jsCode;let bad=[];for(const n of d.nodes){const c=n.parameters&&n.parameters.jsCode;if(!c||!/^\/\/ pkgLIB stub/.test(c))continue;const b=base.nodes.find(x=>x.name===n.name).parameters.jsCode;
 let w0;try{w0=rebuild(b,T);}catch(e){console.log('  (not rebuildable by unpack, checked by equality: '+n.name+')');if(c!==b)bad.push(n.name);continue;}const want=['Gate Record','Alt Gate Record','R2 Alt Gate Record'].includes(n.name)?fs.readFileSync(__dirname+'/surgical/'+n.name.replace(/ /g,'_')+'.js','utf8'):w0;if(rebuild(c,NL)!==want)bad.push(n.name);}
say(!bad.length,'B2 every stub rebuilds: the three gate nodes to their new source, all others to their live source'+(bad.length?': '+bad.join(', '):''));
const B={};base.nodes.forEach(n=>B[n.name]=n);const ch=d.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(B[n.name])).map(n=>n.name);
const strip0=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};
say(d.nodes.every(n=>strip0(n)===strip0(B[n.name]))&&JSON.stringify(d.connections)===JSON.stringify(base.connections),'B3 only Code text changes; nodes changed: '+ch.join(', '));
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
console.log('LIB lines '+n0+' -> '+LIB.length+' (appended '+(LIB.length-n0)+'; unused free slots left: '+FREE.length+')');for(const n of ch)console.log('  '+n+': '+(d.nodes.find(x=>x.name===n).parameters.jsCode.length-B[n].parameters.jsCode.length));
console.log('SIZE (measured): all Code text '+code(base)+' -> '+code(d)+' = +'+(code(d)-code(base))+' against the base fetch-back; prompt text: none added');
fs.writeFileSync(OUT,JSON.stringify(d));console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
