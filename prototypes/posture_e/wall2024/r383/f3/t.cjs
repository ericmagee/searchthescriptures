const fs=require('fs');const TF=process.env.TF||'target_F3.json';
const w=JSON.parse(fs.readFileSync(TF,'utf8'));const ns=w.nodes||w.workflow.nodes;
const code=ns.find(x=>x.name==='Anticheat Record').parameters.jsCode;
const F=require('../f2/F37203.json');
function run(items,reply){const $=n=>({first:()=>({json:n==='Final Output'?F:n==='Debate Start'?{}:{}}),all:()=>n==='Anticheat Build'?[{json:{items,model:'x'}}]:[],isExecuted:n==='Final Output'});
 const $input={all:()=>[{json:{choices:[{message:{content:reply}}]}}]};return new Function('$','$input',code)($,$input)[0].json.acx;}
let pass=0,tot=0;const ok=(name,c)=>{tot++;if(c)pass++;console.log((c?'PASS ':'FAIL ')+name);};
// 1: the 37203 false pair (close quote under Mark 7:8 answer, keyed Matt 1:19)
let a=run([{id:'X1',side:'D',key:'mat 1:19',verse:'Matthew 1:19'}],'ANTICHEAT: X1 -- REVERSED -- CLOSE: "The verse carries no words about espoused wives." -- EARLIER: "The title \\"her husband\\" belongs to the espousal."'.replace(/\\"/g,'"'));
ok('37203 false pair hidden (OTHER VERSE)',a.rows[0].quotes_ok&&a.rows[0].note==='OTHER VERSE'&&!a.reversed.D.length);
// 2: same verse both quotes: close quote in Matt 1:19 answer block
a=run([{id:'X1',side:'D',key:'mat 1:19',verse:'Matthew 1:19'}],'ANTICHEAT: X1 -- REVERSED -- CLOSE: "The verse sets two things: a public example is what he refuses" -- EARLIER: "His course is to put her away as one who did not know the child to be his."');
ok('in-verse pair still shown',a.rows[0].quotes_ok&&a.reversed.D.length===1);
// 3: quote not found unchanged
a=run([{id:'X1',side:'D',key:'mat 1:19',verse:'Matthew 1:19'}],'ANTICHEAT: X1 -- REVERSED -- CLOSE: "words that are not in the close at all" -- EARLIER: "His course is to put her away as one who did not know the child to be his."');
ok('quote not found unchanged',a.rows[0].note==='QUOTE NOT FOUND');
// 4: close quote naming the item verse in its own line under another answer head
a=run([{id:'X1',side:'D',key:'mat 1:19',verse:'Matthew 1:19'}],'ANTICHEAT: X1 -- REVERSED -- CLOSE: "The shame in Matthew 1:19 is the stated reason" -- EARLIER: "His course is to put her away as one who did not know the child to be his."');
ok('line naming the item verse kept',a.reversed.D.length===1);
console.log(pass+' of '+tot);
