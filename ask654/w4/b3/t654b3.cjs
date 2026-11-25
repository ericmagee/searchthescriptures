// ASK 654 build b3 tests (W4), plan rev 11 (4a17e308), from t654b2. node t654b3.cjs tg/target_engine_654b3.json ../b2/tg/live_a5c3001d.json. node t654b.cjs tg/target_engine_654.json tg/live_a5c3001d.json
const fs=require('fs');const [,,TG,LV]=process.argv;const E=JSON.parse(fs.readFileSync(TG,'utf8')),B0=JSON.parse(fs.readFileSync(LV,'utf8'));const D=__dirname+'/',W4='/mnt/project-files/ask654/w4/';
let pass=0,fail=0;const ok=(c,m)=>{(c?pass++:fail++);console.log((c?'PASS ':'FAIL ')+m);};
const nd=(w,n)=>w.nodes.find(k=>k.name===n);
// touched nodes only
const ch=E.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(nd(B0,n.name))).map(n=>n.name).sort();
ok(JSON.stringify(ch)===JSON.stringify(['D3B Build','D4 Build','D4B Build','Init with Guards','Shared Library']),'touched nodes only: '+ch.join(', '));
ok(E.nodes.length===B0.nodes.length&&JSON.stringify(E.connections)===JSON.stringify(B0.connections),'node count and connections unchanged');
// Library Check: every MAP entry rebuilds to its n
const T=nd(E,'Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const reb=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
const bad=Object.entries(M).filter(([k,v])=>v&&Array.isArray(v.p)&&reb(v.p).length!==v.n).map(([k])=>k);ok(!bad.length,'Library Check: all '+Object.keys(M).length+' MAP entries rebuild to n'+(bad.length?' BAD '+bad:''));
const T0=nd(B0,'Shared Library').parameters.jsCode;const L0=JSON.parse(T0.slice(T0.indexOf('\n/*LIB*/')+8,T0.lastIndexOf('\n/*MAP*/')));
ok(JSON.stringify(L.slice(0,L0.length))===JSON.stringify(L0),'LIB lines 0-'+(L0.length-1)+' unchanged; added '+(L.length-L0.length));
const PLY=new Function(reb(M['PRESS LAYERS'].p)+'\nreturn PLY;')();
// syntax of the touched Code nodes
for(const n of ['D3B Build','D4 Build','D4B Build','Init with Guards']){let e=null;try{new Function('$','$input',nd(E,n).parameters.jsCode);}catch(x){e=x.message;}ok(!e,n+' compiles'+(e?': '+e:''));}
// Part 1, 1b text
const s=nd(E,'Init with Guards').parameters.jsCode;const G=new Function(s.slice(s.indexOf('const GUARDHOLD='),s.indexOf('const TEXTPROOF='))+';return GUARDHOLD;')();const TP=new Function(s.slice(s.indexOf('const TEXTPROOF='),s.indexOf('const WINPANEL='))+';return TEXTPROOF;')();
const A=fs.readFileSync(D+'blockA.txt','utf8');ok(G.endsWith('\n\n'+A),'part 1: GUARDHOLD ends with block A, '+A.length+' characters');
const PL=fs.readFileSync('/mnt/project-files/ask654/w3/plan654.md','utf8');const after=PL.match(/The paragraph after the change, whole: (ONE-VERSE RESTRICTION:[^\n]*)/)[1];
ok(TP.endsWith(after),'part 1b: TEXTPROOF paragraph equals the plan\'s whole text, '+after.length+' characters');
const s0=nd(B0,'Init with Guards').parameters.jsCode;const AO="or challenges the union, answer, after the pressed verse's own layers, from the DAVIDIC seed rows";ok(G.split(AO).length===2&&!G.includes('or challenges the union, answer from the DAVIDIC'),'part 1c: the ASK 408 line carries the order clause once');
ok(s.length-s0.length===JSON.stringify('\n\n'+A).length-2+(59-116)+(84-80)+JSON.stringify(", after the pressed verse's own layers,").length-2,'Init with Guards: only block A, the two replacements and the order clause ('+(s.length-s0.length)+' source characters)');
// replays
const R=JSON.parse(fs.readFileSync(W4+'rounds42528.json','utf8'));const opp28={DR1:R.DR1,DR2:R.DR2,DR3:R.DR3};
const mt=R.CR4.split('\n').slice(129,135).join('\n');const c1=PLY.check(['PRESSED WITH: Matthew 1:23'],mt,opp28);ok(c1.items.length===1&&c1.items[0].lacks.join()==='S,O','C4: 42528 CR4 Matthew 1:23 block listed, lacks S (surrounding verse) and O (opponent words)');
const runs={'42528':{o:opp28,cr3:R.CR3,cr4:R.CR4}};for(const x of ['42517','42373']){const r=JSON.parse(fs.readFileSync(W4+'r'+x+'.json','utf8'));runs[x]={o:{DR1:r['C1B Extract'].raw,DR2:r['C2B Extract'].raw,DR3:r['C3B Extract'].raw},cr3:r['D3 Extract'].raw,cr4:r['D4 Extract'].raw};}
const exp={'42528':[15,15],'42517':[17,17],'42373':[31,31]};
for(const [k,v] of Object.entries(runs)){const a=PLY.check([v.o.DR1,v.o.DR2],v.cr3,v.o),b=PLY.check([v.o.DR1,v.o.DR2,v.o.DR3],v.cr4,v.o);const na=PLY.note(a.items).length,nb=PLY.note(b.items).length;ok(a.items.length===exp[k][0]&&b.items.length===exp[k][1],'C4 replay '+k+': CR3 '+a.items.length+'/'+a.pressed+', CR4 '+b.items.length+'/'+b.pressed+' listed; note '+na+' and '+nb+' characters');}
// C3 / C4 form blocks: the FORM block and variant B give 0 items; finder 0 hits
const IMP=new Function(fs.readFileSync(W4+'IMP_B_Build.js','utf8')+'\nreturn IMP;')();const BAR=new Function('IMP',fs.readFileSync(W4+'bar.js','utf8')+'\nreturn BAR;')(IMP);
const src=fs.readFileSync(W4+'c4form654.cjs','utf8');const blk=k=>{const i=src.indexOf("'"+k);const a=src.indexOf('`',i)+1;return src.slice(a,src.indexOf('`',a));};
for(const k of ['A form block','B same, reference after the quote']){const t=blk(k);const c=PLY.check(['PRESSED WITH: Matthew 1:23'],t,opp28),b=BAR.check('CR4',t,opp28);ok(c.items.length===0&&b.hits.length===0,'C3/C4 '+k.slice(0,1)+': check 0 items, finder 0 hits (got '+c.items.length+', '+b.hits.length+')');}
for(const k of ['C same','D same']){const c=PLY.check(['PRESSED WITH: Matthew 1:23'],blk(k),opp28);ok(c.items.length===1,'variant '+k.slice(0,1)+' listed as expected');}
{const c=PLY.check(['PRESSED WITH: Matthew 1:23'],blk('E same'),opp28);ok(c.items.length===0,'variant E (Matthew 1:25 at [L3]) now passes X: the interim rule\'s known limit, a neighbouring verse passes');}
// D4B: a verse with no ANSWER line is left to ASK 628 (no double listing)
const d4=nd(E,'D4B Build').parameters.jsCode;ok(d4.includes("i.lacks[0]==='B'&&__un.includes(i.ref)"),'D4B: verses already in the ASK 628 list are not listed twice');
// part 1d
{const d=nd(E,'D4 Build').parameters.jsCode,d0=nd(B0,'D4 Build').parameters.jsCode;const NEW=fs.readFileSync(D+'close1d.txt','utf8');
 const i=d.indexOf("==='oracle')?'");const j=d.indexOf("':'')",i);const lit=new Function("return '"+d.slice(i+14,j)+"';")();
 ok(lit===NEW,'part 1d: the Oracle-defender branch of the close message equals the refresh and the rev 9 sentence ('+NEW.length+' characters)');
 const A=fs.readFileSync(D+'blockA.txt','utf8');ok(NEW.startsWith('\n\n'+A.split('\n').slice(0,5).join('\n')+'\n'),'part 1d: the refresh is the first five lines of block A, character for character');
 ok(!d.includes('write the four layers')&&d0.includes('write the four layers'),'part 1d: the live sentence is gone');
 const r0=d0.slice(0,d0.indexOf("==='oracle')?'")),r1=d.slice(0,i);const t0=d0.slice(d0.indexOf("':'')",d0.indexOf("==='oracle')?'"))),t1=d.slice(j);ok(r0===r1&&t0===t1,'D4 Build: nothing else changed');
 const PL=fs.readFileSync('/mnt/project-files/ask654/w3/plan654.md','utf8');ok(PL.includes(A.split('\n')[5])&&A.includes('an [L3] line quotes a verse of another passage;'),'part 1 FORM line is rev 9 ("another passage")');}

// ---- b3: REFP, ranges, names and the [L3] rule (W1 Wall 12216 item 3 and 12221)
{const Eb2=JSON.parse(fs.readFileSync(D+'../b2/tg/target_engine_654b2.json','utf8'));const ch2=E.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(Eb2.nodes.find(k=>k.name===n.name))).map(n=>n.name);ok(JSON.stringify(ch2)==='["Shared Library"]','b3 against b2: only Shared Library differs ('+ch2+')');
 const S=reb(M['PRESS LAYERS'].p);ok(S.length===M['PRESS LAYERS'].n,'PRESS LAYERS rebuilds to n '+M['PRESS LAYERS'].n);
 const X=new Function(S+'\n;return {PLY,PRESSL,REFP:typeof REFP};')();ok(X.REFP==='object','REFP is defined in the rebuilt PRESS LAYERS module');
 const R2=new Function(S+'\n;return REFP;')();ok(R2.keys('Obadiah 1:10-14 "x"').length===5,'Obadiah 1:10-14 gives 5 keys');
 let thrown=false;try{new Function(reb(M['PRESS LIST'].p.concat([[3883,L.length-1]]))+'\n;return PLY;')();}catch(e){thrown=/without REFP/.test(e.message);}ok(thrown,'PLY without REFP throws by name (no silent catch)');}
