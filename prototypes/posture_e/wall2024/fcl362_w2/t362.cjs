// ASK 362 tests. Usage: node t362.cjs <target> <base> <lib.cjs> <j1214.json>. REAL = stored judgment 1214 (grok, run 38106) and log rows 43518-43520; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require(process.argv[4]);let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d?' :: '+d:''));};
const tw=JSON.parse(fs.readFileSync(process.argv[2])),bw=JSON.parse(fs.readFileSync(process.argv[3]));const tu=unpack(tw),bu=unpack(bw);
const dl=tu.L.map((l,i)=>l!==bu.L[i]?i:-1).filter(i=>i>=0);ok('library line changed is 1450 only; line count equal',tu.L.length===bu.L.length&&dl.join()==='1450',dl.join());
ok('header and tail equal',tu.hdr===bu.hdr&&tu.tail===bu.tail);
const BN={};for(const x of bw.nodes)BN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(BN[x.name])).map(x=>x.name);ok('only the Shared Library node changed',dn.join()==='Shared Library',dn.join());
ok('connections and node order equal',JSON.stringify(tw.connections)===JSON.stringify(bw.connections)&&tw.nodes.map(x=>x.name).join()===bw.nodes.map(x=>x.name).join());
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',!bad.length,Object.keys(tu.M).length+' entries');
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(bu.L,bu.M[k])).sort();
const want=['Alt Gate Build','Alt Gate Record','Alt Late Gate Build','Alternate Merge 1','Alternate Merge Seat','Gate Build','Gate Record','Late Gate Build','R2 Alt Gate Build','R2 Alt Gate Record','R2 Alt Late Gate Build','R2 Alternate Merge','R2 Alternate Merge Seat'];
ok('changed entries are the 13 that hold line 1450 (W1 7592)',ch.join()===want.join(),ch.join(', '));
const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry',!syn.length,syn.join('; '));
const cnt=(w,s)=>JSON.stringify(w.nodes).split(s).length-1;ok('model setting words unchanged',['max_tokens','temperature','reasoning','effort','thinking'].every(s=>cnt(tw,s)===cnt(bw,s)));
ok('no oos flag on the strike (W1 P2)',!/__fk&&o2===o\)\?'':to[^}]*oos/.test(tu.L[1450])&&(tu.L[1450].match(/oos/g)||[]).length===(bu.L[1450].match(/oos/g)||[]).length);
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});const T=load(rb(tu.L,tu.M['Alternate Merge Seat']),$),B=load(rb(bu.L,bu.M['Alternate Merge Seat']),$);
const r=JSON.parse(fs.readFileSync(process.argv[5]));let cut=r.raw.length;try{JSON.parse(r.raw)}catch(e){cut=+String(e.message).match(/position (\d+)/)[1];}const p=JSON.parse(r.raw.slice(0,cut)),tail=r.raw.slice(cut);
const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
const L=p.reasoning.split('\n');const fr={};for(const x of r.rows)fr[x.id]=x;const pairs=[['D1 vs C2',43518,'G1'],['D3 vs C1',43519,'G2'],['D3 vs C2',43520,'G3']];const its=[];
for(const [pr,id,g] of pairs){const ix=L.map((l,i)=>l.startsWith(pr+' (')?i:-1).filter(i=>i>=0);const to=L[ix[1]];L[ix[1]]=fr[id].flagged_line;its.push({sid:g,rule:'E-GATE',seat:'grok',ans:'CHANGE',line:fr[id].flagged_line,to});}
const mkraw=Ls=>JSON.stringify({...p,reasoning:Ls.join('\n')})+tail;const raw=mkraw(L);
const C=(txt,pr)=>{const X=String(txt).split('\n');return [X.filter(l=>l.startsWith(pr+' (')).length,X.filter(l=>new RegExp('^FORCED: '+pr+'\\b').test(l)).length];};
const Rb=B.sbApply2024('grok',raw,F,its,null),Rt=T.sbApply2024('grok',raw,F,its,null);
ok('REAL 1214 base: each of the three pairs holds its collision line twice (the run 38106 record)',pairs.every(([pr])=>C(Rb.text,pr).join()==='2,0'),pairs.map(([pr])=>pr+' '+C(Rb.text,pr)).join('; '));
ok('REAL 1214 ASK 362: each pair holds one collision line and no FORCED line',pairs.every(([pr])=>C(Rt.text,pr).join()==='1,0'),pairs.map(([pr])=>pr+' '+C(Rt.text,pr)).join('; '));
ok('REAL 1214: the same changes are applied, no new item',JSON.stringify(Rt.applied)===JSON.stringify(Rb.applied)&&(Rt.items||[]).length===(Rb.items||[]).length,JSON.stringify(Rt.applied));
{const a=Rb.text.split('\n'),b=Rt.text.split('\n');const st=b.map((l,i)=>l===''&&a[i]!==''?i:-1).filter(i=>i>=0);ok('REAL 1214: the texts differ only at the three struck lines, which the base holds as the copies',a.length===b.length&&st.length===3&&a.every((l,i)=>st.includes(i)||l===b[i])&&st.every(i=>pairs.some(([pr])=>a[i].startsWith(pr+' ('))),'struck at lines '+st.join(','));}
ok('W1 P1: the struck FORCED lines stay in rp as replaced originals',pairs.every(([pr,id,g])=>Rt.rp.some(z=>z[2]===g&&z[1]===''&&String(z[0]).startsWith('FORCED: '+pr))),'');
const wb=B.cureRewrite(raw,true,Rb,'grok',F),wt=T.cureRewrite(raw,true,Rt,'grok',F);const reas=s=>{let k=s.length;try{JSON.parse(s)}catch(e){k=+String(e.message).match(/position (\d+)/)[1];}return JSON.parse(s.slice(0,k)).reasoning;};
ok('W1 P1: the stored rewrite holds one collision line per pair (base: two)',pairs.every(([pr])=>C(reas(wt),pr).join()==='1,0'&&C(reas(wb),pr).join()==='2,0'));
const v27=wt.split('\n').filter(l=>/^\[AUDIT v27: SUPERSEDED LINE -- SEAT: grok; LABEL: LINE; ORIGINAL: FORCED: D1 vs C2/.test(l));ok('W1 P1: AUDIT v27 records the struck FORCED line of G1 as an original',v27.length===1,v27[0]&&v27[0].slice(0,150));
{const TG=load(rb(tu.L,tu.M['Gate Record']),$),BG=load(rb(bu.L,bu.M['Gate Record']),$);ok('W1 P1: gcp2024 loads from Gate Record (rev: the first draft read it from a node that does not hold it and compared null with null)',typeof TG.gcp2024==='function'&&typeof BG.gcp2024==='function');for(const d of [0,1,3]){const body=JSON.stringify({payload:{judge_seat:'grok',verdict_raw:raw,drv_uncured:d,...F}});const a=JSON.stringify(BG.gcp2024([body],its,null)),b=JSON.stringify(TG.gcp2024([body],its,null));ok('W1 P1: pkgGCP gives the same result before and after on 1214, drv_uncured '+d,a===b,b.slice(0,160));}}
// plants for the unchanged cases
const same=(nm,Ls,its2)=>{const rw=mkraw(Ls);const a=B.sbApply2024('grok',rw,F,its2,null),b=T.sbApply2024('grok',rw,F,its2,null);ok('PLANT unchanged: '+nm,a.text===b.text&&JSON.stringify(a.rp)===JSON.stringify(b.rp));};
{const L2=L.filter(l=>!l.startsWith('D1 vs C2 ('));same('no standing collision line for the pair (the FORCED line takes the text)',L2,[its[0]]);}
{const fo=its[0].line;same('a FORCED-to-FORCED change',L,[{...its[0],to:fo.replace('Till looks forward','Till looks ahead')}]);}
{const co=L.find(l=>l.startsWith('D1 vs C2 ('));same('a change to the collision line itself',L,[{...its[0],line:co,to:co.replace('UNDERDETERMINED','CHALLENGER LINK BROKEN')}]);}
{const fo=its[0].line;const other='D3 vs C2 (Matthew 1:18): UNDERDETERMINED -- PLANT';same('a FORCED line changed to another pair\'s collision line (refused at line 1447 as before)',L,[{...its[0],to:other}]);}
// W1 P3: keyChecks hits the change: the strike and the write fall together
{const fo=L.find(l=>/^FORCED: D5 vs C5/.test(l)),ko=L.find(l=>/^KEYSTONE/.test(l));const to='D5 vs C5 (Hebrews 7:14): UNDERDETERMINED -- PLANT -- GROUND: [L1] Hebrews 7:14 "it is evident that our Lord sprang out of Juda"';
 const R=T.sbApply2024('grok',mkraw(L),F,[{sid:'G9',rule:'E-GATE',seat:'grok',ans:'CHANGE',line:fo,to},{sid:'G8',rule:'E-GATE',seat:'grok',ans:'CHANGE',line:ko,to:ko}],null);
 ok('W1 P3 PLANT: a keyChecks CONTRADICTION on the change removes both the strike and the write; the text keeps its FORCED and collision line',(R.items||[]).some(z=>z.sid==='G9'&&z.kind==='CONTRADICTION')&&!(R.rp||[]).some(z=>z[2]==='G9')&&C(R.text,'D5 vs C5').join()==='1,1',C(R.text,'D5 vs C5').join());}
console.log(n+' checks, '+(f?'FAILS '+f:'ALL OK'));process.exit(f?1:0);
