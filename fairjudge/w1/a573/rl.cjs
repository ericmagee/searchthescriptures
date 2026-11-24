// ASK 573 probe: the __RL statement in every code node of engine (with 563's Build Save Body) and child; identity, place, free names.
const NM='/home/claude/searchthescriptures/node_modules/';const acorn=require(NM+'acorn');let es=null;try{es=require(NM+'eslint-scope')}catch(e){}
const fs=require('fs'),cr=require('crypto');const SP='/tmp/claude-0/-home-claude/25c53118-408e-5b9f-a314-6593b8f02ba2/scratchpad/';
const eng=JSON.parse(fs.readFileSync(SP+'a572/eng.json')),ch=JSON.parse(fs.readFileSync(SP+'a572/child.json'));
const d=JSON.parse(fs.readFileSync('/root/.claude/projects/-home-claude/25c53118-408e-5b9f-a314-6593b8f02ba2/tool-results/mcp-n8n-get_workflow_versions_diff-1795478515387-33fhgi.txt'));
eng.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode=d.nodesModified[0].changes.parameters.jsCode.__new; // live d8292f62
const out={};
for(const [w,tag] of [[eng,'E'],[ch,'C']])for(const n of w.nodes){const s=n.parameters&&n.parameters.jsCode;if(!s||n.name==='Shared Library'||s.indexOf('__RL')<0)continue;
 const pre='(async function(){\n';const ast=acorn.parse(pre+s+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});const body=ast.body[0].expression.body.body;
 let hit=null,where='';const walk=(arr,path)=>{for(const st of arr){if(st.type==='TryStatement'){walk(st.block.body,path+'try>');continue}if(st.type==='VariableDeclaration'&&st.declarations.some(x=>x.id.name==='__RL')){hit=st;where=path||'top'}}};walk(body,'');
 const uses=(s.match(/__RL\b/g)||[]).length;
 if(!hit){console.log(tag,n.name,'uses __RL',uses,'but no declaration');continue}
 const src=(pre+s).slice(hit.start,hit.end);const md5=cr.createHash('md5').update(src).digest('hex');out[tag+':'+n.name]=src;
 const before=s.slice(0,hit.start-pre.length);const line=before.split('\n').length;
 console.log(tag,n.name.padEnd(36),'len',src.length,'md5',md5.slice(0,8),'where',where,'starts line',line,'node len',s.length,'refs to __RL',uses);}
const t=[...new Set(Object.values(out))];console.log('distinct texts',t.length);
if(es){const ast=acorn.parse(t[0],{ecmaVersion:2024,sourceType:'script'});const sm=es.analyze(ast,{ecmaVersion:2022});console.log('free names:',[...new Set(sm.globalScope.through.map(r=>r.identifier.name))].sort().join(','))}
fs.writeFileSync('rl_text.js',t[0]);
