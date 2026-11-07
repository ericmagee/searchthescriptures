// pkgEPD tests: base = pkgETC/patched_on_pkgEPS_patched_live (EPS LIVE + ETC); LIVE = pkgEPD/patched_live; TRIAL = pkgEPD/patched. Harness as test_EPS.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const FX=JSON.parse(fs.readFileSync('pkgRCT/fixture_33311_gemini.json','utf8'));const D=FX.DR3;const BLK4=D.slice(D.search(/LINK 4/),D.search(/## LINK 5/)).trim();
const DROP='I drop the claim that the espousal alone proves the knowing before the taking.';const BLKD=BLK4+'\n'+DROP;
const DIRS={base:'pkgETC/patched_on_pkgEPS_patched_live',live:'pkgEPD/patched_live',trial:'pkgEPD/patched'};
const run=(dir,node,blk,reply,item)=>{const it=item||'premise listed against the challenger 4';const over={'Enforcer Record':[{json:{}}],'Alt Seated':[{json:{}}],
  [node.replace('Record','Build')]:[{json:{ids:[{id:'P1.1',rule:'E-PREM',seat:'gemini',grade:'PREMISE 4',item:it,flagged_line:'CHALLENGER CONCEDED LINKS: 0',response_line:'x',blk}],run_token:'t',model:'deepseek',body:{messages:[{},{content:'p'}]}}}],
  'CALL':[{json:{choices:[{message:{content:'ENFORCER: P1.1 -- DISAGREE -- RIGHT: '+reply}}]}}]};
 return harness('none',over)(fs.readFileSync(DIRS[dir]+'/'+node.replace(/ /g,'_')+'.js','utf8'),'CALL')[0].json.enf428_rows[0].cure_reason;};
const R311='COUNTED -- "CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure" rules nothing on premise 4, yet the record\'s own answer keeps "the espousal stands before the taking," which still asserts the knowing within the espousal; premise 4 is UNEXHIBITED.';
const S27='COUNTED -- The press\'s "before they came together, she was found with child" with "synerchomai G4905 (cohabit conjugally)" is not answered by the challenger\'s spared "Premise 1."';
const S31='COUNTED -- The answer to Luke 1:35 "does not meet the pressed causal meaning," so premise 5 is COUNTED (UNEXHIBITED), not spared.';
const Q='COUNTED -- The block says "'+DROP.replace(/\.$/,'')+'," so premise 4 is unexhibited.';
const HELD=/^ENFORCER HELD \(pkgEPS, not sent;/;
for(const node of ['Judge Enforcer Record','Alt Judge Enforcer Record']){
 const T=(n,blk,r,exp,it)=>{const b=run('base',node,blk,r,it),l=run('live',node,blk,r,it),p=run('trial',node,blk,r,it);
  if(exp==='lift')t(node+': '+n+' LIFTED: base held, LIVE sent as DISAGREE, TRIAL held with EPD note',HELD.test(b)&&/^ENFORCER DISAGREE/.test(l)&&HELD.test(p)&&/TRIAL pkgEPD would send/.test(p),b.slice(0,60)+' || '+l.slice(0,60)+' || '+p.slice(0,200));
  else t(node+': '+n+' unchanged in LIVE and TRIAL ('+(HELD.test(b)?'held':'sent')+')',l===b&&p===b,b.slice(0,90)+' || '+l.slice(0,90));};
 T('33311 P4 (no drop in block)',BLK4,R311,'same');
 T('33311 P4 reason against a block that has a drop sentence it does not quote',BLKD,R311,'same');
 T('33261 S27 shape',BLKD,S27,'same','premise listed against the challenger 1');
 T('33261 S31 shape',BLKD,S31,'same','premise listed against the challenger 5');
 T('E1 quotes the side drop sentence (7+ words)',BLKD,Q,'lift');
 T('E2 quotes exactly 6 consecutive words of the drop',BLKD,'COUNTED -- the side gave up "espousal alone proves the knowing before" here.','lift');
 T('N1 quotes only 5 consecutive words of the drop',BLKD,'COUNTED -- the side gave up "espousal alone proves the knowing" here.','same');
 T('N2 quotes 6+ words of a block sentence with no drop/withdraw/grant',BLKD,R311,'same');
 T('N3 ASSUMES route (no drop quoted) stays held',BLKD,'COUNTED -- no quoted row gives the assumed fact that the knowing fell within the espousal.','same');
 T('N4 labelled (CONCEDED) is sent as before',BLKD,'COUNTED -- (CONCEDED) "'+DROP+'"','same');
 T('E3 grant sentence quoted',BLK4+'\nI grant that the taking came after the dream of Matthew 1:20.','COUNTED -- the side says "I grant that the taking came after the dream," so premise 4 is unexhibited.','lift');}
console.log(ok+' OK, '+bad+' FAIL');
