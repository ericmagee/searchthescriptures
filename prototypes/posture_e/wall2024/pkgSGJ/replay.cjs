const fs=require('fs');
function load(f){const w=JSON.parse(fs.readFileSync(f));const c=w.nodes.find(n=>n.name==='C4 Build').parameters.jsCode;
 const i=c.indexOf('const OGR=(()=>{');const j=c.indexOf('\n return {harvest',i);const k=c.indexOf('})();',j);
 return new Function(c.slice(i,k+5)+';return OGR;')();}
const A=load('/mnt/project-files/wall2024/fetchback_live_s155.json'),B=load('parent_s155_SGJ.json');
const runs=JSON.parse(fs.readFileSync('runs.json'));let tot=0,ch=0,newln=0;
for(const r of runs){const a=A.harvest(r),b=B.harvest(r);let c=0;
 const n=Math.max(a.length,b.length);
 for(let x=0;x<n;x++){const p=a[x],q=b[x];tot++;if(!p||!q||p.text!==q.text){c++;ch++;if(process.argv[2]===r.t.slice(5,10)||process.argv[2]==='all')console.log(r.t,'G'+(x+1),'\n  OLD:',p&&p.text,'\n  NEW:',q&&q.text);}
  if(p&&/\n/.test(p.text))newln++;}
 // check(): does the stored DR4 pass both?
 const ca=A.check(r.DR4,a,r),cb=B.check(r.DR4,b,r);
 console.log(r.t,'grants',a.length,'->',b.length,'changed',c,'check old',ca.pass,ca.misquoted.length,'new',cb.pass,cb.misquoted.length);}
console.log('total',tot,'changed',ch);
