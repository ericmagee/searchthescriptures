// ASK 404 plants: live 3c6e1f92 (fetchback_w399) against t404.
const fs=require('fs');const EV=f=>require('../a402/ev.cjs')(f);const A=EV(__dirname+'/../rdf/fetchback_w399.json'),B=EV(__dirname+'/t404.json');
let ok=true;const pr=(nm,pass,info)=>{if(!pass)ok=false;console.log((pass?'PASS ':'FAIL ')+nm.padEnd(58)+' '+info);};
const base={dst:'PROP-DEPENDENT',cd:1,cc:1,col:[{link:'D1 vs C1',grade:'DEFENDER LINK BROKEN'}],retracted:[]};
const rw=(E,o)=>E.rd386({...base,...o}).word;
// 1. rd386 rule
for(const [nm,o,want] of [['BROKEN, challenge SELF-SUPPORTED',{verdict:'BROKEN',cst:'SELF-SUPPORTED'},'CHALLENGER WINS'],['BROKEN, challenge PROP-DEPENDENT',{verdict:'BROKEN',cst:'PROP-DEPENDENT'},'UNDERDETERMINED'],['BROKEN, challenge COLLAPSED',{verdict:'BROKEN',cst:'COLLAPSED'},'UNDERDETERMINED'],['BROKEN, no challenge standing',{verdict:'BROKEN',cst:null},null],['BROKEN-1 form, PROP-DEPENDENT',{verdict:'BROKEN-1',cst:'PROP-DEPENDENT'},'UNDERDETERMINED']]){
 const a=rw(A,o),b=rw(B,o);pr('rd386 '+nm,b===want,'live '+a+' | t404 '+b);}
// 2. HELD and PARTIAL grid unchanged
const G=[];for(const v of ['HELD','PARTIAL','HELD-1','PARTIAL-2'])for(const cst of ['SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED',null])for(const dst of ['SELF-SUPPORTED','PROP-DEPENDENT',null])for(const col of [[],[{link:'D1 vs C1',grade:'STANDS'}],[{link:'D1 vs C1',grade:'CHALLENGER LINK BROKEN'}],[{link:'D1 vs C1',grade:'UNDERDETERMINED'}]])for(const cd of [0,1])G.push({verdict:v,cst,dst,cd,cc:1,col,retracted:[]});
const gd=G.filter(o=>JSON.stringify(A.rd386(o))!==JSON.stringify(B.rd386(o)));pr('HELD and PARTIAL grid ('+G.length+' cases) unchanged',gd.length===0,'differ '+gd.length);
// 2b. BROKEN tie path: an all-UD panel word cannot become WINS; a SS BROKEN tie case still gives the tie word on both
const tc={verdict:'BROKEN',cst:'SELF-SUPPORTED',dst:'SELF-SUPPORTED',cd:1,cc:1,col:[{link:'D1 vs C1',grade:'STANDS'}],retracted:[]};pr('BROKEN SELF-SUPPORTED on a KB-0030 tie',JSON.stringify(A.rd386(tc))===JSON.stringify(B.rd386(tc)),'live '+A.rd386(tc).word+' | t404 '+B.rd386(tc).word);
// 3. stored judgments (624, to id 1226): ert386 v61 word, live against t404
const J=require('../a384/judgments_all.json');const T61=s=>{const m=[...String(s).matchAll(/\[AUDIT v61: ENGINE RESULT -- SEAT: [^;\]]*; WORD: ([A-Z ]+|none);[^\]]*/g)];return m.length?m[m.length-1]:null;};const W=s=>{const m=T61(s);return m?m[1]:'(no tag)';};
const IN=(s,seat)=>{const m=T61(B.ert386(String(s||''),seat));const t=m?m[0]:'';return {v:(t.match(/INPUTS: VERDICT ([A-Z]+)/)||[])[1]||'?',cs:(t.match(/CHALLENGE STANDING ([A-Z-]+)/)||[])[1]||'none'};};
const ch=[],cnt={};let err=0;for(const j of J){let a,b;try{a=W(A.ert386(String(j.v||''),j.seat));b=W(B.ert386(String(j.v||''),j.seat));}catch(e){err++;continue;}const I=IN(j.v,j.seat);const k=I.v+'|'+I.cs;cnt[k]=cnt[k]||{n:0,ch:0};cnt[k].n++;if(a!==b){cnt[k].ch++;ch.push({id:j.id,seat:j.seat,v:I.v,cs:I.cs,a,b});}}
fs.writeFileSync(__dirname+'/stored_out.json',JSON.stringify({cnt,ch},null,1));
console.log('stored judgments',J.length,'errors',err);for(const [k,v] of Object.entries(cnt).sort())console.log('  ',k.padEnd(28),'seats',v.n,'word changes',v.ch);
const bad=ch.filter(x=>x.v!=='BROKEN'||x.cs==='SELF-SUPPORTED'||!(x.a==='CHALLENGER WINS'&&x.b==='UNDERDETERMINED'));pr('every change is BROKEN, not SELF-SUPPORTED, CHALLENGER WINS to UNDERDETERMINED',bad.length===0,'changes '+ch.length+', other '+bad.length);
for(const id of [1076,1128,1199]){const j=J.find(x=>x.id==id);if(!j){pr('boundary '+id,false,'not in corpus');continue;}const a=W(A.ert386(j.v,j.seat)),b=W(B.ert386(j.v,j.seat));pr('boundary '+id+' ('+IN(j.v,j.seat).cs+') keeps CHALLENGER WINS',b==='CHALLENGER WINS'&&a===b,'live '+a+' | t404 '+b);}
for(const id of [604,606,607,608,609,610,611,628]){const j=J.find(x=>x.id==id);if(!j){pr('no-word row '+id,false,'not in corpus');continue;}const a=W(A.ert386(j.v,j.seat)),b=W(B.ert386(j.v,j.seat));pr('no-word row '+id+' ('+IN(j.v,j.seat).cs+'): a word on recompute under live iff under t404',(a==='none'||a==='(no tag)')===(b==='none'||b==='(no tag)'),'recompute: live '+a+' | t404 '+b+' (stored: no word; not written back)');}
console.log('RESULT:',ok?'PASS':'FAIL');
