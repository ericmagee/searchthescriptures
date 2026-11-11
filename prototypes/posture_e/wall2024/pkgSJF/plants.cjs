// pkgSJF plants: real s136 Verdict Normalizer + Extract Independent Verdict on 35067 inputs, then SJ Re-ask? and SJ Re-ask Build, base s136 vs SJF.
const fs=require('fs');const W='/mnt/project-files/';
const ld=f=>{let D=JSON.parse(fs.readFileSync(f,'utf8'));D=D.data||D;return D.workflow||D;};
const S=ld(W+'wall2024/fetchback_live_s136.json'),F=ld(W+'wall2024/parent_s136_SJF.json');
const X=JSON.parse(fs.readFileSync(W+'wall2024/ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const code=(D,n)=>D.nodes.find(x=>x.name===n).parameters.jsCode;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(D,over)=>{const lo=n=>{if(n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return n=>{const o=lo(n)||[];const nd=D.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};};};
const ifEval=(D,$,j)=>{const e=D.nodes.find(n=>n.name==='SJ Re-ask?').parameters.conditions.conditions[0].leftValue.replace(/^=\{\{/,'').replace(/\}\}$/,'');return new Function('$','$json','return ('+e+');')($,j);};
const base=rd['Verdict Call openrouter'].slice(-1)[0].data.main[0][0].json;const t35=base.choices[0].message.content;
const a74=JSON.parse(fs.readFileSync(W+'w4/ask74/reply.json','utf8'));const t74=(a74.body||a74).choices[0].message.content;
const X2=JSON.parse(fs.readFileSync(W+'wall2024/ex34726_full.json','utf8'));const t726=(X2.data||X2).resultData.runData['Verdict Call openrouter'].slice(-1)[0].data.main[0][0].json.choices[0].message.content;
const tc357=fs.readFileSync(__dirname+'/c357_reply.txt','utf8');
const cpStart=t35.search(/^[ \t]*COLLISION POINTS\b/m);
const noCP35=(()=>{const L=t35.split('\n');const i=L.findIndex(x=>/^[ \t]*COLLISION POINTS\b/.test(x));let j=i+1;while(j<L.length&&!/^[ \t]*[A-Z][A-Z \-]{6,}:/.test(L[j])||(j<L.length&&/^[ \t]*D\d/.test(L[j])))j++;return L.slice(0,i).concat(L.slice(j)).join('\n');})();
const declineWord='BROKEN -- provisional. I cannot complete the collision rulings, the premise counts or the ruling cards from the record supplied: the individual answer checks were not given to me. On what I can read, the defender\'s chain does not reach its keystone.';
const P=[
 ['P1 stored 35067 reply (full judgment)',t35,'none','none'],
 ['P2 ASK 74 reply (verdict-word decline)',t74,'MARKS','FULL'],
 ['P3 34726 reply (partial with LIMITATION)',t726,'none','none'],
 ['P4 35067 judgment in gemini form {"reasoning","verdict"} plain',JSON.stringify({reasoning:t35,verdict:'BROKEN. '+t35.slice(0,200)},null,2),'MARKS','FULL'],
 ['P5 the same, fenced ```json',"```json\n"+JSON.stringify({reasoning:t35,verdict:'BROKEN. '+t35.slice(0,200)},null,2)+"\n```",'MARKS','FULL'],
 ['P6 stored 34108 row c357d23f (terra JSON decline, UNKNOWN)',tc357,'FULL','FULL'],
 ['P7 planted verdict-word decline, no marks, no collision points',declineWord,'MARKS','FULL'],
 ['P8 35067 judgment with its COLLISION POINTS block cut out (marks kept)',noCP35,'none','FULL'],
 ['P9 35067 with heading written **COLLISION POINTS:** (bold)',t35.replace(/^([ \t]*)COLLISION POINTS:?/m,'$1**COLLISION POINTS:**'),'none','none'],
 ['P10 35067 with heading written "4. COLLISION POINTS:" (numbered)',t35.replace(/^([ \t]*)COLLISION POINTS:?/m,'$14. COLLISION POINTS:'),'none','FULL'],
 ['P11 35067 with heading written "## COLLISION POINTS" (markdown)',t35.replace(/^([ \t]*)COLLISION POINTS:?/m,'$1## COLLISION POINTS'),'none','none'],
 ['P12 35067 with "COLLISION POINTS: NONE" and no entries',noCP35.replace(/(\n)(CHALLENGER CHAIN MARK|DEFENDER CHAIN MARK)/,'\nCOLLISION POINTS: NONE\n$1$2'),'none','none'],
];
(async()=>{let fail=0;const rows=[];
for(const [label,t,expB,expF] of P){
 const call=[{json:Object.assign({},base,{choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:t}}]})}];
 const res={};
 for(const [k,D] of [['s136',S],['SJF',F]]){
  const over={'Verdict Call openrouter':call,'SJ Re-ask Build':null};
  const vn=await runSrc(code(D,'Verdict Normalizer'),mk(D,over),call);over['Verdict Normalizer']=vn;
  const ev=await runSrc(code(D,'Extract Independent Verdict'),mk(D,over),vn);over['Extract Independent Verdict']=ev;const j=ev[0].json;
  const fire=ifEval(D,mk(D,over),j);let mode='none',miss=[],ask='';
  if(fire){const b=(await runSrc(code(D,'SJ Re-ask Build'),mk(D,over),ev))[0].json;mode=b.sjr.mode.toUpperCase();miss=b.sjr.miss;ask=b.sjr.ask;
   // once per run: with SJ Re-ask Build executed, the gate must stay shut
   over['SJ Re-ask Build']=[{json:b}];if(ifEval(D,mk(D,over),j))throw new Error('fired twice: '+label);}
  res[k]={tag:j.verdict_tag,marks:[j.defender_chain_mark,j.challenger_chain_mark].join('/'),flag:/COLLISION MAP: NO COLLISION POINTS SECTION/.test(String(j.independent_verdict_raw||'')),ap:j.audit_prompt,mode,miss,ask};
 }
 const okB=expB==='?'||res.s136.mode.toUpperCase()===expB.toUpperCase(),okF=expF==='?'||res.SJF.mode.toUpperCase()===expF.toUpperCase();if(!okB||!okF)fail++;
 console.log((okB&&okF?'OK  ':'FAIL')+' '+label+'\n     tag '+res.SJF.tag+' | marks '+res.SJF.marks+' | flag '+res.SJF.flag+' | prompt '+res.SJF.ap+' | s136 '+res.s136.mode+' -> SJF '+res.SJF.mode+(res.SJF.miss.length?' | miss: '+res.SJF.miss.join('; '):''));
 rows.push({label,res});
}
// panel judge (jidx not 5) must never fire
{const t=t74;const call=[{json:Object.assign({},base,{choices:[{index:0,finish_reason:'stop',message:{role:'assistant',content:t}}]})}];const over={'Verdict Call openrouter':call,'SJ Re-ask Build':null};
 const vn=await runSrc(code(F,'Verdict Normalizer'),mk(F,over),call);over['Verdict Normalizer']=vn;const ev=await runSrc(code(F,'Extract Independent Verdict'),mk(F,over),vn);
 const biv=rd['Build Independent Verdict'].slice(-1)[0].data.main[0];over['Build Independent Verdict']=[{json:{...biv[0].json,jidx:2}}];
 const f=ifEval(F,mk(F,over),ev[0].json);console.log((f?'FAIL':'OK  ')+' P13 ASK 74 reply with jidx 2 (not the single judge): gate '+f);if(f)fail++;}
// FULL ask text for P2 under SJF, and the MARKS ask text under s136, for the record
const p2=rows[1].res;fs.writeFileSync(__dirname+'/ask_texts_out.txt','SJF P2 FULL ask:\n'+p2.SJF.ask+'\n\ns136 P2 MARKS ask:\n'+p2.s136.ask+'\n');
console.log('FAIL count',fail);})().catch(e=>{console.error(e);process.exit(1);});