const o23={DR1:'',DR2:'',DR3:'The canon stated means of conceiving is a husband knowing his wife plainly here'};
const L4="[L4] [DR3] \"The canon stated means of conceiving is a husband knowing his wife\" is my opponent's inference.";
const mk=(head,l3,l1b)=>[head,'[L1] Matthew 1:23 "Behold, a virgin shall be with child, and shall bring forth a son"',l1b||'[L1] Matthew 1:22 "Now all this was done, that it might be fulfilled"','[L2] G3933 parthenos: "a maiden".',l3,L4].join('\n');
const H='ANSWER: Matthew 1:23 -- D3 --',PW=['PRESSED WITH: Matthew 1:23 "Behold, a virgin"'];
const xs=t=>{const c=PLY.check(PW,t,o23);return c.items.length?c.items[0].lacks.join():'';};
ok(xs(mk(H,'[L3] Isaiah 7:14 "Therefore the Lord himself shall give you a sign"'))==='','known good: Matthew 1:23 with Isaiah 7:14 at [L3] passes');
ok(xs(mk(H,'[L3] Matthew 1:23 "Behold, a virgin shall be with child"'))==='X','known bad: the pressed verse at [L3] lacks X');
ok(xs(mk(H,'[L3] Matthew 1:22-24 "Now all this was done"'))==='','rev 11: a range holding R meets the mark by a verse that is neither R nor [L1] (1:24)');
ok(xs(mk(H,'[L3] Matthew 1:23-24 "Behold, a virgin"','[L1] Matthew 1:24 "Then Joseph"'))==='X','rev 11: a range of R and an [L1] verse only lacks X');
ok(xs(mk(H,'[L3] Matthew 1:22-23 "Now all this was done"'))==='X','known bad (W1): Matthew 1:22-23 at [L3] for Matthew 1:23 lacks X');
ok(xs(mk(H,'[L3] Matt 1:22 "Now all this was done"'))==='X','known bad: the [L1] verse again at [L3] under a short name lacks X');
ok(xs(mk(H,'[L3] Matthew 1:25 "And knew her not"'))==='','known limit: an adjacent verse of the chapter at [L3] passes (ASK 657 reads it)');
ok(xs(mk(H,'[L3] Isaiah 7:13-14 "Hear ye now, O house of David"'))==='','a range of another passage at [L3] passes');
ok(xs(mk('ANSWER: Matt 1:23 -- D3 --','[L3] Isaiah 7:14 "Therefore the Lord"'))==='','short book name in the ANSWER head is read as Matthew 1:23');
ok(xs(mk(H,'[L3] Isaiah 7:14 "Therefore the Lord"','[L1] Matthew 1:22-23 "Now all this was done"').replace('[L1] Matthew 1:23 "Behold, a virgin shall be with child, and shall bring forth a son"\n',''))==='','[L1] range 1:22-23 gives the verse and its neighbour (V and S)');
{const o={DR1:'',DR2:'',DR3:'The house of Esau shall be for stubble they shall kindle in them'};const t=['ANSWER: Obadiah 1:18 -- D2 --','[L1] Obadiah 1:18 "And the house of Jacob shall be a fire"','[L1] Obadiah 1:17 "But upon mount Zion shall be deliverance"','[L2] H7179 qash: "straw".','[L3] Obadiah 1:10 "For thy violence against thy brother Jacob"','[L4] [DR3] "The house of Esau shall be for stubble they shall kindle" is my opponent\'s inference.'].join('\n');
 const c=PLY.check(['PRESSED WITH: Obadiah 1:18 "And the house"'],t,o);ok(c.items.length===0,'known good: Obadiah (one chapter), another passage of the book at [L3] passes'+(c.items.length?' '+JSON.stringify(c.items):''));}
