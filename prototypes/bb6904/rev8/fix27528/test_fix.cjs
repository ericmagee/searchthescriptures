// BB-6904 option 1 fix tests (files only). Usage: node test_fix.cjs <old nodes dir> <new nodes dir> <five.json> <run27528 dir>
const fs=require('fs');const crypto=require('crypto');const [OLD,NEW,FIVE,RUN]=process.argv.slice(2);let ok=true;
const say=(c,m)=>{ok&=!!c;console.log((c?'PASS ':'FAIL ')+m);};
const cutFn=(src)=>{const a=src.indexOf('const DRV_REF=');const b=src.indexOf('const CURE_RULE=')>0?src.indexOf('const CURE_RULE='):src.indexOf('\n',src.indexOf('function drvCheck'))+1;
 const s=src.slice(a,src.indexOf('return {items,marks};}',a)+'return {items,marks};}'.length);return new Function(s+';return {drvCheck,drvKinds};')();};
const O=cutFn(fs.readFileSync(OLD+'/Panel_Payloads.js','utf8')),N=cutFn(fs.readFileSync(NEW+'/Panel_Payloads.js','utf8'));
// 1. gemini's line in 27528
const g='D6 vs C6 (Isaiah 7:14): DEFENDER LINK BROKEN -- the challenger exhibited [L1] "a virgin espoused... the virgin\'s name was Mary" (Luke 1:27) with the Greek [L2] *parthenos*, and [L3] Isaiah 7:14 to prove the sign requires no man be the begetter, and the defender\'s link round left these witnesses unanswered.';
say(JSON.stringify(O.drvKinds(g))==='["L3"]','old code: gemini line counts '+JSON.stringify(O.drvKinds(g)));
say(JSON.stringify(N.drvKinds(g))==='["L1","L3"]','new code: gemini line counts '+JSON.stringify(N.drvKinds(g))+' (L2 *parthenos* in Latin letters still not counted, by the rule)');
// 2. cases: a sentence end still cuts; an ellipsis does not
const c1='D1 vs C1 (Luke 1:27): DEFENDER LINK BROKEN -- [L1] Luke 1:27. Then "a virgin espoused to a man" [L3] Isaiah 7:14.';
say(JSON.stringify(N.drvKinds(c1))===JSON.stringify(O.drvKinds(c1)),'a plain sentence end cuts as before: '+JSON.stringify(N.drvKinds(c1)));
const c2='D1 vs C1 (Luke 1:27): DEFENDER LINK BROKEN -- [L1] "and the virgin\'s name was Mary..." [L3] Isaiah 7:14.';
console.log('     note: quote ending in an ellipsis, old',JSON.stringify(O.drvKinds(c2)),'new',JSON.stringify(N.drvKinds(c2)));
// 3. regression: every LINK BROKEN line of the five stored debates and of 27528's judges, old against new
const text=(raw)=>{const h=String(raw||'').split('\n\n[AUDIT')[0];try{return JSON.parse(h).reasoning||h;}catch(e){const m=h.match(/"reasoning"\s*:\s*("(?:[^"\\]|\\.)*")/);if(m){try{return JSON.parse(m[1]);}catch(e2){}}return h;}};
const lines=[];const D=JSON.parse(fs.readFileSync(FIVE,'utf8'));
for(const r of D)for(const j of [{seat:'single',raw:r.single}].concat(r.judges||[]))for(const l of text(j.raw).split('\n'))if(/LINK BROKEN/.test(l)&&/vs\s+C\d/.test(l))lines.push([r.tok.slice(5,10)+' '+j.seat,l]);
let row=JSON.parse(fs.readFileSync(RUN+'/row.json','utf8'));row=Array.isArray(row)?row[0]:row;row=row.row_to_json||row;
let J=JSON.parse(fs.readFileSync(RUN+'/judgments.json','utf8')).map(x=>x.row_to_json||x);
const dr=typeof row.drv_removed==='string'?JSON.parse(row.drv_removed):row.drv_removed;
for(const [s,raw] of [['single',row.independent_verdict_raw]].concat(J.map(j=>[j.judge_seat,j.verdict_raw])).concat((dr||[]).map(x=>[x.seat+'(removed)',x.verdict_raw])))
 for(const l of text(raw).split('\n'))if(/LINK BROKEN/.test(l)&&/vs\s+C\d/.test(l))lines.push(['27528 '+s,l]);
let ch=0;for(const [w,l] of lines){const a=JSON.stringify(O.drvKinds(l)),b=JSON.stringify(N.drvKinds(l));if(a!==b){ch++;console.log('     changed: '+w+' '+(l.match(/D\d+\s+vs\s+C\d+/)||[''])[0]+' '+a+' -> '+b);}}
console.log('     regression: '+lines.length+' LINK BROKEN lines, '+ch+' change their layer kinds');
say(lines.every(([w,l])=>N.drvKinds(l).length>=O.drvKinds(l).length),'no line loses a layer kind under the new code');
// 4. Format Markdown item 8: a failing read and an empty read are named in the section
const fm=fs.readFileSync(NEW+'/Format_Markdown.js','utf8');const a=fm.indexOf('// ITEM 8 (BB-7224');const b=fm.indexOf("t += '\\n---\\n\\n' + s8;");
const blk=fm.slice(a,b);const run=(nodes)=>{const $=(n)=>{if(!(n in nodes))throw new Error("Referenced node is unexecuted: '"+n+"'");return {first:()=>({json:nodes[n][0]}),all:()=>nodes[n].map(j=>({json:j}))};};
 return new Function('$','SJN','nm',blk+';return s8;')($,'DeepSeek',x=>x);};
const body={model:'m',messages:[{role:'system',content:'S'},{role:'user',content:'U'}]};
const s8=run({'Build Independent Verdict':[{verdictBody:body,judge_model:'d'}],'Panel Build':[{judges:[]}],'Alternate Build':[{alt:{seat:'glm',pool_seat:'glm',api_model:'g',removed_seat:'gemini',body}}]});
say(/Reads that gave no text:\* .*Reserve Build: Referenced node is unexecuted/.test(s8),'a read that throws is named with its message');
console.log('     LIMIT: a read that returns an object with an empty judges list is not named (fromNode sees an object); a thrown error and an empty item list are named.');
say(/Sent to: single judge DeepSeek \(d\); alternate judge glm/.test(s8),'the calls that were read are still grouped by md5 as before');
console.log(ok?'\nFIX TESTS PASS':'\nFIX TESTS FAIL');
