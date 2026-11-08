// pkgEAK test (W2, 11-08). Run from wall2024/: node pkgEAK/test_EAK.cjs
const fs=require('fs');const crypto=require('crypto');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s58.json','utf8'));const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const P=n=>fs.readFileSync('pkgEAK/patched/'+n.replace(/ /g,'_')+'.js','utf8');const B0=fs.readFileSync('pkgEKD/patched/Alt_Judge_Enforcer_Build.js','utf8');
T(h(live('Alt Judge Enforcer Record'))==='adffc9d2d5f8'&&h(live('Alt Judge Enforcer Retry Build'))==='68c48b595ed0','Record and Retry Build bases are live s58');
T(h(B0)==='79898dee1307','Alt Judge Enforcer Build base is pkgEKD/patched (79898dee1307), which stacks on live s58');
// 1. replay Alt Judge Enforcer Build: base items unchanged; one K-W item where the alternate has K-W/K-S3 cure rows
const runs=fs.readdirSync(D).filter(f=>f.endsWith('_Alt_Judge_Enforcer_Build.json')).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x);
let n=0,same=0,withKW=0,expect=0,idsOK=0;const per=[];const OUT={};
for(const RUN of runs){let a,b;try{a=harness(RUN)(B0,'Alt Seated');b=harness(RUN)(P('Alt Judge Enforcer Build'),'Alt Seated');}catch(e){log('   '+RUN+' skipped: '+String(e.message).slice(0,80));continue;}n++;
 const ek=b.filter(x=>x.json&&x.json.eak);const rest=b.filter(x=>!(x.json&&x.json.eak));if(st(rest)===st(a))same++;OUT[RUN]=b;
 let L=[];try{L=harness(RUN)("return [{json:{L:$('Alternate Merge Seat').first().json.enforcer_log}}];",'Alt Seated')[0].json.L||[];}catch(e){L=[];}
 const want=L.filter(r=>r&&r.kind==='cure'&&r.seat_role==='alternate'&&(r.rule==='K-W'||r.rule==='K-S3'));if(want.length)expect++;if(ek.length)withKW++;
 if(ek.length===(want.length&&!(a[0]&&a[0].json&&a[0].json.je_skip)?1:0)&&(!ek.length||ek[0].json.ids.length===want.length))idsOK++;
 per.push(RUN+': base items '+a.length+', K-W item '+(ek.length?ek[0].json.ids.length+' ids ('+[...new Set(ek[0].json.ids.map(x=>x.seat))].join(',')+')':'none')+', alternate K-W/K-S3 cure rows '+want.length);}
