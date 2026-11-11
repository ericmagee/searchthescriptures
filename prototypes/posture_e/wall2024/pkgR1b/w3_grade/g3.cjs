const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),B=g('/mnt/project-files/wall2024/parent_s119_R1b.json');
const lib=W=>W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;
for(const nm of ['Alternate Build','Early Alternate Build']){const a=A.nodes.find(n=>n.name===nm).parameters.jsCode,b=B.nodes.find(n=>n.name===nm).parameters.jsCode;console.log(nm,'| code equal to live',a===b,'len',a.length);
 const i=b.indexOf("const __LT=");const names=[...b.matchAll(/\)\["([^"]+)"\]/g)].map(m=>m[1]);console.log('  map names used',names.join(','));
 const j=b.indexOf('__S.length!==__N');const k=b.indexOf('\n',j);const pre=b.slice(i,k+1);
 const r=W=>{try{return new Function('$',pre+'\nreturn __S;')(()=>({params:{jsCode:lib(W)}}));}catch(e){return 'ERR '+e.message;}};const sa=r(A),sb=r(B);console.log('  rebuilt from live library',sa.length,'| from candidate library',sb.length,'| equal',sa===sb);
 console.log('  tail:',b.slice(k,k+500).replace(/\n/g,' / '));}
const la=lib(A),lb=lib(B);console.log('live header:',la.split('\n')[0].slice(0,90),'|',la.split('\n')[3]);console.log('cand header:',lb.split('\n')[0].slice(0,90),'|',lb.split('\n')[3]);
const P=t=>[JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/'))),JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')))];const [La,Ma]=P(la),[Lb,Mb]=P(lb);
console.log('lines',La.length,Lb.length,'map',Object.keys(Ma).length,Object.keys(Mb).length,'| library node itself returns:',lb.slice(lb.indexOf('return'),lb.indexOf('return')+10));
// adversarial: the stub's length guard fires on a one-character library change
const n=B.nodes.find(x=>x.name==='Panel Build').parameters.jsCode;const i=n.indexOf("const __LT=");const j=n.indexOf('return await new Function(',i);
const e=Mb['Panel Build'].p.find(x=>typeof x==='number'||typeof x[0]==='number');const idx=typeof e==='number'?e:e[0];const L2=Lb.slice();L2[idx]=L2[idx]+' ';const lib2=lb.slice(0,lb.indexOf('\n/*LIB*/')+8)+JSON.stringify(L2)+lb.slice(lb.lastIndexOf('\n/*MAP*/'));
try{new Function('$',n.slice(i,j)+'\nreturn __S;')(()=>({params:{jsCode:lib2}}));console.log('GUARD: no throw on a changed library line');}catch(er){console.log('GUARD throws:',er.message.slice(0,120));}
