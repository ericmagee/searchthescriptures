// E2 check: Send Back Build items under pkgECB equal the base items less those on the engine's closing-break lines (S numbers aside). Run from wall2024/.
const fs=require('fs');const run=require('./run_node.cjs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const src=(set,n)=>fs.readFileSync('pkgLIB/strip_'+set+'/patched/'+n.replace(/ /g,'_')+'.js','utf8');
const items=o=>{const out=[];for(const j of o){const s=JSON.stringify(j.items||j.sb_items||j);for(const it of (j.items||[]))out.push({seat:j.seat||it.seat,line:it.line,rule:it.rule,item:String(it.item).replace(/\bS\d+\b/g,'S#')});}return out;};
(async()=>{const n='Send Back Build';const a=await run(src('R1',n),n,rd),b=await run(src('ECB',n),n,rd);
 const key=x=>x.seat+'|'+x.rule+'|'+x.item+'|'+x.line;const ia=a.flatMap(j=>(j.items||[]).map(it=>({seat:j.seat,...it})));const ib=b.flatMap(j=>(j.items||[]).map(it=>({seat:j.seat,...it})));
 console.log('fields of an output item: '+Object.keys(a[0]||{}).join(','));console.log('items base '+ia.length+', candidate '+ib.length);
 const kb=new Set(ib.map(x=>key({...x,item:String(x.item).replace(/\bS\d+\b/g,'S#')})));const gone=ia.filter(x=>!kb.has(key({...x,item:String(x.item).replace(/\bS\d+\b/g,'S#')})));
 const brk=x=>/BROKEN BY A CONFIRMED CLOSING CONTRADICTION/.test(String(x.line||''));
 console.log('base items missing from the candidate: '+gone.length+'; of them on a closing-break line: '+gone.filter(brk).length);gone.filter(x=>!brk(x)).forEach(x=>console.log('  OTHER: '+x.seat+' '+x.rule+' '+x.item+' | '+String(x.line).slice(0,120)));
 console.log('candidate items on a closing-break line: '+ib.filter(brk).length);
 console.log(gone.every(brk)&&!ib.filter(brk).length&&ia.length-gone.length===ib.length?'OK   E2 only the closing-break items are left out':'FAIL E2');})();
