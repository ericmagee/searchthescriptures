// Each new call-node expression that reads only $json, evaluated in n8n's expression engine on a Gemini judge-shaped body. No model call.
const {Workflow}=require(process.argv[2]+'/node_modules/n8n-workflow');const NB=require(__dirname+'/new_bodies.json');
const nt={getByName:()=>({description:{properties:[]}}),getByNameAndVersion:()=>({description:{properties:[]}}),getKnownTypes:()=>({})};
const wf=new Workflow({nodes:[{name:'X',type:'n8n-nodes-base.httpRequest',typeVersion:4,position:[0,0],parameters:{}}],connections:{},active:false,nodeTypes:nt});
const b={model:'google/gemini-3.8-flash',session_id:'s',messages:[{role:'system',content:'S'},{role:'user',content:'T'.repeat(3000)}]};
const J={call:{body:b},cure:{body:b},alt:{body:b},acc:{body:b},body:b};let bad=0,n=0,skip=[];
for(const [nm,[k,e]] of Object.entries(NB)){if(/\$\(/.test(e)){skip.push(nm);continue;}n++;
 try{const r=wf.expression.getParameterValue(e,null,0,0,'X',[{json:J}],'manual',{});const ok=r&&r.messages&&Array.isArray(r.messages[1].content)&&r.messages[1].content[0].cache_control;if(!ok){bad++;console.log('NOT MARKED',nm);}}catch(x){bad++;console.log('THREW',nm,x.message);}}
console.log('evaluated',n,'bad',bad,'| use $() refs, prefix-only test:',skip.length);process.exit(bad);
