// pkgEKS test: Enforcer Build (s64) and Alt / R2 Alt Judge Enforcer Build (pkgRP10/patched) vs pkgEKS. Bars: (1) each patched source reverts to its base
// byte-for-byte by undoing the two passages; (2) on every saved run, each prompt holding RULE K-S3 differs from base only by the two passages, and every
// other item and field is byte-equal. DeepSeek's new answers can only be tested live. Live check: K-S3 rows with a NOT HELD answer get AGREE or
// DISAGREE, never NO ANSWER (33750 terra: 8 of 8 were NO ANSWER).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s64.json','utf8'));const N=W.nodes||W.data.nodes;
const A="A judge answers COUNTED, or TOUCHES NO LINK: <why>. Decide FIRST";
const A2="A judge answers in one of three forms, and all three are in the rule form: COUNTED; TOUCHES NO LINK: <why>; or NOT HELD: <why>, which says the flagged sentence is not a countable concession (it gives up nothing). Never write NO ANSWER because the judge wrote NOT HELD: grade it (pkgEKS). Decide FIRST";
const B="If it does, AGREE with COUNTED and DISAGREE with TOUCHES NO LINK; if it does not, the reverse.";
const B2="If it does, AGREE with COUNTED and DISAGREE with TOUCHES NO LINK or NOT HELD; if it does not, the reverse: DISAGREE with COUNTED, and AGREE with TOUCHES NO LINK or NOT HELD when its reason does not claim the sentence gives up a declared link or a listed premise (pkgEKS).";
const base={'Enforcer Build':N.find(n=>n.name==='Enforcer Build').parameters.jsCode,
 'Alt Judge Enforcer Build':fs.readFileSync('pkgRP10/patched/Alt_Judge_Enforcer_Build.js','utf8'),
 'R2 Alt Judge Enforcer Build':fs.readFileSync('pkgRP10/patched/R2_Alt_Judge_Enforcer_Build.js','utf8')};
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const undo=s=>s.split(A2).join(A).split(B2).join(B);
for(const n of Object.keys(base)){const P=fs.readFileSync('pkgEKS/patched/'+n.replace(/ /g,'_')+'.js','utf8');
 T(P.split(A2).length===2&&P.split(B2).length===2&&undo(P)===base[n],n+': source = base plus the two passages, once each');}
const txt=j=>{const b=j.body||(j.request&&j.request.body);if(!b)return '';const m=(typeof b==='string'?JSON.parse(b):b).messages;return m?m.map(x=>x.content).join('\n'):'';};
for(const [node,feeder,pat] of [['Enforcer Build','Panel Cure Check',/^\d+_Enforcer_Build\.json$/],['Alt Judge Enforcer Build','Alt Seated',/^\d+_Alt_Judge_Enforcer_Build\.json$/]]){
 const L=base[node],P=fs.readFileSync('pkgEKS/patched/'+node.replace(/ /g,'_')+'.js','utf8');let n=0,withKS3=0,wrong=0;
 for(const R of fs.readdirSync(D).filter(f=>pat.test(f)).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(L,feeder);b=harness(R)(P,feeder);}catch(e){out.push('   '+node+' '+R+' skipped: '+String(e.message).slice(0,70));continue;}n++;
  if(a.length!==b.length){wrong++;out.push('   '+R+' item count differs');continue;}
  a.forEach((x,k)=>{const y=b[k];const ta=JSON.stringify(x.json),tb=JSON.stringify(y.json);if(ta===tb)return;
   const pa=txt(x.json),pb=txt(y.json);
   if(!pa.includes('RULE K-S3')||undo(pb)!==pa){wrong++;out.push('   '+R+' item '+k+': prompt differs beyond the two passages');return;}
   const xa=JSON.parse(ta),xb=JSON.parse(tb);for(const o of [xa,xb]){delete o.body;delete o.request;}
   if(JSON.stringify(xa)!==JSON.stringify(xb)){wrong++;out.push('   '+R+' item '+k+': a field other than the prompt differs');return;}withKS3++;});}
 T(n>=10,node+': replay ran on '+n+' runs');T(wrong===0&&withKS3>0,node+': '+withKS3+' K-S3 prompts differ only by the two passages; every other item byte-equal ('+wrong+' other differences)');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEKS/test_EKS.txt',out.join('\n')+'\n');
