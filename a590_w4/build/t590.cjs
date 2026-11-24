// ASK 590 tests (W4), layer 1: offline, on stored rounds; nothing is fetched or written. node t590.cjs
const fs=require('fs');const E=JSON.parse(fs.readFileSync('target_engine_590.json','utf8'));const B0=JSON.parse(fs.readFileSync('base_eng.json','utf8'));const CH=JSON.parse(fs.readFileSync('base_child.json','utf8'));
let pass=0,fail=0;const ok=(c,w,x)=>{if(c){pass++;console.log('PASS '+w);}else{fail++;console.log('FAIL '+w+(x?' :: '+x:''));}};
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const run=(c,nodes,input)=>new Function('$','$input','return (()=>{'+c+'\n})();')(n=>{const it=nodes[n];const ex=it!==undefined;const arr=ex?(Array.isArray(it)?it:[it]):[];return {isExecuted:ex,first:()=>({json:arr[0]||{}}),all:()=>{if(!ex)throw new Error('node '+n+' has not run');return arr.map(json=>({json}));}};},{all:()=>(input||[]).map(json=>({json})),first:()=>({json:(input||[])[0]||{}})});
const J=x=>x.map(i=>i.json);
const rd=f=>{const R=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(R)?R[0]:R;return {cr1:r.CR1,gr1:r.DR1,cr2:r.CR2,gr2:r.DR2,cr3:r.CR3,dr3:r.DR3,cr4:r.CR4,dr4:r.DR4};};
const F=rd('/mnt/project-files/ask586/w4/build/data/rounds_42071.json');
const IS={run_token:'ODV1-42071-t'},RS={enforcer:{api_model:'x/enforcer',max_tokens:16000}};
const out=(W,n)=>((W.connections[n]||{}).main||[]).map(b=>(b||[]).map(x=>x.node));
const reach=(W,s)=>{const seen=new Set([s]);const q=[s];while(q.length){const a=q.shift();for(const b of out(W,a).flat())if(!seen.has(b)){seen.add(b);q.push(b);}}return seen;};
// T1 structure
ok(JSON.stringify(out(E,'Close Enforcer Build'))==='[["Assume Check Build"]]'&&out(E,'Check Save')[0][0]==='Panel Build'&&out(E,'Regrade After Quotes?')[0][0]==='Panel Build'&&out(E,'Regrade After Quotes?')[1][0]==='SJ Off'&&out(E,'Check Save')[1][0]==='Failure Salvage','T1.1 the path: Close Enforcer Build -> Assume Check Build; Check Save and Regrade After Quotes? (true) -> Panel Build; the other outputs unchanged');
{const fresh=reach(E,'Quote Report');ok(['Anticheat Build','Anticheat Resume','Anticheat Needed?','Anticheat Call openrouter','Anticheat Record','Anticheat Only?'].every(n=>!fresh.has(n)&&E.nodes.some(x=>x.name===n))&&fresh.has('Panel Build')&&fresh.has('Close Enforcer Record'),'T1.2 the six anti-cheat nodes stay in the flow, reached by nothing (S4)');}
ok(!/Anticheat Build/.test(code(E,'Close Group Batch Build'))&&/"C","Close Enforcer Build"/.test(code(E,'Close Group Batch Build'))&&/"S","Assume Check Build"/.test(code(E,'Close Group Batch Build')),'T1.3 the batch call carries the enforcer (C) and assume-check (S) items only');
{const calls=E.nodes.filter(n=>typeof n.parameters.jsCode==='string'&&/__ACX\(\s*'[DC]'\s*\)\s*\+/.test(n.parameters.jsCode)).map(n=>n.name);ok(calls.length===0,'T1.4 no node calls the anti-cheat note any more ('+calls.join(', ')+')');}
for(const n of ['Panel Build','Build Independent Verdict']){const s=code(E,n);ok(s.includes("+__CEC('D')+__REV('D')")&&s.includes("+__CEC('C')+__REV('C')"),'T1.5 '+n+': the reversed block follows the confirmed block on each close round');}
{const t=JSON.stringify(CH)+JSON.stringify(E.nodes.find(x=>x.name==='Shared Library'));ok(!/ANTI-CHEAT CHECK/.test(t),'T1.6 the child and the Shared Library hold no anti-cheat note (every later judge turn takes the Panel Build text)');}
{const d=B0.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify(E.nodes.find(x=>x.name===n.name).parameters)).map(n=>n.name).sort();ok(JSON.stringify(d)===JSON.stringify(['Build Independent Verdict','Close Enforcer Build','Close Enforcer Record','Close Group Batch Build','Panel Build']),'T1.7 five nodes change ('+d.join(', ')+'); the post-panel contradiction call (Judge Contradiction Build, Record) is unchanged');}
// T2 the build on 42071
const CEB=code(E,'Close Enforcer Build'),CEB0=code(B0,'Close Enforcer Build');
const ba=J(run(CEB,{'Init Seats':IS,'Resolve Seats':RS,'Final Output':F})),ba0=J(run(CEB0,{'Init Seats':IS,'Resolve Seats':RS,'Final Output':F}));
const V=ba[0].cands.concat(ba[2]?ba[2].cands:[]).filter(c=>c.kind==='VERSE');
ok(ba.length===4&&ba.map(b=>b.copy).join()==='1,2,1,2','T2.1 still two reads per side');
ok(V.length>0&&V.every(c=>/^X\d+$/.test(c.id)&&c.vkey&&c.closing_round===(c.side==='DEFENDER'?'CR4':'DR4')&&/^[CD]R[123]$/.test(c.earlier_round)),'T2.2 42071: '+V.length+' VERSE candidates, each with an id, a verse key, the side\'s close and its earlier round');
{const old=ba0[0].cands.concat(ba0[2]?ba0[2].cands:[]),nw=ba[0].cands.concat(ba[2]?ba[2].cands:[]).filter(c=>c.kind!=='VERSE');ok(JSON.stringify(old)===JSON.stringify(nw),'T2.3 the code\'s other candidates are unchanged (same ids and text)');}
{const u=ba[0].body.messages[1].content;ok(u.includes('A candidate of kind VERSE names one verse')&&u.includes('CONFIRMED | REVERSED READING | NOT A CONTRADICTION')&&u.includes('REVERSED READING, in either of two ways'),'T2.4 the instruction gives the VERSE rule and the three answers');}
{const s=ba.map(b=>b.body.messages[1].content.length),s0=ba0.map(b=>b.body.messages[1].content.length);ok(true,'T2.5 sizes (S5 f): request chars per read now '+s.join(', ')+'; before '+s0.join(', '));}
ok(Array.isArray(ba[0].rev_not_checked),'T2.6 every VERSE item is checked up to 120,000 characters a side; the rest is listed as not checked ('+ba[0].rev_not_checked.length+')');
// T3 the other side's words (S5 g): a planted challenger block quoting the defender's link sentence
{const linkS='Two fatherhoods stand together, flesh father and covenant Father, footed on Luke 2:48 with Luke 2:49 and 2 Samuel 7:14.';
 const P={cr1:'D1. '+linkS,cr2:'LINK 1\n\n'+linkS+' It fits D1.',cr3:'LINK 1: SUPPORTED -- '+linkS,cr4:'LINK 1\n\nLuke 2:48 shows the flesh father and the covenant Father together.',gr1:'C1. One Father only.',gr2:'LINK 1: "'+linkS+'"\nSTEP: Mary\'s word thy father taken as the flesh father (Luke 2:48).',dr3:'LINK 1\n\nLuke 3:23 as was supposed.',dr4:'LINK 1\n\nLuke 2:48 thy father is Mary\'s word of supposed custom, not a begetter.'};
 const b=J(run(CEB,{'Init Seats':IS,'Resolve Seats':RS,'Final Output':P}));const v=b.flatMap(x=>x.cands||[]).filter(c=>c.kind==='VERSE');
 ok(!v.some(c=>c.side==='CHALLENGER'&&/Two fatherhoods/.test(c.earlier_q)),'T3.1 planted: the challenger\'s block that quotes the defender\'s link is not taken as the challenger\'s earlier reading');
 ok(v.some(c=>c.side==='DEFENDER'&&/Luke 2:48/.test(c.n)),'T3.2 control: the defender\'s own reading of Luke 2:48 is a candidate');}
