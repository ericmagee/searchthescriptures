// pkgAPPLY offline tests (W2). Run from pkgAPPLY: node test_APPLY.cjs. Writes nothing live.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};
const base=fs.readFileSync('../merged_PWQ/Alternate_Merge.js','utf8'),pat=fs.readFileSync('patched/Alternate_Merge.js','utf8');const plan=JSON.parse(fs.readFileSync('plan_APPLY.json','utf8'));
T(sha(base)===plan.nodes[0].base_sha&&sha(pat)===plan.nodes[0].final_sha,'Alternate Merge: base_sha equals merged_PWQ, final_sha equals the patched file');
{const FN=fs.readFileSync('sb_apply.js','utf8');const a=pat.indexOf('// E-APPLY: each panel seat');const b=pat.indexOf('const sb_apply=[];');const a2=pat.indexOf('{const __T=new Date().toISOString();sb_apply.forEach');const b2=pat.indexOf('return [{json:{...PP,enforcer_log,sb_apply,');
 const back=pat.replace(FN,'').slice(0,a)+pat.replace(FN,'').slice(pat.replace(FN,'').indexOf('\nconst sb_apply')+1);let r=pat.replace(FN,'');const i1=r.indexOf('// E-APPLY: each panel seat'),i2=r.indexOf('let SK=[]');r=r.slice(0,i1)+r.slice(i2);const j1=r.indexOf('{const __T=new Date().toISOString();sb_apply.forEach'),j2=r.indexOf('return [{json:{...PP,enforcer_log,sb_apply,');r=r.slice(0,j1)+r.slice(j2).replace('enforcer_log,sb_apply,','enforcer_log,');
 T(r===base,'reverse edit: removing the E-APPLY function, the apply block and the log block gives merged_PWQ exactly');}
