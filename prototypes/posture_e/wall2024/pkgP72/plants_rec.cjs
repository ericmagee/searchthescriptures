// pkgP72 plants on the pkgEPS hold (Judge Enforcer Record): stored run 34626, item P1.1 (luna, premise 1 against the defender).
// The stored build output gets r372 on that id; DeepSeek's stored reply line for P1.1 is replaced by a planted line. Base and parent
// Record stubs are run on the same inputs and the cure_reason of that row is compared.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const A=load(process.env.BASE||'/mnt/project-files/wall2024/parent_s142_JOINT_A21_SRH.json'),B=load(process.argv[2]);const PA=parts(A),PB=parts(B);
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8')).data.resultData.runData;
const run=async(src,ovr)=>{const mk=name=>{if(ovr[name])return ovr[name];const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=(A.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
 const r=rd['Judge Enforcer Record'];const sn=r[0].source[0].previousNode;const inp=mk(sn);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$input);};
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const plants=[
 ['372 form naming a verse the judge graded MISSES (r372 = Matthew 1:19)',['Matthew 1:19'],'(UNEXHIBITED: Matthew 1:19 unanswered, ruling 372) luna\'s own ANSWER CHECK grades Matthew 1:19 MISSES.','not held'],
 ['372 form naming a verse not in r372',['Matthew 1:19'],'(UNEXHIBITED: Luke 2:48 unanswered, ruling 372) the witness is unanswered.','held'],
 ['372 form with no r372 on the id',[],'(UNEXHIBITED: Matthew 1:19 unanswered, ruling 372) the witness is unanswered.','held'],
 ['old form naming a layer the block exhibits (unchanged)',['Matthew 1:19'],'(UNEXHIBITED: lacks [L1]) the block lacks its row.','held'],
];
(async()=>{let ok=0;for(const [name,r372,why,want] of plants){
 const Bst=rd['Judge Enforcer Build'][0].data.main[0].map(x=>JSON.parse(JSON.stringify(x)));Bst.forEach(it=>(it.json.ids||[]).forEach(z=>{if(z.id==='P1.1')z.r372=r372;}));
 const Cst=rd['Judge Enforcer Call deepseek'][0].data.main[0].map(x=>JSON.parse(JSON.stringify(x)));const m=Cst[4].json.choices[0].message;m.content=m.content.replace(/^ENFORCER: P1\.1 -- .*$/m,'ENFORCER: P1.1 -- DISAGREE -- RIGHT: COUNTED -- '+why);
 const ovr={'Judge Enforcer Build':wrap(Bst),'Judge Enforcer Call deepseek':wrap(Cst)};const res={};
 for(const [k,P] of [['base',PA],['new',PB]]){const out=await run(reb(P,'Judge Enforcer Record'),ovr);const rows=out[0].json.enf428_rows;const row=rows.find(r=>r.rule==='E-PREM'&&r.seat==='luna'&&/defender 1$/.test(r.item));res[k]=row?row.cure_reason:'(no row)';}
 const got=/^ENFORCER HELD \(pkgEPS/.test(res.new)?'held':/^ENFORCER DISAGREE/.test(res.new)?'not held':'other';const g=got===want;if(g)ok++;
 console.log((g?'OK  ':'FAIL'),name,'| want',want,'| base:',res.base.slice(0,90),'| new:',res.new.slice(0,90));}
 console.log('plants',plants.length,'right',ok);})();
