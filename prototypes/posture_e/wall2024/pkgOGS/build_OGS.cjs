// pkgOGS: the send-back of pkgOGR (W3 approved pkgOGR/PLAN.md; node names from W4, live ff8967bb fetch-back 22:30Z). Base: pkgOGR/patched 4d5d9ca
// (Build Synthesis) and the saved workflow (Failure Salvage). New nodes: C4G Build, C4G Extract (code); C4G Route and C4G Call <family> are
// copies W4 makes (see WIRING.md). Run from wall2024/: node pkgOGS/build_OGS.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgOGS/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'pkgOGR/patched 4d5d9ca + live ff8967bb',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const save=(f,s0,s,e,base)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base,base_sha:s0?sha(s0):null,final_sha:sha(s),edits:e});console.log(f.padEnd(26),s0?sha(s0):'(new)          ','->',sha(s));};
// C4G Build (new)
save('C4G_Build.js',null,fs.readFileSync('pkgOGS/src_C4G_Build.js','utf8'),0,'new');
// C4G Extract (new): C4 Extract's own reading run on the re-call reply ($('C4 Build') read as $('C4G Build')), then the better of the two rounds
const X0=fs.readFileSync('pkgOGR/patched/C4_Extract.js','utf8');const nB=X0.split("$('C4 Build')").length-1;if(nB!==1)throw new Error('C4 Extract reads C4 Build '+nB+' times');
const inner=X0.replace("$('C4 Build')","$('C4G Build')");
const XG="// pkgOGS C4G Extract: the Oracle's close round after the OPPONENT'S GRANTS send-back. A pass-through item (resend false) or a failed re-call\n"
 +"// keeps C4 Extract's round unchanged. Otherwise C4 Extract's own reading (below, unchanged but for its call source, C4G Build) reads the new\n"
 +"// reply, and the round kept is the one whose grants check has fewer faults (missing + misquoted, no section counted as all missing); on a tie the first.\n"
 +"const __X1=$('C4 Extract').first().json;const __G=$('C4G Build').first().json;const __in=$input.first().json||{};\n"
 +"const __keep=(why,second)=>[{json:{...__X1,grants_resend:{resent:!!(__G&&__G.resend),kept:'first',why,first_check:__X1.grants_check||null,second:second||null}}}];\n"
 +"if(!__G||!__G.resend)return __keep(__G&&__G.why||'no re-call');\n"
 +"if(__in.error)return __keep('the re-call failed: '+String(__in.error&&__in.error.message||__in.error).slice(0,200));\n"
 +"let __X2=null;try{__X2=(()=>{\n"+inner+"\n})()[0].json;}catch(x){return __keep('the re-call reply was not read: '+String(x&&x.message||x).slice(0,200));}\n"
 +"const __f=c=>!c||c.error||!c.applies?1e9:(c.missing||[]).length+(c.misquoted||[]).length;const __a=__f(__X1.grants_check),__b=__f(__X2.grants_check);\n"
 +"if(__b<__a)return [{json:{...__X2,grants_resend:{resent:true,kept:'second',why:'faults '+__a+' -> '+__b,first_check:__X1.grants_check||null,first_raw_chars:String(__X1.raw||'').length}}}];\n"
 +"return __keep('the re-call did not improve the section (faults '+__a+' -> '+__b+')',{grants_check:__X2.grants_check,raw_chars:String(__X2.raw||'').length});\n";
save('C4G_Extract.js',null,XG,0,'new');
// Build Synthesis reads the close round from C4G Extract
{const f='Build_Synthesis.js';const s0=fs.readFileSync('pkgOGR/patched/'+f,'utf8');save(f,s0,rep(s0,"const dr4=$('C4 Extract').first().json.labelled;","const dr4=$('C4G Extract').first().json.labelled; /* pkgOGS: the close round after the grants send-back */",f),1,'pkgOGR/patched');}
// Failure Salvage: the same, falling back to C4 Extract
{const f='Failure_Salvage.js';const s0=fs.readFileSync('pkgOGR/base/'+f,'utf8');save(f,s0,rep(s0,"challenger_r4:P('C4 Extract',j=>j.labelled)}","challenger_r4:P('C4G Extract',j=>j.labelled)||P('C4 Extract',j=>j.labelled)} /* pkgOGS */",f),1,'prewrite_kgw_7796fc67.json');}
fs.writeFileSync('pkgOGS/plan_OGS.json',JSON.stringify(plan,null,1));
