// pkgRAC rev 1 builder's tests (W3). node pkgRAC/test_RAC.cjs > pkgRAC/test_RAC.txt
// T1 connections; T2 Close Enforcer Build on every stored debate (candidates, size); T3 Close Enforcer Record on planted replies;
// T4 Panel Build and Build Independent Verdict: equal to live where no pair is involved, the three endings where one is; T5 failure paths.
process.chdir(__dirname+'/..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s106.json'),CAND=g('pkgRAC/parent_s106_RAC.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
// run one node's code on a stored debate; over = node name -> items (or null for "not executed"); W gives params.jsCode of any node
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
let fails=0;const ok=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)fails++;};

// ---------- T1 connections
{const C=CAND.connections,L=LIVE.connections;const inc=W=>{const o={};for(const k in W)for(const [i,a] of (W[k].main||[]).entries())for(const x of a||[])(o[x.node]=o[x.node]||[]).push(k+'#'+i);return o;};const I=inc(C);
 ok(JSON.stringify(I['Anticheat Build'])==='["Quote Report#0"]','T1 Anticheat Build is fed by Quote Report only: '+JSON.stringify(I['Anticheat Build']));
 ok(JSON.stringify(I['Close Enforcer Build'])==='["Anticheat Only?#1"]','T1 Close Enforcer Build is fed by the anti-cheat check (false branch of Anticheat Only?) only: '+JSON.stringify(I['Close Enforcer Build']));
 ok(JSON.stringify((I['Panel Build']||[]).sort())==='["Check Save#0","Regrade After Quotes?#0"]','T1 Panel Build is fed by Check Save and the regrade branch: '+JSON.stringify(I['Panel Build']));
 ok(JSON.stringify(I['Build Independent Verdict'])==='["Regrade After Quotes?#1"]','T1 Build Independent Verdict feed unchanged');
 let diff=0;const keys=new Set([...Object.keys(C),...Object.keys(L)]);const ch=[];for(const k of keys)if(JSON.stringify(C[k])!==JSON.stringify(L[k])){diff++;ch.push(k);}
 ok(diff===4,'T1 exactly four connection sources differ from live: '+ch.join(', '));
 // walk: order on the live path and on the regrade path
 const walk=(start,pick)=>{const seq=[];let cur=start,n=0;while(cur&&n++<400){seq.push(cur);const m=(C[cur]||{}).main||[];const o=pick(cur,m);cur=o;}return seq;};
 const live=walk('Quote Report',(k,m)=>{if(k==='Anticheat Needed?')return m[0][0].node;if(k==='Anticheat Only?')return m[1][0].node;if(k==='Close Enforcer Needed?')return m[0][0].node;if(k==='Regrade After Quotes?')return m[1][0].node;if(k==='Build Independent Verdict')return null;return m[0]&&m[0][0]?m[0][0].node:null;});
 ok(live.join(' > ')==='Quote Report > Anticheat Build > Anticheat Needed? > Anticheat Call deepseek > Anticheat Record > Anticheat Only? > Close Enforcer Build > Close Enforcer Needed? > Close Enforcer Call deepseek > Close Enforcer Record > Regrade After Quotes? > Build Independent Verdict','T1 live path: '+live.join(' > '));
 const dnodes=n=>JSON.stringify(n.parameters)+n.type;let nd=[];for(const n of CAND.nodes){const l=LIVE.nodes.find(z=>z.name===n.name);if(!l||dnodes(l)!==dnodes(n))nd.push(n.name);}
 ok(nd.sort().join(', ')==='Build Independent Verdict, Close Enforcer Build, Close Enforcer Record, Panel Build','T1 nodes that differ from live: '+nd.join(', '));}

