// ASK 654 build tests (W4). node t654b.cjs tg/target_engine_654.json tg/live_a5c3001d.json
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
for(const k of ['C same','D same','E same']){const c=PLY.check(['PRESSED WITH: Matthew 1:23'],blk(k),opp28);ok(c.items.length===1,'variant '+k.slice(0,1)+' listed as expected');}
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
console.log('TOTAL '+pass+' PASS, '+fail+' FAIL');
