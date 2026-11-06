// WALL-2024 silence count, offline tests (W2). argv[2]: live fetch of 683c995f. Run from the wall2024 dir. Writes nothing live.
// Fixture pkgS/fixture_32949_cure_rows.json: debate_enforcer_log kind 'cure' rows of run 32949 (panel and alternate seats) and each distinct cure reply.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};W.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const plan=JSON.parse(fs.readFileSync('pkgS/plan_S.json','utf8'));const pat=n=>fs.readFileSync('pkgS/patched/'+n.replace(/ /g,'_')+'.js','utf8');
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
T(W.versionId.startsWith('683c995f'),'base is live 683c995f ('+W.versionId+')');
T(plan.nodes.length===17&&plan.nodes.filter(x=>x.edits>=4).length===14&&plan.nodes.find(x=>x.name==='Cure Check').edits===7,'17 nodes carry the status table; 14 hold cureVerdicts and CURE_FORM (4 edits each); Cure Check has 3 more for the single judge');
T(plan.nodes.every(x=>sha(LN[x.name])===x.live_sha&&sha(pat(x.name))===x.final_sha),'every live_sha equals this fetch, every final_sha equals the patched file');
const nodesWithA=W.nodes.filter(n=>(n.parameters&&n.parameters.jsCode||'').includes("const enfUncured=v=>")).map(n=>n.name).sort();
T(JSON.stringify(nodesWithA)===JSON.stringify(plan.nodes.map(x=>x.name).sort()),'no node that defines enfUncured is left out');
// reverse: undoing the three edits gives the live text back
const E=[["const enfUncured=v=>(v||[]).filter(x=>x&&x.status!=='CURED'&&enfLive(x)).length;",/\/\/ WALL-2024 silence count \(Eric[\s\S]*?const enfUncured=v=>\(v\|\|\[\]\)\.filter\(x=>x&&x\.status!=='CURED'&&\(enfLive\(x\)\|\|enfSilent\(x\)\)\)\.length;/],
 ["const enfTrialWhy=(x,why)=>enfLive(x)?why:'TRIAL rule (recorded and answered; it removes no seat)'+(why?': '+why:'');",/const enfTrialWhy=\(x,why\)=>enfLive\(x\)\?why:\(enfSilent[^\n]*?\+\(why\?': '\+why:''\);/],
 ["  if(!respOf(x))return res('UNCURED','no written response',null);",/  if\(!respOf\(x\)\)\{const z=res\('UNCURED','no written response',null\);z\.silent=!o\.malformed\.find\(l=>cureOwn\(l,x\)\);return z;\} \/\/ WALL-2024 silence count: silent unless the judge wrote a refused line for this item/]];
const SENT="An item you leave without a RESPONSE line counts against your seat, under every rule, as an unanswered item of a live rule does, and your seat may be replaced. If you hold an item wrong, write NOT HELD with your reason. That is an answer. Write it on that item's RESPONSE line: RESPONSE: <the flagged item, as labelled above> | NOT HELD: <your reason>.";
E.push(['Any other text is recorded only.";',{[Symbol.replace]:(s,f)=>s.split('Any other text is recorded only. '+SENT+'";').join(f())}]);
const CCrev=s=>s.replace(/const __drvU=enfUncured\(v\);[^\n]*\nconst __silL=[^\n]*\n/,'').replace(".concat(__silL).join(",".join(").replace("drv_uncured:__drvU,debate_rule_report:","debate_rule_report:");
T(plan.nodes.every(x=>{let t=pat(x.name);for(const [a,re] of E)t=t.replace(re,()=>a);if(x.name==='Cure Check')t=CCrev(t);return t===LN[x.name];}),'reverse edit: undoing exactly the listed edits gives the live text in all 17 nodes');
T(plan.nodes.filter(x=>x.edits>=4).every(x=>pat(x.name).split(SENT).length===2&&!LN[x.name].includes('That is an answer. Write it on')),'every cure node (14) carries the cure-prompt sentence once (S7); no live node has it');
// libraries, patched and live, from Panel Cure Normalize 2 (the status table and cureVerdicts are copied unchanged into every cure node)
const $=()=>{throw new Error('no node data offline');};const lib=c=>c.slice(0,c.lastIndexOf('\nreturn $input'));
const mk=c=>new Function('$','$input',lib(c)+'\nreturn {cureVerdicts,enfUncured,enfTrialWhy,enfLive};')($,null);
const N=mk(pat('Panel Cure Normalize 2')),O=mk(LN['Panel Cure Normalize 2']);
T(/b\.payload\.drv_uncured=enfUncured\(v\);/.test(pat('Panel Cure Check'))&&/b\.payload\.drv_uncured=enfUncured\(v\);/.test(pat('Alternate Merge')),'Panel Cure Check and Alternate Merge set drv_uncured through enfUncured, unchanged call sites');
// ---- replay on stored 32949: items rebuilt from the cure rows, each seat's own stored reply
const F=JSON.parse(fs.readFileSync('pkgS/fixture_32949_cure_rows.json','utf8'));const RP={};F.replies.forEach(r=>RP[r.h]=r.full_reply);
const side=r=>{const s=(r.item||'')+' '+(r.flagged_line||'');return /^DEFENDER/.test(r.item||'')?'DEFENDER':/^CHALLENGER/.test(r.item||'')?'CHALLENGER':/DEFENDER/.test(s)?'DEFENDER':/CHALLENGER/.test(s)?'CHALLENGER':'JUDGE';};
const groups={};F.rows.filter(r=>!/\(restated in the cure\)/.test(r.item||'')).forEach(r=>{(groups[r.seat+' '+r.h]=groups[r.seat+' '+r.h]||[]).push(r);});
const STRIP=s=>String(s||'').replace(/^TRIAL rule \([^)]*\)(?:: )?/,'');let match=0,tot=0;const per=[];
for(const [k,rows] of Object.entries(groups)){const items=rows.map(r=>r.rule==='K-G3'?{rule:r.rule,side:r.item.split(' ')[0],link:null,line:r.flagged_line}:{rule:r.rule,side:side(r),link:r.item,ruling:r.rule==='K-RUL'?r.item:undefined,line:r.flagged_line});
 const reply={ok:true,text:RP[rows[0].h]};const v=N.cureVerdicts(items,reply,null,null),v0=O.cureVerdicts(items,reply,null,null);
 const sil=v.filter(x=>x.silent===true),silStored=rows.filter(r=>r.cure_status==='UNCURED'&&STRIP(r.cure_reason)==='no written response');
 rows.forEach((r,i)=>{tot++;if(v[i].status===r.cure_status)match++;});
 T(v.every(x=>!x.silent||x.status==='UNCURED'),k.split(' ')[0]+': every silent item is UNCURED');
 T(v.every((x,i)=>x.status===v0[i].status&&x.why===v0[i].why),k.split(' ')[0]+': every status and reason is unchanged by the build');
 T(sil.length===silStored.length&&sil.every(x=>rows.some(r=>r.item===(x.link||x.side+' STANDING')&&STRIP(r.cure_reason)==='no written response')),k.split(' ')[0]+': silent items '+sil.length+' = stored rows whose only reason is no written response ('+silStored.length+'); by rule '+JSON.stringify(sil.reduce((a,x)=>(a[x.rule]=(a[x.rule]||0)+1,a),{})));
 per.push({seat:k.split(' ')[0],items:items.length,old:O.enfUncured(v0),new:N.enfUncured(v),silent:sil.length,malformed_not_counted:v.filter(x=>x.status==='UNCURED'&&/^no written response; malformed line/.test(x.why||'')).length});}
console.log('INFO replayed statuses equal the stored cure_status on '+match+' of '+tot+' rows (items are rebuilt from the log without rounds, so rules that read the rounds can differ; the build itself changes no status, checked above)');
per.forEach(p=>console.log('     '+p.seat.padEnd(8)+' items '+String(p.items).padStart(3)+'  drv_uncured before '+p.old+'  after '+p.new+'  (silent '+p.silent+'; written but malformed, not counted '+p.malformed_not_counted+')'));
// ---- the cure prompt the judge is sent (Panel Cure Build 1's cureAsk) carries the sentence
{const pb=pat('Panel Cure Build 1');const ask=new Function('$','$input',pb.slice(0,pb.indexOf("\nconst PP=$('Panel Payloads').first().json;const P=$('Panel Build')"))+'\nreturn cureAsk;')($,null);T(ask([{rule:'K-W',side:'DEFENDER',link:'DEFENDER CR9 D9 #1',line:'x'}],{}).includes(SENT),'the cure request built for a judge contains the sentence');}
// ---- NOT HELD on the RESPONSE line is a written response
{const v=N.cureVerdicts([{rule:'K-W',side:'DEFENDER',link:'DEFENDER CR9 D9 #1',line:'[CR9] D9: "I drop it."'}],{ok:true,text:'RESPONSE: K-W DEFENDER CR9 D9 #1 | NOT HELD: the round does not withdraw the footing; [CR9] says "I drop it" of another claim.'},null,null);
 T(!v[0].silent&&N.enfUncured(v)===0,'RESPONSE: <item> | NOT HELD: <reason> is a written response: not silent, a TRIAL item counts 0 (status '+v[0].status+')');}
// ---- the single judge (Cure Check), run offline on its own code with the node inputs stubbed
{const cc=pat('Cure Check');const k=cc.indexOf("const base=$('Extract Independent Verdict')");
 const run=(items,reply)=>{const base={debate_rule_violations:items,independent_verdict_raw:'{"verdict_tag":"HELD","reasoning":"x"}',verdict_tag:'HELD',judge_model:'m'};
  const $s=n=>({'Extract Independent Verdict':{first:()=>({json:base})},'Cure Normalize':{isExecuted:true,all:()=>[{json:{reply,cure:{broken:null,rounds:null,model:'m',body:null}}}]},'Init Seats':{first:()=>({json:{run_token:'T'}})}})[n]||(()=>{throw new Error('no '+n)})();
  return new Function('$','$input',cc.slice(0,k)+'\n'+cc.slice(k))($s,null)[0].json;};
 const it=[{rule:'K-W',side:'DEFENDER',link:'DEFENDER CR9 D9 #1',line:'[CR9] D9: "I drop it."'},{rule:'K-S3',side:'DEFENDER',link:'D9',line:'D9 y'}];
 const a=run(it,{ok:true,text:'nothing'});const ln=(a.independent_verdict_raw.match(/\[AUDIT v35: SINGLE JUDGE SILENCE COUNT[^\]\n]*\]/)||[])[0];
 T(a.drv_uncured===2&&!!ln&&/drv_uncured 2; NO WRITTEN RESPONSE on 2 items: K-W DEFENDER CR9 D9 #1, K-S3 D9;/.test(ln),'single judge: 2 silent TRIAL items give drv_uncured 2, stored, and one line names them: '+ln);
 T(/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/.test(ln),'that line has the form Build Save Body copies into review_notes');
 T(a.verdict_tag==='HELD','single judge: the verdict does not change');
 const b=run(it,{ok:false,why:'HTTP 500'});T(b.drv_uncured===0&&!/SINGLE JUDGE SILENCE/.test(b.independent_verdict_raw),'single judge: a failed cure call writes no silence line, drv_uncured 0');}
// ---- synthetic cases
const it={rule:'K-W',side:'DEFENDER',link:'DEFENDER CR9 D9 #1',line:'[CR9] D9: "I drop it."'};
{const v=N.cureVerdicts([it],{ok:true,text:'NOTHING ABOUT THE ITEM'},null,null);T(v[0].silent===true&&N.enfUncured(v)===1,'a TRIAL item the reply does not answer is silent and counts 1');
 T(/^TRIAL rule, NO WRITTEN RESPONSE: counts in drv_uncured like a LIVE item \(silence count\): no written response$/.test(N.enfTrialWhy(v[0],v[0].why)),'its stored reason says in plain words that it counts: '+N.enfTrialWhy(v[0],v[0].why));}
{const v=N.cureVerdicts([it],{ok:false,why:'HTTP 500'},null,null);T(!v[0].silent&&N.enfUncured(v)===0,'a failed cure call is not silence (counts 0 for a TRIAL item)');}
{const v=N.cureVerdicts([it],{ok:true,text:'RESPONSE: K-W DEFENDER CR9 D9 #1: TOUCHES NO LINK because it is a recital.'},null,null);T(v[0].status==='UNCURED'&&!v[0].silent&&N.enfUncured(v)===0,'a written response that fails the TRIAL form stays recorded only (counts 0): '+v[0].why);}
{const lv={rule:'K-S',side:null,link:'D9',line:'D9 x'};const v=N.cureVerdicts([lv],{ok:true,text:'nothing'},null,null);T(N.enfUncured(v)===1&&O.enfUncured(O.cureVerdicts([lv],{ok:true,text:'nothing'},null,null))===1,'a LIVE item counts as before (1 before, 1 after)');}
console.log(bad?'FAILED '+bad:'ALL OK');
