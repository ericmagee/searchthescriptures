// ASK 587 option 3 offline tests. node t587o3.cjs -> out_t587o3.txt. Compares pre-587 (196402d0), live 587 (7536d7bf) and option 3.
const fs=require('fs');process.chdir(__dirname);const {cut,src}=require('./libpatch.js');const cp=require('child_process');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const lib=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return {W,L:cut(W).L,f};};
const PRE=lib('live_eng.json'),NOW=lib('live587_eng.json'),O3=lib('target_engine_587o3.json');
console.log('== Parse: every library source of option 3, engine and child');
{const acorn=require('/opt/node-tools/node_modules/acorn');let n=0,e=0;for(const f of ['target_engine_587o3.json','target_child_587o3.json']){const W=JSON.parse(fs.readFileSync(f));for(const k of Object.keys(cut(W).M)){n++;try{acorn.parse('(async function(){'+src(W,k)+'\n})',{ecmaVersion:'latest'});}catch(x){e++;console.log('   parse error',f,k,x.message);}}}ok(e===0,'sources parse: '+n+', errors '+e);}
console.log('== Library Check pair and scope');
{const p=cp.spawnSync('node',['/mnt/project-files/ask557/w4/build/test557.js','--pair',__dirname+'/target_engine_587o3.json',__dirname+'/target_child_587o3.json'],{encoding:'utf8'});const t=p.stdout.trim().split('\n').pop();console.log('   '+t);ok(/Library Check PASSES/.test(t),'pair passes');
 for(const f of ['target_engine_587o3.json','target_child_587o3.json']){const s=cp.spawnSync('node',['scope587.cjs',f],{encoding:'utf8'});console.log('   '+s.stdout.trim().split('\n').pop());ok(s.status===0,'scope: 0 out of scope in '+f);}}
console.log('== v25 recompute (LIB 1351), gate recompute (LIB 1492): one counted unnamed challenger break, the 1273 inputs');
{const res=(X,ln,cecC)=>new Function('cecC',X.L[1286]+'\nconst word="BROKEN",cst="SELF-SUPPORTED",dst="PROP-DEPENDENT",c={DEFENDER:1,CHALLENGER:0},__c400=[{link:"D3 vs C1",grade:"DEFENDER LINK BROKEN"}],__R399=[],__cecX={DEFENDER:0,CHALLENGER:cecC},trig=[];\n'+X.L[ln]+'\nreturn res;')(cecC);
 for(const ln of [1351,1492]){const a=res(PRE,ln,1),b=res(NOW,ln,1),c=res(O3,ln,1);console.log('   LIB '+ln+': pre-587 '+a+', 587 live '+b+', option 3 '+c);ok(c===a&&c!==b,'LIB '+ln+': option 3 gives the pre-587 word ('+c+'); the unnamed break does not enter the RESULT');ok(res(O3,ln,0)===res(NOW,ln,0),'LIB '+ln+' control: with no unnamed break option 3 equals 587 live');}
 ok(O3.L[1363].includes("RECORD ONLY, NOT IN THE RESULT: counted breaks no collision line names: DEFENDER '+__cecX.DEFENDER"),'the v25 line prints the break as record only');}