log('Alt Judge Enforcer Build replay over '+n+' runs');per.forEach(x=>log('   '+x));
T(n>=20,'replay ran ('+n+')');T(same===n,'every base call item is unchanged ('+same+' of '+n+')');T(idsOK===n,'a K-W item exactly where the alternate has K-W/K-S3 cure rows, one id per row ('+idsOK+' of '+n+'; '+withKW+' with the item)');
// 2. the alternate prompt equals live Enforcer Build's own prompt for the same rows, ids relabelled
{const RUN='33617';const H0=harness(RUN);const L=H0("return [{json:{L:$('Alternate Merge Seat').first().json.enforcer_log}}];",'Alt Seated')[0].json.L;const al=L.filter(r=>r&&r.kind==='cure'&&r.seat_role==='alternate'&&(r.rule==='K-W'||r.rule==='K-S3'));
 const sv=n=>{const d=JSON.parse(fs.readFileSync(D+RUN+'_'+n.replace(/ /g,'_')+'.json','utf8'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
 const pcc=sv('Panel Cure Check');pcc[0].json={...pcc[0].json,enforcer_log:al};const acn=sv('Alternate Cure Normalize');
 const m=harness(RUN,{'Panel Cure Check':pcc,'Panel Cure Normalize 1':acn,'Panel Cure Normalize 2':null,'Panel Cure Normalize 3':null})(live('Enforcer Build'),'Panel Cure Check')[0].json;
 const k=OUT[RUN].find(x=>x.json.eak).json;const U=s=>s.body.messages[1].content;const rel=String(U(k)).replace(/\bW(\d+)\.(\d+)/g,'A$1.$2').replace(/ITEM W(\d+) \(/g,(z,i)=>'ITEM '+i+' OF '+m.groups+' (').replace('W<item>.<n>','A<item>.<n>');
 T(rel===U(m),'33617: the alternate K-W prompt equals live Enforcer Build\'s prompt for the same 26 rows, apart from the W labels ('+U(m).length+' chars)');
 T(k.body.messages[0].content===m.body.messages[0].content,'33617: the system text (enforcer role + judges\' agreement) equals the panel K-W call');
 T(/STATEMENT:/.test(U(k))===/STATEMENT:/.test(U(m)),'33617: STATEMENT lines read from the alternate\'s own cure reply as for the panel');
 log('   33617 K-W ids: '+k.ids.length+' ('+k.ids.filter(x=>x.rule==='K-W').length+' K-W, '+k.ids.filter(x=>x.rule==='K-S3').length+' K-S3), grades '+JSON.stringify([...new Set(k.ids.map(x=>x.grade))]));
 // 3. Retry Build splits the K-W call like any call when the reply is short
 const items=OUT[RUN].map(x=>({json:x.json}));const kwi=items.length-1;
 const okRep=t=>({choices:[{finish_reason:'stop',message:{content:t}}]});let calls=sv('Alt Judge Enforcer Call deepseek');
 const lines=k.ids.map((x,i)=>'ENFORCER: '+x.id+' -- '+(i===0?'DISAGREE':'AGREE')+' -- NEEDS: '+(i===0?'YES':'NO')+' -- test sentence "'+x.id+'".').join('\n');
 const rep=calls.slice(0,items.length-1).concat([{json:okRep(lines)}]);
 const rb=harness(RUN,{'Alt Judge Enforcer Build':items})(P('Alt Judge Enforcer Retry Build'),'Alt Judge Enforcer Call deepseek');
 const rbS=harness(RUN,{'Alt Judge Enforcer Build':items,'Alt Judge Enforcer Call deepseek':calls.slice(0,items.length-1).concat([{json:okRep('ENFORCER: W1.1 -- AGREE -- NEEDS: NO -- x')}])})(P('Alt Judge Enforcer Retry Build'),'Alt Judge Enforcer Call deepseek');
 const H=rbS.filter(x=>x.json.esr_retry&&x.json.esr_of===kwi);
 T(H.length===2&&H.reduce((a,x)=>a+x.json.ids.length,0)===k.ids.length&&H.every(x=>/^RULE K-W/.test(x.json.body.messages[1].content)),'Retry Build: a short reply to the K-W call (1 line for '+k.ids.length+' ids) splits it into 2 halves holding all its ids');
 // 4. Record: W ids read, K-W/K-S3 tallied, rows alternate enforcer_check
 const rec=harness(RUN,{'Alt Judge Enforcer Build':items,'Alt Judge Enforcer Call deepseek':rep,'Alt Judge Enforcer Retry Call deepseek':null})(P('Alt Judge Enforcer Record'),'Alt Judge Enforcer Call deepseek')[0].json;
 const kr=rec.enf428_rows.filter(r=>r.rule==='K-W'||r.rule==='K-S3');
 T(kr.length===k.ids.length&&kr.every(r=>r.kind==='enforcer_check'&&r.seat==='sol'&&r.seat_role==='alternate'),'Record: '+kr.length+' K-W/K-S3 enforcer_check rows for sol (alternate)');
 T(kr.filter(r=>/^ENFORCER DISAGREE: NEEDS: YES/.test(r.cure_reason)).length===1&&kr.filter(r=>/^ENFORCER AGREE: NEEDS: NO/.test(r.cure_reason)).length===k.ids.length-1,'Record: each W id gets its own verdict (1 DISAGREE, '+(k.ids.length-1)+' AGREE), NEEDS kept as the panel rows keep it');
 log('   sample row: '+kr[0].cure_reason.slice(0,200));log('   tally: '+JSON.stringify({KW:rec.enf428.tally['K-W'],KS3:rec.enf428.tally['K-S3']}));
 const recB=harness(RUN,{'Alt Judge Enforcer Retry Call deepseek':null})(live('Alt Judge Enforcer Record'),'Alt Judge Enforcer Call deepseek')[0].json;
 const recP=harness(RUN,{'Alt Judge Enforcer Retry Call deepseek':null})(P('Alt Judge Enforcer Record'),'Alt Judge Enforcer Call deepseek')[0].json;
 const strip=o=>JSON.stringify(o,(kk,v)=>kk==='at'?undefined:v).replace(/,"K-W":\{[^}]*\},"K-S3":\{[^}]*\}/,'');
 T(strip(recB)===strip(recP),'Record on the saved 33617 calls (no K-W call): the same rows and report as live, apart from two empty tallies');
 // 5. send-back stays K-W free
 T(/x\.rule!=='K-W'/.test(live('Alt Send Back Build')),'Alt Send Back Build already leaves K-W rows out of send-backs (ruling 445)');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgEAK/test_EAK.txt',out.join('\n')+'\n');
