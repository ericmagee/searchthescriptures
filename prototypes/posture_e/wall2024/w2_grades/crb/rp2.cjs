const fs=require('fs');const R=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgCNP/rounds.cjs')(process.argv[2]);
const node=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const A=node('/mnt/project-files/wall2024/fetchback_live_s156.json'),B=node('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgCRB/parent_s156_CRB2.json');
const run=(code,F)=>new Function('$',code)(nm=>({first:()=>({json:nm==='Init Seats'?{run_token:F.t}:nm==='Resolve Seats'?{deepseek:{api_model:'ds'}}:F}),isExecuted:false}));
module.exports={R,A,B,run};
if(require.main===module){for(const [t,F] of Object.entries(R)){F.t=t;const a=run(A,F),b=run(B,F);
 for(let i=0;i<b.length;i++){const ua=a[i].json.body?a[i].json.body.messages[1].content:'',ub=b[i].json.body?b[i].json.body.messages[1].content:'';
  console.log(t,b[i].json.side,'cands',(b[i].json.cands||[]).map(c=>c.id+'/'+c.closing_round).join(','),'+',ub.length-ua.length);
  if(process.argv[3]&&t.includes(process.argv[3])){const m=ub.match(/CANDIDATES ALREADY NAMED[^]*?########/);console.log(m?m[0]:ub.slice(0,500));}}}}