// ---------- T2 Close Enforcer Build on every stored debate
const runs=fs.readdirSync(IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F,extra)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null,...extra});
const mrg=a=>{const j=a.map(x=>x.json);return j[0].cec_skip?{cec_skip:true}:{cec_skip:false,items:j,cands:j.flatMap(b=>b.cands||[]),not_sent:j[0].not_sent||[],links:j[0].links,body:{messages:[{content:j[0].body.messages[0].content},{content:j.map(b=>b.body.messages[1].content).join("\n")}]}};};
const builds={};{let n=0,withA=0,withR=0,nA=0,nR=0,grow=0,base=0,ns=0,calls0=0,calls1=0,same=0;const per=[];
 for(const r of runs){const F=getF(r);if(!F)continue;let L,Cn;try{L=mrg(run(LIVE,r,'Close Enforcer Build',BO(r,F)));Cn=mrg(run(CAND,r,'Close Enforcer Build',BO(r,F)));}catch(e){console.log('   '+r+' ERROR '+e.message);fails++;continue;}
  if(L.cec_skip||Cn.cec_skip){ok(L.cec_skip===Cn.cec_skip,'T2 '+r+' skip equal');continue;}n++;builds[r]={F,L,C:Cn};
  const pl=L.body.messages[1].content,pc=Cn.body.messages[1].content;const A=Cn.cands.filter(c=>/^A/.test(c.id)),R=Cn.cands.filter(c=>/^R/.test(c.id));
  if(A.length)withA++;if(R.length)withR++;nA+=A.length;nR+=R.length;grow+=pc.length-pl.length;base+=pl.length;ns+=Cn.not_sent.length;if(!A.length&&!R.length&&pc===pl)same++;
  if(A.length||R.length||Cn.not_sent.length)per.push(r+': A '+A.length+', R '+R.length+', not sent '+Cn.not_sent.length+', prompt +'+(pc.length-pl.length)+(Cn.not_sent.length?' ['+Cn.not_sent.join(' | ')+']':''));
  // every candidate's two quotations stand in the round named, by the Record's own test
  const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();const RK={CR1:'cr1',CR2:'cr2',CR3:'cr3',CR4:'cr4',DR1:'gr1',DR2:'gr2',DR3:'dr3',DR4:'dr4'};
  for(const c of A.concat(R)){if(!(N(F[RK[c.earlier_round]]).includes(N(c.earlier_q))&&N(F[RK[c.closing_round]]).includes(N(c.closing_q)))){ok(false,'T2 '+r+' '+c.id+' a quotation does not stand in its round');}}
  // system prompt, model, links and the Oracle's candidates unchanged
  if(JSON.stringify(L.links)!==JSON.stringify(Cn.links)||L.body.messages[0].content!==Cn.body.messages[0].content||JSON.stringify(L.cands)!==JSON.stringify(Cn.cands.filter(c=>/^X/.test(c.id))))ok(false,'T2 '+r+' links, system text or Oracle candidates changed');}
 console.log('T2 stored debates built: '+n+'; prompt equal to live where no pair: '+same+'; debates with anti-cheat candidates '+withA+' ('+nA+' pairs), with reversal candidates '+withR+' ('+nR+' pairs); pairs not sent '+ns);
 console.log('T2 prompt growth over the '+n+' stored closing enforcer calls: +'+grow+' characters on '+base+' (+'+(100*grow/base).toFixed(3)+'%); mean +'+Math.round(grow/n)+' per debate');per.forEach(x=>console.log('   '+x));
 ok(same+per.length>=n,'T2 every debate either equals live or carries a pair');}

