// ASK 404 site 2f plants: library line 3142 (E-RES) run alone, live against t404, with the variables it reads (cla, res, cs, j) and cv recording rows.
const T=require('../tools/lib.cjs');const ld=f=>{let d=require(f);if(d.data&&d.data.nodes)d=d.data;return T.unpack(d).L[3142];};
const A=ld(__dirname+'/../rdf/fetchback_w399.json'),B=ld(__dirname+'/t404.json');
const run=(line,cla,res,cs)=>{const rows=[];const cv=(seat,l,why)=>rows.push(why);const j={seat:'s1'};new Function('cla','res','cs','j','cv',line)(cla,res,cs,j,cv);return rows;};
let ok=true;const C=[
 ['BROKEN-1, PROP-DEPENDENT, RESULT UNDERDETERMINED (follows the new prompt)','BROKEN-1','RESULT: UNDERDETERMINED -- x','CHALLENGE STANDING: PROP-DEPENDENT (c=1)',0],
 ['BROKEN-1, PROP-DEPENDENT, RESULT CHALLENGER WINS','BROKEN-1','RESULT: CHALLENGER WINS -- x','CHALLENGE STANDING: PROP-DEPENDENT (c=1)',1],
 ['BROKEN-2, COLLAPSED, RESULT UNDERDETERMINED (W2 8666)','BROKEN-2','RESULT: UNDERDETERMINED -- x','CHALLENGE STANDING: COLLAPSED (c=2)',0],
 ['BROKEN-2, COLLAPSED, RESULT CHALLENGER WINS','BROKEN-2','RESULT: CHALLENGER WINS -- x','CHALLENGE STANDING: COLLAPSED (c=2)',1],
 ['BROKEN-1, SELF-SUPPORTED, RESULT CHALLENGER WINS','BROKEN-1','RESULT: CHALLENGER WINS -- x','CHALLENGE STANDING: SELF-SUPPORTED (c=0)',0],
 ['BROKEN-1, SELF-SUPPORTED, RESULT UNDERDETERMINED','BROKEN-1','RESULT: UNDERDETERMINED -- x','CHALLENGE STANDING: SELF-SUPPORTED (c=0)',1],
 ['BROKEN-1, no CHALLENGE STANDING line (W2 8666)','BROKEN-1','RESULT: UNDERDETERMINED -- x','',0],
 ['BROKEN-1, unread CHALLENGE STANDING value','BROKEN-1','RESULT: UNDERDETERMINED -- x','CHALLENGE STANDING: UNCLEAR',0],
 ['HELD-1, PROP-DEPENDENT, RESULT DEFENDER WINS','HELD-1','RESULT: DEFENDER WINS -- x','CHALLENGE STANDING: PROP-DEPENDENT (c=1)',0],
 ['PARTIAL-1, RESULT UNDERDETERMINED','PARTIAL-1','RESULT: UNDERDETERMINED -- x','CHALLENGE STANDING: SELF-SUPPORTED (c=0)',0]];
for(const [nm,cla,res,cs,want] of C){const a=run(A,cla,res,cs),b=run(B,cla,res,cs);const pass=b.length===want;if(!pass)ok=false;console.log((pass?'PASS ':'FAIL ')+nm.padEnd(72),'rows: live',a.length,'| t404',b.length);if(b.length)console.log('      ',b[0]);}
console.log('RESULT:',ok?'PASS':'FAIL');
