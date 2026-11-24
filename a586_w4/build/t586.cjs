// ASK 586 offline tests (W4). node t586.cjs  -> out_t586.txt. Runs the live (196402d0) and the target code side by side.
const fs=require('fs');process.chdir(__dirname);
const lib=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/');return {W,L:JSON.parse(T.slice(a,b))};};
const LV=lib('live_eng.json'),TG=lib('target_engine_586.json');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const J=f=>JSON.parse(fs.readFileSync('data/'+f,'utf8'));

console.log('== A. The whole judge line reaches the layer check (qwen4max 1274, gemini 1272; md5 equal to the record)');
{const D=J('judge_lines_42071.json');const f=new Function(LV.L[1848]+'\n'+LV.L[1849]+'\n'+LV.L[1850]+'\n'+LV.L[1854]+'\nreturn {dec504,ground};')();
 for(const [k,raw] of Object.entries(D)){const U=x=>String(x).replace(/\\+"/g,'"');const line=raw; /* check() reads the line with its escapes removed, as ECL.check does */const full=f.dec504(U(line),f.ground(U(line))),cut=f.dec504(U(line.slice(0,1500)),f.ground(U(line.slice(0,1500))));
  console.log('   '+k+' '+line.length+' chars | whole line: '+full.why+' | first 1,500 (the live store): '+cut.why);
  ok(!/no deciding step/.test(full.why),k+': the whole line has its deciding step');ok(/no deciding step/.test(cut.why),k+': known-bad, the 1,500 cut reads "no deciding step" (the 42071 fault)');}
 const cap=L=>L.filter(l=>/flagged_line:[^,]*?\.slice\(0,1500\)/.test(l)).length;
 ok(cap(LV.L)===20&&cap(TG.L)===0,'flagged_line caps in LIB: live '+cap(LV.L)+', target '+cap(TG.L));
 const g=new RegExp('/\\s\\[\\.\\.\\.\\]\\s*$/'.slice(1,-1));
 ok(TG.L[2880].includes("if(/\\s\\[\\.\\.\\.\\]\\s*$/.test(String(__x.flagged_line||'')))continue;"),'A3 guard present in target LIB 2880');
 const rx=/\s\[\.\.\.\]\s*$/;ok(rx.test('x'.repeat(10)+' [...]')&&!rx.test(D.qwen4max_1274),'A3: a line ending in the cut mark " [...]" is NOT READ; the whole qwen4max line is read');}

console.log('== B. Spark S3 KEEP (enforcer log 53175), the exact KEEP over the record lines that hold its words');
{const D=J('spark_round_lines_42071.json');const R={CR1:D.CR1,CR2:D.CR2,CR3:D.CR3,CR4:D.CR4,DR2:D.DR2a+'\n'+D.DR2b};
 const mk=X=>new Function('R','fs','ps',X.L[3498]+'\n'+X.L[2644]+'\n'+X.L[2645]+'\n'+X.L[2677]+'\n'+X.L[2678]+'\n'+X.L[2679]+'\n'+X.L[2680]+'\n'+X.L[2681]+'\nreturn both;');
 const live=mk(LV)(R,'C','D'),tgt=mk(TG)(R,'C','D');
 const S3='The answer\'s own "Joseph knew Mary his wife within the espousal" cannot agree with "before they came together, she was found with child of the Holy Ghost" (Commitment 3).';
 const S1='The answer\'s own "cohabitation is the couple\'s common life" cannot agree with "before they came together, she was found with child of the Holy Ghost" (Commitment 3).';
 const a=live(S3),b=tgt(S3);console.log('   S3 live: '+a.why+'\n   S3 target: '+b.why);
 ok(!a.ok,'known-bad: live refuses the S3 KEEP (the 42071 fault: the challenger quoted the defender\'s sentence in [DR2])');ok(b.ok,'target accepts the S3 KEEP');
 const R1=Object.assign({},R,{CR3:D.CR3+'\n[L4] cohabitation is the couple\'s common life'});
 ok(mk(LV)(R,'C','D')(S1).ok===mk(TG)(R,'C','D')(S1).ok,'control S1 KEEP: live and target agree ('+tgt(S1).why+')');
 // known-bad: a KEEP whose "answer" is only verse words the answering side holds inside quotation marks must still fail
 const RB=Object.assign({},R,{CR4:D.CR4+'\n[L1] Matthew 1:18 “When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost.”'});
 const BAD='The answer\'s own "When as his mother Mary was espoused to Joseph" cannot agree with "before they came together, she was found with child of the Holy Ghost" (Commitment 3).';
 const lb=mk(LV)(RB,'C','D')(BAD),tb=mk(TG)(RB,'C','D')(BAD);console.log('   verse-only KEEP live: '+lb.why+'\n   verse-only KEEP target: '+tb.why);
 ok(!lb.ok&&!tb.ok,'known-bad: a KEEP quoting only verse words the answer holds in quotation marks fails in live and target');}

console.log('== C1. Argon keystone D5 (no collision line of D5): pkgLAY label check');
{const A=J('argon_42071.json');const text=A.labels.map(x=>x+': DEFENDER LINK BROKEN').join('\n')+'\n'+A.keystone_53360;
 const pick=X=>{const l=X.L[3497];const s=l.indexOf('const f=[];');const e=l.indexOf('if(!lb.test(l))',s);return l.slice(s,e);};
 const KEY=/^\s*KEYSTONE\s*:\s*(D\d+)\b/i,LBL=/\bD\d+\s+vs\.?\s+C\d+\b/i;
 const run=X=>{const l=A.keystone_53360;const k=l.replace(/[*_`]+/g,'').match(KEY);return new Function('text','k','LBL','l',pick(X)+'\nreturn {lb,nc:typeof __nc==="undefined"?null:__nc};')(text,k,LBL,l);};
 const a=run(LV),b=run(TG);
 const al=new RegExp('\\bD5\\s+vs\\.?\\s+C\\d+\\b','i');
 ok(!al.test(A.keystone_53360),'known-bad: live demands a "D5 vs C<m>" label the keystone cannot carry (argon has no D5 collision line: '+A.labels.join(', ')+')');
 ok(b.nc===true&&b.lb.test(A.keystone_53360),'target: D5 has no collision line, so no label is demanded');
 const t2=A.labels.join('\n')+'\nD5 vs C7: DEFENDER LINK BROKEN\n'+A.keystone_53360;const c=new Function('text','k','LBL','l',pick(TG)+'\nreturn {lb,__nc};')(t2,A.keystone_53360.match(KEY),LBL,A.keystone_53360);
 ok(c.__nc===false&&!c.lb.test(A.keystone_53360),'control: when the judge does write a D5 collision line, the target still demands its label');}

console.log('== C2. Second reading of argon (enforcer log 53360)');
{const A=J('argon_42071.json');const src=TG.W.nodes.find(n=>n.name==='Reread Record').parameters.jsCode;const fr=new Function(src.slice(src.indexOf('const __fr='),src.indexOf('\n',src.indexOf('const __fr=')))+'\nreturn __fr;')();
 ok(fr({rule:'E-KEY',reason:A.first_reading_53360,to:A.keystone_53360})===true,'53360: the judge changed to the first reading\'s own grade (STANDS): not counted, RECORD-ONLY');
 ok(fr({rule:'E-KEY',reason:A.first_reading_53360.replace('right: STANDS','right: BROKEN'),to:A.keystone_53360})===false,'control: a changed line that does not carry the first reading\'s grade is still counted');
 ok(fr({rule:'E-RES',reason:'(right: UNDERDETERMINED): x',to:'RESULT: UNDERDETERMINED -- y'})===true&&fr({rule:'E-RES',reason:'(right: UNDERDETERMINED): x',to:'RESULT: CHALLENGER WINS -- y'})===false,'E-RES: same rule on the RESULT word');}

console.log('== D. Recompute standing (spark 1273, qwen4max 1274: CHALLENGE PROP-DEPENDENT 0, C1 counted as one CHALLENGER LINK BROKEN)');
{const mk=X=>new Function('c','brk','orig','const P={st:{}};const unk=[];const Lof=k=>null;'+X.L[1345]+'\n'+X.L[1346]+'\nreturn stand("CHALLENGER","CHALLENGE",orig);');
 const a=mk(LV)({DEFENDER:1,CHALLENGER:0},{DEFENDER:3,CHALLENGER:1},'PROP-DEPENDENT'),b=mk(TG)({DEFENDER:1,CHALLENGER:0},{DEFENDER:3,CHALLENGER:1},'PROP-DEPENDENT');
 ok(a==='SELF-SUPPORTED','known-bad: live recomputes CHALLENGE SELF-SUPPORTED (as written in 1273 and 1274)');ok(b==='PROP-DEPENDENT','target keeps CHALLENGE PROP-DEPENDENT');
 ok(mk(TG)({DEFENDER:0,CHALLENGER:0},{DEFENDER:0,CHALLENGER:0},'PROP-DEPENDENT')===mk(LV)({DEFENDER:0,CHALLENGER:0},{DEFENDER:0,CHALLENGER:0},'PROP-DEPENDENT'),'control: with no counted break live and target agree');
 ok(TG.L[1363].includes("STANDING INPUTS: DEFENDER conceded '+c.DEFENDER+', counted breaks '+brk.DEFENDER"),'D2: the recompute line prints its standing inputs');}

console.log('== E. Removal reason tally (Alternate Merge Seat)');
{const mk=X=>new Function('raw',"const T={};const add=(k,n)=>{T[k]=(T[k]||0)+n;};const isLive=()=>true;const __gOff={};const __gN=x=>x;const top=(s)=>1;\n"+X.L[1581]+'\n'+X.L[1582]+'\n'+X.L[1583]+'\n'+X.L[1584]+'\n'+X.L[1585]+'\n'+X.L[1586]+'\n'+X.L[1587]+'\n'+X.L[1588]+'\nreturn T;');
 const item='SEND-BACK ITEM S8 (E-COL, ENFORCED): answer it; an item left uncured there is counted in drv_uncured.';const unknown='[AUDIT v99: SOMETHING NEW -- an item counted in drv_uncured';
 const a=mk(LV)(item),b=mk(TG)(item),c=mk(TG)(unknown);
 ok(a['UNREAD COUNTED LINE']===1,'known-bad: live tallies a send-back item line as an UNREAD COUNTED LINE');ok(!b['UNREAD COUNTED LINE'],'target does not');ok(c['UNREAD COUNTED LINE']===1,'control: an unknown AUDIT line that is counted is still tallied');}

console.log(fail?'RESULT: '+fail+' FAIL':'RESULT: ALL PASS');process.exit(fail?1:0);
