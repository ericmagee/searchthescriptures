// Falsifiers for the pre-check (P2D revision 3, BB-8270/8272). Loads precheck.js as written.
const fs=require('fs');const src=fs.readFileSync(__dirname+'/precheck.js','utf8');
const api=new Function(src+';return {preCheckSide,preCheckBlock};')();
const rd=f=>fs.readFileSync(__dirname+'/fixtures/'+f,'utf8');
// opponent text for the test = exactly the quoted strings SQL found verbatim in the opponent's rounds 1-2 (query in this commit's row)
const Gfound=['The grammar assigns the birth to the mother alone. That is a deliberate signal, not an accident.','The question presupposes that the conception will not come from a man.',"Joseph's reason for mercy and privacy is that he knew the child was not his.",'made of a woman','her seed','Scripture assigns the human origin to the woman and the preparation of the body to God, not to a human father.',"Mary's flesh then carries the line, which Luke 1:42 and Romans 1:3 fit.",'This is a divine and unique origin. It is not a human paternity of seed, so the denial of a biological father stands.'];
const Cfound=['before they came together','Joseph knew Mary his wife within the espousal','The verse marks covenant origin','came together','Matthew sets what "came together" by what follows','by what follows','Matthew sets what','it is the line of the men, not a metaphor for the mother','Galatians 4:4 "made of a woman" is the mortality idiom','Galatians 4:4','is the mortality idiom','A curse the apostles never cite cannot carry the keystone.'];
let fail=0;const ok=(c,msg)=>{console.log((c?'PASS ':'FAIL ')+msg);if(!c)fail++;};
const r={cr1:Gfound.join('\n'),cr2:'',gr1:Cfound.join('\n'),gr2:rd('r29609_gr2l.txt'),cr3:rd('r29609_cr3l.txt')};
const b=api.preCheckBlock(r);console.log(b);
const lines=b.split('\n').slice(1);
ok(lines.filter(l=>l.startsWith('CHALLENGER LIST [DR2] item')).length===6,'F-a 29609 [DR2]: 6 entries = PREMISE COUNT 6');
ok(lines.filter(l=>l.startsWith('DEFENDER LIST [CR3] item')).length===6,'F-a 29609 [CR3]: 6 entries');
ok(!/no verbatim quote found/.test(b),'F-b 29609: every item found its quote');
const c1=lines.find(l=>l.startsWith('DEFENDER LIST [CR3] item 1:'));
ok(c1&&/timing/.test(c1)&&/union/.test(c1)&&/birth/.test(c1)&&!/\bjoseph\b/.test(c1),'F-c 29609 [CR3] item 1 lists charge words absent from "Joseph knew Mary his wife within the espousal" (timing, union, birth) and not a word of the quote');
const g6=lines.find(l=>l.startsWith('CHALLENGER LIST [DR2] item 6:'));ok(g6&&/ALONE/.test(g6),'F-d universal in capitals: [DR2] item 6 charge "rests on Luke 1:35 alone" lists ALONE');
// no-heading cases (8271 counter 2)
const n1=api.preCheckBlock({cr1:'',cr2:'',gr1:'',gr2:'CHALLENGER ROUND 2 with no list heading at all',cr3:rd('r27177_cr3.txt')});console.log(n1);
ok(/CHALLENGER LIST \[DR2\]: no premise list found/.test(n1)&&/DEFENDER LIST \[CR3\]: no premise list found/.test(n1),'F-e no heading either side -> single line per side, block present (27177 [CR3] real text)');
const n2=api.preCheckBlock({});ok(/^PRE-CHECK -- decides nothing/.test(n2)&&n2.split('\n').length===3,'F-f all rounds missing -> block still present, one line per side, no throw');
// a quote not found verbatim is never chosen
const n3=api.preCheckSide('UNSUPPORTED-L4 PREMISES\n1. That X. Quote: "words nobody said anywhere"',['other text'],'S');ok(n3[0]==='S item 1: no verbatim quote found','F-g unfound quote -> "no verbatim quote found"');
// 8275 F1 and F2, on A3's rows30.json (git f312008, md5 656577ee): the 30 newest COLLISION POINTS rows, [DR2] and [CR3] lists
const rows=JSON.parse(fs.readFileSync(__dirname+'/a3data/rows30.json','utf8'));let mism=0,nh=0,sides=0;
for(const r of rows)for(const [k,side] of [['gr2','D'],['cr3','C']]){sides++;const s=String(r[k]||'');const out=api.preCheckSide(s,[],side);
 if(!/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i.test(s)){if(out.length===1&&/no premise list found/.test(out[0]))nh++;else mism++;continue;}
 const pc=(s.match(/PREMISE COUNT\s*:\s*\**\s*(\d+)/i)||[])[1];const n=out.filter(l=>/ item \d+:/.test(l)).length;
 if(n===0||(pc!==undefined&&+pc!==n)){mism++;console.log('  mismatch',r.t,k,'items',n,'PREMISE COUNT',pc);}}
ok(mism===0&&nh===2&&sides===60,'F-h 30 rows: every side with a heading gives one entry per item (= PREMISE COUNT where stated); the 2 no-heading sides give the single line ('+sides+' sides, '+mism+' mismatches, '+nh+' no-heading)');
const r19=rows.find(x=>x.t.includes('29519'));ok(api.preCheckSide(r19.gr2,[],'D').filter(l=>/ item \d+:/.test(l)).length===6,'F-i 8275 F1: 29519 [DR2] gives 6 = PREMISE COUNT 6 (its "LINK none:" item taken)');
const r14=rows.find(x=>x.t.includes('28514')).cr3;const qs14=(r14.match(/[\u201C"][^\u201D"]{8,}[\u201D"]/g)||[]).map(s=>s.slice(1,-1));
const o14=api.preCheckSide(r14,qs14,'C');console.log(o14.slice(0,2).join('\n'));
ok(/item 1: absent from its quote: (?!none$).+/.test(o14[0])&&/item 2: absent from its quote: (?!none$).+/.test(o14[1])&&/props|objection|footing/.test(o14[0]+o14[1]),'F-j 8275 F2: 28514 [CR3] items 1-2 list their after-quote charge words (A3 stand-in opponent text)');
// 8277 F3: the marker strip runs: no 29609 [DR2] entry lists a marker word (its items carry "LINK n:" and "Defender's words:")
const dr2=lines.filter(l=>l.startsWith('CHALLENGER LIST [DR2] item'));
ok(dr2.length===6&&dr2.every(l=>!/\b(?:link|defender|challenger|words|quote)\b/i.test(l.split(': absent from its quote: ')[1]||'x link'))&&/item 1: absent from its quote: step, passive, verb/.test(dr2[0]),'F-k 8277 F3: 29609 [DR2] entries list no marker word; item 1 reads "step, passive, verb ..."');
console.log(fail?('FAILED '+fail):'ALL PASS');process.exit(fail?1:0);
