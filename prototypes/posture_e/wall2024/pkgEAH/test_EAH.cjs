// test_EAH: F 33311 fixture (verbatim CR3 blocks; rows 13300, 13301, 13305, 13310), N negatives, B Build replay and R Record replay on all saved runs
// (base pkgEAW/patched_on_pkgEPD vs pkgEAH/patched), every flip listed; 33345 rows 14031 and 14033 looked for by name.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
const ld=(f,ret)=>new Function(fs.readFileSync(__dirname+'/'+f,'utf8')+';return '+ret+';')();
const eawBlock=ld('../pkgEAW/eaw_build_lib.js','eawBlock'),eahHoldWhy=ld('eah_record_lib.js','eahHoldWhy');
let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const R={CR3:fs.readFileSync(__dirname+'/../pkgEAW/fixture_33311_CR3.txt','utf8')};
for(const [id,v,a,why,exp] of [[13300,'Matthew 1:20','I grant the address and the ground.','"I grant the address and the ground" is a bare grant.',true],[13305,'Matthew 1:20','I grant the address and the ground.','"I grant the address and the ground" is a bare grant.',true],[13310,'Matthew 1:20','I grant the address and the ground.','"I grant the address and the ground" is a bare grant.',true],
 [13301,'Luke 1:35','I grant that kaleō is in both verses.','"I grant that kaleō is in both verses" is a bare grant.',true]]){const b=eawBlock(R,['CR3'],v,a);const h=b?eahHoldWhy(why,[b.t]):null;T(!!h===exp,'F '+id+' '+v+' -> '+(h||'sent'));}
{const NR='Luke 2:4 "because he was of the house and lineage of David" The press: x.\n- I grant it.';T(!eahHoldWhy('"I grant it." is a bare grant with no fit of its own.',[NR]),'N1 a truly bare "I grant it." is still sent');
 const b=eawBlock(R,['CR3'],'Matthew 1:20','I grant the address');T(!eahHoldWhy('The collision line rests on an absence.',[b.t]),'N2 a BROKEN reason that names no bare grant is still sent');
 T(!eahHoldWhy('"I grant the address and the ground" is a bare grant.',[]),'N3 no block given: still sent');
 T(!!eahHoldWhy('"I grant the address and the ground." is a bare grant with no fit of its own.',[b.t]),'F the 33345 wording ("is a bare grant with no fit of its own") is read');}
const D='/mnt/project-files/wall2024/inputs/';const runs=fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Record\.json$/.test(f)&&!/_Alt_/.test(f)).map(f=>f.split('_')[0]).sort();
const f=n=>n.replace(/ /g,'_')+'.js';const code=(dir,n)=>fs.readFileSync(__dirname+'/'+dir+'/'+f(n),'utf8');const flips=[];let nH=0,nB=0;
for(const RUN of runs)for(const [bn,bi,rn,ri] of [['Judge Enforcer Build','Enforcer Record','Judge Enforcer Record','Judge Enforcer Call deepseek'],['Alt Judge Enforcer Build','Alt Seated','Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek']]){
 let b0,b1;try{b0=harness(RUN)(code('../pkgEAW/patched_on_pkgEPD',bn),bi);b1=harness(RUN)(code('patched',bn),bi);}catch(e){T(false,'B '+RUN+' '+bn+' threw '+e.message);continue;}
 const J0=b0.map(x=>JSON.parse(JSON.stringify(x.json))),J1=b1.map(x=>JSON.parse(JSON.stringify(x.json)));const I0=J0.flatMap(j=>j.ids||[]),I1=J1.flatMap(j=>j.ids||[]);let idsOk=I0.length===I1.length,h=0,hb=0;const BLK={};
 I0.forEach((x,k)=>{const y={...(I1[k]||{})};if(x.rule==='E-HOLD'){h++;if(Array.isArray(y.eah_blk)){hb++;BLK[x.id]=y.eah_blk;}}delete y.eah_blk;if(JSON.stringify(x)!==JSON.stringify(y))idsOk=false;});nH+=h;nB+=hb;
 const secs=J=>{const o={};for(const j of J){const p=j.body&&j.body.messages?j.body.messages[1].content:'';p.split(/\n\n(?=ITEM )/).slice(1).forEach(q=>{o[q.split('\n')[0]]=q;});}return o;};
 const S0=secs(J0),S1=secs(J1);const strip=s=>s.replace(/\n  THE ANSWER IN FULL, FROM \[[^\]]*\] \(every line under that pressed verse[^)]*\): "[\s\S]*?"(?=\n- (?:\(the |\(UNPROVEN|ANSWER CHECK)|\nTHIS IS A LINK-STATE|$)/g,'');let txtOk=Object.keys(S0).length===Object.keys(S1).length;for(const k of Object.keys(S0))if(strip(S1[k]||'')!==S0[k])txtOk=false;
 const nc0=(J0[0]||{}).not_checked||[],nc1=(J1[0]||{}).not_checked||[];const rule=J1[0]&&J1[0].body?J1[0].body.messages.map(m=>m.content).join(''):'';
 T(idsOk&&txtOk&&nc0.length===nc1.length&&(!rule||/an opening grant followed by a layer that shows the fit is not a bare grant/.test(rule)),'B '+RUN+' '+bn+': calls '+J0.length+' -> '+J1.length+', not checked '+nc0.length+' -> '+nc1.length+'; E-HOLD items '+h+', with a full answer '+hb+'; ids equal apart from eah_blk; items equal apart from IN FULL lines; rule present');
 const b0x=b0.map(x=>({json:{...x.json,ids:(x.json.ids||[]).map(y=>BLK[y.id]?{...y,eah_blk:BLK[y.id]}:y)}}));
 let r0,r1;try{r0=harness(RUN,{[bn]:b0})(code('../pkgEAW/patched_on_pkgEPD',rn),ri);r1=harness(RUN,{[bn]:b0x})(code('patched',rn),ri);}catch(e){T(false,'R '+RUN+' '+rn+' threw '+e.message);continue;}
 const A=r0[0].json.enf428_rows||[],C=r1[0].json.enf428_rows||[];let same=A.length===C.length,n=0;
 A.forEach((x,i)=>{const y=C[i];if(JSON.stringify({...x,at:0})===JSON.stringify({...y,at:0}))return;n++;const okf=/^ENFORCER HELD \(pkgEAH, not sent/.test(y.cure_reason)&&/^ENFORCER DISAGREE \(right: BROKEN\)/.test(x.cure_reason)&&x.rule==='E-HOLD'&&JSON.stringify({...x,at:0,cure_reason:0})===JSON.stringify({...y,at:0,cure_reason:0});if(!okf)same=false;flips.push(RUN+' '+y.seat+' '+y.item+' :: '+y.cure_reason.slice(0,300));});
 T(same,'R '+RUN+' '+rn+': '+A.length+' rows, '+n+' HELD by pkgEAH, nothing else changed');}
T(flips.some(x=>/^33345 chatgpt COLLISION D3 vs C5/.test(x)),'F 33345 row 14031 (chatgpt D3 vs C5, "I grant the voice.") is HELD in the replay');
T(!flips.some(x=>/^33345 chatgpt COLLISION D5 vs C1/.test(x)),'F 33345 row 14033 (chatgpt D5 vs C1) is still sent: its full answer is "I grant it. Matthew 1:20 says thou son of David.", 6 words and no layer after the grant');
console.log('\nE-HOLD items '+nH+', with a full answer '+nB+'\nFLIPS ('+flips.length+'):\n'+flips.join('\n'));console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
