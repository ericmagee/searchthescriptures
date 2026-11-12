const fs=require('fs');const R=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));
const lib=w=>{const c=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;return {c,L:JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/'))),head:c.slice(0,c.indexOf('\n/*LIB*/'))};};
const src=(w,name)=>{const libJs=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;const stub=w.nodes.find(n=>n.name==name).parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>({params:{jsCode:libJs}}));};
const live=R('fetchback_live_s149.json'),sds=R('parent_s149_SDS.json'),flr=R('parent_s149_FLR.json'),jt=R('parent_s149_JOINT_SDS_FLR.json');
const cmp=(a,b,t)=>{const d=a.nodes.filter((n,i)=>JSON.stringify(n)!==JSON.stringify(b.nodes[i])).map(n=>n.name);console.log(t,'nodes',a.nodes.length,b.nodes.length,'differ',d,'conn eq',JSON.stringify(a.connections)===JSON.stringify(b.connections));};
cmp(live,flr,'live vs FLR');cmp(sds,jt,'SDS vs JOINT');
const Ll=lib(live),Lf=lib(flr),Lj=lib(jt),Ls=lib(sds);
console.log('lib lines live=flr',JSON.stringify(Ll.L)===JSON.stringify(Lf.L),'sds=joint',JSON.stringify(Ls.L)===JSON.stringify(Lj.L));
console.log('jsCode live',Ll.c.length,'flr',Lf.c.length,'+'+(Lf.c.length-Ll.c.length),'joint',Lj.c.length,'+'+(Lj.c.length-Ll.c.length));
// rendered node sources
for(const n of ['Alternate Merge Seat','R2 Alternate Merge Seat']){const a=src(live,n),b=src(flr,n),s=src(sds,n),j=src(jt,n);
 let i=0;while(a[i]===b[i])i++;let k=0;while(a[a.length-1-k]===b[b.length-1-k])k++;
 console.log('\n'+n,'live',a.length,'flr',b.length,'+'+(b.length-a.length),'| sds',s.length,'joint',j.length,'+'+(j.length-s.length));
 console.log('OLD:',a.slice(i-200,a.length-k+50));console.log('NEW:',b.slice(i-200,b.length-k+50));
 // joint == sds with same replacement?
 console.log('joint == sds with FLR edit:',s.replace(a.slice(i-200,a.length-k+50),b.slice(i-200,b.length-k+50))===j);}
// other nodes rendered sources equal live vs flr
let neq=[];for(const n of live.nodes){if(!/code/i.test(n.type||''))continue;try{const a=src(live,n.name),b=src(flr,n.name);if(a!==b)neq.push(n.name);}catch(e){}}console.log('rendered sources differing live vs FLR:',neq);
