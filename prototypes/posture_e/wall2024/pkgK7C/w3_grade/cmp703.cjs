const fs=require("fs");const S=process.argv[2];const a=JSON.parse(fs.readFileSync(S+"/base703.json","utf8")),b=JSON.parse(fs.readFileSync(S+"/cand703.json","utf8"));
const T=s=>s.replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
const st=JSON.parse(fs.readFileSync("/mnt/project-files/wall2024/ex34703_full.json","utf8")).data.resultData.runData;const srows=JSON.parse(st["Replay Rows"][0].data.main[0][0].json.body).p_rows;
a.rows.forEach((r,i)=>{console.log(r.judge_seat,"| base replay == stored row:",T(JSON.stringify(r))===T(JSON.stringify(srows[i])),"| base == candidate row:",JSON.stringify(r)===JSON.stringify(b.rows[i]));
 if(JSON.stringify(r)!==JSON.stringify(b.rows[i])){for(const k of Object.keys(r))if(JSON.stringify(r[k])!==JSON.stringify(b.rows[i][k])){if(k==="verdict_raw"){const la=r[k].split("\n"),lb=b.rows[i][k].split("\n");console.log("  lines",la.length,lb.length);la.forEach((l,j)=>{if(l!==lb[j])console.log("   -",l.slice(0,260),"\n   +",String(lb[j]).slice(0,260))})}else console.log("  field",k)}}});
for(const k of Object.keys(a.am)){if(JSON.stringify(a.am[k])!==JSON.stringify(b.am[k]))console.log("Alternate Merge field differs:",k)}
const ea=a.am.enforcer_log,eb=b.am.enforcer_log;console.log("log rows",ea.length,eb.length);ea.forEach((r,i)=>{if(JSON.stringify(r)!==JSON.stringify(eb[i]))console.log(" log diff:",r.seat,r.kind,r.rule,r.item,"|",r.cure_status,"->",eb[i].cure_status,"|",String(eb[i].cure_reason).slice(0,120))});
const t=b.am.alternates_tried[0];console.log('tried',t.result,t.why);
