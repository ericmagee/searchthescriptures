// pkgGFC build (W3, offline; build frame taken from W1's pkgKSR build). SET=KSR: the KEYSTONE line follows a confirmed closing-contradiction break (cureRecompute writes BROKEN). SET=ECB: the engine's own closing-break lines are not sent back (W3 Finding 1).
// SET=ALL: both. Usage (from wall2024/): SET=KSR node pkgKSR/build_KSR.cjs <base fetch-back> <out json>
const fs=require('fs'),path=require('path'),cp=require('child_process');const {rebuild}=require('../pkgLIB/unpack.cjs');
const SET='GFS';const [BASE,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(BASE,'utf8'));d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));
const PATCH={GFS:[
 {id:'G1 gateRead2024',n:0,find:" for(const k in A)if(__gds.has(A[k].line)){A[k].form='DASH';",to:" for(const k in A){const m=A[k].ans==='CHANGE'&&A[k].to.match(/^(D\\d+ vs C\\d+)\\b([^]*?)[\\s;\\/|-]*(FORCED[^:]{0,20}: *\\1\\b[^]*)$/);if(m){A[k].to=m[1]+m[2];A[k].fz=m[3];}}\n for(const k in A)if(__gds.has(A[k].line)){A[k].form='DASH';"},
 {id:'G2 gateForcedM2024',n:0,find:"const segs=[a.why].concat(String(a.line||'').split('||'))",to:"const segs=[a.why,a.fz].concat(String(a.line||'').split('||'))"},
 {id:'G3 gateForced2024',n:0,find:"const segs=[a.to,a.why].concat(String(a.line||'').split('||'))",to:"const segs=[a.to,a.why,a.fz].concat(String(a.line||'').split('||'))"}]};
const use=PATCH[SET];let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const SRC='pkgLIB/strip_R1/patched/',SD='pkgLIB/strip_'+SET+'/patched/',PK='pkgLIB_'+SET;
for(const p of [SD.replace('/patched/',''),PK])if(fs.existsSync(p))fs.rmSync(p,{recursive:true});fs.mkdirSync(SD,{recursive:true});
const hits={};for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(SRC+f,'utf8');
 for(const p of use){const c=s.split(p.find).length-1;if(!c)continue;if(c!==1){say(false,p.id+' found '+c+' times in '+f);continue;}hits[p.id]=(hits[p.id]||0)+1;s=s.replace(p.find,p.to!=null?p.to:p.pre+p.add+p.post);}
 try{new Function('$','$input','return (async()=>{\n'+s+'\n})();');}catch(e){say(false,'parse '+f+': '+e.message);}fs.writeFileSync(SD+f,s);}
for(const p of use)say((hits[p.id]||0)>0,'B1 '+p.id+': applied in '+(hits[p.id]||0)+' sources');
const TMPFB=path.join(require('os').tmpdir(),'gfc_base_'+process.pid+'.json');fs.writeFileSync(TMPFB,JSON.stringify(base));
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
console.log('SIZE (measured): all Code text '+code(base)+' -> '+code(d)+' = '+(code(d)-code(base)>=0?'+':'')+(code(d)-code(base))+'; prompt text: none added');
fs.writeFileSync(OUT,JSON.stringify(d));console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
