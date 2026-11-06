// pkgEC2 node test on run 33040: runs the base and patched Send Back Record (panel, from the saved node output) and Alt Send Back Record
// (sol, rebuilt from the logged rows), with the saved Panel Cure Normalize outputs for the rounds.
const fs=require('fs'),zlib=require('zlib');const AF=Object.getPrototypeOf(async function(){}).constructor;
let ok=0,bad=0;const T=(n,c,x)=>{console.log((c?'OK  ':'FAIL')+' '+n+(x&&!c?' :: '+x:''));c?ok++:bad++;};
const FX=JSON.parse(zlib.gunzipSync(fs.readFileSync('pkgLIB/fixtures/nodes_33040_full.json.gz'))).nodes;const SB=FX['Send Back Record'][0][0];
const LOG=JSON.parse(fs.readFileSync('pkgEC2/sb_33040.json','utf8'));const UNC=new Set([7669,7709,7710]);
const node=(nm,arr)=>({first:()=>({json:arr[0]}),all:()=>arr.map(json=>({json})),isExecuted:true});
const norm={};for(const k of [1,2,3])norm['Panel Cure Normalize '+k]=node('',FX['Panel Cure Normalize '+k][0].map(x=>x.json||x));
async function run(file,pfx,PASS,B,replies){const src=fs.readFileSync(file,'utf8');const M={[pfx+'Judge Enforcer Record']:node('',[PASS]),[pfx+'Send Back Build']:node('',B),...norm};
 const $=n=>{if(!M[n])throw new Error('no node '+n);return M[n];};return (await new AF('$','$input',src)($,{all:()=>replies.map(json=>({json}))}))[0].json;}
const strip=r=>{const o={...r};delete o.at;return o;};const SUF=/ \| CURE \(record-only until promoted\): (CURED|UNCURED|UNREAD) -- [\s\S]*$/;
function compare(tag,b,p,rowsLog){T(tag+': same row count and same output keys',b.sb_rows.length===p.sb_rows.length&&JSON.stringify(Object.keys(b))===JSON.stringify(Object.keys(p)));
 let other=0,suf=0,miss=[],wrong=[];p.sb_rows.forEach((r,i)=>{const q=b.sb_rows[i];const a=strip(r),c=strip(q);const m=r.cure_reason.match(SUF);
  if(/^(E-ANS|E-PREM)$/.test(r.rule)){if(!m||r.cure_reason.replace(SUF,'')!==q.cure_reason){miss.push(i);return;}suf++;a.cure_reason=q.cure_reason;
   const L=rowsLog.filter(y=>y.seat===r.seat&&y.rule===r.rule&&y.item===r.item&&y.flagged_line===r.flagged_line);const want=L.length===1?(UNC.has(L[0].id)?'UNCURED':'CURED'):'?';if(m[1]!==want)wrong.push((L[0]&&L[0].id)+' '+m[1]+' want '+want);}
  else if(m)miss.push(i);if(JSON.stringify(a)!==JSON.stringify(c))other++;});
 T(tag+': every E-ANS/E-PREM row carries the record-only CURE suffix, and nothing else in any row changes ('+suf+' suffixed)',!miss.length&&!other,'miss '+miss+' other '+other);
 T(tag+': cure_status stays null on every row',p.sb_rows.every(r=>r.cure_status===null));
 T(tag+': each reading matches pkgEC2/test_cure_33040 (UNCURED only 7669, 7709, 7710)',!wrong.length,wrong.join('; '));
 const {sb_rows:x1,sb_items:y1,...b2}=b,{sb_rows:x2,sb_items:y2,...p2}=p;T(tag+': all other output (counts, bodies, sb_items) unchanged',JSON.stringify(b2)===JSON.stringify(p2)&&JSON.stringify(y1)===JSON.stringify(y2));
 return p.sb_rows.filter(r=>SUF.test(r.cure_reason)).map(r=>r.seat+' '+r.rule+' '+r.item+' -> '+r.cure_reason.match(SUF)[0].slice(3,170));}
