// ASK 651 + 652 tests (W4). node t651_652.cjs base_eng.json target_engine_651_652.json
const fs=require('fs');const {execFileSync}=require('child_process');const [,,BF,TF]=process.argv;
const B=JSON.parse(fs.readFileSync(BF,'utf8')),T=JSON.parse(fs.readFileSync(TF,'utf8'));const LL=require('./libload.cjs');
let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const FX={r42528:JSON.parse(fs.readFileSync(__dirname+'/fx/r42528.json','utf8')),r42373:JSON.parse(fs.readFileSync(__dirname+'/fx/r42373.json','utf8'))};
const code=(E,n)=>E.nodes.find(k=>k.name===n).parameters.jsCode;
// D4 Build open_list
const d4open=(E,F,mut)=>{let s=code(E,'D4 Build');s=s.slice(0,s.indexOf('const G1F='));if(mut)s=mut(s);const LIB=code(E,'Shared Library');
 const RAW={'D1 Extract':F.cr1,'C1B Extract':F.gr1,'D2B Extract':F.cr2,'C2B Extract':F.gr2,'D3B Extract':F.cr3,'C3B Extract':F.dr3};
 const $=n=>n==='Shared Library'?{params:{jsCode:LIB}}:{first:()=>({json:{raw:RAW[n]||''}}),all:()=>[{json:{raw:RAW[n]||''}}]};
 return new Function('$',s+'\nreturn OPEN;')($);};
