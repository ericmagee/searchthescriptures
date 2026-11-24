// ASK 590 layer 2, the record run end to end (W4): the built Send Back Record source, one judge seat, stub inputs; nothing is fetched or written
const run=require(__dirname+'/rec590_probe.cjs');let pass=0,fail=0;const T=(id,ok,w)=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+id+' '+w);};
const it={sid:'S1',rule:'E-REVCLOSE',item:'reversed close sentence of the defender on Deuteronomy 22:24',line:'DEFENDER LINK 2 STANDS: the law counts her as a wife.',reason:'REVERSED CLOSE SENTENCE (E-REVCLOSE, ASK 590, ruling 427): ... counts against no seat.',rvc:{side:'DEFENDER',verse:'Deuteronomy 22:24'}};
const CNT=['silent_counted','ecol_counted','und_counted','abs_counted','pab_counted','mnp_counted','imp_counted','acx_counted','ksc_counted','b7_counted','dlu_counted'];
const none=j=>CNT.every(k=>!(j.sendback[k]||[]).length)&&!Object.keys((j.sendback.vp3_trial||{}).would_remove||{}).length;
(async()=>{
 const cases=[['KEEP','SENDBACK: S1 || KEEP || the earlier answer stands on its own words',{}],['CHANGE','SENDBACK: S1 || CHANGE TO: DEFENDER LINK 2 STANDS on the earlier answer alone || the close sentence is set aside',{}],['NO ANSWER (silent)','I have nothing to add.',{}],['NAMED, NOT READ','About S1: I considered it.',{}],['REPLY ERROR','',{err:true}]];
 const base=await run([],'x');const B=JSON.stringify(base[0].json.bodies);
 for(const [nm,txt,o] of cases){let j;try{j=(await run([it],txt,o))[0].json;}catch(e){T(nm,false,'threw '+e.message);continue;}const r=j.sb_rows.find(x=>x.rule==='E-REVCLOSE')||{};
  T(nm,none(j)&&JSON.stringify(j.bodies)===B&&/record-only, counts against no seat/.test(r.cure_reason||'')&&(nm==='KEEP'||nm==='CHANGE'?r.cure_status==='CURED':r.cure_status!=='UNCURED'),nm+': counted in no list ('+CNT.length+' count lists and the pkgVP3 trial), judges\' bodies unchanged, row recorded record-only; status '+r.cure_status+(nm==='NO ANSWER (silent)'?'; '+(/NO ANSWER: recorded; not counted/.test(r.cure_reason)?'says not counted':'MISSING note'):''));}
 // control: the harness does see a count -- the same silent reply on an E-ASSUME item is counted as silence
 const ac={...it,rule:'E-ASSUME',rvc:null,acx:{side:'DEFENDER',n:1,k:1,fact:'x'}};const jc=(await run([ac],'I have nothing to add.'))[0].json;
 T('CONTROL',(jc.sendback.silent_counted||[]).length===1,'control: the same silent reply on an E-ASSUME item is counted ('+JSON.stringify(jc.sendback.silent_counted)+'), so the harness sees counts');
 console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));})();
