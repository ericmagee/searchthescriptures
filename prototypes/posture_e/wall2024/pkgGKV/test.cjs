// pkgGKV unit tests: the refusal code taken from the TARGET library, with a small 'Cited Verses' set. node test.cjs <target json>
const fs=require('fs');const lib=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const code=(lib.nodes||lib.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(code.slice(code.indexOf('\n/*LIB*/')+8,code.lastIndexOf('\n/*MAP*/'))).join('\n');const a=LIB.indexOf('{const __gkv=(t=>{'),b=LIB.indexOf("})(to);",a);const body=LIB.slice(a+'{const __gkv='.length,b+2);
const rows=[{book:'Haggai',chapter:2,verse:23,text:'In that day, saith the LORD of hosts, will I take thee, O Zerubbabel, my servant, the son of Shealtiel, saith the LORD, and will make thee as a signet: for I have chosen thee, saith the LORD of hosts.'},
 {book:'Jeremiah',chapter:22,verse:24,text:'[As] I live, saith the LORD, though Coniah the son of Jehoiakim king of Judah were the signet upon my right hand, yet would I pluck thee thence;'},
 {book:'Romans',chapter:1,verse:4,text:'And declared [to be] the Son of God with power, according to the spirit of holiness, by the resurrection from the dead: [declared: Gr. determined]'},
 {book:'Luke',chapter:1,verse:34,text:'Then said Mary unto the angel, How shall this be, seeing I know not a man?'},
 {book:'Luke',chapter:1,verse:35,text:'And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God.'}];
const mk=R=>new Function('$','return '+body)(n=>({all:()=>R.map(json=>({json}))}));const F=mk(rows),E=mk([]);
let ok=0,bad=0;const t=(name,f,line,want)=>{const r=!!f(line);if(r===want){ok++;console.log('OK   '+name);}else{bad++;console.log('FAIL '+name+' got '+r);}};
t('luna G1: "I will make thee as a signet" refused',F,'D6 vs C1 (Haggai 2:23): DEFENDER LINK BROKEN -- x. GROUND: [L1] Haggai 2:23 “I will make thee as a signet: for I have chosen thee” | [L3] Jeremiah 22:24 “yet would I pluck thee thence.”',true);
t('KJV wording "will make thee as a signet" passes',F,'D6 vs C1 (Haggai 2:23): DEFENDER LINK BROKEN -- x. GROUND: [L1] Haggai 2:23 “will make thee as a signet: for I have chosen thee” | [L3] Jeremiah 22:24 “yet would I pluck thee thence.”',false);
t('FORCED line: MEANS and ANSWER quotes are not read, the GROUND is',F,'FORCED: D6 vs C1 -- MEANS [DR2]: “I will make thee a king” -- ANSWER [CR3]: “anything” -- FAILS: “x” -- CARRIED BY: “y” -- GROUND: [L1] Haggai 2:23 “I will make thee as a signet”',true);
t('FORCED line with KJV ground passes',F,'FORCED: D6 vs C1 -- MEANS [DR2]: “I will make thee a king” -- ANSWER [CR3]: “anything” -- GROUND: [L1] Haggai 2:23 “and will make thee as a signet”',false);
t('ellipsis joins two runs',F,'D4 vs C1 (Romans 1:4): UNDERDETERMINED -- x. GROUND: [L1] Romans 1:4 "declared [to be] the Son of God with power... by the resurrection from the dead"',false);
t('a two-verse span split at a sentence end passes',F,'D4 vs C2 (Luke 1:34): UNDERDETERMINED -- x. GROUND: [L1] Luke 1:34-35 “How shall this be, seeing I know not a man? The Holy Ghost shall come upon thee”',false);
t('a verse not served is not checked',F,'D1 vs C1 (Isaiah 7:14): UNDERDETERMINED -- x. GROUND: [L1] Isaiah 7:14 “Behold, a maiden shall conceive”',false);
t('no Cited Verses rows: nothing is refused',E,'D6 vs C1 (Haggai 2:23): DEFENDER LINK BROKEN -- x. GROUND: [L1] Haggai 2:23 “I will make thee as a signet”',false);
t('a line that is not a collision or FORCED line is not read',F,'KEYSTONE: D6 -- BROKEN -- GROUND: [L1] Haggai 2:23 “I will make thee as a signet”',false);
t('ground prose with no quotation is not read',F,'D6 vs C2 (Luke 1:27): UNDERDETERMINED -- x. GROUND: The record leaves open the house.',false);
t('escaped quotes as stored are read',F,'D6 vs C1 (Haggai 2:23): DEFENDER LINK BROKEN -- x. GROUND: [L1] Haggai 2:23 \\"I will make thee as a signet\\"',true);
t('bulleted collision line is read',F,'- D6 vs C1 (Haggai 2:23): DEFENDER LINK BROKEN -- x. GROUND: [L1] Haggai 2:23 “I will make thee as a signet”',true);
const C=LIB.includes("why=__rct?(__rct.gkv?'pkgGKV':'pkgRCT')+' refused the gate change")&&LIB.includes("find(z=>z&&z.sid===x.gid&&z.gkv);if(__gk){cured=true;");
if(C){ok++;console.log('OK   gate cure: a gkv refusal is cured and recorded on the NOT APPLIED path and on the change path');}else{bad++;console.log('FAIL gate cure edits not found');}
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
