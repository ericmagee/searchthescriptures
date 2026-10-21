// Wrong-if L3 (BB-7331) for the RETRACTED / CORRECTED RESULT rule, run on a debate's Drive report (markdown): violations table and Judges list.
// The cure column of an item cured by retraction carries the RETRACTED line and the seat's CORRECTED RESULT line (3d code), so all three limbs read the report alone.
// Limb A: a row is CURED with a RETRACTED line in its cure column and no CORRECTED RESULT line: a retraction cured without a corrected result.
// Limb B: a judge with a row CURED by retraction is listed under Judges with a verdict other than its CORRECTED RESULT word: counted on the original.
//   A judge marked "(removed)" is not counted, so limb B passes over it.
// Limb C: a row is CURED with a WITHDRAWN line in its cure column, or CURED with no cure line (RESTATED, RETRACTED, CORRECTED, PRESSED, SHORT)
//   while the judge's own statement says withdraw or retract: an item cured by a WITHDRAWN line or a STATEMENT.
const fs=require('fs');const md=fs.readFileSync(process.argv[2],'utf8');
const rows=md.split('\n').filter(l=>/^\| .* \| \*\*(CURED|UNCURED)\*\* \|/.test(l)).map(l=>{const c=l.split(' | ');
 return {judge:c[0].replace(/^\| /,''),link:c[1],rule:c[2],status:c[3].replace(/\*/g,''),cure:c[5]||'',stmt:(c[6]||'').replace(/ \|$/,'')};});
if(!rows.length){console.log('L3 FIRED: no violations table rows to read');process.exit(0);}
const name=j=>j.replace(/\(removed\)/,'').split(/:\s*|\bjudge\s+/).pop().trim();
const listed={};for(const m of md.matchAll(/^- (Panel judge \d+|Single judge): ([^(\n]+?) \([^)\n]*\): \*\*(HELD|PARTIAL|BROKEN)\*\*/gm))listed[m[2].trim()]=m[3];
const id=r=>r.judge+' '+r.link+' '+r.rule;
const A=rows.filter(r=>r.status==='CURED'&&/RETRACTED: D\d+ vs C\d+/.test(r.cure)&&!/CORRECTED RESULT: (BROKEN|PARTIAL|HELD)-\d/.test(r.cure)).map(id);
const B=[];const seen=new Set();
for(const r of rows){if(r.status!=='CURED'||/\(removed\)/.test(r.judge))continue;const m=r.cure.match(/RETRACTED: D\d+ vs C\d+.*CORRECTED RESULT: (BROKEN|PARTIAL|HELD)-\d/);if(!m)continue;
 const n=name(r.judge);if(seen.has(n))continue;seen.add(n);
 if(listed[n]!==m[1])B.push(n+' corrected '+m[1]+', listed '+(listed[n]||'not listed'));}
const C=rows.filter(r=>r.status==='CURED'&&(/WITHDRAWN: D\d+ vs C\d+/.test(r.cure)||(!/(RESTATED|RETRACTED|CORRECTED COUNT|CORRECTED STANDING|CORRECTED RESULT|PRESSED|SHORT):/.test(r.cure)&&/withdraw|retract/i.test(r.stmt)))).map(id);
const f=(n,x)=>'| limb '+n+' '+(x.length?'FIRED: '+x.join('; '):'silent');
console.log('rows',rows.length,'| judges listed',Object.keys(listed).length,f('A',A),f('B',B),f('C',C));
