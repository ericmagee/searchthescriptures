// judge_fix7 J4 harness: builds every debate round's request body (D1..D4, C1..C4) with the Build nodes, base (live 9165fb8a) and new, as n8n runs
// them, on run 32302's stored round texts (data/run32302.json) and its verse sheets (rows read from kjv_verses, data/kjv_32302.json). The Anthropic
// direct route is used for both seats, as in 32302 (defender anthropic/claude-sonnet-5.5, challenger anthropic/claude-haiku-5.5).
// Asserts (J4 narrowed): per seat the system is identical in all four rounds; C2's first message equals C1's as sent and D2's equals D1's (the
// earlier one compared without its last-message cache marker); the round 3 and 4 bodies equal the live code's apart from the system; no
// reasoning, effort or thinking field; at most 4 cache_control breakpoints, each ttl 1h. Prints the input token estimate per round.
// Token estimate: the seats' system prompts are not stored (Init with Guards builds them), so the system is a placeholder and its size is the
// measured one (32302 cache diagnostics: Sonnet's dsys 1,226 tokens, the D3 read; Haiku's csys 63,162, the C2..C4 read). Message text is
// counted at a characters-per-token ratio fitted to the measured D2 and C2 calls; the C1 verse sheet (the Oracle seat's served rows, not
// stored) is a placeholder sized from the measured C1 write.
const fs=require('fs');const RN=require('./runner.cjs');const SL=require('./sheetlib.cjs')('base');
const r=JSON.parse(fs.readFileSync(__dirname+'/../data/run32302.json','utf8'));const KJV=JSON.parse(fs.readFileSync(__dirname+'/../data/kjv_32302.json','utf8'));
const RAW={D1:r.claude_r1,C1:r.engine_r1,D2:r.claude_r2,C2:r.engine_r2,D3:r.engine_r3,C3:r.challenger_r3,D4:r.defender_r4,C4:r.challenger_r4};
const strip=t=>String(t).replace(/^(?:DEFENDER|CHALLENGER)[^\n]*--\s*ROUND\s*\d+[^\n]*\n\n/,''); // the stored columns hold the labelled text; the Extract raw is unlabelled
Object.keys(RAW).forEach(k=>RAW[k]=strip(RAW[k]));
const MEAS={D1:{read:2145,write:0,unc:4},C1:{read:0,write:79020,unc:4},D2:{read:2145,write:9605,unc:4},C2:{read:63162,write:14425,unc:4},D3:{read:1226,write:6950,unc:4},C3:{read:63162,write:7281,unc:4},D4:{read:1226,write:6590,unc:4},C4:{read:63162,write:8484,unc:4}};
const SYS_TOK={D:1226,C:63162};const DSYS='[DSYS placeholder: the defender system prompt, 1,226 tokens measured]',CSYS='[CSYS placeholder: the challenger system prompt, 63,162 tokens measured]';
const ORDER=['D1','C1','D2','C2','D3','C3','D4','C4'];
const prevText=k=>ORDER.slice(0,ORDER.indexOf(k)+1).map(x=>RAW[x]);
const plan=k=>SL.SHEET.plan(prevText(k)); // what <k> Extract computes for the next round's sheet
function run(v){const seats={defender:{engine:'claude',profile:'plain',fam:'anthropic',model:'anthropic/claude-sonnet-5.5',tok:64000,mc_seat:'claude_synthesis'},challenger:{engine:'haiku',profile:'oracle',fam:'anthropic',model:'anthropic/claude-haiku-5.5',tok:64000,mc_seat:'haiku'}};
 const IG={topic:'Did Christ have a biological father?',dsys:DSYS,csys:CSYS,sheet_req:[],sheet_off_url:[],sheet_req_c1:['Isaiah 7:14'] /* a one-verse stand-in for the served-row sheet, so C1's message 0 differs from the base C2's rebuilt one, as in the run */,sheet_off_url_c1:[],lab:{D:'DEFENDER',C:'CHALLENGER'}};
 const map={'Init Seats':{run_token:'ODV1-32302-t4gyo690',dpos:'the standard reading',cpos:"the record's reading"},'Init with Guards':IG,'Resolve Seats':{defender:seats.defender,challenger:seats.challenger}};
 const rows=KJV;const out={};
 for(const k of ORDER){const prev=ORDER[ORDER.indexOf(k)-1];
  map[k+' Verse Sheet']=rows;
  const res=RN.runNode(fs.existsSync(__dirname+'/../'+v+'/'+k+' Build.js')?v:'data/live_code',k+' Build',map)[0].json;out[k]=res;map[k+' Build']=res; // a Build fix set 7 does not change runs as live
  map[k+' Extract']={raw:RAW[k],...plan(k)};}
 return out;}
