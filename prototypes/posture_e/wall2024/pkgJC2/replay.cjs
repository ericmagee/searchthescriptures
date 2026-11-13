// pkgJC2 replay: live s182 vs pkgJC2 on the 7 stored runs with a judge-found contradiction call (debate_enforcer_log,
// seat 'judge contradiction enforcer', all rows; 7 runs). Inputs: w2_build/ask181/jcc_rows.json (prompt, reply, rounds).
// usage: node pkgJC2/replay.cjs <live parent> <new parent> <rows json>
const fs=require('fs');const [,,fl,fn,fr]=process.argv;
const ld=f=>{const r=JSON.parse(fs.readFileSync(f,'utf8'));return ((r.data||r).workflow||(r.data||r)).nodes;};
const code=(ns,nm)=>ns.find(n=>n.name===nm).parameters.jsCode;
const L={jcb:code(ld(fl),'Judge Contradiction Build'),jcr:code(ld(fl),'Judge Contradiction Record')};
const N={jcb:code(ld(fn),'Judge Contradiction Build'),jcr:code(ld(fn),'Judge Contradiction Record')};
const runNode=(src,env,input)=>{const $=nm=>{const v=env[nm];if(v===undefined)return {isExecuted:false,first:()=>{throw new Error('not run '+nm);},all:()=>[]};return {isExecuted:true,first:()=>({json:Array.isArray(v)?v[0]:v}),all:()=>(Array.isArray(v)?v:[v]).map(j=>({json:j}))};};
 const $input={first:()=>({json:input[0]}),all:()=>input.map(j=>({json:j}))};return new Function('$','$input',src)($,$input);};
const rows=JSON.parse(fs.readFileSync(fr,'utf8'));
const candsFrom=p=>{const a=p.indexOf('CANDIDATES ALREADY NAMED (answer each one by its id):\n');const t=p.slice(a).split('\n').slice(1);const out=[];
 for(const l of t){const m=l.match(/^(J\d+) -- (DEFENDER|CHALLENGER) -- (\w+) (\S+) -- EARLIER \[([CD]R\d)\] "(.*?)" -- CLOSING \[([CD]R\d)\] "(.*?)" -- named by (.*)$/);if(m)out.push({id:m[1],side:m[2],kind:m[3],n:m[4],earlier_round:m[5],earlier_q:m[6],closing_round:m[7],closing_q:m[8],by:m[9],why:''});else if(/^\s*$/.test(l)&&out.length)break;}return out;};
