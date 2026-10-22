// F14 harness (Worker_E): runs a Citation Scan file on the stored rounds of a run; prints the items that matter.
const fs=require('fs');const [,, codeFile, roundsFile]=process.argv;
const R=JSON.parse(fs.readFileSync(roundsFile,'utf8'));
const F={cr1:R.cr1,gr1:R.gr1,cr2:R.cr2,gr2:R.gr2,cr3:R.cr3,dr3:R.dr3};
const $=n=>({isExecuted:false,first:()=>({json:n==='Final Output'?F:{}})});
const code=fs.readFileSync(codeFile,'utf8');
const out=new Function('$',code)($)[0].json;
const pick=out.items.filter(i=>i.round==='R3'&&i.side==='DEFENDER'&&/causal connective|supplied word/i.test(i.quote)||i.round==='R1'&&i.side==='DEFENDER'&&/call his name JESUS/i.test(i.quote)&&i.ref==='Matthew 1:25');
console.log(JSON.stringify({scanned:out.scanned,n_items:out.items.length,opp_true:out.items.filter(i=>i.opp_words).length,cite_false:out.items.filter(i=>i.cite_form===false).length,
 picked:pick.map(i=>({ref:i.ref,round:i.round,quote:i.quote,cite_form:i.cite_form,opp_words:i.opp_words,load_bearing:i.load_bearing,link:i.link}))},null,1));
