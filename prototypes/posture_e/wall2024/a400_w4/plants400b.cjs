// ASK 400, W2 8566 condition: plants 8 (D2: CHALLENGER LINK BROKEN) and 9 (bare D2: BROKEN) through cureRecompute (v25) and sbApply2024 (v37), live 386 against t400: trig, result, fields and written lines.
const L=f=>require('./stubload400.cjs')(f,'Alternate Merge Seat',['cureRecompute','sbApply2024']);
const G={live386:L(__dirname+'/../rdf/fetchback_w386.json'),t400:L(__dirname+'/t400.json')};
const Fo=f=>({verdict_tag:f[0],defense_standing:f[1],challenge_standing:f[2],conceded_links:f[3],challenger_conceded_links:f[4]});
const base=d2=>['HELD','CLAUSE: HELD-1 -- n=2 w=0 k=0','COLLISION POINTS:','D1 vs C1 (John 1:1): UNDERDETERMINED -- g',d2,'DEFENSE STANDING: PROP-DEPENDENT -- L=2 c=1','CHALLENGE STANDING: PROP-DEPENDENT -- L=1 c=1','CONCEDED: DEFENDER 1, CHALLENGER 1','RESULT: DEFENDER WINS'];
const f=['HELD','PROP-DEPENDENT','PROP-DEPENDENT',1,1];
const out=[];
for(const [nm,d2] of [['8 D2: CHALLENGER LINK BROKEN','D2: CHALLENGER LINK BROKEN -- x'],['9 bare D2: BROKEN','D2: BROKEN -- x'],['control: no D2 line',null],['control: long-form UNREAD D2 vs C3','D2 vs C3 (John 1:2): MAYBE -- x']]){
 const R0=base(d2).filter(x=>x!==null);const raw=JSON.stringify({...Fo(f),reasoning:R0.join('\n')});
 const reply='CORRECTED RESULT: HELD-1 -- the retraction below\nRETRACTED: D1 vs C1 -- regraded to UNDERDETERMINED -- in CR2 the challenger wrote "x" (John 1:1)';
 const row={plant:nm};
 for(const k in G){let a,b;
  try{a=G[k].cureRecompute('s1',R0.join('\n'),Fo(f),[{rule:'K-X',link:'D1 vs C1',line:R0[3]}],[],{ok:true,text:reply});}catch(e){a={error:String(e)}}
  try{b=G[k].sbApply2024('s1',raw,Fo(f),[{sid:'E-1',ans:'CHANGE',line:'CLAUSE: HELD-1 -- n=2 w=0 k=0',to:'CLAUSE: HELD-1 -- n=2 w=0 k=0, restated'}],null);}catch(e){b={error:String(e)}}
  row[k]={v25:a&&{result:a.result,fields:a.fields,trig:a.trig,tag:a.tag,rp:(a.rp||[]).map(r=>r[1]),error:a.error},
          v37:b&&{result:b.result,fields:b.fields,trig:b.trig,items:(b.items||[]).map(i=>i.kind+(i.why?': '+i.why:'')),lines:b.lines||b.rp||null,keys:Object.keys(b),error:b.error}};}
 out.push(row);}
for(const o of out)console.log(JSON.stringify(o,null,1));require('fs').writeFileSync(__dirname+'/plants400b_out.json',JSON.stringify(out,null,1));
