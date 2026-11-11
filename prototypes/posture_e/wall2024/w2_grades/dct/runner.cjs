// W2 grade of pkgDCT: for every Code node in the pkgDCT file, what the task runner gives the STUB (runner model) must cover what the trimmed effective source needs.
const fs=require('fs');const {needs}=require(process.cwd()+'/pkgLIB/runner_model.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const T=g('/mnt/project-files/wall2024/parent_s126_DCT.json'),L=g('/mnt/project-files/wall2024/fetchback_live_s126.json');
const fn=n=>n.replace(/[^A-Za-z0-9]+/g,'_')+'.js';let bad=[],n=0,less=0;
for(const nd of T.nodes){const c=nd.parameters&&nd.parameters.jsCode;if(typeof c!=='string'||nd.name==='Shared Library')continue;n++;const eff=fs.readFileSync('w2_grades/dct/trim/'+fn(nd.name),'utf8');
 const gv=needs(c),nd2=needs(eff);const miss=gv.all?[]:[...nd2.nodes].filter(x=>!gv.nodes.has(x));const fl=['env','input','execution','prevNode'].filter(k=>nd2[k]&&!gv[k]&&!gv.all);if(nd2.all&&!gv.all)miss.push('<all nodes>');
 if(miss.length||fl.length)bad.push(nd.name+': '+miss.concat(fl).join(', '));
 const lv=needs(L.nodes.find(x=>x.name===nd.name).parameters.jsCode);if(lv.all!==gv.all||lv.nodes.size!==gv.nodes.size)less++;}
console.log('Code nodes',n,'| stub gives less than the trimmed code needs:',bad.length?bad.join(' ; '):'none','| stubs whose runner set differs from live:',less);