// ---------- T3 Record on planted replies (34108: the "ordinary means" reversal pair; a debate with an anti-cheat pair)
const rep=t=>t==null?J({error:{message:'timeout'}}):J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
const rec=(r,F,B,t)=>{const its=B.items.map((b,k)=>k===0?{...b,not_sent:B.not_sent}:b);const reps=its.map(b=>t==null?rep(null):rep((String(t).split('\n').filter(l=>l.includes('-- '+b.side+' --')||(/NONE|you name it|97/.test(l)&&l.includes(b.side))).join('\n'))||'CLOSE-CONTRADICTION: NONE'));return run(CAND,r,'Close Enforcer Record',{'Final Output':[J(F)],'Regrade Load':null,'Close Enforcer Build':its.map(J),'Close Enforcer Call deepseek':reps},'Close Enforcer Call deepseek')[0].json;};
const line=(c,link,ans)=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+link+' -- '+ans+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.';
const show=(n,R)=>{console.log(n);console.log('   confirmed: '+JSON.stringify(R.cec.confirmed.map(c=>c.id+' '+c.side+' LINK '+c.link))+' | no_answer: '+JSON.stringify(R.cec.no_answer));R.cec_log.forEach(x=>console.log('   LOG "'+x.item+'" | '+String(x.cure_reason).slice(0,150)));return R;};
const B8=builds['34108'];const RV=B8&&B8.C.cands.find(c=>/^R/.test(c.id));ok(!!RV,'T3 34108 carries a reversal candidate: '+(RV?RV.id+' EARLIER ['+RV.earlier_round+'] "'+RV.earlier_q.slice(0,70)+'" CLOSING "'+RV.closing_q.slice(0,70)+'"':'none'));
const acRun=Object.keys(builds).find(r=>builds[r].C.cands.some(c=>/^A/.test(c.id)));const BA=builds[acRun];const AC=BA.C.cands.find(c=>/^A/.test(c.id));console.log('T3 anti-cheat debate used: '+acRun+', candidate '+AC.id+' '+AC.side);
const lk=(B,c)=>(B.C.links[c.side]||[])[0];
let R;
R=show('P1 reversal pair CONFIRMED with a declared link (expect: link broken)',rec('34108',B8.F,B8.C,line(RV,lk(B8,RV),'CONFIRMED')));ok(R.cec.confirmed.length===1&&R.cec.confirmed[0].id===RV.id,'P1');
R=show('P2 reversal pair NOT A CONTRADICTION (expect: nothing broken, answered)',rec('34108',B8.F,B8.C,line(RV,lk(B8,RV),'NOT A CONTRADICTION')));ok(!R.cec.confirmed.length&&!R.cec.no_answer.includes(RV.id),'P2');
R=show('P3 enforcer answers NONE and skips the candidate (expect: NO ANSWER row for it)',rec('34108',B8.F,B8.C,'CLOSE-CONTRADICTION: NONE'));ok(R.cec.no_answer.includes(RV.id)&&R.cec_log.some(x=>x.item===RV.id&&/NO ANSWER/.test(x.cure_reason)),'P3');
R=show('P4 enforcer echoes "LINK (you name it)" (expect: unreadable line recorded, candidate NO ANSWER, nothing broken)',rec('34108',B8.F,B8.C,line(RV,'(you name it)','CONFIRMED')));ok(!R.cec.confirmed.length&&R.cec.no_answer.includes(RV.id),'P4');
R=show('P5 CONFIRMED with a link the side never declared (expect: NOT CONFIRMED (form), nothing broken)',rec('34108',B8.F,B8.C,line(RV,97,'CONFIRMED')));ok(!R.cec.confirmed.length,'P5');
R=show('P6 anti-cheat pair CONFIRMED (expect: link broken)',rec(acRun,BA.F,BA.C,line(AC,lk(BA,AC),'CONFIRMED')));ok(R.cec.confirmed.length===1&&R.cec.confirmed[0].id===AC.id,'P6');
R=show('P7 anti-cheat pair answered both ways (expect: conflicting answers, nothing broken)',rec(acRun,BA.F,BA.C,line(AC,lk(BA,AC),'CONFIRMED')+'\n'+line(AC,lk(BA,AC),'NOT A CONTRADICTION')));ok(!R.cec.confirmed.length,'P7');
R=show('P8 call fails (expect: NOT CHECKED, candidates NO ANSWER)',rec(acRun,BA.F,BA.C,null));ok(!R.cec.confirmed.length&&R.cec.no_answer.includes(AC.id),'P8');
R=show('P9 CONFIRMED but the enforcer changes one word of the closing quotation (expect: NOT CONFIRMED (form))',rec(acRun,BA.F,BA.C,line({...AC,closing_q:AC.closing_q.replace(/\b(\w{5,})\b/,'$1zz')},lk(BA,AC),'CONFIRMED')));ok(!R.cec.confirmed.length,'P9');
// rows for the rolled-back insert
fs.writeFileSync('pkgRAC/rows_RAC.json',JSON.stringify(rec('34108',B8.F,{...B8.C,not_sent:['R19 DEFENDER (the close-round reversal check): the earlier quotation stands in no single round']},line(RV,lk(B8,RV),'CONFIRMED')).cec_log.map(x=>({...x,prompt_sent:x.prompt_sent?'[test]':x.prompt_sent,full_reply:x.full_reply?'[test]':x.full_reply}))));

