// pkgKSR / pkgECB build (W1, offline). SET=KSR: the KEYSTONE line follows a confirmed closing-contradiction break (cureRecompute writes BROKEN). SET=ECB: the engine's own closing-break lines are not sent back (W3 Finding 1).
// SET=ALL: both. Usage (from wall2024/): SET=KSR node pkgKSR/build_KSR.cjs <base fetch-back> <out json>
const fs=require('fs'),path=require('path'),cp=require('child_process');const {rebuild}=require('../pkgLIB/unpack.cjs');
const SET=process.env.SET||'ALL';const [BASE,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(BASE,'utf8'));d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));
const KX="cecBroken2024().some(x=>x.side==='DEFENDER'&&'D'+x.link===";
const PATCH={KSR:[
 {id:'K1 cureRecompute',n:26,find:"if(!hit){__cecX[x.side]++;trig.push('CLOSE-CONTRADICTION '+lb+' (no collision line names it; counted as one '+G+')');}} /* pkgCEC */\n /* pkgCRG",
  pre:"if(!hit){__cecX[x.side]++;trig.push('CLOSE-CONTRADICTION '+lb+' (no collision line names it; counted as one '+G+')');}} /* pkgCEC */\n",post:" /* pkgCRG",add:" {const __K=P.key||(()=>{for(const raw of String(text||'').split('\\n')){const r=ri5Rd2024(raw);if(r&&r.form==='KEYSTONE')return {raw,u:raw.replace(/[*_`]+/g,'').trim().toUpperCase()};}return null;})(); /* rev 3: a KEYSTONE line the live reader reads, a bulleted one included */if(__K){const __k=ri5Key2024(__K.raw,__K.u,/^KEYSTONE\\s*:\\s*(D\\d+)\\s*(?:--|\\u2014|-|:)?\\s*(STANDS)\\b/,['STANDS']);if(__k&&"+KX+"__k[1])){trig.push('KEYSTONE '+__k[1]+' (STANDS to BROKEN)');rp.push([__K.raw,'KEYSTONE: '+__k[1]+' -- BROKEN -- LINK '+__k[1].slice(1)+' BROKEN BY A CONFIRMED CLOSING CONTRADICTION','KEYSTONE '+__k[1]]);}}} /* pkgKSR */\n"}],
ECB:[],GCC:['G1','G2'].map(id=>({id,n:3,find:fs.readFileSync('pkgGCC/patches/'+id+'.find','utf8'),to:fs.readFileSync('pkgGCC/patches/'+id+'.to','utf8')}))}; /* GCC: the gate cure takes off the send-back count (W1) */
const FP=id=>({id,n:10,find:fs.readFileSync('pkgKSR/patches/'+id+'.find','utf8'),to:fs.readFileSync('pkgKSR/patches/'+id+'.to','utf8')});PATCH.KSR.push(FP('K2'),FP('K3'),FP('K5'),FP('K6'));PATCH.ECB.push({...FP('E1'),n:3},{...FP('E2'),n:3}); /* rev 3: K4 and E3 dropped (bloat check) */
const S0=SET.split('x')[0],SKIP=SET.split('x').slice(1); /* ablation: SET=ALLxK2 leaves K2 out */
const use=(S0==='ALL'?PATCH.KSR.concat(PATCH.ECB):PATCH[S0]).filter(p=>!SKIP.includes(p.id.split(' ')[0]));let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const SRC='pkgLIB/strip_'+(process.env.BASESRC||'R1')+'/patched/',SD='pkgLIB/strip_'+SET+(process.env.BASESRC?'_on_'+process.env.BASESRC:'')+'/patched/',PK='pkgLIB_'+SET+(process.env.BASESRC?'_on_'+process.env.BASESRC:''); /* BASESRC: another base (e.g. GFS) */
for(const p of [SD.replace('/patched/',''),PK])if(fs.existsSync(p))fs.rmSync(p,{recursive:true});fs.mkdirSync(SD,{recursive:true});
const hits={};for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(SRC+f,'utf8');
 for(const p of use){const c=s.split(p.find).length-1;if(!c)continue;if(c!==1){say(false,p.id+' found '+c+' times in '+f);continue;}hits[p.id]=(hits[p.id]||0)+1;s=s.replace(p.find,p.to!=null?p.to:p.pre+p.add+p.post);}
 try{new Function('$','$input','return (async()=>{\n'+s+'\n})();');}catch(e){say(false,'parse '+f+': '+e.message);}fs.writeFileSync(SD+f,s);}
for(const p of use)say(hits[p.id]===p.n,'B1 '+p.id+': applied in '+(hits[p.id]||0)+' sources (expected '+p.n+')');
const TMPFB=path.join(require('os').tmpdir(),'ksr_base_'+process.pid+'.json');fs.writeFileSync(TMPFB,JSON.stringify(base));
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
