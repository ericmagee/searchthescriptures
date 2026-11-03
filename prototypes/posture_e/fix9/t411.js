const fs=require('fs');
const c=fs.readFileSync('new/Panel Cure Check.js','utf8');const cut=c.indexOf("const PP=$('Panel Payloads')");
const L=new Function(c.slice(0,cut)+'\nreturn {cureVerdicts};')();
const item={rule:'K-G4',side:'CHALLENGER',link:'D5 vs C6',line:'D5 vs C6 (Jeremiah 22:30): CHALLENGER LINK BROKEN -- C6 cannot agree with the sentence -- GROUND: x'};
const forced='RESPONSE: K-G4 D5 vs C6 | The witness was answered, but the answer does not show the fit; the link is forced.\nFORCED: D5 vs C6 -- MEANS [CR3]: "no man of his seed shall prosper" -- ANSWER [DR3]: "The giver is the speaker of the sentence" -- FAILS: "The giver is the speaker of the sentence"';
const none='RESPONSE: K-G4 D5 vs C6 | I keep the grade.';
for(const [n,t] of [['FORCED line',forced],['no FORCED line',none]]){const v=L.cureVerdicts([item],{ok:true,text:t},null,{CR3:'no man of his seed shall prosper',DR3:'The giver is the speaker of the sentence'});console.log(n,'->',v[0].status,'|',v[0].why);}
