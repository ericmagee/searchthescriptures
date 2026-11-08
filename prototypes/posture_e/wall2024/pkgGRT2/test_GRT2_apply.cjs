// pkgGRT2 apply + record test (W1). (A) Send Back Record on 33411 (gemini, main panel) with the pkgGRT2 Build output and the saved reply plus
// one line for the companion S11: rows other than S11 equal the live Record's; S11 is CURED and counts against no seat; with no S11 line it is
// neither silence nor counted. (B) The library sbApply2024 (Gate Record, strip_KWI = s68 + pkgKWI) on gemini's 33411 judgment: RETRACTED: D6
// vs C1 for the FORCED line alone is NOT APPLIED (pkgRFL); with the companion regrade of the collision line in the same send-back, both apply.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const WF='/mnt/project-files/wall2024/fetchback_live_s68.json';
const W=JSON.parse(fs.readFileSync(WF,'utf8'));const NN=W.nodes||W.data.nodes;
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const RUN='33411';const bi=feeder(WF,'Send Back Build').find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));
const PB=harness(RUN)(fs.readFileSync('pkgGRT2/patched/Send_Back_Build.js','utf8'),bi);const gi=PB.findIndex(x=>x.json.seat==='gemini');const comp=PB[gi].json.items.find(x=>x.grt2);
T(comp&&comp.sid==='S11'&&comp.grt2.forced==='S5','33411 gemini: companion S11 for S5 '+(comp&&comp.grt2.pair));
const ri='Send Back Call openrouter';
const saved=JSON.parse(fs.readFileSync(D+RUN+'_'+ri.replace(/ /g,'_')+'.json','utf8'));const sv=Array.isArray(saved)?saved[0]:saved;const rep=((sv.data&&sv.data.main)||sv)[0];
const regr=comp.line.replace('CHALLENGER LINK BROKEN','UNDERDETERMINED');
const withLine=rep.map((x,k)=>{if(k!==gi)return x;const j=JSON.parse(JSON.stringify(x));j.json.choices[0].message.content+='\nSENDBACK: S11 || CHANGE TO: '+regr+' || the line reads "before they came together, she was found with child".';return j;});
const run=(build,reply,code)=>harness(RUN,{'Send Back Build':build,[ri]:reply})(code,ri);
const L0=NN.find(x=>x.name==='Send Back Record').parameters.jsCode,L1=fs.readFileSync('pkgGRT2/patched/Send_Back_Record.js','utf8');
const base=run(harness(RUN)(NN.find(x=>x.name==='Send Back Build').parameters.jsCode,bi),rep,L0),a=run(PB,withLine,L1),b=run(PB,rep,L1);
const rowsOf=o=>o[0].json.sb_rows||[];const pick=(o,sid)=>rowsOf(o).filter(r=>r.seat==='gemini'&&/S11\b/.test(String(r.response_line||r.cure_reason||'')));
const strip=o=>JSON.stringify(rowsOf(o).filter(r=>!/COMPANION ASK/.test(r.cure_reason||'')).map(r=>({...r,prompt_sent:null,full_reply:null})));
T(rowsOf(base).length>0&&strip(a)===strip(base)&&strip(b)===strip(base),'Record: '+rowsOf(base).length+' rows; every row but the companion equals the live Record row (prompt and reply text aside)');
const ca=rowsOf(a).find(r=>/COMPANION ASK/.test(r.cure_reason||'')),cb=rowsOf(b).find(r=>/COMPANION ASK/.test(r.cure_reason||''));
T(ca&&ca.cure_status==='CURED'&&/SEND-BACK CHANGE/.test(ca.cure_reason),'Record: companion answered CHANGE TO -> CURED, record-only ('+(ca&&ca.cure_status)+')');
T(cb&&cb.cure_status!=='UNCURED'&&!/SILENT/.test(cb.cure_reason),'Record: companion unanswered -> not silence, not UNCURED ('+(cb&&cb.cure_status)+')');
const dj=o=>JSON.stringify(o[0].json).match(/drv_uncured[^,]{0,40}/g)||[];T(dj(base).length>0&&JSON.stringify(dj(b))===JSON.stringify(dj(base))&&JSON.stringify(dj(a))===JSON.stringify(dj(base)),'Record: drv_uncured unchanged with the companion answered or not ('+dj(base).length+' values)');
// (B) apply
const G=fs.readFileSync('pkgLIB/strip_KWI/patched/Gate_Record.js','utf8').split('\n');const head=G.slice(0,G.findIndex(l=>/^const PASS=\$\('Send Back Record'\)/.test(l))).join('\n');
const H=harness(RUN);const lib=new Function('$','$input','$execution',head+'\nreturn {sbApply2024};')((n)=>H.length?null:({isExecuted:false,first:()=>{throw new Error('x')},all:()=>{throw new Error('x')},params:{}}),{all:()=>[],first:()=>({json:{}})},{id:RUN});
const said=PB[gi].json.body.messages.filter(m=>m.role==='assistant').pop().content;const forced=PB[gi].json.items.find(x=>x.sid==='S5');
const A1=lib.sbApply2024('gemini',said,{conceded_links:0,challenger_conceded_links:0},[{sid:'S5',rule:'E-COL',ans:'CHANGE',to:'RETRACTED: D6 vs C1',line:forced.line,item:forced.item}],{});
const A2=lib.sbApply2024('gemini',said,{conceded_links:0,challenger_conceded_links:0},[{sid:'S5',rule:'E-COL',ans:'CHANGE',to:'RETRACTED: D6 vs C1',line:forced.line,item:forced.item},{sid:'S11',rule:'E-COL',ans:'CHANGE',to:regr,line:comp.line,item:comp.item}],{});
const na=r=>(r&&r.items||[]).filter(x=>x.kind==='NOT APPLIED').map(x=>x.sid+': '+String(x.why).slice(0,90));
T(na(A1).some(x=>/^S5:/.test(x)),'apply: RETRACTED alone is NOT APPLIED ('+na(A1).join('; ')+')');
T(A2&&!na(A2).length&&!/FORCED\s*:\s*D6 vs C1/i.test(A2.text)&&A2.text.includes(regr.slice(0,40)),'apply: with the companion regrade, both apply; the FORCED line is gone and the collision line regraded ('+na(A2).join('; ')+')');
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgGRT2/test_GRT2_apply.txt',out.join('\n')+'\n');
