// pkgABR unit tests on ABS.check of parent and target "Send Back Build". node test.cjs <parent json> <target json>
const fs=require('fs');const {load}=require(__dirname+'/mods.cjs');const [,,P,T]=process.argv;
const wf=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return (W.nodes||W.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;};
const O=load(wf(P),'Send Back Build'),N=load(wf(T),'Send Back Build');
const rows=[{book:'Haggai',chapter:2,verse:23,text:'In that day, saith the LORD of hosts, will I take thee, O Zerubbabel, my servant, the son of Shealtiel, saith the LORD, and will make thee as a signet: for I have chosen thee, saith the LORD of hosts.'},
 {book:'Jeremiah',chapter:22,verse:30,text:'Thus saith the LORD, Write ye this man childless, a man [that] shall not prosper in his days: for no man of his seed shall prosper, sitting upon the throne of David, and ruling any more in Judah.'},
 {book:'Romans',chapter:1,verse:3,text:'Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;'},
 {book:'1 John',chapter:5,verse:1,text:'Whosoever believeth that Jesus is the Christ is born of God: and every one that loveth him that begat loveth him also that is begotten of him.'}];
const ctx={rows,ow:[],lex:[]};const L=(v,ans,why)=>({rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: '+v+' -- [CR3] -- MEANS: "the press" -- ANSWER: "'+ans+'" -- MEETS -- '+(why||'the answer distinguishes them.')});
let ok=0,bad=0;const t=(name,id,old,nw)=>{const a=O.ABS.check(id,ctx).raise,b=N.ABS.check(id,ctx).raise;if(a===old&&b===nw){ok++;console.log('OK   '+name);}else{bad++;console.log('FAIL '+name+' old '+a+' new '+b);}};
t('luna 35380: reading-in of Jeremiah 22:30 words clears',L('Haggai 2:23',"The words state a signet and 'my servant'. They do not state a sitting 'upon the throne of David, and ruling'"),true,false);
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
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
