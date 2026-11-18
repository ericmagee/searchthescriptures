// ASK 410 harness, step 3: score. Usage: node score.cjs <a410 dir> <OUT dir> <requests.json> <ea_gold.json> <d4_gold.json>
// ea_gold.json: {"<enforcer_row>|<SIDE>|<premise n>": "STATED"|"NOT STATED"|"INFERRED ACT"} (agreed labels; dropped facts left out)
// d4_gold.json: {"<row id>": {"agree": "AGREE"|"DISAGREE", "right": "<grade>"}}
// Criteria (W3 8822 E): 1 FALSE STATED; 2 total errors; 3 form (no parsed line, NO REPLY/call error, verse words not found); 4 stability; 5 cost and time.
const fs=require('fs'),path=require('path');const {parseEA,parseD4}=require('./parse.cjs');
const [D,OUT,RQ,EG,DG]=process.argv.slice(2);
const R=JSON.parse(fs.readFileSync(RQ));const eg=EG&&fs.existsSync(EG)?JSON.parse(fs.readFileSync(EG)):{};const dg=DG&&fs.existsSync(DG)?JSON.parse(fs.readFileSync(DG)):{};
const S={};const st=k=>S[k]||(S[k]={calls:0,callerr:0,empty:0,secs:[],ptok:0,ctok:0,rtok:0,cost:0,reasoning_default:new Set(),EA:{prem:0,noline:0,notfound:0,lines:0,gold:0,false_stated:0,errors:0},PL:{n:0,right:0,detail:[]},D4:{n:0,noline:0,gold:0,wrong_agree:0,wrong_right:0},reads:{}});
for(const r of R){const f=path.join(OUT,r.key+'.json');if(!fs.existsSync(f))continue;const o=JSON.parse(fs.readFileSync(f));const s=st(r.seat);s.calls++;s.secs.push(o.seconds);
 const res=o.response;let txt=null;try{txt=String(res.choices[0].message.content||'');}catch(e){}
 if(o.error||!res||txt===null){s.callerr++;}else if(!txt.trim())s.empty++;
 const u=(res&&res.usage)||{};s.ptok+=u.prompt_tokens||0;s.ctok+=u.completion_tokens||0;s.rtok+=(u.completion_tokens_details&&u.completion_tokens_details.reasoning_tokens)||0;s.cost+=+u.cost||0;
 try{const m=res.choices[0].message;s.reasoning_default.add(m.reasoning||m.reasoning_content?'reasoning returned':'no reasoning text');}catch(e){}
 const user=r.body.messages[1].content;
 if(r.set==='EA'||r.set==='PL'){const P=parseEA(user,txt||'');
  for(const p of P){const k=r.src+'|'+p.side+'|'+p.n;(s.reads[k]||(s.reads[k]=[])).push(p.reading);
   if(r.set==='EA'){s.EA.prem++;s.EA.lines+=p.lines;if(!p.lines)s.EA.noline++;s.EA.notfound+=p.notfound;const g=eg[k];if(g){s.EA.gold++;const rd=p.reading||'NO LINE';if(rd!==g)s.EA.errors++;if(g==='NOT STATED'&&rd!=='NOT STATED')s.EA.false_stated++;}}
   else{const g=(r.plants.find(x=>x.n===p.n)||{}).gold;s.PL.n++;const ok=p.reading===g;if(ok)s.PL.right++;else if(g==='NOT STATED')s.EA.false_stated++;if(!ok)s.EA.errors++;s.PL.detail.push('P'+p.n+' r'+r.rep+' '+(p.reading||'NO LINE')+(ok?'':' (gold '+g+')'));}}}
 else{const ids=[...new Set([...user.matchAll(/\b([BVKYHZPRS]\d+\.\d+)\b/g)].map(m=>m[1]))];const V=parseD4(txt||'',ids);
  for(const row of r.rows){s.D4.n++;const v=V[String(row.item_id).toUpperCase()];const k='D4|'+row.row;(s.reads[k]||(s.reads[k]=[])).push(v?v.v+' '+v.right:null);if(!v)s.D4.noline++;
   const g=dg[row.row];if(g){s.D4.gold++;if(!v||v.v!==g.agree)s.D4.wrong_agree++;if(g.right&&(!v||v.right!==g.right))s.D4.wrong_right++;}}}}
const out={};for(const [seat,s] of Object.entries(S)){const keys=Object.keys(s.reads);const stable=keys.filter(k=>s.reads[k].length===2&&s.reads[k][0]===s.reads[k][1]).length;const pairs=keys.filter(k=>s.reads[k].length===2).length;
 const sec=s.secs.slice().sort((a,b)=>a-b);
 out[seat]={calls:s.calls,call_errors:s.callerr,empty:s.empty,call_error_pct:+(100*(s.callerr+s.empty)/Math.max(1,s.calls)).toFixed(1),
  EA:{...s.EA,form_fail_pct:+(100*(s.EA.noline+s.EA.notfound)/Math.max(1,s.EA.prem)).toFixed(1)},plants:{right:s.PL.right,of:s.PL.n,detail:s.PL.detail},D4:s.D4,
  stability:{same:stable,pairs},tokens:{prompt:s.ptok,completion:s.ctok,reasoning:s.rtok},cost_usd_reported:+s.cost.toFixed(4),seconds_median:sec[Math.floor(sec.length/2)]||null,reasoning_default:[...s.reasoning_default]};}
console.log(JSON.stringify(out,null,1));
