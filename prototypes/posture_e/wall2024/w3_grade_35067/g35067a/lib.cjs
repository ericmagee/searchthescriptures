const fs=require('fs');
let _j;
exports.load=()=>{ if(!_j){_j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));} return _j;};
exports.rd=()=>exports.load().data.resultData.runData;
exports.out=(n,i=0)=>{const r=exports.rd()[n]; if(!r) return null; const o=r[i].data&&r[i].data.main; return o;};
exports.items=(n,i=0)=>{const o=exports.out(n,i); if(!o) return []; return [].concat(...o.map(b=>(b||[]).map(x=>x.json)));};
exports.shape=(v,d=0,max=2)=>{ if(v===null||typeof v!=='object') return typeof v==='string'?('str'+v.length):typeof v; if(Array.isArray(v)) return '['+v.length+']'+(v.length&&d<max?exports.shape(v[0],d+1,max):''); const o={}; for(const k of Object.keys(v)) o[k]=d<max?exports.shape(v[k],d+1,max):typeof v[k]; return o;};
