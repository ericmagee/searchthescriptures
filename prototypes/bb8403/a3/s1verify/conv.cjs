const fs=require('fs');const dir=process.argv[2];const r=f=>fs.readFileSync(dir+'/'+f,'utf8');
const LF='\n';eval(fs.readFileSync(__dirname+'/pwl_new.js','utf8').replace('const PWL=','globalThis.PWL='));
const F={'[CR1]':r('claude_r1.txt'),'[CR2]':r('claude_r2.txt'),'[CR3]':r('engine_r3.txt'),'[DR1]':r('engine_r1.txt'),'[DR2]':r('engine_r2.txt'),'[DR3]':r('challenger_r3.txt')};
const O=['[CR1]','[DR1]','[CR2]','[DR2]','[CR3]','[DR3]'];
function chk(cr,ans){const b=PWL.citedBlock(cr.map(k=>[k,F[k]]),'X').split(LF).slice(1);
 for(const line of b){const [rk,rest]=line.split(': ');if(rest==='none')continue;const o=O.indexOf(rk);
  for(const lab of rest.split(', ')){const m=lab.match(/^(.*) (\d+):(\d+)(?:-(\d+))?$/);if(!m){console.log('UNPARSED',lab);continue;}
   const [_,bk,c,a,bb]=m;const A=+a,B=+(bb||a);const hits=[];
   for(const k of ans){if(O.indexOf(k)<=o)continue;const t=F[k];const re=new RegExp('(?<![\\d:])'+c+':(\\d{1,3})(?:\\s?[-–—]\\s?(\\d{1,3}))?','g');
    for(const x of t.matchAll(re)){const p=+x[1],q=+(x[2]||x[1]);if(p<=B&&q>=A)hits.push(k+' «'+t.slice(Math.max(0,x.index-30),x.index+x[0].length).replace(/\n/g,' ')+'»');}}
   console.log(rk,lab,'|',hits.length?hits[0]:'NONE');}}}
console.log('== DEFENDER (cited by challenger DR1/DR2, answered CR2/CR3)');chk(['[DR1]','[DR2]'],['[CR2]','[CR3]']);
console.log('== CHALLENGER (cited by defender CR1-3, answered DR2/DR3)');chk(['[CR1]','[CR2]','[CR3]'],['[DR2]','[DR3]']);