// --- token estimate
const msgText=m=>typeof m.content==='string'?m.content:(m.content||[]).map(b=>b.text||'').join('');
const sysText=b=>(b.system||[]).map(x=>x.text).join('');
const sysTok=(k,b)=>SYS_TOK[k[0]]+Math.max(0,sysText(b).length-(k[0]==='D'?DSYS:CSYS).length)/RATIO[k[0]];
let RATIO={D:4,C:4};let C1X=0,C1M0='';
const tokOf=(k,b,n)=>{const ms=b.messages.slice(0,n==null?b.messages.length:n);return sysTok(k,b)+ms.reduce((a,m)=>a+msgText(m).length,0)/RATIO[k[0]]+4*ms.length+(k[0]==='C'&&ms.length&&C1M0&&msgText(ms[0])===C1M0?C1X:0);};
const norm=m=>({role:m.role,content:msgText(m)});
// the prefix a request shares with the seat's previous request: system blocks, then whole messages (the previous last one compared as text)
function shared(k,b,pb){if(!pb)return 0;const s1=JSON.stringify((b.system||[]).map(x=>x.text)),s0=JSON.stringify((pb.system||[]).map(x=>x.text));
 if(s1!==s0){const f0=(pb.system||[])[0],f1=(b.system||[])[0];return f0&&f1&&f0.text===f1.text?SYS_TOK[k[0]]:0;}
 let n=0;while(n<pb.messages.length&&n<b.messages.length&&JSON.stringify(norm(pb.messages[n]))===JSON.stringify(norm(b.messages[n])))n++;return tokOf(k,b,n);}
// fit the ratios: base D2 (all of it new after D1's 2,149) and base C2 (system 63,162, messages 14,429 with message 0 rebuilt)
{const B=run('base',null);const d2=B.D2.call.body,c2=B.C2.call.body,d1=B.D1.call.body;
 const d2c=d2.messages.reduce((a,m)=>a+msgText(m).length,0)+sysText(d2).length-DSYS.length,d2t=MEAS.D2.read+MEAS.D2.write+MEAS.D2.unc-SYS_TOK.D-4*d2.messages.length;
 const c2c=c2.messages.reduce((a,m)=>a+msgText(m).length,0),c2t=MEAS.C2.read+MEAS.C2.write+MEAS.C2.unc-SYS_TOK.C-4*c2.messages.length;RATIO={D:d2c/d2t,C:c2c/c2t};}
