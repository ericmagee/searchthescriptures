// W2 second grade of pkgCSS rev 2 (W1). LABELS, committed before the first run:
// G1  every stored debate (inputs/*_Final_Output.json): candidate Build skips exactly when live skips; otherwise one item per side whose closing
//     round has text; each item's side section byte-equal to live's section for that side; system text equal; the instruction is prompt_side.txt;
//     the union of item candidates equals live's candidates, each on its own side's item.                                    expect all OK
// Record, 34108, against live Record given the two replies joined in one reply (the oracle "same text, one call"):
// G2  D NONE, C CONFIRMED LINK 1 (real DR3/DR4 quotes)       -> C1 broken only; NONE FOUND row for DEFENDER; confirmed equal to live joined
// G3  D CONFIRMED D6 (real), C CONFIRMED C1                  -> two breaks; equal to live joined
// G4  D timeout, C CONFIRMED C1                               -> C1 broken; NOT CHECKED row for DEFENDER; error names DEFENDER; none false
// G5  D reply holds CONFIRMED D6 and a NONE line, C NONE      -> D6 broken; confirmed equal to live joined
// G6  same pair CONFIRMED in D call, NOT A CONTRADICTION in C call (C call names DEFENDER) -> conflicting answers, nothing broken; equal to live joined
// G7  D call returns a line naming CHALLENGER with defender quotes -> NOT CONFIRMED (form), nothing broken; equal to live joined (NOTE: no NOT CHECKED row for D)
// G8  Oracle candidates (34108 [DR4]): on the defender item only; D reply answers the first, omits the rest -> NO ANSWER rows for the rest only; equal to live joined
// G9  D repeats the D6 line                                  -> one break; equal to live joined
// G10 D reply empty text "", C NONE                           -> NOT CHECKED row for DEFENDER (no line), none false, nothing broken
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('./pkgGSL/harness.cjs');const H=require('./pkgVP3/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g('pkgCSS/parent_s104_CSS.json'),LIVE=g('/mnt/project-files/wall2024/fetchback_live_s104.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});let ok=0,bad=0;const T=(n,c,i)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
const DS={'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})]};
const runB=async(W,r,F)=>(await harness(r,{...DS,'Init Seats':[J({run_token:r})],...(F?{'Final Output':[J(F)]}:{})})('return (async()=>{\n'+code(W,'Close Enforcer Build')+'\n})();','Quote Report')).map(x=>x.json);
const rep=t=>t==null?J({error:{message:'timeout'}}):J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
const rec=async(W,items,reps)=>(await harness('34108',{'Close Enforcer Build':items.map(J),'Close Enforcer Call deepseek':reps.map(rep)})('return (async()=>{\n'+code(W,'Close Enforcer Record')+'\n})();','Close Enforcer Call deepseek'))[0].json;
const sec=(u,sd)=>{const i=u.indexOf('######## THE '+sd+' ########');if(i<0)return null;const j=u.indexOf('######## THE ',i+10);return u.slice(i,j<0?undefined:j).replace(/\s+$/,'');};
const ck=c=>c.map(x=>x.side+' '+x.link+' '+x.id).sort().join('|');
(async()=>{const PS=fs.readFileSync('pkgCSS/prompt_side.txt','utf8').replace(/\n$/,'');
 const runs=fs.readdirSync(H.IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();let n1=0;const f1=[];
 for(const r of runs){let F;try{F=H.out(r,'Final Output').flat().filter(Boolean)[0].json;}catch(e){try{const x=JSON.parse(fs.readFileSync(H.IN+'/'+r+'_Final_Output.json','utf8'));F=x[x.length-1].main[0][0].json;}catch(e2){f1.push(r+' unreadable');continue;}}
  const BL=(await runB(LIVE,r,F))[0],BC=await runB(CAND,r,F);n1++;
  if(BL.cec_skip){if(!(BC.length===1&&BC[0].cec_skip))f1.push(r+' live skips, cand does not');continue;}
  const want=['DEFENDER','CHALLENGER'].filter(sd=>String(F[sd==='DEFENDER'?'cr4':'dr4']||'').trim());
  if(BC.map(b=>b.side).join()!==want.join()){f1.push(r+' sides '+BC.map(b=>b.side));continue;}
  const UL=BL.body.messages[1].content;
  for(const b of BC){const u=b.body.messages[1].content;if(sec(u,b.side)!==sec(UL,b.side))f1.push(r+' '+b.side+' section differs');if(b.body.messages[0].content!==BL.body.messages[0].content)f1.push(r+' system');if(!u.startsWith(PS))f1.push(r+' instruction');if((b.cands||[]).some(c=>c.side!==b.side))f1.push(r+' cand on wrong side');
   if(b.body.model!==BL.body.model||b.body.max_tokens!==BL.body.max_tokens||b.body.temperature!==BL.body.temperature)f1.push(r+' body params');}
  if(BC.flatMap(b=>b.cands).map(c=>c.id).sort().join()!==(BL.cands||[]).map(c=>c.id).sort().join())f1.push(r+' candidates differ');}
 T('G1 stored debates: '+n1+' built; sections, system, instruction, candidates',f1.length===0,f1.slice(0,8).join('; '));
 const BC=await runB(CAND,'34108'),BL=(await runB(LIVE,'34108'))[0];
 const D6='CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "I drop the wording "no biological father" as a bare statement." -- CLOSING [CR4] "Christ had no biological father." -- reclaimed.';
 const C1='CLOSE-CONTRADICTION: NEW -- CHALLENGER -- LINK 1 -- CONFIRMED -- EARLIER [DR3] "So, footed on these rows, Joseph knew Mary his wife within the espousal." -- CLOSING [DR4] "I grant all of this, and it makes Joseph the legal father." -- planted.';
 const NONE='CLOSE-CONTRADICTION: NONE';
 const both=async(n,a,b,extra)=>{const R=await rec(CAND,BC,[a,b]);const L=await rec(LIVE,[BL],[[a,b].filter(x=>x!=null).join('\n')]);const rows=(typeof R.cec_log==='string'?JSON.parse(R.cec_log):R.cec_log).map(x=>x.item+' '+x.cure_status+(x.cure_reason&&/NOT CHECKED/.test(x.cure_reason)?' ['+String(x.cure_reason).slice(0,50)+']':''));
  const eq=ck(R.cec.confirmed)===ck(L.cec.confirmed);T(n,eq&&extra(R,rows),'cand '+ck(R.cec.confirmed)+' | live joined '+ck(L.cec.confirmed)+' | none '+R.cec.none+' | rows '+JSON.stringify(rows)+' | errors '+JSON.stringify(R.cec.errors));};
 const has=(rows,re)=>rows.some(x=>re.test(x));
 await both('G2 D NONE, C CONFIRMED C1',NONE,C1,(R,rows)=>R.cec.confirmed.length===1&&R.cec.confirmed[0].side==='CHALLENGER'&&has(rows,/^NONE DEFENDER NONE FOUND/)&&R.cec.none===false);
 await both('G3 both CONFIRMED',D6,C1,(R)=>R.cec.confirmed.length===2);
 {const R=await rec(CAND,BC,[null,C1]);const rows=R.cec_log.map(x=>x.item+' '+x.cure_status+' '+String(x.cure_reason).slice(0,40));T('G4 D timeout, C CONFIRMED C1',R.cec.confirmed.length===1&&R.cec.confirmed[0].side==='CHALLENGER'&&has(rows,/^NOT CHECKED DEFENDER/)&&R.cec.errors.some(e=>/^DEFENDER/.test(e))&&R.cec.none===false,JSON.stringify(rows)+' '+JSON.stringify(R.cec.errors));}
 await both('G5 D CONFIRMED D6 plus a NONE line, C NONE',D6+'\n'+NONE,NONE,(R)=>R.cec.confirmed.length===1&&R.cec.confirmed[0].link===6);
 await both('G6 same pair CONFIRMED in D call, NOT A CONTRADICTION in C call',D6,D6.replace('-- CONFIRMED --','-- NOT A CONTRADICTION --'),(R)=>R.cec.confirmed.length===0&&R.cec.rows.some(x=>/conflicting/.test(x.status)));
 await both('G7 D call returns a CHALLENGER line with defender quotes',D6.replace('-- DEFENDER --','-- CHALLENGER --'),NONE,(R,rows)=>R.cec.confirmed.length===0&&R.cec.rows.some(x=>/form/.test(x.status)));
 {const cs=BC[0].cands||[];if(!cs.length)T('G8 Oracle candidates',false,'34108 defender item has no candidate');else{const c=cs[0];const a='CLOSE-CONTRADICTION: '+c.id+' -- DEFENDER -- LINK '+c.n+' -- NOT A CONTRADICTION -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.';
  const R=await rec(CAND,BC,[a,NONE]),L=await rec(LIVE,[BL],[a+'\n'+NONE]);T('G8 '+cs.length+' Oracle candidates on the defender item only; first answered, rest NO ANSWER',(BC[1].cands||[]).length===0&&R.cec.no_answer.join()===cs.slice(1).map(x=>x.id).join()&&R.cec.no_answer.join()===L.cec.no_answer.join(),'cand no_answer '+R.cec.no_answer+' | live '+L.cec.no_answer);}}
 await both('G9 D repeats the D6 line',D6+'\n'+D6,NONE,(R)=>R.cec.confirmed.length===1);
 {const R=await rec(CAND,BC,['',NONE]);const rows=R.cec_log.map(x=>x.item+' '+x.cure_status);T('G10 D empty reply, C NONE',R.cec.confirmed.length===0&&R.cec.none===false&&has(rows,/DEFENDER NOT CHECKED/),JSON.stringify(rows));}
 console.log(ok+' OK, '+bad+' FAIL');})();
