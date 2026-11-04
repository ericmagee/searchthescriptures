// node tjeb.cjs <exec.json> <s432 Send Back Build.js>: runs base/ and new/ Judge Enforcer Build on a saved live execution's stored node outputs
// (no model call); counts items per rule and seat, calls and not_checked; then runs new/ Judge Enforcer Record on a made-up enforcer reply that
// answers DISAGREE to every E-HOLD and E-KEY id, NO ANSWER to the first E-HOLD id, AGREE to the rest, and feeds the rows to the live s432 Send
// Back Build to check which reach a judge.
const fs=require('fs');const e=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=e.data.resultData.runData;
const one=n=>{const r=rd[n];return r?r[r.length-1].data.main[0]:null;};
const mk=(extra)=>n=>{if(extra&&extra[n])return extra[n];if(n==='Resolve Seats'){const it=one(n);const j=it?it[0].json:{};return {isExecuted:true,first:()=>({json:{...j,deepseek:(j.deepseek&&j.deepseek.api_model)?j.deepseek:{api_model:'deepseek-x',max_tokens:8000}}})};}
 const it=one(n);return {isExecuted:!!it,first:()=>it?it[0]:{json:{}},all:()=>it||[]};};
const run=(src,$,input)=>new Function('$','$input',fs.readFileSync(src,'utf8'))($,input);
const er=one('Enforcer Record');const inp={first:()=>er[0],all:()=>er};
const res={};
for(const d of ['base','new']){const out=run(__dirname+'/../'+d+'/Judge Enforcer Build.js',mk(),inp).map(x=>x.json);
 const ids=out.flatMap(x=>x.ids||[]);const by={};ids.forEach(x=>{const k=x.rule+' '+x.seat;by[k]=(by[k]||0)+1;});
 res[d]={out,ids};console.log(d,'calls',out.length,'not_checked',(out[0].not_checked||[]).length,'chars',out.map(x=>x.body?x.body.messages[1].content.length:0).join('/'));
 console.log('  ',JSON.stringify(by));}
const old=res.base.ids.map(x=>x.rule+'|'+x.seat+'|'+x.item+'|'+x.flagged_line).sort().join('\n');
const kept=res.new.ids.filter(x=>!/^E-(HOLD|KEY)$/.test(x.rule)).map(x=>x.rule+'|'+x.seat+'|'+x.item+'|'+x.flagged_line).sort().join('\n');
console.log('falsifier (b) existing items unchanged:',old===kept);
const B=res.new.out;let firstH=true;
const fake=B.map(b=>({json:{choices:[{message:{content:(b.ids||[]).map(x=>{if(x.rule==='E-HOLD'&&firstH){firstH=false;return 'ENFORCER: '+x.id+' -- NO ANSWER -- RIGHT: BROKEN -- "line gives no ground".';}
 if(/^E-(HOLD|KEY)$/.test(x.rule))return 'ENFORCER: '+x.id+' -- DISAGREE -- RIGHT: '+(x.rule==='E-HOLD'?'UNDERDETERMINED':'BROKEN')+' -- "made of the seed".';return 'ENFORCER: '+x.id+' -- AGREE -- RIGHT: MEETS -- ok.';}).join('\n')}}]}}));
const $r=mk({'Judge Enforcer Build':{isExecuted:true,first:()=>({json:B[0]}),all:()=>B.map(j=>({json:j}))}});
const rec=run(__dirname+'/../new/Judge Enforcer Record.js',$r,{first:()=>fake[0],all:()=>fake})[0].json;
const rows=rec.enf428_rows;const t=rec.enf428.tally;console.log('record tally E-HOLD',JSON.stringify(t['E-HOLD']),'E-KEY',JSON.stringify(t['E-KEY']),'rows',rows.length);
console.log(' sample',rows.find(r=>r.rule==='E-HOLD'&&/DISAGREE/.test(r.cure_reason))?.cure_reason.slice(0,200));
const jerOut=[{json:{...rec}}];
const $s=mk({'Judge Enforcer Record':{isExecuted:true,first:()=>jerOut[0],all:()=>jerOut}});
const sb=run(process.argv[3],$s,{first:()=>jerOut[0],all:()=>jerOut}).map(x=>x.json);
const sent=sb.flatMap(x=>(x.items||[]).map(i=>i.rule));const cnt={};sent.forEach(r=>cnt[r]=(cnt[r]||0)+1);
console.log('send-back items by rule',JSON.stringify(cnt),'not_sent',(sb[0].sb_not_sent||[]).length);
