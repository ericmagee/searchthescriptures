// W1: line-level reads of the pkgRLF Close Enforcer Record line regex (taken from the write file) and its cecRL.
const fs=require('fs');let d=JSON.parse(fs.readFileSync(__dirname+'/../parent_s106_RLF.json'));d=d.data||d;d=d.workflow||d;const c=d.nodes.find(x=>x.name==='Close Enforcer Record').parameters.jsCode;
const LN=eval(c.match(/const LN=(\/.*?\/i);/)[1]);const cecRL=eval('('+c.match(/const cecRL=(\(s,P\)=>\{.*?\});/)[1]+')');
const mk=(side,e,cl)=>'CLOSE-CONTRADICTION: NEW -- '+side+' -- LINK 2 -- CONFIRMED -- EARLIER '+e+' "one two three four" -- CLOSING '+cl+' "five six seven eight" -- why';
const rd=(side,e,cl)=>{const m=mk(side,e,cl).match(LN);if(!m)return 'UNREADABLE';const P=side==='DEFENDER'?'CR':'DR';return cecRL(m[5],P)+'/'+cecRL(m[7],P);};
const cases=[['H1','DEFENDER','[ CR3 ]','[ round 4 ]','CR3/CR4'],['H2','DEFENDER','[CR3]','(round 4)','UNREADABLE'],['H3','DEFENDER','[CR3]','ROUND 4','CR3/CR4'],['H4','DEFENDER','[CR3]','[round 04]','UNREADABLE'],['H5','CHALLENGER','[Round 2]','[round 4]','DR2/DR4'],['H6','DEFENDER','[DR2]','[CR4]','DR2/CR4']];
let ok=0;for(const [id,s,e,cl,want] of cases){const got=rd(s,e,cl);const p=got===want;if(p)ok++;console.log((p?'OK   ':'FAIL ')+id+' '+s+' '+e+' / '+cl+' -> '+got+' (expect '+want+')');}
console.log(ok+' of '+cases.length+' as labeled');
