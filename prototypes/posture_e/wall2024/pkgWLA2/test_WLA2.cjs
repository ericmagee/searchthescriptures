// pkgWLA2 test. Run from wall2024/: node pkgWLA2/test_WLA2.cjs
// (1) Unit: the joint-header reader. (2) Replay: pkgWLA/out vs pkgWLA2/out for Panel Build and Build Independent Verdict on every saved run; bar = byte-equal.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const wrap=c=>'return (async()=>{\n'+c+'\n})();';
const src=fs.readFileSync('pkgWLA2/out/Panel_Build.js','utf8');const g=new Function(src.slice(src.indexOf('const wlaNorm2024'),src.indexOf('const wlaNamed2024'))+';return wlaById2024;')();
const U='MEANS [CR3] P3.1, P3.2 and P3.3: "seed is said of the woman"\nThe text [L1] says it.\nMEANS [CR3] P3.5: "x y z w"\nno tag\nMEANS [CR3] P3.1, P4.2: "mixed"\n[L2]\n**MEANS [CR3] P2.1 & P2.4:** "the body is stated prepared"\n[L3]';
const H=g(U);const k=H.map(h=>h.n+'.'+h.k+(h.lay?'+':'-')).join(' ');
T(k==='3.1+ 3.2+ 3.3+ 3.5- 2.1+ 2.4+','unit joint header ids: '+k+' (mixed-premise header P3.1, P4.2 skipped)');
(async()=>{for(const [nm,feed] of [['Panel Build','Anticheat Only?'],['Build Independent Verdict','Regrade After Quotes?']]){const f=nm.replace(/ /g,'_')+'.js';
 const c0=fs.readFileSync('pkgWLA/out/'+f,'utf8'),c1=fs.readFileSync('pkgWLA2/out/'+f,'utf8');
 const rs=fs.readdirSync(D).filter(x=>x.endsWith('_'+nm.replace(/ /g,'_')+'.json')).map(x=>x.split('_')[0]).sort();
 for(const R of rs){let a,b;try{a=await harness(R)(wrap(c0),feed);}catch(e){log('SKIP '+nm+' '+R+' base threw: '+String(e.message).slice(0,100));continue;}
  try{b=await harness(R)(wrap(c1),feed);}catch(e){T(false,nm+' '+R+' patched threw: '+String(e.message).slice(0,140));continue;}
  T(JSON.stringify(a)===JSON.stringify(b),nm+' '+R+': byte-equal');}}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgWLA2/test_WLA2.txt',out.join('\n')+'\n');})();
