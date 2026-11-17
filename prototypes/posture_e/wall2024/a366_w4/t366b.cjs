// ASK 366 combined tests (rev 2.7 back-reference + rev 2.8 verse-row match). Usage: node t366b.cjs. REAL = execution 38226 with the rows each node could read; PLANT = made for the test.
const fs=require('fs');
const mk=f=>new Function(fs.readFileSync(f,'utf8')+'\nreturn LAY;')();
const NEW=mk(__dirname+'/../a364/lay_module.js'),OLD=mk(__dirname+'/../a364/lay_module_r26.js');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const R=JSON.parse(fs.readFileSync(__dirname+'/rounds38226.json')),RW=JSON.parse(fs.readFileSync(__dirname+'/rows38226.json'));
const rowsFor=k=>RW[k.slice(0,2)+'B '+(k.endsWith('first')?'Build':'Extract')];
const heads=c=>c.items.filter(x=>x.kind==='STRUCTURE').map(x=>x.head);const has=(c,h)=>heads(c).some(x=>x.includes(h));
const ROW=Object.fromEntries(rowsFor('C4_kept').map(r=>[r.book+' '+r.chapter+':'+r.verse,r]));
// REAL
const d4=NEW.check(R.D4_first,rowsFor('D4_first'));
ok('W1 4: REAL D4 first answer, D6: KEPT passes (Matthew 1:18 and Luke 1:35 quoted under D1 and D3)',!has(d4,'D6: KEPT'),JSON.stringify(heads(d4)));
ok('W1 4: REAL D4 first answer, D2: KEPT passes',!has(d4,'D2: KEPT'));
const g198=R.D4_first.split('\n').find(l=>/^\[L3\] Genesis 19:8: "/.test(l));
ok('the D1 line quoting Genesis 19:8 in full is found',!!g198,g198&&g198.slice(0,80));
const noD1=R.D4_first.replace(g198+'\n','');
ok('W1 4: D2 with D1\'s quote of Genesis 19:8 removed flags (its [L4] line no longer pairs Genesis 19:8 with Luke 1:34\'s words)',has(NEW.check(noD1,rowsFor('D4_first')),'D2: KEPT'),JSON.stringify(heads(NEW.check(noD1,rowsFor('D4_first')))));
ok('control: rev 2.6 passes that same text (the defect W3 found)',!has(OLD.check(noD1),'D2: KEPT'));
for(const k of Object.keys(R)){const a=OLD.check(R[k]),b=NEW.check(R[k],rowsFor(k));const dk=x=>x.items.map(i=>i.kind+'|'+(i.head||i.line)).join('\n');
  ok('REAL '+k+(k==='D4_first'?': only D6 drops':': no change'),k==='D4_first'?(a.items.length-b.items.length===1&&!has(b,'D6')):dk(a)===dk(b),a.items.length+' -> '+b.items.length);}
// PLANTS (rows from the stored sheets)
const RS=Object.values(ROW);const P=(h,ls)=>h+'\n'+ls.join('\n')+'\n';const chk=t=>NEW.check(t,RS);
const L4='[L4] footed on the verses above, a conclusion long enough to read as a point for the plant. [L4]';
const M118='[L1] Matthew 1:18: "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost." [L1]';
const L134='[L3] Luke 1:34: "Then said Mary unto the angel, How shall this be, seeing I know not a man?" [L3]';
ok('PLANT: two verses quoted in their own words pass',!has(chk(P('**D5: KEPT**',[M118,L134,L4])),'D5'));
ok('PLANT: a reference given another verse\'s words does not count (Luke 1:34 with Matthew 1:18\'s words)',has(chk(P('**D5: KEPT**',[M118,'[L3] Luke 1:34: "before they came together, she was found with child" [L3]',L4])),'D5'));
ok('PLANT W1 2a: words in order with gaps do not count ("Mary unto How shall")',has(chk(P('**D5: KEPT**',[M118,'[L3] Luke 1:34: "said Mary unto How shall be" [L3]',L4])),'D5'));
ok('PLANT W1 2c: a one-word fragment credits nothing ("know")',has(chk(P('**D5: KEPT**',[M118,'[L3] Luke 1:34: "knowing ... know" [L3]',L4])),'D5'));
ok('PLANT: fragments either side of "..." each matched',!has(chk(P('**D5: KEPT**',[M118,'[L3] Luke 1:34: "Then said Mary unto the angel ... seeing I know not a man" [L3]',L4])),'D5'));
ok('PLANT W1 2b: an italic bracket in the row is dropped, its word kept ("do ye to them as is good")',!has(chk(P('**D5: KEPT**',[M118,'[L3] Genesis 19:8: "do ye to them as is good in your eyes" [L3]',L4])),'D5'));
ok('PLANT W2 2a: a 1611 margin note is not the verse ("his name shall be called" from Matthew 1:23\'s margin)',has(chk(P('**D5: KEPT**',[M118,'[L3] Matthew 1:23: "his name shall be called" [L3]',L4])),'D5'));
ok('PLANT W2 2a control: Matthew 1:23\'s own words count',!has(chk(P('**D5: KEPT**',[M118,'[L3] Matthew 1:23: "they shall call his name Emmanuel" [L3]',L4])),'D5'));
const EX=[{book:'Exodus',chapter:2,verse:8,text:"And Pharaoh's daughter said to her, Go. And the maid went and called the child's mother."}];
ok('PLANT W2 2b: a curly apostrophe matches the row\'s straight one',!has(NEW.check(P('**D5: KEPT**',[M118,'[L3] Exodus 2:8: "called the child’s mother" [L3]',L4]),RS.concat(EX)),'D5'));
ok('PLANT W1 2d: a range is matched against its rows joined ("Matthew 1:22-23", words across both verses)',!has(chk(P('**D5: KEPT**',[M118,'[L3] Matthew 1:22-23: "by the prophet, saying, Behold, a virgin shall be with child" [L3]',L4])),'D5'));
ok('PLANT: a misquoted (modernised) verse does not count',has(chk(P('**D5: KEPT**',[M118,'[L3] Luke 1:34: "How can this be, since I am a virgin" [L3]',L4])),'D5'));
const NR='[L3] Hezekiah 9:9: "a verse with no row in any sheet for this plant" [L3]';
ok('PLANT fallback: a reference with no row counts as before on its own layer line',!has(chk(P('**D5: KEPT**',[M118,NR,L4])),'D5'));
ok('PLANT fallback (W3): a reference with no row is not paired inside an [L4] line',has(chk(P('**D5: KEPT**',[M118,'[L4] footed on [L1] Matthew 1:18 and [L3] Hezekiah 9:9: "a quoted phrase standing in the inference" and so on. [L4]'])),'D5'));
ok('PLANT: with no rows at all (sheet empty), the module still runs and keeps the fallback',!has(NEW.check(P('**D5: KEPT**',[M118,L134,L4]),[]),'D5'));
// rev 2.7 plants (W2 7724 2b), now with rows
const D1=P('**D1: KEPT**',[M118,'[L4] a conclusion on Matthew 1:18 long enough to read as a point for this plant. [L4]']);
const G44='[L3] Galatians 4:4: "But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law," [L3]';
const RG=RS.concat([{book:'Galatians',chapter:4,verse:4,text:'But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law,'}]);
const D6=P('**D6: KEPT**',['[L1] Matthew 1:18 quoted above [L1].',G44,L4]);
ok('PLANT 2a: "quoted above" counts when the same round quotes that exact reference',!has(NEW.check(D1+D6,RG),'D6'));
ok('PLANT 2b: "quoted above" with no earlier quote flags',has(NEW.check(D6,RG),'D6'));
ok('PLANT 2a: a range back-reference does not count',has(NEW.check(D1+D6.replace('Matthew 1:18 quoted','Matthew 1:18-25 quoted'),RG),'D6'));
const D1bad=P('**D1: KEPT**',['[L1] Matthew 1:18: "before they came together, seeing I know not a man" [L1]','[L4] a conclusion on Matthew 1:18 long enough to read as a point for this plant. [L4]']);
ok('PLANT: "quoted above" does not count when the earlier quote of that reference is a misquote',has(NEW.check(D1bad+D6,RG),'D6'));
ok('PLANT 2c: challenger side, same module',!has(NEW.check(D1.replace('D1: KEPT','C1 -- AGAINST D1')+D6.replace('D6: KEPT','C6 -- AGAINST D6'),RG),'C6')&&has(NEW.check(D6.replace('D6: KEPT','C6 -- AGAINST D6'),RG),'C6'));
// sheet(): reads the eight Verse Sheet nodes by literal name
const src=fs.readFileSync(__dirname+'/../a364/lay_module.js','utf8');
ok('sheet() names each of the eight Verse Sheet nodes in a literal $() call',['D1','C1','D2','C2','D3','C3','D4','C4'].every(s=>src.includes("$('"+s+" Verse Sheet')")));
const $=n=>({isExecuted:n==='D4 Verse Sheet',all:()=>rowsFor('D4_first').map(j=>({json:j}))});
const L2=new Function('$',src+'\nreturn LAY;')($);
ok('check() with no rows argument reads the sheets through $ (D4 first answer: D2 and D6 pass)',(()=>{const c=L2.check(R.D4_first);return !has(c,'D6')&&!has(c,'D2');})());
const $x=n=>{throw new Error('no node');};const L3=new Function('$',src+'\nreturn LAY;')($x);
ok('a $ that throws leaves the check running on the fallback',L3.check(R.D4_first).applies===true);
console.log((fails?'FAILED ':'PASSED ')+(n-fails)+'/'+n);process.exit(fails?1:0);
