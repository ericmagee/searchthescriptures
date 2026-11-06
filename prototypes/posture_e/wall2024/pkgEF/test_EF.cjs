// pkgEF test. Run from wall2024/: node pkgEF/test_EF.cjs
// Feed-level replay of all 59 promotion-read items (pkgPR/items.json, verdicts pkgPR/verdicts.json): each judge's saved text is run through
// Judge Enforcer Build (pkgEP base and pkgEF), and the item the enforcer would be sent is checked. The model's reading needs a live run;
// this shows what each item is now fed, and that the code-side items (5993, 6171, 6821) are gone.
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgEF/plan_EF.json'));
T('2 nodes; base shas = pkgEP/patched, final shas = pkgEF/patched',plan.nodes.every(n=>sha(rd(plan.base+'/'+n.file))===n.base_sha&&sha(rd('pkgEF/patched/'+n.file))===n.final_sha));
const AM=rd('pkgCK/patched/Alternate_Merge.js');
const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {ciRounds,gatePromptText2024};')(()=>{throw 0},null);
const texts=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(JSON.parse);const fx={};
const get=(run,seat)=>{if(!(run in fx))fx[run]=fs.existsSync('corpus/fix_'+run+'.json')?JSON.parse(rd('corpus/fix_'+run+'.json')):null;const X=fx[run];let R=null,Tx=null;
 if(X){for(const G of [X,X.alt].filter(Boolean)){const J=(G.PB&&G.PB.judges||[]).find(q=>q.seat===seat);if(J&&!R)R=L.ciRounds(L.gatePromptText2024(J.body));const b=(G.bodies||[]).find(q=>q.seat===seat);if(b&&!Tx)Tx=b.verdict_raw;}}
 if(!Tx){const t=texts.find(x=>x.run===run&&x.seat===seat&&/verdict/.test(x.src));if(t)Tx=t.jtext;}if(!R&&X){const J=(X.PB&&X.PB.judges||[])[0];if(J)R=L.ciRounds(L.gatePromptText2024(J.body));}return {R,Tx:Tx||''};};
const runJE=(pkg,file,seat,Tx,R)=>{const src=rd(pkg+'/patched/'+file);
 const nodes={'Panel Cure Check':[{bodies:[{payload:{judge_seat:seat,verdict_raw:Tx}}]}],'Seated':[{bodies:[{payload:{judge_seat:seat,verdict_raw:Tx}}]}],'Init Seats':[{run_token:'t'}],'Resolve Seats':[{deepseek:{api_model:'stub'}}],'Panel Cure Normalize 1':[{cure:{rounds:R}}],'Alt Seated':[{bodies:[{payload:{judge_seat:seat,verdict_raw:Tx}}],cure:{rounds:R}}]};
 const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
 const o=new Function('$','$input','$json',src)($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{});
 return {code:(o[0]&&o[0].json.code_rows)||[],ids:o.flatMap(x=>(x.json&&x.json.ids)||[]),body:o.map(x=>{const b=x.json&&x.json.body;return b&&b.messages?String(b.messages[1].content):'';}).join('\n')};};
