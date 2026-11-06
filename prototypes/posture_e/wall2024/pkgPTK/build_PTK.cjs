// pkgPTK (W4 ask after run 33175, which ran out of memory in Panel Tokens at 17:30 CST): Panel Tokens and Build Save Body fetch nodes by
// literal name. n8n's task runner reads each $('<name>') with a literal name and sends only those nodes' data; a $() on a computed name
// (here $(n) in a loop) makes it send every node's data, at the run's end where the run is largest. Each computed $(x) becomes __L[x](), a
// table of literal $('<name>') calls, one per name the node can ask for. A name outside the table throws inside the node's own try, as a
// node that has not run does. Base: the n22 finals (pkgBAR build_BAR.cjs on fetchback_n21.json).
// Run from wall2024/: node pkgPTK/build_PTK.cjs [in workflow JSON] [out workflow JSON]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const IN=process.argv[2]||'pkgBAR/out/workflow_BAR.json',OUTW=process.argv[3]||'pkgPTK/out/workflow_PTK.json';
const w=JSON.parse(fs.readFileSync(IN,'utf8'));const N=Object.fromEntries(w.nodes.map(n=>[n.name,n]));
fs.mkdirSync('pkgPTK/patched',{recursive:true});fs.mkdirSync('pkgPTK/base',{recursive:true});const plan={base:IN,nodes:[]};
const COMP=/\$\(\s*(?![\s'"])([^()]*?(?:\([^()]*\))?[^()]*?)\s*\)/g;
const table=names=>{const u=[...new Set(names)].filter(n=>N[n]);return "const __L={"+u.map(n=>JSON.stringify(n)+":()=>$("+JSON.stringify(n).replace(/^"|"$/g,"'")+")").join(',')+"}; /* pkgPTK: literal names only */\n";};
function fix(name,names,expect){const s0=N[name].parameters.jsCode;let k=0;const s1=s0.replace(COMP,(m,x)=>{k++;return '__L['+x+']()';});
 if(k!==expect)throw new Error(name+': '+k+' computed $() calls, expected '+expect);
 const s=table(names)+s1;if(/\$\(\s*[^\s'"]/.test(s.replace(/\$\('(?:[^'\\]|\\.)*'\)/g,'')))throw new Error(name+': a computed $() is left');
 new Function('$','$input','$json',s);fs.writeFileSync('pkgPTK/base/'+name.replace(/ /g,'_')+'.js',s0);fs.writeFileSync('pkgPTK/patched/'+name.replace(/ /g,'_')+'.js',s);
 N[name].parameters.jsCode=s;plan.nodes.push({node:name,base_sha:sha(s0),final_sha:sha(s),computed_calls:k,table:[...new Set(names)].filter(n=>N[n]).length});}
// Panel Tokens: its two name lists, as written in the node
{const s=N['Panel Tokens'].parameters.jsCode;const L1=JSON.parse(s.match(/const NODES=(\[[^\]]*\]);/)[1]);
 const L2=[1,2,3].flatMap(k=>['deepseek','openai','gemini','grok','mimo','openrouter'].map(f=>'Panel Cure Call '+k+' '+f)).concat(['Alternate Call openrouter','Alternate Cure Call openrouter']);
 fix('Panel Tokens',L1.concat(L2),4);}
// Build Save Body: the eight round Extracts and the three Normalizers it sums
{const R=['D1','C1','D2','C2','D3','C3','D4','C4'].map(r=>r+' Extract');fix('Build Save Body',R.concat(['Synthesis Normalizer','Verdict Normalizer','Diagnostic Normalizer']),4);}
fs.mkdirSync('pkgPTK/out',{recursive:true});fs.writeFileSync(OUTW,JSON.stringify(w));fs.writeFileSync('pkgPTK/plan_PTK.json',JSON.stringify(plan,null,1));
for(const p of plan.nodes)console.log(p.node.padEnd(18),p.base_sha,'->',p.final_sha,p.computed_calls+' computed calls, '+p.table+' literal names');
