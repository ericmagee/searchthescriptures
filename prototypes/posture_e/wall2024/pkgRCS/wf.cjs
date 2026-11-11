const fs=require('fs');let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s139.json','utf8'));j=j.data||j;const W=j.workflow||j;
const types={};for(const n of W.nodes){types[n.type]=(types[n.type]||0)+1}console.log(types);
const calls=W.nodes.filter(n=>/httpRequest|executeWorkflow/.test(n.type));
for(const n of calls)console.log(n.type.split('.').pop(),'|',n.name,'|',(n.parameters.url||'').toString().slice(0,80),'|',JSON.stringify(n.parameters.workflowId||'').slice(0,80));
const re=/\.all\(\s*0\s*,|runIndex|\$\(\s*['"][^'"]+['"]\s*\)\.all\(\s*\d/;for(const n of W.nodes){const c=n.parameters.jsCode||'';if(re.test(c))console.log('RUNIDX in',n.name, (c.match(/.{60}(\.all\(\s*0\s*,|runIndex).{60}/)||[''])[0])}
