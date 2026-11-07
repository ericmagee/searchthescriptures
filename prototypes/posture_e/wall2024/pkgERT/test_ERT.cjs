// pkgERT test. Run from wall2024/: node pkgERT/test_ERT.cjs
const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s50.json','utf8'));const P=JSON.parse(fs.readFileSync(__dirname+'/patched.nodes.json','utf8'));
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;}else{bad++;}out.push((c?'OK ':'FAIL ')+m);console.log((c?'OK ':'FAIL ')+m);};
const J=W.nodes.find(n=>n.name==='Judge Enforcer Call deepseek');
for(const e of P.nodes){const b=W.nodes.find(n=>n.name===e.name);const keys=[...new Set([...Object.keys(b),...Object.keys(e.node)])].filter(k=>JSON.stringify(b[k])!==JSON.stringify(e.node[k]));
 T(JSON.stringify(keys.sort())===JSON.stringify(['maxTries','retryOnFail','waitBetweenTries']),e.name+': only retryOnFail, maxTries, waitBetweenTries differ ('+keys.join(', ')+')');
 T(['retryOnFail','maxTries','waitBetweenTries','onError'].every(k=>e.node[k]===J[k]),e.name+': retry settings and onError equal Judge Enforcer Call deepseek ('+['retryOnFail','maxTries','waitBetweenTries','onError'].map(k=>k+'='+e.node[k]).join(', ')+')');
 T(e.node.id===b.id&&e.node.type===b.type&&JSON.stringify(e.node.parameters)===JSON.stringify(b.parameters)&&JSON.stringify(e.node.credentials)===JSON.stringify(b.credentials),e.name+': id, type, parameters, credentials unchanged');}
// the engine rule the fix relies on (n8n 2.15.1 workflow-execute.ts): a run whose first output item carries json.error is re-run while tries remain
{const src=__dirname+'/n8n_2.15.1_workflow-execute_excerpt.ts';
 if(fs.existsSync(src)){const s=fs.readFileSync(src,'utf8');T(s.includes('runNodeData.data?.[0]?.[0]?.json?.error !== undefined')&&s.includes('while (nodeFailed && tryIndex !== maxTries - 1)'),'n8n 2.15.1 workflow-execute.ts re-runs a node whose item 0 has json.error (read from the tagged source)');}
 else out.push('(n8n source not on disk; see the cited lines)');}
// 33482: the failed reply is item 0 with json.error, so the rule applies
{const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33482_Enforcer_Call_deepseek.json','utf8'))[0].data.main[0];T(d.length===1&&d[0].json.error==='aborted','33482 Enforcer Call output is one item with json.error "aborted": the retry rule would fire');}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');out.push('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_ERT.txt',out.join('\n')+'\n');
