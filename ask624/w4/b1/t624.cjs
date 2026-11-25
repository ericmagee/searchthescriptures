// ASK 624.5 tests (W4). node t624.cjs base_eng base_child target_eng target_child fx/j42373.json fx/j_prior3.json
// C1 the 42373 chatgpt judgment raises the self-check items; C2 the 11 other stored judgments raise none; C3 a CHANGE TO a WHICH HOLDS line applies (target) and clears the item, NOT APPLIED on the base;
// C4 a KEEP leaves the item open (uncured); C5 scope and the six late-gate keys; C6 tags and compile. Standing and pair are run apart (out_standing_624.txt, pair line).
const fs=require('fs');const [,,BE,BC,TE,TC,FA,FB]=process.argv;const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const be=J(BE),bc=J(BC),te=J(TE),tc=J(TC);const JS=[...J(FA),...J(FB)];let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
const G=require('/mnt/project-files/standing/tools/gatefn.cjs');
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const ch=(a,b)=>Object.keys(P(b)).filter(k=>P(a)[k]!==P(b)[k]).sort();
const split=T=>({L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))});
const reb=(p,k)=>p.M[k].p.map(e=>typeof e==='number'?p.L[e]:typeof e[0]==='string'?e[0]:p.L.slice(e[0],e[1]+1).join('\n')).join('\n');
const SL=d=>d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const pb=split(SL(be)),pt=split(SL(te));
// C5 scope
ok(JSON.stringify(ch(be,te))==='["Shared Library"]','C5 engine: only the Shared Library changes '+JSON.stringify(ch(be,te)));
ok(JSON.stringify(bc)===JSON.stringify(tc),'C5 child unchanged (it takes the engine library in the call, ASK 578)');
ok(JSON.stringify(be.connections)===JSON.stringify(te.connections),'C5 engine connections unchanged');
const CHL=[];pb.L.forEach((l,i)=>{if(pt.L[i]!==l)CHL.push(i);});const SCK=pb.L.length;
ok(JSON.stringify(CHL)==='[1370,1375,3467,3471,3474,3475,3478,3482,3485,3486,3487,3490]'&&pt.L.length===SCK+1,'C5 LIB lines changed '+JSON.stringify(CHL)+', one line added at '+SCK);
const SIX=['Gate Build','Alt Gate Build','R2 Alt Gate Build','Gate Record','Alt Gate Record','R2 Alt Gate Record','Late Gate Build','Alt Late Gate Build','R2 Alt Late Gate Build'];
const LATE=['Late Gate Build','Alt Late Gate Build','R2 Alt Late Gate Build','Gate Record','Alt Gate Record','R2 Alt Gate Record'];
for(const k of LATE){const p=pt.M[k].p;const iw=p.indexOf(3559),is=p.indexOf(SCK);ok(iw>=0&&is>iw&&reb(pt,k).length===pt.M[k].n,'C5 '+k+': WHL507 then SCK624 in its source; rebuilds at its stated length');}
const same=Object.keys(pb.M).filter(k=>reb(pb,k)===reb(pt,k)).length,diff=Object.keys(pb.M).filter(k=>reb(pb,k)!==reb(pt,k));
ok(diff.every(k=>pt.M[k].p.some(e=>[1375,3467,3471,3474,3475,3478,3482,3485,3486,3487,SCK].includes(e)||(Array.isArray(e)&&typeof e[0]==='number'&&[1370,1375,3467,3471,3474,3475,3478,3482,3485,3486,3487,3490].some(i=>i>=e[0]&&i<=e[1])))),'C5 '+same+' MAP entries rebuild the same text; the '+diff.length+' that differ all hold a changed line: '+diff.join(', '));
// C6 tags and compile
ok(CHL.concat([SCK]).every(i=>/ASK 624\.5/.test(pt.L[i])),'C6 ASK 599 rule 10: every changed or added LIB line carries "ASK 624.5"');
for(const k of SIX){let e=null;try{new Function('$','$input','$json','$execution','$workflow','$node',reb(pt,k));}catch(x){e=x.message;}ok(!e,'C6 compiles: '+k+(e?' '+e:''));}
const S0=()=>G(te,'Late Gate Build',{},['SCK624']).SCK624;
// C6 ASK 599 rule 7: every catch the build adds records the fault (W1 Wall 11878)
{const NEW=CHL.concat([SCK]).map(i=>[i,pt.L[i],pb.L[i]||'']);const cnt=(t)=>(t.match(/catch\(e\)\{/g)||[]).length;
 const added=NEW.filter(([i,t,b])=>cnt(t)>cnt(b));const bad=[];for(const [i,t,b] of added){const ms=[...t.matchAll(/catch\(e\)\{([^}]{0,160})\}/g)].map(m=>m[1]);const mb=[...b.matchAll(/catch\(e\)\{([^}]{0,160})\}/g)].map(m=>m[1]);for(const m of ms){if(mb.includes(m))continue;if(!/(?:__sckE|__e|LG\.sckErr)=String\(e|SELF-CHECK FAULT/.test(m))bad.push(i+': catch{'+m+'}');}}
 ok(!bad.length&&added.length,'C6 rule 7: '+added.length+' lines add catch blocks; each new catch records the fault'+(bad.length?' BAD '+bad.join(' | '):''));}
{const SK=new Function('WHL507',pt.L[SCK]+'\nreturn SCK624;')({faults(){throw new Error('forced');}});const it=SK.items('WHICH HOLDS: CHALLENGER\nRESULT: HELD','HELD');
 ok(it.length===1&&it[0].kind==='SELF-CHECK FAULT'&&!it[0].send&&/forced/.test(it[0].text),'C6 whl(): a WHL507 fault comes back as a SELF-CHECK FAULT item, not sent');}
{const t=pt.L[3474];const blk=t.slice(t.indexOf('{let __r=[]'),t.indexOf('/* ASK 624.5: faults and record-only'));const run=(C,S)=>{const p={verdict_raw:'',verdict_tag:'HELD'};new Function('C','p','g','safe','SCK624',blk)(C,p,{seat:'x'},z=>String(z),S);return p.verdict_raw;};
 const thr={get R2(){throw new Error('forced R2');}};ok(/\[AUDIT v60: SELF-CHECK FAULT \(ASK 624\.5\) -- SEAT: x; the self-check threw and was not run: forced R2/.test(run(thr,S0())),'C6 Gate Record: a fault in the self-check writes an AUDIT v60 SELF-CHECK FAULT line');
 const cgx=JS.find(r=>r.id==1276);const out=run({R2:{R1:{text:cgx.verdict_raw,fields:{verdict_tag:'HELD'}}}},S0());ok((out.match(/SELF-CHECK RECORD ONLY/g)||[]).length===2&&!/SELF-CHECK FAULT/.test(out),'C6 Gate Record: the 2 record-only items of 1276 are written as AUDIT v60 SELF-CHECK RECORD ONLY lines');
 ok(/catch\(e\)\{__sckE=String\(e/.test(pt.L[3482])&&/sck_fault:__sckE/.test(pt.L[3490]),'C6 Late Gate Build: a fault is kept and carried as sck_fault on the sent item (Gate Record re-runs the same check and records it)');}
// C1, C2 on the built SCK624 in the Late Gate Build scope
const LGB=G(te,'Late Gate Build',{},['SCK624','WHL507']);ok(!LGB.__fail.length&&LGB.SCK624,'C1 SCK624 loads in the built Late Gate Build scope '+LGB.__fail.join('; '));
const S=LGB.SCK624;let tot=0;
for(const r of JS){const it=S.items(r.verdict_raw,r.verdict_tag);const sent=it.filter(x=>x.send);
 if(r.id==1276){ok(sent.length===3&&['WHICH HOLDS AGREEMENT','RETRACTION LEFT STANDING','TWO GRADES'].every(k=>sent.some(x=>x.kind===k)),'C1 42373 chatgpt (1276, '+r.verdict_tag+'): sent '+sent.length+' ['+sent.map(x=>x.kind).join(', ')+'], recorded only '+(it.length-sent.length));
  ok(sent.every(x=>/ A KEEP does not cure this item\.$/.test(x.text))&&it.filter(x=>!x.send).every(x=>!/KEEP does not cure/.test(x.text)),'C1 each sent item ends "A KEEP does not cure this item."; recorded items do not');
  ok(sent.every(x=>!/\b(?:is right|is correct|should be|the defender wins|the challenger wins)\b/i.test(x.text.replace(/Your (?:line|other line|WHICH HOLDS line|RESULT line|retraction|verdict)[^"]*"[^"]*"/g,''))),'C1 fence: no item text says which line or side is right (outside the quoted lines)');}
 else{tot+=sent.length;}}
ok(tot===0,'C2 the 11 other stored judgments (42373 sol, sol62; runs 41736, 41822, 42071) raise no sent item ('+tot+')');
// C3, C4 apply on the built sbApply2024 (Gate Record scope), target against base
const cg=JS.find(r=>r.id==1276);const W=S.items(cg.verdict_raw,cg.verdict_tag).find(x=>x.kind==='WHICH HOLDS AGREEMENT');
const whl=W.lines[0];const to=whl.replace(/WHICH HOLDS\s*:\s*\**\s*CHALLENGER/i,'WHICH HOLDS: DEFENDER');ok(to!==whl,'C3 test change: '+JSON.stringify(whl.slice(0,90))+' -> '+JSON.stringify(to.slice(0,90)));
const GT=G(te,'Gate Record',{},['sbApply2024','sbLabel0','SCK624']),GB=G(be,'Gate Record',{},['sbApply2024','sbLabel0']);
ok(GT.sbLabel0(whl)==='WHICH HOLDS'&&GB.sbLabel0(whl)===null,'C3 sbLabel0 labels the WHICH HOLDS line on the target ('+GT.sbLabel0(whl)+'), not on the base ('+GB.sbLabel0(whl)+')');
const its=[{seat:'chatgpt',sid:W.gid||'G9',rule:'E-GATE',item:W.kind,line:whl,ans:'CHANGE',to,why:'test'}];const FF={verdict_tag:cg.verdict_tag};
const at=GT.sbApply2024('chatgpt',cg.verdict_raw,FF,its,{}),ab=GB.sbApply2024('chatgpt',cg.verdict_raw,FF,its,{});
const has=(t,s)=>String(t).replace(/\\n/g,'\n').split('\n').some(l=>l.replace(/[*_`]+/g,'').trim()===s.replace(/[*_`]+/g,'').trim());
ok(has(at.text,to)&&!has(at.text,whl),'C3 target: the CHANGE TO replaces the one WHICH HOLDS line');
ok(!has(ab.text,to),'C3 base: the same CHANGE TO is not applied (today NOT APPLIED, record-only since ASK 607)');
const rw=String((at.fields&&at.fields.verdict_tag)||at.tag||'').toUpperCase().replace(/[^A-Z].*$/,'');
ok(rw&&!GT.SCK624.open(at.text,rw,'SCK WHL'),'C3 cure by re-check: after the change the WHICH HOLDS item is no longer open (verdict '+rw+')');
ok(S.open(cg.verdict_raw,cg.verdict_tag,'SCK WHL'),'C4 KEEP: with no change the re-check still finds the item, so it stays uncured');
const re=whl.replace(/WHY IT FAILS/,'WHY IT FAILS (restated)');const two=[{seat:'chatgpt',sid:'G9',rule:'E-GATE',item:W.kind,line:whl,ans:'CHANGE',to:re,why:'test'}];const an=GT.sbApply2024('chatgpt',cg.verdict_raw,FF,two,{});
const rn=String((an.fields&&an.fields.verdict_tag)||an.tag||'').toUpperCase().replace(/[^A-Z].*$/,'');
ok(re!==whl&&has(an.text,re)&&GT.SCK624.open(an.text,rn,'SCK WHL'),'C4 a CHANGE that is applied but still names the CHALLENGER under '+rn+' cures nothing: the re-check still finds the item');
console.log(fails?'FAILS: '+fails:'ALL PASS');process.exitCode=fails?1:0;
