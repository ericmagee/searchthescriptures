// ASK 403 plants (W1 8615 step 2): one tag from each output site (v61 ENGINE RESULT, v25 RECOMPUTED, v37 DERIVED), t401 against t403.
// Pass: the whole output of each call is equal after "engine_manual v184 section 8" is read as "engine_manual section 8", and the old text is gone from t403's output.
const L=f=>require('./stubload400.cjs')(f,'Alternate Merge Seat',['cureRecompute','sbApply2024']);const EV=f=>require('./ev.cjs')(f);
const P={t401:__dirname+'/../a401/t401.json',t403:__dirname+'/t403.json'};const G={},E={};for(const k in P){G[k]=L(P[k]);E[k]=EV(P[k]);}
const Fo=f=>({verdict_tag:f[0],defense_standing:f[1],challenge_standing:f[2],conceded_links:f[3],challenger_conceded_links:f[4]});
const f=['HELD','PROP-DEPENDENT','PROP-DEPENDENT',1,1];
const R0=['HELD','CLAUSE: HELD-1 -- n=2 w=0 k=0','COLLISION POINTS:','D1 vs C1 (John 1:1): UNDERDETERMINED -- g','D2 vs C2 (John 1:2): DEFENDER LINK BROKEN -- x','DEFENSE STANDING: PROP-DEPENDENT -- L=2 c=1','CHALLENGE STANDING: PROP-DEPENDENT -- L=1 c=1','CONCEDED LINKS: 1','CHALLENGER CONCEDED LINKS: 1','RESULT: DEFENDER WINS'];
const raw=JSON.stringify({...Fo(f),reasoning:R0.join('\n')});
const reply='CORRECTED RESULT: HELD-1 -- the retraction below\nRETRACTED: D1 vs C1 -- regraded to UNDERDETERMINED -- in CR2 the challenger wrote "x" (John 1:1)';
const calls={
 'v61 ENGINE RESULT (ert386)':k=>E[k].ert386(raw,'s1',Fo(f)),
 'v25 RECOMPUTED (cureRecompute)':k=>G[k].cureRecompute('s1',R0.join('\n'),Fo(f),[{rule:'K-X',link:'D1 vs C1',line:R0[3]}],[],{ok:true,text:reply}),
 'v37 DERIVED (sbApply2024)':k=>G[k].sbApply2024('s1',raw,Fo(f),[{sid:'E-1',ans:'CHANGE',line:'CLAUSE: HELD-1 -- n=2 w=0 k=0',to:'CLAUSE: HELD-1 -- n=2 w=0 k=0, restated'}],null)};
const A='engine_manual v184 section 8',B='engine_manual section 8';let ok=true;
for(const [nm,fn] of Object.entries(calls)){let a,b;try{a=JSON.stringify(fn('t401'));}catch(e){a='ERR '+e;}try{b=JSON.stringify(fn('t403'));}catch(e){b='ERR '+e;}
 const oldIn=a.split(A).length-1,newIn=b.split(B).length-1;const eq=a.split(A).join(B)===b;const gone=!b.includes(A);if(!(eq&&gone&&oldIn>0))ok=false;
 console.log(nm.padEnd(32),'t401 cites v184 x'+oldIn,'| t403 cites section 8 x'+newIn,'| equal apart from that:',eq,'| v184 gone:',gone);
 const m=b.match(/RULE: engine_manual section 8[^;\]]{0,80}/);if(m)console.log('   t403 RULE:',m[0]);}
console.log(ok?'RESULT: PASS':'RESULT: FAIL');
