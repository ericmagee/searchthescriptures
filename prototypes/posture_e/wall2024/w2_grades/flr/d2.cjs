const fs=require('fs');const R=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));
const src=(w,name)=>{const libJs=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;const stub=w.nodes.find(n=>n.name==name).parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>({params:{jsCode:libJs}}));};
const live=R('fetchback_live_s149.json'),flr=R('parent_s149_FLR.json'),sds=R('parent_s149_SDS.json');
for(const n of ['D2 Words Plan','Close Group Batch Build']){const a=src(live,n),a2=src(live,n),b=src(flr,n),s=src(sds,n);console.log(n,'live==live',a===a2,'live',a.length,'flr',b.length,'sds',s.length,'sds==live',s===a);
 let i=0;while(a[i]===b[i])i++;console.log(' first diff at',i,JSON.stringify(a.slice(i-80,i+80)),'\n vs',JSON.stringify(b.slice(i-80,i+80)));
 const stub=live.nodes.find(x=>x.name==n).parameters.jsCode;console.log(' stub head',JSON.stringify(stub.slice(0,300)));}
