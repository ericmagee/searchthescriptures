// pkgBAR test. Run from wall2024/ after make_base.cjs and build_BAR.cjs: node pkgBAR/test_BAR.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const R=require('./rounds.cjs');const IMP=require('../pkgIMP/lib_IMP.cjs');
const BAR=new Function('IMP',rd('pkgBAR/src_BAR.js')+';return BAR;')(IMP);
const W0=JSON.parse(rd('pkgBAR/base/workflow_base.json')),W1=JSON.parse(rd('pkgBAR/out/workflow_BAR.json'));const plan=JSON.parse(rd('pkgBAR/plan_BAR.json'));
const N0=Object.fromEntries(W0.nodes.map(n=>[n.name,n])),N1=Object.fromEntries(W1.nodes.map(n=>[n.name,n]));const C1=W1.connections;
const RR=['C1','D2','C2','D3','C3','D4','C4'];const LAB=r=>(r[0]==='D'?'CR':'DR')+r[1];
// ---- plan and structure ----
T('370 -> 440 nodes: 46 changed, 70 added (7 stages of 10)',W0.nodes.length===370&&W1.nodes.length===440&&plan.changed.length===46&&plan.added.length===70);
T('every changed node: base sha matches the base, final sha matches the output; patched file equals the node',plan.changed.every(c=>sha(JSON.stringify(N0[c.node].parameters))===c.base_sha&&sha(JSON.stringify(N1[c.node].parameters))===c.final_sha&&(c.file.endsWith('.js')?rd('pkgBAR/patched/'+c.file)===N1[c.node].parameters.jsCode:true)));
T('nodes outside the plan are unchanged',W0.nodes.every(n=>plan.changed.some(c=>c.node===n.name)||JSON.stringify(n)===JSON.stringify(N1[n.name])));
const SRC={C3:'C3G Extract',C4:'C4G Extract'};
for(const r of RR){const P=r+'B',src=SRC[r]||r+' Extract';const r0=N0[r+' Route'];const fam=W0.connections[r+' Route'].main.map(o=>o[0].node.split(' ').pop());
 const okC=fam.every((f,i)=>{const a=N0[r+' Call '+f],b=N1[P+' Call '+f];return b&&JSON.stringify(a.parameters)===JSON.stringify(b.parameters)&&JSON.stringify(a.credentials)===JSON.stringify(b.credentials)&&a.type===b.type&&a.onError===b.onError&&a.retryOnFail===b.retryOnFail&&C1[P+' Route'].main[i][0].node===P+' Call '+f&&C1[P+' Call '+f].main.length===2&&C1[P+' Call '+f].main.every(o=>o[0].node===P+' Extract');});
 const was=(W0.connections[src].main[0]||[]).map(x=>x.node).join();
 T(P+': '+src+' -> '+P+' Build -> Route (8 outputs: 7 Calls, then Extract) -> '+P+' Extract -> '+was+'; Calls are exact copies, both outputs to Extract',okC&&C1[src].main[0].length===1&&C1[src].main[0][0].node===P+' Build'&&C1[P+' Build'].main[0][0].node===P+' Route'&&N1[P+' Route'].parameters.numberOutputs===8&&N1[P+' Route'].parameters.output==='={{ $json.resend ? $json.call.fam_idx : 7 }}'&&C1[P+' Route'].main[7][0].node===P+' Extract'&&C1[P+' Extract'].main[0].map(x=>x.node).join()===was&&JSON.stringify(W0.connections[src].main.slice(1))===JSON.stringify(C1[src].main.slice(1)));}
