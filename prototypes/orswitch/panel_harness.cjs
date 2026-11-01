// Runs the patched Panel Build on stored run 30196 with a three-judge panel, logging every upstream field it reads that the mock lacks.
const fs=require('fs');
const code=fs.readFileSync(process.argv[2]||'new/Panel Build.js','utf8');
const meta=JSON.parse(fs.readFileSync('../bb8792/a3/g1/meta.json','utf8'));
const r=JSON.parse(fs.readFileSync('../bb8792/a3/s5/rounds.json','utf8'))[0];
const miss=new Set();
const P=(name,o)=>new Proxy(o,{get:(t,k)=>{if(typeof k==='string'&&!(k in t)&&!['then','toJSON','constructor'].includes(k))miss.add(name+'.'+k);return t[k];}});
const F=P('F',{topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3});
const IG=P('IG',{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[],topic:meta.topic});
const seats=JSON.parse(process.argv[3]||'[["mimo","openrouter","xiaomi/mimo-v2.6-pro"],["grok","openrouter","x-ai/grok-4.7"],["gemini","openrouter","google/gemini-3.8-flash"]]');
const RS=P('RS',{judges:seats.map(([seat,fam,m])=>({seat,fam,api_model:m,max_tokens:32000}))});
const S=P('S',{run_token:r.run_token,topic:meta.topic,rulebook:'current'});
const nodes={'Final Output':F,'Init with Guards':IG,'Init Seats':S,'Resolve Seats':RS,'Quote Report':{unavailable:true},'Check Save':{debate_id:'test'}};
const $=n=>{if(n==='Regrade Load')return{isExecuted:false};if(!(n in nodes))throw new Error('unmocked '+n);return{first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}]};};
let out; try{out=new Function('$','$input','$json',code)($,{first:()=>({json:F})},F);}catch(e){console.log('THREW',e.message);}
console.log('missing fields read:',[...miss].join(', ')||'none');
if(out){const o=out[0].json; fs.mkdirSync('panel',{recursive:true});
 for(const j of o.judges){console.log(j.seat,j.fam,'jidx',j.jidx,'jidx0',j.jidx0,JSON.stringify(Object.fromEntries(Object.entries(j.body).filter(([k])=>k!=='messages'))),j.body.messages.map(m=>m.role+':'+m.content.length).join(' '));
  fs.writeFileSync(`panel/${j.seat}.json`,JSON.stringify(j.body));}}
