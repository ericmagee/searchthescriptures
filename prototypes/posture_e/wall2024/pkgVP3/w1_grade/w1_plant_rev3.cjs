// W1 regrade of pkgVP3 rev 3: planted cases on run 34108 for the two rev 3 branches (built on W2's w2_plant_VP3.cjs helpers).
// The defender's rounds are edited so its answer to Luke 1:34 is truly bare; the judge's reply is edited to keep the grade.
const fs=require('fs');const H=require('../harness.cjs');const RUN='34108';let ok=0,bad=0;const T=(c,m)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+m);};
const P=JSON.parse(fs.readFileSync(__dirname+'/../parent_s90_VP3.json','utf8'));const by={};P.nodes.forEach(n=>by[n.name]=n);
let LV=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s90.json','utf8'));LV=LV.data||LV;LV=LV.workflow||LV;const lv={};LV.nodes.forEach(n=>lv[n.name]=n);
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
const row=(out,seat,re)=>out[0].json.sb_rows.find(r=>r.seat===seat&&re.test(r.item||''));
const tail=r=>{const s=String(r.cure_reason);const i=s.indexOf('TRIAL pkgVP3');return i<0?'(no VP3 note)':s.slice(i,i+330);};
(async()=>{
 const cases=[
  ['W1-A TRUE: grant + deferral to LINK 4; LINK 4 is short (under 25 words, no layers) and stands only in [CR4]',(()=>{const R=bareRounds(true,true);const L=R.CR3.split('\n');const s=L.findIndex(l=>/^\*\*LINK 4:/.test(l));const blk=L.splice(s,2);R.CR3=L.join('\n');R.CR4=R.CR4+'\n\n'+blk.join('\n');return R;})(),'chatgpt','S1','KEEP || The answer meets the press.',true],
  ['W1-B control: same, with LINK 4 short and in [CR3] (W2 T2 shape)',bareRounds(true,true),'chatgpt','S1','KEEP || The answer meets the press.',true],
  ['W1-C deferral to LINK 9, which no round holds (rev 3: not bare)',(()=>{const R=bareRounds(false,false);R.CR3=R.CR3.replace(/(^- Luke 1:34, "How shall this be[^\n]*?spoke\.)/m,'$1 I answer it fully under LINK 9.');return R;})(),'chatgpt','S1','KEEP || The answer meets the press.',false],
  ['W1-D deferral to its own round "[CR3]" (rev 3: a round with text, not bare)',(()=>{const R=bareRounds(false,false);R.CR3=R.CR3.replace(/(^- Luke 1:34, "How shall this be[^\n]*?spoke\.)/m,'$1 I answer it in [CR3].');return R;})(),'chatgpt','S1','KEEP || The answer meets the press.',false],
  ['W1-E deferral "in [CR4]", [CR4] holds text but nothing on her question (rev 3: not bare)',(()=>{const R=bareRounds(false,false);R.CR3=R.CR3.replace(/(^- Luke 1:34, "How shall this be[^\n]*?spoke\.)/m,'$1 I answer it fully in [CR4].');return R;})(),'chatgpt','S1','KEEP || The answer meets the press.',false]];
 for(const [name,R,seat,sid,reply,expect] of cases){const o=over(R,seat,sid,reply);
  const live=await H.run(lv['Send Back Record'].parameters.jsCode,RUN,'Send Back Call openrouter',o);const pk=await H.run(by['Send Back Record'].parameters.jsCode,RUN,'Send Back Call openrouter',o);
  const rl=row(live,seat,/Luke 1:34 \[CR3\]/),rp=row(pk,seat,/Luke 1:34 \[CR3\]/);const v=pk[0].json.sendback.vp3_trial;const listed=!!(v.would_remove[seat]||[]).find(x=>/^S1 /.test(x));
  console.log('\n'+name+'\n     live cure_status '+rl.cure_status+' | package cure_status '+rp.cure_status+'\n     '+tail(rp)+'\n     vp3_trial '+JSON.stringify(v));
  (globalThis.__ROWS=globalThis.__ROWS||[]).push(rp);
  T(rl.cure_status===rp.cure_status,name+': cure_status unchanged by the package');
  T(listed===expect&&(expect?/TWO READERS AGREE on Luke 1:34.*WOULD REMOVE chatgpt/.test(rp.cure_reason):true),name+': '+(expect?'LISTED (WOULD REMOVE chatgpt)':'not listed'));}
 console.log('\n'+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/w1_plant_rev3_rows.json',JSON.stringify(globalThis.__ROWS||[]));process.exit(bad?1:0);})().catch(e=>{console.error(e);process.exit(2);});
