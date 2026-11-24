const AC='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/ac/node_modules/';
const acorn=require(AC+'acorn'),es=require(AC+'eslint-scope');const fs=require('fs');const {cut,md5}=require('./cutl2c.js');
const W=JSON.parse(fs.readFileSync(process.argv[2]||'/mnt/project-files/fairjudge/w4build/base_engine.json'));
const free=src=>{const ast=acorn.parse(src,{ecmaVersion:2024,sourceType:'script',ranges:true});const sm=es.analyze(ast,{ecmaVersion:2022});return [...new Set(sm.globalScope.through.map(r=>r.identifier.name))].filter(n=>n!=='L2C').sort();};
const seen={};
for(const x of W.nodes){const s=x.parameters&&x.parameters.jsCode;if(!s||x.name==='Shared Library')continue;const c=cut(s);if(!c)continue;const h=md5(c.st);
 // top-level? parse whole node as async fn body and see if L2C decl is a direct child of body
 let top='?';try{const ast=acorn.parse('(async()=>{'+s+'\n})',{ecmaVersion:2024,allowAwaitOutsideFunction:true,allowReturnOutsideFunction:true});const body=ast.body[0].expression.body.body;top=body.some(st=>st.type==='VariableDeclaration'&&st.declarations.some(d=>d.id.name==='L2C'))?'TOP':'NESTED';}catch(e){top='parseerr '+e.message;}
 const refpAt=s.search(/const REFP\s*=/);const refp=refpAt<0?'none':refpAt<c.i?'before':'after';
 console.log(x.name.padEnd(18),h,top,'REFP',refp,'onError',x.onError||'-','| free:',(seen[h]=seen[h]||free(c.st)).join(','));}
