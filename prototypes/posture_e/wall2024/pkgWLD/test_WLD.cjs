// pkgWLD test. Run from wall2024/: node pkgWLD/test_WLD.cjs [base fetchback] [patched dir]
// Replays Panel Build and Build Independent Verdict (base vs patched) on every saved run.
// Bar: (1) only PRESSED-WITNESS LEDGER premise lines and the ledger's closing sentence change; (2) with the new NAMED IN AN ANSWER /
// NAMED ONLY IN OTHER TEXT segments removed, every premise line equals the base line (named counts and NOT NAMED lists unchanged);
// (3) on each line, the witnesses listed under the two new segments are exactly as many as the line's named count.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const BASE=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s68.json',PD=process.argv[3]||'pkgWLD/patched';
const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const NODES=[['Panel Build','Anticheat Only?'],['Build Independent Verdict','Regrade After Quotes?']];
const wrap=c=>'return (async()=>{\n'+c+'\n})();';
const strip=s=>s.replace(/ -- NAMED IN AN ANSWER: .*?(?= -- NAMED ONLY IN OTHER TEXT: | --(?:;|$))/,'').replace(/ -- NAMED ONLY IN OTHER TEXT: .*?(?= --(?:;|$))/,'').replace(/ --(?=;)/,'');
// each listed witness carries its round and quoted words: ' [CR3] \\"...\\"' (JSON-escaped in the replayed output)
const cnt=s=>{const a=(s.match(/ -- NAMED IN AN ANSWER: (.*?)(?= -- NAMED ONLY IN OTHER TEXT: | --;)/)||[])[1],o=(s.match(/ -- NAMED ONLY IN OTHER TEXT: (.*?)(?= --;)/)||[])[1];
 const n=x=>x?(x.match(/ \[(?:CR|DR)\d\] \\"/g)||[]).length:0;return {a:n(a),o:n(o)};};
const tally={};const samples=[];
(async()=>{let runs=0;
for(const [nm,feed] of NODES){const c0=W.nodes.find(n=>n.name===nm).parameters.jsCode,c1=fs.readFileSync(PD+'/'+nm.replace(/ /g,'_')+'.js','utf8');
 const rs=fs.readdirSync(D).filter(f=>f.endsWith('_'+nm.replace(/ /g,'_')+'.json')).map(f=>f.split('_')[0]).sort();
 for(const RUN of rs){let a,b;try{a=await harness(RUN)(wrap(c0),feed);}catch(e){log('SKIP '+nm+' '+RUN+' base threw: '+String(e.message).slice(0,100));continue;}
  try{b=await harness(RUN)(wrap(c1),feed);}catch(e){T(false,nm+' '+RUN+' patched threw: '+String(e.message).slice(0,140));continue;}runs++;
  const sa=JSON.stringify(a),sb=JSON.stringify(b);if(sa===sb){T(true,nm+' '+RUN+': output unchanged (no named witness)');continue;}
  const la=sa.split('\\n'),lb=sb.split('\\n');const ch=[];if(la.length!==lb.length){T(false,nm+' '+RUN+': line count changed');continue;}
  for(let i=0;i<la.length;i++)if(la[i]!==lb[i])ch.push([la[i],lb[i]]);
  let good=true,why='';let side='';
  for(const [x,y] of ch){if(/^A verse marked NOT NAMED is unanswered by the rule/.test(x)&&/^A verse marked NOT NAMED is unanswered by the rule\. A verse NAMED IN AN ANSWER/.test(y))continue;
   if(!/^premise \d+/.test(x)||!/^premise \d+/.test(y)){good=false;why='non-ledger line: '+String(x).slice(0,80);break;}
   if(strip(y)!==x){good=false;why='stripped line differs: '+x.slice(0,60);break;}
   const nn=+((x.match(/of the proven, (\d+) named/)||[])[1]||0);const c=cnt(y);if(c.a+c.o!==nn){good=false;why='count '+nn+' vs listed '+(c.a+c.o)+': '+y.slice(0,300);break;}
   const k=nm+'|'+RUN;tally[k]=tally[k]||{a:0,o:0};tally[k].a+=c.a;tally[k].o+=c.o;if(nm==='Panel Build')samples.push(RUN+' '+y);}
  T(good,nm+' '+RUN+': '+ch.length+' line(s) change'+(good?', named counts and NOT NAMED lists unchanged'+(tally[nm+'|'+RUN]?'; answer '+tally[nm+'|'+RUN].a+', other text '+tally[nm+'|'+RUN].o:''):'; '+why));}}
let A=0,O=0;for(const [k,v] of Object.entries(tally))if(k.startsWith('Panel Build|')){A+=v.a;O+=v.o;}
log('node runs '+runs+'; Panel Build named witnesses (3 judge prompts each): NAMED IN AN ANSWER '+A+', NAMED ONLY IN OTHER TEXT '+O);
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(PD.replace(/patched$/,'')+'test_WLD.txt',out.join('\n')+'\n');fs.writeFileSync(PD.replace(/patched$/,'')+'samples_WLD.txt',samples.join('\n')+'\n');})();
