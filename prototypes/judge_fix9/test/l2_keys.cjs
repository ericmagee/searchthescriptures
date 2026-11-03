// The verse keys and Strong's numbers the [L2] fixture must read from the database (runs 32302, 32306): written to data/l2_keys.json.
const fs=require('fs');const {loadLib,run,rounds,roundsArr,D}=require('./lib9.cjs');
const {L2C}=loadLib(['l2.js'],['L2C']);
const out={verses:[],tags:0,claims:[]};const V=new Set();
for(const n of process.argv.slice(2).length?process.argv.slice(2):['32302','32306']){const TG=L2C.tags(roundsArr(rounds(run(n))));out.tags+=TG.length;TG.forEach(t=>t.verses.forEach(k=>V.add(k)));
 const CL=L2C.countClaims(roundsArr(rounds(run(n))));CL.forEach(c=>out.claims.push({run:n,...c}));
 console.log(n,'tags',TG.length,'no-word',TG.filter(t=>!t.words.length).length,'no-verse',TG.filter(t=>!t.verses.length).length,'claims',CL.length);}
out.verses=[...V].sort();console.log('verses',out.verses.length);
fs.writeFileSync(D+'data/l2_keys.json',JSON.stringify(out,null,1));
for(const c of out.claims)console.log('claim',c.run,c.round,c.said,'|',c.subj||(c.word&&c.word.w),'|',c.text);
