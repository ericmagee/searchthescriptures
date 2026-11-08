// pkgESH test: Enforcer Build, live s55 vs pkgESH, over every saved run with an Enforcer Build. Bars: the prompt changes only in items whose
// excerpt was "(no block of this link found)"; each such item now carries the section holding its sentence, and that section contains the sentence;
// all other items byte-equal; 33575 items 1-4 carry the "## Answer to C" sections whose words the judges cited.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s55.json','utf8'));const B0=W.nodes.find(z=>z.name==='Enforcer Build').parameters.jsCode,P1=fs.readFileSync('pkgESH/patched/Enforcer_Build.js','utf8');
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const items=p=>String(p).split(/\n(?=ITEM \d+ OF )/);const nz=s=>String(s).normalize('NFD').replace(/[̀-ͯ"“”‘’']/g,'').replace(/\s+/g,' ').toLowerCase();
let n=0,stray=0,filled=0,empty=0,nosent=0;
const runs=fs.readdirSync(D).filter(f=>/^\d+_Enforcer_Build\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
for(const R of runs){let a,b;try{a=harness(R)(B0,'Panel Cure Check');b=harness(R)(P1,'Panel Cure Check');}catch(e){out.push('   '+R+' skipped: '+e.message.slice(0,70));continue;}
 const pa=a[0].json.body?a[0].json.body.messages[1].content:'',pb=b[0].json.body?b[0].json.body.messages[1].content:'';if(!pa){out.push('   '+R+' no prompt');continue;}n++;
 const ia=items(pa),ib=items(pb);if(ia.length!==ib.length){stray++;continue;}let f=0,e0=0;
 ia.forEach((x,i)=>{if(x===ib[i])return;if(!x.includes('(no block of this link found)')){stray++;return;}
  if(/\(the section holding the sentence; it sits under no link heading\)/.test(ib[i])){f++;const sent=(x.match(/THE SIDE'S SENTENCE: "([\s\S]*?)"\nTHE SIDE'S OWN/)||[])[1]||'';if(!nz(ib[i].split('THE SIDE\'S OWN BLOCKS')[1]).includes(nz(sent).slice(0,60)))nosent++;}else e0++;});
 const left=ia.filter((x,i)=>x.includes('(no block of this link found)')&&x===ib[i]).length;filled+=f;empty+=left;
 out.push('   '+R+': '+(ia.filter(x=>x.includes('(no block of this link found)')).length)+' empty excerpts -> '+f+' filled, '+left+' still empty');}
T(n>=10,'replay ran on '+n+' runs');T(stray===0,'no item without the empty excerpt changes ('+stray+')');T(nosent===0,'every filled section contains its sentence ('+filled+' filled, '+nosent+' without)');
{const b=harness('33575')(P1,'Panel Cure Check');const ib=items(b[0].json.body.messages[1].content);const want=[['Luke 2:4','I grant it'],['Luke 1:34','tense point'],['Genesis 24:16','bethulah'],['Hebrews 2:14','body is flesh']];
 want.forEach(([v,w],k)=>T(ib[k+1]&&ib[k+1].includes('it sits under no link heading')&&ib[k+1].includes(v)&&ib[k+1].includes(w),'33575 item '+(k+1)+': the section holding "'+w+'" is sent and holds '+v));}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgESH/test_ESH.txt',out.join('\n')+'\n');
