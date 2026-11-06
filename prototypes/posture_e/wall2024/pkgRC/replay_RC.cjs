// pkgRC replay (W3 assignment: list every grade map that changes and every seat result). Run from wall2024/: node pkgRC/replay_RC.cjs
// 1. Grade maps: rcLines of pkgSBR (base) and pkgRC on every corpus text (texts.jsonl jtext) and every gate-applied text T1; each collision whose grade differs.
// 2. E-APPLY / E-GATE: gateItems2024 on every seat of every fixture (main and alt): derived fields, result, tag, trig, corrected text, gate items.
// 3. Whole Panel Cure Check node on each saved run: the full output (summary, bodies, fields), base against pkgRC.
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const {runNode}=require('../corpus/replay_node.cjs');
const lib=p=>{const AM=rd(p+'/patched/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {rcLines,gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw 0},null);};
const A=lib('pkgSBR'),Bk=lib('pkgRC');const out=[];const tally={};let texts=0,cols=0,unread=[];
const gm=(L,t)=>L.rcLines(t).col;
function cmp(tag,t){const a=gm(A,t),b=gm(Bk,t);texts++;cols+=b.length;b.forEach((z,i)=>{const y=a[i]||{};if(z.unread)unread.push(tag+' '+z.link+' '+z.unread+' :: '+z.raw.slice(0,160));if(y.grade!==z.grade){const k=(y.grade||'null')+' -> '+(z.grade||'null');tally[k]=(tally[k]||0)+1;out.push('  '+tag+' '+z.link+': '+k+(z.unread?' ('+z.unread+')':''));}});if(a.length!==b.length)out.push('  '+tag+' COUNT '+a.length+' -> '+b.length);}
for(const l of rd('corpus/texts.jsonl').split('\n').filter(Boolean)){const r=JSON.parse(l);cmp(r.run+' '+r.seat+' '+r.src+' '+r.tid,r.jtext||'');}
const G=[];let seats=0,gdiff=0;
for(const run of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f)).map(f=>f.slice(4,9)).sort()){const X0=JSON.parse(rd('corpus/fix_'+run+'.json'));
 for(const [panel,X] of [['main',X0],['alt',X0.alt]]){if(!X||!X.bodies)continue;for(const b of X.bodies){const its=(X.sb_items||[]).filter(x=>x.seat===b.seat&&x.rule!=='E-GATE');const J=(X.PB&&X.PB.judges||[]).find(q=>q.seat===b.seat);if(!its.length||!J)continue;seats++;
  cmp(run+' '+panel+' '+b.seat+' verdict_raw',b.verdict_raw);
  const run1=L=>{const PT=L.gatePromptText2024(J.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};const R=L.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx);const rep=(X.gate_replies||{})[b.seat];
   const c=R.items.length&&rep?L.gateCure2024(b.seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):null;
   return {R1:R.R1?{fields:R.R1.fields,result:R.R1.result,tag:R.R1.tag,trig:R.R1.trig,items:R.R1.items,applied:R.R1.applied}:null,T1:R.T1,items:R.items.map(i=>[i.kind,i.live,i.why]),uncured:c?c.uncured:null,cure:c?c.res.map(x=>[x.gid,x.cured,x.why]):null};};
  const a=run1(A),z=run1(Bk);if(z.T1)cmp(run+' '+panel+' '+b.seat+' T1',z.T1);
  const ka=JSON.stringify(a),kz=JSON.stringify(z);const tg=(a.R1&&a.R1.trig||[]).join('; ')!==(z.R1&&z.R1.trig||[]).join('; ');
  const ex={...a,R1:a.R1&&{...a.R1,trig:null}},ez={...z,R1:z.R1&&{...z.R1,trig:null}};const other=JSON.stringify(ex)!==JSON.stringify(ez);
  if(other)gdiff++;G.push(run+' '+panel+' '+b.seat+': '+(ka===kz?'identical':other?'DIFFERS (fields, result, text, items or cure)':'trig text only')+(tg?'\n     trig base:   '+(a.R1.trig||[]).join('; ')+'\n     trig pkgRC:  '+(z.R1.trig||[]).join('; '):'')+(z.R1?' | '+JSON.stringify(z.R1.fields)+' '+z.R1.result+' '+z.R1.tag:'')+' | uncured '+z.uncured);}}}
const N=[];for(const run of fs.readdirSync('corpus/raw').filter(f=>/^nodes_\d+\.json\.gz$/.test(f)).map(f=>f.slice(6,11)).sort()){let a,z;try{a=runNode('pkgSBR',run,'Panel_Cure_Check');z=runNode('pkgRC',run,'Panel_Cure_Check');}catch(e){N.push(run+': ERROR '+e.message);continue;}
 const strip=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);N.push(run+' Panel Cure Check: '+(strip(a)===strip(z)?'identical whole output':'DIFFERS'));}
console.log('1. GRADE MAPS (rcLines, base pkgSBR vs pkgRC): '+texts+' texts, '+cols+' collision lines');console.log('   transitions: '+JSON.stringify(tally));console.log('   unread collision lines under pkgRC: '+unread.length);unread.forEach(u=>console.log('     '+u));
console.log(out.join('\n'));console.log('\n2. E-APPLY / E-GATE per seat ('+seats+' seats with send-back items): '+gdiff+' differ beyond trig text');console.log(G.map(x=>'  '+x).join('\n'));
console.log('\n3. WHOLE NODE (Panel Cure Check, saved inputs):');console.log(N.map(x=>'  '+x).join('\n'));
