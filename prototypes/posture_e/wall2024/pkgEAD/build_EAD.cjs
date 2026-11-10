// pkgEAD build (W1, offline): a DeepSeek E-ANS / E-HOLD item whose reason reads a deferral as the whole answer is not sent back when the pkgVP3 code finds an answer behind it.
// usage (from wall2024/): BASESRC=S112L node pkgEAD/build_EAD.cjs <base fetch-back> <out json>
const fs=require('fs'),path=require('path'),cp=require('child_process');const {rebuild}=require('../pkgLIB/unpack.cjs');
const [BASE,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(BASE,'utf8'));d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));
const P='pkgEAD/patches/';const find=fs.readFileSync(P+'E1.find','utf8');
const CHECK="{const __e=__ead(x);if(__e){if(!bySeat.has(x.seat))bySeat.set(x.seat,[]);not_sent.push({seat:x.seat,rule:x.rule,item:x.item,why:'the DeepSeek reason reads a deferral as the whole answer, and the code finds an answer behind it: '+__e+' (pkgEAD)'});continue;}}";
const to=(process.env.NOVP3?'':fs.readFileSync(P+'vp3_block.txt','utf8'))+fs.readFileSync(P+'E1.add','utf8')+find+CHECK;
const SET=process.env.SET||'EAD';const F2='\nfor(const [seat,list] of bySeat){const j=PB.judges.find(q=>q.seat===seat);';const use=SET==='NONE'?[]:[{id:'E1',n:3,find,to},{id:'E2',n:3,find:F2,to:'\nfor(const [k,v] of [...bySeat])if(!v.length)bySeat.delete(k); /* pkgEAD: a seat whose items were all withheld sends no call; the seat order stays */'+F2}];let ok=true;const say=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const SRC='pkgLIB/strip_'+(process.env.BASESRC||'S112L')+'/patched/',SD='pkgLIB/strip_'+SET+'_on_'+(process.env.BASESRC||'S112L')+'/patched/',PK='pkgLIB_'+SET+'_on_'+(process.env.BASESRC||'S112L');
for(const p of [SD.replace('/patched/',''),PK])if(fs.existsSync(p))fs.rmSync(p,{recursive:true});fs.mkdirSync(SD,{recursive:true});
const hits={};for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(SRC+f,'utf8');
 for(const p of use){const c=s.split(p.find).length-1;if(!c)continue;if(c!==1){say(false,p.id+' found '+c+' times in '+f);continue;}hits[p.id]=(hits[p.id]||0)+1;s=s.replace(p.find,()=>p.to);}
 try{new Function('$','$input','return (async()=>{\n'+s+'\n})();');}catch(e){say(false,'parse '+f+': '+e.message);}fs.writeFileSync(SD+f,s);}
for(const p of use)say(hits[p.id]===p.n,'B1 '+p.id+': applied in '+(hits[p.id]||0)+' sources (expected '+p.n+')');
const TMPFB=path.join(require('os').tmpdir(),'ead_base_'+process.pid+'.json');fs.writeFileSync(TMPFB,JSON.stringify(base));
const r=cp.spawnSync(process.execPath,['gate/pack.cjs',SD.replace('/patched/',''),PK],{env:{...process.env,FB:TMPFB},encoding:'utf8',maxBuffer:64<<20});fs.unlinkSync(TMPFB);
console.log(r.stdout.trim().split('\n').slice(-1).join('\n'));if(r.status)throw new Error('pack failed: '+r.stderr);
const PP=PK+'/patched/',E4=PK+'/e4_rebase/';const lib=fs.readFileSync(PP+'Shared_Library.js','utf8');const by={};d.nodes.forEach(n=>by[n.name]=n);
by['Shared Library'].parameters.jsCode=lib;const e4=fs.existsSync(E4)?fs.readdirSync(E4):[];const rb=[];
for(const f of fs.readdirSync(PP).filter(f=>f!=='Shared_Library.js')){const n=f.slice(0,-3).replace(/_/g,' ');const stub=fs.readFileSync(PP+f,'utf8');if(rebuild(stub,lib)!==fs.readFileSync(SD+f,'utf8'))rb.push(f);by[n].parameters.jsCode=e4.includes(f)?fs.readFileSync(E4+f,'utf8'):stub;}
say(!rb.length,'B2 every stub rebuilds its patched source from the new Shared Library'+(rb.length?': '+rb.join(', '):''));
const B={};base.nodes.forEach(n=>B[n.name]=n);const ch=d.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(B[n.name])).map(n=>n.name);
const strip0=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};
say(d.nodes.every(n=>strip0(n)===strip0(B[n.name]))&&JSON.stringify(d.connections)===JSON.stringify(base.connections),'B3 only Code text changes; nodes changed: '+ch.join(', '));
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
for(const n of ch)console.log('   '+n+': '+((B[n].parameters.jsCode||'').length)+' -> '+(by[n].parameters.jsCode||'').length);
console.log('SIZE (measured): all Code text '+code(base)+' -> '+code(d)+' = '+(code(d)-code(base)>=0?'+':'')+(code(d)-code(base))+'; prompt text: none added');
fs.writeFileSync(OUT,JSON.stringify(d));console.log((ok?'BUILD OK':'BUILD FAILED')+': '+OUT);process.exit(ok?0:1);
