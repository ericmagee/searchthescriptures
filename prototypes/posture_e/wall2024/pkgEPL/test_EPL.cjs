// pkgEPL test. Run from wall2024/: node pkgEPL/test_EPL.cjs
// 1. 33442: Judge Enforcer Record base vs patched on the saved input (NO VERDICT 30 -> 0; each P line AGREE SPARED).
// 2. pkgESS count (W3 bar d): the patched Retry Build does not resend 33442 call 5; base s48 does.
// 3. Controls (synthetic, on 33442 call 5): one judge's count line made non-zero -> that item stays NO VERDICT and the Retry Build resends;
//    a dotted reply line still wins over a bare one.
// 4. Replay: every saved run 33218+ x 6 nodes, base vs patched; every changed output listed. Build changes are checked to keep the same ids per call.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s48.json';
const B0=f=>fs.readFileSync(__dirname+'/base_s48/'+f,'utf8'),P1=f=>fs.readFileSync(__dirname+'/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const rows=o=>{const j=o[0].json;return (j.enf428_rows||[]).concat(j.enf421_rows||[]);};const nv=o=>rows(o).filter(x=>/NO VERDICT/.test(x.cure_reason||''));
const sd=n=>JSON.parse(fs.readFileSync(D+'33442_'+n.replace(/ /g,'_')+'.json','utf8'))[0].data.main[0];
// 1
{const H=harness('33442');const a=H(B0('Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek'),b=H(P1('Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek');
 T(nv(a).length===30,'33442 base Record: '+nv(a).length+' NO VERDICT');T(nv(b).length===0,'33442 patched Record: '+nv(b).length+' NO VERDICT');
 const P=rows(b).filter(x=>x.rule==='E-PREM'&&/^premise listed/.test(x.item));const p3=P.filter(x=>/defender 3$|challenger [1-6]$|defender [4-6]$/.test(x.item));
 T(p3.length===30&&p3.every(x=>/^ENFORCER AGREE/.test(x.cure_reason||'')&&/SPARED/.test(x.cure_reason||'')),'33442 the 30 rows now read ENFORCER AGREE (right: SPARED): '+p3.length+' rows, e.g. '+JSON.stringify((p3[0]||{}).cure_reason||'').slice(0,120));
 const other=x=>!(x.rule==='E-PREM'&&/defender [3-6]$|challenger [1-6]$/.test(x.item));const st=r=>JSON.stringify(r.filter(other).map(x=>[x.seat,x.rule,x.item,x.cure_reason,x.cure_status]));
 T(st(rows(a))===st(rows(b)),'33442 every other row unchanged ('+rows(a).filter(other).length+')');}
// 2 + 3
{const C=sd('Judge Enforcer Call deepseek'),BB=sd('Judge Enforcer Build');const call5=BB.findIndex(x=>(x.json.ids||[]).some(y=>y.id==='P3.1'));
 const H=harness('33442',{'Judge Enforcer Build':BB,'Judge Enforcer Call deepseek':C});
 const a=H(B0('Judge_Enforcer_Retry_Build.js'),'Judge Enforcer Call deepseek'),b=H(P1('Judge_Enforcer_Retry_Build.js'),'Judge Enforcer Call deepseek');
 const of=o=>o.filter(x=>x.json.esr_retry).map(x=>x.json.esr_of);
 T(of(a).includes(call5),'base s48 (pkgESS) resends call '+(call5+1)+': '+JSON.stringify(a.filter(x=>x.json.esr_of===call5).map(x=>x.json.esr_why)[0]||''));
 T(!of(b).includes(call5),'patched does not resend call '+(call5+1)+' (retried: '+JSON.stringify(of(b))+')');
 // control: gemini counts a link on defender premise 3 -> no fan-out for P3, retry fires
 const BB2=JSON.parse(JSON.stringify(BB));for(const x of BB2[call5].json.ids)if(x.id==='P3.1'||x.id==='P4.1'){x.flagged_line='CONCEDED LINKS: 1 -- premise 3 is CONCEDED.';}
 const H2=harness('33442',{'Judge Enforcer Build':BB2,'Judge Enforcer Call deepseek':C});const c=H2(P1('Judge_Enforcer_Retry_Build.js'),'Judge Enforcer Call deepseek');
 T(of(c).includes(call5),'control: P3 and P4 seat grades differ (6 lines unanswered) -> patched resends call '+(call5+1));
 const r2=H2(P1('Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek');const n2=nv(r2);
 T(n2.length===6&&n2.every(x=>/defender [34]$/.test(x.item)),'control: Record leaves exactly P3.1-P4.3 NO VERDICT ('+n2.length+')');
 // control: dotted line wins over bare
 const C3=JSON.parse(JSON.stringify(C));C3[call5].json.choices[0].message.content='ENFORCER: P3.2 -- DISAGREE -- RIGHT: COUNTED -- (UNEXHIBITED: lacks [L1]) "x".\n'+C3[call5].json.choices[0].message.content;
 const r3=harness('33442',{'Judge Enforcer Call deepseek':C3})(P1('Judge_Enforcer_Record.js'),'Judge Enforcer Call deepseek');const x32=rows(r3).find(x=>x.seat==='chatgpt'&&/defender 3$/.test(x.item));
 T(x32&&!/^ENFORCER AGREE/.test(x32.cure_reason||''),'control: a dotted P3.2 line before the bare P3 keeps its own verdict: '+JSON.stringify((x32||{}).cure_reason||'').slice(0,90));}
// 5. the patched prompt carries the due line, and a pkgESS split half keeps it with its item
{const H=harness('33442');const b=H(P1('Judge_Enforcer_Build.js'),'Judge Enforcer Needed?');const k=b.findIndex(x=>(x.json.ids||[]).some(y=>y.id==='P3.1'));const msg=b[k].json.body.messages[1].content;
 T(msg.includes('REPLY LINES DUE FOR THIS ITEM: P3.1, P3.2, P3.3 (')&&msg.includes('one line per LINE id'),'patched 33442 prompt (call '+(k+1)+') names P3.1, P3.2, P3.3 and asks one line per LINE id');
 const fake=b.map(()=>({json:{choices:[{finish_reason:'stop',message:{content:'ENFORCER: X1.1 -- AGREE -- RIGHT: MEETS -- "x"'}}]}}));
 const r=harness('33442',{'Judge Enforcer Build':b,'Judge Enforcer Call deepseek':fake})(P1('Judge_Enforcer_Retry_Build.js'),'Judge Enforcer Call deepseek').filter(x=>x.json.esr_of===k);
 const okh=r.length===2&&r.every(h=>{const c=h.json.body.messages[1].content;return h.json.ids.filter(y=>/^P\d+\./.test(y.id)).every(y=>{const it=y.id.split('.')[0];const i=c.indexOf('ITEM '+it+' (');const j=c.indexOf('\n\nITEM ',i+1);const t=c.slice(i,j<0?undefined:j);return t.includes('REPLY LINES DUE FOR THIS ITEM: ')&&t.includes(y.id);});});
 T(okh,'split halves of call '+(k+1)+': each P item text carries its own due line ('+r.map(h=>h.json.ids.length).join('+')+' ids)');}
// 4
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);let n=0;const flips=[];
const NODES=['Judge Enforcer Build','Alt Judge Enforcer Build','Judge Enforcer Record','Alt Judge Enforcer Record','Judge Enforcer Retry Build','Alt Judge Enforcer Retry Build'];
for(const RUN of runs){const H=harness(RUN);for(const nm of NODES){const f=nm.replace(/ /g,'_')+'.js';if(!fs.existsSync(D+RUN+'_'+nm.replace(/ /g,'_')+'.json'))continue;
 const fe=feeder(BASEW,nm);const fin=[...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));if(!fin)continue;
 let a,b,e0=null,e1=null;try{a=H(B0(f),fin);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),fin);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+')');continue;}n++;
 if(/Enforcer Build$/.test(nm)&&!/Retry/.test(nm)){const ids=o=>JSON.stringify(o.map(x=>(x.json.ids||[]).map(y=>y.id)));const ia=ids(a),ib=ids(b);
  const strip=o=>st(o.map(x=>{const j={...x.json};if(j.body)j.body={...j.body,messages:'(prompt)'};return j;}));
  if(ia!==ib||strip(a)!==strip(b))flips.push(RUN+' '+nm+': ids per call '+(ia===ib?'same':'DIFFER')+', other fields '+(strip(a)===strip(b)?'same':'DIFFER'));
  else if(st(a)!==st(b))flips.push(RUN+' '+nm+': prompt text only (ids per call same)');continue;}
 const sa=st(a),sb=st(b);if(sa===sb)continue;let i=0;while(sa[i]===sb[i])i++;flips.push(RUN+' '+nm+' @'+i+'\n   base:    '+sa.slice(Math.max(0,i-150),i+150)+'\n   patched: '+sb.slice(Math.max(0,i-150),i+200));}}
log('node runs compared: '+n+'; changed outputs: '+flips.length);for(const f of flips)log(f);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_EPL.txt',out.join('\n')+'\n');
