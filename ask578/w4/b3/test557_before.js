// ASK 557 (A, B, D) and ASK 558 offline tests (W4). Usage: node test557.js  |  node test557.js --pair <engine.json> <child.json>
const fs=require('fs');process.chdir(__dirname);const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const fnE=e=>{const s=e.nodes.find(n=>n.name==='Library Sha (ASK 422a)').parameters.jsCode;return new Function(s.slice(0,s.indexOf('const __lc='))+'\nreturn {__LIBSHA422,__MAPSHA422};')();};
const fnC=c=>{const s=c.nodes.find(n=>n.name==='Library Check (ASK 422a)').parameters.jsCode;return new Function(s.slice(0,s.indexOf('const __it='))+'\nreturn {__LIBSHA422,__MAPSHA422};')();};
const lib=w=>w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const pair=(label,e,c)=>{const E=fnE(e),K=fnC(c);const le=E.__LIBSHA422(lib(e)),me=E.__MAPSHA422(lib(e),'engine'),lc=K.__LIBSHA422(lib(c)),mc=K.__MAPSHA422(lib(c),'child');
 const r=(le===lc&&me===mc)?'PASSES':'THROWS';console.log(label+': engine lib '+le+' map '+me+' | child lib '+lc+' map '+mc+' | Library Check '+r);return r;};
if(process.argv[2]==='--pair'){process.exit(pair('pair',J(process.argv[3]),J(process.argv[4]))==='PASSES'?0:1);}
const BE=J('base_engine.json'),BC=J('base_child.json'),TE=J('target_engine_557.json'),TC=J('target_child_557.json');
const code=(w,n)=>{const x=w.nodes.find(z=>z.name===n);return x?x.parameters.jsCode:null;};
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
console.log('== 0. Library Check pair');
ok(pair('base pair (control)',BE,BC)==='PASSES','base pair passes');
ok(pair('target pair',TE,TC)==='PASSES','target pair passes');
ok(pair('target engine + base child',TE,BC)==='THROWS','a half write (engine only) throws, as expected');
console.log('== 0b. Untouched nodes byte-identical; touched nodes parse');
const TOUCH=['Init with Guards','D4 Build','D2B Build','D3B Build','D4B Build','Shared Library',...['D2','C2','D3','C3','D4','C4'].flatMap(r=>[r+' Lexicon Plan',r+' Build'])];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const un=BE.nodes.filter(n=>!TOUCH.includes(n.name)).filter(n=>{const t=TE.nodes.find(z=>z.name===n.name);return !t||!same(n,t);}).map(n=>n.name);
ok(un.length===0,'engine: every node outside the 18 touched is identical ('+un.join(', ')+')');
ok(same(BE.connections,TE.connections)&&same(BE.settings,TE.settings)&&BE.nodes.length===TE.nodes.length,'engine: connections, settings and node count identical');
const unc=BC.nodes.filter(n=>n.name!=='Shared Library').filter(n=>{const t=TC.nodes.find(z=>z.name===n.name);return !t||!same(n,t);}).map(n=>n.name);
ok(unc.length===0&&same(BC.connections,TC.connections),'child: every node but the Shared Library identical');
const AsyncF=Object.getPrototypeOf(async function(){}).constructor;
for(const n of TOUCH.filter(x=>x!=='Shared Library')){try{new AsyncF('$','$input','$json','$execution',code(TE,n));ok(true,'parses: '+n);}catch(e){ok(false,'parses: '+n+' -- '+e.message);}}
const other=TE.nodes.filter(n=>!TOUCH.includes(n.name)||n.name==='Shared Library');
const L2ANCH='const S=Object.keys(byN).filter(n=>!sheet||!byN[n].every(isFunc));';
ok(other.filter(n=>(n.parameters.jsCode||'').includes(L2ANCH)).length===15,'ASK 558: the 15 untouched copies still hold the old filter (13 Extract, L2 Lexicon Plan, Shared Library)');

