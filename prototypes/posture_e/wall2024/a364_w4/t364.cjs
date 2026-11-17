// ASK 364 Part A tests. Usage: node t364.cjs [bare target] [resend target] [base]. REAL = stored round; PLANT = made for the test.
const fs=require('fs');const {run}=require('./harness.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const TB=JSON.parse(fs.readFileSync(process.argv[2]||'target_364_bare.json')),TR=JSON.parse(fs.readFileSync(process.argv[3]||'target_364_resend.json')),BW=JSON.parse(fs.readFileSync(process.argv[4]||'../rdf/fetchback_s247.json'));
const nm=w=>{const o={};for(const x of w.nodes)o[x.name]=x;return o;};const NB=nm(TB),NR=nm(TR),N0=nm(BW);
const SIX=['D2B Build','D2B Extract','D3B Build','D3B Extract','D4B Build','D4B Extract'];
const ch=TB.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(N0[x.name])).map(x=>x.name);
ok('only the six D2B/D3B/D4B Build and Extract nodes change; node order, connections, settings equal',ch.sort().join()===SIX.slice().sort().join()&&TB.nodes.map(x=>x.name).join()===BW.nodes.map(x=>x.name).join()&&JSON.stringify(TB.connections)===JSON.stringify(BW.connections)&&JSON.stringify(TB.settings)===JSON.stringify(BW.settings),ch.join(', '));
ok('no Call node changes (model settings copied by not touching them)',BW.nodes.filter(x=>/Call /.test(x.name)).every(x=>JSON.stringify(x)===JSON.stringify(NB[x.name])));
const dRB=TR.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(NB[x.name])).map(x=>x.name);ok('the two files differ only in the three Extract nodes, at LAY_BARE',dRB.sort().join()==='D2B Extract,D3B Extract,D4B Extract'&&dRB.every(k=>NB[k].parameters.jsCode.replace('const LAY_BARE=true;','const LAY_BARE=false;').replace(/\/\* ASK 364: a point still short[^*]*\*\//,'')===NR[k].parameters.jsCode.replace(/\/\* ASK 364: record only[^*]*\*\//,'')),dRB.join(', '));
const syn=[];for(const k of SIX)for(const W of [NB,NR]){try{new Function('$','$input','$execution','return (()=>{'+W[k].parameters.jsCode+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of the six nodes in both files',!syn.length,syn.join(' | '));
const mod=k=>{const c=NB[k].parameters.jsCode;return c.slice(c.indexOf('const LAY=(()=>{'),c.indexOf('return {check,note,bare,words,structure'));};ok('the LAY module is byte-equal in all six nodes',SIX.every(k=>mod(k)===mod(SIX[0])&&mod(k).length>1000),mod(SIX[0]).length+' chars');
ok('the old barred-moves code is kept: each node still holds its BAR check and note',SIX.every(k=>NB[k].parameters.jsCode.includes('BAR')));
// LAY unit (C4, negation, limits)
const LAY=new Function(mod('D2B Build')+'return {check,note,bare,words,structure};})();return LAY;')();
const V1='Matthew 1:25 "And knew her not till she had brought forth her firstborn son: and he called his name JESUS."';
const u=[
 ['REAL 37891 row: "at all" is flagged',V1+' -- MEANS: Joseph did not know her at all until she brought forth her firstborn son. -- [L2] ginosko (to know) | PROVEN IN [DR1]','at all'],
 ['C4a PLANT: a word standing only in an [L2] gloss is flagged',V1+' -- MEANS: he never knew her before the birth -- [L2] ginosko (to know, never at any time)','never'],
 ['C4c PLANT: the same word standing in a quoted [L3] verse passes',V1+' -- MEANS: he never knew her before the birth -- [L3] Luke 1:34 "Then said Mary unto the angel, How shall this be, seeing I know not a man? never"',''],
 ['NEG PLANT: "not" in the verse carries "no" and "any"','Luke 1:34 "Then said Mary unto the angel, How shall this be, seeing I know not a man?" -- MEANS: Mary had no knowledge of any man',''],
 ['NEG PLANT: "not" never carries "without"','Luke 1:34 "Then said Mary unto the angel, How shall this be, seeing I know not a man?" -- MEANS: conception without a man','without'],
 ['PLANT: MEANS words that stand in the verse pass',V1+' -- MEANS: Joseph knew her not till she had brought forth her firstborn son',''],
 ['REAL 38106 row: "without male seed" on Galatians 4:4 is flagged','Galatians 4:4 "But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law," -- MEANS: Christ took human flesh derived from a woman without male seed -- [L2] G1096 *ginomai* (to cause to be) | PROVEN IN [DR1].','without'],
];
for(const [t,l,want] of u){const g=LAY.words(l).map(x=>x.add.join(',')).join(';');ok(t,g===want,g||'(none)');}
const S1='LINK 2: SUPPORTED\n[L1] Luke 1:34: "Then said Mary unto the angel, How shall this be, seeing I know not a man?"\n[L2] G1097 ginosko (to know) in Luke 1:34.\n[L4] Chain: she knew no man, so the conception had no human father, on the verse and the word read together here.';
ok('C4b PLANT: a critical point with one quoted [L1] verse and an [L2] is short (one verse only)',LAY.structure(S1).length===1&&/one verse only/.test(LAY.structure(S1)[0].why),LAY.structure(S1).map(x=>x.why).join());
const S2=S1+'\n[L3] Matthew 1:18: "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
ok('PLANT: the same point with an [L3] verse passes',LAY.structure(S2).length===0);
ok('PLANT: a PRESSED WITH list is not read for structure',LAY.structure('PRESSED WITH:\n'+V1+' -- MEANS: x -- [L2] y | PROVEN IN [DR1]. and more words to pass the length floor here').length===0);
// rev 2 (W1 7653, W3 7654, amended C1 agreed W1 7656, W2, W3)
const P=(t,c,d)=>ok('REV2 '+t,c,d);
P('F1: the press\'s MEANS quoted by the defender is not read',LAY.words('ANSWER: Mark 6:3 -- D4 -- "Is not this the carpenter, the son of Mary?" The press\'s MEANS: "naming by the mother removes all fathers"').length===0);
P('F1: a MEANS whose text opens with a quotation is not read',LAY.words('*Matthew 1:19* "Then Joseph her husband, being a just man" -- MEANS: "espousal is only husband-wife." Granted').length===0);
P('F1: prose "means:" in lower case is not read',LAY.words('Genesis 4:25 "And Adam knew his wife again" The row states its own means: no other seed').length===0);
P('F2 (W1): "not only" widens and is not flagged',LAY.words('Matthew 1:3 "Judas begat Phares and Zara of Thamar" -- MEANS: descent is not only father to son').length===0);
P('"only" said of the Bible is not flagged',LAY.words('Isaiah 7:14 "Behold, a virgin shall conceive, and bear a son" -- MEANS: the only Bible in this debate prints a virgin').length===0);
P('W3 F4: a word that describes what the record states is not flagged',LAY.words('Matthew 1:18 "before they came together, she was found with child" -- MEANS: the child is found before any stated union').length===0);
P('W3 F2: a KJV quote on the row after the MEANS carries the word',LAY.words('Numbers 1:2 "Take ye the sum" -- MEANS: reckoning counts every male -- [L1] "every male by their polls"').length===0);
P('REAL row still flagged after rev 2: "at all" on Matthew 1:25',LAY.words(V1+' -- MEANS: Joseph did not know her at all until she brought forth her firstborn son. -- [L2] ginosko (to know) | PROVEN IN [DR1]').map(x=>x.add.join()).join()==='at all');
const T2='LINK 4: SUPPORTED\n[L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost" and [L1] Luke 1:34 "How shall this be, seeing I know not a man?"\nThe two rows read together.';
P('amended C1: two different verses quoted on tagged [L1] lines pass, whatever the second tag',LAY.structure(T2).length===0);
P('amended C1: bare tagged references with no quoted words do not count',LAY.structure('LINK 4: SUPPORTED\n[L1] John 1:13 -- [L2] G1080; [L1] John 3:6 -- [L2] G1080; [L1] Acts 1:8 -- [L2] G1904. These rows read together.').length===1);
P('amended C1: a reference in prose does not count',LAY.structure('LINK 4: SUPPORTED\n[L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"\nRead with Luke 1:34 "How shall this be" in prose here.').length===1);
P('amended C1: two [L3] verses and no [L1] are short',/no \[L1\]/.test((LAY.structure('LINK 4: SUPPORTED\n[L3] Matthew 1:18 "before they came together, she was found with child"\n[L3] Luke 1:34 "How shall this be, seeing I know not a man?"')[0]||{}).why||''));
P('F3: the ANSWER row form reads as an [L1] with its reference',LAY.structure('## D3: Mary a virgin; Joseph knew her not until the birth\nANSWER: Matthew 1:25 -- D3 -- "And knew her not till she had brought forth her firstborn son"\n- [L3] Genesis 4:1: "Adam knew Eve his wife; and she conceived."').length===0);
P('F3: the MEANS row form reads as an [L1] with its reference',LAY.structure('PREMISE 2: the order\nMatthew 1:18 "before they came together, she was found with child" -- MEANS: the finding precedes the union\n[L3] Luke 1:34 "How shall this be, seeing I know not a man?"').length===0);
// rev 2.3 (W3 7674, W1 7676): heads read as critical points
const B1='\n[L1] Luke 1:34: "Then said Mary unto the angel, How shall this be, seeing I know not a man?"\nThe point rests on this one verse alone and on nothing more said here.';
P('2.3: a numbered prefix before LINK is read ("**1. LINK 6")',LAY.structure('**1. LINK 6 -- the record states it.**'+B1).length===1);
P('2.3: a roman-numbered heading with content under it is read',LAY.structure('## II. PRESSES ON THE CHAIN'+B1).length===1);
P('2.3: a "Point n" heading is read',LAY.structure('#### Point 3: the body'+B1).length===1);
P('2.3: a PRESS head is read',LAY.structure('**PRESS on LINK C1:** the record states it.'+B1).length===1);
P('2.3: a PRESSED WITH line is not a head (no block opens there)',LAY.structure('PRESSED WITH: Luke 1:34, Matthew 1:18.'+B1).length===0);
P('2.3: a numbered heading with no content under it is skipped',LAY.structure('## I. ANSWERS TO THE PRESSES\n## II. CLOSE').length===0);
P('2.3: a plain numbered list line (not a heading) does not open a block',LAY.structure('1. The challenger infers that the conception occurred in the espousal.'+B1).length===0);
// rev 2.4 (W1 7678 F1 to F3; W3 7679 R1 to R3)
P('2.4 F1: a PRESSED WITH row of Ref -- "words" pairs reads as [L1] verses',LAY.structure('**PRESS on LINK C1:** the record states it. PRESSED WITH: Matthew 1:1 — "The book of the generation of Jesus Christ"; Luke 3:23 — "being (as was supposed) the son of Joseph"').length===0);
P('2.4 F1: a PRESSED WITH row of bare references still does not count',LAY.structure('**PRESS on LINK C1:** the record states it plainly here. PRESSED WITH: Matthew 1:1; Luke 3:23; Luke 2:4.').length===1);
P('2.4 F2: "quote" (Ref [L1]) gives the reference its tag and its words',LAY.structure('## III. CLOSE\nD1: "Jacob begat Joseph the husband of Mary, of whom was born Jesus" (Matthew 1:16 [L1]; gennao [L2]) and "before they came together, she was found with child" (Matthew 1:18 [L1]; prin [L2]).').length===0);
P('2.4 F2: a [L3] reference in the parenthesis gets no quotation it does not have',LAY.structure('## III. CLOSE\nD1: "Jacob begat Joseph the husband of Mary, of whom was born Jesus" (Matthew 1:16 [L1]; gennao [L2]; Matthew 1:2 [L3]) and nothing more is quoted.').length===1);
P('2.4 F3: a correction head is not a point',LAY.structure('## 0. A correction on my own opening'+B1).length===0);
P('2.4 F3: "I do not withdraw" stays a point (negation guard)',LAY.structure('## 2. I do not withdraw LINK 3'+B1).length===1);
// Node runs
const rows=JSON.parse(fs.readFileSync('def_rounds.json'));const r91=rows.find(x=>x.run_token.includes('37891'));
const call={fam:'openrouter',fam_idx:5,model:'m',body:{model:'m',messages:[{role:'user',content:'x'}]}};
const env=(raw)=>({'D3 Extract':{run_token:'T',raw,labelled:'L',msg_id:'id1',fam:'openrouter',model:'m'},'D3 Build':{call},'D1 Extract':{raw:r91.r1},'C1B Extract':{raw:'x'},'D2B Extract':{raw:r91.r2},'C2B Extract':{raw:'y'},'Init with Guards':{lab:{D:'DEFENDER (standard reading)',C:'CHALLENGER (record\'s reading)'}},'Init Seats':{},'L2 Count Plan':{}});
const G=run(NB['D3B Build'].parameters.jsCode,env(r91.r3),{})[0].json;
ok('REAL 37891 round 3: the defender is sent back (layers alone, no barred sentence)',G.resend===true&&/^0 barred sentence\(s\); \d+ layer point\(s\)$/.test(G.why)&&/^LAYERS CHECK/.test(G.note)&&!/BARRED MOVES CHECK/.test(G.note)&&G.note.includes('at all'),G.why);
ok('the resend continues the defender\'s own call (assistant = its round, user = the note)',(()=>{const m=G.call.body.messages;return m[m.length-2].role==='assistant'&&m[m.length-2].content===r91.r3&&m[m.length-1].content===G.note&&G.call.model==='m';})());
const B0=run(N0['D3B Build'].parameters.jsCode,env(r91.r3),{})[0].json;ok('the base would not have sent this round back',B0.resend===false,B0.why);
const clean=S2;const Gc=run(NB['D3B Build'].parameters.jsCode,env(clean),{})[0].json;ok('PLANT clean round: no resend',Gc.resend===false,Gc.why);
const Xc=run(NB['D3B Extract'].parameters.jsCode,{...env(clean),'D3B Build':Gc},{})[0].json;ok('G4 PLANT clean round: it passes through Extract byte-equal',Xc.raw===clean&&Xc.labelled==='L');
const ANSB='\n\nANSWER: on the press of Luke 2:48\n[L1] Luke 2:48: "And when they saw him, they were amazed: and his mother said unto him, Son, why hast thou thus dealt with us? behold, thy father and I have sought thee sorrowing."\n[L3] Luke 3:23: "And Jesus himself began to be about thirty years of age, being (as was supposed) the son of Joseph, which was the son of Heli,"\nThe verse does not name Joseph as begetter.';const barred=S2+ANSB;const Gb=run(NB['D3B Build'].parameters.jsCode,env(barred),{})[0].json;ok('PLANT barred-only round: the note is the barred-moves note alone',Gb.resend===true&&/BARRED MOVES CHECK/.test(Gb.note)&&!/LAYERS CHECK/.test(Gb.note),Gb.why);
const both=S1+ANSB;const Gx=run(NB['D3B Build'].parameters.jsCode,env(both),{})[0].json;ok('PLANT both faults: one resend carries both notes',Gx.resend===true&&/BARRED MOVES CHECK/.test(Gx.note)&&/LAYERS CHECK/.test(Gx.note),Gx.why);
ok('N3 (W1): with both notes, the one-request line stands once',(Gx.note.match(/this is the only request of its kind/g)||[]).length===1&&(G.note.match(/this is the only request of its kind/g)||[]).length===1&&(Gb.note.match(/this is the only request of its kind/g)||[]).length===1);
ok('N2 (W3): the note asks for each verse\'s reference and quoted words on an [L1] or [L3] line',/write its reference and then quote its KJV words, on an \[L1\] or \[L3\] line/.test(G.note));
// Extract: C3 replacement, N2 re-check, bare vs resend-only
const fixed=r91.r3.replace('did not know her at all until','did not know her until');const reply={choices:[{message:{content:fixed},finish_reason:'stop'}],usage:{}};
const XB=run(NB['D3B Extract'].parameters.jsCode,{...env(r91.r3),'D3B Build':G},reply)[0].json,XR=run(NR['D3B Extract'].parameters.jsCode,{...env(r91.r3),'D3B Build':G},reply)[0].json;
ok('C3: the resent round replaces the first before the next node reads it',XB.bar.kept==='second'&&XB.raw.startsWith(fixed.slice(0,500))&&!XB.raw.includes('did not know her at all until'));
ok('N2: the kept round is checked again and every point still short is recorded',XB.bar.layers&&XB.bar.layers.after&&XB.bar.layers.after.items.length>0&&XB.bar.layers.first&&XB.bar.layers.first.items.length>XB.bar.layers.after.items.length,(XB.bar.layers.first&&XB.bar.layers.first.items.length)+' -> '+(XB.bar.layers.after&&XB.bar.layers.after.items.length));
ok('bare file: one BARE CLAIM line per point still short, written into the round and the labelled round',(XB.raw.match(/\[SYSTEM LAYERS CHECK\] BARE CLAIM/g)||[]).length===XB.bar.layers.after.items.length&&XB.labelled.includes('[SYSTEM LAYERS CHECK] BARE CLAIM')&&XB.bar.layers.bare_written===true);
ok('resend-only file: the same record, no line written into the round',!XR.raw.includes('BARE CLAIM')&&XR.bar.layers.bare_written===false&&XR.bar.layers.after.items.length===XB.bar.layers.after.items.length&&XB.raw.startsWith(XR.raw)&&XB.raw.length>XR.raw.length);
// The other two nodes run the same way
for(const [r,k] of [['D2','r2'],['D4','r4']]){const e={...env(''),[r+' Extract']:{run_token:'T',raw:r91[k],labelled:'L',msg_id:'i',fam:'openrouter',model:'m'},[r+' Build']:{call}};let g=null,er=null;try{g=run(NB[r+'B Build'].parameters.jsCode,e,{})[0].json;}catch(x){er=x.message;}ok('REAL 37891 '+k+': '+r+'B Build runs and reads the layers',!!g&&g.lay_check!==undefined||(!!g&&g.resend===false),er||(g&&g.why));}
// Replay (G1, F2): every flag listed for the hand read
const L=[];const per={};for(const x of rows)for(const k of ['r1','r2','r3','r4']){const c=LAY.check(x[k]);per[k]=per[k]||{runs:0,words:0,structure:0};if(c.items.length)per[k].runs++;for(const it of c.items){it.kind==='WORDS'?per[k].words++:per[k].structure++;L.push([x.run_token,k,it.id,it.kind,(it.kind==='WORDS'?it.line:it.head).replace(/\s+/g,' ').slice(0,400),it.why].join(' | '));}}
fs.writeFileSync('replay364_flags_rev24.txt',L.join('\n')+'\n');console.log('   replay over '+rows.length+' stored runs (rounds 2 to 4 are Part A): '+JSON.stringify(per));
console.log(n-fails+' of '+n+' pass');process.exit(fails?1:0);
