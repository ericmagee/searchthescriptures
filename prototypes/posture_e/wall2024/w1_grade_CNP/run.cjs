const fs=require('fs');const b=fs.readFileSync(__dirname+'/b.js','utf8');const i=b.indexOf('const cecDeny=');const j=b.indexOf('return out;};',i)+'return out;};'.length;
const cecDeny=new Function(b.slice(i,j)+';return cecDeny;')();
module.exports=cecDeny;
if(require.main===module){for(const id of [30363,31032]){const d=JSON.parse(fs.readFileSync(__dirname+'/F_'+id+'.json','utf8'));
 const out=cecDeny(d.F,d.links,[]);console.log('==',id,'pairs',out.length);for(const c of out)console.log(' ',c.id,c.side,'LINK',c.n,'['+c.earlier_round+']',JSON.stringify(c.earlier_q.slice(0,110)),'<->',JSON.stringify(c.closing_q.slice(0,80)));}}