const ledger=(EF,R,N)=>execFileSync('node',[__dirname+'/ledger652.cjs',EF,__dirname+'/fx/'+R+'.json',N],{maxBuffer:1e8}).toString();
// 1. scope: four nodes, connections unchanged
const P=w=>Object.fromEntries(w.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);
ok(JSON.stringify(Object.keys(pb).filter(n=>pb[n]!==pt[n]).sort())===JSON.stringify(['Build Independent Verdict','D4 Build','Panel Build','Shared Library'])&&JSON.stringify(B.connections)===JSON.stringify(T.connections),'only the four nodes change; connections unchanged');
// 2. tags
for(const n of ['D4 Build','Panel Build','Build Independent Verdict'])ok(code(T,n).split('/* ASK 651:').length===2&&code(T,n).split('/* ASK 652:').length===2,n+': one ASK 651 and one ASK 652 tag');
{const s=code(T,'Shared Library');ok(s.split('/* ASK 651:').length===2&&!s.includes('ASK 652'),'Shared Library: one ASK 651 tag, no 652 change');}
// 3. 651 N1: LIB line carries an escaped newline (backslash n), not a raw newline, in the source
{const s=code(T,'Shared Library');const L=JSON.parse(s.slice(s.indexOf('\n/*LIB*/')+8,s.lastIndexOf('\n/*MAP*/')));const l=L.find(x=>x.includes('/* ASK 651:'));ok(l&&l.includes("t.indexOf('\\n',h.pos)")&&!l.includes("t.indexOf('\n',h.pos)"),'651 N1: LIB source writes the newline escaped');}
// 4. 651 in the LIB copy: PRS from the Gate Build entry classes Luke 1:35 (42528 premise 2) PROVEN BY REFERENCE after, UNPROVEN before
(async()=>{
const F=FX.r42528.F;const seg=F.gr2.slice(F.gr2.indexOf('2. LINK 2'));const xw=seg.slice(seg.search(/PRESSED WITH\s*:/i),seg.indexOf('\n3. LINK 3'));
for(const [E,lab,want] of [[B,'before','UNPROVEN'],[T,'after','PROVEN BY REFERENCE']]){let r=null;try{const o=await LL(E,'Gate Build',['PRS']);const R=o.PRS.RND(F);r=o.PRS.premise(xw,R,'DR2',null).verses.find(v=>v.key==='Luke 1:35');}catch(e){r={cls:'ERR '+e.message};}
 ok(r&&r.cls===want,'651 LIB copy, '+lab+': Luke 1:35 is '+(r&&r.cls));}
// 5. D4 open_list
const ob=d4open(B,F),ot=d4open(T,F);
ok(/premise 2: Matthew 1:20, Luke 1:35, Galatians 4:4; premise 3: Luke 1:35; premise 4: Luke 1:35, Luke 1:34/.test(ob),'42528 D4 open_list before = live');
ok(/costs you nothing: premise 4: Luke 1:34$/m.test(ot),'42528 D4 open_list after = "premise 4: Luke 1:34" (WALL-2024 floor item only)');
const F3=FX.r42373.F;const o3=d4open(T,F3);ok(!/UNPROVEN PRESSES/.test(o3)&&/none: every verse/.test(o3),'42373 D4 open_list after: no unproven list');
// 6. PRSP null: with PRS taken away, before and after give the same list
const noPRS=s=>s.split("(typeof PRS!=='undefined'&&xw)").join('(false&&xw)');
ok(d4open(B,F,noPRS)===d4open(T,F,noPRS),'PRSP null: D4 open_list identical before and after (42528)');
ok(d4open(B,F3,noPRS)===d4open(T,F3,noPRS),'PRSP null: D4 open_list identical before and after (42373)');
// 7. ledgers
for(const R of ['r42528','r42373'])for(const N of ['Panel Build','Build Independent Verdict']){
 const b=ledger(BF,R,N),a=ledger(TF,R,N);
 ok(!/Luke 1:35 \(PROVEN IN \[DR1\]: the verse is named there but not quoted/.test(a),R+' '+N+': no Luke 1:35 "not quoted" line');
 const unp=[...a.matchAll(/UNPROVEN, not a witness \(ruling 398\): ([^;]*?) \(no MEANS sentence\)/g)];
 ok(unp.length===0,R+' '+N+': no layer verse labelled "no MEANS sentence" after ('+unp.map(m=>m[1]).join(' | ')+')');
 ok(b.split('\n').filter(l=>/^(AGAINST|PRESSED-WITNESS)/.test(l)).join()===a.split('\n').filter(l=>/^(AGAINST|PRESSED-WITNESS)/.test(l)).join(),R+' '+N+': ledger headings unchanged');
}
{const a=ledger(TF,'r42528','Panel Build');ok(/Job 14:1 \[DR3\]/.test(a)&&!/not witnesses: [^;]*Job 14:1/.test(a),'42528 Panel Build: the Oracle\'s proven press Job 14:1 is counted, not over the cap');
 ok(/UNPROVEN, not a witness \(ruling 398\): 2 Samuel 7:12 \(its MEANS asserts/.test(a)&&/Luke 1:34 \(its MEANS asserts/.test(a),'42528 Panel Build: the two WALL-2024 floor items stay');}
// 8. cap still works on real presses (W1 F1): a premise with 10 real presses
{const line=(r,q)=>r+' "'+q+'" -- MEANS: the verse states it. -- [L2] G1 a (a word) | [L3] John 1:1 "In the beginning was the Word"';
 const V=['Matthew 1:1','Matthew 1:2','Matthew 1:3','Matthew 1:4','Matthew 1:5','Matthew 1:6','Matthew 1:7','Matthew 1:8','Matthew 1:9','Matthew 1:10'];
 const gr2=F.gr2.slice(0,F.gr2.indexOf('1. LINK 1'))+'1. LINK 1: charge that the inference lacks footing -- defender claim "x." PRESSED WITH:\n'+V.map(v=>line(v,'The book of the generation of Jesus Christ')).join('\n')+'\nPREMISE COUNT: 1';
 const o=d4open(T,{...F,gr2});const a=(()=>{const X={...FX.r42528,F:{...F,gr2}};fs.writeFileSync(__dirname+'/fx/syn_cap.json',JSON.stringify(X));return ledger(TF,'syn_cap','Panel Build');})();
 const m=a.match(/premise 1 \(LINK 1\): (\d+) verse\(s\)[^\n]*?over the cap of 8 pressed verses \(md_notes_rulings 393\), not witnesses: ([^;\n]*)/);
 ok(m&&m[1]==='8'&&/Matthew 1:9/.test(m[2])&&/Matthew 1:10/.test(m[2])&&!/John 1:1/.test(m[2]),'cap: 10 real presses give 8 counted and "over the cap" names Matthew 1:9, 1:10 (not the [L3] John 1:1)'+(m?' ['+m[1]+'; '+m[2]+']':' [no cap line]'));}
console.log(fail?'FAILURES: '+fail:'ALL PASS ('+pass+')');process.exit(fail?1:0);
})();
