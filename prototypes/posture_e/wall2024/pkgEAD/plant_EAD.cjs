// pkgEAD plants (W1) on run 34108 through pkgEAD Send Back Build: a truly bare deferral is still sent; a real answer behind the deferral is withheld; a reason with no deferral words is untouched.
const fs=require('fs');const H=require('./harness_clone.cjs');const RUN='34108';let ok=0,bad=0;const T=(c,m)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+m);};
const J=o=>JSON.parse(JSON.stringify(o));const NORM=['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
const R0=H.out(RUN,NORM[0]).flat()[0].json.cure.rounds;
function bareRounds(keepDeferral,shortLink4,moveLink4){const R=J(R0);let L=R.CR3.split('\n');
 {const s=L.findIndex(l=>/^\*\*LINK 4:/.test(l));let e=s+1;while(e<L.length&&!/^\s*(?:#+\s*)?(?:\*\*)?\s*LINK\s+\d+\b/i.test(L[e]))e++;for(let k=s;k<e;k++)L[k]=L[k].replace(/Luke 1:34(?![0-9])/g,'her question');
  if(moveLink4){const blk=L.splice(s,e-s);R.CR4=R.CR4+'\n\n'+blk.join('\n');}}const a=L.findIndex(l=>/^- Luke 1:34, "How shall this be/.test(l));
 L[a]=L[a].replace(/ I answer it fully under LINK 4\./,keepDeferral?' I answer it fully under LINK 4.':'');
 if(shortLink4){const s=L.findIndex(l=>/^\*\*LINK 4:/.test(l));let e=s+1;while(e<L.length&&!/^\s*(?:#+\s*)?(?:\*\*)?\s*LINK\s+\d+\b/i.test(L[e]))e++;L.splice(s,e-s,'**LINK 4: SUPPORTED.** As above.','');}
 L=L.filter((l,k)=>l===L[a]||!/Luke 1:34(?![0-9])/.test(l));R.CR3=L.join('\n');R.CR4=R.CR4.split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n');return R;}
function over(R,noDeferWords){const o={};if(R)for(const n of NORM){const v=J(H.out(RUN,n));v.flat()[0].json.cure.rounds=R;o[n]=v;}
 if(noDeferWords){let s=JSON.stringify(H.out(RUN,'Judge Enforcer Record'));s=s.split('and defers, \\\\\\"I answer it fully under LINK 4,\\\\\\" ').join('').split('and defers, \\"I answer it fully under LINK 4,\\" ').join('');o['Judge Enforcer Record']=JSON.parse(s);}return o;}
const NEW=fs.readFileSync((process.env.NEWSRC||'pkgLIB/strip_EAD_on_S112L/patched/')+'Send_Back_Build.js','utf8');
const withheld=async o=>{const b=await H.run(NEW,RUN,'Judge Enforcer Record',o);return b.flatMap(x=>(x.json.sb_not_sent||[])).filter(x=>/pkgEAD/.test(x.why)&&/Luke 1:34/.test(x.item)).map(x=>x.seat).sort();};
const sent=async o=>{const b=await H.run(NEW,RUN,'Judge Enforcer Record',o);return b.flatMap(x=>(x.json.items||[]).filter(i=>i.rule==='E-ANS'&&/Luke 1:34/.test(i.item)).map(()=>x.json.seat)).sort();};
(async()=>{
 let w=await withheld(over(null));T(w.join()==='chatgpt,luna,sol','P0 stored rounds (real LINK 4 answer): withheld for '+w.join(','));
 w=await withheld(over(bareRounds(true,true)));let s=await sent(over(bareRounds(true,true)));T(!w.length&&s.length===3,'P1 grant + deferral to a LINK 4 of under 25 words (truly bare): withheld '+(w.join(',')||'none')+'; sent to '+s.join(','));
 w=await withheld(over(bareRounds(false,false)));s=await sent(over(bareRounds(false,false)));T(!w.length&&s.length===3,'P2 bare grant, no deferral, Luke 1:34 named nowhere else: withheld '+(w.join(',')||'none')+'; sent to '+s.join(','));
 w=await withheld(over(bareRounds(true,false,true)));T(w.length===3,'P3 deferral to the layered LINK 4 moved into [CR4]: withheld for '+w.join(','));
 w=await withheld(over(null,true));s=await sent(over(null,true));T(!w.length&&s.length===3,'P4 same item, DeepSeek reason with the deferral words taken out: withheld '+(w.join(',')||'none')+'; sent to '+s.join(','));
 console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
