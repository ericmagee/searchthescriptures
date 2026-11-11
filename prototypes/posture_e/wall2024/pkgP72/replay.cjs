// pkgP72 replay: runs the enforcer Build stubs (base vs parent) on every stored export. Lists each E-PREM judge line that gains
// ruling-372 ANSWER CHECK lines, checks that the request text is otherwise equal (the rule sentence and the added lines removed),
// that the ids are equal apart from r372, and measures the prompt change. Usage: BASE=<base> node replay.cjs <parent>
const fs=require('fs');const SP=process.argv[2];
const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const A=load(process.env.BASE||'/mnt/project-files/wall2024/parent_s142_JOINT_A21_SRH.json'),B=load(SP);const PA=parts(A),PB=parts(B);
const ch=Object.keys(PB.M).filter(e=>reb(PA,e)!==reb(PB,e)&&/Build$/.test(e));console.log('build stubs changed:',ch.map(e=>e+' '+(reb(PB,e).length-reb(PA,e).length)));
const run=async(rd,src,node)=>{const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=(A.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
 const r=rd[node];const sn=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(sn);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$input);};
const strs=o=>typeof o==='string'?[o]:o&&typeof o==='object'?Object.values(o).flatMap(strs):[];
const OLDS="is not a missing layer: it is graded at the collision (RULE E-COL, RULE E-HOLD), not counted here, so it is not COUNTED.";
const NEWS=PB.Lb[3212].match(/is not a missing layer: [\s\S]*?\(pkgP72\)\./)[0].replace(/\\'/g,"'");
(async()=>{const W='/mnt/project-files/wall2024/';const tot={runs:0,errs:0,reqs:0,dch:0,lines:0,rest_equal:0,ids_equal:0};
 for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
  for(const node of ch.filter(e=>rd[e])){let o,n;try{o=await run(rd,reb(PA,node),node);n=await run(rd,reb(PB,node),node);}catch(e){console.log(f,node,'ERROR',e.message);tot.errs++;continue;}tot.runs++;
   const bo=o.flatMap(i=>i.json.body?[JSON.stringify(i.json.body)]:[]),bn=n.flatMap(i=>i.json.body?[JSON.stringify(i.json.body)]:[]);
   const ITEMS=bs=>bs.flatMap(b=>{const j=JSON.parse(b);const u=String(j.messages[j.messages.length-1].content||'');return u.split(/\n\n(?=ITEM )/).slice(1).map(x=>x.replace(/\n    THIS JUDGE'S OWN ANSWER CHECK LINES GRADING A WITNESS PRESSED AGAINST THIS PREMISE MISSES OR FAILS \(ruling 372\): [^\n]*/g,''));}).sort();
   const RUL=bs=>bs.map(b=>{const j=JSON.parse(b);const u=String(j.messages[j.messages.length-1].content||'');return u.split(/\n\n(?=ITEM )/)[0].split(NEWS).join(OLDS);});
   const restEq=JSON.stringify(ITEMS(bo))===JSON.stringify(ITEMS(bn))&&new Set(RUL(bo)).size===new Set(RUL(bn)).size&&RUL(bn).every(x=>RUL(bo).includes(x));const ruleN=bn.filter(b=>b.includes(JSON.stringify(NEWS).slice(1,-1))).length;
   const idsO=JSON.stringify(o.flatMap(i=>i.json.ids||[])),idsN=JSON.stringify(n.flatMap(i=>i.json.ids||[]).map(z=>{const {r372,...r}=z;return r;}));
   const L=[];for(const i of n)for(const z of (i.json.ids||[]))if(z.r372&&z.r372.length)L.push(z.seat+' '+z.item+' <- '+z.r372.join(', '));
   const reqs=bn.length;const d=bn.join('').length-bo.join('').length;tot.reqs+=reqs;tot.dch+=d;tot.lines+=L.length;if(restEq)tot.rest_equal++;if(idsO===idsN)tot.ids_equal++;
   console.log(f.slice(2,7),node.padEnd(28),'requests',reqs,'| prompt chars',d,'| items and rule text equal (372 lines, sentence aside)',restEq,'| requests with new sentence',ruleN,'| ids equal (r372 aside)',idsO===idsN,'| judge lines with 372 checks',L.length);L.forEach(x=>console.log('     ',x));}}
 console.log('TOTAL',JSON.stringify(tot));})();
