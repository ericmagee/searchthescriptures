// pkgPDS reach check: with a group's first Build node removed from the graph, no Resume node of that group may be reachable from a trigger
// (else a Resume could run before its Build). Usage: node reach.cjs <pkg json>
const fs=require('fs');let w=JSON.parse(fs.readFileSync(process.argv[2]));w=w.data||w;const C=w.connections;
const trig=w.nodes.filter(n=>/trigger|webhook/i.test(n.type)).map(n=>n.name);
const reach=(cut)=>{const seen=new Set(),st=[...trig];while(st.length){const n=st.pop();if(seen.has(n)||n===cut)continue;seen.add(n);for(const a of ((C[n]||{}).main||[]))for(const c of (a||[]))st.push(c.node);}return seen;};
console.log('triggers',trig);
for(const [cut,res] of [['Close Enforcer Build',['Close Enforcer Resume','Anticheat Resume','Assume Check Resume']],['Enforcer Build',['Enforcer Resume','Judge Enforcer Resume']]]){const s=reach(cut);console.log('without',cut,':',res.map(r=>r+' reachable '+s.has(r)).join('; '));}
const all=reach(null);console.log('all Resume nodes reachable with the full graph:',['Close Enforcer Resume','Anticheat Resume','Assume Check Resume','Enforcer Resume','Judge Enforcer Resume'].every(r=>all.has(r)));
