// pkgFUK probe on run 34108 (Panel Cure Normalize 1, judge luna, item K-S3 S3 DEFENDER CR4: #1). Library strip_FUK (full code) against strip_VP1_s84 (live s89).
process.chdir(require('path').resolve(__dirname,'..'));
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L0='pkgLIB/strip_VP1_s84/patched/',L1='pkgLIB/strip_FUK2/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));if(!LINE)throw new Error('no stored line');
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,f,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+f),'Panel Cure Call 1 openrouter');
const second=(L,f,first,fu,fol)=>harness('34108',{'FUM Merge Panel 1':[{json:{fum_done:true,fum_asked:first.fum.asked,fum_items:first.fum.items,fum_others:first.fum.others||[],fum_first:first.fum.first,fum_call:call(fol)}}]})(R(L+f),'FUM Merge Panel 1');
const st=n=>{const o=harness('34108',{'Panel Cure Normalize 1':n})(R(L1+'Panel_Cure_Check.js'),'Panel Cure Normalize 3');return o[0].json.enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));};
const F='Panel_Cure_Normalize_1.js';const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);
// 1 the gap on live: short reason, no follow-up
{const n=norm(L0,F,rep('TOUCHES NO LINK: it grants titles only.'));chk(!n[0].json.fum,'live s89: short TOUCHES NO LINK reason asks nothing (the gap)');chk(st(n).cure_status==='UNCURED','live s89: it reads UNCURED');}
// 2 the fix: asked, in its own section
const n1=norm(L1,F,rep('TOUCHES NO LINK: it grants titles only.'));const fm=n1[0].json.fum;
chk(!!fm&&fm.asked.some(a=>a.startsWith('NO REASON '+K)),'FUK: short reason is asked, labelled NO REASON');
chk(fm&&fm.asked.length===1,'FUK: it is the only item asked ('+(fm&&fm.asked.join(' ; '))+')');
const P=fm?fm.body.messages[fm.body.messages.length-1].content:'';chk(/K-S3 items whose RESPONSE cannot be counted \(1\):/.test(P)&&/TOUCHES NO LINK: <at least five words/.test(P)&&/\| COUNTED/.test(P),'FUK: prompt section names COUNTED, TOUCHES NO LINK with five words, NOT HELD with the quote');
chk(fm&&fm.items.length===1&&fm.items[0].rule==='K-S3'&&fm.items[0].link===K.replace(/^K-S3 /,''),'FUK: item carried for the follow-up reader: '+JSON.stringify(fm&&fm.items[0]));
console.log('---- follow-up prompt ----\n'+P+'\n--------------------------');
// 3 a full follow-up answer cures it
{const n=second(L1,F,n1[0].json,null,'RESPONSE: '+K+' | TOUCHES NO LINK: it grants the legal titles husband and wife, not a declared link or listed premise.');chk(!n[0].json.fum,'FUK second pass asks nothing more');chk(n[0].json.reply.fum&&n[0].json.reply.fum.ok&&n[0].json.reply.fum.kept===1,'FUK second pass keeps 1 line');const r=st(n);chk(r.cure_status==='CURED','FUK full follow-up answer: CURED ('+String(r.cure_reason).slice(0,90)+')');}
// 4 a follow-up answered COUNTED cures it
{const n=second(L1,F,n1[0].json,null,'RESPONSE: '+K+' | COUNTED. Corrected count: one more close concession.');chk(st(n).cure_status==='CURED','FUK follow-up COUNTED: CURED');}
// 5 a short follow-up stays UNCURED and is not asked again
{const n=second(L1,F,n1[0].json,null,'RESPONSE: '+K+' | TOUCHES NO LINK: titles only.');chk(!n[0].json.fum,'FUK short follow-up: no second follow-up');chk(st(n).cure_status==='UNCURED','FUK short follow-up: stays UNCURED');}
// 6 a follow-up that names another item changes nothing else (rev 7 guard holds)
{const n=second(L1,F,n1[0].json,null,'RESPONSE: '+K+' | TOUCHES NO LINK: it grants the legal titles husband and wife, not a declared link or listed premise.\nRESPONSE: K-S3 S3 DEFENDER CR4: #2 | NOT HELD: x');const r=st(n);chk(r.cure_status==='CURED'&&n[0].json.reply.fum.kept===1,'FUK follow-up with an unasked item line: only the asked line kept');}
// 7 other uncountable answer is asked
{const n=norm(L1,F,rep('This concession is answered elsewhere in my count.'));chk(n[0].json.fum&&n[0].json.fum.asked.some(a=>a.startsWith('NO REASON')),'FUK: answer neither COUNTED nor TOUCHES NO LINK nor NOT HELD is asked');}
// 8 NOT HELD without quote stays in the NO QUOTE list, not doubled
{const n=norm(L1,F,rep('NOT HELD: it is not a concession.'));const a=n[0].json.fum?n[0].json.fum.asked:[];chk(a.length===1&&a[0].startsWith('NO QUOTE'),'FUK: NOT HELD without the quote stays NO QUOTE only ('+a.join(' ; ')+')');}
// 9 COUNTED and a full reason ask nothing
for(const r of ['COUNTED','TOUCHES NO LINK: it grants the legal titles husband and wife, not a declared link.']){const n=norm(L1,F,rep(r));chk(!n[0].json.fum,'FUK: "'+r.slice(0,30)+'" asks nothing');}
// 10 the stored reply: byte-equal output, live vs FUK, all 6 Normalize nodes where an input is stored
for(const f of ['Panel_Cure_Normalize_1.js','Panel_Cure_Normalize_2.js','Panel_Cure_Normalize_3.js','Alternate_Cure_Normalize.js','R2_Alternate_Cure_Normalize.js','Cure_Normalize.js']){
 const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const inp=nm.replace('Normalize','Call')+' openrouter';const ex=fs.existsSync('/mnt/project-files/wall2024/inputs/34108_'+inp.replace(/ /g,'_')+'.json');
 if(!ex){console.log('n/a  34108 '+nm+': no stored '+inp);continue;}
 let a,b;try{a=JSON.stringify(harness('34108',{})(R(L0+f),inp));}catch(e){a='THROW '+e.message;}try{b=JSON.stringify(harness('34108',{})(R(L1+f),inp));}catch(e){b='THROW '+e.message;}chk(a===b,'34108 '+nm+' stored reply: output byte-equal live vs FUK');}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
