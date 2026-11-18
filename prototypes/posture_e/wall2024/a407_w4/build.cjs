// ASK 407 build (plan W3 8683, rev 1 8690; W4 8687, 8689; W1 8688). Operator 12:31 CST order; card 12:32 "Before sonnet (sonnet last)". Offline.
// Six engine nodes; no library, child, connection or model-setting change. Usage: node a407/build.cjs IN OUT
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;const log=[];
const node=nm=>d.nodes.find(n=>n.name===nm);
const rep=(nm,a,b)=>{const n=node(nm);const s=n.parameters.jsCode;const c=s.split(a).length-1;if(c!==1)throw new Error(nm+': found '+c+' times: '+a);n.parameters.jsCode=s.replace(a,()=>b);log.push(nm);};
const C=" /* ASK 407 (operator 12:31 CST 11-18; card 12:32 \"Before sonnet (sonnet last)\"): glm_legal, qwen4max and hy4 added after ember */";
rep('Init Seats',"'ember','sonnet','qwen'];","'ember','glm_legal','qwen4max','hy4','sonnet','qwen'];"+C);
rep('Init Seats',"const __ALT=['haiku','hydrogen','gemini','argon','spark','ember','sonnet'];","const __ALT=['haiku','hydrogen','gemini','argon','spark','ember','glm_legal','qwen4max','hy4','sonnet'];"+C);
rep('Init Seats',"claude:'anthropic',opus:'anthropic'};","claude:'anthropic',opus:'anthropic',glm:'zhipu',qwen:'qwen',qwen4max:'qwen',glm_legal:'zhipu',hy4:'tencent'}; /* ASK 407 (W4 8687 item 5): the debater seats glm, qwen and qwen4max carry their family, so a GLM or Qwen debater bars its own family's judge */");
rep('Init Seats',"ember:'openrouter',sonnet:'openrouter'};","ember:'openrouter',glm_legal:'openrouter',qwen4max:'openrouter',hy4:'openrouter',sonnet:'openrouter'}; /* ASK 407 */");
rep('Accept Build',"'ember','sonnet','qwen'];","'ember','glm_legal','qwen4max','hy4','sonnet','qwen'];"+C+" /* same list as Init Seats ORDER0 */");
for(const nm of ['Resolve Seats','Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt'])rep(nm,"ember:'openrouter',sonnet:'openrouter'};","ember:'openrouter',glm_legal:'openrouter',qwen4max:'openrouter',hy4:'openrouter',sonnet:'openrouter'}; /* ASK 407 */");
for(const nm of new Set(log))acorn.parse(node(nm).parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
fs.writeFileSync(OUT,JSON.stringify(d));console.log('nodes changed:',[...new Set(log)].join(', '),'| edits',log.length);
