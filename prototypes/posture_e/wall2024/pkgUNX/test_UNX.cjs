// pkgUNX node test. Run from wall2024/: node pkgUNX/test_UNX.cjs   (reads the repo only)
//  A. replay_UNX.cjs on 33040-33197 (10 items, the 33197 four among them; 33149 chatgpt and sol premise 2 are MEANS grounds, not items)  B. each patched node = its base + the planned edits, and compiles
//  C. the K-UNX cure block, cut from Panel Cure Check, on mocked replies  D. units: a named missing layer, a non-layer ground, a thin block
//  E. scope_UNX.cjs: kunxLines and what it reads are in scope in the 22 library nodes
const fs=require('fs');const cp=require('child_process');let ok=0,bad=0;const t=(n,c)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n);}};
const run=f=>{try{return cp.execFileSync('node',[f]).toString();}catch(e){return String(e.stdout||'');}};
const rp=run('pkgUNX/replay_UNX.cjs');t('A1 replay: '+rp.split('\n')[0],/verdicts read: 37; UNEXHIBITED premise segments: 31; K-UNX items: 10/.test(rp));
t('A2 the four 33197 Oracle concedes are items',['33197 gemini CHALLENGER premise 5','33197 chatgpt CHALLENGER premise 1','33197 chatgpt CHALLENGER premise 5','33197 single CHALLENGER premise 1'].every(s=>rp.includes(s)));
t('A4 33149 chatgpt and sol premise 2 (the MEANS ground, W3 2683 condition 2) are not items',!/33149 (chatgpt|sol) CHALLENGER premise 2/.test(rp));
t('A3 sol 33197 (0 counted) raises none',!/33197 sol /.test(rp));
const plan=JSON.parse(fs.readFileSync('pkgUNX/plan_UNX.json','utf8'));const src=fs.readFileSync('pkgUNX/build_UNX.cjs','utf8');const LIB=fs.readFileSync('pkgUNX/unx_lib.js','utf8');
const E=new Function('LIB',src.slice(src.indexOf('const E={'),src.indexOf('const plan=')).replace('const E=','return ')+';')(LIB);
for(const n of plan.nodes){const b=fs.readFileSync('pkgUNX/base/'+n.file,'utf8'),p=fs.readFileSync('pkgUNX/patched/'+n.file,'utf8');let u=p;for(const k of n.edits.slice().reverse())u=u.split(E[k][1]).join(E[k][0]);
 let c=true;try{new Function('$','$input','$json','$execution',p);}catch(e){c=false;}t('B '+n.name+' = base + '+n.edits.join(',')+', compiles',u===b&&c);}