const lib=pat.slice(0,pat.indexOf("const PP=$('Panel Cure Check')"));const M=new Function('$','$input',lib+'\nreturn {sbApply2024,cureRewrite,cureSupHead,cureJText,rcLines};')(()=>{throw new Error('offline');},null);
// the send-back answers, read with Send Back Record's own reader from each seat's stored full reply (md5 checked)
const SB=JSON.parse(fs.readFileSync('fixture_sendback_32949_32973.json','utf8'));
T(SB.filter(r=>r.full_reply!=null).every(r=>crypto.createHash('md5').update(r.full_reply).digest('hex')===r.h),'send-back fixture: each stored full reply matches its md5');
const rd=txt=>{const J=/^\s*[{\[]/.test(txt);const A={};const T2=txt.replace(/\\n/g,'\n').replace(/\\"/g,'"');for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();const m=l.match(/SENDBACK\s*:\s*(S\d+)\s*\|\|\s*(KEEP|CHANGE TO\s*:?([\s\S]*?))\s*\|\|\s*(.*)$/i);
  if(m&&!A[m[1].toUpperCase()])A[m[1].toUpperCase()]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?m[4].replace(/"\s*,?\s*[}\]]*\s*$/,''):m[4]).trim(),line:l};}return A;};
const ITS={};{const by={};SB.forEach(r=>{const k=r.run_token.slice(5,10)+' '+r.seat;(by[k]=by[k]||[]).push(r);});for(const [k,rows] of Object.entries(by)){const fr=rows.find(r=>r.full_reply);const A=rd(fr?fr.full_reply:'');
 ITS[k]=rows.map(r=>{const sid=((r.response_line||'').match(/SENDBACK\s*:\s*(S\d+)/i)||[])[1];const a=sid?A[sid.toUpperCase()]:null;return {seat:r.seat,sid:sid||null,rule:r.rule,item:r.item,line:r.flagged_line,ans:a?a.ans:'NO ANSWER',to:a?a.to:''};});}}
T(Object.values(ITS).every(v=>v.every(x=>x.ans!=='NO ANSWER'))&&ITS['32973 gemini'].filter(x=>x.ans==='CHANGE').length===14,'every stored send-back item is read back (32973 gemini: 14 CHANGE)');
const B=JSON.parse(fs.readFileSync('fixture_bodies.json','utf8'));const OUT={};
for(const b of B){const k=b.run+' '+b.seat;const its=ITS[k]||[];const R=M.sbApply2024(b.seat,b.verdict_raw,b.fields,its);OUT[k]={R,its};
 const nCh=its.filter(x=>x.ans==='CHANGE').length;console.log('     '+k+': CHANGE '+nCh+', KEEP '+its.filter(x=>x.ans==='KEEP').length+'; applied '+(R?R.applied.length:0)+'; verdict '+b.fields.verdict_tag+' -> '+(R?R.fields.verdict_tag+' ('+R.tag+')':'unchanged')+'; RESULT '+(R?R.result0+' -> '+R.result:'-')+'; counts D '+b.fields.conceded_links+'->'+(R?R.fields.conceded_links:'-')+' C '+b.fields.challenger_conceded_links+'->'+(R?R.fields.challenger_conceded_links:'-'));
 if(R)R.items.forEach(z=>console.log('        ITEM '+z.sid+' '+z.kind+': '+z.why+' | '+String(z.to).slice(0,140)));}
// P1
{const g=OUT['32973 gemini'].R;T(g&&g.applied.length===10&&/S13 replaces S10, S11, S12 on the same line/.test(g.audit)&&!g.items.length&&g.fields.verdict_tag==='BROKEN'&&g.result==='CHALLENGER WINS','P1 32973 gemini: all 13 line changes applied (10 lines; S13 replaces S10 to S12 on CONCEDED LINKS), no item, verdict BROKEN, derived RESULT CHALLENGER WINS equals its S14 (no RESULT DIFFERS item)');
 T(g&&g.fields.conceded_links===4,'P1 32973 gemini: CONCEDED LINKS 4 (S13, the last of S10 to S13)');
 const txt=M.cureJText(M.cureRewrite(B.find(b=>b.run==='32973'&&b.seat==='gemini').verdict_raw,true,g,'gemini',B.find(b=>b.run==='32973'&&b.seat==='gemini').fields),true);
 T(/ANSWER CHECK: Romans 1:3 -- \[CR3\][^\n]*-- MISSES --/.test(txt)&&/ANSWER CHECK: Luke 1:27 -- \[CR3\][^\n]*-- MISSES --/.test(txt)&&/D5 vs C5 \(Luke 3:23\): DEFENDER LINK BROKEN/.test(txt),'P1 32973 gemini: the corrected text reads Romans 1:3 and Luke 1:27 MISSES and D5 vs C5 DEFENDER LINK BROKEN');
 const full=M.cureRewrite(B.find(b=>b.run==='32973'&&b.seat==='gemini').verdict_raw,true,g,'gemini',B.find(b=>b.run==='32973'&&b.seat==='gemini').fields);
 T(/"verdict_tag":\s*"BROKEN"/.test(full)&&/AUDIT v21: CORRECTED RESULT -- SEAT: gemini; ORIGINAL: HELD; COUNTED: BROKEN/.test(full)&&(full.match(/AUDIT v27: SUPERSEDED LINE/g)||[]).length>=13,'P6 32973 gemini: the stored row carries verdict_tag BROKEN, the CORRECTED RESULT line derive_debate_outcome reads, and a SUPERSEDED LINE for each replaced line');}
// P7: every contradiction item on 32949 and 32973
{const C=[];for(const [k,o] of Object.entries(OUT))(o.R?o.R.items:[]).filter(z=>z.kind==='CONTRADICTION').forEach(z=>C.push(k+' '+z.sid));console.log('     P7 contradiction items: '+(C.join(', ')||'none'));
 const g=OUT['32973 grok'].R;T(C.join()==='32973 grok S26,32973 grok S27,32973 grok S28'&&!['S26','S27','S28'].some(s=>g.applied.includes(s)),'P7 the only contradiction items are 32973 grok S26, S27 (D6 collisions made non-broken) and S28 (KEYSTONE D6 BROKEN); none of the three is applied');}
// run outcome on 32973 with the corrected bodies: counted seats gemini and grok (chatgpt removed)
{const g=OUT['32973 gemini'].R.fields.verdict_tag,k=OUT['32973 grok'].R.fields.verdict_tag;T(g==='BROKEN'&&k==='BROKEN','P1 run 32973: counted seats gemini BROKEN and grok BROKEN, so 2-0 for the challenger (was CONTESTED 1-1)');}
// P2
{const c=OUT['32973 chatgpt'].R;T(!!c&&c.applied.length>0,'P2 32973 chatgpt (removed seat): its changes are applied in its record ('+(c?c.applied.length:0)+' applied)');}
// P5
{const keepOnly=[];for(const [k,o] of Object.entries(OUT)){if(!o.R)continue;const kept=o.its.filter(x=>x.ans==='KEEP').map(x=>x.sid);if(kept.some(s=>o.R.applied.includes(s)))keepOnly.push(k);}T(!keepOnly.length,'P5 no KEEP answer is applied');}
// synthetic
const raw0='{"verdict_tag":"HELD","defense_standing":"SELF-SUPPORTED","conceded_links":0,"challenge_standing":"SELF-SUPPORTED","challenger_conceded_links":0,"reasoning":"KEYSTONE: D6 -- STANDS -- x\\nD6 vs C1 (Matthew 1:18): UNDERDETERMINED -- y\\nCONCEDED LINKS: 0 -- none\\nRESULT: DEFENDER WINS -- z"}';
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
{const R=M.sbApply2024('t',raw0,F0,[{sid:'S1',ans:'CHANGE',line:'D6 vs C1 (Matthew 1:18): UNDERDETERMINED -- y',to:'D6 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN -- w'}]);T(R&&R.applied.length===0&&R.items.some(z=>z.kind==='CONTRADICTION'),'a change grading the keystone collision DEFENDER LINK BROKEN while KEYSTONE D6 STANDS: not applied, CONTRADICTION item');}
{const R=M.sbApply2024('t',raw0,F0,[{sid:'S1',ans:'CHANGE',line:'no such line',to:'D6 vs C1 (Matthew 1:18): UNDERDETERMINED -- w'}]);T(R&&R.applied.length===0&&R.items[0].kind==='NOT APPLIED','P3 a change whose flagged line is not in the text: NOT APPLIED item');}
{const R=M.sbApply2024('t',raw0,F0,[{sid:'S1',ans:'CHANGE',line:'CONCEDED LINKS: 0 -- none',to:'Remove the [CR4] concession line.'}]);T(R&&R.applied.length===0&&R.items[0].kind==='NOT APPLIED','P3 an instruction with no line form: NOT APPLIED item');}
{const R=M.sbApply2024('t',raw0,F0,[{sid:'S1',ans:'CHANGE',line:'x',to:'RESULT: CHALLENGER WINS -- q'}]);T(R&&R.result!=='CHALLENGER WINS'&&R.items[0].kind==='RESULT DIFFERS'&&!R.rp.some(p=>/CHALLENGER WINS/.test(p[1])),'a CHANGE TO RESULT alone is never written; the derived RESULT differs, so a RESULT DIFFERS item');}
{const R=M.sbApply2024('t',raw0,F0,[{sid:'S1',ans:'KEEP',line:'CONCEDED LINKS: 0 -- none',to:''}]);T(R===null,'P5 KEEP only: nothing changes');}
{const R=M.sbApply2024('t',raw0,F0,[{sid:'S1',ans:'CHANGE',line:'CONCEDED LINKS: 0 -- none',to:'CONCEDED LINKS: 1 -- Premise 2: UNEXHIBITED'},{sid:'S2',ans:'CHANGE',line:'CONCEDED LINKS: 0 -- none',to:'CONCEDED LINKS: 2 -- Premise 2: UNEXHIBITED; Premise 4: UNEXHIBITED'}]);
 T(R&&R.fields.conceded_links===2&&R.applied.join()==='S2'&&/S2 replaces S1 on the same line/.test(R.audit)&&R.fields.defense_standing==='PROP-DEPENDENT','two changes on one line: the last (S2) wins, the record says so, and the standing follows the count');}
{const g=OUT['32949 grok'].R;T(['S2','S3'].every(s=>g.items.some(z=>z.sid===s&&/NOT HELD dispute/.test(z.why))),'32949 grok S2, S3: NOT HELD under CHANGE TO is named as a NOT HELD dispute, not a line change');}
console.log(bad?'FAILED '+bad:'ALL OK');
