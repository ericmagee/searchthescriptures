const S=process.env.S; /* S = dir holding node_modules/acorn and acorn-walk; output inv_raw.json there */const acorn=require(S+'/acorn/node_modules/acorn');const walk=require(S+'/acorn/node_modules/acorn-walk');
const fs=require('fs');const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s50.json'));
const nodes=(d.nodes||d.data.nodes).filter(n=>/code$/.test(n.type||''));
const KW=/MEANS|ANSWER|FORCED|RESTATED|KEYSTONE|STANDING|CONCEDED|RESULT|COLLISION|grant|CHAIN MARK|FAILS|SENDBACK|SEND BACK|RETRACT|CORRECTED|REASONING|VERDICT|WINNER|LINK|PREMISE|BROKEN|STANDS|HOLDS|CURE|\[L[123]\]|\[DR|\[CR|STATEMENT|RESPONSE|ROW|CHANGE TO|DECISION|GRADE|K-[A-Z]/i;
const out=[];const UNP=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgLIB/unpack.cjs');const LIBTXT=(d.nodes||d.data.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;
for(const n of nodes){let c=n.parameters.jsCode||'';if(n.name==='Shared Library')continue;if(c.includes('\nreturn await new Function('))c=UNP.rebuild(c,LIBTXT);let ast;
 try{ast=acorn.parse('(async function(){'+c+'\n})',{ecmaVersion:'latest',locations:true,allowReturnOutsideFunction:true});}catch(e){console.error('PARSE',n.name,e.message);continue;}
 const lines=c.split('\n');
 walk.fullAncestor(ast,(node,anc)=>{ if(node.type==='Literal'&&node.regex){const p=node.regex.pattern;if(!KW.test(p))return;
   let fn='(top)',fb=null;const inRL=anc.some(a=>a.type==='VariableDeclarator'&&a.id&&a.id.name==='__RL');if(inRL)return;for(let i=anc.length-1;i>=0;i--){const a=anc[i];if(a.type==='FunctionDeclaration'&&a.id){fn=a.id.name;fb=a;break}
     if((a.type==='FunctionExpression'||a.type==='ArrowFunctionExpression')){fb=a;const p2=anc[i-1];if(p2&&p2.type==='VariableDeclarator')fn=p2.id.name;else if(p2&&p2.type==='Property')fn=p2.key.name||p2.key.value;else if(p2&&p2.type==='AssignmentExpression')fn=c.slice(p2.left.start-17,p2.left.end-17);else continue;break}}
   const body=fb?('(async function(){'+c+'\n})').slice(fb.start,fb.end):'';out.push({node:n.name,fn,line:node.loc.start.line,re:'/'+p+'/'+node.regex.flags,rl:/readLines?\(|__RL\b/.test(body),blen:body.length});}});
}
fs.writeFileSync(S+'/inv_raw.json',JSON.stringify(out));
// group by regex
const g={};for(const o of out){(g[o.re]=g[o.re]||[]).push(o)}
console.log('regex literals with judge keywords:',out.length,'distinct:',Object.keys(g).length);
const byNode={};for(const o of out){byNode[o.node]=(byNode[o.node]||0)+1}
console.log(Object.entries(byNode).sort((a,b)=>b[1]-a[1]).map(x=>x.join(':')).join('\n'));
