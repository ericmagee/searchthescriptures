// ASK 590 S5 replays (W4): offline, on stored rounds and stored enforcer replies; nothing is fetched or written. node t590r.cjs
// The model's own REVERSED READING answers cannot be replayed (none is stored); where a case needs one, the answer is planted and said so.
const fs=require('fs');const D=__dirname;const E=JSON.parse(fs.readFileSync(D+'/target_engine_590s.json','utf8'));const B0=JSON.parse(fs.readFileSync(D+'/base_eng.json','utf8'));
let pass=0,fail=0;const ok=(c,w,x)=>{if(c){pass++;console.log('PASS '+w);}else{fail++;console.log('FAIL '+w+(x?' :: '+x:''));}};const info=w=>console.log('INFO '+w);
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const run=(c,nodes,input)=>new Function('$','$input','return (()=>{'+c+'\n})();')(n=>{const it=nodes[n];const ex=it!==undefined;const arr=ex?(Array.isArray(it)?it:[it]):[];return {isExecuted:ex,first:()=>({json:arr[0]||{}}),all:()=>{if(!ex)throw new Error('node '+n+' has not run');return arr.map(json=>({json}));}};},{all:()=>(input||[]).map(json=>({json})),first:()=>({json:(input||[])[0]||{}})});
const J=x=>x.map(i=>i.json);
const rd=f=>{const R=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(R)?R[0]:R;return {cr1:r.CR1,gr1:r.DR1,cr2:r.CR2,gr2:r.DR2,cr3:r.CR3,dr3:r.DR3,cr4:r.CR4,dr4:r.DR4};};
const RS={enforcer:{api_model:'x/enforcer',max_tokens:16000}};
const CEB=code(E,'Close Enforcer Build'),CEB0=code(B0,'Close Enforcer Build'),CER=code(E,'Close Enforcer Record'),CER0=code(B0,'Close Enforcer Record');
const build=(F,tok,c)=>J(run(c||CEB,{'Init Seats':{run_token:tok},'Resolve Seats':RS,'Final Output':F}));
const reply=(ba,map)=>ba.map(b=>({choices:[{message:{content:(map[b.side]||{})[b.copy]||'CLOSE-CONTRADICTION: NONE'}}]}));
const rec=(ba,F,map,c)=>J(run(c||CER,{'Close Enforcer Build':ba,'Final Output':F},reply(ba,map)))[0];
const V=ba=>ba.filter(b=>b.copy===1).flatMap(b=>b.cands||[]).filter(c=>c.kind==='VERSE');
const sent=s=>String(s).replace(/[*_]+/g,'').split(/\s+\/\s+|\n+|(?<=[.!?]["'”]?)\s+/).map(x=>x.replace(/^[-\s]*(?:\[L\d\]\s*)?/,'').trim()).filter(x=>x.split(/\s+/).length>=6&&!/["“”]/.test(x));
const RUNS={};for(const r of ['32643','37203','41822'])RUNS[r]=rd(D+'/data/rounds_'+r+'.json');RUNS['42071']=rd('/mnt/project-files/ask586/w4/build/data/rounds_42071.json');
const BA={};for(const r in RUNS)BA[r]=build(RUNS[r],'ODV1-'+r+'-t');
// (f) sizes and (e) candidate counts
for(const r in RUNS){const b=BA[r],b0=build(RUNS[r],'ODV1-'+r+'-t',CEB0);const v=V(b);
 info('S5 (e/f) run '+r+': VERSE candidates D '+v.filter(c=>c.side==='DEFENDER').length+', C '+v.filter(c=>c.side==='CHALLENGER').length+'; not checked (over 120,000 characters) '+b.filter(x=>x.copy===1).map(x=>(x.rev_not_checked||[]).length).join('/')+'; request characters per read now '+b.map(x=>x.side[0]+x.copy+' '+x.body.messages[1].content.length).join(', ')+'; before '+b0.map(x=>x.side[0]+x.copy+' '+x.body.messages[1].content.length).join(', '));}
// (a) 32643, Deuteronomy 22:24, defender
{const v=V(BA['32643']).filter(c=>c.side==='DEFENDER'&&/Deuteronomy 22:24/.test(c.n));
 ok(v.length===1,'S5a.1 32643: the defender\'s Deuteronomy 22:24 is a VERSE candidate for the enforcer (close ['+(v[0]&&v[0].closing_round)+'] against earlier ['+(v[0]&&v[0].earlier_round)+'])',v.map(c=>c.n).join());
 if(v.length){const c=v[0];const eb=c.earlier_q.split('\n').find(l=>/^\[[CD]R[123]\]/.test(l))||'';const er=eb.slice(1,4);const eq=sent(eb.slice(6))[0],cq=sent(c.closing_q)[0]||"The challenger's own reading of it gives the husband as the wronged party.";/* the candidate's close block holds only verse quotations; the planted close sentence is the defender's next [L2] line under ANSWER: Deuteronomy 22:24 in CR4 */
  info('S5a 32643 candidate: CLOSE ['+c.closing_round+'] "'+String(cq).slice(0,200)+'" | EARLIER ['+er+'] "'+String(eq).slice(0,200)+'"');
  const lk=(BA['32643'][0].links.DEFENDER||[1])[0];const L='CLOSE-CONTRADICTION: '+c.id+' -- DEFENDER -- LINK '+lk+' -- REVERSED READING -- EARLIER ['+er+'] "'+eq+'" -- CLOSING ['+c.closing_round+'] "'+cq+'" -- planted';
  const r=rec(BA['32643'],RUNS['32643'],{DEFENDER:{1:L,2:L}});ok(r.cec.reversed.length===1&&r.cec.reversed[0].verse===c.n&&r.cec.confirmed.length===0,'S5a.2 32643 (planted answer, both reads): REVERSED stands, listed once; nothing confirmed',r.cec.rows.map(x=>x.copy+':'+x.status+' '+(x.note||'')).join('; '));
  const N='CLOSE-CONTRADICTION: '+c.id+' -- DEFENDER -- LINK '+lk+' -- NOT A CONTRADICTION -- EARLIER ['+er+'] "'+eq+'" -- CLOSING ['+c.closing_round+'] "'+cq+'" -- held';
  const r2=rec(BA['32643'],RUNS['32643'],{DEFENDER:{1:N,2:N}});ok(r2.cec.reversed.length===0&&r2.cec.confirmed.length===0,'S5a.3 32643: a held reading (NOT A CONTRADICTION in both reads) raises nothing');}}
// (b)(g) 41822: the defender's "Two fatherhoods" sentence is not the challenger's earlier reading
{const b=BA['41822'];const v=V(b);const TF='Two fatherhoods stand together, flesh father and covenant Father, footed on Luke 2:48 with Luke 2:49 and 2 Samuel 7:14.';
 ok(!v.some(c=>c.side==='CHALLENGER'&&/Two fatherhoods/.test(c.earlier_q)),'S5b.1 41822: no challenger candidate carries the defender\'s "Two fatherhoods" sentence as the challenger\'s earlier words (the 120,000-character cap leaves '+b.filter(x=>x.copy===1&&x.side==='CHALLENGER').map(x=>(x.rev_not_checked||[]).length)+' challenger items unchecked)');
 const cc=v.find(c=>c.side==='CHALLENGER'&&/Luke 2:4[89]/.test(c.n))||v.find(c=>c.side==='CHALLENGER');
 if(cc){const lk=(b[0].links.CHALLENGER||[1])[0];const L='CLOSE-CONTRADICTION: '+cc.id+' -- CHALLENGER -- LINK '+lk+' -- REVERSED READING -- EARLIER [DR2] "'+TF+'" -- CLOSING [DR4] "The father of the child is God, not Joseph." -- planted as in the 41822 note';
  const r=rec(b,RUNS['41822'],{CHALLENGER:{1:L,2:L}});ok(r.cec.reversed.length===0&&r.cec.rows.filter(x=>x.side==='CHALLENGER'&&x.id===cc.id).every(x=>/^NOT REVERSED/.test(x.status)),'S5b.2/S5g 41822 (the note\'s own pairing planted in both reads, on challenger candidate '+cc.id+' '+cc.n+'): not reversed -- '+r.cec.rows.filter(x=>x.id===cc.id).map(x=>x.copy+':'+x.status+(x.note?' ('+x.note.slice(0,120)+')':'')).join('; '));}
 else ok(false,'S5b.2 no challenger VERSE candidate to plant on');}
// (c) 37203: the close sentence under Mark 7:8 paired with Matthew 1:19
{const b=BA['37203'];const v=V(b);const CS='The verse carries no words about espoused wives.';
 const hit=v.filter(c=>c.side==='DEFENDER'&&/Matthew 1:19/.test(c.n)&&c.closing_q.includes('espoused wives'));
 info('S5c 37203: defender Matthew 1:19 candidates whose close holds the Mark 7:8 sentence: '+hit.length+(hit.length?' ('+hit.map(c=>c.id).join()+'; the finder is the anti-cheat finder verbatim, so the guard is the record\'s pkgOVS check)':''));
 const c=hit[0]||v.find(c=>c.side==='DEFENDER'&&/Matthew 1:19/.test(c.n));
 if(c){const lk=(b[0].links.DEFENDER||[1])[0];const L='CLOSE-CONTRADICTION: '+c.id+' -- DEFENDER -- LINK '+lk+' -- REVERSED READING -- EARLIER [CR3] "The title \'her husband\' belongs to the espousal." -- CLOSING [CR4] "'+CS+'" -- planted as in the 37203 note';
  const r=rec(b,RUNS['37203'],{DEFENDER:{1:L,2:L}});ok(r.cec.reversed.length===0,'S5c.1 37203 (the note\'s pairing planted in both reads on '+c.id+' '+c.n+'): not reversed -- '+r.cec.rows.filter(x=>x.id===c.id).map(x=>x.copy+':'+x.status+(x.note?' ('+x.note.slice(0,140)+')':'')).join('; '));}
 else ok(false,'S5c.1 no defender Matthew 1:19 candidate');}
// (d) 42071: the stored enforcer replies give the same record, old node and new node
{const cec=JSON.parse(fs.readFileSync(D+'/data/cec_42071.json','utf8'));const full=cec[0].full_reply.split('\n');const ch=full.filter(l=>/CHALLENGER/.test(l));
 const map={CHALLENGER:{1:ch[0]+'\n'+ch[1],2:ch[2]}};const b=BA['42071'],b0=build(RUNS['42071'],'ODV1-42071-t',CEB0);
 const n=rec(b,RUNS['42071'],map),o=rec(b0,RUNS['42071'],map,CER0);const st=x=>x.cec.rows.map(r=>r.copy+':'+r.side+':'+r.status).join('; ');
 ok(JSON.stringify(n.cec.confirmed)===JSON.stringify(o.cec.confirmed)&&n.cec.confirmed.length>0&&n.cec.reversed.length===0,'S5d.1 42071: the stored replies give the same confirmed list in the new node as in the live node ('+n.cec.confirmed.length+' confirmed: '+n.cec.confirmed.map(x=>x.side+' LINK '+x.link).join(', ')+')');
 ok(st(n)===st(o),'S5d.2 42071: row statuses unchanged ('+st(n)+')');
  const vid=new Set(b.filter(x=>x.copy===1).flatMap(x=>x.cands||[]).filter(c=>c.kind==='VERSE').map(c=>c.id));const keep=x=>x.filter(r=>!vid.has(r.item)).map(r=>r.cure_reason);const add=n.cec_log.filter(r=>vid.has(r.item));ok(JSON.stringify(keep(n.cec_log))===JSON.stringify(keep(o.cec_log))&&add.every(r=>/^NO ANSWER -- /.test(r.cure_reason)),'S5d.3 42071: the debate_enforcer_log rows of the stored answers are the same text ('+keep(o.cec_log).length+' rows); the replayed replies were never asked the '+vid.size+' VERSE candidates, so each is logged NO ANSWER ('+add.length+' rows); a live read is asked to answer each by its id');
 info('S5d stored statuses: '+cec.map(r=>r.id+' '+String(r.cure_reason).split(' -- ')[0]).join('; '));}
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));
