// pkgSBP offline tests (W2; WALL-2024 2243 A). Run from pkgSBP. Writes nothing live.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};
const base=fs.readFileSync('base/Send_Back_Record.js','utf8'),pat=fs.readFileSync('patched/Send_Back_Record.js','utf8');const M=JSON.parse(fs.readFileSync('manifest.json','utf8')).nodes[0];
T(sha(base)===M.live_sha&&sha(pat)===M.final_sha,'Send Back Record: live_sha equals the 68fe69cd/426d60c0 text, final_sha equals the patched file');
{const a=pat.indexOf('/* WALL-2024 2243 A'),E="if(m){m[1]=m[1].replace(/\\s+/g,'');m[4]=m[4]||'';}",b=pat.indexOf(E)+E.length;const r=pat.slice(0,a)+"const m=l.match(/SENDBACK\\s*:\\s*(S\\d+)\\s*\\|\\|\\s*(KEEP|CHANGE TO\\s*:?([\\s\\S]*?))\\s*\\|\\|\\s*(.*)$/i);"+pat.slice(b);T(r===base,'reverse edit: only the SENDBACK line pattern changes');}
const run=(code,seats)=>{const B=seats.map(s=>({json:{seat:s.seat,run_token:'t',api_model:'m',msg:'p',items:s.items}}));const R=seats.map(s=>({json:{choices:[{message:{content:s.reply}}]}}));
 const $=n=>({'Judge Enforcer Record':{first:()=>({json:{}})},'Send Back Build':{all:()=>B}})[n];return new Function('$','$input',code)($,{all:()=>R})[0].json;};
const load=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const seatsOf=rows=>{const by={};rows.forEach(r=>{const k=r.run_token+' '+r.seat;(by[k]=by[k]||[]).push(r);});return Object.values(by).map(rs=>({seat:rs[0].seat,reply:(rs.find(r=>r.full_reply)||{}).full_reply||'',items:rs.map((r,k)=>({sid:((r.response_line||'').match(/SENDBACK\s*:?\s*(?:ITEM\s*)?(S\d+)/i)||[])[1]||('S'+(k+1)),rule:r.rule,item:r.item,line:r.flagged_line,reason:''})),rows:rs}));};
// 32980
{const S=seatsOf(load('fixture_sendback_32980.json'));const o=run(pat,S),o0=run(base,S);const sh=o.sb_items.filter(x=>x.seat==='gemini'),sh0=o0.sb_items.filter(x=>x.seat==='gemini');
 T(sh0.every(x=>x.ans==='NO ANSWER')&&sh0.length===17,'32980 gemini on the live reader: 17 NO ANSWER (as logged, ids 3625-3641)');
 const keep=sh.filter(x=>x.ans==='KEEP').map(x=>x.sid);T(sh.filter(x=>x.ans==='CHANGE').length===13&&keep.join()==='S8,S9,S10,S13','32980 gemini on the fixed reader: 13 CHANGE TO and 4 KEEP (S8, S9, S10, S13), as W3 expected ('+keep.join(', ')+')');
 T(sh.find(x=>x.sid==='S17').to.startsWith('RESULT: DEFENDER WINS')&&sh.find(x=>x.sid==='S1').to.startsWith('ANSWER CHECK: Galatians 4:4'),'32980 gemini: S1 and S17 carry their CHANGE TO lines');
 for(const s of ['chatgpt','grok']){const a=o.sb_items.filter(x=>x.seat===s),b=o0.sb_items.filter(x=>x.seat===s);T(JSON.stringify(a)===JSON.stringify(b),'32980 '+s+': every item read exactly as before');}}
// 32949 and 32973: no change
{const S=seatsOf(load('../pkgAPPLY/fixture_sendback_32949_32973.json'));const o=run(pat,S),o0=run(base,S);T(JSON.stringify(o.sb_items)===JSON.stringify(o0.sb_items)&&JSON.stringify(o.sendback.tally)===JSON.stringify(o0.sendback.tally),'32949 and 32973: every send-back item read exactly as before (tally '+JSON.stringify(o.sendback.tally)+')');}
// synthetic variants
{const v=['SENDBACK: S1 || KEEP || r "q"','**SENDBACK: S1** || KEEP || r','SENDBACK S1 || KEEP || r','SENDBACK: ITEM S1 || KEEP || r','SENDBACK: #S1 || KEEP || r','SENDBACK: S 1 || keep || r','SENDBACK: S1: || Change to: D1 vs C1 (x): UNDERDETERMINED || r'];
 const ok=v.map(t=>run(pat,[{seat:'x',reply:t,items:[{sid:'S1',rule:'E-ANS',item:'i',line:'l',reason:''}]}]).sb_items[0].ans);T(ok.slice(0,6).every(a=>a==='KEEP')&&ok[6]==='CHANGE','variants read: plain, bold, no colon, ITEM, #, spaced id, lower-case keep, colon after the id with "Change to" ('+ok.join(', ')+')');
 const n=run(pat,[{seat:'x',reply:'SENDBACK: S12 || KEEP || r',items:[{sid:'S1',rule:'E-ANS',item:'i',line:'l',reason:''}]}]).sb_items[0].ans;T(n==='NO ANSWER','S12 does not answer S1');}
{const o=run(pat,[{seat:'x',reply:'SENDBACK: S1 || CHANGE TO: D1 vs C1 (x): UNDERDETERMINED -- g || because r',items:[{sid:'S1',rule:'E-COL',item:'i',line:'l',reason:''}]}]).sb_items[0];T(o.to==='D1 vs C1 (x): UNDERDETERMINED -- g'&&o.why==='because r','with a closing "|| reason" the line and the reason are split as before');}
console.log(bad?'FAILED '+bad:'ALL OK');
