// ASK 352 tests (K-G4 to ruling 421 by the manual K-G4 row's test). Usage: node tkg4.cjs [target] [base]. REAL = a stored flagged_line; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const lw=JSON.parse(fs.readFileSync(process.argv[3]||'live.json')),tw=JSON.parse(fs.readFileSync(process.argv[2]||'target_kg4.json'));const lu=unpack(lw),tu=unpack(tw);
const dl=tu.L.map((l,i)=>l!==lu.L[i]?i:-1).filter(i=>i>=0);const want=[809,1068,1069,1070,1071,1072,1073,1074,3315];
ok('library lines changed are 809, 1068-1074, 3315 only, line count unchanged',tu.L.length===lu.L.length&&dl.join()===want.join(),dl.join(', '));
const LN={};for(const x of lw.nodes)LN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(LN[x.name])).map(x=>x.name);ok('only the Shared Library node changed',dn.join()==='Shared Library',dn.join(', '));
ok('connections and settings unchanged',JSON.stringify(tw.connections)===JSON.stringify(lw.connections)&&JSON.stringify(tw.settings)===JSON.stringify(lw.settings));
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',bad.length===0,Object.keys(tu.M).length+' entries'+(bad.length?' bad: '+bad.join(','):''));
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(lu.L,lu.M[k]));const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}
ok('syntax of every changed library entry',syn.length===0,ch.length+' entries'+(syn.length?' '+syn.join('; '):''));
ok('lines 1069-1074 hold only the one comment (1069) and empty lines',/^\s*\/\* ASK 352: .*\*\/$/.test(tu.L[1069])&&[1070,1071,1072,1073,1074].every(i=>tu.L[i]===''));
ok('no library line still offers the quoted-reason retraction cure',!tu.L.some(l=>/quoted reason the (?:system|transcript) verifies|such a quoted reason/.test(l)),tu.L.map((l,i)=>/quoted reason the (?:system|transcript) verifies|such a quoted reason/.test(l)?i:-1).filter(i=>i>=0).join(','));
ok('prompt line 809 reads "cured only by one FORCED line; a retraction does not cure it (ruling 421)"',tu.L[809].includes('it is cured only by one FORCED line; a retraction does not cure it (ruling 421).')&&lu.L[809].replace("it is cured by one FORCED line, or by RETRACTED beside a quoted reason the system verifies (6 or more words of the holding side's own answer, word for word from its round, or the verse of the line its later round names; ruling of 2026-11-06).","it is cured only by one FORCED line; a retraction does not cure it (ruling 421).")===tu.L[809]);
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const T=load(rb(tu.L,tu.M['Panel Cure Check']),$),Lv=load(rb(lu.L,lu.M['Panel Cure Check']),$);
const TB=load(rb(tu.L,tu.M['Panel Cure Build 1']),$),LB=load(rb(lu.L,lu.M['Panel Cure Build 1']),$);
const L41138='D4 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN -- C4’s reading of the terminus of Joseph’s not-knowing as allowing knowing before the birth, which the verse does not support -- GROUND: [L1] Matthew 1:25 “And knew her not till she had brought forth her firstborn son” | [L3] Luke 2:7 “And she brought forth her firstborn son” -- the challenger’s claim that Joseph knew Mary during the pregnancy conflicts with the stated not-knowing through the bringing forth. (Commitment 3)';
const L42366='D4 vs C4 (Romans 1:3): DEFENDER LINK BROKEN (Commitment 5) -- PRESSED: D4 vs C4 | [DR2] | “seed according to flesh requires seed out of a man” -- The answer\'s route through Mary assumes her Davidic lineage rather than exhibiting it -- GROUND: [L1] Romans 1:3 “which was made of the seed of David according to the flesh” | [L3] Acts 2:30 “of the fruit of his loins, according to the flesh”; [CR4] answers “Being made of the seed of David according to the flesh is accomplished through Mary, of whom Christ was born of David\'s line.”';
const qC='the terminus-event stated; till bounds abstinence to pregnancy, begetting by knowing within wedlock before the finding.';
const qD='2 Samuel 7:12 promises seed proceeding from David\'s body, which is transmitted through Mary to Christ who was born of her';
const R={CR1:'x',DR1:'Matthew 1:25 "And knew her not till she had brought forth her firstborn son"',CR2:'x',DR2:'seed according to flesh requires seed out of a man',CR3:'PLANT round. '+qD+'. Romans 1:3 "made of the seed of David according to the flesh"',DR3:'PLANT round. Matthew 1:25 reads '+qC,CR4:'x',DR4:'x'};
const RS=x=>'RESPONSE: K-G4 '+x.link+' | I answer the item on '+x.link+'.\n';const run=(M,x,txt)=>M.cureVerdicts([x],{ok:true,text:RS(x)+txt},{},R)[0];
const show=r=>r?r.status+': '+String(r.why).slice(0,170):'none';
const i41138={rule:'K-G4',side:'CHALLENGER',link:'D4 vs C4',line:L41138};
const rx41138='RETRACTED: D4 vs C4 -- [DR3] \u201c'+qC+'\u201d\nCORRECTED RESULT: BROKEN-1'; /* REAL reply lines of 41138 */
let a=run(Lv,i41138,rx41138),b=run(T,i41138,rx41138);
ok('REAL line 41138 + REAL retraction lines: the live library cures the retraction by its quoted reason',a.status==='CURED'&&/quoted reason/.test(a.why),show(a));
ok('REAL line 41138 + REAL retraction lines: ASK 352 reads UNCURED (ruling 421)',b.status==='UNCURED'&&/ruling 421/.test(b.why)&&/ASK 352/.test(b.why),show(b));
const i42366={rule:'K-G4',side:'DEFENDER',link:'D4 vs C4',line:L42366};const rx42366='RETRACTED: D4 vs C4 -- [CR3] \u201c'+qD+'\u201d.\nCORRECTED RESULT: HELD-1'; /* REAL reply lines of 42366 */
a=run(Lv,i42366,rx42366);b=run(T,i42366,rx42366);
ok('REAL line 42366 (terra, run 37891) + REAL retraction lines: live CURED, ASK 352 UNCURED (manual row: its GROUND names no witness left unanswered)',a.status==='CURED'&&b.status==='UNCURED',show(a)+' || '+show(b));
const Lun='D2 vs C2 (Matthew 1:18): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:18 "before they came together" | [L3] Matthew 1:25 "knew her not till" did not answer';
const iun={rule:'K-G4',side:'CHALLENGER',link:'D2 vs C2',line:Lun};const rxun='RETRACTED: D2 vs C2 -- [DR3] reads "'+qC+'"\nCORRECTED RESULT: BROKEN-1';
a=run(Lv,iun,rxun);b=run(T,iun,rxun);ok('PLANT GROUND names a witness left unanswered: retraction CURED, same as live',b.status==='CURED'&&b.why==='retracted'&&JSON.stringify(a)===JSON.stringify(b),show(b));
const rxf='FORCED: D4 vs C4 -- MEANS [CR3]: "till bounds abstinence to pregnancy" -- ANSWER [DR3]: "begetting by knowing within wedlock before the finding" -- FAILS: "begetting by knowing within wedlock"';
a=run(Lv,i41138,rxf);b=run(T,i41138,rxf);ok('PLANT FORCED line on the meaning break 41138: CURED, same as live',b.status==='CURED'&&/^forced link/.test(b.why)&&JSON.stringify(a)===JSON.stringify(b),show(b));
const rxnr='RETRACTED: D4 vs C4\nCORRECTED RESULT: BROKEN-1';a=run(Lv,i41138,rxnr);b=run(T,i41138,rxnr);ok('PLANT retraction with no reason: UNCURED as live (ruling 105 path unchanged)',b.status==='UNCURED'&&JSON.stringify(a)===JSON.stringify(b),show(b));
const rx2='RETRACTED: D4 vs C4 -- [DR3] reads "'+qC+'"\nCORRECTED RESULT: BROKEN-1\nCORRECTED RESULT: BROKEN-1';a=run(Lv,i41138,rx2);b=run(T,i41138,rx2);ok('PLANT retraction with two CORRECTED RESULT lines: UNCURED as live',b.status==='UNCURED'&&JSON.stringify(a)===JSON.stringify(b),show(b));
const i7={rule:'K-G7',side:'CHALLENGER',link:'D4 vs C4',line:L41138};a=Lv.cureVerdicts([i7],{ok:true,text:'RESPONSE: K-G7 D4 vs C4 | x\n'+rx41138},{},R)[0];b=T.cureVerdicts([i7],{ok:true,text:'RESPONSE: K-G7 D4 vs C4 | x\n'+rx41138},{},R)[0];ok('PLANT the same retraction on a K-G7 item reads the same as live (only K-G4 changes)',JSON.stringify(a)===JSON.stringify(b),show(b));
// labels
const lm=TB.g4Label2024(i41138),lmL=LB.g4Label2024(i41138);ok('gate label for a meaning break: FORCED line form, "A retraction does not cure it (ruling 421)", no quoted-reason cure',/One FORCED line cures it: FORCED: D<n> vs C<m>/.test(lm)&&/A retraction does not cure it \(ruling 421\)/.test(lm)&&!/quoted reason/.test(lm)&&/quoted reason/.test(lmL),lm.slice(0,220));
ok('gate label for an unanswered-witness break: same as live',TB.g4Label2024(iun)===LB.g4Label2024(iun));
// recompute: a retraction on a link whose K-G4 item is UNCURED is not applied (existing guard)
{const text=[L41138,'DEFENSE STANDING: HELD','CONCEDED LINKS: 0','CHALLENGE STANDING: BROKEN','CHALLENGER CONCEDED LINKS: 1','RESULT: DEFENDER PREVAILS (HELD)'].join('\n');
 const F0={verdict_tag:'HELD',defense_standing:'HELD',conceded_links:0,challenge_standing:'BROKEN',challenger_conceded_links:1};
 const rr={ok:true,text:RS(i41138)+rx41138};const vL=Lv.cureVerdicts([i41138],rr,{},R),vT=T.cureVerdicts([i41138],rr,{},R);
 const rL=Lv.cureRecompute('luna',text,F0,[i41138],vL,rr),rT=T.cureRecompute('luna',text,F0,[i41138],vT,rr);
 const f=r=>r?r.fields.challenge_standing+'/'+r.fields.challenger_conceded_links+' '+r.trig.join('; '):'no change';
 ok('recompute, live library: the cured retraction is applied and the challenge standing moves',!!rL&&rL.trig.some(t=>/^RETRACTED D4 vs C4/.test(t)),f(rL));
 ok('recompute, ASK 352: the retraction is not applied; the BROKEN grade stands',!rT||!rT.trig.some(t=>/^RETRACTED/.test(t)),f(rT));}
ok('K-G4 is LIVE in ENF_STATUS (an uncured item counts in drv_uncured)',T.ENF_STATUS&&T.ENF_STATUS['K-G4']==='LIVE',T.ENF_STATUS&&T.ENF_STATUS['K-G4']);
console.log(n+' checks, '+(fails?'FAILS '+fails:'ALL OK'));
