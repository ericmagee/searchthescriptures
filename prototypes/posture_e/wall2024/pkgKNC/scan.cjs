// scan: K-W items of kwLines421, live (arg 1) vs package (arg 2), over the 91 stored runs with a round 4 (W4's set,
// /mnt/project-files/w4/kgl/stored.json) and the 81 of corpus2. Prints every added and lost line, max items per side, and size.
// Usage: node scan.cjs <live json> <pkg json> [full]
const fs=require('fs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const lib=w=>{const T=w.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
 return M['Panel Payloads'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const fn=(S,name)=>{const i=S.indexOf('\nfunction '+name+'(');if(i<0)throw new Error('no '+name);const j=S.indexOf('\nfunction ',i+1);return S.slice(i+1,j);};
const mk=S=>new Function('const wpLines2024=()=>({items:[],marks:[]}),kconLines2024=()=>({items:[],marks:[]}),kcmtLines2024=()=>({items:[],marks:[]});\n'+fn(S,'kwiCut2024')+'\n'+fn(S,'kwiSq2024')+'\n'+fn(S,'kwLines421')+'\nreturn kwLines421;')();
const A=mk(lib(un(process.argv[2]))),B=mk(lib(un(process.argv[3])));const full=process.argv[4]==='full';
const sets=[['W4 stored 91',require('/mnt/project-files/w4/kgl/stored.json').map(r=>({run:r.id.slice(0,8),R:{CR2:r.claude_r2,CR3:r.engine_r3,CR4:r.defender_r4,DR2:r.engine_r2,DR3:r.challenger_r3,DR4:r.challenger_r4}}))],
 ['corpus2 81',require('/mnt/project-files/w3/grade_WVR/corpus2.json').map(F=>({run:String(F.run),R:{CR2:F.cr2,CR3:F.cr3,CR4:F.cr4,DR3:F.dr3,DR4:F.dr4}}))]];
const sz=o=>o.items.filter(x=>x.rule==='K-W').reduce((a,x)=>a+x.line.length,0)+o.marks.filter(x=>/K-W;/.test(x)).reduce((a,x)=>a+x.length,0);
for(const [nm,rows] of sets){let same=0,ch=0,add=0,lost=0,d=0,mx=[0,0],perRun=[],dm=0;
 for(const {run,R} of rows){const oa=A('',R),ob=B('',R);d+=sz(ob)-sz(oa);dm=Math.max(dm,sz(ob)-sz(oa));const a=oa.items.filter(x=>x.rule==='K-W').map(x=>x.line),b=ob.items.filter(x=>x.rule==='K-W').map(x=>x.line);
  ['DEFENDER','CHALLENGER'].forEach((s,k)=>{mx[k]=Math.max(mx[k],ob.items.filter(x=>x.rule==='K-W'&&x.side===s).length);});
  if(JSON.stringify(a)===JSON.stringify(b)){same++;continue;}ch++;const sa=new Set(a),sb=new Set(b);const p=b.filter(x=>!sa.has(x)),m=a.filter(x=>!sb.has(x));add+=p.length;lost+=m.length;perRun.push(p.length);
  console.log(nm,run,'+'+p.length,'-'+m.length);if(full){p.forEach(x=>console.log('  + '+x.slice(0,260)));}m.forEach(x=>console.log('  - '+x.slice(0,260)));}
 console.log('==',nm,': runs',rows.length,'equal',same,'changed',ch,'K-W items added',add,'lost',lost,'| max items per side (pkg): defender',mx[0],'challenger',mx[1],'| K-W lines plus marks, characters added',d,'| most added in one run',Math.max(0,...perRun),'items,',dm,'characters');}
