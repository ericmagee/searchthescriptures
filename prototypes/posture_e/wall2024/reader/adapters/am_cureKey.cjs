// cureLines CURE_KEY (panel cure check): RESTATED, RETRACTED, CORRECTED RESULT/COUNT/STANDING, NOT PRESSED, PRESSED, SHORT, STATEMENT, RESPONSE.
// Upper-case keys only. CORRECTED RESULT tag read with the pkgCR regex.
const {L}=require('./_util.cjs');
module.exports={name:'cureLines: CURE_KEY (+pkgCR tag)',form:'COLLISION|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|NOT PRESSED|PRESSED|SHORT|STATEMENT',scope:'line',read(l){
 const s=String(l).replace(/[*_`]+/g,'').replace(/^\s*(?:[-•>]|\d+[.)])?\s*/,'').trim();const k=s.match(L.CURE_KEY);if(!k)return null;const F={RESTATED:'COLLISION',STATEMENT:'STATEMENT',RESPONSE:'STATEMENT'};const f={form:F[k[1]]||k[1]};if(k[1]==='RESTATED'){f.form='ANY';} /* the old key does not know the wrapped form (W3 spec 7 G12) */if(F[k[1]]==='STATEMENT')f.which=k[1]; /* readLines names: RESTATED is a COLLISION with restated; RESPONSE is a STATEMENT with which */
 if(k[1]==='CORRECTED RESULT'){const m=k[2].match(L.CR_RX);f.tag=m?m[1].toUpperCase():null;}return f;}};
