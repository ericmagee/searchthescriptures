// test_EAW: F 33311 fixture (verbatim CR3 blocks, DB rows 13140-13165), N negative controls, B Build replay on all saved runs (stack base vs patched),
// R Record replay on all saved runs (patched Build output feeds the patched Record; base Build output feeds the base Record), every flip listed.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
const ld=(f,ret)=>new Function(fs.readFileSync(__dirname+'/'+f,'utf8')+';return '+ret+';')();
const eawBlock=ld('eaw_build_lib.js','eawBlock'),eawHoldWhy=ld('eaw_record_lib.js','eawHoldWhy');
let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const R={CR3:fs.readFileSync(__dirname+'/fixture_33311_CR3.txt','utf8')};
const ROWS=[[13140,'Luke 1:34','I grant it.','The answer says only "I grant it."',true],[13141,'Luke 1:34','I grant it.','The answer says only "I grant it."',true],
 [13142,'Luke 1:35','I grant that kaleō is in both verses.','The answer says "I grant that kaleō is in both verses," which does not show how the naming adds to the title.',false],
 [13143,'Luke 1:32','I grant the order.','The answer says only "I grant the order."',true],[13144,'Luke 1:32','I grant the order.','The answer says only "I grant the order."',true],[13145,'Luke 1:32','I grant the order.','The answer says only "I grant the order."',true],
 [13146,'Acts 1:8','I grant it.','The answer says only "I grant it."',true],[13147,'Acts 1:8','I grant it.','The answer says only "I grant it."',true]];
for(const [id,v,a,why,exp] of ROWS){const b=eawBlock(R,['CR3'],v,a);T(!!b&&b.t.startsWith(v),'F '+id+' block found for '+v+(b?' ('+b.t.split('\n').length+' lines)':''));const h=b?eawHoldWhy(why,b.t):null;T(!!h===exp,'F '+id+' '+(exp?'HELD':'still sent')+(h?': '+h:''));}
{const b=eawBlock(R,['CR3'],'1 John 4:7','I grant it.');T(!!b&&b.t.startsWith('1 John 5:1'),'F 1 John 4:7 found in the paragraph that starts with 1 John 5:1');}
{const b=eawBlock(R,['CR3'],'Acts 1:8','I deny it.');T(!b,'F block refused when the judge-quoted answer is not in it');}
{const b=eawBlock(R,['CR3'],'Romans 9:9','I grant it.');T(!b,'F no block for a verse the round does not answer');}
{const X={CR3:'Presses:\n- Matthew 1:24 "and took unto him his wife". I grant that paralambano is the coming together of Matthew 1:18.\n- Matthew 1:25 "And knew her not". I grant that heos marks a limit.'};const b=eawBlock(X,['CR3'],'Matthew 1:24','I grant that');T(!!b&&b.t.split('\n').length===1,'F plain-bullet form (33218): the Matthew 1:24 block stops before the Matthew 1:25 bullet');}
const NR={CR3:'Luke 1:31 "thou shalt conceive in thy womb" The press: it is future.\n- I grant it.\n\nLuke 1:36 "she hath also conceived" The press: x.\n- I grant it. That is all.'};
{const b=eawBlock(NR,['CR3'],'Luke 1:31','I grant it.');T(!!b&&!eawHoldWhy('The answer says only "I grant it."',b.t),'N1 a bare "I grant it." with nothing after it is still sent');}
{const b=eawBlock(NR,['CR3'],'Luke 1:36','I grant it.');T(!!b&&!eawHoldWhy('The answer says only "I grant it."',b.t),'N2 "I grant it." plus 3 words and no layer is still sent');}
{const b=eawBlock(R,['CR3'],'Acts 1:8','I grant it.');T(!eawHoldWhy('The answer grants the verb but never shows the result.',b.t),'N3 a reason without "only" is still sent');}
{const B33345={CR3:'Presses answered:\n- **Acts 1:8** ("after that the Holy Ghost is come upon you"). I grant it is the same verb, *eperchomai* (G1904, "to supervene, influence"). In Acts 1:8 the result is "ye shall be witnesses." In Luke 1:35 the result is "that holy thing which shall be born of thee."\n- **Luke 9:34** ("there came a cloud, and overshadowed them") and **Acts 5:15** ("the shadow of Peter passing by might overshadow some of them"). I grant the range of *episkiazō*.'};
 const b=eawBlock(B33345,['CR3'],'Acts 5:15','I grant the range');T(!!b&&b.t.startsWith('- **Luke 9:34**')&&b.t.split('\n').length===1,'F bullet form (33345): Acts 5:15 found on the Luke 9:34 bullet, one line, stops before the next bullet');
 const c=eawBlock(B33345,['CR3'],'Acts 1:8','I grant it is the same verb');T(!!c&&c.t.split('\n').length===1,'F bullet form: Acts 1:8 block stops at the next "- **" bullet');}