// every reader of a B Extract runs after it (downstream in the graph), and no reader outside the round's own stage still reads the old Extract
{const down=(from)=>{const seen=new Set();const st=[from];while(st.length){const n=st.pop();for(const o of ((C1[n]||{}).main||[]))for(const x of (o||[]))if(!seen.has(x.node)){seen.add(x.node);st.push(x.node);}}return seen;};
 const bad1=[],bad2=[];for(const r of RR){const d=down(r+'B Extract');for(const n of W1.nodes){const s=JSON.stringify(n.parameters);if(s.includes("$('"+r+"B Extract')")&&!d.has(n.name)&&n.name!=='Failure Salvage'&&n.name!=='Build Save Body')bad1.push(r+'B<-'+n.name);
  const own=new Set([r+' Build',r+' Extract',r+'G Build',r+'G Extract',r+'B Build',r+'B Extract','Failure Salvage']);for(const old of [r+' Extract',r+'G Extract'])if(s.includes("$('"+old+"')")&&!own.has(n.name))bad2.push(old+' in '+n.name);}}
 T('every node that reads a B Extract is downstream of it',!bad1.length,bad1.join(', '));T('no node outside a round\'s own stage reads its first or G Extract',!bad2.length,bad2.join(', '));
 const zh=['D3 Build','C3 Build','D4 Build','C4 Build'].every(n=>N1[n].parameters.jsCode.includes("$(side+prev+'B Extract').first().json.raw"));T('the z-ai conversation helper reads the previous round\'s B Extract (4 Builds)',zh);}
// ---- part 1 ----
const STAMP='Repeated offenses will result in disqualification.';
{const s=N1['Init with Guards'].parameters.jsCode;const m=s.match(/const __BARRED=("(?:[^"\\]|\\.)*");/);const b=m&&JSON.parse(m[1]);
 T('Init with Guards: both debater prompts end with the BARRED MOVES block',s.includes("+PROVE+__BARRED;const csys=build('CHALLENGER',S.challenger,S.cpos)+PROVE+__BARRED;")&&s.includes("const dsys=build('DEFENDER',S.defender,S.dpos)+PROVE+__BARRED;"));
 T('the block names moves (a) to (d) with an example each and ends with the stamp, verbatim, as its last sentence',b&&['(a) An answer from silence','(b) A requirement the verse never sets',"(c) Answering the verse but not the press's MEANS",'(d) Granting a row'].every(x=>b.includes(x))&&b.trim().endsWith(STAMP)&&b.split(STAMP).length===2,b&&b.slice(-160));
 const r07=R('33107'),r49=R('33149'),r60=R('33160');
 T('examples stand word for word in their rounds: 33107 [CR3], 33149 [CR4], 33160 [CR4], 33160 [CR3] press and [DR3] verse words, 33107 [CR3] grant and [CR4]',
  r07.CR3.includes('They do not name the parent.')&&r49.CR4.includes('It does not say through whom.')&&r60.CR4.includes('Mary asks how, and the answer does not say "when Joseph takes you."')
  &&r60.CR3.includes('a husband who knew himself the father would have no cause to put her away')&&r60.DR3.includes('being a just [man]')&&r60.DR3.includes('was minded to put her away privily')
  &&r07.CR3.includes('I grant that "born of a woman" is said of men with fathers.')&&r07.CR4.includes('Galatians 4:4 puts the same woman as the source.'));
 const OAN=new Function(rd('pkgOAN/src_OAN.js')+';return OAN;')();const P=OAN.harvest(r60.CR3);T('example (c): the 33160 [DR3] press check finds Matthew 1:19 (P2.3) unmet',OAN.check(r60.DR3,P).missing.includes('P2.3'));}
{const J=['Panel Build','Reserve Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Alternate Cure Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build','Enforcer Build','Judge Enforcer Build','Alt Judge Enforcer Build'];
 const tail='an item left uncured is recorded against my seat.\\n\\nA sentence the system marks VOID (pkgBAR) is a barred move struck from its round: the press it answered counts as unanswered, and I grade no ANSWER CHECK MEETS on it.\\n'+STAMP+'";';
 T('the 15 PART2 nodes: the VOID sentence and the stamp right after Commitment 14, and the PART2 text is still byte-identical across them',J.every(n=>N1[n].parameters.jsCode.split(tail).length===2)&&new Set(J.map(n=>{const s=N1[n].parameters.jsCode;const i=s.indexOf(tail);return s.slice(i-3000,i+tail.length);})).size===1);}
