// pkgEANS rev 2 test (W3 2279, ruling 2283). Run from wall2024/ after the builds: node pkgEANS/test_EANS2.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const X=require('../pkgALT/sol_ctx.cjs');
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const plan=JSON.parse(rd('pkgEANS/plan_EANS2.json'));const P2='pkgEANS/patched2/';
T('every node: base and final shas match the plan',plan.nodes.every(n=>sha(rd(n.base))===n.base_sha&&sha(rd(P2+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd(P2+n.file));return true;}catch(e){console.log('   '+n.name+': '+e.message);return false;}}));
const KAG=rd('pkgEANS/kag_lib.js');const libN=plan.nodes.filter(n=>!/Judge Enforcer Build$/.test(n.name));
T('K-AG library: one text, once, in each of the '+libN.length+' library nodes, with \'K-AG\':\'TRIAL\' in ENF_STATUS',libN.length===22&&libN.every(n=>{const s=rd(P2+n.file);return s.split(KAG).length===2&&s.includes("'K-KJV':'TRIAL','K-AG':'TRIAL'};");}));
T('nothing else changed in a library node: undoing the five edits gives the base back',libN.every(n=>{const s=rd(P2+n.file).split(KAG).join('')
 .split("'K-KJV':'TRIAL','K-AG':'TRIAL'};").join("'K-KJV':'TRIAL'};").split("x.rule==='K-KJV'||x.rule==='K-AG')").join("x.rule==='K-KJV')")
 .replace(/  \{const ag=kagCure[^\n]*\n/,'').replace(/  \{const KA=kagLines2024[^\n]*\n/,'');return s===rd(n.base);}));
// the clone stays the clone
const NJ=JSON.parse(rd('pkgALT/nodes_ALT.json'));const MAP=NJ.substitutions.names,LIT=NJ.substitutions.literals;const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const names=[...new Set(Object.keys(MAP).concat(Object.values(MAP)))].sort((a,b)=>b.length-a.length);
const mask=t=>{let s=String(t);for(const [a,b] of LIT){s=s.split(a).join('<LIT>').split(b).join('<LIT>');}s=s.split("seat_role:'alternate',judge_model:null,kind:'enforcer_check',rule:'E-ANS'").join("seat_role:'panel',judge_model:null,kind:'enforcer_check',rule:'E-ANS'");return s.replace(new RegExp('([\'"])('+names.map(esc).join('|')+')\\1','g'),'$1<NODE>$1');};
const old=rd('pkgEANS/patched/Judge_Enforcer_Build.js'),neu=rd(P2+'Judge_Enforcer_Build.js'),oldAlt=rd('pkgEANS/patched/Alt_Judge_Enforcer_Build.js'),neuAlt=rd(P2+'Alt_Judge_Enforcer_Build.js');
T('Alt Judge Enforcer Build is still the clone of Judge Enforcer Build',mask(neuAlt)===mask(neu));
// Judge Enforcer Build harness (as test_EANS)
const R0=(()=>{const AM=rd('pkgTG/patched/Alternate_Merge.js');const lib=AM.slice(0,AM.indexOf("let PP=$('Panel Cure Check')"));return new Function('$','$input',lib+'\nreturn ciRounds;')(()=>{throw 0;},null)(X.ptext(X.solReq));})();
const FO={cr1:R0.CR1,cr2:R0.CR2,cr3:R0.CR3,cr4:R0.CR4,gr1:R0.DR1,gr2:R0.DR2,dr3:R0.DR3,dr4:R0.DR4,synthesis:''};
function je(code,bodies,R){const N={'Panel Cure Check':{first:()=>({json:{bodies}})},'Init Seats':{first:()=>({json:{run_token:'t'}})},'Resolve Seats':{first:()=>({json:{deepseek:{api_model:'d'}}})},
 'Regrade Load':{isExecuted:false},'Final Output':{first:()=>({json:R})},'Alt Seated':{isExecuted:true,first:()=>({json:{bodies,f:R}})}};
 const $=n=>N[n]||{isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return new Function('$','$input',code)($,{first:()=>({json:{}})});}
const ids=out=>out.flatMap(o=>o.json.ids||[]).concat(out.flatMap(o=>(o.json.not_checked||[]).map(id=>({id,nc:true}))));const crow=out=>out.flatMap(o=>o.json.code_rows||[]);
const body=(seat,raw)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw}});
const seats=[];JSON.parse(rd('pkgSBP/fixture_bodies_32980.json')).forEach(b=>seats.push(['32980',b.seat,b.verdict_raw]));
const c80=JSON.parse(rd('pkgR2/fixture_32980_chatgpt.json'));seats.push(['32980',c80.seat,c80.verdict_raw]);
JSON.parse(rd('pkgAPPLY/fixture_bodies.json')).forEach(b=>seats.push([b.run,b.seat,b.verdict_raw]));
const txt=raw=>String(raw).replace(/\\n/g,'\n').replace(/\\"/g,'"');const acl=raw=>txt(raw).split('\n').map(l=>l.replace(/^[\s*\-•]+/,'')).filter(l=>/^ANSWER CHECK:/.test(l));
// 1. E-ANS replay on every stored seat
let lost=0;
for(const [run,seat,raw] of seats){const o=je(old,[body(seat,raw)],FO),n=je(neu,[body(seat,raw)],FO);const io=ids(o).filter(x=>x.rule==='E-ANS'),inw=ids(n).filter(x=>x.rule==='E-ANS');
 lost+=io.filter(a=>!inw.some(b=>b.flagged_line===a.flagged_line)).length;const g=inw.filter(b=>!io.some(a=>a.flagged_line===b.flagged_line));
 const all=acl(raw);const unread=all.filter(l=>!inw.some(x=>x.flagged_line===l.slice(0,1500)));
 const why=l=>/MEANS:\s*NONE\b/i.test(l)?'MEANS: NONE (UNPROVEN)':/ANSWER:\s*NONE\b/.test(l)?'ANSWER: NONE':/--\s*UNPROVEN\b/.test(l)?'graded UNPROVEN':/MEANS:\s*["'“‘]\s*none\s*["'”’]/i.test(l)?'MEANS "none"':'other';const byw={};unread.forEach(l=>{const k=why(l);byw[k]=(byw[k]||0)+1;});
 const note=crow(n).filter(r=>r.item==='FAILS READ AS MISSES');const gf=g.filter(x=>/--\s*FAILS\b/.test(x.flagged_line));
 console.log('   '+run+' '+seat+': ANSWER CHECK lines '+all.length+'; E-ANS grades read before '+io.length+', after '+inw.length+' (new '+g.length+', of them FAILS read as MISSES '+gf.length+')'+(note.length?'; note: '+note[0].cure_reason:'')+'; not read '+unread.length+' '+JSON.stringify(byw)+(byw.other?' OTHER: '+unread.filter(l=>why(l)==='other').map(l=>l.slice(0,200)).join(' | '):''));
 if(run==='32980'&&seat==='chatgpt'){const w=all.filter(l=>!/MEANS:\s*NONE\b/i.test(l));T('32980 chatgpt: all '+w.length+' witness lines (MEANS not NONE) are read; before, '+io.length,w.length===49&&w.every(l=>inw.some(x=>x.flagged_line===l.slice(0,1500))),w.filter(l=>!inw.some(x=>x.flagged_line===l.slice(0,1500))).join(' | '));}
 if(note.length)T('   '+run+' '+seat+': one FAILS note, record-only, kind enforcer_check, no cure status',note.length===1&&note[0].kind==='enforcer_check'&&note[0].cure_status===null&&note[0].rule==='E-ANS');}
T('no seat loses an E-ANS grade it had before',lost===0,String(lost));
// a single-quoted line with an apostrophe inside a word, and curly quotes
{const L1="ANSWER CHECK: Matthew 1:2 -- [DR3] -- MEANS: 'the fathers' line runs to Joseph.' -- ANSWER: 'The pattern of the fathers' line is my link's route.' -- MEETS -- 'it fits'.";
 const L2='ANSWER CHECK: Matthew 1:16 -- [CR3] -- MEANS: “the line ends at Joseph.” -- ANSWER: “Joseph’s line is the legal line.” -- FAILS -- the answer does not fit.';
 const n=ids(je(neu,[body('x',L1+'\n'+L2)],FO)).filter(x=>x.rule==='E-ANS');const a=n.find(x=>/Matthew 1:2 /.test(x.item+' ')),b=n.find(x=>/Matthew 1:16/.test(x.item));
 T('single quotes: an apostrophe inside a word (fathers\', link\'s) does not close the quote; the line is read as MEETS',!!a&&a.grade==='MEETS',JSON.stringify(a));
 T('curly quotes are read, and FAILS is read as MISSES',!!b&&b.grade==='MISSES',JSON.stringify(b));
 const out=je(neu,[body('x',L1+'\n'+L2)],FO);const msg=out.map(o=>o.json.body?o.json.body.messages[1].content:'').join('');T('the enforcer is shown the MEANS and ANSWER whole',msg.includes("The pattern of the fathers' line is my link's route.")&&msg.includes('Joseph’s line is the legal line.'));}
// 2. K-AG
const AMS=rd(P2+'Alternate_Merge_Seat.js');const lib=AMS.slice(0,AMS.indexOf("let PP=$('Panel Cure Check')"));
const L=new Function('$','$input',lib+'\nreturn {kagLines2024,kagCure,kagRow,cureVerdicts,cureLabel,enfStatus,enfUncured};')(()=>{throw new Error('no node');},null);
const counts={};let kagAll=0;
for(const [run,seat,raw] of seats){const K=L.kagLines2024(txt(raw));kagAll+=K.items.length;counts[run+' '+seat]=K.report;
 console.log('   '+run+' '+seat+': ANSWER CHECK rows '+K.report.rows+'; grades '+JSON.stringify(K.report.grades)+'; ANSWER: NONE rows '+JSON.stringify(K.report.none)+'; K-AG items '+K.items.length);}
T('stored runs: no K-AG item (every grade is MEETS, MISSES, FAILS or UNPROVEN, and no ANSWER: NONE row is graded MEETS)',kagAll===0);
T('rows read by K-AG equal the ANSWER CHECK lines on every seat',seats.every(([r,s,raw])=>counts[r+' '+s].rows===acl(raw).length));
T('32973 grok: 67 ANSWER: NONE rows, none MEETS; 32949 grok: 4, none MEETS',(()=>{const a=counts['32973 grok'].none,b=counts['32949 grok'].none;const sum=o=>Object.values(o).reduce((x,y)=>x+y,0);return sum(a)===67&&!a.MEETS&&sum(b)===4&&!b.MEETS;})(),JSON.stringify([counts['32973 grok'].none,counts['32949 grok'].none]));
const S1=["ANSWER CHECK: Luke 1:35 -- [CR4] -- MEANS: \"the power overshadows\" -- ANSWER: \"the Holy Ghost comes upon her\" -- PARTIAL -- half fits.",
 "ANSWER CHECK: Luke 1:34 -- [CR4] -- MEANS: \"she knows not a man\" -- ANSWER: \"she asks how\"",
 "ANSWER CHECK: Matthew 1:25 -- [DR2] -- MEANS: \"till marks an end\" -- ANSWER: NONE -- MEETS -- it stands.",
 "ANSWER CHECK: Matthew 1:24 -- [DR2] -- MEANS: \"no MEANS sentence\" -- ANSWER: NONE -- FAILS -- \"not a witness\"",
 "- **ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: 'the angel names her thy wife' -- ANSWER: 'Joseph's wife is named' -- **MEETS** -- fits.**",
 "ANSWER CHECK: Romans 1:3 -- [CR3; CR4] -- MEANS: “seed of David” -- ANSWER: “made of the seed” -- Meets"].join('\n');
const K=L.kagLines2024(S1);const it=k=>K.items.find(x=>x.verse===k);
T('K-AG: a grade the reader cannot map (PARTIAL) is an item',!!it('Luke 1:35')&&it('Luke 1:35').grade==='PARTIAL');
T('K-AG: no grade after the ANSWER is an item',!!it('Luke 1:34')&&it('Luke 1:34').grade==='');
T('K-AG: ANSWER: NONE graded MEETS is an item',!!it('Matthew 1:25')&&it('Matthew 1:25').none===true);
T('K-AG: ANSWER: NONE graded FAILS, a bolded MEETS with an apostrophe in the quote, and a mixed-case Meets raise nothing',!it('Matthew 1:24')&&!it('Matthew 1:20')&&!it('Romans 1:3')&&K.items.length===3,JSON.stringify(K.items.map(x=>x.link)));
T('K-AG items are TRIAL drv items with side JUDGE, a label, and one AUDIT mark each',K.items.every(x=>x.rule==='K-AG'&&x.side==='JUDGE'&&L.enfStatus(x.rule)==='TRIAL'&&L.cureLabel(x)==='K-AG '+x.link)&&K.marks.length===3&&K.marks.every(m=>/^\[AUDIT v41: ANSWER CHECK GRADE \(K-AG; TRIAL\)/.test(m)));
console.log('   item line: '+it('Matthew 1:25').line.slice(0,300));
// 3. K-AG cure, through cureVerdicts as Panel Cure Check runs it
const items3=K.items.map(x=>({...x}));const lb=x=>L.cureLabel(x);
const rep=t=>({ok:true,text:t});const cv=t=>L.cureVerdicts(items3,rep(t),{},{});
{const v=cv('');T('cure: no reply lines: every K-AG item is UNCURED and silent, so each counts (silence rule)',v.length>=3&&v.filter(x=>x.rule==='K-AG').every(x=>x.status!=='CURED'&&x.silent===true)&&L.enfUncured(v)===3,JSON.stringify(v.map(x=>[x.status,x.silent])));}
{const t=['RESPONSE: '+lb(it('Luke 1:35'))+' | ANSWER CHECK: Luke 1:35 -- [CR4] -- MEANS: "the power overshadows" -- ANSWER: "the Holy Ghost comes upon her" -- MISSES -- the answer does not reach it.',
 'RESPONSE: '+lb(it('Luke 1:34'))+' | NOT HELD: the grade was written on the next line.',
 'RESPONSE: '+lb(it('Matthew 1:25'))+' | I keep it.','ANSWER CHECK: Matthew 1:25 -- [DR2] -- MEANS: "till marks an end" -- ANSWER: NONE -- MEETS -- still.'].join('\n');
 const v=cv(t).filter(x=>x.rule==='K-AG');const st=k=>(v.find(x=>x.link===it(k).link)||{});
 T('cure: the line written again graded MISSES cures; NOT HELD cures',st('Luke 1:35').status==='CURED'&&st('Luke 1:34').status==='CURED',JSON.stringify(v.map(x=>[x.link,x.status,x.why])));
 T('cure: ANSWER: NONE written again as MEETS is UNCURED, written, so recorded only (not counted)',st('Matthew 1:25').status==='UNCURED'&&!st('Matthew 1:25').silent&&L.enfUncured(v)===0,JSON.stringify(st('Matthew 1:25')));}
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
