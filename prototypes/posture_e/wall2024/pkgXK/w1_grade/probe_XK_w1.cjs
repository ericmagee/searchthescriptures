// W1 grade of pkgXK (9ea931e): STATEMENT lines whose rule token differs from the item's rule. stmtOf matches a STATEMENT by link only (no rule test),
// while xkCnt counts only items of the label's own rule. A STATEMENT that names the item's link under another rule therefore counts 0 keys and
// beats the item's own STATEMENT (1 key), wherever it stands. Run from wall2024/: node pkgXK/w1_grade/probe_XK_w1.cjs
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const A='pkgLIB/strip_RPN/patched/',B='pkgLIB/strip_XKB/patched/';const R=f=>fs.readFileSync(f,'utf8');
const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const t0=c0.choices[0].message.content;
const J0=JSON.parse(t0.trim().replace(/^```(?:json)?\s*|\s*```$/g,""));const r0=J0.reasoning;const wrap=txt=>JSON.stringify(Object.assign({},J0,{reasoning:txt}));
const run=(D,reasoning)=>{const c=JSON.parse(JSON.stringify(c0));c.choices[0].message.content=reasoning===r0?t0:wrap(reasoning);const H=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]});
 const n=H(R(D+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');return harness('34016',{'Panel Cure Normalize 2':n})(R(D+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra');};
const g=(L,it)=>L.find(r=>r.item===it)||{};let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
const own='STATEMENT: K-W DEFENDER CR2 D3 #3 |';const i=r0.indexOf(own);const eol=r0.indexOf('\n',i);
for(const [nm,line] of [
 ['a K-S3-labelled STATEMENT for D3 #3 written AFTER its own K-W STATEMENT','STATEMENT: K-S3 DEFENDER CR2 D3 #3 | TOUCHES NO LINK: unrelated text with no quote.'],
 ['the same line with a K-W label (control: 1 key, the first line wins as live)','STATEMENT: K-W DEFENDER CR2 D3 #3 | TOUCHES NO LINK: unrelated text with no quote.']]){
 const t=r0.slice(0,eol+1)+line+'\n'+r0.slice(eol+1);const a=run(A,t),b=run(B,t),s=run(B,r0);
 const pa=g(a,'DEFENDER CR2 D3 #3'),pb=g(b,'DEFENDER CR2 D3 #3'),ps=g(s,'DEFENDER CR2 D3 #3');
 console.log('  '+nm+'\n    live:  '+pa.cure_status+' | '+String(pa.cure_reason).slice(0,110)+'\n    pkgXK: '+pb.cure_status+' | '+String(pb.cure_reason).slice(0,110)+'\n    pkgXK, reply as stored: '+ps.cure_status);
 const sr=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);T(sr(a)===sr(b),nm+': every terra row (all fields) on pkgXK equals live');}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
