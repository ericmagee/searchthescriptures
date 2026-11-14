const fs=require('fs');const W=JSON.parse(fs.readFileSync(__dirname+'/target.json','utf8'));const c=W.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
const i=c.indexOf("\n{try{const __acl=");const j=c.indexOf("catch(e){}}",i)+11;const blk=c.slice(i,j);
const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).result;const a0=R.indexOf('\n[{"j":')+1,a1=R.lastIndexOf(']\n</untrusted')+1;const X=JSON.parse(R.slice(a0,a1))[0].j;
const D=X.find(x=>String(x.id).startsWith('1a9a0d29'));const Q=D.R;const d={cr1:Q.DR1,cr2:Q.DR2,cr3:Q.CR3,cr4:Q.CR4,gr1:Q.CR1,gr2:Q.CR2,dr3:Q.DR3,dr4:Q.DR4};
const bodies=D.J.map(j=>JSON.stringify({payload:{judge_seat:j.seat,verdict_raw:j.v}}));const $=()=>({first:()=>({json:{bodies}})});const FF=[];
new Function('d','$','FF',blk)(d,$,FF);console.log(FF.length);console.log(FF.slice(0,2).join('\n'));
