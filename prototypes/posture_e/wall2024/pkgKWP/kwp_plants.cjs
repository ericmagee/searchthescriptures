// pkgKWP plants: luna's K-W #4 NOT HELD quote rewritten in her first reply (Panel Cure Call 1) and her follow-up reply,
// then Panel Cure Normalize 1 (does the follow-up ask #4?) and Panel Cure Check (status of #4), live s147 vs package
const fs=require('fs');const {LV,PK,run}=require('./replay_nodes.cjs');
const raw=fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8');
const Q1="I grant that her 'know' is present",Q2='I grant that her ‘know’ is present';
const V=[['V0 as run (quotes "I grant that her know is present")',null],
 ['V1 quote without the lead: "that her know is present"',"that her know is present"],
 ['V2 two-word quote: "her know"','her know'],
 ['V3 quote from inside the parenthetical: "thou shalt conceive is future"','thou shalt conceive is future'],
 ['V4 unrelated five words: "the angel came in unto"','the angel came in unto'],
 ['V5 four words of the clause: "her know is present"','her know is present']];
(async()=>{for(const [k,t] of V){const txt=t==null?raw:raw.replace(/(NOT HELD: [^A-Za-z]{0,12})I grant that her ['\u2018]know['\u2019] is present/g,(m,a)=>a+t);if(t!=null)console.log('  replaced in replies:',(raw.match(/NOT HELD: [^A-Za-z]{0,12}I grant that her ['\u2018]know['\u2019] is present/g)||[]).length,'| flagged line intact:',txt.includes('is present (Luke 1:31'));const rd=JSON.parse(txt).data.resultData.runData;const row=[];
 for(const W of [LV,PK]){const r=[];for(const n of ['Panel Cure Normalize 1','Panel Cure Check']){const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];const o=(await run(W,rd,n,inp))[0].json;
  if(n==='Panel Cure Normalize 1')r.push('follow-up asks #4: '+(!!(o.fum&&o.fum.asked.some(a=>/#4:/.test(a)))?'yes':'no'));else r.push('luna #4 after follow-up '+o.summary[0].cure.find(c=>/#4$/.test(c.link||'')&&c.rule==='K-W').status);}row.push(r.join('; '));}
 console.log(k,'\n  live:',row[0],'\n  pkg: ',row[1]);}})();
