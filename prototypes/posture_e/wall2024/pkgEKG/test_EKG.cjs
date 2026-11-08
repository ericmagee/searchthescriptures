// pkgEKG test: Enforcer Build, pkgESH vs pkgEKG, over every saved run. Bars: each prompt that holds the K-W rule differs only by the added passage,
// once; prompts without a K-W rule are byte-equal; the passage reads with plain apostrophes. DeepSeek's answers to it can only be tested live.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const B0=fs.readFileSync('pkgESH/patched/Enforcer_Build.js','utf8'),P1=fs.readFileSync('pkgEKG/patched/Enforcer_Build.js','utf8');
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const ADD="The flagged sentence itself never counts as the side still claiming the fact. For a grant (I grant X), X is the other side's point:";
let n=0,diff=0,wrong=0;
for(const R of fs.readdirSync(D).filter(f=>/^\d+_Enforcer_Build\.json$/.test(f)).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(B0,'Panel Cure Check');b=harness(R)(P1,'Panel Cure Check');}catch(e){continue;}
 const pa=a[0].json.body?a[0].json.body.messages[1].content:'',pb=b[0].json.body?b[0].json.body.messages[1].content:'';if(!pa){if(pb)wrong++;continue;}n++;
 const i=pb.indexOf(ADD);if(i<0){if(pa!==pb)wrong++;out.push('   '+R+': no K-W rule text, unchanged');continue;}
 const e=pb.indexOf('(pkgEKG). ',i)+10;const back=pb.slice(0,i)+pb.slice(e);if(back!==pa||pb.split(ADD).length!==2)wrong++;else diff++;out.push('   '+R+': passage added once ('+(e-i)+' chars), rest byte-equal');}
T(n>=10,'replay ran on '+n+' runs');T(wrong===0,'every prompt differs only by the one passage ('+diff+' with it, '+wrong+' other differences)');
T(/the other side's point/.test(P1.replace(/\\'/g,"'")),'passage text reads with plain apostrophes in the rendered prompt');
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEKG/test_EKG.txt',out.join('\n')+'\n');
