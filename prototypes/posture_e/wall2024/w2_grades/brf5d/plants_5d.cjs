// W2 item 5d plants on live s119 C4P (recorded before running; expectations in comments)
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const W=g('/mnt/project-files/wall2024/fetchback_live_s119.json');
const c=W.nodes.find(x=>x.name==='C4 Build').parameters.jsCode;const k=c.indexOf('const REFP=');const e=c.indexOf('})();',c.indexOf('const C4P='))+5;
const [REFP,C4P]=new Function(c.slice(k,e)+'\nreturn [REFP,C4P];')();
const BK=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','Matthew','Mark','Luke','John','Acts','Romans','Galatians','Ephesians','Philippians','Colossians','Hebrews','James'];
const L=s=>(s.match(/\[CLOSE-ROUND BOOK CHECK.*?read the sentence for its book\.\]/)||['(none)'])[0];
const T=[
 // Q1 limit 1: 20 earlier books name 1:1; close writes "So 1:1". Expect one line listing 20 verses (length grows ~14 chars per verse).
 ['Q1 twenty books',{gr1:BK.map(b=>b+' 1:1 is cited.').join(' '),gr2:'',dr3:'',dr4:'Deuteronomy 20:7 stands (G43). So 1:1 settles it.'}],
 // Q2 limit 1: three bare refs each matching 10 books.
 ['Q2 three bare refs x10',{gr1:BK.slice(0,10).map(b=>b+' 1:1, 1:2 and 1:3 apply.').join(' '),gr2:'',dr3:'',dr4:'Luke 2:1 stands. So 1:1 holds. Then 1:2 holds. Thus 1:3 holds.'}],
 // Q3 limit 2: earlier round's own bare ref borrows a book within one sentence ("Deuteronomy 20:7; then 1:18"). Close "So 1:18" under Matthew-free text. Expect "Deuteronomy 1:18 named earlier" although no round names it under that book.
 ['Q3 borrowed earlier',{gr1:'Deuteronomy 20:7 governs the espousal, and 1:18 dates it.',gr2:'',dr3:'',dr4:'Luke 2:1 stands. So 1:18 dates the finding.'}],
 // Q4 control: earlier round names Matthew 1:18 with its own book. Expect "Matthew 1:18 named earlier".
 ['Q4 control own book',{gr1:'Matthew 1:18 dates it.',gr2:'',dr3:'',dr4:'Luke 2:1 stands. So 1:18 dates the finding.'}],
];
for(const [n,F] of T){const s=L(C4P.note(F));console.log(n,'| len',s==='(none)'?0:s.length,'|',s);}
// full notes and parse for Q1, Q2
for(const i of [0,1]){const F=T[i][1];console.log('\n'+T[i][0],'FULL NOTE:',JSON.stringify(C4P.note(F)));console.log(' parse dr4:',JSON.stringify(REFP.parse(F.dr4,{scoped:true}).map(r=>[r.label,r.book,r.ctx,r.head,r.pos>r.at])));}
// Q5 (added after Q1-Q4 ran, recorded before running): a truly new bare verse in a later sentence. Expect NEW PRESS or a book line; a silent drop is a FAIL.
for(const [n,F] of [['Q5 new bare verse, third sentence',{gr1:'Matthew 1:18 dates it.',gr2:'',dr3:'',dr4:'Luke 2:1 stands. So 1:18 dates the finding. Then 5:9 closes it.'}],
 ['Q6 new bare verse, second sentence',{gr1:'Matthew 1:18 dates it.',gr2:'',dr3:'',dr4:'Luke 2:1 stands. Then 5:9 closes it.'}],
 ['Q7 new bare verse, first sentence, no book before',{gr1:'Matthew 1:18 dates it.',gr2:'',dr3:'',dr4:'Then 5:9 closes it. Luke 2:1 stands.'}]]){
 console.log('\n'+n,JSON.stringify(C4P.note(F)));console.log(' parse:',JSON.stringify(REFP.parse(F.dr4,{scoped:true}).map(r=>[r.label,r.book,r.ctx])));}
