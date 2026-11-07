// pkgRCK tests (scope W3 2742, 2747): real nodes on saved inputs (pkgGSL harness).
// BASE = live 5a710187 + UNXS + UNXW (stack.cjs); RCK = out/ from build_RCK.cjs. No change is refused; counts are the judge's own.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const {baseCode}=require('./stack.cjs');
const P=n=>fs.readFileSync(__dirname+'/out/'+n.replace(/[^A-Za-z0-9]+/g,'_')+'.js','utf8');const code=(lab,n)=>lab==='BASE'?baseCode(n):P(n);
let ok=0,bad=0;const T=(name,c)=>{if(c){ok++;console.log('OK   '+name);}else{bad++;console.log('FAIL '+name);}};
const seats=j=>Object.fromEntries((j&&j.bodies||[]).map(b=>{const p=JSON.parse(b).payload;return [p.judge_seat,p];}));
const F=p=>p&&[p.verdict_tag,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,p.drv_uncured].join('/');
const chain=(r,lab)=>{const gb=harness(r)(code(lab,'Gate Build'),'Send Back Record');const gr=harness(r)(code(lab,'Gate Record'),'Gate Call openrouter');const ams=harness(r,{'Gate Record':gr})(code(lab,'Alternate Merge Seat'),'Alternate Cure Normalize');
 let ag=null,am=null;try{ag=harness(r)(code(lab,'Alt Gate Record'),'Alt Gate Call openrouter');am=harness(r,{'Alt Gate Record':ag,'Gate Record':gr,'Alternate Merge Seat':ams})(code(lab,'Alternate Merge'),'Alt Gate Record');}catch(e){}
 return {gb:gb[0].json,gr:gr[0].json,ams:ams[0].json,ag:ag&&ag[0].json,am:am&&am[0].json};};
const freshUNX=(j,seat)=>{const p=seats(j)[seat];return p?(p.verdict_raw.match(/\[AUDIT v38: E-GATE NEW ITEM -- SEAT: \w+; RULE K-UNX \(K re-read\)[^\]]*\]/g)||[]):[];};
// A: the readers
const k=P('Gate Record');globalThis.__K=null;try{harness('33249')('globalThis.__K={kunx:kunxLines,ciRounds,prompt:gatePromptText2024,newK:gateNewK2024};'+k,'Gate Call openrouter');}catch(e){}
const PB=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33249_Panel_Build.json','utf8'));const pb=Array.isArray(PB)?PB[0]:PB;const J=((pb.data&&pb.data.main)||pb.main)[0][0].json;
const PT=__K.prompt(J.judges.find(q=>q.seat==='sol').body);const R=__K.ciRounds(PT);
const AMj=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33249_Alternate_Merge.json','utf8'))[0].main[0][0].json;
const solT=JSON.parse(AMj.bodies.find(b=>JSON.parse(b).payload.judge_seat==='sol')).payload.verdict_raw;
{const a=__K.kunx(solT,PT).items.map(x=>x.link),b=__K.kunx(solT,R).items.map(x=>x.link);T('A1 kunxLines(text, rounds) = kunxLines(text, prompt) on 33249 sol: '+b.join(', '),JSON.stringify(a)===JSON.stringify(b)&&b.includes('CHALLENGER premise 5'));}
{const o=fs.readdirSync(__dirname+'/out').filter(f=>f.endsWith('.js'));const w=fs.readdirSync(__dirname+'/../pkgUNXW/patched');
 T('A2 '+w.length+' UNXW nodes keep unxLack, '+o.length+' out nodes keep the UNXS reader',w.length===19&&w.every(f=>fs.readFileSync(__dirname+'/out/'+f,'utf8').includes('function unxLack('))&&o.length===22&&o.every(f=>fs.readFileSync(__dirname+'/out/'+f,'utf8').includes('pkgUNXS')));}
