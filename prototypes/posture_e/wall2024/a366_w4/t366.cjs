// ASK 366 tests. Usage: node t366.cjs. REAL = stored round of execution 38226; PLANT = made for the test.
const fs=require('fs');
const mk=f=>new Function(fs.readFileSync(f,'utf8')+'\nreturn LAY;')();
const NEW=mk(__dirname+'/lay_module.js'),OLD=mk(__dirname+'/lay_module_r26.js');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const R=JSON.parse(fs.readFileSync(__dirname+'/rounds38226.json'));
const heads=c=>c.items.filter(x=>x.kind==='STRUCTURE').map(x=>x.head);
// REAL
const o4=OLD.check(R.D4_first),n4=NEW.check(R.D4_first);
ok('REAL D4 first answer: rev 2.6 flags D6: KEPT',heads(o4).some(h=>/D6: KEPT/.test(h)),JSON.stringify(heads(o4)));
ok('REAL D4 first answer: ASK 366 passes D6: KEPT (Matthew 1:18 and Luke 1:35 quoted under D1 and D3)',!heads(n4).some(h=>/D6: KEPT/.test(h)),JSON.stringify(heads(n4)));
for(const k of Object.keys(R)){const a=OLD.check(R[k]),b=NEW.check(R[k]);const dk=x=>x.items.map(i=>i.kind+'|'+(i.head||i.line)).join('\n');
  if(k==='D4_first')ok('REAL '+k+': only change is D6 dropped',a.items.length-b.items.length===1&&a.items.filter(i=>!/D6: KEPT/.test(i.head||'')).length===b.items.length,a.items.length+' -> '+b.items.length);
  else ok('REAL '+k+': no change',dk(a)===dk(b),a.items.length+' -> '+b.items.length);}
// PLANTS
const Q1='[L1] Matthew 1:18: "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost." [L1]';
const Q2='[L1] Luke 1:35: "And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God." [L1]';
const G44='[L3] Galatians 4:4: "But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law," [L3]';
const L4='[L4] footed on [L1] Matthew 1:18, Luke 1:35 and [L3] Galatians 4:4: Christ was generated of the Holy Ghost and made of a woman without the seed of an earthly man. [L4]';
const P=(head,lines)=>head+'\n'+lines.join('\n')+'\n';
const D1=P('**D1: KEPT**',[Q1,'[L4] the conception is before any coming together, on [L1] Matthew 1:18 alone for this test of the earlier block. [L4]']);
const D3=P('**D3: KEPT**',[Q2,'[L4] the power of the Highest is the cause named, on [L1] Luke 1:35 alone for this test of the earlier block. [L4]']);
const D6a=P('**D6: KEPT**',['[L1] Matthew 1:18 quoted above [L1].','[L1] Luke 1:35 quoted above [L1].',G44,L4]);
const fl=(t,h)=>heads(NEW.check(t)).some(x=>x.includes(h));
ok('PLANT 2a: both back-references quoted earlier in the same round: D6 passes',!fl(D1+D3+D6a,'D6: KEPT'));
ok('PLANT 2b: "quoted above" with no earlier quote still flags',fl(D6a,'D6: KEPT'),JSON.stringify(heads(NEW.check(D6a))));
ok('PLANT 2b: one back-reference unquoted (Luke 1:35 missing): D6 passes only if two verses stand; here Matthew 1:18 + Galatians 4:4 = 2 with [L1]',!fl(D1+D6a,'D6: KEPT'));
const D6b=P('**D6: KEPT**',['[L1] Luke 1:35 quoted above [L1].',G44,L4]);
ok('PLANT 2b: the only [L1] is a back-reference with no earlier quote: flags',fl(D1+D6b,'D6: KEPT'));
const N19=P('**D1: KEPT**',['[L1] Matthew 1:19: "Then Joseph her husband, being a just man, and not willing to make her a publick example, was minded to put her away privily." [L1]','[L4] x on Matthew 1:19 only for this plant, long enough to read as a point. [L4]']);
ok('PLANT 2a: a neighbouring verse quoted earlier does not count (Matthew 1:19 quoted, 1:18 back-referenced; Galatians 4:4 alone is [L3], so D6 flags)',fl(N19+P('**D6: KEPT**',['[L1] Matthew 1:18 quoted above [L1].',G44,L4]),'D6: KEPT'));
ok('PLANT 2a control: the same block with Matthew 1:18 quoted earlier passes',!fl(D1+P('**D6: KEPT**',['[L1] Matthew 1:18 quoted above [L1].',G44,L4]),'D6: KEPT'));
ok('PLANT 2a: a range back-reference does not count (Matthew 1:18-25 quoted above; 1:18 is quoted earlier)',fl(D1+P('**D6: KEPT**',['[L1] Matthew 1:18-25 quoted above [L1].',G44,L4]),'D6: KEPT'));
ok('PLANT 2a: a list back-reference does not count (Matthew 1:18, 20 quoted above)',fl(D1+P('**D6: KEPT**',['[L1] Matthew 1:18, 20 quoted above [L1].',G44,L4]),'D6: KEPT'));
const other=D1+D3; // other side's round, read alone: its quotes are not in this round
ok('PLANT 2b: a quote in the other side\'s round does not count (the check reads one round only)',fl(D6a,'D6: KEPT')&&!fl(other+D6a,'D6: KEPT'));
ok('PLANT 2c: challenger side, same module: C6 back-references pass when quoted earlier',!fl(D1.replace('D1','C1')+D3.replace('D3','C3')+D6a.replace('D6: KEPT','C6 -- AGAINST D6'),'C6'));
ok('PLANT 2c: challenger side, no earlier quote: flags',fl(D6a.replace('D6: KEPT','C6 -- AGAINST D6'),'C6'));
ok('PLANT: a back-reference line on [L2] does not count',fl(D1+D3+P('**D6: KEPT**',['[L2] Matthew 1:18 quoted above [L2].','[L2] Luke 1:35 quoted above [L2].',G44,L4]),'D6: KEPT'));
console.log((fails?'FAILED ':'PASSED ')+(n-fails)+'/'+n);process.exit(fails?1:0);
