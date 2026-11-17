// ASK 357 Part A tests. Usage: node t357.cjs [target] [base]. REAL = stored line or reply; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const tw=JSON.parse(fs.readFileSync(process.argv[2]||'target_357.json')),lw=JSON.parse(fs.readFileSync(process.argv[3]||'../rdf/fetchback_w353.json'));const tu=unpack(tw),lu=unpack(lw);
const dl=tu.L.map((l,i)=>l!==lu.L[i]?i:-1).filter(i=>i>=0);ok('library line changed is 850 only, line count unchanged',tu.L.length===lu.L.length&&dl.join()==='850',dl.join(','));
const LN={};for(const x of lw.nodes)LN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(LN[x.name])).map(x=>x.name);ok('only the Shared Library node changed; connections and settings equal',dn.join()==='Shared Library'&&JSON.stringify(tw.connections)===JSON.stringify(lw.connections)&&JSON.stringify(tw.settings)===JSON.stringify(lw.settings),dn.join(','));
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',bad.length===0,Object.keys(tu.M).length+' entries');
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(lu.L,lu.M[k]));const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry ('+ch.length+')',syn.length===0,syn.join('; '));
ok('every entry holding g4Unans2024 also holds g4Press2024 exactly once',Object.keys(tu.M).every(k=>{const s=rb(tu.L,tu.M[k]);return !s.includes('function g4Unans2024')||s.split('function g4Press2024(').length===2;}));
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const T=load(rb(tu.L,tu.M['Panel Cure Check']),$),Lv=load(rb(lu.L,lu.M['Panel Cure Check']),$);
// reader replay over all 340 stored K-G4 rows (g4rows.json, debate_enforcer_log rule K-G4, read 14:00Z 11-17)
const rows=JSON.parse(fs.readFileSync('g4rows.json'));const chg=rows.filter(r=>T.g4Unans2024(r.flagged_line)!==Lv.g4Unans2024(r.flagged_line)).map(r=>r.id);
ok('REPLAY reader over '+rows.length+' stored K-G4 rows: exactly 5210, 9448, 32562, 37080, 41106, 42704 change (meaning to press)',chg.join()==='5210,9448,32562,37080,41106,42704'&&chg.every(id=>T.g4Unans2024(rows.find(r=>r.id===id).flagged_line)),chg.join(','));
const line=id=>rows.find(r=>r.id===id).flagged_line;
ok('REAL 42366 (footing, run 37891) still meaning',!T.g4Unans2024(line(42366)));ok('REAL 18942 (grok "the answer misses that meaning") still meaning',!T.g4Unans2024(line(18942)));
// cures, with the harness of ASK 352 (tkg4): one RESPONSE line, a RETRACTED line with a quoted reason, one CORRECTED RESULT
const qC='the terminus-event stated; till bounds abstinence to pregnancy, begetting by knowing within wedlock before the finding.';const qD='2 Samuel 7:12 promises seed proceeding from David\'s body, which is transmitted through Mary to Christ who was born of her';
const R={CR1:'x',DR1:'x',CR2:'x',DR2:'seed according to flesh requires seed out of a man',CR3:'PLANT round. '+qD,DR3:'PLANT round. Matthew 1:25 reads '+qC+' the angel answers it by bidding him take unto thee Mary thy wife because the child is the seed God claims',CR4:'x',DR4:'x'};
const run=(M,x,txt)=>M.cureVerdicts([x],{ok:true,text:'RESPONSE: K-G4 '+x.link+' | I answer the item on '+x.link+'.\n'+txt},{},R)[0];const show=r=>r?r.status+': '+String(r.why).slice(0,140):'none';
const i704={rule:'K-G4',side:'CHALLENGER',link:'D1 vs C1',line:line(42704)};const rx704='RETRACTED: D1 vs C1 -- [DR3] answers the press with Matthew 1:19 and Matthew 1:20 and offers the reading that “the angel answers it by bidding him take unto thee Mary thy wife because the child is the seed God claims.”\nCORRECTED RESULT: BROKEN-1'; /* REAL retraction words of 42704 (AUDIT v21 STATEMENT, judgment 1209) */
let a=run(Lv,i704,rx704),b=run(T,i704,rx704);ok('REAL 42704 (terra, run 38051) + REAL retraction: live UNCURED (meaning), ASK 357 CURED (press break retracted)',a.status==='UNCURED'&&b.status==='CURED'&&b.why==='retracted',show(a)+' || '+show(b));
const i366={rule:'K-G4',side:'DEFENDER',link:'D4 vs C4',line:line(42366)};const rx366='RETRACTED: D4 vs C4 -- [CR3] “'+qD+'”.\nCORRECTED RESULT: HELD-1';
a=run(Lv,i366,rx366);b=run(T,i366,rx366);ok('REAL 42366 + REAL retraction: UNCURED, same as live (MUST NOT PASS)',b.status==='UNCURED'&&JSON.stringify(a)===JSON.stringify(b),show(b));
const L41138='D4 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN -- C4’s reading of the terminus of Joseph’s not-knowing as allowing knowing before the birth, which the verse does not support -- GROUND: [L1] Matthew 1:25 “And knew her not till she had brought forth her firstborn son” | [L3] Luke 2:7 “And she brought forth her firstborn son” -- the challenger’s claim that Joseph knew Mary during the pregnancy conflicts with the stated not-knowing through the bringing forth. (Commitment 3)';
const i138={rule:'K-G4',side:'CHALLENGER',link:'D4 vs C4',line:L41138};const rx138='RETRACTED: D4 vs C4 -- [DR3] “'+qC+'”\nCORRECTED RESULT: BROKEN-1';
a=run(Lv,i138,rx138);b=run(T,i138,rx138);ok('REAL 41138 + REAL retraction: UNCURED, same as live (MUST NOT PASS)',b.status==='UNCURED'&&JSON.stringify(a)===JSON.stringify(b),show(b));
// plants
ok('PLANT "the press was met" not read',!T.g4Press2024('D1 vs C1 (x): CHALLENGER LINK BROKEN -- the press was met, but the meaning cannot agree -- GROUND: [L1] Luke 1:1 "a"'));
ok('PLANT "the answer does not meet the meaning" not read',!T.g4Press2024('D1 vs C1 (x): CHALLENGER LINK BROKEN -- the answer does not meet the meaning of the verse -- GROUND: [L1] Luke 1:1 "a"'));
ok('PLANT P1 words only inside a quotation not read',!T.g4Press2024('D1 vs C1 (x): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Luke 1:1 "the answer misses the pressed point"'));
ok('PLANT negated: "it is not that the press is not met" not read',!T.g4Press2024('D1 vs C1 (x): CHALLENGER LINK BROKEN -- it is not that the press is not met; the meaning fails -- GROUND: [L1] Luke 1:1 "a"'));
ok('PLANT "the answer misses the pressed inference" read before GROUND',T.g4Press2024('D1 vs C1 (x): CHALLENGER LINK BROKEN (Commitment 5) -- The answer misses the pressed inference. GROUND: [L1] Luke 1:1 "a"'));
ok('PLANT the ASK 352 "does not address" reason before GROUND is still not read (P1 needs the press as object)',!T.g4Unans2024('D1 vs C1 (x): CHALLENGER LINK BROKEN -- the answer does not address it -- GROUND: [L1] Luke 1:1 "a b c"'));
ok('no new operator name in the library',tu.L.filter(l=>/Eric/.test(l)).length===lu.L.filter(l=>/Eric/.test(l)).length);
console.log(n+' checks, '+(fails?'FAILS '+fails:'ALL OK'));process.exit(fails?1:0);
