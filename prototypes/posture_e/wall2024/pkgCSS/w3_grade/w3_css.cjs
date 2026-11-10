// W3 grade of pkgCSS rev 1: my own plants. (1) Build on every stored debate: each side section equal to live, candidates kept. (2) Record with half-failed calls and mixed replies.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g('pkgCSS/parent_s104_CSS.json'),LIVE=g('/mnt/project-files/wall2024/fetchback_live_s104.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});
const runs=fs.readdirSync(H.IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();
const getF=r=>{try{return H.out(r,'Final Output').flat().filter(Boolean)[0].json;}catch(e){try{const x=JSON.parse(fs.readFileSync(H.IN+'/'+r+'_Final_Output.json','utf8'));return x[x.length-1].main[0][0].json;}catch(e2){return null;}}};
const runB=async(W,r,F)=>(await harness(r,{'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})]})('return (async()=>{\n'+code(W,'Close Enforcer Build')+'\n})();','Quote Report')).map(x=>x.json);
const rep=t=>t==null?J({error:{message:'timeout'}}):J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
const rec=async(r,F,items,reps)=>(await harness(r,{'Final Output':[J(F)],'Close Enforcer Build':items.map(J),'Close Enforcer Call deepseek':reps.map(rep)})('return (async()=>{\n'+code(CAND,'Close Enforcer Record')+'\n})();','Close Enforcer Call deepseek'))[0].json;
const show=(n,R)=>{const L=typeof R.cec_log==='string'?JSON.parse(R.cec_log):R.cec_log;console.log(n);console.log('   confirmed: '+JSON.stringify(R.cec.confirmed.map(c=>c.side+' LINK '+c.link))+' | none: '+R.cec.none+' | no_answer: '+JSON.stringify(R.cec.no_answer)+' | errors: '+JSON.stringify(R.cec.errors));L.forEach(r=>console.log('   LOG ROW item "'+r.item+'" | reason "'+String(r.cure_reason).slice(0,110)+'" | reply_error '+JSON.stringify(r.reply_error)));return L;};
(async()=>{let eq=0,ne=0,cl=0,cc=0,withC=[];
 for(const r of runs){const F=getF(r);if(!F)continue;let BL,BC;try{BL=(await runB(LIVE,r,F))[0];BC=await runB(CAND,r,F);}catch(e){console.log(r+' ERROR '+e.message);continue;}if(BL.cec_skip){continue;}
  const UL=BL.body.messages[1].content,iD=UL.indexOf('######## THE DEFENDER ########'),iC=UL.indexOf('######## THE CHALLENGER ########');const d=BC.find(b=>b.side==='DEFENDER'),c=BC.find(b=>b.side==='CHALLENGER');
  const ok=d&&c&&d.body.messages[1].content.endsWith(UL.slice(iD,iC).replace(/\s+$/,''))&&c.body.messages[1].content.endsWith(UL.slice(iC))&&!c.body.messages[1].content.includes('=== [CR')&&!d.body.messages[1].content.includes('=== [DR');
  const lc=(BL.cands||[]).length,nc=BC.reduce((t,b)=>t+(b.cands||[]).length,0);cl+=lc;cc+=nc;if(lc)withC.push(r+':'+lc);
  const candText=(BL.cands||[]).every(x=>d.body.messages[1].content.includes(x.id+' -- '+x.side));
  if(ok&&lc===nc&&candText)eq++;else{ne++;console.log(r+' DIFFERS ok='+ok+' cands '+lc+' vs '+nc);}}
 console.log('BUILD on stored debates: '+eq+' equal, '+ne+' differ; candidates live '+cl+', per-side calls '+cc+'; debates with candidates: '+withC.join(' ')||'none');
 const r='34108',F=getF(r),BC=await runB(CAND,r,F);
 const pick=(t,n)=>String(t).split(/\n+/).map(x=>x.replace(/[*_`]+/g,'').trim()).filter(x=>x.split(' ').length>=8&&x.split(' ').length<=30&&!/"/.test(x))[n];
 const L6='CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "I drop the wording "no biological father" as a bare statement." -- CLOSING [CR4] "Christ had no biological father." -- reclaimed.';
 const cLink=(BC[1].links.CHALLENGER||[])[0];const LC='CLOSE-CONTRADICTION: NEW -- CHALLENGER -- LINK '+cLink+' -- CONFIRMED -- EARLIER [DR3] "'+pick(F.dr3,3)+'" -- CLOSING [DR4] "'+pick(F.dr4,3)+'" -- planted.';
 const N='CLOSE-CONTRADICTION: NONE';
 show('P1 defender NONE, challenger CONFIRMED on its own link (expect: challenger link broken)',await rec(r,F,BC,[N,LC]));
 show('P2 both sides CONFIRMED with id NEW (expect: two links broken)',await rec(r,F,BC,[L6,LC]));
 show('P3 defender call FAILS, challenger NONE (the defender, where the 34108 drop stands, was not checked)',await rec(r,F,BC,[null,N]));
 show('P4 defender call FAILS, challenger CONFIRMED',await rec(r,F,BC,[null,LC]));
 show('P5 challenger call FAILS, defender CONFIRMED',await rec(r,F,BC,[L6,null]));
 show('P6 both calls FAIL (expect NOT CHECKED)',await rec(r,F,BC,[null,null]));
 show('P7 defender reply is prose with no line, challenger NONE',await rec(r,F,BC,['I have read the rounds and find nothing to report.',N]));
 show('P8 defender reply empty string, challenger NONE',await rec(r,F,BC,['',N]));
 show('P9 the defender call answers with a line labeled CHALLENGER quoting the defender rounds (wrong side label)',await rec(r,F,BC,[L6.replace('DEFENDER','CHALLENGER'),N]));
 show('P13 (rev 2) defender reply holds a NONE line and a CONFIRMED line, challenger NONE',await rec(r,F,BC,[N+'\n'+L6,N]));
 show('P14 (rev 2) defender reply is spaces only, challenger NONE',await rec(r,F,BC,['   \n ',N]));
 show('P15 (rev 2) defender reply unreadable CLOSE-CONTRADICTION line, challenger call FAILS',await rec(r,F,BC,['CLOSE-CONTRADICTION: the defender contradicts itself on link 6',null]));
 show('P16 (rev 2) two Build items but only ONE reply item arrives (the challenger has no reply item)',await rec(r,F,BC,[N]));
 show('P17 (rev 2) reply cut by length: content empty, finish length, both sides',await (async()=>(await harness(r,{'Final Output':[J(F)],'Close Enforcer Build':BC.map(J),'Close Enforcer Call deepseek':[J({choices:[{message:{role:'assistant',content:''},finish_reason:'length'}]}),J({choices:[{message:{role:'assistant',content:null},finish_reason:'length'}]})]})('return (async()=>{\n'+code(CAND,'Close Enforcer Record')+'\n})();','Close Enforcer Call deepseek'))[0].json)());
 // Oracle candidate planted in DR4
 const F2={...F,dr4:F.dr4+'\n\nOPPONENT\'S CONTRADICTIONS:\nX1 LINK 6 | EARLIER [CR3] "I drop the wording "no biological father" as a bare statement." | CLOSING [CR4] "Christ had no biological father." | reclaimed'};
 const B2=await runB(CAND,r,F2);console.log('P10 Oracle candidate X1 planted: defender call cands '+JSON.stringify(B2[0].cands.map(c=>c.id))+', challenger call cands '+JSON.stringify(B2[1].cands.map(c=>c.id))+'; candidate text in challenger prompt: '+/X1 -- DEFENDER/.test(B2[1].body.messages[1].content));
 const X1=L6.replace('NEW','X1');
 show('P11 X1 answered CONFIRMED by the defender call, challenger NONE',await rec(r,F2,B2,[X1,N]));
 const L=show('P12 X1 planted, defender call FAILS, challenger NONE',await rec(r,F2,B2,[null,N]));
 fs.writeFileSync('pkgCSS/w3_grade/rows_w3_rev2.json',JSON.stringify(L.map(x=>({...x,run_token:'W3-ROLLBACK-TEST-CSS',prompt_sent:x.prompt_sent?String(x.prompt_sent).slice(0,80):null,full_reply:x.full_reply?String(x.full_reply).slice(0,80):null}))));
 // live behaviour for comparison on a failed call
 const BLv=await runB(LIVE,r,F);const RL=(await harness(r,{'Final Output':[J(F)],'Close Enforcer Build':[J(BLv[0])],'Close Enforcer Call deepseek':[rep(null)]})('return (async()=>{\n'+code(LIVE,'Close Enforcer Record')+'\n})();','Close Enforcer Call deepseek'))[0].json;show('LIVE s104 for comparison: the one call FAILS',RL);
})();
