// W3 grade of pkgGCP: one case, one workflow file, one process. usage: node w3_gcp.cjs <workflow> <case>
// Replay of execution 34626 on s111 with remapped replies; plants are made at Send Back Record's output (judgment text, send-back items, counted cure report line).
const chain=require('../../pkgKSR/w3_grade/chain.cjs');const {remap,gremap}=require('../../pkgKSR/w3_grade/w3_KSR_ECB.cjs');const L=require('./lib.cjs');const cl=x=>JSON.parse(JSON.stringify(x));
const W=process.argv[2],CASE=process.argv[3];
const esc=s=>JSON.stringify(s).slice(1,-1); // as the line sits inside the judge's JSON text
const BAD={ // pair -> [head of the stored line, planted line breaking rule B (one layer kind), send-back item sid]
 'D5 vs C4':['D5 vs C4 (Isaiah 7:14): STANDS -- ','D5 vs C4 (Isaiah 7:14): CHALLENGER LINK BROKEN -- the sign names a child conceived in the ordinary course. -- GROUND: [L1] Isaiah 7:14 “a virgin shall conceive”','S11'],
 'D2 vs C1':['D2 vs C1 (Matthew 1:19): STANDS -- ','D2 vs C1 (Matthew 1:19): CHALLENGER LINK BROKEN -- Joseph resolved to put her away. -- GROUND: [L1] Matthew 1:19 “was minded to put her away privily”','S6'],
 'D4 vs C3':['D4 vs C3 (Luke 1:35): UNDERDETERMINED -- ','D4 vs C3 (Luke 1:35): CHALLENGER LINK BROKEN -- the title follows the power. -- GROUND: [L1] Luke 1:35 “therefore also that holy thing”','S13']};
