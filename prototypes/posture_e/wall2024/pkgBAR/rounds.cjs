// pkgBAR test helper: the debater rounds of a saved run, read from the judges' Panel Build messages (as pkgIMP's tests do).
const fs=require('fs');const IMP=require('../pkgIMP/lib_IMP.cjs');
module.exports=run=>{const p0=JSON.parse(fs.readFileSync(__dirname+'/../corpus/raw/gate_'+run+'.json','utf8'))['Panel Build'].slice(-1)[0][0];
 return IMP.rounds(p0.judges[0].body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n'));};
