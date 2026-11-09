// pkgWLD rev 2 test. Run from wall2024/: node pkgWLD/rev2/test_WLD2.cjs
// Every saved run with Panel Build input: live s71 Panel Build vs rev 2. The judge bodies may differ only in ledger lines, and only by verses moving
// from NAMED ONLY IN OTHER TEXT to NAMED IN AN ANSWER (never the other way). Build Independent Verdict: same source change, checked by diff.
const fs=require('fs');const {harness,feeder}=require('../../pkgGSL/harness.cjs');const B='/mnt/project-files/wall2024/fetchback_live_s72.json';const W=JSON.parse(fs.readFileSync(B));
const D='/mnt/project-files/wall2024/inputs/';const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const pat=n=>fs.readFileSync('pkgWLD/rev2/patched/'+n.replace(/ /g,'_')+'.js','utf8');
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);}console.log((c?'OK ':'FAIL ')+m);};
const IN=feeder(B,'Panel Build')[0];const runs=fs.readdirSync(D).filter(f=>f.endsWith('_'+IN.replace(/ /g,'_')+'.json')).map(f=>f.split('_')[0]).sort();
const texts=o=>{const r=[];const w=v=>{if(typeof v==='string'){if(v.includes('NAMED IN AN ANSWER')||v.includes('NAMED ONLY IN OTHER TEXT'))r.push(v);}else if(v&&typeof v==='object')for(const k of Object.keys(v))w(v[k]);};w(o);return r;};
const parse=t=>{const m={};for(const l of t.split('\n')){if(!/NAMED (IN AN ANSWER|ONLY IN OTHER TEXT)/.test(l))continue;for(const seg0 of l.split(/ -- (?=NAMED )/)){const seg=seg0.replace(/ --(?:;[\s\S]*)?$/,'');const k=seg.match(/^NAMED (IN AN ANSWER|ONLY IN OTHER TEXT): (.*)$/);if(!k)continue;for(const e of k[2].split(/; (?=[1-3]? ?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d+:\d+ \[)/)){const id=l.slice(0,60)+'|'+e.split(' [')[0];m[id]=k[1];}}}return m;};
(async()=>{let tot=0,up=0,down=0,other=0;
 for(const R of runs){let a,b;try{a=await Promise.resolve(harness(R)('return (async()=>{'+live('Panel Build')+'\n})();',IN));b=await Promise.resolve(harness(R)('return (async()=>{'+pat('Panel Build')+'\n})();',IN));}catch(e){out.push('SKIP '+R+' '+String(e.message).slice(0,80));continue;}
  const sa=JSON.stringify(a),sb=JSON.stringify(b);if(sa===sb){tot++;continue;}
  const ta=texts(a),tb=texts(b);let u=0,d=0,o=0;
  const strip=t=>t.split('\n').filter(l=>!/NAMED (IN AN ANSWER|ONLY IN OTHER TEXT)/.test(l)).join('\n');
  if(ta.length!==tb.length||ta.some((t,i)=>strip(t)!==strip(tb[i])))o++;
  for(let i=0;i<Math.min(ta.length,tb.length);i++){const pa=parse(ta[i]),pb=parse(tb[i]);for(const k of new Set([...Object.keys(pa),...Object.keys(pb)])){if(pa[k]===pb[k])continue;if(pa[k]==='ONLY IN OTHER TEXT'&&pb[k]==='IN AN ANSWER')u++;else if(pa[k]==='IN AN ANSWER'&&pb[k]==='ONLY IN OTHER TEXT')d++;else{o++;out.push('       other: '+k.slice(0,40)+' ... '+k.split('|')[1]+' : '+pa[k]+' -> '+pb[k]);}}}
  const outside=JSON.stringify(a,(k,v)=>typeof v==='string'&&/NAMED (IN AN ANSWER|ONLY IN OTHER TEXT)/.test(v)?strip(v):v)!==JSON.stringify(b,(k,v)=>typeof v==='string'&&/NAMED (IN AN ANSWER|ONLY IN OTHER TEXT)/.test(v)?strip(v):v);
  tot++;up+=u;down+=d;other+=o+(outside?1:0);out.push('     '+R+': '+u+' moved to IN AN ANSWER, '+d+' moved back, '+(o+(outside?1:0))+' other changes');}
 T(down===0&&other===0,'Panel Build over '+tot+' saved runs: '+up+' ledger entries move from ONLY IN OTHER TEXT to IN AN ANSWER; '+down+' move back; '+other+' other changes');
 const da=live('Build Independent Verdict'),db=pat('Build Independent Verdict'),pa=live('Panel Build'),pb2=pat('Panel Build');
 const delta=(x,y)=>{let i=0;while(x[i]===y[i])i++;let j=0;while(x[x.length-1-j]===y[y.length-1-j])j++;return y.slice(i,y.length-j);};
 T(delta(da,db)===delta(pa,pb2),'Build Independent Verdict carries the same one-line change as Panel Build');
 out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.slice(-1)[0]);fs.writeFileSync('pkgWLD/rev2/test_WLD2.txt',out.join('\n')+'\n');})();
