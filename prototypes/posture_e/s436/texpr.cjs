// Evaluates the s436 call-node expression in n8n's own expression engine (n8n-workflow), on plain bodies. No model call.
const path=process.argv[2];const {Workflow}=require(path+'/node_modules/n8n-workflow');const fs=require('fs');
const W=fs.readFileSync(__dirname+'/wrap.txt','utf8');const expr='={{ '+W+'($json.call.body) }}';
const nt={getByName:()=>({description:{properties:[]}}),getByNameAndVersion:()=>({description:{properties:[]}}),getKnownTypes:()=>({})};
const wf=new Workflow({nodes:[{name:'X',type:'n8n-nodes-base.httpRequest',typeVersion:4,position:[0,0],parameters:{}}],connections:{},active:false,nodeTypes:nt});
const ev=b=>wf.expression.getParameterValue(expr,null,0,0,'X',[{json:{call:{body:b}}}],'manual',{});
const big='DEBATE TRANSCRIPT\n\n'+'x'.repeat(5000);const sysArr=[{type:'text',text:'S',cache_control:{type:'ephemeral'}}];
const cases=[
 ['gemini judge',{model:'google/gemini-3.8-flash',session_id:'t:panel:gemini',messages:[{role:'system',content:sysArr},{role:'user',content:big}]}],
 ['gemini cure',{model:'google/gemini-3.8-flash',session_id:'s',messages:[{role:'system',content:sysArr},{role:'user',content:big},{role:'assistant',content:'J'},{role:'user',content:'cure ask'}]}],
 ['openai judge',{model:'openai/gpt-6.1-terra',session_id:'s',messages:[{role:'system',content:'S'},{role:'user',content:big}]}],
 ['grok judge',{model:'x-ai/grok-4.7',session_id:'s',messages:[{role:'system',content:'S'},{role:'user',content:big}]}],
 ['glm judge',{model:'z-ai/glm-5.3',session_id:'s',messages:[{role:'system',content:'S'},{role:'user',content:big}]}],
 ['qwen judge',{model:'qwen/qwen3.8-max-0902',messages:[{role:'system',content:sysArr},{role:'user',content:big}]}],
 ['string body',"not an object"],
];
let bad=0;for(const [n,b] of cases){let r;try{r=ev(b);}catch(e){console.log(n,'THREW',e.message);bad++;continue;}
 const out=typeof r==='string'?r:JSON.stringify(r);const o=typeof r==='object'?r:null;
 const marked=o&&o.messages?o.messages.map((m,i)=>Array.isArray(m.content)&&m.content.some(p=>p.cache_control)?i:null).filter(x=>x!==null):[];
 console.log(n.padEnd(12),'| marked msgs',JSON.stringify(marked),'| provider',o&&o.provider?JSON.stringify(o.provider):'-','| session',o&&o.session_id||'-','| input unchanged',JSON.stringify(b).length>0 && (typeof b!=='object'||!JSON.stringify(b).includes('"text":"DEBATE')) );}
process.exit(bad);
