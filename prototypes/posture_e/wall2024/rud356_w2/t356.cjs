// ASK 356 tests. Usage: node t356.cjs <target> <base> <lib.cjs> <rows45.json>
const fs=require('fs');const {unpack,rb,load}=require(process.argv[4]);let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d?' :: '+d:''));};
const tw=JSON.parse(fs.readFileSync(process.argv[2])),bw=JSON.parse(fs.readFileSync(process.argv[3]));const tu=unpack(tw),bu=unpack(bw);
const dl=tu.L.map((l,i)=>l!==bu.L[i]?i:-1).filter(i=>i>=0);ok('library lines changed are 1753, 1754, 1816, 1837, 1922, 1933 and 2392 only; line count equal',tu.L.length===bu.L.length&&dl.join()==='1753,1754,1816,1837,1922,1933,2392',dl.join());
const BN={};for(const x of bw.nodes)BN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(BN[x.name])).map(x=>x.name);ok('only the Shared Library node changed',dn.join()==='Shared Library',dn.join());
ok('connections and node order equal',JSON.stringify(tw.connections)===JSON.stringify(bw.connections)&&tw.nodes.map(x=>x.name).join()===bw.nodes.map(x=>x.name).join());
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',!bad.length,Object.keys(tu.M).length+' entries');
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(bu.L,bu.M[k])).sort();console.log('   changed entries: '+ch.join(', '));
ok('changed entries are the 9 gate nodes that hold gateItems2024',ch.join()===['Alt Gate Build','Alt Gate Record','Alt Late Gate Build','Gate Build','Gate Record','Late Gate Build','R2 Alt Gate Build','R2 Alt Gate Record','R2 Alt Late Gate Build'].join());
const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry',!syn.length,syn.join('; '));
const cnt=(w,s)=>JSON.stringify(w.nodes).split(s).length-1;ok('model setting words unchanged',['max_tokens','temperature','reasoning','effort','thinking'].every(s=>cnt(tw,s)===cnt(bw,s)));
ok('the K-RUD pair push follows the pkgVNV push inside gateItems2024',/pkgVNV: last[^\n]*rudPair2024\(T1\)[^\n]*live:false/.test(tu.L[1753]));
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});const G=load(rb(tu.L,tu.M['Gate Build']),$),GR=load(rb(tu.L,tu.M['Gate Record']),$);
ok('loader finds rudPair2024 and gateItems2024 in Gate Build and Gate Record',typeof G.rudPair2024==='function'&&typeof GR.rudPair2024==='function'&&typeof G.gateItems2024==='function');
const P=G.rudPair2024;const R=JSON.parse(fs.readFileSync(process.argv[5]));const txt=r=>{let t=r.raw||'';try{t=JSON.parse(t).reasoning||t;}catch(e){}return String(t);};
const r1211=R.find(r=>r.id===1211);const post=txt(r1211);
const h=P(post);ok('REAL 1211 after the apply (luna, run 38051): MUST CATCH D2 vs C2',h.length===1&&h[0].key==='RUD PAIR D2 vs C2',h.map(x=>x.key).join());
const T2=post.replace(/\\n/g,'\n');const ORIG='D2 vs C2 (Luke 1:35): CHALLENGER LINK BROKEN -- The covenant-only account does not fit the reply that names the Holy Ghost’s action and the child to be born. GROUND: (L1) Luke 1:35 "The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee" | (L2) G1982 (to overshadow); these layers carry the stated connection to the child’s birth.';
const pre=T2.split('\n').map(l=>/^D2 vs C2 \(Luke 1:35\): UNDERDETERMINED/.test(l.trim())?ORIG:l).join('\n');ok('REAL 1211 before the apply (D2 vs C2 lines as superseded, AUDIT v27): gives nothing',P(pre).length===0&&pre!==T2);
const rew=T2.replace(/^RESULT: DEFENDER WINS[^\n]*/m,'RESULT: DEFENDER WINS -- D1 vs C1 stands: [L1] Matthew 1:18 says “before they came together, she was found with child of the Holy Ghost.”');ok('PLANT RESULT rewritten in the same reply without D2 vs C2: MUST NOT CATCH',P(rew).length===0);
const base='D2 vs C2 (Luke 1:35): UNDERDETERMINED -- GROUND: [L1] Luke 1:35 "x"; the record leaves open whether y.\nD1 vs C1 (Matthew 1:18): STANDS -- GROUND: [L1] Matthew 1:18 "x"\n';
for(const [s,want] of [['RESULT: DEFENDER WINS -- D1 vs C1 decides; D2 vs C2 does not decide the outcome.',0],['RESULT: DEFENDER WINS -- D1 vs C1 decides, D2 vs C2 aside.',0],['RESULT: DEFENDER WINS -- D1 vs C1 decides without D2 vs C2.',0],['RESULT: DEFENDER WINS -- D1 vs C1 decides; D2 vs C2 remains open.',0],['RESULT: UNDERDETERMINED -- D2 vs C2 stands.',0],['RESULT: CHALLENGER WINS -- D2 vs C2 decides.',1],['KEYSTONE: D2 -- STANDS -- D2 vs C2 stands.',0]])ok('PLANT '+(want?'MUST CATCH':'MUST NOT CATCH')+': '+s,P(base+s).length===want);
let hits=[];for(const r of R){for(const x of P(txt(r)))hits.push(r.id+' '+r.seat+' '+x.key);}ok('REPLAY over '+R.length+' stored judgments (1167 to 1211, final text): 1 hit, 1211 D2 vs C2',hits.length===1&&hits[0]==='1211 luna RUD PAIR D2 vs C2',hits.join('; '));
ok('the item is TRIAL record only: why names it, and the push sets live:false',/TRIAL rule \(K-RUD, ASK 356; record only/.test(h[0].why));
// rev 2 (W1 7539): F1 line 1816 and F2 line 2392, run on stubs
{const f=new Function('G','A','seat','gateIsForced2024','gateLineFor2024','const add=[];'+tu.L[1816]+';return add;');
 const Gs=[{gid:'G1',kind:'NOT APPLIED',src:'E-APPLY'},{gid:'G2',kind:'RULE K-RUD',src:'E-GATE RUD',live:false}];const As={G1:{ans:'CHANGE',to:'a',why:'w'},G2:{ans:'CHANGE',to:'b',why:'w'}};
 const ad=f(Gs,As,'luna',()=>false,(x,t)=>t);ok('F1: a CHANGE answering the K-RUD item is not added to the applied changes; the other item still is',ad.length===1&&ad[0].sid==='G1',ad.map(x=>x.sid).join());
 const fb=new Function('G','A','seat','gateIsForced2024','gateLineFor2024','const add=[];'+bu.L[1816]+';return add;');ok('F1 control: the base line adds both',fb(Gs,As,'luna',()=>false,(x,t)=>t).length===2);}
{const g=new Function('G','SBB','seat','rp',tu.L[2392]+';return "CALL";');const SB=[{seat:'luna',run_token:'rt1',api_model:'m1'}];
 const rp1={seat:'luna'};const it1={gid:'G1',kind:'RULE K-RUD',src:'E-GATE RUD',why:'TRIAL rule (K-RUD',lines:['RESULT: x','D2 vs C2 (y): UNDERDETERMINED']};
 ok('F2: a seat with only K-RUD items gets no gate call, and its report carries the record',g({items:[it1]},SB,'luna',rp1)===undefined&&rp1.rud_rec&&rp1.rud_rec.run_token==='rt1'&&rp1.rud_rec.items.length===1);
 const rp2={seat:'luna'};ok('F2: a seat with K-RUD and another item still gets its call, no record entry',g({items:[it1,{src:'E-APPLY'}]},SB,'luna',rp2)==='CALL'&&!rp2.rud_rec);
 ok('F2: no items, no call, no record (as base)',g({items:[]},SB,'luna',{})===undefined);
 const rows=GR.rudRows2024([rp1,rp2,{seat:'sol',error:'x'}]);ok('F2 record: Gate Record makes one RECORD-ONLY UNCURED E-GATE row per K-RUD item of a seat with no call',rows.length===1&&rows[0].run_token==='rt1'&&rows[0].seat==='luna'&&rows[0].rule==='E-GATE'&&rows[0].cure_status==='UNCURED'&&/RECORD-ONLY\)$/.test(rows[0].cure_reason)&&rows[0].flagged_line==='RESULT: x\nD2 vs C2 (y): UNDERDETERMINED'&&rows[0].item==='G1 RULE K-RUD (E-GATE RUD)',JSON.stringify(rows[0]).slice(0,200));
 ok('F2 record: both Gate Record paths (skip, line 1922; calls, line 1933) add the rows',/gate_rows:rudRows2024\(first\.gate_report\)/.test(tu.L[1922])&&/gate_rows:rows\.concat\(rudRows2024\(first\.gate_report\)\)/.test(tu.L[1933]));}
