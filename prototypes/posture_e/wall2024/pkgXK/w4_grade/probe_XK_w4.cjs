// W4 grade of pkgXK rev 2: break probes on terra 34016 Panel 2 (Panel Cure Check whole output, live s79 vs pkgXK strip_XKB).
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const A='pkgLIB/strip_RPN/patched/',B='pkgLIB/strip_XKB/patched/';const R=f=>fs.readFileSync(f,'utf8');
const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const t0=c0.choices[0].message.content;
const J0=JSON.parse(t0.trim().replace(/^```(?:json)?\s*|\s*```$/g,""));const r0=J0.reasoning;
const run=(D,content)=>{const c=JSON.parse(JSON.stringify(c0));c.choices[0].message.content=content;const H=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]});
 const n=H(R(D+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');return harness('34016',{'Panel Cure Normalize 2':n})(R(D+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;};
const wrap=txt=>JSON.stringify(Object.assign({},J0,{reasoning:txt}));
const sr=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
const own='STATEMENT: K-W DEFENDER CR2 D3 #3 |';const i=r0.indexOf(own);const eol=r0.indexOf('\n',i);const ownLine=r0.slice(i,eol);
const st=(o,lab)=>{const s=JSON.stringify(o);const k=s.indexOf(lab);return k<0?'(none)':s.slice(k,k+20);};
const has=(o,w)=>sr(o).split(w).length-1;
const W='STATEMENT: K-S3 DEFENDER CR2 D3 #3 | TOUCHES NO LINK: WRONGLINE marker text.';
const W2='STATEMENT: K-S3 DEFENDER CR2 D3 #3 | TOUCHES NO LINK: SECONDWRONG marker text.';
const cases=[
 ['P1 zero-key wrong-rule line BEFORE the own statement', r0.slice(0,i)+W+'\n'+r0.slice(i)],
 ['P2 own statement removed; two zero-key lines only (first must win, as live)', r0.slice(0,i)+W+'\n'+W2+r0.slice(eol)],
 ['P3 own line rewritten to name two items (2 keys) after a zero-key line', r0.slice(0,i)+W+'\n'+ownLine.replace('D3 #3','D3 #3 and DEFENDER CR2 D2 #2')+r0.slice(eol)],
];
for(const [name,t] of cases){const a=run(A,wrap(t)),b=run(B,wrap(t));
 console.log(name+': whole output '+(sr(a)===sr(b)?'EQUAL':'DIFFERS')+'; WRONGLINE live '+has(a,'WRONGLINE')+' pkgXK '+has(b,'WRONGLINE')+'; SECONDWRONG live '+has(a,'SECONDWRONG')+' pkgXK '+has(b,'SECONDWRONG'));}
