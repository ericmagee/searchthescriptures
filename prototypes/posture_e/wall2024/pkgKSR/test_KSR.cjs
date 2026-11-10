// Tests for pkgKSR and pkgECB on execution 34626 (labels pkgKSR/labels_KSR.md). Run from wall2024/.
const fs=require('fs');const run=require('./run_node.cjs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const src=(set,n)=>fs.readFileSync('pkgLIB/strip_'+set+'/patched/'+n.replace(/ /g,'_')+'.js','utf8');
let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const keys=o=>{const s=JSON.stringify(o).replace(/\\\\n/g,'\n').replace(/\\n/g,'\n');return [...s.matchAll(/(?:^|\n)\s*KEYSTONE: D6 -- (STANDS|BROKEN)[^\n"\\]{0,90}/g)].map(m=>m[0].trim());};
const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
(async()=>{
 // K: Panel Cure Check
 {const n='Panel Cure Check';const a=await run(src('R1',n),n,rd),b=await run(src('KSR',n),n,rd);
  const live=nt((rd[n][0].data.main[0]||[]).map(x=>x.json));T(nt(a)===live,'K0 '+n+': base source rerun equals the stored output');
  const kb=keys(b).filter(k=>/STANDS/.test(k)),kbr=keys(b).filter(k=>/BROKEN LINK 6|-- BROKEN -- LINK 6 BROKEN BY A CONFIRMED/.test(k));
  console.log('   base KEYSTONE STANDS lines: '+keys(a).filter(k=>/STANDS/.test(k)).length+'; candidate STANDS: '+kb.length+'; candidate engine BROKEN lines: '+kbr.length);
  T(kb.length===0&&kbr.length>0,'K1 '+n+': no KEYSTONE D6 STANDS left; the engine writes "KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION"');
  const flat=(o,p,acc)=>{if(typeof o==='string'){try{if(/^[\[{]/.test(o)){flat(JSON.parse(o),p,acc);return acc;}}catch(e){}o.split('\n').forEach(l=>acc.push(p+'#'+l));}else if(o&&typeof o==='object')for(const k in o)flat(o[k],p+'.'+k,acc);else acc.push(p+'='+o);return acc;};
  const fa=flat(a,'',[]),fb=flat(b,'',[]);const ms=x=>{const m=new Map();x.forEach(l=>m.set(l,(m.get(l)||0)+1));return m;};const A=ms(fa),B=ms(fb);const only=(M,N)=>[...M].filter(([k,v])=>(N.get(k)||0)<v).map(([k])=>k);
  const okA=/"reasoning"|RECOMPUTED AFTER CURE/,okB=/"reasoning"|RECOMPUTED AFTER CURE|SUPERSEDED LINE -- SEAT: \w+; LABEL: KEYSTONE|K-RECHK -- SEAT: \w+; CHANGE: KEYSTONE D6|KEYSTONE D6 \(STANDS to BROKEN\)/;
  const oa=only(A,B),ob=only(B,A);T(oa.every(l=>okA.test(l))&&ob.every(l=>okB.test(l)),'K2 '+n+': line diff '+oa.length+' base-only and '+ob.length+' candidate-only lines, all of them the KEYSTONE line, its trigger, the recompute audit, its SUPERSEDED LINE audit and a record-only K-RECHK row');}
 // K3: Gate Record (luna's derived keystone)
 for(const n of ['Gate Build','Gate Record','Alternate Merge Seat']){const a=await run(src('R1',n),n,rd),b=await run(src('KSR',n),n,rd);if(a.err||b.err){T(false,n+' error '+(a.err||b.err));continue;}
  const da=(nt(a).match(/D6 -- STANDS -- derived by the engine/g)||[]).length,db=(nt(b).match(/D6 -- STANDS -- derived by the engine/g)||[]).length;
  console.log('   '+n+': derived "D6 -- STANDS" lines base '+da+', candidate '+db);T(db===0,'K3 '+n+': no derived STANDS on a link broken by a confirmed closing contradiction');}
 // E: Send Back Build
 {const n='Send Back Build';const a=await run(src('R1',n),n,rd),b=await run(src('ECB',n),n,rd);
  const live=nt((rd[n][0].data.main[0]||[]).map(x=>x.json));T(nt(a)===live,'E0 '+n+': base source rerun equals the stored output');
  const cnt=o=>(nt(o).match(/YOUR LINE: D[0-9]+ vs C[0-9]+[^"\\]{0,60}BROKEN BY A CONFIRMED/g)||[]).length;
  const ns=o=>(nt(o).match(/closing-contradiction break; a send-back does not undo it/g)||[]).length;
  console.log('   items on the engine break lines: base '+cnt(a)+', candidate '+cnt(b)+'; not_sent rows naming it: '+ns(b));
  T(cnt(a)>0&&cnt(b)===0&&ns(b)>=1,'E1 '+n+': the engine break lines are not sent back and each is recorded in not_sent');
  const items=o=>{const s=nt(o);return (s.match(/S\d+ \((E-[A-Z0-9]+|K-[A-Z0-9]+), [^)]*\)/g)||[]).length;};console.log('   item headers: base '+items(a)+', candidate '+items(b));}
 console.log(ok+' OK, '+bad+' FAIL');})();