const items=JSON.parse(rd('pkgPR/items.json'));const V=JSON.parse(rd('pkgPR/verdicts.json'));
const verdict=x=>{const v=V[x.rule];if(v[x.id])return v[x.id][0];return 'TRUE';};
const unq=s=>String(s).replace(/\\+"/g,'"');
// the item block in the prompt body whose THE LINE is this line
const block=(body,line)=>{body=unq(body);const parts=body.split(/\n(?=ITEM [A-Z]+\d+ )/);const k=unq(line).slice(0,120);return parts.find(p=>p.includes(k))||null;};
const res={};
for(const x of items){const role=/^(sol|grok_alt)$/.test(x.seat)?'Alt_Judge_Enforcer_Build.js':'Judge_Enforcer_Build.js';const {R,Tx}=get(x.run,x.seat);
 let Tu=Tx;const k40=unq(x.line).slice(0,40);if(!unq(Tx).includes(k40)){const t2=texts.find(t=>t.run===x.run&&t.seat===x.seat&&/reply|verdict/.test(t.src)&&unq(t.jtext).includes(k40));if(t2)Tu=t2.jtext;}
 const a=runJE('pkgEP',role,x.seat,Tu,R),b=runJE('pkgEF',role,x.seat,Tu,R);res[x.id]={x,a,b,v:verdict(x),ba:block(a.body,x.line),bb:block(b.body,x.line),Tx:Tu};}
// E-RES
const r5993=res[5993];
T('5993 (33014 chatgpt VERDICT LINES): pkgEP writes the k=1 row; pkgEF does not (the UNCURED retraction in the AUDIT note no longer drops D6)',
 r5993.a.code.some(c=>c.item==='VERDICT LINES'&&/k=1/.test(c.cure_reason))&&!r5993.b.code.some(c=>c.item==='VERDICT LINES'&&/k=1/.test(c.cure_reason)));
T('unit: a judge\'s own line "RETRACTED: D6 vs C1" still drops D6 from the k count',(()=>{const t='D6 vs C1 (Hebrews 7:10): DEFENDER LINK BROKEN -- x\nRETRACTED: D6 vs C1\nRESULT: DEFENDER WINS -- y\nCLAUSE: HELD-1 -- n=6 w=0 k=0\nKEYSTONE: D6 -- STANDS';const o=runJE('pkgEF','Judge_Enforcer_Build.js','chatgpt',t,null);return !o.code.some(c=>c.item==='VERDICT LINES');})());
T('unit: an AUDIT note quoting a retraction does not drop the link',(()=>{const t='D6 vs C1 (Hebrews 7:10): DEFENDER LINK BROKEN -- x\nRESULT: CHALLENGER WINS -- y\nCLAUSE: BROKEN-1 -- n=6 w=0 k=1\nKEYSTONE: D6 -- BROKEN\n[AUDIT v21: ... RESULT: UNCURED; STATEMENT: RETRACTED: D6 vs C1; ...]';const o=runJE('pkgEF','Judge_Enforcer_Build.js','chatgpt',t,null),o0=runJE('pkgEP','Judge_Enforcer_Build.js','chatgpt',t,null);return !o.code.some(c=>c.item==='VERDICT LINES')&&o0.code.some(c=>c.item==='VERDICT LINES');})());
for(const id of [6171,6821]){const r=res[id];T(id+' ('+r.x.run+' '+r.x.seat+' E-RES, engine recompute RESULT line): sent by pkgEP, not sent by pkgEF',!!r.ba&&!r.bb,r.ba?'':'base block not found');}
for(const id of [5162,7816]){const r=res[id];T(id+' ('+r.x.run+' '+r.x.seat+' E-RES TRUE): still sent, unchanged',!!r.bb&&r.ba===r.bb);}
// E-HOLD
const lab=(blk,re,want)=>blk.split('\n').filter(l=>re.test(l)).every(l=>l.includes(want));
for(const x of items.filter(i=>i.rule==='E-HOLD')){const r=res[x.id];const v=V['E-HOLD'][x.id];const blk=r.bb||'';let c=!!r.bb,d='';
 const linkState=/^COLLISION [DC]\d+$/.test(x.item);
 const fed=blk.split('\n').filter(l=>/^- \(/.test(l));
 const notMeets=fed.filter(l=>!/--\s*MEETS\b/.test(l)&&!/UNPROVEN press/.test(l));
 const defBad=notMeets.filter(l=>/the defender's answer/.test(l)),chBad=notMeets.filter(l=>/the challenger's answer/.test(l));
 if(linkState){const m=blk.match(/TO PROVEN PRESSES: (\d+) in all/);d='link state; that side\'s proven checks: '+(m?m[1]:'?')+'; not MEETS fed: '+(x.item.includes('D')?defBad.length:chBad.length);
  c=c&&!!m;}
 else d='fed '+fed.length+' labelled checks; proven not-MEETS: defender '+defBad.length+', challenger '+chBad.length;
 // every fed check carries a side label; every UNPROVEN one is labelled
 c=c&&blk.split('\n').filter(l=>/^- .*ANSWER CHECK:/.test(l)).every(l=>/^- \(the (defender|challenger)'s answer\)/.test(l));
 c=c&&lab(blk,/^- .*ANSWER CHECK:.*\bUNPROVEN\b/,'(UNPROVEN press: no answering burden)');
 let expect='';
 if(v[0]==='TRUE'||v[0]==='FORM'){
  if(['7597','7104'].includes(String(x.id))){expect='all fed checks UNPROVEN, none proven';c=c&&fed.length>0&&notMeets.length===0;}
  else if(v[0]==='FORM'){expect='no proven not-MEETS check on the verses the line names, and the line quotes no answer: still DISAGREE on the letter';}
  else{expect='a proven MISSES/FAILS is still fed and labelled';c=c&&notMeets.length>0;}}
 else{ // FALSE
  if(linkState&&['6404','6405'].includes(String(x.id))){const vs=defBad.map(l=>(l.match(/ANSWER CHECK:\s*(.+?)\s*--/)||[])[1]);expect='the defender-answer MISSES fed are on Luke 2:4, Hebrews 7:14, Genesis 48:5 (Davidic-descent presses, not this link): the model must place them';d+=' ['+vs.join('; ')+']';c=c&&vs.join('|')==='Luke 2:4|Hebrews 7:14|Genesis 48:5';}
  else if(linkState){expect='no proven defender-answer not-MEETS fed against this link';c=c&&defBad.length===0;}
  else if(String(x.id)==='6404'){expect='the Luke 1:34 grant MEETS (labelled defender)';}
  else{expect='the burden it read is labelled UNPROVEN, or the failing answer is labelled the challenger\'s';}}
 T(x.id+' '+x.run+' '+x.seat+' E-HOLD '+x.item+' ['+v[0]+']: '+expect,c,d);}
// E-COL
const note=b=>/THE FAILS WORDS ARE FOUND EXACTLY IN \[/.test(b||'');
for(const id of [5931,5934]){const r=res[id];T(id+' ('+r.x.seat+' E-COL FALSE): the FAILS-words note is added',note(r.bb)&&!note(r.ba));}
const colTrue=items.filter(i=>i.rule==='E-COL'&&!['5931','5934'].includes(String(i.id)));
const withNote=colTrue.filter(i=>note(res[i.id].bb)).map(i=>i.id+'('+V['E-COL'][i.id]?.[0]||'TRUE'+')');
T('every E-COL item is still sent; the note is added only where the FAILS words are found in the answer\'s round',items.filter(i=>i.rule==='E-COL').every(i=>!!res[i.id].bb));
console.log('     E-COL items other than 5931/5934 that now carry the note ('+withNote.length+' of '+colTrue.length+'): '+colTrue.filter(i=>note(res[i.id].bb)).map(i=>i.id).join(' '));
console.log('     E-COL items without it: '+colTrue.filter(i=>!note(res[i.id].bb)).map(i=>i.id).join(' '));
T('E-HOLD, E-COL and E-RES stay RECORD-ONLY TRIAL (count of the marker unchanged)',plan.nodes.every(n=>(rd('pkgEF/patched/'+n.file).match(/RECORD-ONLY TRIAL/g)||[]).length===(rd(plan.base+'/'+n.file).match(/RECORD-ONLY TRIAL/g)||[]).length));
fs.writeFileSync('pkgEF/feed_EF.txt',items.map(x=>'=== '+x.id+' '+x.rule+' '+x.seat+' '+x.item+' ['+(V[x.rule][x.id]||['TRUE'])[0]+']\n'+(res[x.id].bb||'(not sent)')).join('\n\n'));
console.log(ok+' OK, '+bad+' FAIL');


