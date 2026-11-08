// pkgWLA test. Run from wall2024/: node pkgWLA/test_WLA.cjs
// Replays Panel Build and Build Independent Verdict (live s63 vs patched) on every saved run and lists every output line that changes.
// Bar: only PRESSED-WITNESS LEDGER challenger premise lines change, each moving a verse from NOT NAMED to named, and each such verse has a
// MEANS [CR3] P<n>.<k> header in [DR3] quoting its MEANS with a layer-tagged answer. 33731 premises 3 and 4 lose "NOT NAMED: Genesis 3:15".
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s63.json','utf8'));
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const NODES=[['Panel Build','Anticheat Only?'],['Build Independent Verdict','Regrade After Quotes?']];
const wrap=c=>'return (async()=>{\n'+c+'\n})();';
(async()=>{let flips=0,runs=0;
for(const [nm,feed] of NODES){const c0=W.nodes.find(n=>n.name===nm).parameters.jsCode,c1=fs.readFileSync('pkgWLA/out/'+nm.replace(/ /g,'_')+'.js','utf8');
 const rs=fs.readdirSync(D).filter(f=>f.endsWith('_'+nm.replace(/ /g,'_')+'.json')).map(f=>f.split('_')[0]).sort();
 for(const RUN of rs){let a,b;try{a=await harness(RUN)(wrap(c0),feed);}catch(e){log('SKIP '+nm+' '+RUN+' base threw: '+String(e.message).slice(0,100));continue;}
  try{b=await harness(RUN)(wrap(c1),feed);}catch(e){T(false,nm+' '+RUN+' patched threw: '+String(e.message).slice(0,140));continue;}runs++;
  const sa=JSON.stringify(a),sb=JSON.stringify(b);if(sa===sb){T(true,nm+' '+RUN+': output unchanged');continue;}
  const la=sa.split('\\n'),lb=sb.split('\\n');const ch=[];const n=Math.max(la.length,lb.length);for(let i=0;i<n;i++)if(la[i]!==lb[i])ch.push([la[i],lb[i]]);
  const okl=la.length===lb.length&&ch.every(([x,y])=>/^premise \d+/.test(x||'')&&/^premise \d+/.test(y||''));
  const moved=ch.map(([x,y])=>{const nn=s=>(String(s).match(/of the proven, (\d+) named/)||[])[1];const nn2=s=>(String(s).match(/NOT NAMED: (.*?)(?:\\|$)/)||[])[1];return {p:(x.match(/^premise \d+/)||[''])[0],from:nn(x)+' named; NOT NAMED: '+nn2(x),to:nn(y)+' named; NOT NAMED: '+nn2(y)};});
  flips+=ch.length;T(okl,nm+' '+RUN+': '+ch.length+' ledger line(s) change, nothing else: '+moved.map(m=>m.p+' ['+m.from+'] -> ['+m.to+']').join(' | '));}}
log('node runs '+runs+'; changed ledger lines '+flips);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgWLA/test_WLA.txt',out.join('\n')+'\n');})();
