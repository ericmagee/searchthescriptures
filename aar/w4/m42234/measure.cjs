// W4 offline measure (no n8n call): build the panel judge request bodies and the close enforcer body
// from a stored debate_results row with the live engine's own node code (ff7ab4cf), stub inputs.
const fs=require('fs');const W=require('/mnt/project-files/ask588/w4/fixqr/fetchback_eng_fixqr.json');
const code=n=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const LIB=code('Shared Library');
const row=JSON.parse(fs.readFileSync(process.argv[2],'utf8'))[0];
const run=(src,nodes)=>{const $=n=>{const it=nodes[n];const ex=it!==undefined;return {isExecuted:ex,params:{jsCode:n==='Shared Library'?LIB:''},first:()=>{if(!ex)throw new Error('stub missing: '+n);return {json:it[0]};},all:()=>(it||[]).map(json=>({json})),item:{json:(it||[{}])[0]}};};
 const $execution={customData:{set(){}},id:'0'};const $input={all:()=>[{json:{}}],first:()=>({json:{}})};
 return new Function('$','$input','$execution','return (async()=>{\n'+src+'\n})();')($,$input,$execution);};
const S={run_token:row.run_token,topic:row.topic,defender:{engine:row.defender_engine,profile:row.defender_profile},challenger:{engine:row.challenger_engine,profile:row.challenger_profile},panel_expected:row.panel_expected.slice().sort(),dpos:'',cpos:'',dry:true,posture:false};
const JUD=[['sol','openai/gpt-5.5'],['sol62','openai/gpt-6.2'],['spark','meta-llama/x']].map(([seat,api_model])=>({seat,api_model,fam:'openrouter',max_tokens:16000}));
const RS={judges:JUD,gt:'',tt:'',enforcer:{api_model:'enforcer/x',max_tokens:16000}};
const nodes={'Shared Library':[{}],'Init Seats':[S],'Resolve Seats':[RS],'Regrade Row':[row],'Regrade Judgments':[],'Regrade Served Conclusions':[],'Regrade Served Sights':[]};
(async()=>{const RL=await run(code('Regrade Load'),nodes);const rl=(Array.isArray(RL)?RL:[RL])[0].json;nodes['Regrade Load']=[rl];
return run(code('Panel Build'),nodes);})().then(r=>{const o=r[0].json;const out={run:row.run_token,rounds_chars:['engine_r1','engine_r2','claude_r1','claude_r2','engine_r3','challenger_r3','defender_r4','challenger_r4'].reduce((a,k)=>a+String(row[k]||'').length,0),transcript_chars:o.transcript_chars,judges:o.judges.map(j=>({seat:j.seat,body_chars:JSON.stringify(j.body).length,system_chars:(j.body.messages||[]).filter(m=>m.role==='system').reduce((a,m)=>a+m.content.length,0),user_chars:(j.body.messages||[]).filter(m=>m.role==='user').reduce((a,m)=>a+m.content.length,0)}))};
 nodes['Panel Build']=[o];
 try{const CE=run(code('Close Enforcer Build'),Object.assign({},nodes));return Promise.resolve(CE).then(c=>{const j=(c&&c[0]&&c[0].json)||{};out.close_enforcer=c.map(x=>x.json).map(x=>x.cec_skip?{skip:x.why}:{side:x.side,copy:x.copy,body_chars:JSON.stringify(x.body).length});return out;});}catch(e){out.close_enforcer_error=String(e.message).slice(0,300);return out;}
}).then(o=>console.log(JSON.stringify(o,null,1))).catch(e=>console.log('ERR',e.message.slice(0,500)));