(async()=>{
// ---------- T4 Panel Build and Build Independent Verdict
const txt=o=>JSON.stringify(o);
const cecOut=(B,t,r,F)=>[J(rec(r,F,B,t))];
{let eq=0,dif=0,err=0,n=0;const differ=[];
 for(const r of runs){if(!saved(r,'Panel Build'))continue;let L,Cn;try{L=txt(await run(LIVE,r,'Panel Build',{}));}catch(e){err++;continue;}n++;try{Cn=txt(await run(CAND,r,'Panel Build',{}));}catch(e){ok(false,'T4 '+r+' candidate Panel Build throws: '+e.message);continue;}
  if(L===Cn)eq++;else{dif++;differ.push(r);const hasPair=/ANTI-CHEAT CHECK --|CLOSE-ROUND REVERSAL CHECK --/.test(L);
   const strip=s=>s.replace(/"transcript_chars":\d+/g,'"transcript_chars":N' /* a length count; it moves with the sentence */).replace(/Where the close takes the grant back, the earlier grant stands and the close sentence is DISREGARDED as footing\./g,'@').replace(/The close sentence is disregarded; grade this side\\'s earlier answer on [^\]]*? on its own words, against the verse\./g,'@').replace(/The close sentence is disregarded; grade this side's earlier answer on [^\]]*? on its own words, against the verse\./g,'@').replace(/(The closing enforcer examined (?:this pair|these pairs) and did not confirm a contradiction\. )?The close sentence is not footing for any link; grade this side(?:\\'|')s earlier answer on its own words, against the verse\./g,'@');
   if(!(hasPair&&strip(L)===strip(Cn))){const a=strip(L),b=strip(Cn);let i=0;while(a[i]===b[i])i++;console.log('   first difference at '+i+': LIVE ...'+a.slice(Math.max(0,i-120),i+200)+'\n   CAND ...'+b.slice(Math.max(0,i-120),i+200));}ok(hasPair&&strip(L)===strip(Cn),'T4 '+r+' differs from live only in the last sentence of a check block');}}
 console.log('T4 Panel Build with stored inputs (stored closing enforcer rows hold no A or R id, so every pair reads "not examined"): '+n+' debates run, '+eq+' equal to live, '+dif+' differ (a block is present: '+differ.join(' ')+'), '+err+' not runnable on live either');}
{let eq=0,dif=0,err=0,n=0,acx=0;
 for(const r of runs){if(!saved(r,'Build Independent Verdict'))continue;let L,Cn,C2;try{L=txt(await run(LIVE,r,'Build Independent Verdict',{'Anticheat Record':null}));}catch(e){err++;continue;}n++;
  try{Cn=txt(await run(CAND,r,'Build Independent Verdict',{'Anticheat Record':null}));const AR=saved(r,'Anticheat Record')||(BA&&saved(acRun,'Anticheat Record'));C2=txt(await run(CAND,r,'Build Independent Verdict',{'Anticheat Record':AR}));}catch(e){ok(false,'T4 '+r+' candidate Build Independent Verdict throws: '+e.message);continue;}
  if(/ANTI-CHEAT CHECK --/.test(C2))acx++;if(C2!==Cn)ok(false,'T4 '+r+' single judge prompt changes when the anti-cheat check has run');
  if(L===Cn)eq++;else{dif++;ok(/CLOSE-ROUND REVERSAL CHECK --/.test(L)&&L.replace(/Where the close takes the grant back, the earlier grant stands and the close sentence is DISREGARDED as footing\./g,'@')===Cn.replace(/The close sentence is not footing for any link; grade this side(?:\\'|')s earlier answer on its own words, against the verse\./g,'@'),'T4 '+r+' single judge prompt differs only in the reversal block ending');}}
 console.log('T4 Build Independent Verdict: '+n+' debates run, '+eq+' equal to live, '+dif+' differ, '+err+' not runnable; prompts holding an anti-cheat block with the check executed: '+acx);ok(acx===0,'T4 the single judge is never shown the anti-cheat block');}
// the three endings, Panel Build, on 34108 (reversal) and the anti-cheat debate
const pb=async(r,B,F,t)=>txt(await run(CAND,r,'Panel Build',{'Close Enforcer Build':B.items.map(J),'Close Enforcer Record':cecOut(B,t,r,F)}));
const cnt=(s,re)=>(s.match(re)||[]).length;
{const r='34108',B=B8.C,F=B8.F;const RVs=B.cands.filter(c=>/^R/.test(c.id));console.log('T4 34108 reversal candidates: '+RVs.map(c=>c.id).join(', '));
 let s=await pb(r,B,F,RVs.map(c=>line(c,lk(B8,c),'NOT A CONTRADICTION')).join('\n'));ok(cnt(s,/The closing enforcer examined (this pair|these pairs) and did not confirm a contradiction\. The close sentence is not footing for any link/g)>=1&&!/DISREGARDED as footing/.test(s),'P10 every reversal pair examined and not confirmed: the approved sentence ends the block (count '+cnt(s,/The closing enforcer examined/g)+' over the judge prompts)');
 s=await pb(r,B,F,RVs.map(c=>line(c,lk(B8,c),'CONFIRMED')).join('\n'));const one=cnt(s,/CLOSE-ROUND REVERSAL CHECK --/g);ok(/CONFIRMED CLOSING CONTRADICTIONS --/.test(s),'P11 confirmed: the CONFIRMED CLOSING CONTRADICTIONS block is printed');
 const conf=JSON.parse(JSON.stringify(cecOut(B,RVs.map(c=>line(c,lk(B8,c),'CONFIRMED')).join('\n'),r,F)))[0].json.cec;const kept=RVs.filter(c=>!conf.rows.some(x=>x.id===c.id&&x.status==='CONFIRMED'));console.log('   confirmed rows: '+conf.rows.map(x=>x.id+' '+x.status+(x.note?' ('+x.note+')':'')).join('; '));
 ok(kept.length?one>0:one===0,'P11 a confirmed pair leaves the reversal block (pairs still listed: '+kept.length+', blocks printed: '+one+')');
 s=await pb(r,B,F,'CLOSE-CONTRADICTION: NONE');ok(!/The closing enforcer examined/.test(s)&&cnt(s,/The close sentence is not footing for any link/g)>=1,'P12 not answered: the block ends with the second sentence only');
 s=await pb(r,B,F,null);ok(!/The closing enforcer examined/.test(s)&&cnt(s,/The close sentence is not footing for any link/g)>=1,'P13 the enforcer call failed: second sentence only');
 if(RVs.length>1){s=await pb(r,B,F,line(RVs[0],lk(B8,RVs[0]),'NOT A CONTRADICTION'));ok(!/The closing enforcer examined/.test(s),'P14 one of several pairs unanswered: the "examined" sentence is not printed for the block');}}
{const r=acRun,B=BA.C,F=BA.F;const AR=saved(r,'Anticheat Record');const ACs=B.cands.filter(c=>/^A/.test(c.id));console.log('T4 '+r+' anti-cheat candidates: '+ACs.map(c=>c.id).join(', '));
 const pba=async t=>txt(await run(CAND,r,'Panel Build',{'Anticheat Record':AR,'Close Enforcer Build':B.items.map(J),'Close Enforcer Record':cecOut(B,t,r,F)}));const blocks=s=>cnt(s,/ANTI-CHEAT CHECK --/g);
 const s0=txt(await run(LIVE,r,'Panel Build',{'Anticheat Record':AR}));const b0=blocks(s0);
 let s=await pba(ACs.map(c=>line(c,lk(BA,c),'NOT A CONTRADICTION')).join('\n'));ok(blocks(s)===b0&&cnt(s,/The closing enforcer examined this pair and did not confirm a contradiction\. The close sentence is not footing for any link/g)===blocks(s)*1&&!/The close sentence is disregarded/.test(s),'P15 anti-cheat pairs examined and not confirmed: each block ends with the approved sentence (blocks live '+b0+', candidate '+blocks(s)+')');
 s=await pba(line(ACs[0],lk(BA,ACs[0]),'CONFIRMED'));ok(blocks(s)<b0&&/CONFIRMED CLOSING CONTRADICTIONS --/.test(s),'P16 one anti-cheat pair confirmed: its block leaves, the confirmed block is printed (blocks '+b0+' -> '+blocks(s)+')');
 s=await pba('CLOSE-CONTRADICTION: NONE');ok(blocks(s)===b0&&!/The closing enforcer examined/.test(s)&&!/The close sentence is disregarded/.test(s),'P17 anti-cheat pairs not answered: second sentence only');}

// ---------- T5 failure paths in Close Enforcer Build
{const r='34108',F=B8.F;const W2=JSON.parse(JSON.stringify(CAND));const p=W2.nodes.find(z=>z.name==='Panel Build');p.parameters.jsCode=p.parameters.jsCode.replace('// cacheall','// moved');
 const b=mrg(run(W2,r,'Close Enforcer Build',BO(r,F)));ok(!b.cec_skip&&b.not_sent.some(x=>/the reversal pairs: /.test(x))&&!b.cands.some(c=>/^R/.test(c.id)),'P18 Panel Build source without the reversal check: the enforcer still runs, the loss is listed: '+JSON.stringify(b.not_sent));
 const R=rec(r,F,b,'CLOSE-CONTRADICTION: NONE');ok(R.cec_log.some(x=>x.item==='NOT SENT'&&/NOT CHECKED/.test(x.cure_reason)),'P19 Record logs it NOT CHECKED: '+JSON.stringify(R.cec_log.filter(x=>x.item==='NOT SENT').map(x=>x.cure_reason)));
 const AR=cl(saved(acRun,'Anticheat Record'));const row=(AR[0].json.acx.reversed.D[0]||AR[0].json.acx.reversed.C[0]);const sd=AR[0].json.acx.reversed.D[0]?'D':'C';
 const FA=BA.F;const e3=String(FA[sd==='D'?'cr3':'dr3']).replace(/[*_`]/g,'').split(/\n+/).filter(x=>x.split(' ').length>8)[2];const e2=String(FA[sd==='D'?'cr2':'gr2']).replace(/[*_`]/g,'').split(/\n+/).filter(x=>x.split(' ').length>8)[2];
 row.earlier_q=e2.split(' ').slice(-4).join(' ')+' '+e3.split(' ').slice(0,4).join(' '); // a quotation running across two rounds: stands in no single round
 const b2=mrg(run(CAND,acRun,'Close Enforcer Build',BO(acRun,FA,{'Anticheat Record':AR})));ok(b2.not_sent.some(x=>/^A\d+ .*the earlier quotation stands in no single round/.test(x)),'P20 an anti-cheat pair whose earlier quotation crosses two rounds is listed, not dropped: '+JSON.stringify(b2.not_sent));
 row.earlier_q=e3.split(' ').slice(0,7).join(' ')+' ... '+e3.split(' ').slice(-2).join(' '); // ellipsis with a short tail: the Record's one-sentence test refuses the whole; the longest part stands
 const b3=mrg(run(CAND,acRun,'Close Enforcer Build',BO(acRun,FA,{'Anticheat Record':AR})));const c3=b3.cands.find(c=>c.id==='A'+String(row.id).replace(/\D/g,''));ok(c3&&!/\.\.\./.test(c3.earlier_q),'P21 an ellipsis quotation is sent as its longest standing part: '+(c3?'"'+c3.earlier_q+'"':'not sent '+JSON.stringify(b3.not_sent)));
 const b4=mrg(run(CAND,acRun,'Close Enforcer Build',BO(acRun,FA,{'Anticheat Record':[J({acx:{skipped:true,reversed:{D:[],C:[]}}})]})));ok(!b4.cands.some(c=>/^A/.test(c.id))&&!b4.not_sent.some(x=>/anti-cheat/.test(x)),'P22 anti-cheat check skipped: no candidate, nothing listed');
 const b5=mrg(run(CAND,acRun,'Close Enforcer Build',BO(acRun,FA,{'Anticheat Record':null})));ok(!b5.cands.some(c=>/^A/.test(c.id)),'P23 anti-cheat check not executed: no candidate, build runs');}
console.log(fails?('FAILURES: '+fails):'ALL OK');

})().catch(e=>{console.log("TEST ERROR "+e.stack);});
