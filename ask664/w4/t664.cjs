// ASK 664 Part 1 tests (W4). node t664.cjs base_eng.json target_eng.json j33.json fx_j42373.json fx_jprior3.json
const fs=require('fs'),cr=require('crypto');const [,,BE,TE,J33,FA,FB]=process.argv;const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const be=J(BE),te=J(TE),JS=J(J33);const FX=[...J(FA),...J(FB)];let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
const G=require('/mnt/project-files/standing/tools/gatefn.cjs');
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const ch=(a,b)=>Object.keys(P(b)).filter(k=>P(a)[k]!==P(b)[k]).sort();
const split=T=>({L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/'))),H:T.slice(0,T.indexOf('\n/*LIB*/'))});
const reb=(p,k)=>p.M[k].p.map(e=>typeof e==='number'?p.L[e]:typeof e[0]==='string'?e[0]:p.L.slice(e[0],e[1]+1).join('\n')).join('\n');
const code=(d,n)=>d.nodes.find(x=>x.name===n).parameters.jsCode;const pb=split(code(be,'Shared Library')),pt=split(code(te,'Shared Library'));
// T1 scope
ok(JSON.stringify(ch(be,te))==='["Build Independent Verdict","Panel Build","Shared Library"]','T1 changed nodes '+JSON.stringify(ch(be,te)));
ok(JSON.stringify(be.connections)===JSON.stringify(te.connections),'T1 connections unchanged');
const CHL=[];pb.L.forEach((l,i)=>{if(pt.L[i]!==l)CHL.push(i);});ok(JSON.stringify(CHL)==='[3471,3858]'&&pt.L.length===pb.L.length,'T1 LIB lines changed '+JSON.stringify(CHL)+', count '+pt.L.length);
const mapd=Object.keys(pb.M).filter(k=>JSON.stringify(pb.M[k])!==JSON.stringify(pt.M[k])).sort();
ok(JSON.stringify(mapd)===JSON.stringify(['Alt Gate Record','Alt Late Gate Build','Gate Record','Late Gate Build','R2 Alt Gate Record','R2 Alt Late Gate Build'])&&mapd.every(k=>JSON.stringify(pb.M[k].p)===JSON.stringify(pt.M[k].p)),'T1 MAP: only n changes, for the 6 entries holding the SCK624 line');
ok(Object.keys(pt.M).every(k=>reb(pt,k).length===pt.M[k].n),'T1 every MAP entry rebuilds at its stated length');
{const s=cr.createHash('sha256').update(JSON.stringify(pt.L)).digest('hex').slice(0,16);const m=pt.H.match(/library sha ([0-9a-f]{16}), (\d+) lines/);ok(m&&m[1]===s&&+m[2]===pt.L.length,'T1 header = body: library sha '+s+', '+pt.L.length+' lines');}
ok(CHL.every(i=>/ASK 664/.test(pt.L[i])),'T1 ASK 599 rule 10: every changed LIB line carries "ASK 664"');
{const a=pb.L[3471],b=pt.L[3471];const i=[...a].findIndex((c,k)=>c!==b[k]);const j=[...a].reverse().findIndex((c,k)=>c!==b[b.length-1-k]);console.log('INFO T1 LIB 3471 change: base '+JSON.stringify(a.slice(i-20,a.length-j+5))+' -> target '+JSON.stringify(b.slice(i-20,b.length-j+5)));}
// T2 words
const SEG=' -- TAKES: <each witness of the other position that you leave standing, by reference> BY [<round>] \\"<the holding side\'s own words that account for it, quoted>\\".';
const PAR=" The position you name as holding must take the other position's witnesses that you leave standing. For each one write TAKES with the holding side's own quoted words that account for it, or DISPUTES with your layers: [L1] quoted and one more lower layer. A position that neither takes nor disputes a witness you leave standing leaves that witness against it. Where your own lines break a link of the position you name, or count a premise of it unexhibited or conceded, say in TAKES how it holds without it.";
for(const n of ['Panel Build','Build Independent Verdict']){const a=code(be,n),b=code(te,n);ok(b.split(SEG).length===2&&b.split(PAR).length===2&&b.replace(SEG,'.').replace(PAR,'')===a,'T2 '+n+': the two insertions only, byte-equal, once each');
 let e=null;try{new Function('$','$input','$json','$execution','$workflow','$node',b);}catch(x){e=x.message;}ok(!e,'T2 compiles: '+n+(e?' '+e:''));}
for(const k of mapd){let e=null;try{new Function('$','$input','$json','$execution','$workflow','$node',reb(pt,k));}catch(x){e=x.message;}ok(!e,'T2 compiles: '+k+(e?' '+e:''));}
// load built SCK624 (target) and base
const LT=G(te,'Late Gate Build',{},['SCK624','WHL507']),LB=G(be,'Late Gate Build',{},['SCK624','WHL507']);ok(!LT.__fail.length&&LT.SCK624&&LB.SCK624,'T3 SCK624 loads in the built Late Gate Build scope '+LT.__fail.join('; '));
const S=LT.SCK624,SB=LB.SCK624;const k4=r=>S.items(r.verdict_raw,r.verdict_tag).filter(x=>x.kind==='TAKES OR DISPUTES');
// T3 firing
const EXP={1278:'a',1279:'ab',1280:'ab',1266:'b',1252:'a',1272:'b',1248:'',1269:''};
for(const [id,t] of Object.entries(EXP)){const r=JS.find(x=>x.id==id);const it=k4(r);const got=it.length?it[0].trig:'';ok(got===t&&it.length<=1&&(!it.length||(it[0].send&&it[0].key==='SCK TKS')),'T3 '+id+' ('+r.seat+'): kind 4 '+(got?'fires by ('+got.split('').join(')(')+')':'does not fire')+', expected '+(t?'('+t.split('').join(')(')+')':'none'));}
{const fire=JS.filter(r=>k4(r).length).map(r=>r.id);const A=JS.filter(r=>/a/.test((k4(r)[0]||{}).trig||'')).length,B=JS.filter(r=>/b/.test((k4(r)[0]||{}).trig||'')).length;
 const SQL=[1251,1252,1255,1257,1258,1259,1260,1261,1262,1263,1266,1267,1268,1272,1275,1276,1277,1278,1279,1280];
 ok(fire.length===20&&JSON.stringify(fire)===JSON.stringify(SQL)&&A===16&&B===9,'T3 read from the text: fires on '+fire.length+' of '+JS.length+' ((a) '+A+', (b) '+B+'); same ids as the SQL count of Wall 12389: '+(JSON.stringify(fire)===JSON.stringify(SQL)));}
// T4 TAKES or DISPUTES on the WHICH HOLDS part clears it
const r79=JS.find(x=>x.id==1279),r72=JS.find(x=>x.id==1272);
const NZ=s=>String(s).replace(/\\n/g,'\n').replace(/\\+"/g,'"').replace(/[*_`]+/g,'');
for(const [r,w] of [[r79,'TAKES'],[r79,'DISPUTES'],[r72,'TAKES']]){const it=k4(r)[0];const wh=it.lines[0];const add=wh+' -- '+w+': Romans 1:3 BY [CR2] "test words"';const t2=NZ(r.verdict_raw).split(wh).join(add);ok(t2!==r.verdict_raw&&!k4({verdict_raw:t2,verdict_tag:r.verdict_tag}).length,'T4 '+r.id+': with "-- '+w+':" added to the WHICH HOLDS part kind 4 does not fire');}
// T5 kinds 1 to 3 unchanged
{let diff=[];for(const r of [...JS,...FX]){const a=JSON.stringify(SB.items(r.verdict_raw,r.verdict_tag)),b=JSON.stringify(S.items(r.verdict_raw,r.verdict_tag).filter(x=>x.kind!=='TAKES OR DISPUTES'));if(a!==b)diff.push(r.id);}
 const ids=new Set([...JS,...FX].map(r=>r.id));ok(!diff.length,'T5 kinds 1 to 3 give the same items on base and target over '+ids.size+' stored judgments'+(diff.length?' DIFF '+diff:''));}
// T6 cure round trip (the apply logic below is copied from the target's LIB 3471; T1 prints that line) through gateRead2024, sbLabel0, sbApply2024 and SCK624.open (Gate Record scope)
const GT=G(te,'Gate Record',{},['gateRead2024','sbApply2024','sbLabel0','SCK624']);ok(!GT.__fail.length||GT.sbApply2024,'T6 Gate Record functions load '+GT.__fail.slice(0,3).join('; '));
const trip=(r,toF,lab)=>{const x=GT.SCK624.items(r.verdict_raw,r.verdict_tag).find(z=>z.kind==='TAKES OR DISPUTES');const gid='G9';const to=toF(x);const A=GT.gateRead2024('GATE: '+gid+' || CHANGE TO: '+to+' || test');const a=A[gid];if(!a)return {why:'gateRead read no answer'};
 const lb=GT.sbLabel0(a.to);let old=x.lines.find(l=>lb&&GT.sbLabel0(l)===lb)||x.lines[x.lines.length-1];let __to=a.to;if(x.key==='SCK TKS'&&lb==='WHICH HOLDS'){const h=GT.SCK624.host(r.verdict_raw,old);if(h&&h!==old){const __r=h.split(old).join('').replace(/^\s*\|\s*|\s*\|\s*$/g,'').replace(/\s*\|\s*\|\s*/g,' | ').trim();__to=a.to+(__r?' | '+__r:'');old=h;}} /* the target's LIB 3471 logic, copied */const its=[{seat:r.seat,sid:gid,rule:'E-GATE',item:x.kind,line:old,ans:'CHANGE',to:__to,why:a.why}];
 const R=GT.sbApply2024(r.seat,r.verdict_raw,{verdict_tag:r.verdict_tag},its,{});const rw=String((R&&R.fields&&R.fields.verdict_tag)||(R&&R.tag)||r.verdict_tag||'').toUpperCase().replace(/[^A-Z].*$/,'');
 const na=(R.items||[]).filter(z=>z.kind==='NOT APPLIED').map(z=>z.why);return {lb,old:old.slice(0,80),applied:String(R.text).includes(to.slice(-40)),open:GT.SCK624.open(R.text,rw,'SCK TKS'),na,rw};};
for(const r of [r79,r72]){const o=trip(r,x=>x.lines[0]+' -- TAKES: Romans 1:3 BY [CR2] "test words"');ok(o.applied&&o.open===false,'T6 '+r.id+' cure round trip, CHANGE TO the WHICH HOLDS part with TAKES: label '+o.lb+'; applied '+o.applied+'; still open '+o.open+(o.na&&o.na.length?'; NOT APPLIED: '+o.na.join(' | ').slice(0,300):''));}
// T7 trigger (a): can the judge change its STANDING line?
{const r=JS.find(x=>x.id==1278);const o=trip(r,x=>x.lines[1].replace(/STANDING\s*:\s*[A-Z-]+/,'STANDING: SELF-SUPPORTED'));console.log('INFO T7 1278 CHANGE TO the CHALLENGE STANDING line as SELF-SUPPORTED: label '+o.lb+'; applied '+o.applied+'; still open '+o.open+(o.na&&o.na.length?'; NOT APPLIED: '+o.na.join(' | ').slice(0,300):''));}
// T8 forced line (A3): 1279's D1 vs C3 changed back to UNDERDETERMINED
{const o=trip(r79,x=>x.lines[2].replace('CHALLENGER LINK BROKEN','UNDERDETERMINED'));console.log('INFO T8 1279 CHANGE TO the forced D1 vs C3 line as UNDERDETERMINED: label '+o.lb+'; applied '+o.applied+'; kind 4 still open '+o.open+' (trigger (a) remains)'+(o.na&&o.na.length?'; NOT APPLIED: '+o.na.join(' | ').slice(0,300):''));}
// T9 other readers on a WHICH HOLDS part with TAKES: WHL507.faults on 1279 with and without
{const W=LT.WHL507;const it=k4(r79)[0];const wh=it.lines[0];const t2=NZ(r79.verdict_raw).split(wh).join(wh+' -- TAKES: Romans 1:3 BY [CR2] "test words"');const n=s=>String(s).replace(/\\n/g,'\n');ok(t2!==NZ(r79.verdict_raw),'T9 TAKES inserted');
 const f1=JSON.stringify(W.faults(n(r79.verdict_raw),r79.verdict_tag).map(x=>[x.item,x.why])),f2=JSON.stringify(W.faults(n(t2),r79.verdict_tag).map(x=>[x.item,x.why]));ok(f1===f2,'T9 WHL507.faults gives the same items with and without TAKES on 1279: '+f2.slice(0,200));
 const k13a=JSON.stringify(S.items(r79.verdict_raw,r79.verdict_tag).filter(x=>x.kind!=='TAKES OR DISPUTES').map(x=>x.key)),k13b=JSON.stringify(S.items(t2,r79.verdict_tag).filter(x=>x.kind!=='TAKES OR DISPUTES').map(x=>x.key));ok(k13a===k13b,'T9 kinds 1 to 3 keys unchanged with TAKES on 1279: '+k13b);}
// T10 fence
{const t=k4(r79)[0].text.replace(/Your (?:WHICH HOLDS line|line|other line): "[^"]*"/g,'');ok(!/\b(?:is right|is correct|should be|wins)\b/i.test(t)&&/ A KEEP does not cure this item\.$/.test(k4(r79)[0].text),'T10 item text names no side or reading as right outside the quoted lines; ends "A KEEP does not cure this item."');console.log('ITEM 1279: '+k4(r79)[0].text.slice(0,1500));}
console.log(fails?'FAILS: '+fails:'ALL PASS');process.exitCode=fails?1:0;
