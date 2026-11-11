const fs=require('fs');let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s139.json','utf8'));j=j.data||j;const W=j.workflow||j;
const isModel=n=>(n.type.endsWith('httpRequest')&&/openrouter\.ai|anthropic\.com|deepseek\.com|wall2024-panel-judge-call/.test(String(n.parameters.url)))||(n.type.endsWith('executeWorkflow'));
const M=W.nodes.filter(isModel).map(n=>n.name);console.log(M.length);console.log(M.join('|'));
for(const n of W.nodes.filter(n=>/^Panel Judge \d|Early Alternate Reply|Panel Judges Fetch/.test(n.name)))console.log(n.type,'|',n.name);
