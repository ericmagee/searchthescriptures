// Wrong-if L3 (BB-7322) for the WITHDRAWN cure rule, run on a debate's Drive report (markdown), violations table.
// Fires (limb A): a judge wrote "WITHDRAWN: Dn vs Cm" in the cure column of any row, and another row of that judge on the same link is UNCURED.
// Fires (limb B): a row is CURED while its cure column carries no cure line (RESTATED, WITHDRAWN, CORRECTED, PRESSED, SHORT) and the judge's
//   own statement says "withdraw": a withdrawal written anywhere but a WITHDRAWN line was counted.
const fs=require('fs');const md=fs.readFileSync(process.argv[2],'utf8');
const rows=md.split('\n').filter(l=>/^\| .* \| \*\*(CURED|UNCURED)\*\* \|/.test(l)).map(l=>{const c=l.split(' | ');
 return {judge:c[0].replace(/^\| /,''),link:c[1],rule:c[2],status:c[3].replace(/\*/g,''),cure:c[5]||'',stmt:(c[6]||'').replace(/ \|$/,'')};});
if(!rows.length){console.log('L3 FIRED: no violations table rows to read');process.exit(0);}
const wd={};for(const r of rows)for(const m of r.cure.matchAll(/WITHDRAWN: (D\d+ vs C\d+)/g))(wd[r.judge]=wd[r.judge]||new Set()).add(m[1]);
const A=rows.filter(r=>r.status==='UNCURED'&&wd[r.judge]&&wd[r.judge].has(r.link)).map(r=>r.judge+' '+r.link+' '+r.rule);
const B=rows.filter(r=>r.status==='CURED'&&!/(RESTATED|WITHDRAWN|CORRECTED COUNT|CORRECTED STANDING|PRESSED|SHORT):/.test(r.cure)&&/withdraw/i.test(r.stmt)).map(r=>r.judge+' '+r.link+' '+r.rule);
console.log('rows',rows.length,'| L3 limb A',A.length?'FIRED: '+A.join('; '):'silent','| limb B',B.length?'FIRED: '+B.join('; '):'silent');
