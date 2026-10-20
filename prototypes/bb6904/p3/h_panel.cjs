// Runs Panel Payloads, live (base/) and new, on three stored panel judgments; prints what differs per seat.
// Usage: node h_panel.cjs <panel json [[id, seat, api_model, md5, verdict_raw] x3]> [askCC 1|0]
// Stubs: no reserve, live (not dry), no regrade, no single-judge row (SJ null), empty round texts; the same for both runs.
const fs=require('fs');const rows=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const askCC=process.argv[3]!=='0';
const slot=['Panel Judge 1 ','Panel Judge 2 ','Panel Judge 3 '];
const judges=rows.map(([,seat,model])=>({seat,api_model:model,body:{messages:[{content:askCC?'... CITATION CHECK, PER SEAT ...':'... no such line asked ...'}]}}));
const resp=rows.map(([,seat,,,text])=>seat==='gemini'?{candidates:[{content:{parts:[{text}]},finishReason:'STOP'}]}:{choices:[{message:{content:text},finish_reason:'stop'}]});
const ranNames=new Set(rows.map(([,seat],i)=>slot[i]+seat));
const $=n=>{const ex=ranNames.has(n);const i=rows.findIndex(([,seat],k)=>slot[k]+seat===n);
 const J={'Init Seats':{run_token:'tok',dry:false},'Panel Build':{debate_id:'d',judges},'Panel Check':{sub:null},'Final Output':{cr1:'',gr2:'',cr3:''}};
 if(n in J)return {first:()=>({json:J[n]}),isExecuted:true};
 if(n==='Regrade Load'||n==='Build Save Body')return {isExecuted:false,first:()=>{throw new Error('not run');}};
 return {isExecuted:ex,all:()=>ex?[{json:resp[i]}]:[],first:()=>({json:ex?resp[i]:{}})};};
const run=f=>new Function('$',fs.readFileSync(__dirname+'/'+f,'utf8'))($)[0].json;
const a=run('base/Panel_Payloads.js'),b=run('Panel_Payloads.new.js');
for(const k of Object.keys({...a,...b}))if(!['bodies','summary'].includes(k)&&JSON.stringify(a[k])!==JSON.stringify(b[k]))console.log('TOP-LEVEL DIFF',k);
a.bodies.forEach((x,i)=>{const pa=JSON.parse(x).payload,pb=JSON.parse(b.bodies[i]).payload;
 const keys=Object.keys({...pa,...pb}).filter(k=>JSON.stringify(pa[k])!==JSON.stringify(pb[k]));
 console.log('==',pa.judge_seat,'payload fields that differ:',keys.join(', ')||'none');
 if(keys.includes('verdict_raw')){const x0=pa.verdict_raw,y0=pb.verdict_raw;console.log(' base is a prefix of new:',y0.startsWith(x0),'; added:');console.log(y0.slice(x0.length).replace(/^\n+/,''));}
 const sa=a.summary[i],sb=b.summary[i];const sk=Object.keys({...sa,...sb}).filter(k=>JSON.stringify(sa[k])!==JSON.stringify(sb[k]));
 console.log(' summary fields that differ:',sk.map(k=>k+' '+(k==='drv'?JSON.stringify((sb.drv||[]).map(d=>d.rule+':'+(d.link||d.side))):JSON.stringify(sa[k])+'->'+JSON.stringify(sb[k]))).join('; '));});
