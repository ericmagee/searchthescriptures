// W1 grade of pkgXK: whole Panel Cure Check output (summary, bodies, log), live vs pkgXK, for a STATEMENT naming D3 #3's link under another rule,
// written after D3 #3's own STATEMENT. Prints where the two outputs differ. Run from wall2024/: node pkgXK/w1_grade/probe_XK_w1b.cjs
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const A='pkgLIB/strip_RPN/patched/',B='pkgLIB/strip_XKB/patched/';const R=f=>fs.readFileSync(f,'utf8');
const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const t0=c0.choices[0].message.content;
const J0=JSON.parse(t0.trim().replace(/^```(?:json)?\s*|\s*```$/g,""));const r0=J0.reasoning;const wrap=txt=>JSON.stringify(Object.assign({},J0,{reasoning:txt}));
const run=(D,reasoning)=>{const c=JSON.parse(JSON.stringify(c0));c.choices[0].message.content=wrap(reasoning);const H=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]});
 const n=H(R(D+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');return harness('34016',{'Panel Cure Normalize 2':n})(R(D+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;};
const own='STATEMENT: K-W DEFENDER CR2 D3 #3 |';const i=r0.indexOf(own);const eol=r0.indexOf('\n',i);
const sr=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
for(const rule of process.argv.slice(2).length?process.argv.slice(2):['K-S3','K-W']){
 const line='STATEMENT: '+rule+' DEFENDER CR2 D3 #3 | TOUCHES NO LINK: WRONGLINE marker text.';const t=r0.slice(0,eol+1)+line+'\n'+r0.slice(eol+1);
 const a=sr(run(A,t)),b=sr(run(B,t));console.log(rule+' label: whole output '+(a===b?'EQUAL':'DIFFERS')+'; WRONGLINE text in live output '+a.split('WRONGLINE').length/1+'-1, in pkgXK output '+b.split('WRONGLINE').length/1+'-1');
 if(a!==b){let k=0;while(a[k]===b[k])k++;console.log('   first difference: live '+JSON.stringify(a.slice(k-150,k+120))+'\n                    pkgXK '+JSON.stringify(b.slice(k-150,k+120)));}}
