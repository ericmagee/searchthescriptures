const fs=require('fs');const __acl=new Function(fs.readFileSync(__dirname+'/acl.js','utf8')+';return __acl;')();
const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).result;const a0=R.indexOf('\n[{"j":')+1,a1=R.lastIndexOf(']\n</untrusted')+1;const X=JSON.parse(R.slice(a0,a1))[0].j;
let nj=0,nac=0,f=0;for(const d of X)for(const j of d.J||[]){nj++;const t=String(j.v||'');nac+=(t.match(/ANSWER CHECK\s*:/g)||[]).length;const Q=d.R;const RR={CR1:Q.DR1,CR2:Q.DR2,CR3:Q.CR3,CR4:Q.CR4,DR1:Q.CR1,DR2:Q.CR2,DR3:Q.DR3,DR4:Q.DR4};const o=__acl(t,RR);for(const x of o){f++;console.log(String(d.id).slice(0,8),j.id,j.seat,x.verse,'['+x.lab+'] found in',x.found.join(','),'|',x.answer.slice(0,90));}}
console.log({debates:X.length,judgments:nj,answer_checks:nac,flags:f});
