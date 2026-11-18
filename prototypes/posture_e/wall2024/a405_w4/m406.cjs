// ASK 406 measure: live 4435dd09 vs target (L2 Gloss Plan patched) on the stored runs.
const fs=require('fs');const {replay,save,net}=require('./chain.cjs');const P=require('./p406.cjs');
const live=JSON.parse(fs.readFileSync('../rdf/fetchback_w407.json'));const L=(live.data||live).nodes.find(n=>n.name==='L2 Gloss Plan').parameters.jsCode;const T=P(L);fs.writeFileSync('gplan406.js',T);
const T6W=JSON.parse(fs.readFileSync('../a406/t406.json'));const D=JSON.parse(fs.readFileSync('debates.json')).filter(r=>!process.env.ONLY||new RegExp(process.env.ONLY).test(r.run_token));
const tot={runs:0,newG:0,parts:0,notkjv:0,capG:0,capN:0,tagsDiff:0,oldChanged:0,glossDiff:0};const lines=[];
for(const r of D){let A,B;try{A=replay(live,r);B=process.env.FULL?replay(T6W,r):replay(live,r,{'L2 Gloss Plan':T});}catch(e){lines.push(r.run_token+' ERROR '+e.message);continue;}tot.runs++;
 const a=A['L2 Count Plan'][0].json,b=B['L2 Count Plan'][0].json;
 if(JSON.stringify(a.tags)!==JSON.stringify(b.tags)){tot.tagsDiff++;lines.push(r.run_token+' TAGS DIFFER');}
 if(process.env.FULL&&(!b.e340!==!a.e340&&!b.e340))lines.push(r.run_token+' E340 MISSING');if(JSON.stringify(a.gloss)!==JSON.stringify(b.gloss)){tot.glossDiff++;lines.push(r.run_token+' __GLOSS (judge line) DIFFERS');}
 const pa=A['L2 Gloss Plan'][0].json,pb=B['L2 Gloss Plan'][0].json;const ma=(pa.meta||{gloss:[]}),mb=(pb.meta||{gloss:[]});
 const ga=pa.none?[]:ma.gloss,gb=pb.none?[]:mb.gloss;const n406=pb.none?0:(mb.n406||0);
 // today's glosses unchanged (same rows, same order, at the head)
 if(JSON.stringify(gb.slice(0,ga.length))!==JSON.stringify(ga)){tot.oldChanged++;lines.push(r.run_token+' TODAY GLOSS CHANGED');}
 const ea=(a.e340&&a.e340.gloss)||[],eb=(b.e340&&b.e340.gloss)||[];
 // e340 rows of today's glosses unchanged
 const ka=new Set(ea.map(x=>JSON.stringify(x)));const lost=ea.filter(x=>!eb.some(y=>JSON.stringify(y)===JSON.stringify(x)));if(lost.length){lines.push(r.run_token+' E340 ROWS LOST '+lost.length+': '+lost.slice(0,3).map(x=>x.num+' '+x.part+' '+x.status).join('; '));tot.oldChanged++;}
 const add=eb.filter(x=>!ka.has(JSON.stringify(x)));const nk=add.filter(x=>x.status==='NOT IN THE KJV RENDERINGS');
 const d406=pb.none?0:(mb.d406||0);if(d406){tot.capG++;tot.dropped=(tot.dropped||0)+d406;lines.push(r.run_token+' CAPS DROP '+d406+' new-form glosses (kept '+n406+'; today '+ga.length+' glosses)');}
 const numsAll=new Set(ga.concat(gb).flatMap(g=>g.nums));const numsFull=new Set(ga.flatMap(g=>g.nums));// numbers incl. dropped new ones unknown beyond cap; count from kept
 const nb=new Set(gb.flatMap(g=>g.nums)),na=new Set(ga.flatMap(g=>g.nums));if(nb.size>30){tot.capN++;lines.push(r.run_token+' 30-NUMBER CAP: '+nb.size+' numbers (today '+na.size+')');}
 tot.newG+=n406;const nans=add.filter(x=>x.status==='NO ANSWER').length;tot.noans=(tot.noans||0)+nans;tot.parts+=add.length;tot.notkjv+=nk.length;
 if(n406||add.length)lines.push(r.run_token+' new glosses '+n406+' | new e340 rows '+add.length+' | NOT IN THE KJV RENDERINGS '+nk.length+(nk.length?': '+nk.slice(0,6).map(x=>x.num+' "'+x.part+'"').join(', '):'')+' | NO ANSWER '+nans+' | other: '+[...new Set(add.map(x=>x.status))].join(','));
}
save();console.log(JSON.stringify(tot),'net',net());lines.forEach(l=>console.log(l));
