// pkgEKL test: Enforcer Build and Alt Judge Enforcer Build, pkgEKN (s61) vs pkgEKL, over every saved run.
// Bars: each K-W prompt differs only by the two pkgEKL passages (old text -> new text, each once); every other item and field byte-equal;
// passages render with plain apostrophes and the quoted "right: STANDS WITHOUT IT because ..." form.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const un=s=>s.replace(/\\'/g,"'").replace(/\\"/g,'"');const src=fs.readFileSync('pkgEKL/build_EKL.cjs','utf8');
const pick=k=>un(eval(src.match(new RegExp('const '+k+'=("(?:[^"\\\\]|\\\\.)*");'))[1]));const A1=pick('A1'),B1=pick('B1'),A2=pick('A2'),B2=pick('B2');
const txt=j=>{const b=j.body||(j.request&&j.request.body);if(!b)return '';const m=(typeof b==='string'?JSON.parse(b):b).messages;return m?m.map(x=>x.content).join('\n'):'';};
for(const [node,file,feeder,pat] of [['Enforcer Build','Enforcer_Build.js','Panel Cure Check',/^\d+_Enforcer_Build\.json$/],['Alt Judge Enforcer Build','Alt_Judge_Enforcer_Build.js','Alt Seated',/^\d+_Alt_Judge_Enforcer_Build\.json$/]]){
 const L=fs.readFileSync('pkgEKN/patched/'+file,'utf8'),P=fs.readFileSync('pkgEKL/patched/'+file,'utf8');let n=0,withKW=0,wrong=0;
 for(const R of fs.readdirSync(D).filter(f=>pat.test(f)).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(L,feeder);b=harness(R)(P,feeder);}catch(e){out.push('   '+node+' '+R+' skipped: '+String(e.message).slice(0,70));continue;}n++;
  if(a.length!==b.length){wrong++;out.push('   '+R+' item count differs');continue;}
  a.forEach((x,k)=>{const y=b[k];const ta=JSON.stringify(x.json),tb=JSON.stringify(y.json);if(ta===tb)return;
   const pa=txt(x.json),pb=txt(y.json);if(pb.split(B1).length!==2||pb.split(B2).length!==2){wrong++;out.push('   '+R+' item '+k+': passages not found once');return;}
   if(pb.replace(B1,A1).replace(B2,A2)!==pa){wrong++;out.push('   '+R+' item '+k+': prompt differs beyond the two passages');return;}
   const xa=JSON.parse(ta),xb=JSON.parse(tb);for(const z of [xa,xb]){delete z.body;delete z.request;}
   if(JSON.stringify(xa)!==JSON.stringify(xb)){wrong++;out.push('   '+R+' item '+k+': a field other than the prompt differs');return;}withKW++;});}
 T(n>=10,node+': replay ran on '+n+' runs');T(wrong===0&&withKW>0,node+': '+withKW+' K-W prompts differ only by the two passages; every other item byte-equal ('+wrong+' other differences)');
 T(un(P).includes(B1)&&un(P).includes(B2)&&/right: STANDS WITHOUT IT because <the side's own kept words, quoted>/.test(un(P)),node+': passages render with plain apostrophes and the right: form');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEKL/test_EKL.txt',out.join('\n')+'\n');