// rev 3 (W1 7547 F4): the K-RUD answer is read on a copy; REAL 1211 text, PLANT answers
{const C=GR.rudCure2024;const x=P(post)[0];const T0=String(post);const cp=T0.slice();
 const und=x.lines[1];const reg=und.replace(/UNDERDETERMINED/,'DEFENDER LINK STANDS');
 const cs=[['CHANGE the RESULT without D2 vs C2',{ans:'CHANGE',to:'RESULT: DEFENDER WINS -- D1 vs C1 decides: [L1] Matthew 1:18 “she was found with child of the Holy Ghost.”'},true],
  ['CHANGE the D2 vs C2 line to a grade',{ans:'CHANGE',to:'"'+reg+'"'},true],
  ['CHANGE the D2 vs C2 line but keep UNDERDETERMINED',{ans:'CHANGE',to:und.replace(/ -- /,' -- still open -- ')},false],
  ['CHANGE that names another line',{ans:'CHANGE',to:'D1 vs C1 (Matthew 1:18): CHALLENGER LINK BROKEN -- z'},false],
  ['CHANGE the RESULT, still resting on D2 vs C2',{ans:'CHANGE',to:'RESULT: DEFENDER WINS -- D2 vs C2 decides.'},false],
  ['KEEP',{ans:'KEEP'},false]];
 for(const [nm,a,want] of cs){const r=C(x,a,T0);ok('F4 '+(want?'CURED':'UNCURED')+': '+nm,r.cured===want&&/not applied, not counted\)$/.test(r.why)&&(!/^CHANGE/.test(a.ans)||!/^(WOULD|STILL)/.test(r.why)||(want?/^WOULD CURE/:/^STILL RAISED/).test(r.why)),r.why);}
 ok('F4: the corrected text is unchanged after the reads',T0===cp&&post===cp);
 ok('F4: the K-RUD branch stands before the generic cure branch at line 1837',/else if\(x\.src==='E-GATE RUD'\)\{const __rc=rudCure2024\(x,a,R2\.T1\)[^\n]*else\{const st=/.test(tu.L[1837]));}
ok('F4: a cured K-RUD row takes no count off: the count-off at line 3476 reads only src E-APPLY S<n>, and the uncured tally at line 3467 only live items',/__offR=res\.filter\(r=>r\.cured&&r\.ans==='CHANGE'&&\/was applied\/\.test\(r\.why\)&&\/\^E-APPLY S\\d\+\$\/\.test\(r\.src\)/.test(tu.L[3476])&&/uncured:res\.filter\(r=>!r\.cured&&r\.live&&!r\.oa\)/.test(tu.L[3467]));
console.log(n+' checks, '+(f?'FAILS '+f:'ALL OK'));