// ---- library on the replay rounds ----
{const win=t=>{const w=t.split(/\s+/);for(let i=40;i+8<=w.length;i++){const q=w.slice(i,i+8);if(q.every(x=>/^[A-Za-z,;.']+$/.test(x)))return q.join(' ');}return '';};const r07=R('33107'),r49=R('33149');const c07=BAR.check('CR3',r07.CR3,r07),c49=BAR.check('CR4',r49.CR4,r49);
 T('check 33107 [CR3]: "They do not name the parent." is a hit, move (a)',c07.hits.some(h=>h.sentence==='They do not name the parent.'&&h.move.code==='a'&&h.found));
 T('check 33149 [CR4]: "It does not say through whom." is a hit',c49.hits.some(h=>h.sentence==='It does not say through whom.'));
 const s=r07.CR3.replace('They do not name the parent.','They do not name the parent.\nNOT A REQUIREMENT -- rebuts [DR2] "'+win(r07.DR2)+'"');
 const c1=BAR.check('CR3',s,{...r07,CR3:s});T('a NOT A REQUIREMENT line quoting 8 words of the other side\'s [DR2] clears its sentence',c1.rebutted.some(h=>h.sentence==='They do not name the parent.')&&!c1.hits.some(h=>h.sentence==='They do not name the parent.'));
 const s2=r07.CR3.replace('They do not name the parent.','They do not name the parent.\nNOT A REQUIREMENT -- rebuts [DR2] "these words were never written in that round"');
 const c2=BAR.check('CR3',s2,{...r07,CR3:s2});T('a NOT A REQUIREMENT line whose quote is not in the round does not clear it, and the note says why',c2.hits.some(h=>h.sentence==='They do not name the parent.'&&h.nar&&!h.nar.ok)&&/does not verify/.test(BAR.note(c2)));
 const s3=r07.CR3.replace('They do not name the parent.','They do not name the parent.\nNOT A REQUIREMENT -- rebuts [CR2] "'+r07.CR2.split(/\s+/).slice(40,48).join(' ')+'"');
 T('a NOT A REQUIREMENT line quoting its own side does not clear it',BAR.check('CR3',s3,{...r07,CR3:s3}).hits.some(h=>h.sentence==='They do not name the parent.'));
 const st=BAR.strike(r07.CR3,c07.hits);T('strike: every hit of 33107 [CR3] found and struck; the struck round has no hit left; the mark is not itself a hit',st.struck.length===c07.hits.length&&!st.unfound.length&&BAR.check('CR3',st.raw,r07).hits.length===0&&st.raw.includes(BAR.MARK));
 T('the note quotes each sentence with its id, round and move, and ends with the stamp',c07.hits.every(h=>BAR.note(c07).includes(h.id+' [CR3] "'+h.sentence+'" -- '+h.move.name))&&BAR.note(c07).endsWith(STAMP));}
// ---- the stage nodes run on stand-in data ----
const reply=t=>({choices:[{message:{content:t},finish_reason:'stop'}],usage:{prompt_tokens:1,completion_tokens:1}});
const mk=v=>({isExecuted:true,first:()=>({json:v}),all:()=>[{json:v}]});
const run=(nodes,code,input)=>{const $=n=>nodes[n]?mk(nodes[n]):{isExecuted:false,first:()=>{throw new Error("Node '"+n+"' hasn't been executed");},all:()=>[]};
 return new Function('$','$input','$json',code)($,{first:()=>({json:input||{}}),all:()=>[{json:input||{}}]},input||{})[0].json;};
const ORDER=['D1','C1','D2','C2','D3','C3','D4','C4'];const FIN=r=>r==='D1'?'D1 Extract':r+'B Extract';
const base=(rs,r)=>{const o={'Init Seats':{run_token:'t'},'Init with Guards':{csys:'s',dsys:'s',topic:'topic',lab:{C:'CHALLENGER',D:'DEFENDER'}}};for(const x of ORDER.slice(0,ORDER.indexOf(r)))o[FIN(x)]={raw:rs[LAB(x)],labelled:'L\n\n'+rs[LAB(x)]};for(const x of ORDER)if(!o[x+' Extract'])o[x+' Extract']={raw:rs[LAB(x)]};return o;};
const call0=f=>({fam:f||'openai',fam_idx:1,model:'m',body:f==='gemini'?{contents:[{role:'user',parts:[{text:'u'}]}]}:{model:'m',messages:[{role:'system',content:'s'},{role:'user',content:'u'}]}});
{const rs=R('33160');const r='D3';const nodes=base(rs,r);nodes['D3 Extract']={run_token:'t',round:'D3',raw:rs.CR3,labelled:'DEFENDER -- ROUND 3\n\n'+rs.CR3,fam:'openai',model:'m'};nodes['D3 Build']={run_token:'t',round:'D3',call:call0()};
 const B=run(nodes,N1['D3B Build'].parameters.jsCode);nodes['D3B Build']=B;const ms=B.call&&B.call.body.messages||[];
 T('D3B Build on 33160 [CR3]: resend, 7 sentences quoted, conversation continued (assistant = the round, user = the note)',B.resend&&B.bar_check.hits.length===7&&ms.length===4&&ms[2].content===rs.CR3&&ms[3].content===B.note&&B.call.model==='m',B.why);
 {const n2={...nodes,'D3 Build':{...nodes['D3 Build'],call:call0('gemini')}};const Bg=run(n2,N1['D3B Build'].parameters.jsCode);const c=Bg.call.body.contents;T('D3B Build: gemini form',c.length===3&&c[1].role==='model'&&c[2].role==='user');}
 const X=N1['D3B Extract'].parameters.jsCode;
 let E;try{E=run(nodes,X,reply(rs.CR3));}catch(e){T('D3B Extract reads a stand-in reply',false,String(e.stack).slice(0,300));}
 T('D3B Extract: the same round returned -> kept, all 7 VOID, struck from raw and labelled',E&&E.bar.kept==='second'&&E.bar.void.length===7&&E.bar.void.every(v=>v.struck&&v.round==='CR3'&&v.side==='DEFENDER'&&v.seat==='openai/m')&&!E.raw.includes('It does not state a begetter.')&&E.raw.split(BAR.MARK).length===8&&E.labelled.split(BAR.MARK).length===8,E&&JSON.stringify(E.bar).slice(0,300));
 const fixed=B.bar_check.hits.reduce((t,h)=>t.split(h.sentence).join('[L1] Luke 1:35: "The Holy Ghost shall come upon thee".'),rs.CR3);
 const E2=run(nodes,X,reply(fixed));T('D3B Extract: a round with each sentence answered positively -> kept, nothing VOID',E2.bar.kept==='second'&&E2.bar.void.length===0&&E2.raw===E2.raw.replace(BAR.MARK,'')&&!E2.raw.includes(BAR.MARK));
 const E3=run(nodes,X,{error:{message:'503'}});T('D3B Extract: a failed re-call keeps the first round, nothing VOID',E3.bar.kept==='first'&&/failed/.test(E3.bar.why)&&E3.bar.void.length===0&&E3.raw===rs.CR3);
 const E4=run(nodes,X,reply(rs.CR3.slice(0,2000)));T('D3B Extract: a replacement under 60% of the round keeps the first round, and its 7 sentences are VOID',E4.bar.kept==='first'&&E4.bar.void.length===7&&E4.raw.includes(BAR.MARK)&&/under 60%/.test(E4.bar.why));
 const P0=run(nodes,X,{});nodes['D3B Build']={run_token:'t',round:'D3B',resend:false,why:'no barred move harvested'};const E5=run(nodes,X,{});T('D3B Extract: a pass-through keeps the first round whole',E5.raw===rs.CR3&&E5.bar.resent===false);}
// C3 (source C3G Extract) and C4 (source C4G Extract): run the stages on 33107 rounds with a hit planted
for(const [r,gk,gb] of [['C3','press_resend','C3G Build'],['C4','grants_resend','C4G Build']]){const rs=R('33107');const L=LAB(r);const raw=rs[L]+'\n\n**Answers to the presses**\n- Luke 1:35: "The Holy Ghost shall come upon thee". It does not name Joseph.';const nodes=base(rs,r);
 nodes[r+'G Extract']={run_token:'t',round:r,raw,labelled:'CH\n\n'+raw,fam:'openai',model:'m',[gk]:{resent:true,kept:'second'}};nodes[r+' Build']={run_token:'t',round:r,call:call0()};
 const gcall=call0();gcall.body.messages.push({role:'assistant',content:'first'},{role:'user',content:'G note'});nodes[gb]={call:gcall,resend:true};
 const B=run(nodes,N1[r+'B Build'].parameters.jsCode);nodes[r+'B Build']=B;const ms=B.call.body.messages;
 T(r+'B Build: reads '+r+'G Extract; the '+r+'G conversation is continued when its round was kept',B.resend&&B.bar_check.hits.some(h=>h.sentence==='It does not name Joseph.')&&B.base===gb&&ms.length===6&&ms[4].content===raw,B.why+' '+B.base);
 let E;try{E=run(nodes,N1[r+'B Extract'].parameters.jsCode,reply(raw));}catch(e){E=null;T(r+'B Extract reads a stand-in reply',false,String(e.stack).slice(0,300));}
 if(E)T(r+'B Extract: the hit returned again is VOID; the '+r+'G record ('+gk+') is kept on the item',E.bar.void.some(v=>v.sentence==='It does not name Joseph.'&&v.struck)&&E[gk]&&E[gk].kept==='second',JSON.stringify(E.bar).slice(0,200));}
// Build Save Body's AUDIT v47 lines
{const s=N1['Build Save Body'].parameters.jsCode;const i=s.indexOf('/* pkgBAR:');const j=s.indexOf('catch(e){}}',i)+11;const snip=s.slice(i,j);const FF=[];
 const nodes={'D3B Extract':{bar:{applies:true,resent:true,seat:'openai/m',side:'DEFENDER',round:'CR3',kept:'second',why:'w',first:{hits:[1,2]},void:[{seat:'openai/m',side:'DEFENDER',round:'CR3',sentence:'It does not state a begetter.',move:'BARRED MOVE (a), an answer from silence',struck:true}]}},'C1B Extract':{bar:{applies:true,resent:false}}};
 new Function('$','FF',snip)(n=>nodes[n]?mk(nodes[n]):{isExecuted:false,first:()=>{throw new Error('x');}},FF);
 T('Build Save Body: one AUDIT v47 re-call line and one VOID line naming seat, round and sentence; a round with no re-call writes none',FF.length===2&&/AUDIT v47: BARRED MOVE RE-CALL \(pkgBAR\) -- SEAT: openai\/m \(DEFENDER\); ROUND: \[CR3\]/.test(FF[0])&&/AUDIT v47: BARRED MOVE VOID \(pkgBAR\) -- SEAT: openai\/m \(DEFENDER\); ROUND: \[CR3\]; SENTENCE: "It does not state a begetter\."/.test(FF[1]),FF.join('\n'));}
// ---- replay: every re-call pkgBAR would raise on 33107, 33149, 33160 ----
{const L=[];let tot=0;
 for(const run0 of ['33107','33149','33160']){const rs=R(run0);
  for(const r of RR){const nodes=base(rs,r);const src=SRC[r]||r+' Extract';nodes[src]={run_token:'t',round:r,raw:rs[LAB(r)],fam:'f',model:'m'};nodes[r+' Build']={call:call0()};
   const B=run(nodes,N1[r+'B Build'].parameters.jsCode);if(B.resend){tot++;L.push(run0+' ['+LAB(r)+'] '+r+'B RE-CALL, '+B.bar_check.hits.length+' sentence(s)'+(B.bar_check.rebutted.length?', '+B.bar_check.rebutted.length+' rebutted':''));for(const h of B.bar_check.hits)L.push('   '+h.id+' '+h.move.name.replace('BARRED MOVE ','')+' | '+h.sentence);}
   else L.push(run0+' ['+LAB(r)+'] '+r+'B pass: '+B.why);}}
 fs.writeFileSync('pkgBAR/replay_recalls.txt','pkgBAR replay: the re-calls the B stages would raise on the saved rounds (rounds from the judges\' Panel Build messages).\n\n'+L.join('\n')+'\n');
 T('replay written (pkgBAR/replay_recalls.txt): '+tot+' re-calls over 3 runs',tot>0,L.filter(l=>/RE-CALL/.test(l)).join('\n     '));}
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
