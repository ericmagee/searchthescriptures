// unit plants for cecBlk (taken from the built Close Enforcer Record text)
const fs=require('fs');const c=fs.readFileSync(__dirname+'/Close_Enforcer_Record.js','utf8');
const g=n=>c.match(new RegExp('const '+n+'=.*?;(?=const |\\n)','s'))[0];
const cecN=eval('('+g('cecN').replace(/^const cecN=/,'').replace(/;$/,'')+')');const cecBlk=eval('('+c.match(/const cecBlk=(.*?); \/\* pkgCLK/s)[1]+')');
const S='They knew the order of the visit well enough.';
const T=[
 ['P1 defender ## D2: heading','DEFENDER','# CLOSE ROUND\n## D1: KEPT\nother words here now.\n## D2: Mary was a virgin\n'+S,2],
 ['P2 ### D3 (against C1 and C6) - NARROWED','DEFENDER','### D3 (against C1 and C6) - NARROWED\n'+S,3],
 ['P3 ## ANSWERS (C1 against D1 and D2): two links','DEFENDER','## ANSWERS (C1 against D1 and D2)\n'+S,null],
 ['P4 ## D3 and D4 together','DEFENDER','## D3 and D4 together (against C1)\n'+S,null],
 ['P5 under the round title only','DEFENDER','# CLOSE ROUND: DEFENDER\n'+S+'\n## D1: KEPT',null],
 ['P6 quotation not in the round','DEFENDER','## D2: KEPT\nsomething else entirely here.',null],
 ['P7 challenger ### C2: SUPPORTED','CHALLENGER','# ROUND 4\n### C2: SUPPORTED. The line\n'+S,2],
 ['P8 challenger heading names D2 only (other side)','CHALLENGER','## Against D2\n'+S,null],
 ['P9 ## Summary after D blocks','DEFENDER','## D5: KEPT\nx y z w.\n## Summary of the chain\n'+S,null],
 ['P10 **bold** heading ## **D4: KEPT**','DEFENDER','## **D4: KEPT**\n'+S,4],
 ['P11 LINK 3 heading','DEFENDER','### LINK 3: kept\n'+S,3],
 ['P12 ## Answers on D2 (token not at start)','DEFENDER','## Answers on D2\n'+S,null],
];let ok=0;for(const [l,sd,raw,want] of T){const got=cecBlk(sd,S,raw);const p=got===want;ok+=p;console.log((p?'OK   ':'FAIL ')+l+' -> '+got+' (want '+want+')');}console.log(ok+'/'+T.length);
