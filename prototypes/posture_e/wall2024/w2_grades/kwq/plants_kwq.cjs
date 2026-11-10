// W2 plants for pkgKWQ on 34726 haiku K-W item #4 (labels written before the run). EXPECT is the right reading of the form.
const {srcs}=require('./h.cjs');const lib=require('./h_run.cjs');
const Q="the coming together is distinct from the taking in 1:24";
const P=[['Q1 single straight (stored)',`'${Q}'`,'CURED'],['Q2 curly single',`‘${Q}’`,'CURED'],['Q3 double straight',`"${Q}"`,'CURED'],['Q4 curly double',`“${Q}”`,'CURED'],
['Q5 mixed: opens single, closes double',`'${Q}"`,'EITHER'],['Q6 apostrophe inside single marks',`'the town's coming together is distinct from the taking'`,'CURED'],
['Q7 single mark opened, never closed, apostrophe in first word',`'Joseph's line holds`,'UNCURED'],['Q8 no marks',Q,'UNCURED'],['Q9 single marks, under six characters',`'taken'`,'UNCURED'],
['Q10 double mark opened, never closed, apostrophe later',`"the coming together is Joseph's taking`,'UNCURED'],['Q11 backticks',`\`${Q}\``,'UNCURED'],['Q12 bracketed round, single marks',`'${Q}'`,'CURED','[CR4]'],
['Q13 curly apostrophe inside curly single marks',`‘the town’s coming together is distinct’`,'CURED']];
for(const [lab,q,exp,rd] of P){const mut=(items,reply)=>{reply.text=reply.text.replace(/REASSERTED IN CR4 '[^\n]*?'\. The later round rests on the withdrawn reading/,'REASSERTED IN '+(rd||'CR4')+' '+q+'. The later round rests on the withdrawn reading');};
 const r=lib(srcs.haiku,mut);const a=r.base.find(x=>x.rule==='K-W'&&/#4/.test(x.link)),b=r.cand.find(x=>x.rule==='K-W'&&/#4/.test(x.link));
 console.log(((exp==='EITHER'||exp===b.status)?'OK  ':'MISS')+' '+lab+' | expected '+exp+' | live '+a.status+' cand '+b.status+(r.changed?'':' (MUTATION NOT APPLIED)'));}
