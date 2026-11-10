// Tests for pkgKSR and pkgECB on execution 34626 (labels pkgKSR/labels_KSR.md). Run from wall2024/.
const fs=require('fs');const run=require('./run_node.cjs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const src=(set,n)=>fs.readFileSync('pkgLIB/strip_'+set+'/patched/'+n.replace(/ /g,'_')+'.js','utf8');
let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const keys=o=>{const s=JSON.stringify(o).replace(/\\\\n/g,'\n').replace(/\\n/g,'\n');return [...s.matchAll(/KEYSTONE: D6 -- (STANDS|BROKEN)[^\n"\\]{0,90}/g)].map(m=>m[0]);};
const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
(async()=>{
 // K: Panel Cure Check
 {const n='Panel Cure Check';const a=await run(src('R1',n),n,rd),b=await run(src('KSR',n),n,rd);
  const live=nt((rd[n][0].data.main[0]||[]).map(x=>x.json));T(nt(a)===live,'K0 '+n+': base source rerun equals the stored output');
  const kb=keys(b).filter(k=>/STANDS/.test(k)),kbr=keys(b).filter(k=>/BROKEN LINK 6|-- BROKEN -- LINK 6 BROKEN BY A CONFIRMED/.test(k));
  console.log('   base KEYSTONE STANDS lines: '+keys(a).filter(k=>/STANDS/.test(k)).length+'; candidate STANDS: '+kb.length+'; candidate engine BROKEN lines: '+kbr.length);
  T(kb.length===0&&kbr.length>0,'K1 '+n+': no KEYSTONE D6 STANDS left; the engine writes "KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION"');
  const strip=o=>nt(o).replace(/KEYSTONE: D6 -- [^"\\]*/g,'K').replace(/KEYSTONE D6 \(STANDS to BROKEN\)(; |, )?/g,'').replace(/ORIGINAL LINES: [^\]]*/g,'OL');
  T(strip(a)===strip(b),'K2 '+n+': all else equal apart from the KEYSTONE lines, the trigger and the audit\'s ORIGINAL LINES');}
 // K3: Gate Record (luna's derived keystone)
 for(const n of ['Gate Build','Gate Record','Alternate Merge Seat']){const a=await run(src('R1',n),n,rd),b=await run(src('KSR',n),n,rd);if(a.err||b.err){T(false,n+' error '+(a.err||b.err));continue;}
  const da=(nt(a).match(/D6 -- STANDS -- derived by the engine/g)||[]).length,db=(nt(b).match(/D6 -- STANDS -- derived by the engine/g)||[]).length;
  console.log('   '+n+': derived "D6 -- STANDS" lines base '+da+', candidate '+db);T(db===0,'K3 '+n+': no derived STANDS on a link broken by a confirmed closing contradiction');}
 // E: Send Back Build
 {const n='Send Back Build';const a=await run(src('R1',n),n,rd),b=await run(src('ECB',n),n,rd);
  const live=nt((rd[n][0].data.main[0]||[]).map(x=>x.json));T(nt(a)===live,'E0 '+n+': base source rerun equals the stored output');
  const cnt=o=>(nt(o).match(/YOUR LINE: D6 vs C[56][^"\\]{0,60}BROKEN BY A CONFIRMED/g)||[]).length;
  const ns=o=>(nt(o).match(/closing-contradiction break; a send-back does not undo it/g)||[]).length;
  console.log('   items on the engine break lines: base '+cnt(a)+', candidate '+cnt(b)+'; not_sent rows naming it: '+ns(b));
  T(cnt(a)>0&&cnt(b)===0&&ns(b)>=cnt(a)/1,'E1 '+n+': the engine break lines are not sent back and each is recorded in not_sent');
  const items=o=>{const s=nt(o);return (s.match(/S\d+ \((E-[A-Z0-9]+|K-[A-Z0-9]+), [^)]*\)/g)||[]).length;};console.log('   item headers: base '+items(a)+', candidate '+items(b));}
 console.log(ok+' OK, '+bad+' FAIL');})();
