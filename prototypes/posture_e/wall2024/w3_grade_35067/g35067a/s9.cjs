const fs=require('fs');
exports.split=(v)=>{ let pos=v.length; for(;;){ try{ return {j:JSON.parse(v.slice(0,pos)),tail:v.slice(pos)}; }catch(e){ const m=/position (\d+)/.exec(e.message); if(!m) throw e; const np=+m[1]; if(np>=pos) throw e; pos=np; } } };
if(require.main===module) for(const s of ['luna','chatgpt','sol']){
 const p=JSON.parse(fs.readFileSync('body_'+s+'.txt','utf8')).payload; const {j,tail}=exports.split(p.verdict_raw);
 console.log('==',s,'tail',tail.length);
 console.log(Object.keys(j).map(k=>k+':'+(typeof j[k]==='string'?'str'+j[k].length:JSON.stringify(j[k]).slice(0,100))).join('\n'));
}
