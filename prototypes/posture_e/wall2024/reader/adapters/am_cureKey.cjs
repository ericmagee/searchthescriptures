// cureLines CURE_KEY (panel cure check): RESTATED, RETRACTED, CORRECTED RESULT/COUNT/STANDING, NOT PRESSED, PRESSED, SHORT, STATEMENT, RESPONSE.
// Upper-case keys only. CORRECTED RESULT tag read with the pkgCR regex.
const {L}=require('./_util.cjs');
module.exports={name:'cureLines: CURE_KEY (+pkgCR tag)',form:'RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|NOT PRESSED|PRESSED|SHORT|STATEMENT|RESPONSE',scope:'line',read(l){
 const s=String(l).replace(/[*_`]+/g,'').replace(/^\s*(?:[-•>]|\d+[.)])?\s*/,'').trim();const k=s.match(L.CURE_KEY);if(!k)return null;const f={form:k[1],rest:k[2]};
 if(k[1]==='CORRECTED RESULT'){const m=k[2].match(L.CR_RX);f.tag=m?m[1].toUpperCase():null;}return f;}};
