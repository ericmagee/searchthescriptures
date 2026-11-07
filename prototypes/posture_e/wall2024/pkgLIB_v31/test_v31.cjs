// pkgLIB v3.1 = v3 + pkgV18 (Extract Independent Verdict). Library identical to v3 (json_sha 2bcad7830caf42c0); only that stub changes.
// Checks: the stub rebuilds the stripped pkgV18 source byte for byte; on every recent saved run it gives the same output as the UNSTRIPPED pkgV18 source.
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const rd=f=>fs.readFileSync(f,'utf8');const D='/mnt/project-files/wall2024/inputs/';
const N='Extract_Independent_Verdict.js';const LIB=rd('pkgLIB_v31/patched/Shared_Library.js');let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK   ':'FAIL ')+n);c?ok++:bad++;};
T('library identical to v3',LIB===rd('pkgLIB/patched/Shared_Library.js'));
T('only the Extract Independent Verdict stub differs from v3',fs.readdirSync('pkgLIB/patched').every(f=>f===N||rd('pkgLIB/patched/'+f)===rd('pkgLIB_v31/patched/'+f)));
T('the stub rebuilds the stripped pkgV18 source byte for byte',rebuild(rd('pkgLIB_v31/patched/'+N),LIB)===rd('pkgLIB/strip_V18/patched/'+N));
const IN=feeder('/mnt/project-files/wall2024/fetchback_live_s45.json','Extract Independent Verdict')[0];
const stub='const __LIBTXT='+JSON.stringify(LIB)+';\n'+rd('pkgLIB_v31/patched/'+N).split("$('Shared Library').params.jsCode").join('__LIBTXT');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33[2-9]\d\d_/.test(f)).map(f=>f.slice(0,5)))].sort();
(async()=>{let n=0,s=0;for(const R of runs){const g=async src=>{try{return 'OUT '+JSON.stringify(await harness(R)('return (async()=>{'+src+'\n})()',IN));}catch(e){return 'ERR '+String(e.message||e);}};
 const a=await g(rd('pkgV18/patched/'+N)),b=await g(stub);n++;if(a===b)s++;else console.log('DIFF '+R);}
 T('recent runs: stub = unstripped pkgV18 source on '+s+' of '+n,s===n);console.log(ok+' OK, '+bad+' FAIL');})();
