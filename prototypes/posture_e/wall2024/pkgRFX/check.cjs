// usage: node check.cjs <workflow.json>  exit 0 only if every one of the 17 round Extract nodes holds exactly the text rfx_src.cjs generates,
// and no other node holds a copy of the normalizer (W3 Wall 5379).
const fs=require('fs');const {NODES,gen,span}=require('./rfx_lib.cjs');const w=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
let ok=0,bad=[];for(const nm in NODES){const n=w.nodes.find(x=>x.name===nm);if(!n){bad.push(nm+': missing');continue;}const s=n.parameters.jsCode;let a,b;try{[a,b]=span(s);}catch(e){bad.push(nm+': '+e.message);continue;}
 if(s.slice(a,b)===gen(NODES[nm][0],NODES[nm][1]))ok++;else bad.push(nm+': differs from rfx_src.cjs');}
const MARK=['const __RFX=','/*pkgRHN2*/','placeholder removed by the system'];let outside=0;
for(const n of w.nodes){if(NODES[n.name])continue;const s=JSON.stringify(n.parameters||{});const hit=MARK.filter(m=>s.includes(m));if(hit.length){outside++;bad.push(n.name+': copy outside the 17 ('+hit.join(', ')+')');}}
console.log('RFX check: '+ok+' of 17 equal to rfx_src.cjs; nodes outside the 17 holding a copy: '+outside+(bad.length?'\n  '+bad.join('\n  '):''));process.exitCode=bad.length?1:0;
