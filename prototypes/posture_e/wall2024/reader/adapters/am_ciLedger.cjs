// ciLedger CI_LINE + ciForm: the PRESSED / NOT PRESSED ledger form (case-insensitive).
const {L}=require('./_util.cjs');
module.exports={name:'ciLedger: CI_LINE/CI_PRESSED',form:'PRESSED|NOT PRESSED',scope:'line',read(l){const s=String(l).replace(/[*_`]+/g,'');const m=s.match(L.CI_LINE);if(!m)return null;
 const kind=m[1].toUpperCase();const f={form:kind,valid:L.ciForm(kind,m[2].trim())};if(kind==='PRESSED'){const p=m[2].trim().match(L.CI_PRESSED);if(p)Object.assign(f,{verse:p[1],round:p[2].toUpperCase(),quote:p[3],answered:p[4].toUpperCase()});}return f;}};