const STILL='D5 vs C4 (Isaiah 7:14): CHALLENGER LINK BROKEN -- the sign is a timing sign only. -- GROUND: [L1] Isaiah 8:3 “she conceived”';
const rep=(seat,item,rule,line,o)=>{o=o||{};return '[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: '+seat+'; ITEM: '+item+'; RULE: '+rule+'; RESULT: UNCURED;'+(o.nc?' NOT COUNTED (K-C UNCURED);':'')+' WHY: '+(o.why||'neither the RESPONSE nor the STATEMENT line corrects the line')+'; LINE: '+line.replace(/[“”]/g,'"').slice(0,300)+'...; STATEMENT: NOT HELD: '+item+'; JUDGE STATEMENT: '+(o.st||'The line stands as written.')+']';};
// case table: pairs to break, report lines to add, changes to items
const C={
 L0:{},
 P1:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4']]},
 P2:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4']],to:{S11:STILL}},
 P3:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4',{why:'no written response',st:'none written'}]]},
 P4:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-RUL','D5 vs C4',{why:'TRIAL rule, NO WRITTEN RESPONSE: counts in drv_uncured like a LIVE item (silence count): no written response',st:'none written'}]]},
 P5:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-C','D5 vs C4',{nc:true}]],add:0},
 P6:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','LINE:D3 vs C1 (Matthew 1:16): STANDS -- the narrowed claim is that Jesus was born of Mary; it does not say alone']]},
 P7:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4']],ans:{S11:'KEEP'}},
 P8:{bad:['D2 vs C1'],reps:[['D2 vs C1','K-B','D2 vs C1']]},
 P9:{bad:['D5 vs C4'],reps:[],fake:['D5 vs C4','K-B','D5 vs C4'],add:0},
 P10:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4']],to:{S11:'D5 vs C9 (Isaiah 7:14): UNDERDETERMINED -- the record leaves open how the sign’s child was conceived. -- GROUND: [L1] Isaiah 7:14 “a virgin shall conceive”'}},
 P10b:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4']],to:{S11:'The sign of Isaiah 7:14 is left open by the record.'}},
 P11:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4'],['D5 vs C4',process.env.W3_R2||'K-G4','D5 vs C4']]},
 P12:{bad:['D5 vs C4','D4 vs C3'],reps:[['D5 vs C4','K-B','D5 vs C4'],['D4 vs C3','K-B','D4 vs C3']],to:{S13:STILL.replace('D5 vs C4 (Isaiah 7:14)','D4 vs C3 (Luke 1:35)')}},
 P13:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4']],skip:true},
 P14:{seat:'sol',badsol:true,reps:[['D2 vs C1','K-B','D2 vs C1']]},
 P15:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4',{seat:'sol'}]]},
 P16:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-F','LINE:FORCED: D5 vs C4 -- MEANS (DR2): "the sign names a child" -- ANSWER (CR3): "a virgin shall conceive"']]},
 P17:{bad:['D2 vs C1'],reps:[['D2 vs C1','K-B','D2 vs C1']],und:'S6'},
 P18:{bad:['D5 vs C4'],reps:[['D5 vs C4','K-B','D5 vs C4'],['D5 vs C4','K-B','D5 vs C4']]},
};
const c=C[CASE];if(!c)throw new Error('case');const seat=c.seat||'luna';let diag='';
(async()=>{const after={'Send Back Call openrouter':remap('Send Back Call openrouter','Send Back Build'),'Gate Call openrouter':gremap,
 'Send Back Record':(over)=>{if(CASE==='L0')return;const o=cl(over['Send Back Record']);const J=o[0][0].json;const i=J.bodies.findIndex(b=>JSON.parse(b).payload.judge_seat===seat);const b=JSON.parse(J.bodies[i]);let raw=b.payload.verdict_raw;const lineOf={};
  const cut=raw.indexOf('\n');let jt=raw.slice(0,cut),au=raw.slice(cut);
  const swap=(head,bad,sid)=>{const a=jt.indexOf(esc(head));if(a<0)throw new Error('plant: line not found '+head);let e=jt.indexOf('\\n',a);const old=jt.slice(a,e);jt=jt.slice(0,a)+esc(bad)+jt.slice(e);const it=J.sb_items.find(x=>x.seat===seat&&x.sid===sid);if(!it)throw new Error('plant: item '+sid);it.line=bad;return old;};
  if(c.badsol){const a=jt.indexOf('D2 vs C1 (Matthew 1:19-21');const head=jt.slice(a,jt.indexOf(': ',a)+2);const bad=JSON.parse('"'+head+'"')+'CHALLENGER LINK BROKEN -- Joseph resolved to put her away. -- GROUND: [L1] Matthew 1:19 “was minded to put her away privily”';swap(JSON.parse('"'+head+'"'),bad,'S4');lineOf['D2 vs C1']=bad;}
  for(const p of c.bad||[]){const [h,bad,sid]=BAD[p];swap(h,bad,sid);lineOf[p]=bad;}
  for(const [sid,to] of Object.entries(c.to||{}))J.sb_items.find(x=>x.seat===seat&&x.sid===sid).to=to;
  for(const [sid,a] of Object.entries(c.ans||{})){const it=J.sb_items.find(x=>x.seat===seat&&x.sid===sid);it.ans=a;it.to='';}
  let n=0;for(const [item,rule,lp,o] of c.reps||[]){const line=lp.startsWith('LINE:')?lp.slice(5):lineOf[lp];au+='\n'+rep((o&&o.seat)||seat,item,rule,line,o);n++;}
  if(c.fake){const f=rep(seat,c.fake[0],c.fake[1],lineOf[c.fake[2]]);const k=jt.lastIndexOf('"}');jt=jt.slice(0,k)+'\\n'+esc(f)+jt.slice(k);}
  if(c.und)au+='\n[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) -- SEAT: '+seat+'; ITEMS: '+c.und+' (E-HOLD on UNDERDETERMINED COLLISION D2 vs C1: kept UNDERDETERMINED; no counted [L1]); counted in drv_uncured. REVIEW THIS ROW.]';
  b.payload.verdict_raw=jt+au;b.payload.drv_uncured=(b.payload.drv_uncured||0)+(c.add==null?n:c.add)+(c.und?1:0);J.bodies[i]=JSON.stringify(b);over['Send Back Record']=o;},
 'Gate Record':(over,out)=>{try{const G=L(W,out);const SB=out('Send Back Record')[0][0].json,GR=over['Gate Record'][0][0].json,PB0=out('Panel Build')[0][0].json;const p=JSON.parse(SB.bodies.find(b=>JSON.parse(b).payload.judge_seat===seat)).payload;const its=(GR.sb_items||[]).filter(x=>x.seat===seat);const j=PB0.judges.find(q=>q.seat===seat);const PT=G.gatePromptText2024(j.body);const ctx={R:G.ciRounds(PT),DL:G.drvLinks(PT),ask:PT.includes('CITATION CHECK')};const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
   const R=G.sbApply2024(seat,p.verdict_raw,F,its,ctx.R);const K=G.gateNewK2024(G.cureJText(p.verdict_raw,true),R.text,F,R.fields,ctx);const k=x=>x.rule+'|'+(x.link||'');const pr=/D5 vs C4|D2 vs C1|D4 vs C3/;
   diag='applied '+R.applied.join(',')+(K.a?' | before '+K.a.map(k).filter(s=>pr.test(s)).join(';')+' | after '+K.b.map(k).filter(s=>pr.test(s)).join(';'):'')+' | new gate K items '+(K.items||[]).map(k).join(';');}catch(e){diag='diag error '+e.message;}}};
 if(c.skip)after['Gate Build']=(over)=>{over['Gate Build']=[[{json:{gate_skip:true,gate_why:'PLANT: gate skipped',gate_report:[]}}]];};
 const r=await chain(W,{after});const GR=r.over['Gate Record'][0][0].json;const row=r.rows.find(x=>(x.judge_seat||x.seat)===seat);
 const fin=String(row.verdict_raw.slice(0,row.verdict_raw.indexOf('\n'))).split('\\n').filter(l=>/^(D5 vs C4|D2 vs C1|D4 vs C3)/.test(l)).map(l=>l.slice(0,90));
 console.log(JSON.stringify({case:CASE,seat,counts:r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' '),u:row.drv_uncured,marks:(row.verdict_raw.match(/\[AUDIT v52[^\]]*\]/g)||[]),gate:GR.gate&&(GR.gate.skipped?'skipped':GR.gate.seats),alt_needed:GR.alt_needed,gate_rows:JSON.stringify(GR.gate_rows||[]),sb_rows:JSON.stringify(GR.sb_rows||r.over['Send Back Record'][0][0].json.sb_rows||[]).length,rows:chain.nt(r.rows.map(x=>Object.assign({},x,{verdict_raw:String(x.verdict_raw).replace(/\n\[AUDIT v52[^\]]*\]/g,'')}))),fin,diag}));
})().catch(e=>{console.log(JSON.stringify({case:CASE,err:String(e.message||e)}));});
