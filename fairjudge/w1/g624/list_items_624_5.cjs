const fs=require('fs');const G=require('/mnt/project-files/standing/tools/gatefn.cjs');
const te=JSON.parse(fs.readFileSync('tg/target_engine_624.json','utf8'));
const JS=[...JSON.parse(fs.readFileSync('fx/j42373.json')),...JSON.parse(fs.readFileSync('fx/j_prior3.json'))];
const S=G(te,'Late Gate Build',{},['SCK624','WHL507']).SCK624;
for(const r of JS){const it=S.items(r.verdict_raw,r.verdict_tag);console.log(r.id,r.judge_seat,r.verdict_tag,'items',it.length);
 for(const x of it)console.log('   ',x.send?'SENT':'RECORDED',x.kind,'|',JSON.stringify(x.lines||x.key).slice(0,400));}
