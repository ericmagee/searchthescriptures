const fs=require('fs');const VP4N0=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const OLD=eval('(()=>{'+fs.readFileSync(__dirname+'/old_vp524.js','utf8')+';return vp524Verses;})()');
const NEW=eval('(()=>{'+fs.readFileSync(__dirname+'/new_vp524.js','utf8')+';return vp524Verses;})()');
const rows=JSON.parse(fs.readFileSync(__dirname+'/../inputs/rows10.json','utf8'));
const blk=L=>L.map(v=>v.ref+': "'+v.w+'"').join('\n').length;
let uncovered=0;
for(const r of rows){const out=[r.id.slice(0,8)];let gO=0,gN=0;
 for(const [s,fs3] of [['CH',['cr1','cr2','cr3']],['DE',['dr1','dr2','dr3']]]){const o=OLD(fs3.map(k=>r[k])),n=NEW(fs3.map(k=>r[k]));
  const unc=o.filter(v=>!n.some(x=>x.ref===v.ref&&VP4N0(x.w).includes(VP4N0(v.w))));uncovered+=unc.length;
  gO+=blk(o);gN+=blk(n);out.push(s+' old '+o.length+' new '+n.length+' uncovered '+unc.length);}
 out.push('verse block chars old '+gO+' new '+gN+' (+'+(gN-gO)+')');console.log(out.join(' | '));}
console.log('UNCOVERED TOTAL',uncovered);
