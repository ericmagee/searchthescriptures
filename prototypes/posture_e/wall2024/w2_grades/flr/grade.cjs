const {run,mask,rdOf}=require('./run.cjs');
const L='fetchback_live_s149.json',F='parent_s149_FLR.json',J='parent_s149_JOINT_SDS_FLR.json',S='parent_s149_SDS.json';
const summ=o=>{try{const j=(Array.isArray(o)?o:[]).map(x=>x.json);const t=JSON.stringify(j);const tried=[];JSON.parse(t,(k,v)=>{if(v&&v.alternate!==undefined&&v.result)tried.push(v.alternate+':'+v.result);return v;});return {nocure:(t.match(/no cure call was made for this alternate/g)||[]).length,tried:[...new Set(tried)].join(' '),mark:(t.match(/PLANTMARK/g)||[]).length};}catch(e){return String(o).slice(0,120);}};
(async()=>{
 const fs=require('fs');const exs=fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f)&&f!=='ex35379_full.json');
 console.log('1. stored exports, live vs FLR vs JOINT (JOINT compared with SDS parent):');
 for(const ex of exs){const rd=rdOf(ex);for(const n of ['Alternate Merge Seat','R2 Alternate Merge Seat']){if(!rd[n])continue;const a=await run(L,n,ex),b=await run(F,n,ex),s=await run(S,n,ex),j=await run(J,n,ex);console.log('  ',ex,n,'live==FLR',mask(a)===mask(b),'SDS==JOINT',mask(s)===mask(j),JSON.stringify(summ(a)));}}
 // plants on 35296 Alternate Cure Normalize (one run, argon k=1)
 const ex='ex35296_full.json';const rd=rdOf(ex);const base=rd['Alternate Cure Normalize'][0];const it=base.data.main[0][0].json;
 const mk=items=>({...base,data:{main:[items.map(j=>({json:j}))]}});
 const other={...it,cure:{...it.cure,k:0},reply:{ok:true,text:'RESPONSE: K-W X | NOT HELD',why:''}};
 const marked={...it,reply:{...it.reply,text:String(it.reply&&it.reply.text||'')+'\nPLANTMARK'}};
 const P={
  'P1 one run [argon]':[mk([it])],
  'P2 [argon,other] then [other] (35379 shape)':[mk([it,other]),mk([other])],
  'P3 [argon,other] then [argon]':[mk([it,other]),mk([it])],
  'P4 [argon] then [argon marked] (latest wins)':[mk([it]),mk([marked])],
  'P5 [argon,other] then [] (empty last run)':[mk([it,other]),mk([])],
  'P6 three runs [argon,other],[other],[other]':[mk([it,other]),mk([other]),mk([other])],
 };
 console.log('2. plants on 35296 Alternate Merge Seat:');
 for(const [k,v] of Object.entries(P)){const pl={'Alternate Cure Normalize':v};const a=await run(L,'Alternate Merge Seat',ex,pl),b=await run(F,'Alternate Merge Seat',ex,pl),j=await run(J,'Alternate Merge Seat',ex,pl);console.log('  ',k.padEnd(46),'live',JSON.stringify(summ(a)),'| FLR',JSON.stringify(summ(b)),'| JOINT',JSON.stringify(summ(j)));}
 // R2 plant on 35296: haiku k=0 run0 and run1 exist; make run1 empty of haiku
 const r2=rd['R2 Alternate Cure Normalize'];const h=r2[0].data.main[0][0].json;const mk2=items=>({...r2[0],data:{main:[items.map(j=>({json:j}))]}});
 const oth={...h,cure:{...h.cure,k:1}};
 const pl2={'R2 Alternate Cure Normalize':[mk2([h,oth]),mk2([oth])]};
 const a=await run(L,'R2 Alternate Merge Seat',ex,pl2),b=await run(F,'R2 Alternate Merge Seat',ex,pl2);console.log('3. R2 plant [haiku,other] then [other]: live',JSON.stringify(summ(a)),'| FLR',JSON.stringify(summ(b)));
})();
