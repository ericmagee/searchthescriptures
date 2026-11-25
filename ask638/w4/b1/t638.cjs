// ASK 638 A tests (W4). node t638.cjs base_eng.json target_engine_638.json fx/j1279_fx.json
const fs=require('fs');const ld=require('./libload638.cjs');const [,,BA,TG,FX]=process.argv;
const B=JSON.parse(fs.readFileSync(BA,'utf8')),T=JSON.parse(fs.readFileSync(TG,'utf8')),X=JSON.parse(fs.readFileSync(FX,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const lib=E=>{const t=E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));};
(async()=>{
const O=await ld(B,'Cure Check',['cureRewrite','cpdSync']),N=await ld(T,'Cure Check',['cureRewrite','cpdSync']);
const OP=await ld(B,'Panel Payloads',['drvCPA']),NP=await ld(T,'Panel Payloads',['drvCPA']);
// the new LIB 1366 statement, run alone on the cure items
const l1366=lib(T)[1366];const st=l1366.slice(l1366.indexOf('const __cpDrop='),l1366.indexOf(' /* ASK 638'));const dropOf=v=>new Function('v',st+';return __cpDrop;')(v);
const raw0=o=>JSON.stringify(o,null,2);const arr=(s,k)=>{const m=s.match(new RegExp('"'+k+'"\\s*:\\s*\\[([^\\]]*)\\]'));return m?(m[1].match(/\d+/g)||[]).map(Number):null;};
const marks=s=>(s.match(/\[AUDIT v50:[\s\S]*?; END\]/g)||[]);
const R=(fields,add,drop)=>({rp:[],fields,tag:'BROKEN-1',retracted:[],cpAdd:add||{DEFENDER:[],CHALLENGER:[]},...(drop===undefined?{}:{cpDrop:drop})});
const F0={verdict_tag:X.obj.verdict_tag};
// C1: 42528 sol
const D=dropOf(X.items);console.log('C1 drop list from 54270/54271:',JSON.stringify(D));ok(JSON.stringify(D)==='{"DEFENDER":[],"CHALLENGER":[4]}','C1 drop list');
const raw=raw0(X.obj);const o1=O.cureRewrite(raw,true,R(X.fields_after,null,D),'sol',F0),n1=N.cureRewrite(raw,true,R(X.fields_after,null,D),'sol',F0);
console.log('C1 old array',JSON.stringify(arr(o1,'counted_premises_challenger')),'mark:',marks(o1).join(' | '));console.log('C1 new array',JSON.stringify(arr(n1,'counted_premises_challenger')),'mark:',marks(n1).join(' | '));
ok(marks(o1).length===1&&marks(o1)[0]===X.stored_mark,'C1 old mark equals the stored line');ok(JSON.stringify(arr(o1,'counted_premises_challenger'))==='[3,4]','C1 old [3,4]');
ok(JSON.stringify(arr(n1,'counted_premises_challenger'))==='[3]','C1 new [3]');ok(marks(n1).length===1&&/COUNTED PREMISES DERIVED \(pkgCPD\) -- SEAT: sol; SIDE: CHALLENGER; COUNT: 2 to 1; WAS: \[3,4\]; NOW: \[3\]; FROM: the cure took premise\(s\) 4 out of the count/.test(marks(n1)[0]),'C1 new DERIVED line');
ok(JSON.stringify(arr(n1,'counted_premises_defender'))==='[1,3,5,6]'&&o1.replace(/\[3,\s*4\]/,'X').split('[AUDIT v50')[0].length>0,'C1 defender array untouched');
const nz=s=>s.split('\n[AUDIT v50')[0].replace(/"counted_premises_challenger"\s*:\s*\[[^\]]*\]/,'X');ok(nz(o1)===nz(n1)&&o1.split('; END]').slice(1).join('; END]')===n1.split('; END]').slice(1).join('; END]'),'C1 nothing else in the text moves');
// N1: K-G8 and drv_uncured. K-G8 runs in Panel/Alternate Payloads (LIB 2426) on the judge's text before the cure, with the array the judge wrote; the cure runs later.
// the K-G8 test of LIB 2089: drvCPA(array).set.size differs from the count
const kg8=(F,P,cpC)=>{const c=F(cpC,null);return c.present&&c.set.size!==P.challenger_conceded_links?1:0;};
const pre={...X.obj};ok(kg8(OP.drvCPA,pre,[3,4])===0&&kg8(NP.drvCPA,pre,[3,4])===0,'N1 K-G8 at the payload (before the cure): none, old and new');
const post={...X.obj,challenger_conceded_links:1};const kO=kg8(OP.drvCPA,post,arr(o1,'counted_premises_challenger')),kN=kg8(NP.drvCPA,post,arr(n1,'counted_premises_challenger'));
console.log('N1 K-G8 if the post-cure array were tested: old',kO,'new',kN,'(not run live: drvBroken is called only at LIB 2426, before the cure)');ok(kO===1&&kN===0,'N1 post-cure K-G8 old 1 new 0');
// later readers: the judge enforcer prompt (LIB 2970 __cp and __show)
const cp=s=>{const m=String(s).match(new RegExp('\\\\?\x22counted_premises_challenger\\\\?\x22\\s*:\\s*\\[([\\d,\\s]*)\\]'));return m?m[1].split(',').map(x=>+x.trim()).filter(x=>x>0):null;};
const show=c=>'STORED COUNTED PREMISES FOR THIS SIDE: '+(c.length?c.join(', '):'none')+' -- premise 4 is '+(c.includes(4)?'COUNTED':'not counted (SPARED)');
console.log('ENFORCER PROMPT old:',show(cp(o1)));console.log('ENFORCER PROMPT new:',show(cp(n1)));ok(show(cp(o1))!==show(cp(n1)),'enforcer prompt text changes');
// C2 synthetic
const S=(o,fa,add,drop,seat)=>[O.cureRewrite(raw0(o),true,R(fa,add,drop),seat||'s',F0),N.cureRewrite(raw0(o),true,R(fa,add,drop),seat||'s',F0)];
const base={...X.obj};const fa=X.fields_after;
let [a,b]=S(base,fa,null,{DEFENDER:[],CHALLENGER:[3,4]});ok(a===b,'C2 drop 2 for a cut of 1: no change');
[a,b]=S(base,fa,null,{DEFENDER:[],CHALLENGER:[95]});ok(a===b,'C2 dropped premise not in the array (E-ASM fact 95): no change');
[a,b]=S(base,fa,{DEFENDER:[],CHALLENGER:[4]},{DEFENDER:[],CHALLENGER:[4]});ok(a===b,'C2 add and drop the same premise: no change');
[a,b]=S(base,fa,null,undefined);ok(a===b,'C2 no drop list: byte-equal');
[a,b]=S(base,fa,null,null);ok(a===b,'C2 send-back result cpDrop:null: byte-equal');
[a,b]=S(base,fa,null,{DEFENDER:[],CHALLENGER:[]});ok(a===b,'C2 empty drop list: byte-equal');
[a,b]=S({...base,challenger_conceded_links:1,counted_premises_challenger:[4]},{...fa,challenger_conceded_links:0},null,{DEFENDER:[],CHALLENGER:[4]});ok(a===b&&JSON.stringify(arr(b,'counted_premises_challenger'))==='[]','C2 count 0: as now, pkgCPD sets []');
[a,b]=S({...base,counted_premises_challenger:[3,4,5]},fa,null,{DEFENDER:[],CHALLENGER:[4]});ok(a===b,'C2 array longer than the count before the cure: no change');
[a,b]=S({...base,conceded_links:4,counted_premises_defender:[1,3,5,6]},{...fa,conceded_links:3,challenger_conceded_links:2},null,{DEFENDER:[5],CHALLENGER:[]});
ok(JSON.stringify(arr(b,'counted_premises_defender'))==='[1,3,6]'&&/SIDE: DEFENDER; COUNT: 4 to 3; WAS: \[1,3,5,6\]; NOW: \[1,3,6\]/.test(b)&&JSON.stringify(arr(a,'counted_premises_defender'))==='[1,3,5,6]','C2 defender side drop');
[a,b]=S({...base,challenger_conceded_links:3,counted_premises_challenger:[2,3,4]},fa,null,{DEFENDER:[],CHALLENGER:[2,4]});ok(JSON.stringify(arr(b,'counted_premises_challenger'))==='[3]'&&/FROM: the cure took premise\(s\) 2, 4 out/.test(b),'C2 two premises dropped for a cut of 2');
// drop-list builder cases
ok(JSON.stringify(dropOf([{side:'CHALLENGER',premise:4,status:'UNCURED',why:'TRIAL rule (K-UNX): CORRECTED COUNT 1 takes the premise out of the count'}]).CHALLENGER)==='[]','C2 UNCURED item gives no drop');
ok(JSON.stringify(dropOf([{side:'DEFENDER',premise:2,status:'CURED',why:"TRIAL rule (E-ASM): E-ASSUME found ...; a CORRECTED COUNT cannot take the premise out of the count while no quoted verse states that fact (pkgBNS, ASK 295)"}]).DEFENDER)==='[]','C2 the BNS refusal text gives no drop');
ok(JSON.stringify(dropOf([{side:'DEFENDER',premise:2,status:'CURED',why:'TRIAL rule (K-UNX-A): CORRECTED COUNT 0 takes the premise out of the count'},{side:'DEFENDER',premise:2,status:'CURED',why:'TRIAL rule (K-UNX range, pkgBFX): CORRECTED COUNT 0 takes the premise out of the count'}]).DEFENDER)==='[2]','C2 K-UNX-A and range, deduplicated');
// C4/C5 structure
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);const ch=Object.keys(pb).filter(k=>pb[k]!==pt[k]);
ok(JSON.stringify(ch)==='["Shared Library"]'&&Object.keys(pt).length===Object.keys(pb).length,'C4 only the Shared Library changes: '+ch);ok(JSON.stringify(B.connections)===JSON.stringify(T.connections),'C4 connections equal');
const LB=lib(B),LT=lib(T);const dl=LT.map((l,i)=>l!==LB[i]?i:null).filter(x=>x!==null);ok(JSON.stringify(dl)==='[1366,1368,1501,1556]'&&LB.length===LT.length,'C4 LIB lines changed: '+dl);
ok(dl.every(i=>/ASK 638/.test(LT[i])),'C5 every changed line is tagged ASK 638');ok(!/catch/.test(LT[1366].slice(LT[1366].indexOf('const __cpDrop')))&&(LT[1556].match(/catch/g)||[]).length===(LB[1556].match(/catch/g)||[]).length,'C5 no new catch');
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');})().catch(e=>{console.log('ERROR',e.stack);process.exit(1);});
