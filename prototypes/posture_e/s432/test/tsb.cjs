// node tsb.cjs <exec.json>: runs Send Back Build on a saved live execution's stored node outputs (no model call), then Send Back Record on
// a made-up reply that answers S1 KEEP and S2 CHANGE for each judge, to check the parse and the rows.
const fs=require('fs');const e=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=e.data.resultData.runData;
const one=n=>{const r=rd[n];return r?r[r.length-1].data.main[0]:null;};
const mk=(extra)=>n=>{if(extra&&extra[n])return extra[n];const it=one(n);return {isExecuted:!!it,first:()=>it?it[0]:{json:{}},all:()=>it||[]};};
const run=(file,$,input)=>new Function('$','$input',fs.readFileSync(file==='Send Back Build.js'?__dirname+'/../new/'+file:__dirname+'/../../s430/new/'+file,'utf8'))($,input);
const jer=one('Judge Enforcer Record');const $1=mk();
const out=run('Send Back Build.js',$1,{first:()=>jer[0],all:()=>jer});
const b=out.map(x=>x.json);
console.log('items out',b.length,'skip',b[0].sb_skip,b[0].sb_why||'','not_sent',(b[0].sb_not_sent||[]).length);
b.filter(x=>!x.sb_skip).forEach(x=>console.log(' seat',x.seat,'items',x.items.length,'msgs',x.body.messages.length,'roles',x.body.messages.map(m=>m.role).join(','),'msg chars',x.msg.length,'| S1',x.items[0].rule,'|',x.items[0].reason.slice(0,120)));
const PLAIN='**SENDBACK: S1 || KEEP || "made of the seed of David according to the flesh" decides it.**\nSENDBACK: S2 || CHANGE TO: D5 vs C1 -- MISSES -- the answer rests on an absence || "It does not say through whom" is an absence.';
// mode "json" (WALL-1963 reply 1965 DEFECT 1): the same two lines wrapped in a JSON verdict string, as Panel Cure Call 2 answered in run 32725
const BODY=process.argv[3]==='json'?JSON.stringify({verdict_tag:'HELD',reasoning:PLAIN},null,2):PLAIN;
const fake=b.filter(x=>!x.sb_skip).map(x=>({json:{choices:[{message:{content:BODY}}]}}));
const $2=mk({'Send Back Build':{isExecuted:true,first:()=>out[0],all:()=>out},'Judge Enforcer Record':{isExecuted:true,first:()=>jer[0],all:()=>jer}});
const rec=run('Send Back Record.js',$2,{first:()=>fake[0],all:()=>fake})[0].json;
console.log('record',JSON.stringify(rec.sendback),'rows',rec.sb_rows.length,'| alt_needed kept:',rec.alt_needed===jer[0].json.alt_needed);
console.log(' sample',rec.sb_rows.filter(r=>r.cure_reason.startsWith('SEND-BACK CHANGE'))[0]?.cure_reason.slice(0,260));
