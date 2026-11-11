// pkgACO control: walks the graph from Close Enforcer Record in three cases and checks order and reach, old and new.
// Ifs fixed per case: Regrade After Quotes? (regrade), Anticheat Only? (acx_only dry), Anticheat Needed? both ways.
// All other branching nodes: every output is followed (so reach is an over-estimate; order checks are on all paths).
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const OLD=un(process.argv[2]),NEW=un(process.argv[3]);
function edges(W,cs){const E={};for(const [s,o] of Object.entries(W.connections)){const outs=(o.main||[]);E[s]=[];outs.forEach((a,i)=>{
 if(s==='Regrade After Quotes?'&&i!==(cs.regrade?0:1))return;if(s==='Anticheat Only?'&&i!==(cs.acxOnly?0:1))return;
 (a||[]).forEach(e=>E[s].push(e.node));});}return E;}
function reach(E,start,block){const seen=new Set([start]);const q=[start];while(q.length){const n=q.shift();for(const m of E[n]||[]){if(m===block||seen.has(m))continue;seen.add(m);q.push(m);}}return seen;}
function cyc(E,start){const st={};let found=null;const dfs=n=>{st[n]=1;for(const m of E[n]||[]){if(st[m]===1){found=n+' -> '+m;return;}if(!st[m])dfs(m);if(found)return;}st[n]=2;};dfs(start);return found;}
const K=['Anticheat Record','Build Independent Verdict','Build Save Body','Save to DB','Check Save','Panel Build','Regrade After Quotes?'];
for(const [label,cs] of [['LIVE (regrade false)',{regrade:false,acxOnly:false}],['REGRADE (regrade true)',{regrade:true,acxOnly:false}],['ANTICHEAT-ONLY DRY (regrade true, acx_only true)',{regrade:true,acxOnly:true}]]){
 for(const [v,W] of [['old',OLD],['new',NEW]]){const E=edges(W,cs);const R=reach(E,'Close Enforcer Record');
  const before=(a,b)=>!reach(E,'Close Enforcer Record',a).has(b)&&R.has(b)?'yes':(R.has(b)?'NO':'n/a');
  console.log(label,v,'| reached:',K.filter(k=>R.has(k)).join(', '),'| cycle:',cyc(E,'Close Enforcer Record')||'none',
   '| every path to Build Independent Verdict passes Anticheat Record:',before('Anticheat Record','Build Independent Verdict'),
   '| to Build Save Body:',before('Anticheat Record','Build Save Body'),'| every path to Panel Build passes Check Save:',before('Check Save','Panel Build'),
   '| to Panel Build passes Anticheat Record:',before('Anticheat Record','Panel Build'),'| node count reached',R.size);}}
// regrade path: same node set old and new
const s=(W,cs)=>[...reach(edges(W,cs),'Close Enforcer Record')].sort().join('|');
console.log('REGRADE node set old == new:',s(OLD,{regrade:true})===s(NEW,{regrade:true}),'| LIVE node set old == new:',s(OLD,{regrade:false})===s(NEW,{regrade:false}),'| DRY node set old == new:',s(OLD,{regrade:true,acxOnly:true})===s(NEW,{regrade:true,acxOnly:true}));
const d=[];for(const [s0,o] of Object.entries(NEW.connections))(o.main||[]).forEach((a,i)=>{const b=((OLD.connections[s0]||{}).main||[])[i]||[];if(JSON.stringify(a)!==JSON.stringify(b))d.push(s0+'['+i+']: '+b.map(x=>x.node)+' -> '+a.map(x=>x.node));});console.log('connection changes:',d.length,'\n  '+d.join('\n  '));
