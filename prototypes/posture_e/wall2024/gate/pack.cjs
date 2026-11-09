// gate/pack.cjs: one safe command to pack a library change (W1, item 2 of the list Eric approved 11-09, Wall 3627).
// Replaces the four manual steps (pack.cjs in the shared pkgLIB folder, copy, delete Alternate_Merge.js, git checkout + git clean of pkgLIB/patched).
// Everything runs in a new temporary folder; nothing under pkgLIB/ or any other seat's folder is written. Only the output folder is created.
// Usage (from wall2024/):  FB=<fetchback json> node gate/pack.cjs pkgLIB/strip_X pkgLIB_X
//   FB defaults to the newest live fetch-back named in gate/LIVE (one line: the fetchback path).
// Steps: 1. pkgLIB/pack.cjs on the strip folder (LIB_N = the strip folder's file count) inside the temporary folder;
//        2. every stub must rebuild byte for byte to its strip source (pkgLIB/unpack.cjs rebuild);
//        3. pkgLIB/e4_rebase.cjs inside the temporary folder (Alternate Build and Early Alternate Build heads, hashes.json);
//        4. the output folder is created (refused if it already exists) and filled; the temporary folder is removed.
const fs=require('fs'),os=require('os'),path=require('path'),cp=require('child_process');
const W=path.resolve(__dirname,'..');const LIBDIR=W+'/pkgLIB';
class Refused extends Error{};const die=m=>{throw new Refused(m);};
process.on('uncaughtException',e=>{console.error(e instanceof Refused?'PACK REFUSED: '+e.message:e);process.exit(1);});
const [S,O]=process.argv.slice(2);if(!S||!O)die('usage: node gate/pack.cjs pkgLIB/strip_X pkgLIB_X');
const SA=path.resolve(S),OA=path.resolve(O);const X=path.basename(SA).replace(/^strip_/,'');
if(!/^strip_/.test(path.basename(SA)))die('the strip folder must be named strip_<X>: '+S);
if(path.basename(OA)!=='pkgLIB_'+X)die('the output folder must be named pkgLIB_'+X+' (e4_rebase pairs pkgLIB_X with strip_X): '+O);
if(!fs.existsSync(SA+'/patched'))die('no patched folder in '+S);
if(fs.existsSync(OA))die(O+' already exists; remove it yourself if it is yours, or pick a new name');
const FB=path.resolve(process.env.FB||fs.readFileSync(__dirname+'/LIVE','utf8').trim());if(!fs.existsSync(FB))die('fetch-back not found: '+FB);
const files=fs.readdirSync(SA+'/patched').filter(f=>f.endsWith('.js')).sort();
const T=fs.mkdtempSync(path.join(os.tmpdir(),'gate_pack_'));
try{
 fs.mkdirSync(T+'/pkgLIB');fs.symlinkSync(SA,T+'/pkgLIB/strip_'+X);fs.symlinkSync(LIBDIR+'/unpack.cjs',T+'/pkgLIB/unpack.cjs');
 const run=(args,env)=>{const r=cp.spawnSync(process.execPath,args,{cwd:T,env:{...process.env,...env},encoding:'utf8',maxBuffer:64<<20});
  if(r.status!==0)die(args.join(' ')+' failed:\n'+(r.stderr||r.stdout));return r.stdout;};
 run([LIBDIR+'/pack.cjs',SA],{LIB_N:String(files.length)});
 const got=fs.readdirSync(T+'/pkgLIB/patched').sort();const want=[...files,'Shared_Library.js'].sort();
 if(JSON.stringify(got)!==JSON.stringify(want))die('pack wrote '+got.length+' files, expected '+want.length+': '+got.filter(f=>!want.includes(f)).concat(want.filter(f=>!got.includes(f))).join(', '));
 const {rebuild}=require(LIBDIR+'/unpack.cjs');const lib=fs.readFileSync(T+'/pkgLIB/patched/Shared_Library.js','utf8');let bad=[];
 for(const f of files)if(rebuild(fs.readFileSync(T+'/pkgLIB/patched/'+f,'utf8'),lib)!==fs.readFileSync(SA+'/patched/'+f,'utf8'))bad.push(f);
 if(bad.length)die('stubs that do not rebuild to their strip source: '+bad.join(', '));
 fs.mkdirSync(T+'/pkgLIB_'+X);fs.renameSync(T+'/pkgLIB/patched',T+'/pkgLIB_'+X+'/patched');fs.renameSync(T+'/pkgLIB/plan_LIB.json',T+'/pkgLIB_'+X+'/plan_LIB.json');
 const e4=run([LIBDIR+'/e4_rebase.cjs','pkgLIB_'+X],{FB});if(!/stubs ok true/.test(e4)||/rebuild=strip false/.test(e4)||/MISMATCH/.test(e4))die('e4_rebase:\n'+e4);
 fs.cpSync(T+'/pkgLIB_'+X,OA,{recursive:true});
 console.log(e4.trim());console.log('PACKED '+files.length+' nodes from '+S+' into '+O+' (fetch-back '+path.basename(FB)+'); every stub rebuilds byte for byte.');
}finally{fs.rmSync(T,{recursive:true,force:true});}