// B: the re-read itself (gateNewK2024: text before the changes vs after), on sol's 33249 text with its count line rewritten
{const i0=solT.indexOf('{');const dec=JSON.parse(solT.slice(i0,solT.indexOf('\n[AUDIT')>0?solT.indexOf('\n[AUDIT'):undefined).trim());const lines=String(dec.reasoning).split('\n');const ci=lines.findIndex(l=>/^CHALLENGER CONCEDED LINKS\s*:/.test(l.replace(/[*_]/g,'')));if(ci<0)throw new Error('B: no count line');
 const withCount=s=>{const L=lines.slice();L[ci]=s;return JSON.stringify({...dec,reasoning:L.join('\n')});};const Fx=n=>({verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:n});
 const T0=withCount('CHALLENGER CONCEDED LINKS: 1 -- Premise 1: UNEXHIBITED, a proven pressed witness left unanswered in meaning (Commitments 3 and 5).');
 const ctx={R,DL:[],ask:false};const run=s=>__K.newK(T0,withCount(s),Fx(1),Fx(2),ctx).items.filter(x=>x.rule==='K-UNX');
 const pos=run('CHALLENGER CONCEDED LINKS: 2 -- Premise 1: UNEXHIBITED, a proven pressed witness left unanswered in meaning (Commitments 3 and 5). Premise 5: UNEXHIBITED, its answer fails (Commitment 7).');
 T('B1 an added premise 5 with no named layer raises one K-UNX item naming CHALLENGER premise 5, not LIVE',pos.length===1&&/CHALLENGER premise 5/.test(pos[0].why)&&pos[0].live===false);
 const neg=run('CHALLENGER CONCEDED LINKS: 2 -- Premise 1: UNEXHIBITED, a proven pressed witness left unanswered in meaning (Commitments 3 and 5). Premise 5: UNEXHIBITED; ASSUMES: that "thy father and I have sought thee sorrowing" (Luke 2:48) names the begetter; ROWS GIVE: Luke 2:48.');
 T('B2 NEGATIVE CONTROL (W3 2742): an added premise 5 whose ASSUMES ground quotes the block\'s [L1] (Luke 2:48 "thy father and I have sought thee sorrowing") raises nothing',neg.length===0);
 const twin=run('CHALLENGER CONCEDED LINKS: 2 -- Premise 1: UNEXHIBITED, a proven pressed witness left unanswered in meaning (Commitments 3 and 5). Premise 5: UNEXHIBITED; ASSUMES: that Mary names the begetter in the temple; ROWS GIVE: Luke 2:48.');
 T('B2b twin of the control: the same ASSUMES ground without the [L1] quotation raises K-UNX-A on CHALLENGER premise 5 (so B2 is not vacuous)',twin.length===1&&/on an ASSUMES ground/.test(twin[0].why)&&/CHALLENGER premise 5/.test(twin[0].why));
 T('B3 the unchanged count raises nothing',__K.newK(T0,T0,Fx(1),Fx(1),ctx).items.filter(x=>x.rule==='K-UNX').length===0);}
// C: 33249 end to end: sol premise 5 raised after the gate and recorded; every count as the judge wrote it
{const B=chain('33249','BASE'),Rr=chain('33249','RCK');const b=seats(B.ams),r=seats(Rr.ams);
 T('C1 sol fields unchanged, challenger count 2 as the judge wrote it: '+F(r.sol),F(b.sol)===F(r.sol)&&r.sol.challenger_conceded_links===2);
 T('C2 gemini and grok fields unchanged',['gemini','grok'].every(s=>F(b[s])===F(r[s])));
 const fr=freshUNX(Rr.gr,'sol');T('C3 after the gate, sol premise 5 is raised as a K-UNX item and recorded only ('+fr.length+' items)',fr.some(x=>/CHALLENGER premise 5:/.test(x))&&fr.every(x=>/RECORD-ONLY, not counted/.test(x))&&freshUNX(B.gr,'sol').length===0);
 T('C4 Gate Build (send-back stage) adds no G item on 33249 (the send-back changed no count)',JSON.stringify(B.gb.gate||B.gb)===JSON.stringify(Rr.gb.gate||Rr.gb)||!/K-UNX \(K re-read\)/.test(JSON.stringify(Rr.gb)));}
// D: 33222 grok (alternate), DEFENDER side: premise 6 recorded, count stays 4
{const B=chain('33222','BASE'),Rr=chain('33222','RCK');const b=seats(B.am),r=seats(Rr.am);
 T('D1 grok defender count 4 in both, all fields unchanged: '+F(r.grok),r.grok&&r.grok.conceded_links===4&&F(b.grok)===F(r.grok));
 const fr=freshUNX(Rr.ag,'grok');T('D2 grok DEFENDER premise 6 recorded after the gate, record-only',fr.some(x=>/DEFENDER premise 6:/.test(x))&&fr.every(x=>/RECORD-ONLY, not counted/.test(x)));
 T('D3 chatgpt and sol unchanged',['chatgpt','sol'].every(s=>F(b[s])===F(r[s])));}
// E: parity on 33218
{const B=chain('33218','BASE'),Rr=chain('33218','RCK');T('E1 33218 Gate Build, Gate Record and Alternate Merge Seat bodies identical',['gb','gr','ams'].every(k=>JSON.stringify(B[k].bodies||B[k])===JSON.stringify(Rr[k].bodies||Rr[k])));}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
