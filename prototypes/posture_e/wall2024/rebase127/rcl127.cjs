// W2: pkgRCL rev 3 on s127 (after pkgDCT): the s126 RCL insert applied by patch to the trimmed Close Enforcer Build; checks free names, then replays
// Close Enforcer Build on the ten stored exports: RCL-on-s127 must equal RCL-on-s126 output.
const fs=require('fs'),cr=require('crypto');const acorn=require('/opt/node-tools/node_modules/acorn');const walk=require('/opt/node-tools/node_modules/acorn-walk');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const W='/mnt/project-files/wall2024/';const g=f=>{let d=JSON.parse(fs.readFileSync(W+f));d=d.data||d;return d.workflow||d;};
const L=g('fetchback_live_s127.json');const t=fs.readFileSync('rebase127/t_rcl.js','utf8');const t0=L.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
if(fs.readFileSync('rebase127/t.js','utf8')!==t0)throw new Error('t.js is not s127');
const free=s=>{const ast=acorn.parse('async function __w(){'+s+'\n}',{ecmaVersion:'latest'});const d=new Set(),u=new Set();walk.full(ast,n=>{if((n.type==='FunctionDeclaration'||n.type==='FunctionExpression')&&n.id)d.add(n.id.name);if(n.type==='VariableDeclarator')walk.full(n.id,m=>{if(m.type==='Identifier')d.add(m.name);});if(n.params)n.params.forEach(p=>walk.full(p,m=>{if(m.type==='Identifier')d.add(m.name);}));if(n.type==='CatchClause'&&n.param)d.add(n.param.name);});
 walk.ancestor(ast,{Identifier(n,st){const p=st[st.length-2];if(p&&p.type==='MemberExpression'&&p.property===n&&!p.computed)return;if(p&&p.type==='Property'&&p.key===n&&!p.shorthand)return;if(!d.has(n.name))u.add(n.name);}});return u;};
const f0=free(t0),f1=free(t);console.log('free names new in RCL-on-s127 (would be undefined):',[...f1].filter(x=>!f0.has(x)).join(', ')||'none');
const O=JSON.parse(JSON.stringify(L));O.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode=t;const s=JSON.stringify(O);fs.writeFileSync(W+'parent_s127_RCL3.json',s);
const code=X=>X.nodes.reduce((a,n)=>a+(n.parameters.jsCode||'').length,0);console.log('parent_s127_RCL3.json sha',cr.createHash('sha256').update(s).digest('hex').slice(0,16),'| code',code(L),'->',code(O),'=',code(O)-code(L),'| prompt 0 | connections equal',JSON.stringify(O.connections)===JSON.stringify(L.connections));
const r126=g('parent_s126_RCL3.json').nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
(async()=>{let n=0,eq=0,er=0;const S=o=>o&&o.err?JSON.stringify({err:o.err}):JSON.stringify(o);for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync(W+f));const rd=(X.data||X).resultData.runData;if(!rd['Close Enforcer Build'])continue;n++;
 const a=S(await run(r126,'Close Enforcer Build',rd)),b=S(await run(t,'Close Enforcer Build',rd));if(a===b){eq++;if(a.startsWith('{"err"'))er++;}else console.log('DIFF',f);}
 console.log('Close Enforcer Build replays',n,'| RCL s126 == RCL s127',eq,'| of them errors in both',er);})();