ok(PLY.LACK.X==="[L3] a verse of another passage quoted with its reference",'note item X reads "[L3] a verse of another passage quoted with its reference"');

// W1 Wall 12233, X cases (a) to (g) under rev 11
ok(xs(mk(H,'[L3] Matthew 1:23 "Behold, a virgin"'))==='X','W1 (a): [L3] R alone: listed');
ok(xs(mk(H,'[L3] Matthew 1:22-23 "Now all this was done"'))==='X','W1 (b): [L3] Matthew 1:22-23, 1:22 at [L1]: listed');
ok(xs(mk(H,'[L3] Matthew 1:22-23 "Now all this was done"','[L1] Matthew 1:21 "And she shall bring forth a son"'))==='','W1 (c): the same range, [L1] only R and 1:21: not listed');
ok(xs(mk(H,'[L3] Matt 1:22 "Now all this was done"'))==='X','W1 (d): the [L1] verse at [L3] under a short name: listed');
ok(xs(mk(H,'[L3] Matthew 1:25 "And knew her not"'))==='','W1 (e): adjacent verse not at [L1]: not listed (known limit)');
{const o={DR1:'',DR2:'',DR3:'For thy violence against thy brother Jacob shame shall cover thee'};const t=['ANSWER: Obadiah 1:10 -- D2 --','[L1] Obadiah 1:10 "For thy violence against thy brother Jacob"','[L1] Obadiah 1:11 "In the day that thou stoodest on the other side"','[L2] H2555 chamac: "violence".','[L3] Obadiah 1:15 "For the day of the LORD is near upon all the heathen"','[L4] [DR3] "For thy violence against thy brother Jacob shame shall cover" is my opponent\'s inference.'].join('\n');
 const c=PLY.check(['PRESSED WITH: Obadiah 1:10 "For thy violence"'],t,o);ok(!c.items.some(i=>i.lacks.includes('X')),'W1 (f): Obadiah 1:15 at [L3] against [L1] 1:10 and 1:11: not listed'+(c.items.length?' '+JSON.stringify(c.items):''));}
ok(xs(mk(H,'[L3] Isaiah 7:14 "Therefore the Lord himself shall give you a sign"'))==='','W1 (g): Matthew 1:23 with [L3] Isaiah 7:14: not listed');
ok(xs(mk(H,'[L3] Hezekiah 3:4 "A verse that is in no book"'))==='X','W1 F1: an unresolvable [L3] reference (Hezekiah 3:4) lacks X');
console.log('TOTAL '+pass+' PASS, '+fail+' FAIL');
