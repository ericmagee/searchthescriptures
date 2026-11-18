// ASK 386 rev 4 part 2 (W1 8507, ruled option (i) at 8514): when rcLines reads no collision line but the text holds short-form "Dn: GRADE" lines (LINK STATE)
// or prefixed "Dn: Dn vs Cm" lines, the v61 tag INPUTS records "LINK STATE LINES NOT READ (short form)". No word changes: an empty list already gives no tie (2i).
const fs=require('fs');const p=__dirname+'/build386.cjs';let s=fs.readFileSync(p,'utf8');
const R=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));s=s.replace(a,()=>b);};
R("const P=rcLines(cureJText(s,true));const v=g('verdict_tag')",
  String.raw`const JT=cureJText(s,true);const P=rcLines(JT);const sfu=!P.col.length&&String(JT).split('\\n').some(l=>{const x=l.replace(/^[\\s*\\-•>#]+/,'').replace(/[*_]+/g,'');const q=ri5Rd2024(x);return (q&&q.form==='LINK STATE'&&/^D\\d+$/i.test(String(q.f.link||'')))||/^D\\d+\\s*:\\s*D\\d+\\s+vs\\.?\\s+C\\d+/i.test(x);});const v=g('verdict_tag')`);
R("+(r.tie?', TIE yes':'')","+(sfu?', LINK STATE LINES NOT READ (short form)':'')+(r.tie?', TIE yes':'')");
R("p:[[240,328],903,[904,905],1286,","p:[[240,328],338,903,[904,905],1286,");
fs.writeFileSync(p,s);console.log('rev 4 part 2 edits applied');
