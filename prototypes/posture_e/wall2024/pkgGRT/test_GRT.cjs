// pkgGRT test: Send Back Build and Alt Send Back Build, pkgEHF base vs pkgGRT, over every saved run.
// Bars: only E-COL asks change; each collision-line ask no longer offers "CHANGE TO: RETRACTED"; each FORCED-line ask still offers it;
// 33627 gemini S4/S6/S8/S10 and grok S7/S9/S11/S13/S14/S16 (the 10 refused answers) are asked to regrade.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const WF='/mnt/project-files/wall2024/fetchback_live_s59.json';
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_index\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const FR=/^\s*(?:[-•]|\d+[.)])?\s*FORCED\b/i;let n=0,chg=0,colAsk=0,colRet=0,forAsk=0,forRet=0,other=[];const hit={};
for(const nm of ['Send Back Build','Alt Send Back Build']){const f=nm.replace(/ /g,'_')+'.js';const B0=fs.readFileSync('pkgEHF/patched/'+f,'utf8'),P1=fs.readFileSync('pkgGRT/patched/'+f,'utf8');const fe=feeder(WF,nm);
 for(const R of runs){if(!fs.existsSync(D+R+'_'+nm.replace(/ /g,'_')+'.json'))continue;const i=fe.find(x=>fs.existsSync(D+R+'_'+x.replace(/ /g,'_')+'.json'));if(!i)continue;
  let a,b;try{a=harness(R)(B0,i);b=harness(R)(P1,i);}catch(e){other.push(R+' '+nm+' error '+e.message.slice(0,60));continue;}n++;
  const A=a.map(x=>x.json),B=b.map(x=>x.json);if(JSON.stringify(A)===JSON.stringify(B))continue;chg++;
  for(let k=0;k<A.length;k++){const ia=(A[k].items||A[k].sendback&&A[k].sendback.items||[]);const ib=(B[k].items||B[k].sendback&&B[k].sendback.items||[]);
   const ma=JSON.stringify(A[k]),mb=JSON.stringify(B[k]);if(ma===mb)continue;
   // walk the message text per ITEM block
   const msg=x=>{const s=JSON.stringify(x);const m=s.match(/"msg":"((?:[^"\\]|\\.)*)"/);return m?JSON.parse('"'+m[1]+'"'):'';};
   const ta=msg(A[k]),tb=msg(B[k]);const blk=t=>t.split(/\n(?=ITEM S\d+ \()/).slice(1);const ba=blk(ta),bb=blk(tb);
   if(ba.length!==bb.length){other.push(R+' '+nm+' item count');continue;}
   for(let j=0;j<ba.length;j++){if(ba[j]===bb[j])continue;const rule=(ba[j].match(/^ITEM S\d+ \(([^,)]+)/)||[])[1];if(rule!=='E-COL'){other.push(R+' '+nm+' '+ba[j].slice(0,30));continue;}
    const line=(bb[j].match(/\nYOUR LINE: ([^\n]*)/)||[])[1]||'';const forced=FR.test(line.replace(/[*_`]+/g,''));const ret=/CHANGE TO: RETRACTED/.test(bb[j]);
    if(forced){forAsk++;if(ret)forRet++;}else{colAsk++;if(ret)colRet++;}
    if(R==='33627'){const sid=bb[j].match(/^ITEM (S\d+)/)[1];hit[(A[k].seat||B[k].seat||k)+' '+sid]=forced?'F':(ret?'C-RET':'C');}}}}}
T(n>=40,'replay ran on '+n+' node runs, every saved run with these nodes ('+chg+' changed)');T(other.length===0,'only E-COL asks change ('+(other.slice(0,5).join('; ')||'none')+')');
T(colAsk>0&&colRet===0,'collision-line E-COL asks: '+colAsk+', offering CHANGE TO: RETRACTED: '+colRet);
T(forAsk>0&&forRet===forAsk,'FORCED-line E-COL asks: '+forAsk+', offering CHANGE TO: RETRACTED: '+forRet);
out.push('   33627 changed asks: '+JSON.stringify(hit));
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgGRT/test_GRT.txt',out.join('\n')+'\n');
