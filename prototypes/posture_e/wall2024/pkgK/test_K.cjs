// pkgK offline tests (W2). argv[2]: live fetch of b2052e19. Run from the wall2024 dir.
const fs=require('fs');const live=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const L={};live.nodes.forEach(n=>L[n.name]=n.parameters&&n.parameters.jsCode||'');
const plan=JSON.parse(fs.readFileSync('pkgK/plan_K.json','utf8'));const P={};plan.nodes.forEach(x=>P[x.name]=fs.readFileSync('pkgK/patched/'+x.name.replace(/ /g,'_')+'.js','utf8'));
let bad=0;const T=(ok,msg)=>{console.log((ok?'OK  ':'FAIL')+' '+msg);if(!ok)bad++;};
const heads=src=>{const i=src.indexOf('const PART2="')+12;const j=src.indexOf('";\n',i)+1;return [...JSON.parse(src.slice(i,j)).matchAll(/^### (Commitment \d+\. [^\n]+)$/gm)].map(m=>m[1]);};
// K1
const ig=P['Init with Guards'];T((ig.match(/'\\n\\n'\+TEXTAUTH\+'\\n\\n'\+LAYER\+'\\n\\n'\+__PROVE9/g)||[]).length===2&&ig.includes('const TEXTAUTH="TEXT AUTHORITY (operator, binding, no exceptions)'),'K1 Init with Guards: TEXT AUTHORITY ahead of LAYER in both seat profiles (oracle and scholar), for both roles (one build() serves DEFENDER and CHALLENGER)');
T(ig.includes('A Septuagint (LXX) reading is not footing'),'K1b the existing LXX sentence stays');
// K2
const h0=heads(L['Accept Check']),h1=heads(P['Accept Check']);T(h0.length===11&&h1.length===12&&h0.every((h,i)=>h1[i]===h)&&h1[11]==='Commitment 12. I judge by the 1611 KJV alone.','K2 Accept Check: HEADS 11 -> 12, headings 1-11 identical');
const AG=['Panel Build','Reserve Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Alternate Cure Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build'];
T(AG.every(n=>heads(P[n]).length===12),'K2b all 12 PART2 nodes carry 12 headings');
T(['Enforcer Build','Judge Enforcer Build'].every(n=>P[n].includes('### Commitment 12. I judge by the 1611 KJV alone.')),'K2c both __JAGR agreement copies carry Commitment 12');
// library from a patched node
const lib=P['Panel Payloads'];const i0=lib.indexOf('// ======== WALL-2024 Commitment 12');const i1=lib.indexOf('\nfunction kconLines2024(',i0);const SL=lib.slice(i0,i1);
const libs=Object.keys(P).filter(n=>P[n].includes('function kkjvLines2024('));T(libs.length===17&&libs.every(n=>P[n].includes(SL)),'Lib: the same K-KJV library in all 17 nodes ('+libs.length+')');
eval(SL);
const I=[{book:'Isaiah',chapter:7,verse:14,text:'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel. [shall call: or, thou, O virgin, shalt call]'}];
const k4=kkjvLines2024('KEYSTONE: D1 -- BROKEN. Isaiah 7:14 "a young woman shall conceive" carries the sign.',I);T(k4.items.length===1&&k4.items[0].rule==='K-KJV'&&k4.items[0].line.includes('Behold, a virgin shall conceive'),'K4 "a young woman shall conceive" (Isaiah 7:14): 1 item, the cure line states the KJV words');
const k5=kkjvLines2024('Isaiah 7:14 "Behold, a virgin shall conceive" stands.',I);T(k5.items.length===0,'K5 the exact quote: 0 items');
const k6=kkjvLines2024('The RSV reading is not before me.\nIsaiah 7:14 "Behold, a virgin shall conceive"',I);T(k6.items.length===0&&k6.report.some(r=>r.startsWith('OTHER VERSION NAMED')),'K6 a line naming RSV: listed in the report, 0 items');
const z2=kkjvLines2024('Isaiah 7:14: "BEHOLD a Virgin shall conceive, and bear a son, and shall call his name Immanuel" and Isaiah 7:14 "thou, O virgin, shalt call"',I);T(z2.items.length===0,'Z2 case, punctuation and the margin reading: 0 items');
const nc=kkjvLines2024('Isaiah 7:15 "Butter and honey shall he eat"',I);T(nc.items.length===0&&nc.not_checked===1,'NC a verse this run did not read: NOT CHECKED, 0 items');
const ell=kkjvLines2024('Isaiah 7:14 "Behold, a virgin shall conceive ... and the engine cut here"',I);T(ell.items.length===0,'R2 rule 2: text after a trailing ellipsis that is not in the verse is dropped');
const nv=kkjvLines2024('Isaiah 7:14 "as load-bearing for the exclusion of the reading"',I);T(nv.items.length===0&&nv.report.some(r=>r.startsWith('NOT A VERSE QUOTE')),'R3 rule 3: a quote with under half its words in the verse is not a verse quote');
// K7 cure
const it=k4.items[0];T(kkjvCure(it,'Isaiah 7:14 reads "Behold, a virgin shall conceive, and bear a son".').st==='CURED','K7a cure quoting the KJV words: CURED');
T(kkjvCure(it,'RULING WITHDRAWN: the keystone ruling on Isaiah 7:14 is withdrawn.').st==='CURED','K7b a WITHDRAWN line naming the reference: CURED');
T(kkjvCure(it,'I keep my reading.').st==='UNCURED','K7c no KJV words, no withdrawal: UNCURED (TRIAL)');
const CN=['Cure Build','Cure Normalize','Cure Check','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3','Panel Cure Check','Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge'];
T(CN.every(n=>P[n].includes("x.rule==='K-RUL'||x.rule==='K-KJV')?x.rule+' '+x.link")&&P[n].includes("x.rule==='K-RUL'||x.rule==='K-KJV')?String(x.line||'').trim()")&&P[n].includes('const kk=kkjvCure(')),'K7d all 14 cure nodes: K-KJV in cureLabel, cureAsk and cureVerdicts');
// maps
T(Object.keys(P).filter(n=>P[n].includes("'K-RUL':11,'K-KJV':12}")).length===13,'Maps: RULE_C/RC K-KJV -> 12 in 13 nodes');
T(libs.every(n=>P[n].includes("'K-RUL':'TRIAL','K-KJV':'TRIAL'};")),'ENF_STATUS K-KJV TRIAL in 17 nodes');
// Z3/Z4: reverse each node to live by undoing exactly the listed insertions
const rev=(n,c)=>{let r=c;r=r.split("'\\n\\n'+TEXTAUTH+'\\n\\n'+LAYER").join("'\\n\\n'+LAYER");r=r.replace(/const TEXTAUTH="[^\n]*\n/,'');r=r.split(SL+'\n').join('');
 r=r.replace(/\\n\\n### Commitment 12\. I judge by the 1611 KJV alone\.[^"]*";/g,'";');r=r.split("'K-RUL':11,'K-KJV':12}").join("'K-RUL':11}").split("'K-RUL':'TRIAL','K-KJV':'TRIAL'};").join("'K-RUL':'TRIAL'};").split("x.rule==='K-RUL'||x.rule==='K-KJV')").join("x.rule==='K-RUL')");
 r=r.replace(/  \{const kk=kkjvCure\([^\n]*\n/g,'').replace(/\n  \{const KK=kkjvLines2024\([^\n]*/g,'').replace(/\nlet kkjv_report=\[\];[^\n]*/,'').replace(',vc_error,kkjv_report}}];',',vc_error}}];').replace(/\(__PV\.kkjv_report\|\|\[\]\)\.forEach\(x=>enforcer_log\.push\(\{[^\n]*?at:__T\}\)\);/,'');
 const pj=a=>'['+a.map(x=>JSON.stringify(x)).join(', ')+']';r=r.split(pj(heads(P['Accept Check']))).join(pj(heads(L['Accept Check'])));return r;};
T(Object.keys(P).map(n=>{const ok=rev(n,P[n])===L[n];if(!ok){const a=L[n],b=rev(n,P[n]);let i=0;while(i<a.length&&a[i]===b[i])i++;console.log('   reverse differs:',n,i,JSON.stringify(a.slice(i-60,i+100)),'||',JSON.stringify(b.slice(i-60,i+100)));}return ok;}).every(Boolean),'Z3/Z4 reverse edit: undoing exactly the listed insertions gives the live text back in all '+Object.keys(P).length+' nodes');
const crypto=require('crypto');T(plan.nodes.every(x=>crypto.createHash('sha256').update(L[x.name]).digest('hex').slice(0,16)===x.live_sha),'live_sha equals this fetch for all nodes');
console.log(bad?'FAILURES '+bad:'ALL OK');
