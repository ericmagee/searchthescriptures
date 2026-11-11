// W1 grade of pkgEKR: runs the 3 enforcer builders, live s142 vs the pkgEKR parent, on the 12 exports. Lists every item set aside,
// checks each has exactly one pkgEKR code row, that no other item or row changes, and compares the stored verdict of each set-aside item.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const A=load('/mnt/project-files/wall2024/fetchback_live_s142.json'),B=load(process.argv[2]||'/mnt/project-files/wall2024/parent_s141_JOINT_EKR.json');const PA=parts(A),PB=parts(B);
const run=async(rd,src,node)=>{const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0]};};
 const r=rd[node];const sn=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(sn);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$input);};
const strs=o=>typeof o==='string'?[o]:o&&typeof o==='object'?Object.values(o).flatMap(strs):[];
const stored=(rd,seat,rule,line)=>{let v=null;for(const n of Object.keys(rd).filter(n=>/Judge Enforcer Record$/.test(n)))for(const r of rd[n])for(const br of r.data.main)for(const it of br||[])for(const x of it.json.enf428_rows||[])if(x.seat===seat&&x.rule===rule&&x.flagged_line===line)v=(String(x.cure_reason).match(/^ENFORCER [A-Z ]+?(?= \(|:)/)||[x.cure_reason])[0];return v;};
(async()=>{const W='/mnt/project-files/wall2024/';const tot={aside:0,rowsOK:0,otherChange:0,dis:0,agr:0};
 for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
  for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'].filter(e=>rd[e])){let o,n;try{o=await run(rd,reb(PA,node),node);n=await run(rd,reb(PB,node),node);}catch(e){console.log(f,node,'ERROR',e.message);continue;}
   const io=o.flatMap(i=>i.json.ids||[]),inn=n.flatMap(i=>i.json.ids||[]);const K=x=>x.seat+'|'+x.rule+'|'+x.flagged_line;const gone=io.filter(x=>!inn.some(y=>K(y)===K(x)));const added=inn.filter(x=>!io.some(y=>K(y)===K(x)));
   const ro=o.flatMap(i=>i.json.code_rows||[]),rn=n.flatMap(i=>i.json.code_rows||[]);const ek=rn.filter(r=>/pkgEKR/.test(r.cure_reason||''));const rest=JSON.stringify(rn.filter(r=>!/pkgEKR/.test(r.cure_reason||'')).map(r=>({...r,at:0})))===JSON.stringify(ro.map(r=>({...r,at:0})));
   const len=x=>strs(x.map(i=>i.json.body)).join('').length;const nc=x=>x.length;
   if(gone.length||added.length||ek.length||!rest)console.log(f.slice(2,7),node.padEnd(28),'set aside',gone.length,'| other items added',added.length,'| pkgEKR rows',ek.length,'| other code rows equal',rest,'| outputs',nc(o),nc(n),'| DeepSeek input',len(n)-len(o));
   if(!rest||added.length)tot.otherChange++;
   for(const x of gone){tot.aside++;const r=ek.filter(r=>r.seat===x.seat&&r.rule===x.rule&&r.flagged_line===x.flagged_line);if(r.length===1)tot.rowsOK++;const sv=stored(rd,x.seat,x.rule,x.flagged_line);if(/DISAGREE/.test(sv||''))tot.dis++;else if(/AGREE/.test(sv||''))tot.agr++;
    console.log('    ',x.seat.padEnd(8),x.rule,'| rows',r.length,'role',r[0]&&r[0].seat_role,'| stored:',sv,'|',x.flagged_line.slice(0,120));}}}
 console.log('TOTAL',JSON.stringify(tot));})();
