// W2 grade of pkgFUK: extra plants on run 34108 (Panel Cure Normalize 1, luna), and stacking with pkgKNL rev 4.
process.chdir(require('path').resolve(__dirname,'../..'));
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L0='pkgLIB/strip_VP1_s84/patched/',L1='pkgLIB/strip_FUK/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const second=(L,first,fol)=>harness('34108',{'FUM Merge Panel 1':[{json:{fum_done:true,fum_asked:first.fum.asked,fum_items:first.fum.items,fum_others:first.fum.others||[],fum_first:first.fum.first,fum_call:call(fol)}}]})(R(L+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');
const st=(n,re)=>{const o=harness('34108',{'Panel Cure Normalize 1':n})(R(L1+'Panel_Cure_Check.js'),'Panel Cure Normalize 3');return o[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&re.test(r.item));};
const K3=T0.split('\n').filter(x=>/^RESPONSE: K-S3 /.test(x));console.log('stored K-S3 lines: '+K3.length+'\n  '+K3.map(l=>l.slice(0,110)).join('\n  '));
const lab=l=>l.slice('RESPONSE: '.length,l.indexOf(' |'));
// W1 a: two K-S3 items: #1 short reason, #2 silent (line removed). Each asked once, in its own section, not doubled.
if(K3.length>=2){const a=lab(K3[0]),b=lab(K3[1]);const t=T0.replace(K3[0],'RESPONSE: '+a+' | TOUCHES NO LINK: titles only.').replace(K3[1]+'\n','').replace(K3[1],'');
 const n=norm(L1,t);const f=n[0].json.fum;console.log('     asked: '+(f?f.asked.map(x=>x.slice(0,60)).join(' ; '):'none'));
 chk(f&&f.asked.filter(x=>x.startsWith('NO REASON '+a)).length===1&&f.asked.filter(x=>x.startsWith('NO LINE '+b)).length===1&&f.asked.length===2,'W2 a: short-reason item asked as NO REASON and silent item as NO LINE, each once');
 const sec=second(L1,n[0].json,'RESPONSE: '+a+' | NOT HELD: '+'it is a title, not a concession; the sentence reads '+(()=>{const q=f.asked.find(x=>x.startsWith('NO REASON '+a));return q.slice(q.indexOf('DEFENDER CR4: ',12)+14);})()+'\nRESPONSE: '+b+' | COUNTED');
 const rows=st(sec,/#1|#2/);console.log('     after follow-up: '+rows.map(r=>r.item+' '+r.cure_status).join(' ; '));chk(rows.length>=2&&rows.every(r=>r.cure_status==='CURED'),'W2 a: both cured by their follow-up lines (NOT HELD with the quote; COUNTED)');}
// W2 b: anti-cheat: a follow-up line for an item that was CURED in the first reply is not read (no item asked that was cured)
{const a=lab(K3[0]);const n=norm(L1,T0.replace(K3[0],'RESPONSE: '+a+' | COUNTED'));chk(!n[0].json.fum||!n[0].json.fum.asked.some(x=>x.includes(a)),'W2 b: a K-S3 answered COUNTED is not asked again');}
// W2 c: TOUCHES NO LINK with exactly five words is CURED and not asked; four words is asked
{const a=lab(K3[0]);const n5=norm(L1,T0.replace(K3[0],'RESPONSE: '+a+' | TOUCHES NO LINK: it grants titles not links'));const n4=norm(L1,T0.replace(K3[0],'RESPONSE: '+a+' | TOUCHES NO LINK: it grants titles only'));
 chk(!(n5[0].json.fum&&n5[0].json.fum.asked.some(x=>x.includes(a)))&&!!(n4[0].json.fum&&n4[0].json.fum.asked.some(x=>x.startsWith('NO REASON '+a))),'W2 c: five words not asked, four words asked (the cure reader\'s own bound)');}
// W2 d: live s89 code on the same four-word reply asks nothing (the gap is real on live)
{const a=lab(K3[0]);const n=norm(L0,T0.replace(K3[0],'RESPONSE: '+a+' | TOUCHES NO LINK: it grants titles only'));chk(!n[0].json.fum||!n[0].json.fum.asked.some(x=>x.includes(a)),'W2 d: live library asks nothing for the four-word reason');}
// W2 e: stacking with pkgKNL rev 4: the four FUK anchors hit once in each KNL4 Normalize file, and the KNL4 function swap hits once in each FUK file
{const B=require('fs');const NORM=['Alternate_Cure_Normalize.js','Cure_Normalize.js','Panel_Cure_Normalize_1.js','Panel_Cure_Normalize_2.js','Panel_Cure_Normalize_3.js','R2_Alternate_Cure_Normalize.js'];
 const src=R('pkgFUK/build_FUK.cjs');const E=eval(src.slice(src.indexOf('const EDITS=')+'const EDITS='.length,src.indexOf("\nif(mode==='strip')")).replace(/;\s*$/,''));
 let good=true;for(const f of NORM){const s=R('pkgLIB/strip_KNL4/patched/'+f);for(const [a] of E){if(s.split(a).length!==2){good=false;console.log('     '+f+': FUK anchor count '+(s.split(a).length-1));}}}
 chk(good&&E.length===4,'W2 e1: all 4 FUK anchors hit once in each of the 6 KNL4 Normalize files');
 const fn=R('pkgKNL4/knl4_fn.js').trim();let g2=true;for(const f of B.readdirSync('pkgLIB/strip_FUK/patched').filter(f=>f.endsWith('.js'))){const s=R('pkgLIB/strip_FUK/patched/'+f);const i=s.indexOf('function knlNone2024('),j=s.indexOf('function kfLines(');if(i<0||j<i){g2=false;console.log('     '+f+': no knlNone2024 span');continue;}
  const c=s.slice(0,i)+fn+'\n'+s.slice(j);const k=R('pkgLIB/strip_KNL4/patched/'+f);const fk=k.slice(k.indexOf('function knlNone2024('),k.indexOf('function kfLines('));if(c.slice(i,i+fk.length)!==fk){g2=false;console.log('     '+f+': KNL4 span differs');}}
 chk(g2,'W2 e2: the KNL4 function swap applies once to every FUK library file and gives the same knlNone2024 text');}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
