const fs=require('fs');let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m)}else{fail++;console.log('FAIL',m)}};
const af=JSON.parse(fs.readFileSync('af_fixture.json','utf8'));
const st={'Accept Final':[af]};const $=n=>({isExecuted:n in st,first:()=>({json:st[n][0]}),all:()=>st[n].map(j=>({json:j}))});
// Plain Rule Lines
const prl=fs.readFileSync('new/Plain Rule Lines.js','utf8');
const x={md:'# Debate\nCLAUSE: HELD-1 -- n=5 w=0 k=0\n\n## What the judges were sent\nRULEBOOK'};
const o=new Function('$','$input',prl)($,{first:()=>({json:x})})[0].json;
ok(/## The judges' agreement/.test(o.md)&&o.md.indexOf("## The judges' agreement")<o.md.indexOf('## What the judges were sent'),'transcript prints the agreement before what the judges were sent');
ok(/### chatgpt \(openai\/gpt-6.1-terra\): FAULT_RECORDED -- not seated/.test(o.md)&&/### mimo .*REFUSE -- not seated/.test(o.md)&&/### gemini .*ACCEPT\n/.test(o.md),'each judge listed with its status');
ok(/Returned once \(heading 6 missing\)/.test(o.md),'the return and its fault are printed');
// EIV drvPromptText skips the posture exchange
const eiv=fs.readFileSync('new/Extract Independent Verdict.js','utf8');const i=eiv.indexOf('function drvPromptText(');let d=0,k=eiv.indexOf('{',i);for(;k<eiv.length;k++){if(eiv[k]==='{')d++;else if(eiv[k]==='}'){d--;if(!d)break;}}
const dpt=new Function(eiv.slice(i,k+1)+';return drvPromptText;')();
const body={messages:[{role:'system',content:'SYS RULES'},{role:'user',content:'POSTURE FOR ACCEPTANCE\n\nCommitment [L4] text'},{role:'assistant',content:'Commitment 1 ... I ACCEPT'},{role:'user',content:'[CR1]\nDEBATE TEXT'}]};
const t=dpt(body);ok(/SYS RULES/.test(t)&&/DEBATE TEXT/.test(t)&&!/POSTURE FOR ACCEPTANCE/.test(t)&&!/I ACCEPT/.test(t),'single judge checker reads the debate, not the posture exchange');
const eivb=fs.readFileSync('base/Extract Independent Verdict.js','utf8');const ib=eivb.indexOf('function drvPromptText(');d=0;k=eivb.indexOf('{',ib);for(;k<eivb.length;k++){if(eivb[k]==='{')d++;else if(eivb[k]==='}'){d--;if(!d)break;}}
const dptb=new Function(eivb.slice(ib,k+1)+';return drvPromptText;')();ok(dptb({messages:[body.messages[0],body.messages[3]]})===t,'with no posture exchange the text is the same as the live checker reads');
// BIV and Panel Build rulebook text
for(const n of ['Build Independent Verdict','Panel Build']){const c=fs.readFileSync('new/'+n+'.js','utf8');ok(!/its own words state the contrary/.test(c)&&/the verse stands, and the link is the error/.test(c),n+': sentence (B) gone, the approved meaning rule in its place');}
const pb=fs.readFileSync('new/Panel Build.js','utf8');ok(!/SYS=SYS\+NL\+NL\+POSTURE\.ANSWER/.test(pb),'Panel Build: no v4 answer form');
const ig=fs.readFileSync('new/Init with Guards.js','utf8');ok(/const dsys=build\('DEFENDER',S\.defender,S\.dpos\)\+PROVE;const csys=build\('CHALLENGER',S\.challenger,S\.cpos\)\+PROVE;/.test(ig)&&/Prove every position with the layers\. A statement of your position is not proof of it\./.test(ig),'both debaters get the approved prove-it text');
console.log(pass,'pass',fail,'fail');
