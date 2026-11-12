// Replay Close Enforcer Build, live s151 against parent_s151_CNP, on the rounds of 35296 and 35379 (rebuilt from their stored
// close-enforcer prompts) and on plants. Prints the candidate list each side sends.
const fs=require('fs');const R=require('./rounds.cjs')(process.argv[2]);
const code=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const LIVE=code('fetchback_live_s151.json'),PAR=code('parent_s151_CNP.json');
const run=(js,F)=>{const $=n=>({'Init Seats':{isExecuted:true,first:()=>({json:{run_token:'T'}})},'Resolve Seats':{isExecuted:true,first:()=>({json:{deepseek:{api_model:'deepseek-flash',max_tokens:16000}}})},'Final Output':{isExecuted:true,first:()=>({json:F})},'Regrade Load':{isExecuted:false,first:()=>{throw new Error('no')}}})[n]||{isExecuted:false,first:()=>{throw new Error('no node '+n)},all:()=>[]};
 return new Function('$',js)($);};
const cands=o=>o.flatMap(x=>(x.json.cands||[]).map(c=>c.id+' '+c.side+' LINK '+c.n+' by '+c.by.replace(/ \(.*$/,'')+' | E['+c.earlier_round+'] '+c.earlier_q.slice(0,60)+' | C '+c.closing_q.slice(0,60)));
const show=(t,F)=>{const a=run(LIVE,F),b=run(PAR,F);const ca=cands(a),cb=cands(b);console.log('\n## '+t+'  live '+ca.length+' / CNP '+cb.length+(a.some(x=>x.json.cec_skip)?' (skip)':''));
 const sa=JSON.stringify(a.map(x=>({...x.json,body:null,cands:null}))),sb=JSON.stringify(b.map(x=>({...x.json,body:null,cands:null})));if(sa!==sb)console.log('  other fields differ!');
 for(const c of cb)console.log('  '+(ca.includes(c)?'  ':'+ ')+c);for(const c of ca)if(!cb.includes(c))console.log('  - '+c);};
for(const k in R)show(k,R[k]);
const base=R['ODV1-35379-2yvjfj38'];const rep=(s,a,b)=>{if(!s.includes(a))throw new Error('plant anchor missing: '+a);return s.replace(a,b);};
const P={
 'P1 wording: Nothing has been narrowed or conceded.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','Nothing has been narrowed or conceded.')},
 'P2 wording: I have not withdrawn anything.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','I have not withdrawn anything.')},
 'P3 wording: No link of mine is narrowed.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','No link of mine is narrowed.')},
 'P4 names D5 only: D5 is narrowed in nothing; I concede nothing on D5.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','I concede nothing on D5.')},
 'P5 names D2 only (no narrowing there)':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','I concede nothing on D2.')},
 'N1 exception: I concede nothing beyond what I narrowed in CR3.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','I concede nothing beyond what I narrowed in CR3.')},
 'N2 other side: The challenger narrows nothing.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','The challenger narrows nothing.')},
 'N3 quoted: The challenger says "I narrow nothing and concede nothing."':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','The challenger says "I narrow nothing and concede nothing."')},
 'N4 conditional: If I narrowed nothing, D5 would stand whole.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','If I narrowed nothing, D5 would stand whole.')},
 'N5 question: Do I concede nothing?':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','Do I concede nothing?')},
 'N6 denial but no earlier narrowing (LINK 5 label removed)':{cr3:rep(base.cr3,'LINK 5: NARROWED TO:','LINK 5:')},
 'N7 close admits: I concede nothing new.':{cr4:rep(base.cr4,'I narrow nothing and concede nothing.','I concede nothing new.')},
};
for(const [k,v] of Object.entries(P))show(k,{...base,...v});
