// ASK 277 part (a): answer-check round label wording in Panel Build and Build Independent Verdict
const fs=require('fs');const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const OLD='-- [<round>] -- MEANS';
const NEW='-- [<the round that holds the quoted ANSWER; with ANSWER: NONE, the answering side\\\'s round for that press>] -- MEANS';
for(const nm of ['Panel Build','Build Independent Verdict']){const n=W.nodes.find(x=>x.name===nm);const c=n.parameters.jsCode;
 if(c.split(OLD).length!==2)throw new Error(nm+' anchor count '+(c.split(OLD).length-1));
 n.parameters.jsCode=c.replace(OLD,NEW);console.log(nm,c.length,'->',n.parameters.jsCode.length);}
fs.writeFileSync(fout,JSON.stringify(W));