// the C1 sheet: the measured C1 message (79,024 less the system) less the C1 message without a sheet
// (the sheet's verse text is capped at 24,000 characters by SHEET, so it is carried as a token count on C1's message 0 wherever that message is sent)
{const B=run('base',null);const c1=B.C1.call.body;C1M0=msgText(c1.messages[0]);const t=MEAS.C1.read+MEAS.C1.write+MEAS.C1.unc-SYS_TOK.C;C1X=Math.max(0,t-(C1M0.length/RATIO.C+4));}
const OUT={base:run('base',null),new:run('new',null)};
let ok=0,bad=0;const T=(n,c,i)=>{const base=/^base /.test(n);if(!base){c?ok++:bad++;}console.log((c?'OK  ':base?'WAS ':'BAD ')+n+(i!==undefined?' | '+(typeof i==='string'?i:JSON.stringify(i)):''));}; // base lines are the live behaviour (WAS = the fault the item fixes); only new lines count
console.log('ratio fitted: defender '+RATIO.D.toFixed(2)+' chars/token, challenger '+RATIO.C.toFixed(2)+' chars/token; C1 verse sheet (not stored) carried as '+Math.round(C1X)+' tokens on C1\'s message 0');
const keysDeep=(o,acc=[])=>{if(o&&typeof o==='object'){for(const k of Object.keys(o)){acc.push(k);keysDeep(o[k],acc);}}return acc;};
for(const v of ['base','new']){console.log('\n== '+v);
 for(const sd of ['D','C']){const ks=[1,2,3,4].map(n=>sd+n);const bs=ks.map(k=>OUT[v][k].call.body);
  const sys=bs.map(b=>JSON.stringify(b.system));T(v+' '+sd+' system identical in all four rounds',sys.every(x=>x===sys[0]),sys.map(x=>x.length));
  const m1=bs[0].messages[0],m2=bs[1].messages[0];T(v+' '+ks[1]+' first message equals '+ks[0]+'\'s as sent (without '+ks[0]+'\'s last-message marker)',JSON.stringify(norm(m1))===JSON.stringify(m2),JSON.stringify(norm(m1))===JSON.stringify(m2)?'equal':'differs at character '+[...msgText(m1)].findIndex((c,i)=>c!==msgText(m2)[i]));
  if(v==='new')for(const k of [sd+3,sd+4]){const nb={...OUT.new[k].call.body},bb={...OUT.base[k].call.body};delete nb.system;delete bb.system;T('new '+k+' body identical to the live code\'s apart from the system',JSON.stringify(nb)===JSON.stringify(bb),'system '+(JSON.stringify(OUT.new[k].call.body.system)===JSON.stringify(OUT.base[k].call.body.system)?'also identical':'differs'));}
  for(const [k,b] of ks.map((k,i)=>[k,bs[i]])){const kk=keysDeep(b);const badK=kk.filter(x=>/reasoning|effort|thinking/i.test(x));
   const cc=JSON.stringify(b).match(/"cache_control"/g)||[];const ttl=(JSON.stringify(b).match(/"cache_control":\{"type":"ephemeral","ttl":"1h"\}/g)||[]).length;
   T(v+' '+k+' no reasoning, effort or thinking field; cache_control breakpoints '+cc.length+' (max 4), all ttl 1h',!badK.length&&cc.length<=4&&ttl===cc.length,badK.length?badK:undefined);}}}
console.log('\n== input token estimate per round (32302 rounds; system sizes as measured; "read" is the prefix shared with the seat\'s previous request)');
console.log('round | measured 32302 (read / write / total) | base estimate (read / write / total) | new estimate (read / write / total) | messages new');
const tot={base:{r:0,w:0},new:{r:0,w:0},meas:{r:0,w:0}};
for(const k of ORDER){const p=k[1]==='1'?null:k[0]+(+k[1]-1);const row=[k];const m=MEAS[k];row.push(m.read+' / '+m.write+' / '+(m.read+m.write+m.unc));tot.meas.r+=m.read;tot.meas.w+=m.write;
 for(const v of ['base','new']){const b=OUT[v][k].call.body;const pb=p?OUT[v][p].call.body:null;const t=Math.round(tokOf(k,b));const rd=Math.round(k==='D1'?Math.min(t,MEAS.D1.read):(p?shared(k,b,pb):0));const w=t-rd;tot[v].r+=rd;tot[v].w+=w;row.push(rd+' / '+w+' / '+t);}
 row.push(OUT.new[k].call.body.messages.length);console.log(row.join(' | '));}
console.log('totals (read / written): measured '+tot.meas.r+' / '+tot.meas.w+'; base '+tot.base.r+' / '+tot.base.w+'; new '+tot.new.r+' / '+tot.new.w);
const eq=x=>x.r*0.1+x.w*2;console.log('base-input equivalents (1-hour write 2x, read 0.1x): base '+Math.round(eq(tot.base))+', new '+Math.round(eq(tot.new))+', saved '+Math.round(eq(tot.base)-eq(tot.new)));
const d4=Math.round(tokOf('D4',OUT.new.D4.call.body)),c4=Math.round(tokOf('C4',OUT.new.C4.call.body));
console.log('round 4 request size (new, as live): D4 about '+d4+' tokens, C4 about '+c4+' tokens; context window 1,000,000 (Claude Sonnet 5.5, Haiku 5.5, Opus 5.5); max_tokens 64,000; with max_tokens the largest request is '+((Math.max(d4,c4)+64000)/10000).toFixed(1)+'% of the window');
console.log('\n'+ok+' OK, '+bad+' BAD');