{let b0='',t0='';try{new AsyncF(code(BE,'Shared Library'));}catch(e){b0=e.message;}try{new AsyncF(code(TE,'Shared Library'));}catch(e){t0=e.message;}ok(b0===t0,'Shared Library: parses the same as today (it never runs; the stub rebuilds from LIB): "'+t0+'"');}
console.log('== 1. Change A');
const IG=code(TE,'Init with Guards');const m=IG.match(/const __ORACLE9=("(?:[^"\\]|\\.)*");/);const O9=eval(m[1]);
ok(O9.startsWith("THE ORACLE'S LAYER FORM")&&O9.includes('Write "It fits the link" only inside the [L4]')&&O9.endsWith('A statement of your position is not proof of it.'),'__ORACLE9 evaluates to the approved text ('+O9.length+' chars)');
ok(IG.split('__ORACLE9').length-1===2,'__ORACLE9 defined once and used once');
const ob=IG.slice(IG.indexOf("if(seat.profile==='oracle')return 'You are the TRUTH App debate AI"));const ob1=ob.slice(0,ob.indexOf('\n'));
ok(ob1.includes("+__PROVE9+'\\n\\n'+__ORACLE9+'\\n\\n'+rcSection"),'used in the Oracle branch line only');
const rest=IG.replace(ob1,'');ok(!rest.slice(rest.indexOf('const __ORACLE9=')+30).includes('__ORACLE9'),'not used in the plain defender or challenger branches');

console.log('== 2. Change B');
const D4=code(TE,'D4 Build');const bi=D4.indexOf("that link.'+(");const seg=D4.slice(bi+12,D4.indexOf("+' A witness answered in substance,",bi));
const ev=prof=>new Function('$','return '+seg)(n=>({first:()=>({json:{defender:{profile:prof}}})}));
const so=ev('oracle'),sp=ev('defender');
ok(so.startsWith(' Under each ANSWER line write the four layers')&&so.includes("by its Strong's number from the [L2] SHEET")&&so.endsWith('naming the pressed word.'),'Oracle seat: the sentence is inserted ('+so.length+' chars)');
ok(sp==='','plain defender: nothing inserted');

console.log('== 3. Change D (LAY), run 41822 rounds');
const LAYof=w=>{const T=lib(w);const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/'))).LAY;
 const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('LAY length '+S.length+' vs '+M.n);return new Function('$',S+'\nreturn LAY;')(undefined);};
const L0=LAYof(BE),L1=LAYof(TE),LC=LAYof(TC);ok(true,'LAY rebuilds in base, target engine and target child (pkgLAYB length test)');
const R=J('rounds41822.json');const rows=[];
for(const k of ['CR2','CR3','CR4','DR2','DR3','DR4']){const t=R[k];if(!t){ok(false,'round '+k+' missing');continue;}
 const a=L0.check(t,rows),b=L1.check(t,rows),c=L1.check(t,rows,{oracle:false}),d=L1.check(t,rows,{oracle:true}),e=LC.check(t,rows,{oracle:true});
 ok(JSON.stringify(a)===JSON.stringify(b)&&JSON.stringify(a)===JSON.stringify(c),k+': no third argument and oracle:false give today\'s items exactly ('+a.items.length+')');
 ok(JSON.stringify(d)===JSON.stringify(e),k+': engine and child LAY agree');
 if(k[0]==='C'){const nw=d.items.filter(x=>/no \[L[24]\]/.test(x.why));console.log('   '+k+' oracle:true items '+d.items.length+' (today '+a.items.length+'); with a missing [L2]/[L4]: '+nw.length);
  if(k==='CR4'){ok(d.items.length>a.items.length,'CR4: the Oracle gate adds items');const s=nw.find(x=>/^no \[L2\] and no \[L4\] line: write an \[L2\]/.test(x.why));ok(!!s,'CR4: a block with layers [L1]/[L3] only gets "no [L2] and no [L4] line: ..." ('+(s?s.head.slice(0,60):'none')+')');
   const nt=L1.note(d,true);ok(nt.includes(s?s.head.slice(0,60):'@@'),'LAY.note renders the new item');}}}
