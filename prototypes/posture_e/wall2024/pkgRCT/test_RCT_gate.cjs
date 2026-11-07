// pkgRCT gate-answer stage: gateCure2024 (copied byte for byte with everything it uses) on the 33311 gemini fixture, item G12 (NOT APPLIED from S47).
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');const DIR=process.argv[2]||'pkgRCT/patched';const BDIR=DIR==='pkgRCT/patched'?'pkgRCT/base':DIR+'_base';
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const FX=JSON.parse(fs.readFileSync('pkgRCT/fixture_33311_gemini.json','utf8'));const RD={DR3:FX.DR3,CR3:'',CR1:'',DR1:'',CR2:'',DR2:'',CR4:'',DR4:''};
const ld=(d,node)=>new Function('$',closure(fs.readFileSync(d+'/'+node+'.js','utf8'),['gateCure2024']).text+';return gateCure2024;')(()=>{throw new Error('no node');});
const [to,why]=FX.G.G12;const S47='Premise 6: SPARED -- narrowed in [DR3] to paternal naming in obedience, dropping the claim that naming alone proves begetting, footed on [L1] Matthew 1:21 and [L3] Luke 1:62-63.';
const its=[{seat:'gemini',sid:'S47',rule:'E-STMT',item:'CHALLENGER premise 6 (test rule; the 33311 S47 rule is not in the DB rows read)',line:FX.flagged,ans:'CHANGE',to:S47,why:'test'}];
const G=[{gid:'G12',kind:'NOT APPLIED',src:'E-APPLY S47',sid:'S47',key:'NOT APPLIED|S47',why:'the change has no line label',lines:[FX.flagged],to:S47,live:true}];
const reply='GATE: G12 || CHANGE TO: '+to+' || '+why;
for(const node of ['Gate_Record','Alt_Gate_Record']){let b,p;try{b=ld(BDIR,node)('gemini',FX.raw,FX.F,its,G,reply,{R:RD,DL:[],ask:false});p=ld(DIR,node)('gemini',FX.raw,FX.F,its,G,reply,{R:RD,DL:[],ask:false});}catch(e){t(node+' runs',false,e.stack.split('\n').slice(0,3).join(' | '));continue;}
 const rb=b.res.find(r=>r.gid==='G12'),rp=p.res.find(r=>r.gid==='G12');
 t(node+' base: G12 applied and CURED; the count goes 0 to 1',rb.cured&&b.R2.R1.fields.challenger_conceded_links===1,JSON.stringify(rb));
 t(node+' patched: G12 refused by pkgRCT, CURED with the reason recorded (no seat removed), count stays 0',rp.cured&&/pkgRCT refused the gate change/.test(rp.why)&&p.R2.R1.fields.challenger_conceded_links===0&&p.uncured===b.uncured,JSON.stringify(rp)+' '+p.uncured);
 t(node+' patched: the refusal is recorded as a fresh RECORD-ONLY row',p.fresh.some(f=>/RECOUNTED AFTER CURE/.test(f.why)&&!f.by),JSON.stringify(p.fresh));}
console.log(ok+' OK, '+bad+' FAIL ('+DIR+')');process.exit(bad?1:0);
