// pkgGUB (W2, offline): on top of pkgGCCN rev 2, a gate-cured line takes its send-back count off only when the gate's new line also passes the
// pkgUND rule that counted it (UND.cure, the existing send-back code, reused through the Shared Library). Usage (from wall2024/):
// node pkgGUB/build_GUB.cjs <s110 fetch-back> <out json>. Sources: pkgLIB/strip_GCCN2/patched (GCCN2 = W1 rev 2 on strip_R1).
const fs=require('fs'),path=require('path'),cp=require('child_process');const {rebuild}=require('../pkgLIB/unpack.cjs');
const [BASE,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(BASE,'utf8'));d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));
let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const V=process.env.GUBBASE||'GCCN3';const SRC='pkgLIB/strip_'+V+'/patched/',SD='pkgLIB/strip_GUB'+(V==='GCCN2'?'':'_'+V)+'/patched/',PK='pkgLIB_GUB'+(V==='GCCN2'?'':'_'+V);
for(const p of [SD.replace('/patched/',''),PK])if(fs.existsSync(p))fs.rmSync(p,{recursive:true});fs.mkdirSync(SD,{recursive:true});
const SBR=fs.readFileSync('pkgLIB/strip_R1/patched/Send_Back_Record.js','utf8').split('\n');
const a=SBR.findIndex(l=>l.startsWith('const ECL=(()=>{')),z=SBR.findIndex(l=>l.startsWith(' return {rounds,pressed,graded,missing,undOk'));say(a>0&&z>a,'U0 ECL and UND block found in Send Back Record lines '+(a+1)+'-'+(z+1));
const BLOCK=SBR.slice(a,z+1); /* the same lines the three Send Back Record nodes already share in the library */
const GUB=fs.readFileSync(__dirname+'/gub_line.js','utf8').trim();
const F1="/^E-APPLY S\\d+$/.test(r.src)&&String(p.verdict_raw)",T1="/^E-APPLY S\\d+$/.test(r.src)&&__gub(r,g.seat,p.verdict_raw)&&String(p.verdict_raw)";
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(SRC+f,'utf8');
 if(/^(R2_Alt_|Alt_)?Gate_Record\.js$/.test(f)){const L=s.split('\n');const k=L.findIndex(l=>/^const PASS=\$\('/.test(l));say(k>0,'U1 '+f+': PASS line '+(k+1));
  L.splice(k+1,0,GUB);L.splice(k,0,...BLOCK);s=L.join('\n');const c=s.split(F1).length-1;say(c===1,'U2 '+f+': GCCN2 filter found '+c+' time(s)');s=s.replace(F1,T1);}
 try{new Function('$','$input','return (async()=>{\n'+s+'\n})();');}catch(e){say(false,'parse '+f+': '+e.message);}fs.writeFileSync(SD+f,s);}
const TMPFB=path.join(require('os').tmpdir(),'gub_base_'+process.pid+'.json');fs.writeFileSync(TMPFB,JSON.stringify(base));
const r=cp.spawnSync(process.execPath,['gate/pack.cjs',SD.replace('/patched/',''),PK],{env:{...process.env,FB:TMPFB},encoding:'utf8',maxBuffer:64<<20});fs.unlinkSync(TMPFB);
console.log(r.stdout.trim().split('\n').slice(-1).join('\n'));if(r.status)throw new Error('pack failed: '+r.stderr);
const P=PK+'/patched/',E4=PK+'/e4_rebase/';const lib=fs.readFileSync(P+'Shared_Library.js','utf8');const by={};d.nodes.forEach(n=>by[n.name]=n);
by['Shared Library'].parameters.jsCode=lib;const e4=fs.existsSync(E4)?fs.readdirSync(E4):[];const rb=[];
for(const f of fs.readdirSync(P).filter(f=>f!=='Shared_Library.js')){const n=f.slice(0,-3).replace(/_/g,' ');const stub=fs.readFileSync(P+f,'utf8');if(rebuild(stub,lib)!==fs.readFileSync(SD+f,'utf8'))rb.push(f);by[n].parameters.jsCode=e4.includes(f)?fs.readFileSync(E4+f,'utf8'):stub;}
say(!rb.length,'B2 every stub rebuilds its patched source from the new Shared Library'+(rb.length?': '+rb.join(', '):''));
const B={};base.nodes.forEach(n=>B[n.name]=n);const ch=d.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(B[n.name])).map(n=>n.name);
const strip0=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};
say(d.nodes.every(n=>strip0(n)===strip0(B[n.name]))&&JSON.stringify(d.connections)===JSON.stringify(base.connections),'B3 only Code text changes; nodes changed: '+ch.join(', '));
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
console.log('SIZE (measured): all Code text '+code(base)+' -> '+code(d)+' = '+(code(d)-code(base)>=0?'+':'')+(code(d)-code(base))+' against s110; prompt text: none added');
fs.writeFileSync(OUT,JSON.stringify(d));console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
