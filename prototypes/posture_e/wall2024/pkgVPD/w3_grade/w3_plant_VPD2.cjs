// W2 pkgVPD plants (from W1's w1_plant_rev3.cjs; base live s98, candidate pkgVPD). W1 regrade of pkgVP3 rev 3 header follows:
// W1 regrade of pkgVP3 rev 3: planted cases on run 34108 for the two rev 3 branches (built on W2's w2_plant_VP3.cjs helpers).
// The defender's rounds are edited so its answer to Luke 1:34 is truly bare; the judge's reply is edited to keep the grade.
const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const RUN='34108';let ok=0,bad=0;const T=(c,m)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+m);};
const P=JSON.parse(fs.readFileSync((process.env.CAND||__dirname+'/../parent_s98_VPD2.json'),'utf8'));const by={};P.nodes.forEach(n=>by[n.name]=n);
let LV=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s98.json','utf8'));LV=LV.data||LV;LV=LV.workflow||LV;const lv={};LV.nodes.forEach(n=>lv[n.name]=n);
const J=o=>JSON.parse(JSON.stringify(o));const NORM=['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
const R0=H.out(RUN,NORM[0]).flat()[0].json.cure.rounds;
// bare rounds: CR3 line 17 keeps only its grant (deferral optional); every other CR3/CR4 line naming Luke 1:34 is dropped
function bareRounds(keepDeferral,shortLink4,moveLink4){const R=J(R0);
 let L=R.CR3.split('\n');
 {const s=L.findIndex(l=>/^\*\*LINK 4:/.test(l));let e=s+1;while(e<L.length&&!/^\s*(?:#+\s*)?(?:\*\*)?\s*LINK\s+\d+\b/i.test(L[e]))e++;for(let k=s;k<e;k++)L[k]=L[k].replace(/Luke 1:34(?![0-9])/g,'her question'); /* LINK 4 kept whole, its own naming of the verse reworded */
  if(moveLink4){const blk=L.splice(s,e-s);R.CR4=R.CR4+'\n\n'+blk.join('\n');}}const a=L.findIndex(l=>/^- Luke 1:34, "How shall this be/.test(l));
 L[a]=L[a].replace(/ I answer it fully under LINK 4\./,keepDeferral?' I answer it fully under LINK 4.':'');
 if(shortLink4){const s=L.findIndex(l=>/^\*\*LINK 4:/.test(l));let e=s+1;while(e<L.length&&!/^\s*(?:#+\s*)?(?:\*\*)?\s*LINK\s+\d+\b/i.test(L[e]))e++;L.splice(s,e-s,'**LINK 4: SUPPORTED.** As above.','');}
 L=L.filter((l,k)=>l===L[a]||!/Luke 1:34(?![0-9])/.test(l));R.CR3=L.join('\n');
 R.CR4=R.CR4.split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n');return R;}
function over(R,seat,sid,reply){const o={};for(const n of NORM){const v=J(H.out(RUN,n));v.flat()[0].json.cure.rounds=R;o[n]=v;}
 const C=J(H.out(RUN,'Send Back Call openrouter'));const B=H.out(RUN,'Send Back Build').flat();const i=B.findIndex(b=>b.json.seat===seat);
 const it=C.flat()[i].json;const m=it.choices[0].message;const j=JSON.parse(m.content);
 j.reasoning=j.reasoning.split('\n').map(l=>l.startsWith('SENDBACK: '+sid+' ||')?'SENDBACK: '+sid+' || '+reply:l).join('\n');m.content=JSON.stringify(j,null,2);o['Send Back Call openrouter']=C;return o;}
const D=(R,txt)=>{R.CR3=R.CR3.replace(/(^- Luke 1:34, "How shall this be[^\n]*?spoke\.)/m,'$1 '+txt);return R;};const K='KEEP || The answer meets the press.';
const W2C=[
 ['W2-F deferral to an earlier round [CR2] that answers Luke 1:34 with a layer: not listed',(()=>{const R=D(bareRounds(false,false),'I answer it in [CR2].');R.CR2=R.CR2+'\n\n- Luke 1:34: [L2] ginōskō (G1097) is the verb of knowing a man; the angel answers how, by the Holy Ghost, so no man is the means.';return R;})(),'chatgpt','S1',K,false],
 ['W2-G deferral to an earlier round [CR2] that never names Luke 1:34: listed',(()=>{const R=D(bareRounds(false,false),'I answer it in [CR2].');R.CR2=R.CR2.split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n');return R;})(),'chatgpt','S1',K,true],
 ['W2-H deferral to [CR2] whose only answer is a bare grant: listed',(()=>{const R=D(bareRounds(false,false),'I answer it in [CR2].');R.CR2=R.CR2.split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n')+'\n\n- Luke 1:34: I grant she asked how.';return R;})(),'chatgpt','S1',K,true],
 ['W2-I deferral to [CR2] whose answer defers again to [CR1]: not listed (one hop)',(()=>{const R=D(bareRounds(false,false),'I answer it in [CR2].');R.CR2=R.CR2.split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n')+'\n\n- Luke 1:34: I grant she asked how. I answer it in [CR1].';return R;})(),'chatgpt','S1',K,false],
 ['W2-J deferral to the challenger round [DR3] that holds text: not listed (unchanged)',D(bareRounds(false,false),'I answer it as in [DR3].'),'chatgpt','S1',K,false],
 ['W2-K deferral to [CR4] where [CR4] answers Luke 1:34 with a layer: not listed',(()=>{const R=D(bareRounds(false,false),'I answer it fully in [CR4].');R.CR4=R.CR4+'\n\n- Luke 1:34: [L3] the angel answers the how by the Holy Ghost, so the means is not a man.';return R;})(),'chatgpt','S1',K,false],
 ['W2-L deferral to LINK 4 that stands whole with layers (stored shape): not listed',bareRounds(true,false),'chatgpt','S1',K,false],
 ['W2-M grant only, no deferral: listed (unchanged)',bareRounds(false,false),'chatgpt','S1',K,true],
 ['W2-N deferral to LINK 9 and to LINK 4 with layers: not listed',D(bareRounds(false,false),'I answer it under LINK 9 and under LINK 4.'),'chatgpt','S1',K,false]];
const row=(out,seat,re)=>out[0].json.sb_rows.find(r=>r.seat===seat&&re.test(r.item||''));
const tail=r=>{const s=String(r.cure_reason);const i=s.indexOf('TRIAL pkgVP3');return i<0?'(no VP3 note)':s.slice(i,i+330);};
(async()=>{
 const cases=[
  ['G8 deferral "in [CR4]"; [CR4] answers by paraphrase with a layer: no reference, no three KJV words in a row',(()=>{const R=D(bareRounds(false,false),'I answer it fully in [CR4].');R.CR4=R.CR4+'\n\n- On what Mary asked the angel about the manner: [L3] the reply names the Holy Ghost as the cause, so the means is no husband.';return R;})(),'chatgpt','S1',K,false],
  ['G9 deferral to earlier [CR2]; [CR2] holds three KJV words of the verse only in a bare grant line with no reference',(()=>{const R=D(bareRounds(false,false),'I answer it in [CR2].');R.CR2=R.CR2.split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n')+'\n\n- I grant "I know not a man" is present tense.';return R;})(),'chatgpt','S1',K,true],
  ['G10 deferral to earlier [CR2]; [CR2] writes "verse 34" in a layered line about a different chapter (Luke 2, verse 34)',(()=>{const R=D(bareRounds(false,false),'I answer it in [CR2].');R.CR2=R.CR2.split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n')+'\n\n- Luke 2, verse 34: [L2] Simeon blesses them and speaks to Mary his mother.';return R;})(),'chatgpt','S1',K,true],
  ['G11 deferral "in [CR4]"; [CR4] answers under "v. 34" with a reasoned sentence and no layer tag',(()=>{const R=D(bareRounds(false,false),'I answer it fully in [CR4].');R.CR4=R.CR4+'\n\n- On v. 34: her words state that she knew no husband when the angel spoke, and the angel answers by naming the Holy Ghost, so the means of the conceiving is not a man.';return R;})(),'chatgpt','S1',K,false]];
 for(const [name,R,seat,sid,reply,expect] of cases){const o=over(R,seat,sid,reply);
  const live=await H.run(lv['Send Back Record'].parameters.jsCode,RUN,'Send Back Call openrouter',o);const pk=await H.run(by['Send Back Record'].parameters.jsCode,RUN,'Send Back Call openrouter',o);
  const rl=row(live,seat,/Luke 1:34 \[CR3\]/),rp=row(pk,seat,/Luke 1:34 \[CR3\]/);const v=pk[0].json.sendback.vp3_trial;const listed=!!(v.would_remove[seat]||[]).find(x=>/^S1 /.test(x));
  console.log('\n'+name+'\n     live cure_status '+rl.cure_status+' | package cure_status '+rp.cure_status+'\n     '+tail(rp)+'\n     vp3_trial '+JSON.stringify(v));
  (globalThis.__ROWS=globalThis.__ROWS||[]).push(rp);
  T(rl.cure_status===rp.cure_status,name+': cure_status unchanged by the package');
  T(listed===expect&&(expect?/TWO READERS AGREE on Luke 1:34.*WOULD REMOVE chatgpt/.test(rp.cure_reason):true),name+': '+(expect?'LISTED (WOULD REMOVE chatgpt)':'not listed'));}
 console.log('\n'+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/w2_plant_VPD_rows.json',JSON.stringify(globalThis.__ROWS||[]));process.exit(bad?1:0);})().catch(e=>{console.error(e);process.exit(2);});
