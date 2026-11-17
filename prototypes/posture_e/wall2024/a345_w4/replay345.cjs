// ASK 345 offline replay. Inputs read by SQL this turn (kjv_verses, original_words, debate_results excerpts, debate_enforcer_log 41802/41803).
const fs=require('fs');const T=require('../tools/lib.cjs');const d=JSON.parse(fs.readFileSync('target_345.json'));const U=T.unpack(d);
const CV=[{book:'Romans',chapter:9,verse:5,text:'Whose [are] the fathers, and of whom as concerning the flesh Christ [came], who is over all, God blessed for ever. Amen.'},{book:'Matthew',chapter:1,verse:24,text:'Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife:'},{book:'Matthew',chapter:1,verse:25,text:'And knew her not till she had brought forth her firstborn son: and he called his name JESUS.'},{book:'Matthew',chapter:1,verse:16,text:'And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.'},{book:'Acts',chapter:2,verse:30,text:'Therefore being a prophet, and knowing that God had sworn with an oath to him, that of the fruit of his loins, according to the flesh, he would raise up Christ to sit on his throne;'},{book:'Romans',chapter:1,verse:3,text:'Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;'}];
const OW=[{book:'Matthew',chapter:1,verse:24,word_position:16,strongs_number:'G3880'},{book:'Matthew',chapter:1,verse:25,word_position:5,strongs_number:'G2193'}];
const CR3=fs.readFileSync('cr3x.txt','utf8')+'\n[L3] Matthew 1:24 -- "Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife:" -- [L2] paralambano (G3880).',DR2=fs.readFileSync('dr2x.txt','utf8');
const R={CR3,DR2};let OWX=OW;
const $=n=>({all:()=>(n==='Cited Verses'?CV:n==='L2 Words'?OWX:[]).map(j=>({json:j})),isExecuted:true,first:()=>({json:{}})});
const lib=U.L[U.L.length-1];const ECW=new Function('$',lib+'\nreturn ECW;')($);
const FL41802='D6 vs C6 (Romans 1:3): DEFENDER LINK BROKEN -- The answer does not show how the Davidic seed according to the flesh fits the conclusion that Christ had no biological father. GROUND: [L1] Romans 1:3 “Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;” | [L2] sperma (G4690, seed) | [L3] Acts 2:30 “Therefore being a prophet, and knowing that God had sworn with an oath to him, that of the fruit of his loins, according to the flesh, he would raise up Christ to sit on his throne:”';
const FL41803='FORCED: D6 vs C6 -- MEANS [DR2]: “seed according to flesh requires seed out of man\'s body, not register” -- ANSWER [CR3]: “The status-row states the status; the record\'s own book of that status is Matthew 1:1-16 ... whose entry for the birth is Matthew 1:16; and the record\'s own flesh-‘of’ is Romans 9:5 ... the fathers, Israel.” -- FAILS: “the record\'s own book of that status” does not show how the cited flesh-and-seed meaning agrees with no biological father -- CARRIED BY: “which was made of the seed of David according to the flesh” -- GROUND: [L1] Romans 1:3';
const W02='The answer reads "according to the flesh" as line/status, saying "the record\'s own flesh-\'of\' is Romans 9:5 ... the fathers, Israel," which carries a meaning the defender link can agree with.';
const W03='The answer says "the record\'s own book of that status is Matthew 1:1-16 ... whose entry for the birth is Matthew 1:16," a rival reading with its own layers that the link can agree with.';
const x=(fl,id)=>({id,rule:'E-COL',seat:'luna',item:'COLLISION D6 vs C6',flagged_line:fl,grade:'LINK BROKEN'});const v=w=>({v:'DISAGREE',right:'STANDS',why:w});
const cases=[
['A1 row 41802 as written (no CARRIED BY)',x(FL41802),W02,'HELD'],
['A2 row 41803 as written (no CARRIED BY)',x(FL41803),W03,'HELD'],
['A3 41802 + Romans 9:5, 7-word run (W1 7220 case)',x(FL41802),W02+' -- CARRIED BY: Romans 9:5 "of whom as concerning the flesh Christ"','SENT'],
['A4 same, with the bracket word [came]',x(FL41802),W02+' -- CARRIED BY: Romans 9:5 "of whom as concerning the flesh Christ [came]"','SENT'],
['A5 same, curly quotes',x(FL41802),W02+' -- CARRIED BY: Romans 9:5 “of whom as concerning the flesh Christ”','SENT'],
['A6 Matthew 1:24, exactly 6 words (order row)',x(FL41802),W02+' -- CARRIED BY: [L3] Matthew 1:24 "and took unto him his wife"','SENT'],
['A7 5 words only',x(FL41802),W02+' -- CARRIED BY: Matthew 1:24 "took unto him his wife"','HELD'],
['A8 [L2] G3880 at Matthew 1:24',x(FL41802),W02+' -- CARRIED BY: [L2] paralambano (G3880) at Matthew 1:24','SENT'],
['A9 [L2] wrong number at Matthew 1:24',x(FL41802),W02+' -- CARRIED BY: [L2] paralambano (G2193) at Matthew 1:24','HELD'],
['A10 words not in the verse',x(FL41802),W02+' -- CARRIED BY: Romans 9:5 "of whom as concerning the register of Christ"','HELD'],
['A11 reference the answering round does not cite',x(FL41802),W02+' -- CARRIED BY: Matthew 1:25 "And knew her not till she had brought forth"','HELD'],
['A12 stitched quote + valid CARRIED BY',x(FL41802),'The answer says "the record\'s own book of that status is Romans 9:5 the fathers" which can agree. -- CARRIED BY: Romans 9:5 "of whom as concerning the flesh Christ"','HELD'],
['A13 absence ground (exempt)',x(FL41802),'The line rests on an absence: no verse states the manner.','NOT IN SCOPE'],
['A13b a rival reading that names footing in passing (in scope)',x(FL41802),'The answer reads "according to the flesh" as status, footed by its own layers, which can agree.','HELD'],
['A13c the witness ledger ground (exempt)',x(FL41802),'THE WITNESS LEDGER shows the witness NAMED IN AN ANSWER in [CR3].','NOT IN SCOPE'],
['A14 quotes-no-answer-words ground (exempt)',x(FL41802),'No answer\'s own words are quoted; "terminates the line" is the judge\'s own reading.','NOT IN SCOPE'],
['A15 CARRIED BY only inside a quoted FORCED line',x(FL41803),'The line "-- CARRIED BY: Romans 9:5 \\"of whom as concerning the flesh Christ\\" --" reads it.','HELD'],
];
let fails=0;const out=[];
for(const [n,xx,w,want] of cases){const g=ECW.gate(xx,v(w),{R,rows:CV,words:OWX});const got=!g.applies?'NOT IN SCOPE':g.send?'SENT':'HELD';if(got!==want)fails++;out.push((got===want?'OK  ':'FAIL')+' '+n+': '+got+' -- '+(g.why||g.note||''));}
OWX=[];{const g=ECW.gate(x(FL41802),v(W02+' -- CARRIED BY: [L2] paralambano (G3880) at Matthew 1:24'),{R,rows:CV,words:[]});const ok=g.send&&/NOT CHECKED/.test(g.note);if(!ok)fails++;out.push((ok?'OK  ':'FAIL')+' A16 [L2] with original_words not read this run: '+(g.send?'SENT':'HELD')+' -- '+(g.note||g.why));}
OWX=OW;
// B: apply() on rows, then the send-back item, the judge text and the cure
const rows=[{rule:'E-COL',item:'COLLISION D6 vs C6',cure_reason:'ENFORCER DISAGREE (right: STANDS): '+W02+' (judge wrote LINK BROKEN; '+ECW.label('E-COL')+', ruling 428)'},{rule:'E-COL',item:'COLLISION D6 vs C6',cure_reason:'ENFORCER DISAGREE (right: STANDS): '+(W02+' -- CARRIED BY: Romans 9:5 "of whom as concerning the flesh Christ"')+' (judge wrote LINK BROKEN; '+ECW.label('E-COL')+', ruling 428)'}];out.push('L labels: E-COL: '+ECW.label('E-COL')+' || E-B7: '+ECW.label('E-B7')+' || E-HOLD: '+ECW.label('E-HOLD')+' || E-SYN: '+ECW.label('E-SYN'));if(/record-only/i.test(ECW.label('E-B7')+ECW.label('E-HOLD')+ECW.label('E-COL')))fails++;
const ids=[{...x(FL41802),id:'H1.1'},{...x(FL41802),id:'H1.2'}];const V={'H1.1':v(W02),'H1.2':v(W02+' -- CARRIED BY: Romans 9:5 "of whom as concerning the flesh Christ"')};
const st=ECW.apply(rows,ids,V,R);out.push('B1 apply: '+JSON.stringify(st));out.push('B1 row 1: '+rows[0].cure_reason.slice(0,220));out.push('B1 row 2: '+rows[1].cure_reason.slice(-330));
const sentNow=r=>/^ENFORCER (?:DISAGREE|NO ANSWER)\b/.test(r.cure_reason);if(sentNow(rows[0])||!sentNow(rows[1]))fails++;out.push('B2 send filter: row 1 '+(sentNow(rows[0])?'SENT':'not sent')+', row 2 '+(sentNow(rows[1])?'SENT':'not sent'));
const e=ECW.item(rows[1]);out.push('B3 item: '+JSON.stringify(e));if(!e||!/of whom as concerning/.test(e.text))fails++;
out.push('B4 judge text: '+ECW.show(e));
// C: the cure, with the rebuilt enf428Cure from Send Back Record
const src=T.rb(U.L,U.M['Send Back Record']);const S=T.load(src,$);if(typeof S.enf428Cure!=='function'||!S.ECW)throw new Error('load');
const RR={CR3,DR2};const it={rule:'E-COL',item:'COLLISION D6 vs C6',line:FL41802,reason:'x',ecl:null,ecw:e};
const C=[['C1 third KEEP (W2 7224 form)','Romans 9:5 "of whom as concerning the flesh Christ" states no register and no status; the pressed meaning is "seed according to flesh requires seed out of man\'s body, not register", and the row does not carry the rival reading.','CURED'],
['C2 third KEEP missing the meaning quote','Romans 9:5 "of whom as concerning the flesh Christ" states no register.','UNCURED'],
['C3 third KEEP quoting only the row (the row words as the meaning too)','"of whom as concerning the flesh Christ came who is over all" does not carry status.','UNCURED'],
['C4 regression: pkgECF2 KEEP (answer 6 + verse 6)','The answer "The status-row states the status; the record\'s books carry it" cannot agree with "which was made of the seed of David according to the flesh".','CURED'],
['C5 regression: CHANGE TO UNDERDETERMINED','','CURED']];
for(const [n,w,want] of C){const a=n.startsWith('C5')?{ans:'CHANGE',to:'D6 vs C6 (Romans 1:3): UNDERDETERMINED -- x',why:''}:{ans:'KEEP',why:w};const r=S.enf428Cure(it,a,RR,null);if(r.status!==want)fails++;out.push((r.status===want?'OK  ':'FAIL')+' '+n+': '+r.status+' -- '+r.why);}
{const r=S.enf428Cure({...it,ecw:null},{ans:'KEEP',why:C[0][1]},RR,null);out.push('C6 same third KEEP with no row shown (live today): '+r.status+' -- '+r.why);}
out.push('FAILS: '+fails);fs.writeFileSync('replay345.txt',out.join('\n')+'\n');console.log(out.join('\n'));
{const g=ECW.gate({rule:'E-HOLD',seat:'luna',item:'COLLISION D3 vs C2',flagged_line:'D3 vs C2 (Matthew 1:16): STANDS -- x',grade:'STANDS'},{v:'DISAGREE',right:'UNDERDETERMINED',why:'The answer leaves it open.'},{R,rows:CV,words:OW});const ok=!g.applies;console.log((ok?'OK  ':'FAIL')+' D1 E-HOLD push toward UNDERDETERMINED is not gated in ASK 345: '+(g.applies?'GATED':'NOT IN SCOPE'));fs.appendFileSync('replay345.txt',(ok?'OK  ':'FAIL')+' D1 E-HOLD push toward UNDERDETERMINED is not gated in ASK 345 (ASK 346 turns it on)\n');}
