// ASK 424 DONE WHEN proof (plan rev 2, 69b4c1cd; W1 8894 C1, W2 8897 C1/C2, W2 8900 C3).
// Usage: node a424/t424.cjs BASE_ENG BASE_CHILD TARGET_ENG TARGET_CHILD D1_ALL
// Each reader is taken from the workflow text itself (old from the base, new from the target) and run on the stored claude_r1 texts.
const fs=require('fs'),path=require('path'),crypto=require('crypto');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));const T=require(path.join(__dirname,'../tools/lib.cjs'));
const [BE,BC,TE,TC,DA]=process.argv.slice(2);const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
const W={be:ld(BE),bc:ld(BC),te:ld(TE),tc:ld(TC)};const D=JSON.parse(fs.readFileSync(DA)).map((x,i)=>[x[0]||('row-'+i+'(no run token)'),x[1]]);
const libsha=wf=>{const u=T.unpack(wf);return crypto.createHash('sha256').update(JSON.stringify(u.L)).digest('hex').slice(0,16);};
const fnAt=(L,re)=>{const s=L.findIndex(l=>re.test(l));if(s<0)throw new Error('no '+re);for(let k=0;k<40;k++){const src=L.slice(s,s+k+1).join('\n');try{const a=acorn.parse(src,{ecmaVersion:'latest'});if(a.body[0].type==='FunctionDeclaration')return src.slice(a.body[0].start,a.body[0].end);}catch(e){}}throw new Error('no parse '+re);};
const arrowAt=(code,name)=>{const k='const '+name+'=';const i=code.indexOf(k);if(i<0||code.indexOf(k,i+1)>=0)throw new Error(name+' not once');const e=acorn.parseExpressionAt(code,i+k.length,{ecmaVersion:'latest'});return code.slice(e.start,e.end);};
function libReaders(wf){const u=T.unpack(wf);const ccL=u.L.find(l=>l.includes('const chain_count=(()=>{'));const dmL=u.L.find(l=>l.includes('const DM=(s)=>'));
 const dm=dmL.match(/const DM=\(s\)=>String\(s\|\|''\)\.replace\(\/\[[^\]]+\]\/g,'-'\);/)[0];const cc=ccL.slice(ccL.indexOf('const chain_count=(()=>{'));const ccSrc=cc.slice(0,cc.indexOf('})();')+5);
 return {src:{R1:ccSrc,R2:fnAt(u.L,/^function drvLinks\(/),R3:fnAt(u.L,/^function drvChainOf\(/)},
  R1:new Function('t',dm+'const F={cr1:t};'+ccSrc+'\nreturn chain_count;'),R2:new Function('t',fnAt(u.L,/^function drvLinks\(/)+'\nreturn drvLinks(t);'),
  R3:new Function('t',fnAt(u.L,/^function drvChainOf\(/)+'\nreturn drvChainOf(t,"DEFENDER");')};}
const N4=['Close Enforcer Build','Judge Contradiction Build','Judge Contradiction Record'];
const N5=['Build Synthesis','Build Independent Verdict','Build Save Body','Panel Build','Format Markdown','D4 Build','D4 Extract','C4 Build','C4 Extract','C4G Extract','D4B Extract','C4B Extract'];
function nodeReaders(wf,names,dn,ln){const cps={decl:new Set(),dl:new Set()};let f=null;for(const nm of names){const c=wf.nodes.find(n=>n.name===nm).parameters.jsCode;const a=arrowAt(c,dn);cps.decl.add(a);let b=null;if(c.includes('const '+ln+'=')){b=arrowAt(c,ln);cps.dl.add(b);}
  if(b&&!f)f=new Function('F','const '+dn+'='+a+';const '+ln+'='+b+';return {decl:'+dn+'(F),dl:'+ln+'(F)};');}
 return {cps,f};}
const OLD={lib:libReaders(W.be),R4:nodeReaders(W.be,N4,'cecDeclared','cecDlinks'),R5:nodeReaders(W.be,N5,'declared','dlinks')};
const NEW={lib:libReaders(W.te),R4:nodeReaders(W.te,N4,'cecDeclared','cecDlinks'),R5:nodeReaders(W.te,N5,'declared','dlinks')};
const out=[];const P=s=>out.push(s);
// DONE WHEN 4: copies identical; library equal on engine and child; lib sha equal
P('DONE WHEN 4. COPIES AND LIBRARY');
for(const k of ['R4','R5'])P('  '+k+' new copies: declared '+NEW[k].cps.decl.size+' distinct text, dlinks '+NEW[k].cps.dl.size+' distinct text (old: '+OLD[k].cps.decl.size+', '+OLD[k].cps.dl.size+')');
const ct=libReaders(W.tc).src;for(const k of ['R1','R2','R3'])P('  '+k+' child text equals engine text: '+(ct[k]===NEW.lib.src[k]));
P('  lib_sha base engine '+libsha(W.be)+' child '+libsha(W.bc)+' | target engine '+libsha(W.te)+' child '+libsha(W.tc)+' | equal '+(libsha(W.te)===libsha(W.tc)));
const NUMOLD=/^\s*\**\s*\d+[.)]\s+\S/;
// today's output holds a numbered link: R1 a count above 0; R2 a link; R3 a list; R4/R5 a declared text with a line today's test reads as numbered.
// the new output holds a numbered link: the same, except R4/R5 count the links the new dlinks reads (a "D1:" line is not a numbered line to today's test).
const hasNum={R1:v=>typeof v==='number'&&v>0,R2:v=>v.length>0,R3:v=>!!v,R4:v=>String(v.decl||'').split('\n').slice(1).some(l=>NUMOLD.test(l)),R5:v=>String(v.decl||'').split('\n').slice(1).some(l=>NUMOLD.test(l))};
const hasNew={...hasNum,R4:v=>v.dl.length>0,R5:v=>v.dl.length>0};
const run=(S,k,t)=>k==='R4'||k==='R5'?S[k].f({cr1:t}):S.lib[k](t);
const nLinks={R1:v=>v,R2:v=>v.length,R3:v=>v?v.links.length:0,R4:v=>v.dl.length,R5:v=>v.dl.length};
const last={R1:v=>'',R2:v=>v[v.length-1],R3:v=>v&&v.links[v.links.length-1],R4:v=>v.dl.length&&v.dl[v.dl.length-1].n+'. '+v.dl[v.dl.length-1].text,R5:v=>v.dl.length&&v.dl[v.dl.length-1].n+'. '+v.dl[v.dl.length-1].text};
const FOUR=['27665','38661','39015','39266'];const tk=r=>r.split('-')[1];
P('');P('DONE WHEN 1 AND 2. '+D.length+' stored claude_r1 texts');
for(const k of ['R1','R2','R3','R4','R5']){let eq=0,ex=0,bad=[];const newly=[];
 for(const [rt,t] of D){const o=run(OLD,k,t),n=run(NEW,k,t);if(!hasNum[k](o)){ex++;if(hasNew[k](n))newly.push([rt,n]);else if(JSON.stringify(o)!==JSON.stringify(n))bad.push(rt+' (no link before, changed after)');continue;}
  if(JSON.stringify(o)===JSON.stringify(n))eq++;else bad.push(rt);}
 P('  '+k+': with a numbered link today '+eq+' of '+(D.length-ex)+' equal; differ '+bad.length+(bad.length?' '+bad.join(', '):'')+' | left out (no numbered link today) '+ex+'; newly read '+newly.length+': '+newly.map(([r,n])=>tk(r)+'='+nLinks[k](n)).join(', '));
 const miss=FOUR.filter(f=>!newly.some(([r])=>tk(r)===f));P('    the 4 runs all newly read: '+(miss.length?'NO, missing '+miss.join(','):'yes'));
 if(k!=='R1')for(const [r,n] of newly)if(k==='R2'||FOUR.includes(tk(r)))P('    '+tk(r)+' last link: '+String(last[k](n)).replace(/\s+/g,' ').slice(0,150));}
// DONE WHEN 3
const r39=D.find(([r])=>tk(r)==='39266')[1];P('');P('DONE WHEN 3. D4 Build declared() for 39266 (the YOUR DECLARED CHAIN text of the round 4 prompt)');
const d4=(S)=>{const c=(S===OLD?W.be:W.te).nodes.find(n=>n.name==='D4 Build').parameters.jsCode;return new Function('F','const declared='+arrowAt(c,'declared')+';return declared(F);')({cr1:r39});};
P('--- BEFORE ---');P(d4(OLD));P('--- AFTER ---');P(d4(NEW));
// DONE WHEN 7: planted cases
P('');P('DONE WHEN 7. PLANTED CASES');
const pa='Opening text.\n\nDECLARED CHAIN\n  1. Mary conceived of the Holy Ghost -- Matthew 1:18.\n  2. Joseph knew her not -- Matthew 1:25.\n  3. Therefore no man is the father -- conclusion.\n\nNext section.';
const pbD='Opening text.\n\nDECLARED CHAIN\nD1: precept one -- Isaiah 28:9.\nD2: precept two -- Isaiah 28:10.\n28:10 For precept must be upon precept; line upon line.\nD3: the conclusion -- link three.\n\nNext section.';
const pbN=pbD.replace(/^D(\d+):/gm,'$1.');
for(const k of ['R1','R2','R3','R4','R5']){const o=run(OLD,k,pa),n=run(NEW,k,pa);P('  (a) indented chain, '+k+': before '+nLinks[k](o)+' links, after '+nLinks[k](n)+'; same before and after '+(JSON.stringify(o)===JSON.stringify(n))+'; links '+nLinks[k](n));}
for(const k of ['R1','R2','R3','R4','R5']){let n=run(NEW,k,pbD),o=run(OLD,k,pbN),n2=run(NEW,k,pbN);let nn=n;if(k==='R4'||k==='R5')nn={decl:n.decl.replace(/^D(\d+):/gm,'$1.'),dl:n.dl};
 const s28=JSON.stringify(n).includes('28:10 For')?(k==='R4'||k==='R5'?'28:10 line in declared text: '+n.decl.includes('28:10 For'):'28:10 in output'):'28:10 line not in output';
 P('  (b) D1:/D2:/28:10/D3 chain, '+k+': new on "D<n>:" form equals old on "<n>." form '+(JSON.stringify(nn)===JSON.stringify(o))+'; new equals old on "<n>." form '+(JSON.stringify(n2)===JSON.stringify(o))+'; links '+nLinks[k](n)+'; '+s28);}
const HEADRE=new RegExp(JSON.parse(fs.readFileSync(path.join(__dirname,'readers.json'))).NUM[1].match(/\/(\^.*)\/i\.test/)[1],'i');
for(const s of ['28:10 For precept','1.5 x','2 Corinthians 5:17','D1: a','  1. a','**D2.** b','### 3) c','4 -- d','4 — d','D12: x'])P('  head test "'+s+'": '+HEADRE.test(s));
const txt=out.join('\n');fs.writeFileSync(path.join(__dirname,'t424_out.txt'),txt+'\n');console.log(txt);
