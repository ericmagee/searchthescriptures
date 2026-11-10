// pkgF3A rev 2 sketch build (W2, offline on s110; NOT for writing until the operator chooses). SET=G1|RETRY|ALL.
// G1: Second Alternate?'s family rule gets the haiku exemption R2 Alternate Build already has (plain node).
// RETRY: one retry of the same alternate after an unusable reply: Second Alternate? (plain), Alternate Merge (plain), R2 Alternate Build (library).
// Usage (from wall2024/): SET=ALL node pkgF3A/build_F3A2.cjs <fetch-back> <out>
const fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');const {rebuild}=require('../pkgLIB/unpack.cjs');
const SET=process.env.SET||'ALL';const R=SET!=='G1',G=SET!=='RETRY';const [IN,OUT]=process.argv.slice(2);
let d=JSON.parse(fs.readFileSync(IN,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;d=d.workflow||d;const base=JSON.parse(JSON.stringify(d));const by={};d.nodes.forEach(n=>by[n.name]=n);
const edit=(s,a,b,tag)=>{const c=s.split(a).length-1;if(c!==1)throw new Error(tag+': anchor found '+c+' times');return s.replace(a,b);};
// Second Alternate?
let sa=by['Second Alternate?'].parameters.jsCode;
if(R){sa=edit(sa,"const a2r={run:false,seats:[],tried:[],free:[],why:null};","const a2r={run:false,seats:[],tried:[],free:[],retry:[],retry_for:{},why:null};",'SA1');
 sa=edit(sa,"const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];",
  "const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];\n T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(String(x.why||''))).forEach(x=>{if(!a2r.retry_for[x.api_model]){a2r.retry_for[x.api_model]=x.removed_seat;a2r.retry.push(x.api_model);}}); /* pkgF3A: an unusable reply is retried once, same model, same seat */",'SA2');
 sa=edit(sa,"&&a2r.tried.indexOf(a.api_model)<0);","&&(a2r.tried.indexOf(a.api_model)<0||a2r.retry.indexOf(a.api_model)>=0));",'SA3');
 sa=edit(sa,"a2r.why=a2r.run?'round 2 for '+a2r.seats.join(', ')+'; free: '+a2r.free.join(', ')","a2r.why=a2r.run?'round 2 for '+a2r.seats.join(', ')+'; free: '+a2r.free.join(', ')+(a2r.retry.length?'; retry of an unusable reply: '+a2r.retry.map(m=>m+' for '+a2r.retry_for[m]).join(', '):'')",'SA4');}
if(G)sa=edit(sa,"const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||d.family===a.family)","const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||(d.family===a.family&&a.api_model!=='anthropic/claude-haiku-5.5'))",'SAG');
by['Second Alternate?'].parameters.jsCode=sa;
if(R){
 // Alternate Merge: a round 2 line equal to a round 1 line is still a new line (count, not set); the record names the retry
 let am=by['Alternate Merge'].parameters.jsCode;
 am=edit(am,"const newLines=(r2raw,r1raw)=>{const have=new Set(r1raw.split('\\n'));return String(r2raw).split('\\n').filter(l=>ALT.test(l.trim())&&!have.has(l));};",
  "const newLines=(r2raw,r1raw)=>{const have=new Map();r1raw.split('\\n').forEach(l=>have.set(l,(have.get(l)||0)+1));return String(r2raw).split('\\n').filter(l=>{if(!ALT.test(l.trim()))return false;const k=have.get(l)||0;if(k>0){have.set(l,k-1);return false;}return true;});}; /* pkgF3A: counted, so a retry's line equal to round 1's is kept */",'AM1');
 am=edit(am,"alternate_round2:{seats:(SA&&SA.seats)||[],tried:(SA&&SA.tried)||[],free:(SA&&SA.free)||[],result}};","alternate_round2:{seats:(SA&&SA.seats)||[],tried:(SA&&SA.tried)||[],free:(SA&&SA.free)||[],retry:(SA&&SA.retry)||[],retry_for:(SA&&SA.retry_for)||{},result}};",'AM2');
 by['Alternate Merge'].parameters.jsCode=am;
 // R2 Alternate Build (library): G5 lets a retried model through for its own seat only
 const SRC='pkgLIB/strip_R1/patched/',X='F3A2'+SET,SD='pkgLIB/strip_'+X+'/patched/',PK='pkgLIB_'+X;
 for(const p of ['pkgLIB/strip_'+X,PK])if(fs.existsSync(p))fs.rmSync(p,{recursive:true});fs.mkdirSync(SD,{recursive:true});
 for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(SRC+f,'utf8');
  if(f==='R2_Alternate_Build.js')s=edit(s,"if(__A2R&&(__A2R.tried||[]).indexOf(a.api_model)>=0)return 'G5 (pkgA2R)",
   "if(__A2R&&__A2R.retry_for&&__A2R.retry_for[a.api_model]&&__A2R.retry_for[a.api_model]!==p.judge_seat)return 'G5 (pkgF3A): '+a.api_model+' is retried only for '+__A2R.retry_for[a.api_model];\n  if(__A2R&&(__A2R.tried||[]).indexOf(a.api_model)>=0&&!(__A2R.retry_for&&__A2R.retry_for[a.api_model]===p.judge_seat))return 'G5 (pkgA2R)",'R2');
  fs.writeFileSync(SD+f,s);}
 const TF=path.join(os.tmpdir(),'f3a_'+process.pid+'.json');fs.writeFileSync(TF,JSON.stringify(base));
 const r=cp.spawnSync(process.execPath,['gate/pack.cjs','pkgLIB/strip_'+X,PK],{env:{...process.env,FB:TF},encoding:'utf8',maxBuffer:64<<20});fs.unlinkSync(TF);
 if(r.status)throw new Error('pack failed: '+(r.stderr||r.stdout));
 const P=PK+'/patched/',E4=PK+'/e4_rebase/';const lib=fs.readFileSync(P+'Shared_Library.js','utf8');by['Shared Library'].parameters.jsCode=lib;const e4=fs.existsSync(E4)?fs.readdirSync(E4):[];
 for(const f of fs.readdirSync(P).filter(f=>f!=='Shared_Library.js')){const n=f.slice(0,-3).replace(/_/g,' ');const stub=fs.readFileSync(P+f,'utf8');
  if(rebuild(stub,lib)!==fs.readFileSync(SD+f,'utf8'))throw new Error('stub does not rebuild: '+f);by[n].parameters.jsCode=e4.includes(f)?fs.readFileSync(E4+f,'utf8'):stub;}}
const B={};base.nodes.forEach(n=>B[n.name]=n);const ch=d.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(B[n.name]));
const strip0=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};
if(!d.nodes.every(n=>strip0(n)===strip0(B[n.name]))||JSON.stringify(d.connections)!==JSON.stringify(base.connections))throw new Error('more than Code text changed');
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
console.log(SET+': nodes changed: '+ch.map(n=>n.name+' '+(n.parameters.jsCode.length-B[n.name].parameters.jsCode.length>=0?'+':'')+(n.parameters.jsCode.length-B[n.name].parameters.jsCode.length)).join(', ')+'; all Code text '+(code(d)-code(base))+' (measured); prompt none');
fs.writeFileSync(OUT,JSON.stringify(d));
