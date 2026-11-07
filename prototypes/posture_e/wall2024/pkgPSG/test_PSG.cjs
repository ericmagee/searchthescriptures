// pkgPSG tests. Run from wall2024/: node pkgPSG/test_PSG.cjs
const {harness,rd,D}=require('../pkgGSL/harness.cjs');let ok=0,bad=0;const T=(n,c,x)=>{console.log((c?'OK   ':'FAIL ')+n);if(x)console.log('     '+x);c?ok++:bad++;};
const NP=o=>JSON.stringify(o,(k,v)=>k==='psrc'?undefined:v);const B=f=>rd('pkgPSG/base/'+f),P=f=>rd('pkgPSG/patched/'+f);const rows=j=>(j.gate_rows||[]).map(r=>r.seat+' '+r.item+' '+r.cure_status);
const call=JSON.parse(rd(D+'33222_Alt_Gate_Call_openrouter.json'));const it=(d=>{const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];})(call);
const G4='GATE: G4 || CHANGE TO: CONCEDED LINKS: 4 -- premise 3 UNEXHIBITED (Isaiah 8:8 unanswered);';
const mod=(from,to)=>{const s=JSON.stringify(it);if(s.split(from).length!==2)throw new Error('control anchor');return JSON.parse(s.split(from).join(to));};
// parity on the real runs
{const H=harness('33222');const b=H(B('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json,p=H(P('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json;
 T('33222 Alt Gate Record: patched output equals base (pkgGSL) apart from the added psrc field on gate change records; grok G1-G4 CURED',NP(p)===NP(b)&&rows(p).every(r=>/ CURED$/.test(r)),rows(p).join('; '));}
for(const RUN of ['33222','33218']){const H=harness(RUN);const b=H(B('Gate_Record.js'),'Gate Call openrouter')[0].json,p=H(P('Gate_Record.js'),'Gate Call openrouter')[0].json;
 T(RUN+' Gate Record: patched output equals base apart from the added psrc field on gate change records',NP(p)===NP(b),rows(b).join('; '));}
// control (W3 2726 a): grok's G4 regrades the unnamed premise 1
{const c1=mod(G4,'GATE: G4 || CHANGE TO: CONCEDED LINKS: 5 -- premise 1 UNEXHIBITED (Matthew 1:2 unanswered); premise 3 UNEXHIBITED (Isaiah 8:8 unanswered);');
 const H=harness('33222',{'Alt Gate Call openrouter':c1});const b=H(B('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json,p=H(P('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json;
 const g4=j=>(j.gate_rows||[]).find(r=>/^G4 /.test(r.item));
 T('control: G4 regrades premise 1: base applies it and CURES G4 (the gap)',g4(b)&&g4(b).cure_status==='CURED',rows(b).join('; '));
 T('control: pkgPSG refuses it (NOT APPLIED, premise 1 not named) and G4 is UNCURED',g4(p)&&g4(p).cure_status==='UNCURED',rows(p).join('; '));
 const fr=JSON.stringify(p.gate&&p.gate.report||p.gate||{});T('control: the refusal reason names premise 1 and pkgPS',/regrades premise 1, which/.test(JSON.stringify(p)),(JSON.stringify(p).match(/the change regrades premise 1[^"]{0,160}/)||[''])[0]);}
// negative control: an in-scope G4 that moves the count within the named premises stays applied
{const c2=mod(G4,'GATE: G4 || CHANGE TO: CONCEDED LINKS: 3 -- premise 3 UNEXHIBITED (Isaiah 8:8 unanswered);'.replace('3 -- premise 3','3 -- premise 3')); 
 const s=JSON.stringify(c2).replace('premise 4 UNEXHIBITED (passive witnesses unanswered); premise 5 UNEXHIBITED (Luke 2:48 unanswered); premise 6','premise 4 SPARED (answered in [CR3]); premise 5 UNEXHIBITED (Luke 2:48 unanswered); premise 6');const c3=JSON.parse(s);
 const H=harness('33222',{'Alt Gate Call openrouter':c3});const p=H(P('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json;const g4=(p.gate_rows||[]).find(r=>/^G4 /.test(r.item));
 T('negative control: G4 spares premise 4 (a named premise) with count 3: applied and CURED under pkgPSG',g4&&g4.cure_status==='CURED',rows(p).join('; '));}
console.log(ok+' OK, '+bad+' FAIL');
