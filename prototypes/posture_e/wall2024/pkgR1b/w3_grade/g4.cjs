// adversarial: the rebuilt source runs inside new Function('$','$input',...), which sees only $ and $input of the node's own scope. Any other n8n name used by a newly packed source?
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),B=g('/mnt/project-files/wall2024/parent_s119_R1b.json');
const RX=/(?<![\w$.])(\$json|\$execution|\$workflow|\$node|\$now|\$today|\$env|\$items|\$item\b|\$getWorkflowStaticData|\$itemIndex|\$prevNode|\$runIndex|\$vars|\$binary|\$data|\$parameter|\$position|\$jmespath|\$ifEmpty|\$if\b|\$max|\$min|\$evaluateExpression|\$mode|\$nodeVersion|\$secrets|\$response|\$request|\$pageCount|helpers|DateTime|Duration|Interval|items|item|require|arguments|this)(?![\w$])/g;
let tot=0,stubN=0;for(const n of B.nodes){const a=A.nodes.find(x=>x.name===n.name);const ca=a.parameters.jsCode||'',cb=n.parameters.jsCode||'';if(ca===cb||n.name==='Shared Library')continue;stubN++;
 // strip strings, template literals crudely and comments to cut false hits
 const s=ca.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'').replace(/'(?:\\.|[^'\\\n])*'/g,"''").replace(/"(?:\\.|[^"\\\n])*"/g,'""');
 const hits={};for(const m of s.matchAll(RX)){hits[m[1]]=(hits[m[1]]||0)+1;}
 if(Object.keys(hits).length){tot++;console.log(n.name,JSON.stringify(hits));}}
console.log('newly packed',stubN,'| with a hit',tot);
// the same scan on the 41 nodes already packed live (they run today): which names do they use?
const ctx=(nm,word,k=6)=>{const ca=A.nodes.find(x=>x.name===nm).parameters.jsCode;const s=ca.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');const out=new Set();for(const m of s.matchAll(new RegExp('(?<![\\w$.])'+word+'(?![\\w$])','g'))){out.add(s.slice(Math.max(0,m.index-28),m.index+word.length+14).replace(/\s+/g,' '));}return [...out].slice(0,k);};
console.log('--- contexts');for(const [nm,w] of [['D1 Build','items'],['Panel Build','items'],['Panel Build','this'],['Enforcer Build','item'],['Accept Return Build','items'],['Citation Scan','items'],['Build Save Body','item'],['Judge Enforcer Retry Build','item'],['C1B Extract','this']])console.log(nm,w,'::',ctx(nm,w,8).join('  ||  '));