const ab='LINK 2: The father\n[L1] Luke 1:35 "And the angel answered" -- Luke 1:35 does not state that Joseph is not the father. Matthew 1:16 does not name a begetting by the Holy Ghost. Luke 3:23 does not say otherwise at all here.';
const x0=L1.check(ab,[]),x1=L1.check(ab,[],{oracle:true});
console.log('   absence-only block: today '+L0.check(ab,[]).items.length+', no arg '+x0.items.length+', oracle '+x1.items.length+(x1.items[0]?' ('+x1.items[0].why+')':''));

console.log('== 4. ASK 558');
const plan=(w,r)=>code(w,r+' Lexicon Plan');
const runPlan=(w,r,OW,RAW)=>{const $=n=>{if(n===r+' Words Sheet')return {all:()=>OW.map(j=>({json:j}))};if(RAW[n]!=null)return {isExecuted:true,first:()=>({json:{raw:RAW[n]}})};throw new Error('no '+n);};return new Function('$',plan(w,r))($).map(x=>x.json.url);};
const OW=J('ow_d2_41822.json');const RAW={'D1 Extract':R.CR1,'C1B Extract':R.DR1};
const u0=runPlan(BE,'D2',OW,RAW),u1=runPlan(TE,'D2',OW,RAW);
const has=(u,n)=>u.some(x=>new RegExp('[(,]'+n+'[,)]').test(decodeURIComponent(x)));
ok(!has(u0,'G1352')&&has(u1,'G1352'),'D2 Lexicon Plan: G1352 requested after, not before');
ok(!has(u0,'G1537')===!has(u1,'G1537')||has(u1,'G1537'),'D2 Lexicon Plan: G1537 requested after ('+has(u1,'G1537')+'; before '+has(u0,'G1537')+')');
ok(!has(u1,'G3588'),'control: G3588 (the article, cited by no round) stays off');
const u2=runPlan(TE,'D2',OW,{'D1 Extract':'no numbers','C1B Extract':'none here'});ok(JSON.stringify(u2)===JSON.stringify(u0),'control: with no cited number the requests are byte-identical to today');
const LX=J('lx_d2_41822_plus.json');
const shB=(w,r,P,RAW)=>{const c=code(w,r+' Build');const i=c.indexOf('const L2C=(()=>{');const j=c.indexOf('return {tags,',i);const k=c.indexOf('})();',j)+5;const lib2=c.slice(i,k);
 const K=c.match(/const __KEEP=\(\(\)=>\{[\s\S]*?return s;\}\)\(\);/);const $=n=>{if(RAW[n]!=null)return {isExecuted:true,first:()=>({json:{raw:RAW[n]}})};throw new Error('no '+n);};
 return new Function('$','P','OW','LX',lib2+'\n'+(K?K[0]+'\nreturn L2C.sheet(OW,LX,{...P,l2_keep:[...__KEEP]});':'return L2C.sheet(OW,LX,P);'))($,P,OW,LX);};
const P=J('p_c1b_41822.json');
const s0=shB(BE,'D2',P,RAW),s1=shB(TE,'D2',P,RAW);
for(const l of s1.split('\n'))if(/G1352|G1537/.test(l))console.log('   SHEET LINE: '+(l.includes('G1352')?'[holds G1352] ':'')+l.slice(0,120));const dio=s1.split('\n').find(l=>/^(?:[-*]\s*)?G1352 /.test(l));ok(!s0.includes('\nG1352 ')&&!!dio,'D2 sheet: G1352 row served after, not before: '+(dio||'none'));
const fw=s=>{const m=s.match(/(\d+) function words?/);return m?+m[1]:null;};console.log('   sheet length before '+s0.length+', after '+s1.length);
const s2=shB(TE,'D2',P,{'D1 Extract':'x','C1B Extract':'y'});ok(s2===s0,'control: with no cited number the D2 sheet is byte-identical to today');
console.log(fail?('FAILURES: '+fail):'ALL PASS');process.exit(fail?1:0);
