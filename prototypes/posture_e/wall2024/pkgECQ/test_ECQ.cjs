// pkgECQ tests: Record base (pkgEAH/patched) vs ECQ LIVE and TRIAL, harness as test_EPS/test_EPD, with ids carrying blk and ecq_sides.
// Fixtures: 33371 rounds (pkgECQ/fixture_33371_rounds.json, read from the 33371 Panel Cure rounds via the saved Build input); rows 14645-14647 reasons verbatim
// (debate_enforcer_log); 33040 defender [CR3] (pkgEPS/fixture_eprem_rows.json) for the true own-drop control.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const BASE=process.env.BASE||'pkgEAH/patched',LV=process.env.LV||'pkgECQ/patched_live_on_pkgEAH_patched',TR=process.env.TR||'pkgECQ/patched_on_pkgEAH_patched';
const R=JSON.parse(fs.readFileSync('pkgECQ/fixture_33371_rounds.json','utf8'));const S371={D:[R.CR1,R.CR2,R.CR3,R.CR4].filter(Boolean).join('\n'),C:[R.DR1,R.DR2,R.DR3,R.DR4].filter(Boolean).join('\n')};
const F040=JSON.parse(fs.readFileSync('pkgEPS/fixture_eprem_rows.json','utf8')).find(z=>/33040/.test(z.run)&&/defender 6$/.test(z.item));const S040={D:F040.blk,C:''};
const FX=JSON.parse(fs.readFileSync('pkgRCT/fixture_33311_gemini.json','utf8'));const BLK4=FX.DR3.slice(FX.DR3.search(/LINK 4/),FX.DR3.search(/## LINK 5/)).trim();
const run=(dir,node,blk,reply,item,sides)=>{const over={'Enforcer Record':[{json:{}}],'Alt Seated':[{json:{}}],
  [node.replace('Record','Build')]:[{json:{ids:[{id:'P1.1',rule:'E-PREM',seat:'gemini',grade:'PREMISE 1',item,flagged_line:'CHALLENGER CONCEDED LINKS: 0',response_line:'x',blk,...(sides?{ecq_sides:sides}:{})}],run_token:'t',model:'deepseek',body:{messages:[{},{content:'p'}]}}}],
  'CALL':[{json:{choices:[{message:{content:'ENFORCER: P1.1 -- DISAGREE -- RIGHT: '+reply}}]}}]};
 return harness('none',over)(fs.readFileSync(dir+'/'+node.replace(/ /g,'_')+'.js','utf8'),'CALL')[0].json.enf428_rows[0].cure_reason;};
const W645='COUNTED -- (CONCEDED) The challenger\'s own words "I grant that \'till\' bounds the abstaining from the taking to the birth" give up the knowing within the espousal, while LINK 1 still says "Joseph knew Mary his wife within the espousal."';
const W646='COUNTED -- (CONCEDED) The line spares premise 1, but the challenger\'s grant "I grant that \'till\' bounds the abstaining from the taking to the birth" gives up "Joseph knew Mary his wife within the espousal."';
const W647='COUNTED -- (CONCEDED) The line spares premise 1, but the challenger\'s own grant "I grant that \'till\' bounds the abstaining from the taking to the birth" gives up what LINK 1 still asserts as "Joseph knew Mary his wife within the espousal."';
const C1='premise listed against the challenger 1',D1='premise listed against the defender 1';
for(const node of ['Judge Enforcer Record','Alt Judge Enforcer Record']){
 const T=(n,blk,r,item,sides,exp)=>{const b=run(BASE,node,blk,r,item,sides),l=run(LV,node,blk,r,item,sides),p=run(TR,node,blk,r,item,sides);
  if(exp==='hold')t(node+': '+n+' HELD (base sent; LIVE held; TRIAL sent with mark)',/^ENFORCER DISAGREE/.test(b)&&/^ENFORCER HELD \(pkgEPS, not sent;.* CONCEDED  quote is not the counted side own words/.test(l)&&p.startsWith(b)&&/\(TRIAL pkgECQ would hold: [^()]*\)$/.test(p),b.slice(0,50)+' || '+l.slice(0,200)+' || '+p.slice(-160));
  else t(node+': '+n+' unchanged in LIVE and TRIAL ('+(/^ENFORCER HELD/.test(b)?'held':'sent')+')',l===b&&p===b,b.slice(0,60)+' || '+l.slice(0,220));};
 T('33371 row 14645 (defender [CR2] grant quoted as the challenger\'s)',BLK4,W645,C1,S371,'hold');
 T('33371 row 14646',BLK4,W646,C1,S371,'hold');
 T('33371 row 14647',BLK4,W647,C1,S371,'hold');
 T('33371 14645 even with no block (the label check does not need blk)','',W645,C1,S371,'hold');
 T('N1 mirror: the same grant pushed against the DEFENDER, whose own words it is',BLK4,W645.replace("challenger's own","defender's own"),D1,S371,'same');
 T('N2 33371 true challenger give-up "I accept the span exactly as the press gives it"',BLK4,'COUNTED -- (CONCEDED) The challenger\'s own words "I accept the span exactly as the press gives it" give the premise up.',C1,S371,'same');
 T('N3 33040 sol: (CONCEDED) quoting the defender\'s own "I drop the claim that the flesh came through Mary\'s side"',BLK4,'COUNTED -- (CONCEDED) The defender says "I drop the claim that the flesh came through Mary\'s side," so premise 6 is not spared.','premise listed against the defender 6',S040,'same');
 T('N4 no ecq_sides (rounds not found): exempt as before',BLK4,W645,C1,null,'same');
 T('N5 unlabelled fit push (33261 S31 shape): EPS behaviour unchanged',BLK4,'COUNTED -- The answer to Luke 1:35 "does not meet the pressed causal meaning," so premise 5 is COUNTED (UNEXHIBITED), not spared.',C1,S371,'same');
 T('N6 SPARED push unchanged',BLK4,'SPARED -- the block exhibits its layers.',C1,S371,'same');}
{const L=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));const NS=(L.data||L).nodes;
 for(const sb of ['Send Back Build','Alt Send Back Build']){const c=NS.find(n=>n.name===sb).parameters.jsCode;const m=c.match(/const why=x=>[^\n]*?\.trim\(\);/);const why=new Function('return '+m[0].replace(/^const why=/,'').replace(/;$/,''))();
  const p=run(TR,'Judge Enforcer Record',BLK4,W645,C1,S371);const b=run(BASE,'Judge Enforcer Record',BLK4,W645,C1,S371);
  t(sb+': why() gives the same reason with and without the TRIAL pkgECQ mark',why({cure_reason:b})===why({cure_reason:p}));}}
for(const d of [LV,TR])for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js'])t(d+'/'+f+': ecq_sides once per Build item',/let __ecqSent=0;/.test(fs.readFileSync(d+'/'+f,'utf8'))&&/ecq_sides:\{D:/.test(fs.readFileSync(d+'/'+f,'utf8')));
console.log(ok+' OK, '+bad+' FAIL');
