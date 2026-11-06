// pkgIMP probe: the harvest on every run whose Panel Build is saved. Run from wall2024/: node pkgIMP/probe_IMP.cjs [run ...]
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const IMP=new Function(rd('pkgIMP/src_IMP.js')+';return IMP;')();const UND=new Function(rd('pkgUNL/src_UNL.js')+';return UND;')();
const want=process.argv.slice(2);
for(const f of fs.readdirSync('corpus/raw').filter(f=>/^gate_\d+\.json$/.test(f)).sort()){const run=f.slice(5,10);if(want.length&&!want.includes(run))continue;const G=JSON.parse(rd('corpus/raw/'+f));const pb=(G['Panel Build']||[]).slice(-1)[0];const p0=pb&&(pb[0]||pb['0']);if(!p0||!p0.judges)continue;
 const R=UND.rounds(p0.judges[0].body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n'));const H=IMP.harvest(R);
 const by={};for(const h of H)by[h.round]=(by[h.round]||0)+1;console.log(run+': '+H.length+' sentences '+JSON.stringify(by));
 for(const h of H)console.log('   '+h.id+' ['+h.round+'] ('+h.phrase+') '+h.sentence.slice(0,170));}
