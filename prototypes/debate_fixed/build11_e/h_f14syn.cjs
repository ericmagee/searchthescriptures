// F14.4-7 constructed cases (Worker_E). Mini KJV; each case is six rounds; prints the report status of the case's item, base vs new.
const fs=require('fs');const {execFileSync}=require('child_process');
const KJV=[{book:'Luke',chapter:1,verse:35,text:'And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God.'},
 {book:'Luke',chapter:1,verse:32,text:'He shall be great, and shall be called the Son of the Highest: and the Lord God shall give unto him the throne of his father David:'}];
fs.writeFileSync('/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/s11/mini.json',JSON.stringify(KJV));
const E='x';
const cases={
 'F14.4x (first form, recorded) opp words UNQUOTED, WORDS ARE AT -> left out by the older OPP rule on both':{gr1:'The angel says the Lord God shall give unto him the throne of his father David, and that is all.',cr2:'He wrote: "the Lord God shall give unto him the throne of his father David" (Luke 1:35).'},
 'F14.4 opp words QUOTED, WORDS ARE AT another verse -> reported':{gr1:'The angel says "the Lord God shall give unto him the throne of his father David" (Luke 1:32), and that is all.',cr2:'He wrote: "the Lord God shall give unto him the throne of his father David" (Luke 1:35).'},
 'F14.5 not in the other side, WORDING NOT FOUND -> reported':{gr1:'Nothing to see here at all in this round.',cr2:'Pressed: "the angel never spoke of any begetting at all here" (Luke 1:35).'},
 'F14.6a same side earlier, WORDING NOT FOUND -> reported':{cr1:'I say the angel never spoke of any begetting at all here.',gr1:'Nothing.',cr2:'As I said: "the angel never spoke of any begetting at all here" (Luke 1:35).'},
 'F14.6b other side LATER round, WORDING NOT FOUND -> reported':{gr1:'Nothing.',cr2:'Pressed: "the angel never spoke of any begetting at all here" (Luke 1:35).',gr2:'the angel never spoke of any begetting at all here'},
 'F14.7 pieces out of order -> reported':{gr1:'is a causal connective, and dio kai stands first in the verse',cr2:'Pressed: "dio kai... is a causal connective" (Luke 1:35).'},
 'F14.10 opp words, CITED VERSE DOES NOT EXIST -> left out':{gr1:'He wrote "the angel never spoke of any begetting at all here" plainly.',cr2:'Pressed: "the angel never spoke of any begetting at all here" (Luke 1:99). And "He shall be great, and shall be called the Son of the Highest" (Luke 1:32).'},
 'F14.11 opp words, MATCHES -> kept':{gr1:'The text: "The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee" (Luke 1:35).',cr2:'Pressed: "The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee" (Luke 1:35).'},
 'F14.0 pieces in order, other side earlier -> left out':{gr1:'dio kai (G1352, "wherefore") is a causal connective',cr2:'Pressed: "dio kai... is a causal connective" (Luke 1:35).'}};
for(const [name,c] of Object.entries(cases)){const R={cr1:c.cr1||E,gr1:c.gr1||E,cr2:c.cr2||E,gr2:c.gr2||E,cr3:E,dr3:E};
 const f='/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/s11/case.json';fs.writeFileSync(f,JSON.stringify(R));
 const st=d=>{const o=JSON.parse(execFileSync('node',['h_cite.cjs',d,f,'/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/s11/mini.json']).toString());return o.keys.filter(k=>k.startsWith('DEFENDER|R2')&&!/Luke 1:32\|MATCHES/.test(k)).join(',')||'(left out)';};
 console.log(name,'| base:',st('base11'),'| new:',st('new11'));}