const rep=t=>({choices:[{message:{content:t}}]});
const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>k==='copy'?undefined:v));
const led=log=>log.filter(r=>/^CONFIRMED( --|$)/.test(String(r.cure_reason||''))).length;
const conf=o=>o.jcc.confirmed.map(x=>x.side+' '+x.link).join(',')||'-';
let fails=0;const ok=(c,msg)=>{if(!c){fails++;console.log('  FAIL '+msg);}};
for(const R of rows){const F=R.f,cands=candsFrom(R.prompt);const B1={cec_skip:false,cands_only:true,answered_before:0,body:{messages:[{role:'system',content:''},{role:'user',content:R.prompt}]},cands,missing_rounds:[],model:'deepseek',run_token:R.run_token,copy:1};
 const B2={...B1,body:{...B1.body,temperature:0.6},copy:2};const base={'Panel Payloads':{},'Final Output':F};
 const live=runNode(L.jcr,{...base,'Judge Contradiction Build':[B1]},[rep(R.reply)])[0].json;
 const one=runNode(N.jcr,{...base,'Judge Contradiction Build':[B1]},[rep(R.reply)])[0].json;
 const both=runNode(N.jcr,{...base,'Judge Contradiction Build':[B1,B2]},[rep(R.reply),rep(R.reply)])[0].json;
 const none2=runNode(N.jcr,{...base,'Judge Contradiction Build':[B1,B2]},[rep(R.reply),rep('CLOSE-CONTRADICTION: NONE')])[0].json;
 const nac=R.reply.split('\n').map(l=>l.replace(/-- CONFIRMED --/,'-- NOT A CONTRADICTION --')).join('\n');
 const opp=runNode(N.jcr,{...base,'Judge Contradiction Build':[B1,B2]},[rep(R.reply),rep(nac)])[0].json;
 const err2=runNode(N.jcr,{...base,'Judge Contradiction Build':[B1,B2]},[rep(R.reply),{error:{message:'planted timeout'}}])[0].json;
 const err1=runNode(N.jcr,{...base,'Judge Contradiction Build':[B1,B2]},[{error:{message:'planted timeout'}},rep(R.reply)])[0].json;
 // stored statuses reproduce
 const st=live.jcc_log.map(r=>r.item+'|'+String(r.cure_reason||'').slice(0,40));const sst=R.logrows.map(r=>r.item+'|'+String(r.cr||'').slice(0,40));
 console.log(R.run_token+': cands '+cands.length+' | live confirmed '+conf(live)+' | stored rows reproduce '+(JSON.stringify(st)===JSON.stringify(sst)));
 ok(JSON.stringify(st)===JSON.stringify(sst),'live harness does not reproduce stored rows');
 ok(JSON.stringify(strip(one))===JSON.stringify(strip(live)),'one-copy path differs from live');
 console.log('  both confirm: confirmed '+conf(both)+' | ledger rows '+led(both.jcc_log)+' (live '+led(live.jcc_log)+') | statuses '+[...new Set(both.jcc.rows.map(x=>x.status))].join('; '));
 ok(conf(both)===conf(live),'both-confirm confirmed set differs');ok(led(both.jcc_log)===led(live.jcc_log),'ledger count differs');
 console.log('  second NONE: confirmed '+conf(none2)+' | '+[...new Set(none2.jcc.rows.map(x=>x.status))].join('; ')+' | log tail '+none2.jcc_log.slice(-1).map(r=>r.item+' '+(r.cure_reason||'').slice(0,40)));
 ok(conf(none2)==='-','one confirmation still breaks a link');
 console.log('  second answers NOT A CONTRADICTION: confirmed '+conf(opp)+' | '+[...new Set(opp.jcc.rows.filter(x=>x.copy===1).map(x=>x.status))].join('; '));
 ok(conf(opp)==='-','opposite answer still breaks');
 console.log('  second errors: confirmed '+conf(err2)+' | errors '+JSON.stringify(err2.jcc.errors)+' | logged '+err2.jcc_log.filter(r=>r.reply_error).map(r=>r.item).join(','));
 ok(conf(err2)==='-'&&err2.jcc_log.some(r=>r.reply_error),'error path');
 console.log('  first errors: confirmed '+conf(err1)+' | statuses '+[...new Set(err1.jcc.rows.map(x=>x.status))].join('; '));
 ok(conf(err1)==='-','first-error path breaks');
}
// Build: candidate and no-candidate on one run's rounds
{const R=rows.find(r=>r.run_token.includes('36212'));const F=R.f;const c=candsFrom(R.prompt)[0];
 const env=v=>({'Init Seats':{run_token:R.run_token},'Resolve Seats':{deepseek:{api_model:'deepseek-x',max_tokens:8000}},'Final Output':F,'Panel Payloads':{bodies:[JSON.stringify({payload:{judge_seat:'terra',verdict_raw:v}})],summary:[]}});
 const line='CONTRADICTION -- '+c.side+' -- EARLIER (['+c.earlier_round+'], "'+c.earlier_q+'") -- LATER (['+c.closing_round+'], "'+c.closing_q+'")';
 const lv=runNode(L.jcb,env(line)),nv=runNode(N.jcb,env(line));
 console.log('BUILD candidate: live items '+lv.length+', new items '+nv.length+' | item 1 equal to live except copy '+(JSON.stringify(strip(nv[0].json))===JSON.stringify(strip(lv[0].json)))+' | item 2 temperature '+nv[1].json.body.temperature+', otherwise equal to item 1 '+(JSON.stringify({...nv[1].json,body:{...nv[1].json.body,temperature:0},copy:1})===JSON.stringify(nv[0].json)));
 ok(nv.length===2&&JSON.stringify(strip(nv[0].json))===JSON.stringify(strip(lv[0].json)),'build candidate');
 const ln=runNode(L.jcb,env('no contradiction here')),nn=runNode(N.jcb,env('no contradiction here'));
 console.log('BUILD no candidate: byte-equal to live '+(JSON.stringify(ln)===JSON.stringify(nn))+' ('+JSON.stringify(nn[0].json).slice(0,120)+')');ok(JSON.stringify(ln)===JSON.stringify(nn),'no-candidate build differs');
 const lr=runNode(L.jcr,{'Panel Payloads':{x:1},'Judge Contradiction Build':ln.map(x=>x.json)},[]),nr=runNode(N.jcr,{'Panel Payloads':{x:1},'Judge Contradiction Build':nn.map(x=>x.json)},[]);
 console.log('RECORD no candidate: byte-equal to live '+(JSON.stringify(lr)===JSON.stringify(nr)));ok(JSON.stringify(lr)===JSON.stringify(nr),'no-candidate record differs');}
// W3 F1 plant: first check confirms J1 on a link, second confirms a different id J9 on the same link and is silent on J1
{const R=rows.find(r=>r.run_token.includes('35554'));const F=R.f,cands=candsFrom(R.prompt);const B1={cec_skip:false,cands_only:true,answered_before:0,body:{messages:[{},{content:R.prompt}]},cands:[...cands,{...cands[1],id:'J9'}],missing_rounds:[],model:'deepseek',run_token:R.run_token,copy:1};const B2={...B1,copy:2};
 const l1=R.reply.split('\n').find(l=>/J2 -- DEFENDER -- LINK 4 -- CONFIRMED/.test(l));const l9=l1.replace('J2 --','J9 --');
 const o=runNode(N.jcr,{'Panel Payloads':{},'Final Output':F,'Judge Contradiction Build':[B1,B2]},[rep(l1),rep(l9)])[0].json;
 console.log('W3 F1 plant (J2 by check 1, J9 by check 2, both DEFENDER LINK 4): confirmed '+conf(o)+' | '+o.jcc.rows.map(x=>x.id+' '+x.status).join('; '));ok(conf(o)==='-','F1 plant still breaks');
 const o2=runNode(N.jcr,{'Panel Payloads':{},'Final Output':F,'Judge Contradiction Build':[B1,B2]},[rep(l1),rep(l1)])[0].json;
 console.log('control (J2 by both checks): confirmed '+conf(o2)+' | '+o2.jcc.rows.map(x=>x.id+' '+x.status).join('; '));ok(conf(o2)==='DEFENDER 4','control');}
console.log(fails?'FAILS '+fails:'ALL CHECKS PASS');
