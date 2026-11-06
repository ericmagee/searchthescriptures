// pkgKCMF test. Run from wall2024/: node pkgKCMF/test_KCMF.cjs [base] [out]. Replays the 33083 gemini and sol cures (log rows and cure replies,
// pkgKCMF/rows_33083.json from debate_enforcer_log; rounds from inputs/33083_Panel_Build.json; broken from inputs/33083_Panel_Payloads.json).
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const BP=process.argv[2]||'pkgRCLN',OP=process.argv[3]||'pkgKCMF';const plan=JSON.parse(rd(OP+'/plan_KCMF.json'));
T('22 nodes: shas match the plan; 19 cure nodes edited, 3 unchanged',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(BP+'/patched/'+n.file))===n.base_sha&&sha(rd(OP+'/patched/'+n.file))===n.final_sha)&&plan.nodes.filter(n=>n.edits.length).length===19);
const mk=p=>{const s=rd(p+'/patched/Panel_Cure_Check.js');return new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts,cureRounds,cureBroken,cureJText,ENF_STATUS};')(()=>{throw 0},null);};
const O=mk(BP),N=mk(OP);const D=JSON.parse(rd(OP+'/rows_33083.json'));const I='/mnt/project-files/wall2024/inputs/';
const PB=JSON.parse(rd(I+'33083_Panel_Build.json'))[0].main[0][0].json;const PP=JSON.parse(rd(I+'33083_Panel_Payloads.json'))[0].main[0][0].json;
const side=l=>(String(l||'').match(/\b(DEFENDER|CHALLENGER) LINK BROKEN\b/)||[])[1]||null;const R={};
for(const seat of ['gemini','sol']){const rows=D.rows.filter(x=>x.seat===seat);const items=rows.map(x=>({rule:x.rule,link:x.item,side:(String(x.item||'').match(/^(DEFENDER|CHALLENGER)\b/)||[])[1]||side(x.flagged_line),line:x.flagged_line}));
 const J=PB.judges.find(q=>q.seat===seat);const B=PP.bodies.map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===seat);const rep={ok:true,text:D.replies[seat]};
 const a=O.cureVerdicts(items,rep,B?O.cureBroken(O.cureJText(B.verdict_raw,true)):{},J?O.cureRounds(J.body):{}),b=N.cureVerdicts(items,rep,B?N.cureBroken(N.cureJText(B.verdict_raw,true)):{},J?N.cureRounds(J.body):{});
 R[seat]={rows,a,b};rows.forEach((x,i)=>{const s1=(a[i]||{}).status,s2=(b[i]||{}).status;console.log('   '+seat+' '+x.rule+' '+x.item+': log '+x.cure_status+', base '+s1+', pkgKCMF '+s2+(s1!==s2?'  <-- '+String(b[i].why).slice(0,120):''));});}
T('self-check: the base replay gives the log status on every gemini and sol row',Object.values(R).every(r=>r.rows.every((x,i)=>(r.a[i]||{}).status===x.cure_status)));
const gi=R.gemini.rows.findIndex(x=>x.rule==='K-CMT');
T('33083 gemini: the grouped K-CMT item goes UNCURED -> CURED (all 6 K-CMTL lines CURED); LIVE uncured 1 -> 0',R.gemini.a[gi].status==='UNCURED'&&R.gemini.b[gi].status==='CURED'&&R.gemini.b.filter((x,i)=>x.status==='UNCURED'&&N.ENF_STATUS[R.gemini.rows[i]&&R.gemini.rows[i].rule]==='LIVE').length===0);
T('every other row is unchanged (gemini and sol)',Object.entries(R).every(([s,r])=>r.rows.every((x,i)=>(s==='gemini'&&i===gi)||JSON.stringify(r.a[i])===JSON.stringify(r.b[i]))));
// units
const U=(cmtl)=>N.cureVerdicts([{rule:'K-CMT',link:'contested grades without a commitment',line:'x'}].concat(cmtl.map((c,k)=>({rule:'K-CMTL',link:'line '+(k+1),line:'y'}))),{ok:true,text:'RESPONSE: K-CMT | Accepted.\n'+cmtl.map((c,k)=>'RESPONSE: K-CMTL line '+(k+1)+' | '+c).join('\n')},{},{});
T('unit: one K-CMTL line unanswered keeps the grouped item UNCURED',U(['(Commitment 3)','I agree'])[0].status==='UNCURED');
T('unit: no K-CMTL items: the grouped item as before',N.cureVerdicts([{rule:'K-CMT',link:'g',line:'x'}],{ok:true,text:'RESPONSE: K-CMT | Accepted.'},{},{})[0].status==='UNCURED');
T('unit: all K-CMTL lines answered: CURED',U(['(Commitment 3)','NOT A GRADE'])[0].status==='CURED');
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
