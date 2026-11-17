// ASK 359 tests. Usage: node t359.cjs <target> <base> <j1000_1214.json> <cv.json>. REAL = stored judgments; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require(process.env.LIBCJS||'../a336/inputs/tools/lib.cjs');let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d!==undefined&&d!==''?' :: '+d:''));};
const tw=JSON.parse(fs.readFileSync(process.argv[2])),bw=JSON.parse(fs.readFileSync(process.argv[3]));const tu=unpack(tw),bu=unpack(bw);const J=JSON.parse(fs.readFileSync(process.argv[4]));const CV=JSON.parse(fs.readFileSync(process.argv[5]));
const A1="MEETS: the answer\\'s layers carry a meaning the link can agree with.";const S1=" An answer whose fit rests on a fact that the quoted 1611 rows, read together line upon line (Isaiah 28:10), do not give does not meet the press. One verse read alone does not give a contested fact. Grade it MISSES and name the fact. Quoting the rows that together give the fact, each step in a row\\'s own words, meets it.";
const A2="That is how these debates are built and how they are judged.";const S2=" An answer whose fit rests on a fact that the quoted rows, read together, do not give does not meet the press: one verse read alone does not give a contested fact, and I grade such an answer MISSES and name the fact.";
const dl=tu.L.map((l,i)=>l!==bu.L[i]?i:-1).filter(i=>i>=0);ok('library lines changed: 1922, 1933, 2966, 3274; line count equal',tu.L.length===bu.L.length&&dl.join()==='1922,1933,2966,3274',dl.join());
ok('library header and tail equal',tu.hdr===bu.hdr&&tu.tail===bu.tail);
const BN={};for(const x of bw.nodes)BN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(BN[x.name])).map(x=>x.name).sort();
const WN=['Accept Build','Accept Check','Accept DS Return Build','Accept Final','Accept Return Build','Build Independent Verdict','Enforcer Build','Panel Build','Reserve Build','Shared Library'];ok('nodes changed: Shared Library, the 8 Commitment 8 nodes, Build Independent Verdict',dn.join()===WN.join(),dn.join(', '));
const T8=c=>{const i=c.indexOf('### Commitment 8.');const j=c.indexOf(A2,i);return c.slice(0,j)+A2+S2+c.slice(j+A2.length);};
for(const nm of WN.filter(x=>x!=='Shared Library')){const a=BN[nm],b=tw.nodes.find(x=>x.name===nm);let exp=a.parameters.jsCode;if(nm!=='Build Independent Verdict')exp=T8(exp);if(nm==='Panel Build'||nm==='Build Independent Verdict')exp=exp.replace(A1,A1+S1);const ka=JSON.parse(JSON.stringify(a)),kb=JSON.parse(JSON.stringify(b));delete ka.parameters.jsCode;delete kb.parameters.jsCode;ok(nm+': only the stated sentence(s) added; all else equal',JSON.stringify(ka)===JSON.stringify(kb)&&exp===b.parameters.jsCode);}
ok('connections, node order and settings equal',JSON.stringify(tw.connections)===JSON.stringify(bw.connections)&&tw.nodes.map(x=>x.name).join()===bw.nodes.map(x=>x.name).join()&&JSON.stringify(tw.settings)===JSON.stringify(bw.settings));
const cnt=(s,x)=>s.split(x).length-1;const tn=JSON.stringify(tw.nodes);ok('S1 in 2 nodes (judges\' ANSWER CHECK form); S2 in 10 copies (Commitment 8: 8 nodes and 2 library lines)',cnt(tw.nodes.map(x=>x.parameters.jsCode||'').join('\n'),S1)===2&&cnt(tw.nodes.map(x=>x.parameters.jsCode||'').join('\n'),S2)===10&&tw.nodes.filter(x=>x.name!=='Shared Library'&&(x.parameters.jsCode||'').includes(S2)).length===8&&tu.L.filter(l=>l.includes(S2)).length===2);
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',!bad.length,Object.keys(tu.M).length+' entries');
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(bu.L,bu.M[k])).sort();console.log('   changed MAP entries ('+ch.length+'): '+ch.join(', '));
const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry',!syn.length,syn.join('; '));
for(const nm of WN.filter(x=>x!=='Shared Library')){try{new Function('$','$input','return (async()=>{\n'+tw.nodes.find(x=>x.name===nm).parameters.jsCode+'\n})();');ok('syntax '+nm,true);}catch(e){ok('syntax '+nm,false,e.message);}}
const P2=w=>{const c=w.nodes.find(x=>x.name==='Accept Build').parameters.jsCode;const m=c.match(/const PART2=("(?:[^"\\]|\\.)*");/);const s=JSON.parse(m[1]);return {len:s.length,heads:[...s.matchAll(/^### (Commitment \d+\. [^\n]+)$/gm)].length};};const pb=P2(bw),pt=P2(tw);console.log('   PART2 length: base '+pb.len+', target '+pt.len+' (+'+(pt.len-pb.len)+'); headings '+pb.heads+' and '+pt.heads);ok('heading count unchanged',pb.heads===pt.heads);
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});const T=load(rb(tu.L,tu.M['Gate Record']),$);ok('loader gives ans359 and lyr2024 in target Gate Record',typeof T.ans359==='function'&&typeof T.lyr2024==='function');
const body=(seat,raw)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw}});const recs=s=>String(JSON.parse(s).payload.verdict_raw).split('\n').filter(l=>l.startsWith('[AUDIT v60:'));const run=(seat,raw,cv)=>{const o=T.ans359([body(seat,raw)],cv||CV);return o?recs(o[0]):[];};
// REPLAY over 1000-1214
const ALL=[];for(const j of J){const r=run(j.seat,j.raw);r.forEach(x=>ALL.push({id:j.id,seat:j.seat,run:j.run,x}));}
console.log('   REPLAY judgments '+J[0].id+'-'+J[J.length-1].id+' ('+J.length+'): '+ALL.length+' record lines in '+new Set(ALL.map(a=>a.id)).size+' judgments');
for(const a of ALL)console.log('      '+a.id+' '+a.seat+' '+(a.run||'')+' :: '+a.x.replace(/^\[AUDIT v60: ASSUMED FACT UNDER MEETS \(ASK 359, TRIAL\) -- SEAT: \w+; LINE: /,'').replace(/; record-only.*$/,''));
const ids=new Set(ALL.map(a=>a.id));ok('REPLAY: the 8 judgments of plan rev 2 item 3 are all recorded (1111, 1177, 1208, 1209, 1210, 1212, 1213; 1069 is the negated case)',[1111,1177,1208,1209,1210,1212,1213].every(i=>ids.has(i)),[...ids].join(','));
ok('REPLAY: 1069 "contested, not unexhibited" is not recorded (negation guard)',!ALL.some(a=>a.id===1069));
ok('REPLAY: the 1210 premise 6 false hit is listed (W1 7593)',ALL.some(a=>a.id===1210&&/Hebrews 7:14/.test(a.x)),ALL.filter(a=>a.id===1210).length+' line(s) for 1210');
// PLANTS
const AS='CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED (ASSUMES: "Mary is of the house of David").';
const AC=(why)=>'ANSWER CHECK: Romans 1:3 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MEETS -- '+why;
const P=[
 ['PLANT: a MEETS reason naming an unexhibited fact is recorded OPEN',AS+'\n'+AC('the fit rests on Mary\'s lineage, which is unexhibited.'),1,/STATUS: OPEN/],
 ['PLANT: negated, "not unexhibited", is not recorded',AS+'\n'+AC('the point is contested, not unexhibited.'),0],
 ['PLANT: the word inside a quotation is not read',AS+'\n'+AC('"the unexhibited fact" is the other side\'s phrase; the answer fits.'),0],
 ['PLANT: a MISSES line is not read',AS+'\n'+'ANSWER CHECK: Romans 1:3 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- the route is unexhibited.',0],
 ['PLANT: bare "lineage" is not read (W1 C1)',AS+'\n'+AC('the answer gives Mary\'s lineage and Joseph\'s legal house as its explanation.'),0],
 ['PLANT: negated through a verb, "does not rest on an unexhibited fact", is not recorded',AS+'\n'+AC('the answer does not rest on an unexhibited fact.'),0],
 ['PLANT: negated, "is not an assumed fact", is not recorded',AS+'\n'+AC('the descent is not an assumed fact here.'),0],
 ['PLANT: the ASSUMES clause ends at " -- " (the ROWS GIVE field is not read as terms)','CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED (STEP: x -- ASSUMES: Mary herself is of that house and lineage -- ROWS GIVE: Luke 1:27 says virgin espoused)\n'+AC('unexhibited fact.'),1,/TERMS: mary;/],
 ['PLANT: "assumed ancestry" (W2) is read',AS+'\n'+AC('this does not cure the independently assumed ancestry counted under premise 5.'),1],
 ['PLANT D3 (W1): Luke 1:27 alone does not cure',AS+'\n'+AC('the fit rests on an unexhibited fact; Luke 1:27 "of the house of David; and the virgin\'s name [was] Mary" is quoted.'),1,/STATUS: OPEN/],
 ['PLANT E5 (W2): Luke 1:27 joined to Romans 1:3 only by "David" does not cure (padding row)',AS+'\n'+AC('unexhibited fact; Luke 1:27 "of the house of David; and the virgin\'s name [was] Mary" with Romans 1:3 "made of the seed of David according to the flesh".'),1,/STATUS: OPEN/],
 ['PLANT: a misquoted row does not cure',AS+'\n'+AC('unexhibited fact; Luke 1:27 "Mary of the house of David" and Luke 3:31 "which was the son of David".'),1,/STATUS: OPEN/],
 ['PLANT: two rows, each holding a term the other lacks, joined by a name (Joseph), cure (structure only; W1 D1: necessary, not sufficient)',AS+'\n'+AC('unexhibited fact; Matthew 1:16 "Joseph the husband of Mary" and Matthew 1:20 "Joseph, thou son of David".'),1,/STATUS: CURED BY ROWS/],
 ['PLANT: a third row whose term another row already holds is padding, so no cure (W2 E5)',AS+'\n'+AC('unexhibited fact; Luke 1:27 "the virgin\'s name [was] Mary" with Matthew 1:16 "Joseph the husband of Mary" and Matthew 1:20 "Joseph, thou son of David".'),1,/STATUS: OPEN/],
 ['PLANT: two verified rows that share no name or term do not join, so no cure (brackets are read as plain words, W2 E4)',AS+'\n'+AC('unexhibited fact; Matthew 1:16 "Joseph the husband of Mary" and Luke 3:31 "which was the son of David".'),1,/STATUS: OPEN/],
 ['PLANT: the pressed verse alone, quoted twice, does not cure',AS+'\n'+AC('unexhibited fact; Romans 1:3 "made of the seed of David" and Romans 1:3 "according to the flesh".'),1,/STATUS: OPEN/],
 ['PLANT: clause end at "Rom. 1:3" (W2 E2): the clause runs past the abbreviation','CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED (ASSUMES: Mary is of David per Rom. 1:3 by Judah; END)\n'+AC('unexhibited fact.'),1,/TERMS: mary judah|TERMS: mary david/],
 ['PLANT: an UNPROVEN press is marked on the record line',AS+'\n'+AC('the ledger marks this press UNPROVEN, and the maternal endpoint remains unexhibited.'),1,/PRESS: marked UNPROVEN/],
];
for(const [t,raw,k,re] of P){const r=run('x',raw);ok(t,r.length===k&&(!re||re.test(r[0]||'')),r.length+(r[0]?' :: '+r[0].replace(/^\[AUDIT v60: [^;]*; SEAT: x; LINE: /,'').slice(0,260):''));}
{const o=T.ans359([body('x',AS+'\n'+AC('unexhibited fact.')+'\n[AUDIT v60: earlier]')]);ok('PLANT: a body already holding AUDIT v60 is left as it is',o===null);}
{const a=body('x',AS+'\n'+AC('unexhibited fact.'));const o=T.ans359([a],CV);const pa=JSON.parse(a).payload,po=JSON.parse(o[0]).payload;ok('record only: every payload field but verdict_raw unchanged; verdict_raw only grows',Object.keys(po).every(k=>k==='verdict_raw'||JSON.stringify(po[k])===JSON.stringify(pa[k]))&&po.verdict_raw.startsWith(pa.verdict_raw));}
// row 43241 MUST AGREE (W2 C2): luna graded Acts 2:30 MISSES for an asserted descent without a supporting row; under S1 and S2 that MISSES stands; the reader does not touch a MISSES line
ok('MUST AGREE row 43241 shape: a MISSES for "asserts Mary\'s Davidic descent without a supporting row" raises no record (the rule agrees with MISSES)',run('luna',AS+'\nANSWER CHECK: Acts 2:30 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- the answer asserts Mary\'s Davidic descent without a supporting row').length===0);
console.log('   STOP list ('+T.ANS359_STOP.length+'): '+T.ANS359_STOP.join(' '));console.log('   VAR pairs: '+JSON.stringify(T.ANS359_VAR));
console.log((f?f+' FAIL of ':'')+n+' checks'+(f?'':', ALL OK'));