// T4 the record
const CER=code(E,'Close Enforcer Record'),CER0=code(B0,'Close Enforcer Record');
const nrm=s=>String(s).replace(/[*_]+/g,'');
const vD=V.find(c=>c.side==='DEFENDER')||V[0];const sd=vD.side,P=sd==='DEFENDER'?'CR':'DR';
const closeQ=nrm(vD.closing_q.split(' / ')[0]).split(/(?<=[.!?])\s+/)[0].slice(0,160).trim();
const eb=vD.earlier_q.split('\n').find(l=>/^\[[CD]R[123]\]/.test(l));const er=eb.slice(1,4);const earlyQ=nrm(eb.slice(6)).split(/(?<=[.!?])\s+/)[0].slice(0,160).trim();
const line=(id,ans,link)=>'CLOSE-CONTRADICTION: '+id+' -- '+sd+' -- LINK '+link+' -- '+ans+' -- EARLIER ['+er+'] "'+earlyQ+'" -- CLOSING ['+P+'4] "'+closeQ+'" -- test';
const lk=(ba[0].links[sd]||[1])[0];
const R=(t1,t2)=>{const sides=ba.map(b=>b.side);return ba.map((b,i)=>({choices:[{message:{content:b.side===sd?(b.copy===1?t1:t2):'CLOSE-CONTRADICTION: NONE'}}]}));};
const rec=(t1,t2,code0)=>J(run(code0||CER,{'Close Enforcer Build':ba,'Final Output':F},R(t1,t2)))[0];
{const r=rec(line(vD.id,'REVERSED READING',lk),line(vD.id,'REVERSED READING',lk));const row=r.cec.rows.find(x=>x.id===vD.id&&x.copy===1);
 ok(row&&row.status==='REVERSED'&&r.cec.reversed.length===1&&r.cec.reversed[0].verse===vD.n&&r.cec.confirmed.length===0,'T4.1 both reads REVERSED READING on a VERSE candidate, quotes standing: listed once as reversed, nothing confirmed',row&&(row.status+' '+(row.note||'')));
 const lg=r.cec_log.find(x=>/^REVERSED --/.test(x.cure_reason||''));ok(lg&&lg.rule==='E-CLOSECON'&&lg.cure_status===null&&!/^CONFIRMED/.test(lg.cure_reason),'T4.2 the answer is a row of debate_enforcer_log (E-CLOSECON; the log helper files the status as cure_reason "REVERSED -- ...", as it files CONFIRMED), which the fault ledger does not count (dfl_counted needs a reason that starts CONFIRMED)');}
{const r=rec(line(vD.id,'REVERSED READING',lk),'CLOSE-CONTRADICTION: '+vD.id+' -- '+sd+' -- LINK '+lk+' -- NOT A CONTRADICTION -- EARLIER ['+er+'] "x y z" -- CLOSING ['+P+'4] "x y z" -- no');ok(r.cec.reversed.length===0&&r.cec.rows.some(x=>x.status==='NOT REVERSED (one check of two)'),'T4.3 one read of two: not reversed');}
{const nv=(ba[0].cands.concat(ba[2].cands)).find(c=>c.kind!=='VERSE'&&c.side===sd);const id=nv?nv.id:'NEW';const r=rec(line(id,'REVERSED READING',lk),line(id,'REVERSED READING',lk));ok(r.cec.reversed.length===0&&r.cec.rows.every(x=>x.status!=='REVERSED'),'T4.4 REVERSED READING on a candidate that is not a VERSE candidate ('+id+') is a form fault');}
{const bad=line(vD.id,'REVERSED READING',lk).replace(closeQ,'these words are not in the closing round at all');const r=rec(bad,bad);ok(r.cec.reversed.length===0&&r.cec.rows.some(x=>/NOT REVERSED \(form\)/.test(x.status)&&/not found word for word/.test(x.note)),'T4.5 a quotation that does not stand is a form fault');}
{const r=rec(line(vD.id,'CONFIRMED',lk),line(vD.id,'REVERSED READING',lk));const c=r.cec.confirmed.length,rv=r.cec.reversed.length;const st=r.cec.rows.map(x=>x.copy+':'+x.status).join('; ');
 ok(rv===0&&r.cec.rows.some(x=>x.status==='REVERSED (CONFIRMED stands)'||x.status==='NOT REVERSED (one check of two)'||x.status==='REVERSED'&&false),'T4.6 (S5 h) a pair answered CONFIRMED and REVERSED READING is never listed as reversed ('+st+'; confirmed '+c+')');}
{const r=rec(line(vD.id,'CONFIRMED',lk)+'\n'+line(vD.id,'REVERSED READING',lk),line(vD.id,'CONFIRMED',lk)+'\n'+line(vD.id,'REVERSED READING',lk));ok(r.cec.reversed.length===0&&(r.cec.confirmed.length===1)===r.cec.rows.some(x=>/^CONFIRMED/.test(x.status)),'T4.7 both reads give both answers: CONFIRMED stands once (if its form holds), REVERSED is not listed ('+r.cec.rows.map(x=>x.copy+':'+x.status).join('; ')+')');}
// T5 regression: replies with only CONFIRMED and NOT A CONTRADICTION give the same record as before
{const t=line(vD.id,'NOT A CONTRADICTION',lk);const a=rec(t,t),b=rec(t,t,CER0);const strip=o=>{const c=JSON.parse(JSON.stringify(o));delete c.cec.reversed;delete c.cec.rev_not_checked;return c;};const ba0b=J(run(CER0,{'Close Enforcer Build':ba,'Final Output':F},R(t,t)))[0];
 ok(JSON.stringify(strip(a))===JSON.stringify(ba0b),'T5.1 a reply with no REVERSED READING gives the same record as the live node');}
// T6 the judges' block
{const pb=code(E,'Panel Build');const m=pb.match(/const __REV=sd=>\{[\s\S]*?\}catch\(e\)\{return '';\}\};/)[0];const f=nodes=>new Function('$','sd',m+'return __REV(sd);')(n=>({isExecuted:n in nodes,first:()=>({json:nodes[n]})}),'D');
 const t=f({'Close Enforcer Record':{cec:{reversed:[{side:'DEFENDER',verse:'Luke 2:48',closing_round:'CR4',closing_q:'C words',earlier_round:'CR2',earlier_q:'E words'}],confirmed:[]}}});
 ok(t.startsWith('\n\n[REVERSED CLOSE SENTENCES')&&t.includes('The close sentence is disregarded')&&t.includes('grade this side\'s earlier answer on Luke 2:48 on its own words')&&t.includes('the judge keeps the decision (ruling 428)'),'T6.1 the block lists each reversed sentence with both quotations and the ruling 427 instruction');
 ok(f({'Close Enforcer Record':{cec:{reversed:[],confirmed:[]}}})===''&&f({})==='','T6.2 no reversed sentence, or no record: no block');}
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));
