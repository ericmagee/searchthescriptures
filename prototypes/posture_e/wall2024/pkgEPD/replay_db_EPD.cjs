// pkgEPD replay over the 114 stored E-PREM COUNTED rows (pkgEPS/fixture_eprem_rows.json). Same block finder as replay_db_EPS (lbBlockText from live
// Send Back Build); epdDrop and epsHold's test taken from pkgEPD/patched_live Judge Enforcer Record. Lists every row whose EPS hold EPD lifts.
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');
const L=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));const SBB=(L.data||L).nodes.find(n=>n.name==='Send Back Build').parameters.jsCode;
const {lbBlockText}=new Function(closure(SBB,['lbBlockText']).text+';return {lbBlockText};')();
const REC=fs.readFileSync('pkgEPD/patched_live/Judge_Enforcer_Record.js','utf8');const {lbFoot,unxLack,epdDrop}=new Function(closure(REC,['lbFoot','unxLack','epdDrop']).text+';return {lbFoot,unxLack,epdDrop};')();
const rows=JSON.parse(fs.readFileSync('pkgEPS/fixture_eprem_rows.json','utf8'));const out=[];const cls={};
for(const r of rows){const n=+(String(r.item).match(/(\d+)\s*$/)||[])[1];const why=String(r.cr).replace(/^ENFORCER DISAGREE \(right: COUNTED\):\s*/,'');
 let blk='';try{blk=lbBlockText(r.blk||'',n)||'';}catch(e){blk='';}const k=blk?lbFoot(blk,true):[];
 const eps=!!blk&&!/^\s*\(\s*CONCEDED\b/i.test(why)&&k.length>=2&&!unxLack(why,k).missing.length;const d=eps?epdDrop(why,blk):null;const dRound=eps&&!d?epdDrop(why,r.blk||''):null;
 const c=!eps?'not held by EPS':d?'EPD LIFTS (drop in block)':dRound?'still held (drop only outside the block)':'still held';cls[c]=(cls[c]||0)+1;
 out.push({run:r.run.replace(/^ODV1-|-.*$/g,''),seat:r.seat,item:r.item,cls:c,drop:d||dRound,why:why.slice(0,200)});}
for(const x of out)console.log(x.cls.padEnd(42)+x.run+' '+x.seat.padEnd(8)+' '+x.item.padEnd(40)+' | '+x.why+(x.drop?'  || DROP: '+x.drop:''));
console.log(JSON.stringify(cls));fs.writeFileSync('pkgEPD/replay_db_EPD.json',JSON.stringify(out,null,1));
