// pkgGSL tests. Run from wall2024/: node pkgGSL/test_GSL.cjs
const {harness,rd}=require('./harness.cjs');let ok=0,bad=0;const T=(n,c,x)=>{console.log((c?'OK   ':'FAIL ')+n);if(x)console.log('     '+x);c?ok++:bad++;};
const B=f=>rd('pkgGSL/base/'+f),P=f=>rd('pkgGSL/patched/'+f);
const rows=j=>(j.gate_rows||[]).map(r=>r.seat+' '+r.item+' '+r.cure_status);
// 33222 Alt Gate Record (grok)
{const H=harness('33222');const b=H(B('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json,p=H(P('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json;
 T('33222 Alt Gate Record base (s16 code): grok G1-G3 UNCURED, G4 CURED (as the live run on s12)',JSON.stringify(rows(b))===JSON.stringify(['grok G1 NOT APPLIED (E-APPLY S35) UNCURED','grok G2 NOT APPLIED (E-APPLY S36) UNCURED','grok G3 NOT APPLIED (E-APPLY S37) UNCURED','grok G4 NOT APPLIED (E-APPLY S38) CURED']),rows(b).join('; '));
 T('33222 Alt Gate Record pkgGSL: grok G1-G4 all CURED, G1-G3 by the later applied change G4',rows(p).every(r=>/CURED$/.test(r)&&!/UNCURED/.test(r))&&(p.gate_rows||[]).slice(0,3).every(r=>/G4 of this judge rewrote the same line/.test(JSON.stringify(r))),rows(p).join('; '));
 const strip=o=>JSON.stringify(o,(k,v)=>(k==='gate_rows'||k==='gate'||k==='bodies'||k==='summary'||k==='drv_uncured'||k==='verdict_raw'||k==='p_rows'||k==='enforcer_log'||k==='enforcer_log_body'||k==='alt_needed')?undefined:v);
 T('33222 Alt Gate Record: nothing else changes: only the gate cure rows, the seat drv_uncured (3 to 0) and alt_needed (true to false, since no seat is left uncured)',strip(p)===strip(b));
 const du=j=>JSON.stringify((j.bodies||[]).map(x=>{const o=typeof x==='string'?JSON.parse(x):x;return [o.payload&&o.payload.judge_seat,o.payload&&o.payload.drv_uncured];}));
 console.log('     drv_uncured per body: base '+du(b)+' patched '+du(p));
 // downstream: Alternate Merge with the patched gate output
 const H2=harness('33222',{'Alt Gate Record':[{json:p}]});const am=H2(P('Alternate_Merge.js'),'Alt Gate Record')[0].json;const amB=harness('33222',{'Alt Gate Record':[{json:b}]})(B('Alternate_Merge.js'),'Alt Gate Record')[0].json;
 T('33222 Alternate Merge base on base gate: grok not seated (the live outcome)',(amB.alt_apply||[]).some(a=>a.seat==='grok'&&a.unseated),JSON.stringify((amB.alt_apply||[]).map(a=>[a.seat,a.unseated,a.why&&a.why.slice(0,120)])));
 T('33222 Alternate Merge on the pkgGSL gate: grok seated in gemini\'s place',(am.alt_apply||[]).some(a=>a.seat==='grok'&&!a.unseated)&&(am.panel_effective||[]).includes('grok'),'panel_effective '+JSON.stringify(am.panel_effective)+' summary '+JSON.stringify((am.summary||[]).map(s=>[s.seat,s.verdict||s.verdict_tag,s.defense_standing])));}
// main-chain Gate Record on 33222 and 33218: unchanged
for(const RUN of ['33222','33218']){const H=harness(RUN);const b=H(B('Gate_Record.js'),'Gate Call openrouter')[0].json,p=H(P('Gate_Record.js'),'Gate Call openrouter')[0].json;
 T(RUN+' Gate Record (panel seats): patched output equals base',JSON.stringify(p)===JSON.stringify(b),rows(b).join('; '));}
console.log(ok+' OK, '+bad+' FAIL');
