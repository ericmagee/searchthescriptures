// pkgRP10 (reader phase 2, item 10, W4): the E-COL FORCED/collision reads in the three Judge Enforcer Build nodes
// (__ecfColl, __ecpK, __ecpOf, and the FORCED label test on the item grade/req) ask the shared reader first; a line the reader
// refuses, or a RESTATED wrapper, keeps the old read. Run from wall2024/: node pkgRP10/build_RP10.cjs [fetchback, default s63]
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(String(s)).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s63.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
const node=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const SBB=node('Send Back Build');const i=SBB.indexOf('const __RL=');const END='return module.exports;})();';const j=SBB.indexOf(END,i)+END.length;
if(i<0||j<END.length)throw new Error('reader block not found in Send Back Build');const RL=SBB.slice(i,j);
const HEAD='/* pkgRP10 (reader phase 2 item 10, W4): the shared reader (the same embedded text Send Back Build carries, pkgSBX/pkgACM) reads the FORCED and collision lines of E-COL; a refused or RESTATED line keeps the old read */\n'+RL+'\n'
 +"const __rp10=l=>{try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form&&!(r.f&&r.f.restated)?r:null;}catch(e){return null;}};\n"
 +"const __rp10F=l=>{const r=__rp10(l);return r?r.form==='FORCED':/^FORCED/.test(l);};\n";
const REPL=[
 ['const CG=[];\n',HEAD+'const CG=[];\n'],
 ['const __ecfColl=l=>/^FORCED','const __ecfColl0=l=>/^FORCED'],
 ['/* pkgECF (A2): the FORCED and LINK BROKEN lines',"const __ecfColl=l=>{const r=__rp10(l);if(r&&r.form==='FORCED')return true;if(r&&r.form==='COLLISION')return /LINK BROKEN/.test(String(r.f.grade||''));return __ecfColl0(l);}; /* pkgRP10 */\n/* pkgECF (A2): the FORCED and LINK BROKEN lines"],
 ["const __ecpK=s=>{const m=","const __ecpK0=s=>{const m="],
 ["const __ecpOf=g=>{if(/^FORCED/.test(g.line))return [];","const __ecpK=s=>{const r=__rp10(s);if(r&&(r.form==='FORCED'||r.form==='COLLISION')&&r.f.pair)return String(r.f.pair).toUpperCase();return __ecpK0(s);}; /* pkgRP10 */\nconst __ecpOf=g=>{if(__rp10F(g.line))return [];"],
 ["CG.filter(x=>x!==g&&/^FORCED/.test(x.line)&&","CG.filter(x=>x!==g&&__rp10F(x.line)&&"],
 ["grade:/^FORCED/.test(g.line)?'FORCED':'LINK BROKEN'","grade:__rp10F(g.line)?'FORCED':'LINK BROKEN'"],
 ["req:/^FORCED/.test(g.line)});}","req:__rp10F(g.line)});}"]];
const plan={base:F,base_versionId:W.versionId,reader_from:'Send Back Build '+sha(SBB)+' (reader block sha '+sha(RL)+')',nodes:{}};fs.mkdirSync('pkgRP10/patched',{recursive:true});
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){let c=node(n);const b=sha(c);
 if(c.includes('const __RL='))throw new Error(n+' already has a reader');
 for(const [a,z] of REPL){const k=c.split(a).length-1;if(k!==1)throw new Error(n+': anchor x'+k+': '+a.slice(0,60));c=c.replace(a,()=>z);}
 const AF=Object.getPrototypeOf(async function(){}).constructor;new AF(c);
 fs.writeFileSync('pkgRP10/patched/'+n.replace(/ /g,'_')+'.js',c);plan.nodes[n]={base:b,patched:sha(c)};}
fs.writeFileSync('pkgRP10/plan_RP10.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan,null,1));
