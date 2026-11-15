const fs=require('fs');process.chdir('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/r383/f3');
const w=JSON.parse(fs.readFileSync('target_F3.json'));const code=(w.nodes||w.workflow.nodes).find(x=>x.name==='Anticheat Record').parameters.jsCode;
const F0=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/r383/f2/F37203.json');
function run(F,items,reply){const $=n=>({first:()=>({json:n==='Final Output'?F:{}}),all:()=>n==='Anticheat Build'?[{json:{items,model:'x'}}]:[],isExecuted:n==='Final Output'});const $input={all:()=>[{json:{choices:[{message:{content:reply}}]}}]};return new Function('$','$input',code)($,$input)[0].json.acx;}
const E='His course is to put her away as one who did not know the child to be his.';
// find the defender close field name
const ck=Object.keys(F0).filter(k=>/close|cr4|dr4|cl/i.test(k));console.log('close-ish keys',ck);
function withClose(txt){const F=JSON.parse(JSON.stringify(F0));for(const k of ck)if(typeof F[k]==='string'&&F[k].includes('The verse carries no words about espoused wives'))F[k]=F[k]+'\n'+txt;return F;}
const cases=[
['line ref other book before quote, under Matt heading','ANSWER: Matthew 1:19\n- As Mark 7:8 shows, the shame of the public example is the governing reason here.','the shame of the public example is the governing reason here'],
['same chapter other verse heading','ANSWER: Matthew 1:20\n- The angel names the fear and the taking of the wife as the question here.','the taking of the wife as the question here'],
['lowercase non-ref "in 1:19" wording','ANSWER: Matthew 1:19\n- Read as in 1:19 alone the putting away is the tradition at work.','the putting away is the tradition at work'],
['ref after quote only, Matt heading','ANSWER: Matthew 1:19\n- The putting away rests on the broken custom, as Matthew 1:19 says.','The putting away rests on the broken custom'],
];
for(const [nm,add,q] of cases){const F=withClose(add);const a=run(F,[{id:'X1',side:'D',key:'mat 1:19',verse:'Matthew 1:19'}],'ANTICHEAT: X1 -- REVERSED -- CLOSE: "'+q+'" -- EARLIER: "'+E+'"');const r=a.rows[0];console.log(nm,'| quotes_ok',r.quotes_ok,'note',r.note,'shown',r.shown);}
