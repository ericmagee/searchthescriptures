const fs=require('fs');let t=fs.readFileSync('runs.txt','utf8');try{t=JSON.parse(t).result}catch(e){}
let rows=JSON.parse(t.slice(t.indexOf('[{'),t.lastIndexOf('}]')+2));if(rows[0].json_agg)rows=rows[0].json_agg;
const node=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const A=node('/mnt/project-files/wall2024/fetchback_live_s158.json'),B=node('/mnt/project-files/wall2024/parent_s158_WVR3.json');
const run=(code,F)=>new Function('$',code)(nm=>({first:()=>({json:nm==='Init Seats'?{run_token:F.t}:nm==='Resolve Seats'?{deepseek:{api_model:'ds'}}:F}),isExecuted:false}));
let tot=0;for(const F of rows){const a=run(A,F),b=run(B,F);for(let i=0;i<b.length;i++){const j=b[i].json;if(!j.body)continue;const u=j.body.messages[1].content,s=j.body.messages[0].content;const ua=a[i].json.body?a[i].json.body.messages[1].content:'';
 const w=(j.cands||[]).filter(c=>/pkgWVR/.test(c.by));console.log(F.t,j.side,'prompt chars',u.length+s.length,'(+'+(u.length-ua.length)+' vs live)','cands',(j.cands||[]).map(c=>c.id).join(','),'| WVR:',w.map(c=>c.id+' LINK '+c.n+' '+c.earlier_round+' "'+c.earlier_q.slice(0,70)+'" / "'+c.closing_q.slice(0,70)+'"').join(' ;; '));if(w.length)tot+=u.length+s.length;}}
console.log('chars in defender calls with a WVR candidate:',tot);
