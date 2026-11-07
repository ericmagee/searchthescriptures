// pkgEPS replay over every stored E-PREM "ENFORCER DISAGREE (right: COUNTED)" row in debate_enforcer_log (114 rows, all runs; fixture_eprem_rows.json,
// from the DB joined to debate_results: defender premises read in engine_r3 = [CR3], challenger premises in challenger_r3 = [DR3]).
// The block is found with lbBlockText (copied byte for byte from live Send Back Build, as pkgEPK reads it); the hold is epsHold's test, run with the
// patched Record's own lbFoot and unxLack (copied byte for byte from pkgEPS/patched/Judge_Enforcer_Record.js). Lists every flip with its class.
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');
const L=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));const SBB=(L.data||L).nodes.find(n=>n.name==='Send Back Build').parameters.jsCode;
const {lbBlockText}=new Function(closure(SBB,['lbBlockText']).text+';return {lbBlockText};')();
const REC=fs.readFileSync('pkgEPS/patched/Judge_Enforcer_Record.js','utf8');const {lbFoot,unxLack}=new Function(closure(REC,['lbFoot','unxLack']).text+';return {lbFoot,unxLack};')();
const rows=JSON.parse(fs.readFileSync('pkgEPS/fixture_eprem_rows.json','utf8'));const out=[];const cls={};
for(const r of rows){const n=+(String(r.item).match(/(\d+)\s*$/)||[])[1];const why=String(r.cr).replace(/^ENFORCER DISAGREE \(right: COUNTED\):\s*/,'');
 let blk='';try{blk=lbBlockText(r.blk||'',n)||'';}catch(e){blk='';}const k=blk?lbFoot(blk,true):[];
 const conc=/^\s*\(\s*CONCEDED\b/i.test(why);const named=unxLack(why,k);const hold=!!blk&&!conc&&k.length>=2&&!named.missing.length;
 const c=!blk?'no block found: sent':k.length<2?'block <2 layer kinds: sent':named.missing.length?'names a missing layer: sent':'HELD';cls[c]=(cls[c]||0)+1;
 out.push({run:r.run.replace(/^ODV1-|-.*$/g,''),seat:r.seat,item:r.item,kinds:k.join(','),hold,cls:c,why:why.slice(0,220)});}
for(const x of out)console.log((x.hold?'HELD ':'sent ')+x.run+' '+x.seat.padEnd(8)+' '+x.item.padEnd(40)+' ['+x.kinds+'] '+x.cls+' | '+x.why);
console.log(JSON.stringify(cls));fs.writeFileSync('pkgEPS/replay_db_EPS.json',JSON.stringify(out,null,1));