t('B2 24 nodes',plan.nodes.length===24);
const AM=fs.readFileSync('pkgUNX/patched/Alternate_Merge.js','utf8');const env=AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"));
const K=new Function('$','$input',env+';return {kunxLines,unxNamed};')(()=>{throw 0;},null);
const P=fs.readFileSync('pkgUNX/patched/Panel_Cure_Check.js','utf8');const i=P.indexOf("if(x.rule==='K-UNX'){");const j=P.indexOf("  if(x.rule==='K-LB'){const st=stmtOf(x);",i);const BLK=P.slice(i,j);
const cure=(x,st,count)=>new Function('$','x','o',env+"const stmtOf=()=>o.st;const res=(st,why,l)=>({st,why,l});"+BLK+"return {st:'FELL THROUGH'};")(()=>{throw 0;},x,{st,count:count||[]});
const x={rule:'K-UNX',side:'CHALLENGER',link:'CHALLENGER premise 5',kinds:['L1','L2','L3'],conc:2};
t('C1 a STATEMENT naming [L4] cures',cure(x,'its [L4] chain does not follow from the layers').st==='CURED');
t('C2 a STATEMENT naming [L2], which the block exhibits, does not cure',cure(x,'the [L2] is missing').st==='UNCURED');
t('C3 a CORRECTED COUNT below 2 cures',cure(x,null,[{side:'CHALLENGER',n:1,line:'CHALLENGER CONCEDED LINKS: 1'}]).st==='CURED');
t('C4 nothing: UNCURED',cure(x,null,[]).st==='UNCURED');
t('C5 a K-LB item is not taken by the block',cure({...x,rule:'K-LB'},null).st==='FELL THROUGH');
const blk2='LINK 1: SUPPORTED.\n- [L1] Matthew 1:18: "before they came together, she was found with child of the Holy Ghost."\n- [L2] \"Came together\" is *synerchomai* (G4905), \"to come together.\"\n- [L3] Matthew 1:24: "and took unto him his wife."\n- [L4] So it fits.\n';
const PT='=== [CR3] ===\nDEFENDER\n\n=== [DR3] ===\n'+blk2+'\nLINK 2: SUPPORTED.\n- thin\n';
const R97=JSON.parse(fs.readFileSync('pkgUNX/replay_rows.json','utf8')).find(r=>r.run.includes('33197'));const PT97='=== [CR3] ===\n'+R97.e3+'\n\n=== [DR3] ===\n'+R97.c3+'\n';
const k97=cl=>K.kunxLines('CHALLENGER CONCEDED LINKS: 1 -- '+cl+'\nRESULT: HELD',PT97).items;
const k=(cl)=>K.kunxLines('CHALLENGER CONCEDED LINKS: 1 -- '+cl+'\nRESULT: HELD',PT).items.length;
t('D1 fit-not-footing on a layered block: one item',k('Premise 1 UNEXHIBITED: the pressed meaning is not accommodated.')===1);
t('D2 the count names a layer the block lacks ([L4]): no item',k('Premise 1 UNEXHIBITED: its [L4] does not follow.')===0);
t('D3 33197 LINK 5 (it reads [L1], [L2], [L3]): a count naming [L2] is still an item; naming [L4] is not',(r=>r.length===1&&JSON.stringify(r[0].kinds)==='["L1","L2","L3"]')(k97('Premise 5 UNEXHIBITED: no [L2] for Luke 1:35.'))&&k97('Premise 5 UNEXHIBITED: its [L4] does not follow.').length===0);
t('D4 an unanswered witness ground: no item',k('Premise 1 UNEXHIBITED: Luke 1:34 is left unanswered.')===0);
t('D5 a thin block (premise 2) counted UNEXHIBITED: no item',k('Premise 2 UNEXHIBITED: no layers.')===0);
t('D6 "not UNEXHIBITED": no item',k('Premise 1 is not UNEXHIBITED.')===0);
t('D7 the mark is not counted in audit_flags',!/K-UNX\)[^\n]*REVIEW THIS ROW/.test(LIB));
const R49=JSON.parse(fs.readFileSync('pkgUNX/replay_rows.json','utf8')).find(r=>r.run.includes('33149'));const PT49='=== [CR3] ===\n'+R49.e3+'\n\n=== [DR3] ===\n'+R49.c3+'\n';
const k49=(cl,pt)=>K.kunxLines('CHALLENGER CONCEDED LINKS: 1 -- '+cl+'\nRESULT: HELD',pt||PT49).items.length;
t('F1 33149: the count quotes the MEANS of P2.3 word for word, the block does not: no item',k49('Premise 2 UNEXHIBITED: the answer does not meet the MEANS "a husband who knew himself the father had no cause to put her away."')===0);
t('F2 33149: the count names the pressed verse (Matthew 1:19) with the MEANS ground: no item',k49('Premise 2 UNEXHIBITED: Matthew 1:19 is answered without meeting the claimed significance.')===0);
t('F3 33149: the MEANS ground names no press of premise 2: an item',k49('Premise 2 UNEXHIBITED: the answer does not meet the claimed significance.')===1);
t('F4 33149: a press of another premise (Luke 1:13, premise 5): an item',k49('Premise 2 UNEXHIBITED: Luke 1:13 is answered without meeting its MEANS.')===1);
{const M='a husband who knew himself the father had no cause to put her away';const c3=R49.c3.replace('**Answers to the presses on Link 2:**','**Answers to the presses on Link 2:**\n- MEANS [CR3] P2.3: "'+M+'."');const pt='=== [CR3] ===\n'+R49.e3+'\n\n=== [DR3] ===\n'+c3+'\n';
 t('F5 33149 with the MEANS quoted in the block: the MEANS ground is not taken, an item',k49('Premise 2 UNEXHIBITED: the answer does not meet the MEANS "'+M+'."',pt)===1);}
t('F6 the MEANS ground without a meet/answer verb ("the pressed meaning is not accommodated", D1): still an item',k('Premise 1 UNEXHIBITED: the pressed meaning is not accommodated.')===1);
const sp=run('pkgUNX/scope_UNX.cjs');t('E1 scope: '+sp.trim().split('\n').pop(),/22 OK, 0 FAIL/.test(sp));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
