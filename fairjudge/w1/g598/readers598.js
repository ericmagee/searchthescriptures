const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));return j.data||j;};
const E=load('g590r/live_d819.json'),C=load('g590r/live_3132.json');
console.log('child has nodes named:',C.nodes.filter(n=>/^(Cure Check|Cure Normalize|Cure Build|Cure Call openrouter)$/.test(n.name)).map(n=>n.name));
function show(w,node,name,k=2){const n=w.nodes.find(x=>x.name===node);const s=JSON.stringify(n.parameters);let i=-1,c=0;while((i=s.indexOf(name,i+1))>=0&&c<k){console.log(' ['+node+'] …'+s.slice(Math.max(0,i-90),i+name.length+30)+'…');c++;}}
show(E,'D1 Call openrouter','Verdict Call openrouter',1);
show(E,'Panel Judges Prep','Cure Call openrouter',1);
show(E,'Alternate Pass Call','Cure Check',2);
show(E,'Enforcer Build','Cure Check',1);
show(C,'A379 Gate 06','Cure Check',1);
// exact quoted-name readers, any quoting, any form
const dead=['Build Independent Verdict','Extract Independent Verdict','Build Diagnostic Prompt','Extract Diagnostic','Diagnostic Judge Route','Diagnostic Call openrouter','Diagnostic Normalizer','Verdict Judge Route','Verdict Call openrouter','Verdict Normalizer','Cure Needed?','Cure Build','Cure Call openrouter','Cure Normalize','Cure Check','Anticheat Build','Anticheat Needed?','Anticheat Call openrouter','Anticheat Record','Anticheat Only?','FUM Needed? Cure','FUM Call Cure openrouter','FUM Merge Cure','SJ Re-ask?','SJ Re-ask Build','SJ Re-ask Call openrouter','SJ Re-ask Pick','Anticheat Resume'];
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const [lab,w] of [['eng',E],['child',C]]){const own=new Set(w.nodes.map(n=>n.name));console.log('\n==',lab);
 for(const d of dead){if(lab==='child'&&own.has(d)){console.log(d,'(child has its own node of this name)');continue;}
  const r=new RegExp("(\\\\?['\"`])"+esc(d)+"\\1");const hits=[];
  for(const n of w.nodes){if(lab==='eng'&&dead.includes(n.name))continue;if(r.test(JSON.stringify(n.parameters||{})))hits.push(n.name+(/code/i.test(n.type)?'':'{'+n.type.split('.').pop()+'}'));}
  if(hits.length)console.log(d,'<=',hits.join('; '));}}
