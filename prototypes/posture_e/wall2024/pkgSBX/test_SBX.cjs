// pkgSBX test (reader phase 2, the SENDBACK reply). Run from wall2024/: node pkgSBX/test_SBX.cjs. Part 1 harness from pkgEC2/test_EC2.cjs (run 33040: runs the base and patched Send Back Record (panel, from the saved node output) and Alt Send Back Record
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

 const eqs=(x,y)=>JSON.stringify({...x,sb_rows:x.sb_rows.map(strip)})===JSON.stringify({...y,sb_rows:y.sb_rows.map(strip)});
 const pb=await run('pkgEC2/patched/Send_Back_Record.js','',PASS,B,rep),px=await run('pkgSBX/patched/Send_Back_Record.js','',PASS,B,rep);
 T('panel 33040 whole node: pkgSBX output equals pkgEC2 (rows without the time, sb_items, tally, counts)',eqs(pb,px));
 // alternate (sol): B rebuilt from the logged rows
 const AL=LOG.filter(r=>r.seat==='sol');const r0={run_token:'ODV1-33040-4attrqbw',judge_model:'openai/gpt-6.1-sol',prompt_sent:'(sol send-back prompt, log row 7818)',full_reply:'{\n'+AL.map(r=>r.response_line.replace(/"/g,'\\"')).join('\n')+'\n}'}; /* sol's 17 E-ANS/E-PREM lines from the log (its call also held S18 E-RES and S19 E-CHAIN, rows 7835-7836, left out here) */const rs=x=>(x.cure_reason.match(/\| ENFORCER: ([\s\S]*?) \(ruling 428; the judge keeps/)||[])[1]||'';
 const AB=[{seat:'sol',run_token:r0.run_token,api_model:r0.judge_model,msg:r0.prompt_sent,items:AL.map((x,i)=>({sid:'S'+(i+1),rule:x.rule,item:x.item,line:x.flagged_line,reason:rs(x)}))}];
 const sids=AL.map((x,i)=>{const m=x.response_line&&x.response_line.match(/SENDBACK\s*:?\s*(S\d+)/i);return m&&m[1];});
 const AR=[{choices:[{message:{content:r0.full_reply}}]}];const APASS={...PASS,bodies:PASS.bodies};

 const ab=await run('pkgEC2/patched/Alt_Send_Back_Record.js','Alt ',APASS,AB,AR),ax=await run('pkgSBX/patched/Alt_Send_Back_Record.js','Alt ',APASS,AB,AR);
 T('alternate 33040 whole node (sol, 17 lines from the log): pkgSBX output equals pkgEC2',eqs(ab,ax));
 // part 2: the reply reader alone, old (pkgEC2) vs new (pkgSBX), on every corpus text and the 33040 replies
 const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const plan=JSON.parse(fs.readFileSync('pkgSBX/plan_SBX.json','utf8'));
 T('plan: base and final shas match',plan.nodes.every(n=>sha(fs.readFileSync('pkgEC2/patched/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgSBX/patched/'+n.file,'utf8'))===n.final_sha));
 const reader=f=>{const s=fs.readFileSync(f,'utf8');const h=s.indexOf('B.forEach((b,ci)=>');const a=s.indexOf('const J=/^\\s*[{\\[]/.test(txt);');const z=s.indexOf('\n (b.items||[]).forEach',a);if(a<0||z<0)throw new Error(f+': reader not found');
  const pre=s.startsWith('// pkgSBX')?s.slice(0,s.indexOf('function __sbxRL'))+s.slice(s.indexOf('function __sbxRL'),s.indexOf('\n',s.indexOf('function __sbxRL'))+1):'';return new Function('txt',pre+s.slice(a,z)+'\nreturn A;');};
 const RO=reader('pkgEC2/patched/Send_Back_Record.js'),RN=reader('pkgSBX/patched/Send_Back_Record.js');
 const C=fs.readFileSync('corpus/texts.jsonl','utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));const texts=C.map(o=>[o.run+' '+o.seat+' '+o.src,String(o.jtext!=null?o.jtext:o.text)]);
 for(const r of sb_rows)if(r.full_reply)texts.push(['33040 '+r.seat+' full_reply',r.full_reply]);texts.push(['33040 sol (log)',r0.full_reply]);
 const seen=new Set();let n=0,na=0;const d=[];for(const [k,t] of texts){if(seen.has(t))continue;seen.add(t);const a=RO(t),b=RN(t);if(!Object.keys(a).length&&!Object.keys(b).length)continue;n++;na+=Object.keys(b).length;
  for(const id of new Set([...Object.keys(a),...Object.keys(b)])){const x=JSON.stringify(a[id]||null),y=JSON.stringify(b[id]||null);if(x!==y)d.push(k+' '+id+'\n        old: '+x.slice(0,240)+'\n        new: '+y.slice(0,240));}}
 console.log('   SENDBACK reader on '+n+' distinct texts with answers ('+na+' answers): '+d.length+' differ');d.forEach(x=>console.log('     '+x));
 T('the SENDBACK reader gives the same answers on every corpus text and 33040 reply (or each difference is listed above)',!d.length);
 {const a=RN('S4 || KEEP || the line stands as written.'),b=RO('S4 || KEEP || the line stands as written.');T('unit: a reply line with no SENDBACK label ("S4 || KEEP || ...") is read by the reader (new read; the old pattern needed the label)',a.S4&&a.S4.ans==='KEEP'&&!b.S4);}
 {const t='SENDBACK: S2 || CHANGE TO: D1 vs C1 (Matthew 1:18): STANDS -- the \\"finding\\" is dated || corrected';const a=RN(t),b=RO(t);T('unit: where both read a line, the payload keeps the judge\'s own characters (backslashes included)',a.S2&&b.S2&&a.S2.to===b.S2.to&&a.S2.why===b.S2.why);}
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
