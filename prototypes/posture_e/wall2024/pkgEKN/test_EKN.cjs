// pkgEKN test: Enforcer Build and Alt Judge Enforcer Build, live s60 vs pkgEKN, over every saved run. Bars: each prompt holding RULE K-W differs from live
// only by the two pkgEKN passages (each once); every other item and field is byte-equal; the passages render with plain apostrophes.
// DeepSeek's new answers can only be tested live. Live check: K-W rows with a NOT HELD answer get AGREE or DISAGREE, never NO ANSWER.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s60.json','utf8'));const N=W.nodes||W.data.nodes;const live=n=>N.find(x=>x.name===n).parameters.jsCode;
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const A1="A judge answers STANDS WITHOUT IT because <a layer>, or CONCEDED. ",A2="A judge answers in one of four forms, and all four are in the rule's form: STANDS WITHOUT IT because <a layer>; CONCEDED; REASSERTED IN <round> \"<quote>\"; or NOT HELD with a reason. Never write NO ANSWER because the judge wrote NOT HELD or REASSERTED: grade it (pkgEKN). ";
const B1="read the meaning the side shows.\n",B2s="read the meaning the side shows. NOT HELD says the flagged sentence gives up no footing this link needs.",B2e="DISAGREE when they do not (pkgEKN).\n";
const txt=j=>{const b=j.body||(j.request&&j.request.body);if(!b)return '';const m=(typeof b==='string'?JSON.parse(b):b).messages;return m?m.map(x=>x.content).join('\n'):'';};
for(const [node,file,feeder,pat] of [['Enforcer Build','Enforcer_Build.js','Panel Cure Check',/^\d+_Enforcer_Build\.json$/],['Alt Judge Enforcer Build','Alt_Judge_Enforcer_Build.js','Alt Seated',/^\d+_Alt_Judge_Enforcer_Build\.json$/]]){
 const L=live(node),P=fs.readFileSync('pkgEKN/patched/'+file,'utf8');let n=0,withKW=0,wrong=0;
 for(const R of fs.readdirSync(D).filter(f=>pat.test(f)).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(L,feeder);b=harness(R)(P,feeder);}catch(e){out.push('   '+node+' '+R+' skipped: '+String(e.message).slice(0,70));continue;}n++;
  if(a.length!==b.length){wrong++;out.push('   '+R+' item count differs');continue;}
  a.forEach((x,k)=>{const y=b[k];const ta=JSON.stringify(x.json),tb=JSON.stringify(y.json);if(ta===tb)return;
   let s=tb;const pa=txt(x.json),pb=txt(y.json);
   if(!pa.includes('RULE K-W')||pb.split(A2).length!==2||pb.split(B2s).length!==2){wrong++;out.push('   '+R+' item '+k+': differs outside K-W');return;}
   const i=pb.indexOf(B2s)+'read the meaning the side shows.'.length,e=pb.indexOf(B2e,i)+B2e.length;const back=pb.replace(A2,A1).slice(0,i)+'\n'+pb.slice(e);
   const bk=pb.replace(A2,A1);const j=bk.indexOf(B2s)+'read the meaning the side shows.'.length,e2=bk.indexOf(B2e,j)+B2e.length;const back2=bk.slice(0,j)+'\n'+bk.slice(e2);
   if(back2!==pa){wrong++;out.push('   '+R+' item '+k+': prompt differs beyond the two passages');return;}
   const xa=JSON.parse(ta),xb=JSON.parse(tb);delete xa.body;delete xb.body;if(xa.request)delete xa.request;if(xb.request)delete xb.request;
   if(JSON.stringify(xa)!==JSON.stringify(xb)){wrong++;out.push('   '+R+' item '+k+': a field other than the prompt differs');return;}withKW++;});}
 T(n>=10,node+': replay ran on '+n+' runs');T(wrong===0&&withKW>0,node+': '+withKW+' K-W prompts differ only by the two passages; every other item byte-equal ('+wrong+' other differences)');
 T(P.replace(/\\'/g,"'").includes(A2.trim())&&P.replace(/\\'/g,"'").includes("or the side's own words it quotes"),node+': passages render with plain apostrophes');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEKN/test_EKN.txt',out.join('\n')+'\n');
