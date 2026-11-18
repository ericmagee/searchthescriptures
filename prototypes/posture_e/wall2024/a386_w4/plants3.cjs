// ASK 386 rev 3 plants (W1 8481 item 3, 8485 item 1, 8486 item 6): an empty collision list gives no tie, in rd386, at 1336 and at 1491.
const fs=require('fs');const T=require('../tools/lib.cjs');const ld=f=>{let d=JSON.parse(fs.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;return d;};
const t2=ld(__dirname+'/t386_rev2.json'),t3=ld(__dirname+'/t386.json');const E2=require('./ert_eval.cjs')(__dirname+'/t386_rev2.json'),E3=require('./ert_eval.cjs')(__dirname+'/t386.json');
const eq={dst:'PROP-DEPENDENT',cst:'PROP-DEPENDENT',cd:1,cc:1};const out={};
for(const [k,i] of [['BROKEN, equal fields, no collision lines',{verdict:'BROKEN',...eq,col:[]}],['HELD challenge PROP-DEPENDENT, equal fields, no collision lines',{verdict:'HELD',...eq,col:[]}],['BROKEN, equal fields, one collision STANDS (the proper tie)',{verdict:'BROKEN',...eq,col:[{link:'D1 vs C1',grade:'STANDS'}]}]])
 out['rd386: '+k]={rev2:E2.rd386(i).word,rev3:E3.rd386(i).word};
const tie=d=>eval('('+T.unpack(d).L[1336].match(/const __tie421=(\([^;]+);/)[1]+')');
out['1336: empty collision list, equal fields, DEFENDER WINS']={rev2:tie(t2)([],'PROP-DEPENDENT','PROP-DEPENDENT',1,1,'DEFENDER WINS'),rev3:tie(t3)([],'PROP-DEPENDENT','PROP-DEPENDENT',1,1,'DEFENDER WINS')};
out['1336: one collision STANDS, equal fields, DEFENDER WINS']={rev2:tie(t2)([{link:'D1 vs C1',grade:'STANDS'}],'PROP-DEPENDENT','PROP-DEPENDENT',1,1,'DEFENDER WINS'),rev3:tie(t3)([{link:'D1 vs C1',grade:'STANDS'}],'PROP-DEPENDENT','PROP-DEPENDENT',1,1,'DEFENDER WINS')};
const t1491=d=>{const l=T.unpack(d).L[1491];const e=l.match(/const tie=([^;]+);/)[1];return (unk,col,dst,cst,c)=>eval(e);};
out['1491: empty collision list, equal fields']={rev2:t1491(t2)([],[],'PROP-DEPENDENT','PROP-DEPENDENT',{DEFENDER:1,CHALLENGER:1}),rev3:t1491(t3)([],[],'PROP-DEPENDENT','PROP-DEPENDENT',{DEFENDER:1,CHALLENGER:1})};
out['1491: one collision STANDS, equal fields']={rev2:t1491(t2)([],[{link:'D1 vs C1',grade:'STANDS'}],'PROP-DEPENDENT','PROP-DEPENDENT',{DEFENDER:1,CHALLENGER:1}),rev3:t1491(t3)([],[{link:'D1 vs C1',grade:'STANDS'}],'PROP-DEPENDENT','PROP-DEPENDENT',{DEFENDER:1,CHALLENGER:1})};
out.line1336_rev3=T.unpack(t3).L[1336];out.line1491_rev3=T.unpack(t3).L[1491];
fs.writeFileSync(__dirname+'/plants3_out.json',JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));
