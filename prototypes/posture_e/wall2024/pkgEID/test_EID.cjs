// pkgEID tests. Record base (pkgEFG/patched_live_on_pkgEAM) vs patched on saved inputs (harness), plus controls on the 33389 call.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const BS=process.env.BS||'pkgEFG/patched_live_on_pkgEAM',PT=process.env.PT||'pkgEID/patched';let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK   ':'FAIL ')+n);c?ok++:bad++;};
const rf=f=>fs.readFileSync(f,'utf8');const ld=f=>{const J=JSON.parse(rf(D+f));const e=J[0].data||J[0];return e.main[0];};
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js']){const s=rf(PT+'/'+f);T(f+': reply form says ITEM id, id alone',s.includes('one line per ITEM id (the id alone, for example H2.1')&&s.includes('ENFORCER: <item id> -- ')&&!s.includes('one line per judge id'));}
const tally=o=>{const t={};o.enf428_rows.forEach(r=>{const k=(String(r.cure_reason).match(/^ENFORCER [A-Z ]+?(?= \(|:|$)/)||['?'])[0];t[k]=(t[k]||0)+1;});return t;};
const nv=o=>o.enf428_rows.filter(r=>/^ENFORCER NO VERDICT/.test(r.cure_reason)).length;
const run=(code,over)=>harness('33389',over)(code,'Judge Enforcer Call deepseek')[0].json;
const C=ld('33389_Judge_Enforcer_Call_deepseek.json');const b=run(rf(BS+'/Judge_Enforcer_Record.js')),p=run(rf(PT+'/Judge_Enforcer_Record.js'));
console.log('     base  NO VERDICT '+nv(b)+' of '+b.enf428_rows.length+'; patched '+nv(p)+' of '+p.enf428_rows.length+'; eid '+JSON.stringify(p.enf428.eid));
T('33389: call 3 (21 judge-name lines) maps by order, call 4 (30 "ID (seat)" lines) is read; NO VERDICT 51 -> 0',p.enf428.eid.mapped_by_order===21&&p.enf428.eid.calls_mapped.join()==='3'&&p.enf428.eid.seat_beside_id===30&&nv(b)===51&&nv(p)===0);
T('33389: rows of calls 1, 2, 5 unchanged',(()=>{const BJ=ld('33389_Judge_Enforcer_Build.json');const ids=new Set([...BJ[2].json.ids,...BJ[3].json.ids].map(x=>x.item+'|'+x.seat));let same=true;b.enf428_rows.forEach((r,k)=>{const q=p.enf428_rows[k];if(JSON.stringify(r)!==JSON.stringify(q)&&!ids.has(r.item+'|'+r.seat))same=false;});return same&&b.enf428_rows.length===p.enf428_rows.length;})());
// mismatch control: swap the first two seat lines (gemini, gemini, chatgpt ... -> gemini, chatgpt, gemini ...)
const swap=JSON.parse(JSON.stringify(C));{const c=swap[2].json.choices[0].message;const L=c.content.split('\n');const ix=L.map((l,k)=>/ENFORCER/.test(l)?k:-1).filter(k=>k>=0);[L[ix[1]],L[ix[2]]]=[L[ix[2]],L[ix[1]]];c.content=L.join('\n');}
const pm=run(rf(PT+'/Judge_Enforcer_Record.js'),{'Judge Enforcer Call deepseek':swap});
T('mismatch control (judge order differs): stays NO VERDICT, label fault named',nv(pm)===21&&pm.enf428.eid.unmapped===21&&pm.enf428.eid.seat_beside_id===30&&pm.enf428.errors.some(e=>/pkgEID label fault/.test(e)));
const short=JSON.parse(JSON.stringify(C));{const c=short[2].json.choices[0].message;const L=c.content.split('\n');const k=L.findIndex(l=>/ENFORCER/.test(l));L.splice(k,1);c.content=L.join('\n');}
const ps=run(rf(PT+'/Judge_Enforcer_Record.js'),{'Judge Enforcer Call deepseek':short});
T('count control (one line missing): stays NO VERDICT',nv(ps)===21&&ps.enf428.eid.unmapped===20);
// "ID (seat)" control: rewrite call 3 lines as "<id> (<seat>) -- ..."
const lab=JSON.parse(JSON.stringify(C));{const ids=ld('33389_Judge_Enforcer_Build.json')[2].json.ids;const c=lab[2].json.choices[0].message;let k=0;c.content=c.content.split('\n').map(l=>/^\W*ENFORCER\s*:/.test(l)?l.replace(/ENFORCER\s*:\s*([A-Za-z][\w.-]*)/,(m0,s)=>'ENFORCER: '+ids[k++].id+' ('+s+')'):l).join('\n');}
const pl=run(rf(PT+'/Judge_Enforcer_Record.js'),{'Judge Enforcer Call deepseek':lab});const bl=run(rf(BS+'/Judge_Enforcer_Record.js'),{'Judge Enforcer Call deepseek':lab});
T('"ID (seat)" labels: base drops all 51, patched reads all 51',nv(bl)===51&&nv(pl)===0&&pl.enf428.eid.seat_beside_id===51&&pl.enf428.eid.mapped_by_order===0);
T('same verdicts whichever label form',JSON.stringify(pl.enf428_rows.map(r=>r.cure_reason))===JSON.stringify(p.enf428_rows.map(r=>r.cure_reason)));
{const bJ=ld('33249_Judge_Enforcer_Build.json');const r1=harness('33249')(rf(PT+'/Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek')[0].json;
 T('33249 bare "Y1"/"Y2" labels read as Y1.1/Y2.1',r1.enf428.eid.bare_number===2&&r1.enf428_rows.filter(r=>/^ENFORCER NO VERDICT/.test(r.cure_reason)).length===0);
 const b2=JSON.parse(JSON.stringify(bJ));b2[4].json.ids.push({...b2[4].json.ids[0],id:'Y1.2'});
 const r2=harness('33249',{'Judge Enforcer Build':b2})(rf(PT+'/Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek')[0].json;
 T('ambiguity control (Y1.1 and Y1.2 in the call): "Y1" stays unread, label fault named',r2.enf428.eid.bare_number===1&&r2.enf428.eid.unmapped===1&&r2.enf428.errors.some(e=>/reply label Y1 names no single item/.test(e)));}
console.log(ok+' OK, '+bad+' FAIL');
