// pkgKWI test: the three enforcer nodes of fetchback_live_s68 vs pkgKWI. Bars: (1) each patched source reverts to base byte-for-byte by removing
// the QUOTE FIRST passage; (2) on every saved run, each prompt holding RULE K-W differs from base only by that passage, and every other item and
// field is byte-equal; (3) the passage reaches the prompt intact (quotes and example). DeepSeek's answers can only be tested live.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s68.json','utf8'));const N=W.nodes||W.data.nodes;
const {A,A2,Q}=require('./kwi_text.cjs');
const base={};for(const n of ['Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'])base[n]=N.find(x=>x.name===n).parameters.jsCode;
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const TXS=require('./kwi_lib_subs.cjs').filter(x=>/^txt/.test(x[0]));const undo=s=>{s=s.split(A2).join(A);for(const [,a,b] of TXS)s=s.split(b).join(a);return s;};
for(const n of Object.keys(base)){const P=fs.readFileSync('pkgKWI/patched/'+n.replace(/ /g,'_')+'.js','utf8');
 T(P.split(A2).length===2&&undo(P)===base[n],n+': source = base plus the QUOTE FIRST passage, once, and the K-W six-word sentence');}
const plan=JSON.parse(fs.readFileSync('pkgKWI/plan_KWI.json','utf8'));for(const n of Object.keys(plan.prompt).filter(n=>!base[n])){const L=N.find(x=>x.name===n).parameters.jsCode,P=fs.readFileSync('pkgKWI/patched/'+n.replace(/[ ?]/g,'_')+'.js','utf8');T(P!==L&&undo(P)===L,n+': source = base plus the K-W six-word sentence only');}
const txt=j=>{const b=j.body||(j.request&&j.request.body);if(!b)return '';const m=(typeof b==='string'?JSON.parse(b):b).messages;return m?m.map(x=>x.content).join('\n'):'';};
for(const [node,feeder,pat] of [['Enforcer Build','Panel Cure Check',/^\d+_Enforcer_Build\.json$/],['Alt Judge Enforcer Build','Alt Seated',/^\d+_Alt_Judge_Enforcer_Build\.json$/]]){
 const L=base[node],P=fs.readFileSync('pkgKWI/patched/'+node.replace(/ /g,'_')+'.js','utf8');let n=0,withKW=0,wrong=0,intact=0;
 for(const R of fs.readdirSync(D).filter(f=>pat.test(f)).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(L,feeder);b=harness(R)(P,feeder);}catch(e){out.push('   '+node+' '+R+' skipped: '+String(e.message).slice(0,70));continue;}n++;
  if(a.length!==b.length){wrong++;out.push('   '+R+' item count differs');continue;}
  a.forEach((x,k)=>{const y=b[k];const ta=JSON.stringify(x.json),tb=JSON.stringify(y.json);if(ta===tb)return;
   const pa=txt(x.json),pb=txt(y.json);
   if(!(pa.includes('RULE K-W')||pa.includes('(K-W)'))||undo(pb)!==pa){wrong++;out.push('   '+R+' item '+k+': prompt differs beyond the passage');return;}
   if(pb.includes(Q)||!pa.includes('RULE K-W'))intact++;
   const xa=JSON.parse(ta),xb=JSON.parse(tb);for(const o of [xa,xb]){delete o.body;delete o.request;}
   if(JSON.stringify(xa)!==JSON.stringify(xb)){wrong++;out.push('   '+R+' item '+k+': a field other than the prompt differs');return;}withKW++;});}
 T(n>=10,node+': replay ran on '+n+' runs');T(wrong===0&&withKW>0&&intact===withKW,node+': '+withKW+' K-W prompts differ only by the passage, passage intact in '+intact+'; every other item byte-equal ('+wrong+' other differences)');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgKWI/test_KWI.txt',out.join('\n')+'\n');
