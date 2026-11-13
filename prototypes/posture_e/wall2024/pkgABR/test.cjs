// pkgABR rev 3 unit tests on ABS.check of parent and target "Send Back Build". node test.cjs <parent json> <target json>
const fs=require('fs');const {load}=require(__dirname+'/mods.cjs');const [,,P,T]=process.argv;
const wf=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return (W.nodes||W.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;};
const O=load(wf(P),'Send Back Build'),N=load(wf(T),'Send Back Build');
const rows=[{book:'Haggai',chapter:2,verse:23,text:'In that day, saith the LORD of hosts, will I take thee, O Zerubbabel, my servant, the son of Shealtiel, saith the LORD, and will make thee as a signet: for I have chosen thee, saith the LORD of hosts.'},
 {book:'Jeremiah',chapter:22,verse:30,text:'Thus saith the LORD, Write ye this man childless, a man [that] shall not prosper in his days: for no man of his seed shall prosper, sitting upon the throne of David, and ruling any more in Judah.'},
 {book:'Romans',chapter:1,verse:3,text:'Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;'},
 {book:'Luke',chapter:1,verse:27,text:'To a virgin espoused to a man whose name was Joseph, of the house of David; and the virgin\'s name was Mary.'},
 {book:'Luke',chapter:3,verse:31,text:'Which was [the son] of Melea, which was [the son] of Menan, which was [the son] of Mattatha, which was [the son] of Nathan, which was [the son] of David,'},
 {book:'Matthew',chapter:1,verse:1,text:'The book of the generation of Jesus Christ, the son of David, the son of Abraham.'},
 {book:'1 John',chapter:5,verse:1,text:'Whosoever believeth that Jesus is the Christ is born of God: and every one that loveth him that begat loveth him also that is begotten of him.'}];
const ctx={rows,ow:[],lex:[]};const L=(v,ans,why)=>({rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: '+v+' -- [CR3] -- MEANS: "the press" -- ANSWER: "'+ans+'" -- MEETS -- '+(why||'the answer distinguishes them.')});
let ok=0,bad=0;const t=(name,id,old,nw)=>{const a=O.ABS.check(id,ctx).raise,b=N.ABS.check(id,ctx).raise;if(a===old&&b===nw){ok++;console.log('OK   '+name);}else{bad++;console.log('FAIL '+name+' old '+a+' new '+b);}};
const PT='- Haggai 2:23 "will make thee as a signet: for I have chosen thee", with Jeremiah 22:24 "yet would I pluck thee thence". The words state a signet and "my servant". They do not state a sitting "upon the throne of David, and ruling". Those are the words of Jeremiah 22:30, so the signet does not undo the bar.\n- Next bullet.';
const tp=(name,id,pt,old,nw)=>{const a=O.ABS.check(id,ctx).raise,b=N.ABS.check(id,{...ctx,pt}).raise;if(a===old&&b===nw){ok++;console.log('OK   '+name);}else{bad++;console.log('FAIL '+name+' old '+a+' new '+b);}};
const LUNA=L('Haggai 2:23',"The words state a signet and 'my servant'. They do not state a sitting 'upon the throne of David, and ruling'");
tp('luna 35380: the answer\'s own line in the round names Jeremiah 22:30: clears',LUNA,PT,true,false);
t('luna 35380 with no transcript: still raises (the line names no verse)',LUNA,true,true);
tp('luna 35380, transcript line that names no verse: still raises',LUNA,PT.replace('Those are the words of Jeremiah 22:30, so','So'),true,true);
t('answer names Jeremiah 22:30 itself: clears',L('Haggai 2:23',"Haggai 2:23 says nothing of 'sitting upon the throne'. Jeremiah 22:30 bars the seat."),true,false);
t('W2 5989: the reason names Jeremiah 22:30 only to dismiss it: still raises',L('Haggai 2:23',"The verse does not state 'upon the throne of David, and ruling'.","the answer meets it; Jeremiah 22:30 is not in play."),true,true);
t('W4 ABR1: words of Luke 3:31 not named: still raises',L('Luke 1:27','The verse does not state \'the son of David\' of the child.'),true,true);
t('W4 ABR2: 3 common words not named: still raises',L('Luke 1:27','It does not say \'of the house\' here.'),true,true);
t('named verse that does not hold the words: still raises',L('Luke 1:27','It does not state \'the son of David\'; see Romans 1:3.'),true,true);
t('the MEANS naming the verse does not count: still raises',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Luke 1:27 -- [CR3] -- MEANS: "Luke 3:31 makes him the son of David" -- ANSWER: "The verse does not state \'the son of David\' of the child." -- MEETS -- addressed.'},true,true);
t('quote of 2 words still raises',L('Romans 1:3',"Romans 1:3 says 'made of the seed of David'. It does not say 'begotten of'."),true,true);
t('quoted words that are in the checked verse still raise',L('Haggai 2:23',"It does not state 'make thee as a signet' as a throne."),true,true);
t('quoted words in no served verse still raise',L('Haggai 2:23',"It does not state 'a crown of pure gold upon his head'."),true,true);
t('absence with no quotation still raises',L('Haggai 2:23',"The verse does not state a throne for him."),true,true);
t('quotation after the sentence ends does not count',L('Haggai 2:23',"The verse does not state a throne. Jeremiah 22:30 says 'upon the throne of David, and ruling'."),true,true);
t('quotation more than 60 characters after the phrase does not count',L('Haggai 2:23',"It does not state, in any of its many words about the servant and the chosen one, 'upon the throne of David, and ruling'"),true,true);
t('no absence phrase: no raise on either',L('Haggai 2:23',"The signet is 'will make thee as a signet'."),false,false);
t('MISSES is not read on either',{...L('Haggai 2:23',"They do not state 'upon the throne of David, and ruling'"),grade:'MISSES'},false,false);
t('line with no ANSWER CHECK verse still raises',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: -- [CR3] -- MEANS: "x" -- ANSWER: "They do not state \'upon the throne of David, and ruling\'" -- MEETS -- y'},true,true);
t('checked verse not served still raises',L('Isaiah 7:16',"They do not state 'upon the throne of David, and ruling'"),true,true);
// the transcript builder at the call site, taken from the target library text
{const W=JSON.parse(fs.readFileSync(T,'utf8'));const c=(W.nodes||W.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;
 const LIB=JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/'))).join('\n');const a=LIB.indexOf('pt:(()=>{'),b=LIB.indexOf('})()});if(!__c.raise)',a);const body=LIB.slice(a+3,b+4);
 const f=(PB,x)=>new Function('PB','ABS','__x','return '+body)(PB,{},x);
 const PB={judges:[{seat:'luna',body:{messages:[{content:'SYS'},{content:[{text:'ROUND A'},{text:'ROUND B'}]}]}},{seat:'sol',body:{messages:[{content:'S2'}]}}]};
 const cases=[['own seat transcript',f(PB,{seat:'luna'}),'SYS\nROUND A\nROUND B'],['unknown seat: first judge with messages',f(PB,{seat:'x'}),'SYS\nROUND A\nROUND B'],['no PB: empty',f(null,{seat:'luna'}),''],['judge with no messages: empty',f({judges:[{seat:'a'}]},{seat:'a'}),'']];
 for(const [n,g,w] of cases){if(g===w){ok++;console.log('OK   transcript builder: '+n);}else{bad++;console.log('FAIL transcript builder: '+n+' got '+JSON.stringify(g));}}
 console.log('\n'+ok+' OK, '+bad+' FAIL (with the transcript builder)');process.exit(bad?1:0);}
