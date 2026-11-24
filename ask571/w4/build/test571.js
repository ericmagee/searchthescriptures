// ASK 571 test (W4). node test571.js <base_engine> <target_engine> <base_child> <target_child>
// Part A: structure and byte-for-byte. Part B: behaviour on run 41822 inputs, old block vs new loader, per node. Part C: negative controls.
const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');const {cut}=require('./cutl2c.js');
const [,,BE,TE,BC,TC]=process.argv;const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));const be=J(BE),bc=J(BC),te=J(TE),tc=J(TC);
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const lib=W=>{const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return {T,L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};};
const src=(X,k)=>X.M[k].p.map(e=>typeof e==='number'?X.L[e]:typeof e[0]==='string'?e[0]:X.L.slice(e[0],e[1]+1).join('\n')).join('\n');
const s565=fs.readFileSync('/mnt/project-files/ask565/w4/build/patch565_568.js','utf8');const A565=eval(s565.match(/const A=(".*?");\n/)[1]),INS565=eval(s565.match(/const INS=(".*?");\n/)[1]);
const VAR={b299e365:'Extract','38744bf8':'Build','7f615d73':'Lexicon Plan','3885b8ed':'L2 Lexicon Plan','8eac181f':'Count Plan',dc5c8420:'Citation Scan',c8bd04c5:'Quote Report'};
const code=(W,n)=>(W.nodes.find(x=>x.name===n)||{parameters:{}}).parameters.jsCode;
console.log('== A. Structure');
const L2N=be.nodes.filter(n=>n.parameters&&n.parameters.jsCode&&n.name!=='Shared Library'&&cut(n.parameters.jsCode)).map(n=>n.name);ok(L2N.length===30,'30 engine nodes hold L2C in the base ('+L2N.length+')');
const chE=be.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify((te.nodes.find(x=>x.name===n.name)||{}).parameters)).map(n=>n.name);
ok(chE.length===31&&chE.includes('Shared Library')&&L2N.every(n=>chE.includes(n))&&be.nodes.length===te.nodes.length,'engine: only the 30 L2C nodes and the Shared Library change ('+chE.length+')');
const chC=bc.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify((tc.nodes.find(x=>x.name===n.name)||{}).parameters)).map(n=>n.name);ok(chC.length===1&&chC[0]==='Shared Library'&&bc.nodes.length===tc.nodes.length,'child: only the Shared Library changes ('+chC.join(', ')+')');
ok(JSON.stringify(be.connections)===JSON.stringify(te.connections)&&JSON.stringify(bc.connections)===JSON.stringify(tc.connections),'connections unchanged, engine and child');
ok(JSON.stringify(be.nodes.map(n=>[n.name,n.type,n.onError,n.position]))===JSON.stringify(te.nodes.map(n=>[n.name,n.type,n.onError,n.position])),'node names, types, onError and positions unchanged');
const lbE=lib(be),ltE=lib(te),lbC=lib(bc),ltC=lib(tc);
ok(lbE.L.every((l,i)=>ltE.L[i]===l)&&lbC.L.every((l,i)=>ltC.L[i]===l),'every existing LIB line unchanged; new lines appended only (engine +'+(ltE.L.length-lbE.L.length)+', child +'+(ltC.L.length-lbC.L.length)+')');
ok(JSON.stringify(ltE.L)===JSON.stringify(ltC.L)&&Object.keys(ltE.M).filter(k=>/^L2C /.test(k)).every(k=>JSON.stringify(ltE.M[k])===JSON.stringify(ltC.M[k]))&&Object.keys(ltC.M).length===Object.keys(lbC.M).length+7,'engine and child: same LIB, same 7 new MAP entries (engine-only keys REFP and Alternate Merge CPD unchanged)');
const oldKeys=Object.keys(lbE.M);ok(oldKeys.every(k=>JSON.stringify(lbE.M[k])===JSON.stringify(ltE.M[k])&&(!lbE.M[k].p||src(lbE,k)===src(ltE,k))),'every existing MAP entry ('+oldKeys.length+') unchanged and rebuilds to the same source');
const newKeys=Object.keys(ltE.M).filter(k=>!oldKeys.includes(k));ok(newKeys.length===7&&newKeys.every(k=>/^L2C /.test(k)),'7 new MAP entries: '+newKeys.join(', '));
ok(newKeys.every(k=>src(ltE,k).length===ltE.M[k].n),'each new entry: rebuilt length equals its n');
console.log('== A2. Byte for byte, per node');
let buildRef=null;try{const G=J('/mnt/project-files/ask565/w4/build/target_engine_563_565_568.json');buildRef=cut(code(G,'D2 Build')).st;}catch(e){}
const servedOf={};
for(const name of L2N){const b=code(be,name),t=code(te,name);const c=cut(b);const v=VAR[md5(c.st).slice(0,8)];const key='L2C '+v;
 let want=c.st;if(v==='Build')want=c.st.replace(A565,()=>INS565+A565).replace('const CAPC=26000;','const CAPC=130000;');
 const S=src(ltE,key);servedOf[name]={v,key,old:c.st,served:S,want};
 const pre=b.slice(0,c.i),post=b.slice(c.e);const mid=t.slice(pre.length,t.length-post.length);
 const keepsCP=/\$\('L2 Count Plan'\)/.test(c.st);
 ok(t.startsWith(pre)&&t.endsWith(post)&&/^(?:if\(false\)\{\$\('L2 Count Plan'\);\}\n)?const L2C=\(T=>\{/.test(mid)&&mid.includes('["'+key+'"]')&&(keepsCP===mid.startsWith("if(false){$('L2 Count Plan');}")),name+': only the block is replaced, by the '+key+' loader'+(keepsCP?' (keeps the L2 Count Plan reference)':''));
 ok(S===want,name+': served text equals '+(v==='Build'?'today\'s block + 565 + 568':'today\'s block')+' byte for byte ('+S.length+')');}
if(buildRef)ok(servedOf['D2 Build'].served===buildRef,'Build text equals the graded 565+568 Build block (ask565 target) byte for byte');
console.log('== B. Behaviour on run 41822 inputs (old block vs new loader, same $ and REFP)');
const REFP=new Function(src(ltE,'REFP')+'\nreturn REFP;')();
const IN=J('/mnt/project-files/ask565/w4/in565_41822.json');const R=J('/mnt/project-files/ask557/w4/build/rounds41822.json');
const rounds=[['D','CR1',R.CR1],['C','DR1',R.DR1],['D','CR2',R.CR2],['C','DR2',R.DR2],['D','CR3',R.CR3],['C','DR3',R.DR3],['D','CR4',R.CR4],['C','DR4',R.DR4]];
const raws={};for(const e of ['D1 Extract','C1B Extract','C2B Extract','C3B Extract','D2B Extract','D3B Extract','D4B Extract'])raws[e]=IN[e].raw;
const P_OF={D2:'C1B Extract',D3:'C2B Extract',D4:'C3B Extract',C2:'D2B Extract',C3:'D3B Extract',C4:'D4B Extract'};
const mk$=(T,eng)=>n=>{if(n==='Shared Library')return {params:{jsCode:T}};if(n==='L2 Count Plan')return {isExecuted:true,first:()=>({json:{e340:{ok:true,eng}}})};if(raws[n]!=null)return {isExecuted:true,first:()=>({json:{raw:raws[n]}})};throw new Error('no '+n);};
const inst=(stmt,$,refp)=>new Function('$','REFP',stmt+'\nreturn L2C;')($,refp);
const loaderOf=name=>{const t=code(te,name),b=code(be,name),c=cut(b);return t.slice(c.i,t.length-(b.length-c.e));};
const J2=x=>{try{return JSON.stringify(x);}catch(e){return 'unserializable';}};
const probe=(L)=>{const out={};const tr=(k,f)=>{try{out[k]=J2(f());}catch(e){out[k]='ERR '+e.message;}};
 if(L.tags)tr('tags',()=>L.tags(rounds));
 if(L.tags&&L.check){for(const r of ['D2','C3'])tr('check '+r,()=>L.check(L.tags(rounds),IN[r].ow,IN[r].lx));tr('check synthetic English word (reads $ L2 Count Plan)',()=>L.check(L.tags(SYN),IN.D2.ow,IN.D2.lx));}
 if(L.sheet)for(const r of ['D2','D3','D4','C2','C3','C4']){const P=IN[P_OF[r]];tr('sheet '+r,()=>L.sheet(IN[r].ow,IN[r].lx,{l2_req:P.l2_req,l2_read:P.l2_read}));tr('sheet keep '+r,()=>L.sheet(IN[r].ow,IN[r].lx,{l2_req:P.l2_req,l2_read:P.l2_read,l2_keep:['G1352','G1537','G2316']}));}
 if(L.sheetPlan)tr('sheetPlan',()=>L.sheetPlan(rounds.map(x=>x[2]),undefined));
 if(L.countClaims)tr('countClaims',()=>L.countClaims(rounds));
 if(L.countClaims&&L.countCheck)tr('countCheck',()=>L.countCheck(L.countClaims(rounds),{},false,[]));
 if(L.lexUrls)tr('lexUrls',()=>L.lexUrls(IN.D2.ow));if(L.wordsUrls)tr('wordsUrls',()=>L.wordsUrls(['Luke 1:35','Matthew 1:16']));
 if(L.refsIn)tr('refsIn',()=>L.refsIn(R.CR4));if(L.blockAt)tr('blockAt',()=>L.blockAt(R.CR4,5000));if(L.apocIn)tr('apocIn',()=>L.apocIn('Tobit 1:1 and Sirach 2:3'));
 if(L.index)tr('index',()=>Object.keys(L.index(IN.D2.ow,IN.D2.lx).V).length);if(L.numOf)tr('numOf',()=>L.numOf('G01352'));if(L.norm)tr('norm',()=>L.norm('Hellēnistai'));
 return out;};
const eng=['margin'];const SYN=[['C','DR9','Matthew 1:16 [L2] the verb *egennēsen* (G1080) and the word *margin* show it.']];
for(const name of L2N){const so=servedOf[name];const $=mk$(ltE.T,eng||[]);
 const O=inst(so.v==='Build'?so.want:so.old,$,REFP);const N=inst(loaderOf(name),$,REFP);
 const po=probe(O),pn=probe(N);const keys=Object.keys(po);const diff=keys.filter(k=>po[k]!==pn[k]);
 const errs=keys.filter(k=>/^ERR/.test(po[k]));
 ok(keys.length>0&&diff.length===0&&Object.keys(pn).length===keys.length,name+' ('+so.v+'): '+keys.length+' calls, outputs identical'+(errs.length?' (both raise the same error on: '+errs.join(', ')+')':''));}
console.log('   the $ mock serves L2 Count Plan e340 {ok:true, eng:["margin"]}; the synthetic claim shows that path');
console.log('== C. Negative controls (the test must fail when the scope is broken)');
{const name='D2 Build',so=servedOf[name];const $=mk$(ltE.T,eng||[]);const O=inst(so.want,$,REFP);
 const N1=inst(loaderOf(name),$,{});const a=probe(O),b=probe(N1);const d=Object.keys(a).filter(k=>a[k]!==b[k]);ok(d.length>0,'REFP missing: outputs differ on '+d.join(', '));
 const N2=inst(loaderOf(name),n=>{if(n==='Shared Library')return {params:{jsCode:ltE.T}};throw new Error('no '+n);},REFP);const b2=probe(N2);const d2=Object.keys(a).filter(k=>a[k]!==b2[k]);ok(d2.length>0,'$ without L2 Count Plan: outputs differ on '+d2.join(', '));
 const T2=ltE.T.replace('"L2C Build"','"L2C Xuild"');let th='';try{inst(loaderOf(name),n=>({params:{jsCode:T2}}),REFP);}catch(e){th=e.message;}ok(/holds no L2C Build entry/.test(th),'missing MAP entry: loader throws ('+th+')');
 const k=ltE.M['L2C Build'];const L3=ltE.L.slice();const ix=typeof k.p[0]==='number'?k.p[0]:k.p[0][0];L3[ix]=L3[ix]+' ';const T3=ltE.T.slice(0,ltE.T.indexOf('\n/*LIB*/')+8)+JSON.stringify(L3)+ltE.T.slice(ltE.T.lastIndexOf('\n/*MAP*/'));let th3='';try{inst(loaderOf(name),n=>({params:{jsCode:T3}}),REFP);}catch(e){th3=e.message;}ok(/rebuilt L2C Build is/.test(th3),'library line changed: loader throws ('+th3+')');}
console.log('== D. Parse');
const AF=Object.getPrototypeOf(async function(){}).constructor;for(const name of L2N){try{new AF('$','$input','$json',code(te,name));}catch(e){ok(false,name+' parses: '+e.message);}}ok(true,'all 30 changed nodes parse as Code node bodies');
const szB=L2N.reduce((a,n)=>a+code(be,n).length,0),szT=L2N.reduce((a,n)=>a+code(te,n).length,0);
console.log('== SIZE (MEASURED): 30 nodes '+szB+' -> '+szT+' chars ('+(szB-szT)+' less); Shared Library engine '+lbE.T.length+' -> '+ltE.T.length+'; engine workflow JSON '+JSON.stringify(be).length+' -> '+JSON.stringify(te).length+'; child JSON '+JSON.stringify(bc).length+' -> '+JSON.stringify(tc).length);
console.log(fail?'FAILURES: '+fail:'ALL PASS');