console.log('== ert386 (AUDIT v61) on the stored judgments 1272 to 1274');
{const ERT=W=>new Function('$',src(W,'Alternate Merge ERT')+'\nreturn ert386;')(()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]}));const JD=JSON.parse(fs.readFileSync('data/judgments_1272_1274.json'));const rows=Array.isArray(JD)?JD:Object.values(JD);
 const v61=(e,r)=>{const t=String(e(r.verdict_raw,'x',{verdict_tag:r.verdict_tag,defense_standing:r.defense_standing,challenge_standing:r.challenge_standing,conceded_links:r.conceded_links,challenger_conceded_links:r.challenger_conceded_links}));const i=t.lastIndexOf('[AUDIT v61: ENGINE RESULT');const z=t.slice(i,t.indexOf('END]',i)+4);return {w:(z.match(/WORD: ([A-Z ]+);/)||[])[1],z};};
 const ep=ERT(PRE.W),en=ERT(NOW.W),eo=ERT(O3.W);
 for(const r of rows){const a=v61(ep,r),b=v61(en,r),c=v61(eo,r);console.log('   '+r.id+': pre-587 '+a.w+', 587 live '+b.w+', option 3 '+c.w+'\n     option 3 tag: '+c.z);
  ok(c.w===a.w,r.id+': option 3 v61 WORD equals pre-587 ('+c.w+')');
  if(r.id!=1272)ok(/RECORD ONLY \(not in the RESULT\) C1 \(CLOSE-CONTRADICTION, no collision line names it\) CHALLENGER LINK BROKEN/.test(c.z)&&!/BROKEN LINES[^;]*C1 \(CLOSE/.test(c.z.split('RECORD ONLY')[0]),r.id+': the break is printed as RECORD ONLY and is not among BROKEN LINES');
  else ok(c.z===b.z,'1272 control: option 3 tag equals 587 live');}}
console.log('== sbApply2024 in its real scope (Gate Record), 1273, the run\'s confirmed list holding the challenger C1 break');
{const G=require('./gatefn.cjs');const JD=JSON.parse(fs.readFileSync('data/judgments_1272_1274.json'));const rows=Array.isArray(JD)?JD:Object.values(JD);const r=rows.find(x=>x.id==1273);const F={verdict_tag:r.verdict_tag,defense_standing:r.defense_standing,challenge_standing:r.challenge_standing,conceded_links:r.conceded_links,challenger_conceded_links:r.challenger_conceded_links};
 const line=String(r.verdict_raw).replace(/\\n/g,'\n').split('\n').find(l=>/^\s*\**RESULT\s*:/.test(l));const its=[{ans:'CHANGE',sid:'S1',line,to:line.replace(/RESULT\s*:\s*[A-Z ]+/,'RESULT: UNDERDETERMINED ')}];
 const cec={'Close Enforcer Record':{cec:{confirmed:[{side:'CHALLENGER',link:1,why:'test'}]}}};const run=(f,ex)=>{try{return G(f,'Gate Record',ex).sbApply2024('spark',r.verdict_raw,F,its,{}).result;}catch(e){return 'THROW '+e.message;}};
 const a=run('live_eng.json',cec),b=run('live587_eng.json',cec),c=run('target_engine_587o3.json',cec);console.log('   pre-587 '+a+', 587 live '+b+', option 3 '+c);
 ok(c===a&&!/THROW/.test(c),'option 3 gives the pre-587 gate word, no error');ok(run('target_engine_587o3.json',{})===run('live587_eng.json',{}),'control: no confirmed break, option 3 equals 587 live');}
console.log('== Scope of the change: only LIB 1286, 1351, 1363, 1492 differ from 587 live; A, B, C1, C2, E are untouched');
{const d=NOW.L.map((l,i)=>l!==O3.L[i]?i:-1).filter(i=>i>=0);ok(JSON.stringify(d)==='[1286,1351,1363,1492]','LIB lines changed: '+d.join(', '));
 const N=JSON.parse(fs.readFileSync('live587_eng.json')),T=JSON.parse(fs.readFileSync('target_engine_587o3.json'));const ch=T.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify(N.nodes.find(x=>x.name===n.name).parameters)).map(n=>n.name);ok(JSON.stringify(ch)==='["Shared Library"]','engine nodes changed: '+ch.join(', '));
 const NC=JSON.parse(fs.readFileSync('live587_child.json')),TC=JSON.parse(fs.readFileSync('target_child_587o3.json'));const cc=TC.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify(NC.nodes.find(x=>x.name===n.name).parameters)).map(n=>n.name);ok(JSON.stringify(cc)==='["Shared Library"]','child nodes changed: '+cc.join(', '));}
console.log(fail?'RESULT: '+fail+' FAIL':'RESULT: ALL PASS');process.exit(fail?1:0);
