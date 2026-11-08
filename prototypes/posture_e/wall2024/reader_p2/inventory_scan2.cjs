// Reader phase 2, SECOND PASS (W2, 11-08): label tests made with string methods (includes, startsWith, endsWith, indexOf, lastIndexOf,
// split, replace, ===/!== against a string literal, switch case) whose string literal names a judge-line label or grade.
// Base: live s59 (fetchback_live_s59.json), library stubs rebuilt with pkgLIB/unpack.cjs; the __RL reader itself is excluded.
// Run: S=<dir holding acorn/node_modules> node reader_p2/inventory_scan2.cjs  -> reader_p2/inventory2_raw.tsv
const S=process.env.S;const acorn=require(S+'/acorn/node_modules/acorn');const walk=require(S+'/acorn/node_modules/acorn-walk');
const fs=require('fs');const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s59.json'));const nodes=(d.nodes||d.data.nodes).filter(n=>/code$/.test(n.type||''));
const UNP=require(__dirname+'/../pkgLIB/unpack.cjs');const LIB=(d.nodes||d.data.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;
const LAB=/^(?:[-•>#*\s]*)(MEANS|ANSWER CHECK|ANSWER|FORCED|RESTATED|RETRACTED|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|CONCEDED|RESULT|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|COLLISION POINTS|COLLISION|CLAUSE|CHAIN MARK|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|FAILS|MEETS|MISSES|SENDBACK|GATE|CHANGE TO|KEEP|STATEMENT|RESPONSE|RULING|PRESSED|NOT PRESSED|PRESSED WITH|SHORT|REASONING|LINK BROKEN|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|BROKEN|WITHDRAWN|UNEXHIBITED|VOID|SPARED|SUPPORTED|COUNTED|TOUCHES NO LINK|STANDS WITHOUT IT|NOT HELD|REASSERTED|CONTRADICTION|GROUND|IMPOSED|CITATION CHECK|OUT-OF-ROUND CONCESSIONS|LINK AUDIT|PREMISE COUNT|ENFORCER|DISAGREE|AGREE|NO VERDICT|HELD|CONTESTED|SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED|FOOTED|FORGED|STRAINED|SLACK|DEFENDER WINS|CHALLENGER WINS)\b/;
const M=new Set(['includes','startsWith','endsWith','indexOf','lastIndexOf','split','replace','replaceAll','search']);
const out=[];
for(const n of nodes){let c=n.parameters.jsCode||'';if(n.name==='Shared Library')continue;if(c.includes('\nreturn await new Function('))c=UNP.rebuild(c,LIB);let ast;
 try{ast=acorn.parse('(async function(){'+c+'\n})',{ecmaVersion:'latest',locations:true,allowReturnOutsideFunction:true});}catch(e){console.error('PARSE',n.name,e.message);continue;}
 const src='(async function(){'+c+'\n})';
 const fnOf=anc=>{if(anc.some(a=>a.type==='VariableDeclarator'&&a.id&&a.id.name==='__RL'))return null;for(let i=anc.length-1;i>=0;i--){const a=anc[i];if(a.type==='FunctionDeclaration'&&a.id)return a.id.name;
   if(a.type==='FunctionExpression'||a.type==='ArrowFunctionExpression'){const p=anc[i-1];if(p&&p.type==='VariableDeclarator')return p.id.name;if(p&&p.type==='Property')return p.key.name||p.key.value;if(p&&p.type==='AssignmentExpression')return src.slice(p.left.start,p.left.end);}}return '(top)';};
 const lit=x=>x&&x.type==='Literal'&&typeof x.value==='string'?x.value:(x&&x.type==='TemplateLiteral'&&x.expressions.length===0?x.quasis[0].value.cooked:null);
 const isLab=s=>s!=null&&s.length<=60&&LAB.test(s)&&/^[^a-z]*$/.test(s.replace(/\s(vs|or|and|of|the)\s/g,' ').replace(/\\[a-z]/g,''));
 walk.fullAncestor(ast,(node,anc)=>{let s=null,how=null;
  if(node.type==='CallExpression'&&node.callee.type==='MemberExpression'&&!node.callee.computed&&M.has(node.callee.property.name)){s=lit(node.arguments[0]);how='.'+node.callee.property.name;}
  else if(node.type==='BinaryExpression'&&/^[!=]==?$/.test(node.operator)){s=lit(node.right)??lit(node.left);how=node.operator;}
  else if(node.type==='SwitchCase'&&node.test){s=lit(node.test);how='case';}
  if(!isLab(s))return;const fn=fnOf(anc);if(fn===null)return;
  const stmt=src.slice(Math.max(0,node.start-60),Math.min(src.length,node.end+40)).replace(/\s+/g,' ');
  out.push({node:n.name,fn,line:node.loc.start.line,how,s,ctx:stmt});});}
// group by function + test
const g=new Map();for(const o of out){const k=o.fn+'\t'+o.how+' '+JSON.stringify(o.s);if(!g.has(k))g.set(k,{fn:o.fn,t:o.how+' '+JSON.stringify(o.s),nodes:new Set(),ctx:o.ctx});g.get(k).nodes.add(o.node);}
const rows=[...g.values()].sort((a,b)=>a.fn.localeCompare(b.fn)||a.t.localeCompare(b.t));
fs.writeFileSync(__dirname+'/inventory2_raw.tsv','function\ttest\tnodes\tnode list\tcontext\n'+rows.map(r=>[r.fn,r.t,r.nodes.size,[...r.nodes].join('|'),r.ctx.slice(0,220)].join('\t')).join('\n')+'\n');
console.log('string-method label tests:',out.length,'distinct (function,test):',rows.length,'functions:',new Set(rows.map(r=>r.fn)).size);