(async()=>{
 // panel: B rebuilt from the saved sb_items and sb_rows (prompt on each seat's first row), replies from the saved full replies
 const {sb_rows,sb_items,sendback,...PASS}=SB;const seats=[...new Set(sb_items.map(x=>x.seat))];
 const B=seats.map(s=>{const r0=sb_rows.find(r=>r.seat===s&&r.prompt_sent);return {seat:s,run_token:r0.run_token,api_model:r0.judge_model,msg:r0.prompt_sent,items:sb_items.filter(x=>x.seat===s).map(x=>({sid:x.sid,rule:x.rule,item:x.item,line:x.line,reason:x.reason}))};});
 const rep=seats.map(s=>({choices:[{message:{content:sb_rows.find(r=>r.seat===s&&r.full_reply).full_reply}}]}));
 const b=await run('pkgEC2/base/Send_Back_Record.js','',PASS,B,rep),p=await run('pkgEC2/patched/Send_Back_Record.js','',PASS,B,rep);
 T('panel: the base node reproduces the saved live output (rows without the time, sb_items, tally)',JSON.stringify(b.sb_rows.map(strip))===JSON.stringify(sb_rows.map(strip))&&JSON.stringify(b.sb_items)===JSON.stringify(sb_items)&&JSON.stringify(b.sendback)===JSON.stringify(sendback));
 const shown=compare('panel',b,p,LOG);
 // alternate (sol): B rebuilt from the logged rows
 const AL=LOG.filter(r=>r.seat==='sol');const r0={run_token:'ODV1-33040-4attrqbw',judge_model:'openai/gpt-6.1-sol',prompt_sent:'(sol send-back prompt, log row 7818)',full_reply:'{\n'+AL.map(r=>r.response_line.replace(/"/g,'\\"')).join('\n')+'\n}'}; /* sol's 17 E-ANS/E-PREM lines from the log (its call also held S18 E-RES and S19 E-CHAIN, rows 7835-7836, left out here) */const rs=x=>(x.cure_reason.match(/\| ENFORCER: ([\s\S]*?) \(ruling 428; the judge keeps/)||[])[1]||'';
 const AB=[{seat:'sol',run_token:r0.run_token,api_model:r0.judge_model,msg:r0.prompt_sent,items:AL.map((x,i)=>({sid:'S'+(i+1),rule:x.rule,item:x.item,line:x.flagged_line,reason:rs(x)}))}];
 const sids=AL.map((x,i)=>{const m=x.response_line&&x.response_line.match(/SENDBACK\s*:?\s*(S\d+)/i);return m&&m[1];});T('alternate: the rebuilt item numbers match the logged SENDBACK lines',sids.every((s,i)=>!s||s==='S'+(i+1)),sids.join(','));
 const AR=[{choices:[{message:{content:r0.full_reply}}]}];const APASS={...PASS,bodies:PASS.bodies};
 const ab=await run('pkgEC2/base/Alt_Send_Back_Record.js','Alt ',APASS,AB,AR),ap=await run('pkgEC2/patched/Alt_Send_Back_Record.js','Alt ',APASS,AB,AR);
 {const d=ab.sb_rows.map((r,i)=>r.cure_reason===AL[i].cure_reason&&r.response_line===AL[i].response_line?null:AL[i].id).filter(Boolean);T('alternate: the base node reproduces the logged sol rows (cure_reason, response_line)',!d.length,d.join(','));}
 const ashown=compare('alternate',ab,ap,LOG);
 // no rounds: every reading says UNREAD and nothing else changes
 for(const k in norm)norm[k]={first:()=>({json:{}}),all:()=>[],isExecuted:false};const pn=await run('pkgEC2/patched/Send_Back_Record.js','',PASS,B,rep);
 T('no rounds found: the readings say UNREAD and the node still runs',pn.sb_rows.filter(r=>/E-ANS|E-PREM/.test(r.rule)).every(r=>/CURE \(record-only until promoted\): UNREAD -- no rounds/.test(r.cure_reason)));
 fs.writeFileSync('pkgEC2/test_EC2_rows.txt',[...shown,...ashown].join('\n')+'\n');console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