// B and R: saved runs
const D='/mnt/project-files/wall2024/inputs/';const runs=fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Record\.json$/.test(f)&&!/_Alt_/.test(f)).map(f=>f.split('_')[0]).sort();
const STK=[['stack (EPS live + ETC)','../pkgEPS/patched_live','../pkgETC/patched_on_pkgEPS_patched_live','patched'],['live s40 only',null,null,'patched_live_only'],['on pkgEPD','../pkgEPS/patched_live','../pkgEPD/patched_live','patched_on_pkgEPD']];
const LIVE=n=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s40.json','utf8')).nodes.find(z=>z.name===n).parameters.jsCode;
const flips=[];let found=0,items=0;const ex=[];
for(const [lab,bb,rb,pd] of STK)for(const RUN of runs)for(const [bn,bi,rn,ri] of [['Judge Enforcer Build','Enforcer Record','Judge Enforcer Record','Judge Enforcer Call deepseek'],['Alt Judge Enforcer Build','Alt Seated','Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek']]){
 const f=n=>n.replace(/ /g,'_')+'.js';const code=(dir,n)=>dir?fs.readFileSync(__dirname+'/'+dir+'/'+f(n),'utf8'):LIVE(n);
 let b0,b1;try{b0=harness(RUN)(code(bb,bn),bi);b1=harness(RUN)(code(pd,bn),bi);}catch(e){T(false,'B ['+lab+'] '+RUN+' '+bn+' threw '+e.message);continue;}
 const J0=b0.map(x=>x.json),J1=b1.map(x=>x.json);const I0=J0.flatMap(j=>j.ids||[]),I1=J1.flatMap(j=>j.ids||[]);let idsOk=I0.length===I1.length,txtOk=true,nI=0,nF=0;const BLK={};
 I0.forEach((x,k)=>{const y={...(I1[k]||{})};if(x.rule==='E-ANS'&&/\.1$/.test(x.id)){nI++;if('eaw_blk' in y){nF++;BLK[x.id]=y.eaw_blk;if(ex.length<6&&lab.startsWith('stack'))ex.push(RUN+' '+x.item+' :: '+y.eaw_blk.slice(0,240).replace(/\n/g,' / '));}}delete y.eaw_blk;if(JSON.stringify(x)!==JSON.stringify(y))idsOk=false;});
 const secs=J=>{const o={};for(const j of J){const p=j.body&&j.body.messages?j.body.messages[1].content:'';const parts=p.split(/\n\n(?=ITEM )/);parts.slice(1).forEach(q=>{o[q.split('\n')[0]]=q;});}return o;};
 const S0=secs(J0),S1=secs(J1);const strip=s=>s.replace(/\nTHE ANSWER IN FULL, FROM \[[^\]]*\] \(every line[^)]*\): "[\s\S]*?"(?=\nTHE JUDGES' GRADES:)/g,'');
 for(const k of Object.keys(S0))if(strip(S1[k]||'')!==S0[k]){txtOk=false;}if(Object.keys(S0).length!==Object.keys(S1).length)txtOk=false;
 const nc0=(J0[0]||{}).not_checked||[],nc1=(J1[0]||{}).not_checked||[];
 const rule1=((J1[0]||{}).body||{messages:[{content:''}]}).messages[0].content+((J1[0]||{}).body||{messages:[0,{content:''}]}).messages[1].content;
 if(lab.startsWith('stack')){items+=nI;found+=nF;}
 T(idsOk&&txtOk&&nc1.length===nc0.length&&(!J1.length||!(J1[0]&&J1[0].body)||/The answer is every line the answering side wrote under the pressed verse/.test(rule1)),'B ['+lab+'] '+RUN+' '+bn+': calls '+J0.length+' -> '+J1.length+', not checked '+nc0.length+' -> '+nc1.length+'; E-ANS items '+nI+', full answer added for '+nF+'; ids equal apart from eaw_blk; each ITEM text equal apart from its IN FULL line; rule sentence present');
 const b0x=b0.map(x=>({json:{...x.json,ids:(x.json.ids||[]).map(y=>BLK[y.id]!==undefined?{...y,eaw_blk:BLK[y.id]}:y)}})); /* the saved replies match the base call grouping, so the record is fed the base calls with the blocks the patched Build found */
 let r0,r1;try{r0=harness(RUN,{[bn]:b0})(code(rb,rn),ri);r1=harness(RUN,{[bn]:b0x})(code(pd,rn),ri);}catch(e){T(false,'R ['+lab+'] '+RUN+' '+rn+' threw '+e.message);continue;}
 const A=r0[0].json.enf428_rows||[],C=r1[0].json.enf428_rows||[];let same=A.length===C.length,n=0;
 A.forEach((x,i)=>{const y=C[i];if(JSON.stringify({...x,at:0})===JSON.stringify({...y,at:0}))return;n++;const okf=/^ENFORCER HELD \(pkgEAW, not sent/.test(y.cure_reason)&&/^ENFORCER DISAGREE \(right: MISSES\)/.test(x.cure_reason)&&JSON.stringify({...x,at:0,cure_reason:0})===JSON.stringify({...y,at:0,cure_reason:0});if(!okf)same=false;flips.push('['+lab+'] '+RUN+' '+y.seat+' '+y.item+' :: '+y.cure_reason.slice(0,330));});
 T(same,'R ['+lab+'] '+RUN+' '+rn+': '+A.length+' rows, '+n+' HELD by pkgEAW, nothing else changed');}
console.log('\nFULL ANSWER FOUND (stack, first ids): '+found+' of '+items+'\nEXAMPLES:\n'+ex.join('\n'));
console.log('\nFLIPS ('+flips.length+'):\n'+flips.join('\n'));console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
