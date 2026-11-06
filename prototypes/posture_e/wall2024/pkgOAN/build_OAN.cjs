// pkgOAN (W3 33160 grade, build 2): the Oracle's link round [DR3] quotes and answers the MEANS of every press of the list that closes [CR3],
// checked by code, with one re-call on the pkgOGS pattern. Base: live 98daac9e (W4's fetch-back /mnt/project-files/wall2024/fetchback_98daac9e.json,
// copied to pkgOAN/base/ by pkgOAN/base/README). Run from wall2024/: node pkgOAN/build_OAN.cjs
//  C3 Build: the THE DEFENDER'S PRESSES ON YOUR LINKS block (OAN.block) on the last user message; presses on the item.
//  C3 Extract: presses (harvested again from [CR3]) and press_check (OAN.check on its own raw).
//  C3G Build, C3G Extract (new); C3G Route and 7 C3G Call copies are W4's (WIRING.md).
//  Every reader of the [DR3] round reads C3G Extract: Build Synthesis, Failure Salvage (falling back to C3 Extract), D4 Build, D4 Extract,
//  C4 Build, C4 Extract, C4G Extract, D4 Words Plan; D4 Verse Sheet's url expression is W4's edit.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgOAN/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live 98daac9e (fetchback_98daac9e.json)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const all=(s,a,b,f,n)=>{const k=s.split(a).length-1;if(k!==n)throw new Error(f+': '+a+' found '+k+', expected '+n);return s.split(a).join(b);};
const rd=f=>fs.readFileSync('pkgOAN/base/'+f,'utf8');const LIB=fs.readFileSync('pkgOAN/src_OAN.js','utf8');
const save=(f,s0,s,e)=>{new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:s0?sha(s0):null,final_sha:sha(s),edits:e});console.log(f.padEnd(24),s0?sha(s0):'(new)           ','->',sha(s));};
const C3R="$('C3 Extract')",C3G="$('C3G Extract')";
// C3 Build
{const f='C3_Build.js',s0=rd(f);const a="return [{json:{run_token:TOK,round:'C3',call:call(R.challenger,sys,__ZH('C','2',R.challenger,msgs))}}];";
 const b=LIB+"\nlet __presses=[];try{__presses=OAN.harvest($('D3 Extract').first().json.raw);const __ob=OAN.block(__presses);if(__ob){for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\\n\\n'+__ob};break;}}}}catch(e){__presses=[];} /* pkgOAN */\n"
  +"return [{json:{run_token:TOK,round:'C3',presses:__presses,call:call(R.challenger,sys,__ZH('C','2',R.challenger,msgs))}}];";
 save(f,s0,rep(s0,a,b,f),1);}
// C3 Extract
const X0=rd('C3_Extract.js');let X1;
{const f='C3_Extract.js';const a="return [{json:{run_token:TOK,round:'C3',raw,round_fix:__RFX,labelled,link_format,usage:e.u,fam:B.fam,model:B.model,cache_diag:e.cd,msg_id:e.id,...__SP}}];";
 const b=LIB+"\nlet presses=[],press_check=null;try{presses=OAN.harvest($('D3 Extract').first().json.raw);press_check=OAN.check(raw,presses);}catch(x){press_check={error:String(x&&x.message||x).slice(0,200)};} /* pkgOAN: record of the [DR3] press answers */\n"
  +"return [{json:{run_token:TOK,round:'C3',raw,round_fix:__RFX,labelled,link_format,usage:e.u,fam:B.fam,model:B.model,cache_diag:e.cd,msg_id:e.id,...__SP,presses,press_check}}];";
 X1=rep(X0,a,b,f);save(f,X0,X1,1);}
// C3G Build (new)
save('C3G_Build.js',null,fs.readFileSync('pkgOAN/src_C3G_Build.js','utf8'),0);
// C3G Extract (new): C3 Extract's own reading on the re-call reply ($('C3 Build') read as $('C3G Build')), then the round with fewer faults
{const nB=X1.split("$('C3 Build')").length-1;if(nB!==1)throw new Error('C3 Extract reads C3 Build '+nB+' times');const inner=X1.replace("$('C3 Build')","$('C3G Build')");
 const XG="// pkgOAN C3G Extract: the Oracle's link round after the PRESS CHECK send-back. A pass-through item (resend false) or a failed re-call\n"
 +"// keeps C3 Extract's round unchanged. Otherwise C3 Extract's own reading (below, unchanged but for its call source, C3G Build) reads the new\n"
 +"// reply, and the round kept is the one whose press check has fewer faults (missing + unanswered); on a tie the first.\n"
 +"const __X1=$('C3 Extract').first().json;const __G=$('C3G Build').first().json;const __in=$input.first().json||{};\n"
 +"const __keep=(why,second)=>[{json:{...__X1,press_resend:{resent:!!(__G&&__G.resend),kept:'first',why,first_check:__X1.press_check||null,second:second||null}}}];\n"
 +"if(!__G||!__G.resend)return __keep(__G&&__G.why||'no re-call');\n"
 +"if(__in.error)return __keep('the re-call failed: '+String(__in.error&&__in.error.message||__in.error).slice(0,200));\n"
 +"let __X2=null;try{__X2=(()=>{\n"+inner+"\n})()[0].json;}catch(x){return __keep('the re-call reply was not read: '+String(x&&x.message||x).slice(0,200));}\n"
 +"const __f=c=>!c||c.error||!c.applies?1e9:(c.missing||[]).length+(c.unanswered||[]).length;const __a=__f(__X1.press_check),__b=__f(__X2.press_check);\n"
 +"if(__b<__a)return [{json:{...__X2,press_resend:{resent:true,kept:'second',why:'faults '+__a+' -> '+__b,first_check:__X1.press_check||null,first_raw_chars:String(__X1.raw||'').length}}}];\n"
 +"return __keep('the re-call did not improve the answers (faults '+__a+' -> '+__b+')',{press_check:__X2.press_check,raw_chars:String(__X2.raw||'').length});\n";
 save('C3G_Extract.js',null,XG,0);}
// readers of [DR3]
for(const [f,n] of [['Build_Synthesis.js',1],['D4_Build.js',5],['D4_Extract.js',2],['C4_Build.js',2],['C4_Extract.js',2],['C4G_Extract.js',2],['D4_Words_Plan.js',1]]){const s0=rd(f);save(f,s0,all(s0,C3R,C3G,f,n),n);}
{const f='Failure_Salvage.js',s0=rd(f);let s=rep(s0,"challenger_r3:P('C3 Extract',j=>j.labelled)","challenger_r3:P('C3G Extract',j=>j.labelled)||P('C3 Extract',j=>j.labelled) /* pkgOAN */",f);
 s=rep(s,"const t=P(r+' Extract',j=>j.raw);","const t=(r==='C3'?P('C3G Extract',j=>j.raw):null)||P(r+' Extract',j=>j.raw); /* pkgOAN */",f);save(f,s0,s,2);}
fs.writeFileSync('pkgOAN/plan_OAN.json',JSON.stringify(plan,null,1));
