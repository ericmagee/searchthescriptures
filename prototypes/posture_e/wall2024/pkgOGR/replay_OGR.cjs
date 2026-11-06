// pkgOGR replay: the harvested list (the DR4 request block) on saved runs, and the check on the DR4 the Oracle actually wrote (no section yet,
// so every grant reads missing: the check works and nothing in these runs met it). Run from wall2024/: node pkgOGR/replay_OGR.cjs 33107 33129 33149
const fs=require('fs');const OGR=new Function(fs.readFileSync('pkgOGR/src_OGR.js','utf8')+';return OGR;')();
const UND=new Function(fs.readFileSync('pkgUNL/src_UNL.js','utf8').replace(/ECL\./g,'(null).')+';return UND;')();
for(const run of process.argv.slice(2)){const PB=JSON.parse(fs.readFileSync('corpus/raw/gate_'+run+'.json','utf8'))['Panel Build'].slice(-1)[0][0];const J=PB.judges[0];
 const pt=J.body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n');const R=UND.rounds(pt);
 const G=OGR.harvest(R);console.log('==== '+run+': '+G.length+' grants harvested from [CR1]-[CR4]');console.log(G.map(x=>'G'+x.g+' ['+x.round+'] "'+x.text+'"').join('\n'));
 const c=OGR.check(R.DR4||'',G,R);console.log('  check on the stored DR4: section '+c.section+', missing '+c.missing.length+', misquoted '+c.misquoted.length+', ok '+c.ok.length);}
