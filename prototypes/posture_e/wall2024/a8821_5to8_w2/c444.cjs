// ASK 444 C1: the stubs pkgLIB/pack.cjs writes, old packer (pack_old.cjs) against new (pkgLIB/pack.cjs), on every live form 3 stub.
// Usage (from wall2024/): node a8821_5to8_w2/c444.cjs <acorn dir> <engine.json> <child.json>
// For each live stub (run line "\nreturn await new Function(", not the Shared Library, not the two Alternate Builds): rebuild its full
// source from its own workflow's Shared Library (pkgLIB/unpack.cjs rebuild), take its $() reads (pkgLIB/runner_model.cjs needs), and
// compose the stub with the packer's own STUBHEAD3 + REFLINE + STUBRUN3 text, extracted from the packer file. Reports per packer:
// comments in the composed stub (acorn), and equality with the live stub after the first line (the if(false){$(...)} read line) is
// set aside; the read line is compared on its own (the packer regenerates it from the full source; live stubs were edited in place).
const fs=require('fs'),crypto=require('crypto');const acorn=require(process.argv[2]);
const {rebuild}=require('../pkgLIB/unpack.cjs');const {needs}=require('../pkgLIB/runner_model.cjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
function packer(file){const t=fs.readFileSync(file,'utf8');
 const defs=t.slice(t.indexOf('const STUBHEAD='),t.indexOf("\nfs.mkdirSync('pkgLIB/patched'"));
 const a=t.indexOf('const REFS=');const ref=t.slice(a,t.indexOf(":'';",a)+4);
 return new Function('sha','RN','name',defs+'\n'+ref+'\nreturn STUBHEAD3(name)+REFLINE+STUBRUN3(name);');}
const cm=s=>{const c=[];acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,onComment:c});return c.length;};
const rest=s=>s.slice(s.indexOf('\nconst __LT='));const head=s=>s.startsWith('if(false){')?s.slice(0,s.indexOf('\n')):'';
const P={old:packer(__dirname+'/pack_old.cjs'),new:packer(__dirname+'/../pkgLIB/pack.cjs')};
const R={old:{c0:0,rest:0},new:{c0:0,rest:0}};let n=0,live0=0,readEq=0,readDiff=[];
for(const f of process.argv.slice(3)){const w=JSON.parse(fs.readFileSync(f,'utf8'));const nodes=w.nodes||w.workflow.nodes;
 const lib=nodes.find(x=>x.name==='Shared Library').parameters.jsCode;
 for(const x of nodes){const s=(x.parameters||{}).jsCode;if(typeof s!=='string'||x.name==='Shared Library'||!s.includes('\nreturn await new Function('))continue;
  if(x.name==='Alternate Build'||x.name==='Early Alternate Build')continue;n++;if(cm(s)===0)live0++;
  const RN=needs(rebuild(s,lib));
  for(const k of ['old','new']){const o=P[k](sha,RN,x.name);if(cm(o)===0)R[k].c0++;if(rest(o)===rest(s))R[k].rest++;}
  const nh=head(P.new(sha,RN,x.name)),lh=head(s);if(nh===lh)readEq++;else{
   const L=new Set((lh.match(/\$\("[^"]*"\)/g)||[])),N=new Set((nh.match(/\$\("[^"]*"\)/g)||[]));
   readDiff.push(f.split('/').pop()+' | '+x.name+' | all-nodes call in live: '+lh.includes('$(String())')+' | packer adds: '+[...N].filter(z=>!L.has(z)).join('')+' | packer drops: '+[...L].filter(z=>!N.has(z)).join(''));}}}
console.log('live form 3 stubs',n,'| live with 0 comments',live0);
for(const k of ['old','new'])console.log(k+' packer: 0 comments',R[k].c0+'/'+n,'| equal to live after the read line',R[k].rest+'/'+n);
console.log('read line equal',readEq+'/'+n);readDiff.forEach(d=>console.log('  '+d));
process.exit(R.new.c0===n&&R.new.rest===n&&R.old.c0===0?0:1);
