// ASK 634 tests (W4). node t634.cjs base_eng.json target_engine_634.json
const fs=require('fs');const ld=require('./libload.cjs');const [,,BE,TE]=process.argv;const B=JSON.parse(fs.readFileSync(BE,'utf8')),T=JSON.parse(fs.readFileSync(TE,'utf8'));
let P=0,F=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);c?P++:F++;};
(async()=>{
const N=E=>Object.fromEntries(E.nodes.map(n=>[n.name,n]));const NB=N(B),NT=N(T);
const ch=Object.keys(NB).filter(k=>JSON.stringify(NB[k])!==JSON.stringify(NT[k]));ok(Object.keys(NB).length===Object.keys(NT).length&&ch.length===1&&ch[0]==='Shared Library','only Shared Library changed ('+Object.keys(NT).length+' nodes)');
ok(JSON.stringify(B.connections)===JSON.stringify(T.connections),'connections equal');
const sp=t=>JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));const L0=sp(NB['Shared Library'].parameters.jsCode),L1=sp(NT['Shared Library'].parameters.jsCode);
const dl=L0.map((l,i)=>l!==L1[i]?i:-1).filter(i=>i>=0);ok(L0.length===L1.length&&dl.length===1&&dl[0]===1426,'one LIB line changed (index '+dl.join(',')+')');
ok(L1[1426].startsWith(L0[1426].slice(0,L0[1426].indexOf("if(!o){items.push(")))&&L1[1426].endsWith(L0[1426].slice(L0[1426].indexOf("if(!o){items.push("))),'the old line is kept whole; the new statement is inserted before the NOT APPLIED push');
ok(/ASK 634/.test(L1[1426])&&(L1[1426].match(/catch\(/g)||[]).length===(L0[1426].match(/catch\(/g)||[]).length,'ASK 599: tagged ASK 634; no new catch');
const entries=['Gate Record','Gate Build','Late Gate Build','Alternate Merge Seat','R2 Alt Gate Record'];
for(const en of entries){const a=await ld(B,en),b=await ld(T,en);ok(typeof a.sbApply2024==='function'&&typeof b.sbApply2024==='function','library entry '+en+' rebuilds and loads on base and target');}
const O=await ld(B,'Gate Record'),Nw=await ld(T,'Gate Record');
const run=(o,text,its)=>{const R=o.sbApply2024('sol',text,{},its,{});return {na:(R.items||[]).filter(x=>x.kind==='NOT APPLIED').map(x=>x.sid+': '+x.why),ap:[...(R.applied||[])].map(String).sort(),text:R.text};};
const ch1=(sid,line,to)=>({seat:'sol',sid,rule:'E-GATE',item:'NOT APPLIED',line,ans:'CHANGE',to});
// C1: the three 42528 items (sol), on the line forms the stored judgment holds (one FORCED line per pair: SQL on debate_judgments e0e528d8, Wall 12004)
const TXT=['COLLISION POINTS',
 'D3 vs C4 (Matthew 1:20): DEFENDER LINK BROKEN (Commitments 3 and 13) -- POINT: P3',
 'FORCED: D3 vs C4 -- MEANS [DR2]: "what was begotten-conceived is ascribed by origin to the Holy Ghost." -- ANSWER [CR3]: "the origin \'of the Holy Ghost\' consecrates the child" -- FAILS: "a"',
 'D5 vs C2 (Matthew 1:25): DEFENDER LINK BROKEN',
 'FORCED: D5 vs C2 -- MEANS [DR2]: "not knowing till birth covers the taking and the espousal alike." -- ANSWER [CR3]: "Matthew 1:25 stands in order after Matthew 1:24" -- FAILS: "b"',
 'D6 vs C1 (Matthew 1:23): DEFENDER LINK BROKEN',
 'FORCED: D6 vs C1 -- MEANS [DR2]: "Matthew applies virgin with child to Mary\'s pregnancy." -- ANSWER [CR3]: "Matthew 1:22-23 introduces G3933" -- FAILS: "c"'].join('\n');
const G=[ch1('G2','FORCED: D3 vs C4 remains as corrected above, with [L1] Matthew 1:20 and [L3] Matthew 1:18, Luke 1:15, and Acts 10:38 explicitly identified in WHY IT FAILS.','FORCED: D3 vs C4 -- MEANS [DR2]: "what was begotten-conceived is ascribed by origin to the Holy Ghost." -- ANSWER [CR3]: "the origin \\"of the Holy Ghost\\" consecrates the child as the Anointed" -- FAILS: "G2 NEW"'),
 ch1('G3','FORCED: D5 vs C2 remains as corrected above, quoting DR2\'s actual listed-premise MEANS and weighing 2 Samuel 7:12 in its tagged grounds and WHY IT FAILS.','FORCED: D5 vs C2 -- MEANS [DR2]: "not knowing till birth covers the taking and the espousal alike." -- ANSWER [CR3]: "Matthew 1:25 stands in order" -- FAILS: "G3 NEW"'),
 ch1('G7','FORCED: D6 vs C1 remains as corrected above, explicitly identifying [L1] Matthew 1:23 and [L3] Matthew 1:18,25 and Luke 1:27 in WHY IT FAILS.','FORCED: D6 vs C1 -- MEANS [DR2]: "Matthew applies virgin with child to Mary\'s pregnancy." -- ANSWER [CR3]: "where Mary is already Joseph\'s wife" -- FAILS: "G7 NEW"')];
const c0=run(O,TXT,G),c1=run(Nw,TXT,G);
ok(c0.na.length===3&&c0.na.every(s=>/the flagged line is not in the judge text/.test(s)),'C1 base: G2, G3, G7 NOT APPLIED, "the flagged line is not in the judge text" (as stored, rows 54568, 54569, 54573)');
ok(c1.na.length===0&&['G2','G3','G7'].every(s=>c1.ap.includes(s)),'C1 target: G2, G3, G7 applied');
ok(['G2 NEW','G3 NEW','G7 NEW'].every(s=>c1.text.includes(s))&&!/"a"|"b"|"c"/.test(c1.text.split('\n').filter(l=>/^FORCED/.test(l)).join('\n')),'C1 target: each pair\'s FORCED line is replaced by its gate line');
ok(c1.text.split('\n').filter(l=>/^D\d+ vs C\d+/.test(l)).join('\n')===c0.text.split('\n').filter(l=>/^D\d+ vs C\d+/.test(l)).join('\n'),'C1 target: the collision lines are unchanged');
console.log('  N1 effect: 3 items UNCURED -> CURED; sol drv_uncured 9 -> 6 (stored 9). A seat with drv_uncured > 0 is not seated, so sol\'s standing and the outcome do not change.');
// C2
const one=(txt,it)=>[run(O,txt,[it]),run(Nw,txt,[it])];
let [a,b]=one(TXT.split('\n').filter(l=>!/^FORCED: D3/.test(l)).join('\n'),G[0]);ok(a.na.join()===b.na.join()&&b.na.length===1,'C2 no FORCED line for the pair: NOT APPLIED under both, same reason');
[a,b]=one(TXT+'\nFORCED: D3 vs C4 -- MEANS [DR1]: "second" -- FAILS: "z"',G[0]);ok(a.na.join()===b.na.join()&&b.na.length===1,'C2 two FORCED lines for the pair: NOT APPLIED under both');
{const L3=TXT.split('\n').find(l=>/^FORCED: D3/.test(l));const S1=ch1('S1',L3,'FORCED: D3 vs C4 -- MEANS [DR2]: "x" -- FAILS: "S1 NEW"');const r1=run(Nw,TXT,[S1,G[0]]);const ref=run(O,TXT,[S1,{...G[0],line:L3}]);
 ok(r1.text.includes('G2 NEW')&&r1.ap.includes('G2')&&JSON.stringify(r1)===JSON.stringify(ref),'C2 the pair\'s line changed earlier in the pass: G2 is applied to it exactly as the base applies a second change on a found line (the last change wins)');}
{const it=ch1('S2','FORCED: D3 vs C4 -- MEANS [DR2]: "what was begotten-conceived is ascribed by origin to the Holy Ghost." -- ANSWER [CR3]: "the origin \'of the Holy Ghost\' consecrates the child" -- FAILS: "a"','FORCED: D3 vs C4 -- MEANS [DR2]: "y" -- FAILS: "FOUND"');[a,b]=one(TXT,it);ok(JSON.stringify(a)===JSON.stringify(b)&&b.ap.includes('S2'),'C2/C3 a flagged line that is found: identical result under both');}
{const it=ch1('S3','no such line anywhere in the text at all here','RETRACTED: D5 vs C2');[a,b]=one(TXT,it);ok(JSON.stringify(a)===JSON.stringify(b),'C2/C3 a RETRACTED change: identical result under both');}
{const it=ch1('S4','no such line anywhere in the text at all here','D5 vs C2 (Matthew 1:25): DEFENDER LINK HOLDS');[a,b]=one(TXT,it);ok(JSON.stringify(a)===JSON.stringify(b),'C3 an absent line with a collision-line change: identical result under both');}
{const it=ch1('S5','no such line anywhere in the text at all here','KEYSTONE: something else');[a,b]=one(TXT,it);ok(JSON.stringify(a)===JSON.stringify(b),'C3 an absent line with a non-FORCED change: identical result under both');}
{const it=ch1('S6','no such line anywhere in the text at all here','FORCED: D9 vs C9 -- MEANS [DR1]: "q" -- FAILS: "r"');[a,b]=one(TXT,it);ok(JSON.stringify(a)===JSON.stringify(b)&&b.na.length===1,'C2 a FORCED change for a pair with no FORCED line: NOT APPLIED under both');}
console.log('RESULT: '+(F?'FAIL ('+F+')':'ALL PASS ('+P+')'));})();
