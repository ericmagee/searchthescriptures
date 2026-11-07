// pkgRCK tests: real nodes on saved inputs (pkgGSL harness), BASE = live s22 fetch-back, RCK = out/ from build_RCK.cjs.
const fs=require('fs');const {harness,live}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s22.json';
const P=n=>fs.readFileSync(__dirname+'/out/'+n.replace(/[^A-Za-z0-9]+/g,'_')+'.js','utf8');const code=(lab,n)=>lab==='BASE'?live(FB,n):P(n);
let ok=0,bad=0;const T=(name,c)=>{if(c){ok++;console.log('OK   '+name);}else{bad++;console.log('FAIL '+name);}};
const seats=j=>Object.fromEntries((j.bodies||[]).map(b=>{const p=JSON.parse(b).payload;return [p.judge_seat,p];}));
const chain=(r,lab)=>{const gr=harness(r)(code(lab,'Gate Record'),'Gate Call openrouter');const ams=harness(r,{'Gate Record':gr})(code(lab,'Alternate Merge Seat'),'Alternate Cure Normalize');
 let am=null;try{const ag=harness(r)(code(lab,'Alt Gate Record'),'Alt Gate Call openrouter');am=harness(r,{'Alt Gate Record':ag,'Gate Record':gr,'Alternate Merge Seat':ams})(code(lab,'Alternate Merge'),'Alt Gate Record');}catch(e){}
 return {gr:gr[0].json,ams:ams[0].json,am:am&&am[0].json};};
// A: kunxLines takes the rounds object and gives what the prompt string gives (33249 sol final text)
{const k=P('Gate Record');globalThis.__K=null;try{harness('33249')('globalThis.__K={kunx:kunxLines,ciRounds,prompt:gatePromptText2024};'+k,'Gate Call openrouter');}catch(e){}
 const PB=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33249_Panel_Build.json','utf8'));const pb=Array.isArray(PB)?PB[0]:PB;const J=((pb.data&&pb.data.main)||pb.main)[0][0].json;
 const PT=__K.prompt(J.judges.find(q=>q.seat==='sol').body);const AM=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33249_Alternate_Merge.json','utf8'));
 const sol=JSON.parse(AM[0].main[0][0].json.bodies.find(b=>JSON.parse(b).payload.judge_seat==='sol')).payload.verdict_raw;
 const a=__K.kunx(sol,PT).items.map(x=>x.link),b=__K.kunx(sol,__K.ciRounds(PT)).items.map(x=>x.link);
 T('A1 kunxLines(text, rounds) = kunxLines(text, prompt) on 33249 sol: '+b.join(', '),JSON.stringify(a)===JSON.stringify(b)&&b.includes('CHALLENGER premise 5'));}
// B: 33249 sol, premise 5 added by gate G8 (send-back S28) is not applied; count stays 1; no seat removed; others unchanged
{const B=chain('33249','BASE'),R=chain('33249','RCK');const b=seats(B.ams),r=seats(R.ams);
 T('B1 BASE reproduces stored sol challenger count 2',b.sol.challenger_conceded_links===2);
 T('B2 RCK sol challenger count 1 (premise 1 only)',r.sol.challenger_conceded_links===1);
 T('B3 sol drv_uncured 0 in both (TRIAL: no seat removed)',b.sol.drv_uncured===0&&r.sol.drv_uncured===0);
 T('B4 sol verdict and standings unchanged',['verdict_tag','defense_standing','challenge_standing','conceded_links'].every(k=>b.sol[k]===r.sol[k]));
 T('B5 gemini and grok unchanged',['gemini','grok'].every(s=>JSON.stringify(b[s])===JSON.stringify(r[s])));
 const v=r.sol.verdict_raw;T('B6 G8 row says TRIAL pkgRCK record-only and names premise 5',/G8 NOT APPLIED \(E-APPLY S28\); ANSWER: CHANGE; CURED: TRIAL \(pkgRCK/.test(v)&&/newly counts premise 1 and premise 5/.test(v));}
// C: 33222 grok (alternate), DEFENDER side: gate G4 count change adding premise 6 is not applied (side-neutral)
{const B=chain('33222','BASE'),R=chain('33222','RCK');const b=seats(B.am),r=seats(R.am);
 T('C1 BASE grok defender count 4',b.grok&&b.grok.conceded_links===4);
 T('C2 RCK grok defender count 0 (line as first written)',r.grok&&r.grok.conceded_links===0);
 T('C3 grok verdict tag unchanged and drv_uncured 0',b.grok.verdict_tag===r.grok.verdict_tag&&r.grok.drv_uncured===0);
 T('C4 chatgpt and sol unchanged',['chatgpt','sol'].every(s=>JSON.stringify(b[s])===JSON.stringify(r[s])));}
// D: negative, 33218 identical end to end
{const B=chain('33218','BASE'),R=chain('33218','RCK');T('D1 33218 Gate Record and Alternate Merge Seat bodies identical',JSON.stringify(B.gr.bodies)===JSON.stringify(R.gr.bodies)&&JSON.stringify(B.ams.bodies)===JSON.stringify(R.ams.bodies));}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
