// pkgEPS tests: the patched Judge Enforcer Record (and Alt) run in the harness on constructed inputs: one E-PREM id with its block, and a DeepSeek reply.
// Fixtures: 33311 gemini challenger premise 4 (DB row of debate_enforcer_log; [DR3] LINK 4 block verbatim from pkgRCT/fixture_33311_gemini.json),
// 33261 gemini S27 (premise 1) and S31 (premise 5) reasons verbatim from inputs/33261_Send_Back_Build.json (their blocks are checked in replay_EPS).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const FX=JSON.parse(fs.readFileSync('pkgRCT/fixture_33311_gemini.json','utf8'));const D=FX.DR3;const BLK4=D.slice(D.search(/LINK 4/),D.search(/## LINK 5/)).trim();
const BLK1L='LINK 9: SUPPORTED\n- [L1] Matthew 1:25: "And knew her not till she had brought forth her firstborn son."\n- [L4] So the link stands.';
const run=(dir,node,blk,reply,item)=>{const it=item||'premise listed against the challenger 4';const over={'Enforcer Record':[{json:{}}],'Alt Seated':[{json:{}}],
  [node.replace('Record','Build')]:[{json:{ids:[{id:'P1.1',rule:'E-PREM',seat:'gemini',grade:'PREMISE 4',item:it,flagged_line:'CHALLENGER CONCEDED LINKS: 0',response_line:'x',blk}],run_token:'t',model:'deepseek',body:{messages:[{},{content:'p'}]}}}],
  'CALL':[{json:{choices:[{message:{content:'ENFORCER: P1.1 -- DISAGREE -- RIGHT: '+reply}}]}}]};
 return harness('none',over)(fs.readFileSync('pkgEPS/'+dir+'/'+node.replace(/ /g,'_')+'.js','utf8'),'CALL')[0].json.enf428_rows[0].cure_reason;};
const R311='COUNTED -- "CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure" rules nothing on premise 4, yet the record\'s own answer keeps "the espousal stands before the taking," which still asserts the knowing within the espousal; premise 4 is UNEXHIBITED.';
const S27='COUNTED -- The press\'s "before they came together, she was found with child" with "synerchomai G4905 (cohabit conjugally)" is not answered by the challenger\'s spared "Premise 1."';
const S31='COUNTED -- The answer to Luke 1:35 "does not meet the pressed causal meaning," so premise 5 is COUNTED (UNEXHIBITED), not spared.';
for(const node of ['Judge Enforcer Record','Alt Judge Enforcer Record']){
 const T=(n,blk,r,exp,it)=>{const b=run('patched_base',node,blk,r,it),p=run('patched',node,blk,r,it),l=run('patched_live',node,blk,r,it);
  if(exp){t(node+': '+n+' HELD (TRIAL mark; LIVE not sent)',p.startsWith(b)&&/\(TRIAL pkgEPS: would not be sent: [^()]*\)$/.test(p)&&/^ENFORCER HELD \(pkgEPS, not sent;/.test(l),p.slice(-160)+' || '+l.slice(0,80));}
  else t(node+': '+n+' sent unchanged (TRIAL and LIVE)',p===b&&l===b,p.slice(-160));};
 T('33311 gemini challenger premise 4 (block [L1] [L2] [L3])',BLK4,R311,true);
 T('33261 S27 shape (fit ground, no layer named)',BLK4,S27,true,'premise listed against the challenger 1');
 T('33261 S31 shape ("does not meet the pressed causal meaning")',BLK4,S31,true,'premise listed against the challenger 5');
 T('N1 names a layer the block truly lacks: (UNEXHIBITED: lacks [L2])',BLK1L,'COUNTED -- (UNEXHIBITED: lacks [L2]) the block gives no word study.',false);
 T('N2 block shows one layer kind only',BLK1L,'COUNTED -- the answer does not meet the press.',false);
 T('N3 labelled (CONCEDED)',BLK4,'COUNTED -- (CONCEDED) "I drop the claim that the second ground alone proves it."',false);
 T('N4 names [L2] but the block has [L2]: still held',BLK4,'COUNTED -- (UNEXHIBITED: lacks [L2]) no word study.',true);
 T('N5 RIGHT SPARED is never held',BLK4,'SPARED -- the block exhibits its layers.',false);
 T('N6 no block for the premise: not held',''   ,'COUNTED -- no block answers this premise.',false);
 {const r=run('patched',node,BLK4,'COUNTED -- x',undefined);t(node+': N7 the TRIAL mark has no parentheses inside, so the send-back reason strips it',/\(TRIAL pkgEPS: [^()]*\)$/.test(r));}}
// send-back reason strip: the TRIAL mark is removed by Send Back Build's why() (copied from live s39)
{const L=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));const NS=(L.data||L).nodes;
 for(const sb of ['Send Back Build','Alt Send Back Build']){const c=NS.find(n=>n.name===sb).parameters.jsCode;const m=c.match(/const why=x=>[^\n]*?\.trim\(\);/);const why=new Function('return '+m[0].replace(/^const why=/,'').replace(/;$/,''))();
  const base='ENFORCER DISAGREE (right: COUNTED): x (judge wrote PREMISE 4; RECORD-ONLY TRIAL, ruling 428)';
  t(sb+': why() gives the same reason with and without the TRIAL mark',why({cure_reason:base})===why({cure_reason:base+' (TRIAL pkgEPS: would not be sent: the push counts the premise but names no layer the block lacks; the block exhibits [L1], [L2], [L3])'}));}}
// prompt: the new E-PREM paragraph is in both builds, in TRIAL and LIVE
for(const d of ['patched','patched_live'])for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js']){const s=fs.readFileSync('pkgEPS/'+d+'/'+f,'utf8');t(d+'/'+f+': prompt paragraph + block once per item',s.includes('RULE E-PREM, THE COUNTED KIND (pkgEPS)')&&s.includes("...(k===0?{blk:a?String(a.t).slice(0,8000):''}:{})"));}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
