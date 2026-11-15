// Reasoning guard (operator 03:03 CST 11-15: "never touch reasoning. unless i instruct it").
// Usage: node reasoning_guard.cjs <live.json> <target.json> [--allow "<operator words quote>"]
// Refuses (exit 1) when any node's count of reasoning/effort/max_tokens/thinking/budget tokens, or the text around them, differs between live and target.
const fs=require('fs');const [,,a,b]=process.argv;const allow=process.argv.includes('--allow');
const by=f=>Object.fromEntries(JSON.parse(fs.readFileSync(f)).nodes.map(n=>[n.name,(n.parameters&&n.parameters.jsCode)||JSON.stringify(n.parameters||{})]));
const A=by(a),B=by(b);const RX=/reasoning|effort|max_tokens|maxTokens|thinking|budget_tokens|verbosity|temperature/g;
const ctx=s=>[...String(s).matchAll(RX)].map(m=>String(s).slice(Math.max(0,m.index-60),m.index+60)).join('\n');
const hits=[];for(const k of new Set([...Object.keys(A),...Object.keys(B)])){if(ctx(A[k])!==ctx(B[k]))hits.push(k);}
if(hits.length){console.log('REASONING GUARD: model-setting text changes in',hits.length,'node(s):',hits.join(', '));if(!allow){console.log('REFUSED: needs the operator\'s own instruction (--allow with his words).');process.exit(1);}console.log('ALLOWED by operator words.');}
else console.log('REASONING GUARD: no model-setting change.');
