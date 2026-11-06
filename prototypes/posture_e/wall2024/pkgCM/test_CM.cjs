// pkgCM test (W3 2394, 2395; run 33040). Run from wall2024/: node pkgCM/test_CM.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgCM/plan_CM.json'));
T('10 nodes: base and final shas match the plan',plan.nodes.length===10&&plan.nodes.every(n=>sha(rd('pkgCM/base/'+n.file))===n.base_sha&&sha(rd('pkgCM/patched/'+n.file))===n.final_sha));
T('the 6 gate nodes base = pkgKY/patched (live 83ef4d98 = ec44727f for these nodes)',['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'].every(n=>rd('pkgCM/base/'+n+'.js')===rd('pkgKY/patched/'+n+'.js')));
{const {fnText}=require('../pkgGD/fn.cjs');const a=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'].map(n=>fnText(rd('pkgCM/patched/'+n+'.js'),'sbApply2024'));T('the 6 gate nodes carry one identical sbApply2024',a.every(x=>x===a[0]&&x.length>1000));}
// ---- (b) Judge Enforcer Build on the saved 33040 inputs, base vs patched
const IN='/mnt/project-files/wall2024/inputs/33040_';const ld=n=>JSON.parse(rd(IN+n.replace(/ /g,'_')+'.json'))[0].main[0];
const nodeItems=n=>{try{const a=ld(n);return Array.isArray(a)?a:[a];}catch(e){return null;}};
const mock=(names)=>{const $=n=>{const it=names[n]!==undefined?names[n]:nodeItems(n);if(it===null||it===undefined)return {isExecuted:false,first:()=>{throw new Error('no '+n);},all:()=>[]};return {isExecuted:true,first:()=>it[0],all:()=>it};};return $;};
const runJEB=file=>{const $=mock({'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-test',max_tokens:16000}}}]});const $input={first:()=>({json:{}})};return new Function('$','$input',rd(file))($,$input);};
const flagged=out=>{const L=[];for(const o of out){const j=o.json;for(const r of (j.code_rows||[]))L.push({seat:r.seat,rule:r.rule,item:r.item,line:r.flagged_line});for(const x of (j.ids||[]))L.push({seat:x.seat,rule:x.rule,item:x.item,line:x.flagged_line});}return L;};
const jo=flagged(runJEB('pkgCM/base/Judge_Enforcer_Build.js')),jn=flagged(runJEB('pkgCM/patched/Judge_Enforcer_Build.js'));
console.log('   JEB 33040: base '+jo.length+' items, patched '+jn.length);
const ch=jo.filter(x=>x.rule==='E-CHAIN'&&x.seat==='grok'),chn=jn.filter(x=>x.rule==='E-CHAIN'&&x.seat==='grok');
console.log('   grok E-CHAIN base: '+ch.map(x=>JSON.stringify(String(x.line).slice(-40))).join(' | ')+'\n   grok E-CHAIN new:  '+chn.map(x=>JSON.stringify(String(x.line).slice(-40))).join(' | '));
T('(b) base reproduces live: grok E-CHAIN flagged line ends in the JSON tail "}',ch.length===1&&/"\}\s*$/.test(ch[0].line));
T('(b) patched: the same item, the line without the tail',chn.length===1&&!/"\}\s*$/.test(chn[0].line)&&ch[0].line.replace(/"\}\s*$/,'').trim()===chn[0].line.trim());
const key=x=>x.seat+'|'+x.rule+'|'+x.item+'|'+x.line;const so=new Set(jo.map(key)),sn=new Set(jn.map(key));const only_o=jo.filter(x=>!sn.has(key(x))),only_n=jn.filter(x=>!so.has(key(x)));
console.log('   JEB items changed: base-only '+only_o.length+', patched-only '+only_n.length);only_o.concat(only_n).forEach(x=>console.log('     '+(so.has(key(x))?'-':'+')+' '+x.seat+' '+x.rule+' '+String(x.item).slice(0,40)+' :: '+String(x.line).slice(-60)));
T('(b) the only JEB change on 33040 is the grok E-CHAIN line',only_o.length===1&&only_n.length===1&&only_o[0].rule==='E-CHAIN'&&only_n[0].rule==='E-CHAIN');
// every panel verdict of 33040: the new reader equals cureJText(raw,true) (what E-APPLY reads) whenever that unwraps
{const AM=rd('pkgCM/patched/Alternate_Merge.js');const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {cureJText};')(()=>{throw 0},null);
 const src=rd('pkgCM/patched/Judge_Enforcer_Build.js');const i=src.indexOf('// pkgCM (b)');const j=src.indexOf('const judges=[]',i);const TO=new Function(src.slice(i,j)+'\nreturn textOf;')();
 const PCC=nodeItems('Panel Cure Check')[0].json;let n=0,same=0;for(const s of PCC.bodies||[]){const p=(typeof s==='string'?JSON.parse(s):s).payload||{};n++;{const t=String(L.cureJText(String(p.verdict_raw||''),true));const e=TO(p.verdict_raw);if(e===t||e.startsWith(t+'\n'))same++;}}
 T('(b) every 33040 panel verdict: enforcer text begins with the E-APPLY text, line for line ('+same+'/'+n+')',n>0&&same===n);}
// ---- (a) gate replay of grok 33040 with S20's line as the patched JEB writes it
const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024,SB_FORM,cureJText};')(()=>{throw 0},null);};
const O=mk('pkgCM/base'),N=mk('pkgCM/patched');
const X0=JSON.parse(rd('corpus/fix_33040.json'));
const run=(L,X,seat,rep)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!its.length)return {G:[],c:{res:[],uncured:0,fresh:[]},A:null};const PT=L.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const A=L.sbApply2024(seat,b.verdict_raw,b.fields,its,ctx.R);const R=L.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const c=rep&&R.items.length?L.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0,fresh:[]};return {G:R.items,c,A};};
const fixS20=X=>{const Y=JSON.parse(JSON.stringify(X));const s=Y.sb_items.find(x=>x.seat==='grok'&&x.sid==='S20');s.line=chn[0].line;return Y;};
const REP=X0.gate_replies||{};
const g_live=run(O,X0,'grok',REP.grok),g_b=run(O,fixS20(X0),'grok',REP.grok),g_new=run(N,fixS20(X0),'grok',REP.grok);
const s20=r=>(r.A.items||[]).filter(z=>z.sid==='S20').map(z=>z.kind+': '+z.why).join(' | ')||((r.A.applied||[]).includes('S20')?'APPLIED':'?');
console.log('   grok S20 live (pkgKY, tail line): '+s20(g_live)+'\n   grok S20 (b) only:                '+s20(g_b)+'\n   grok S20 (a)+(b):                 '+s20(g_new));
const pr=(n,r)=>{console.log('   '+n+': counted '+r.c.uncured);r.G.forEach((g,i)=>console.log('     '+g.gid+' '+g.kind+' ('+g.src+') -> '+(r.c.res[i]?(r.c.res[i].cured?'CURED':'UNCURED')+' -- '+String(r.c.res[i].why).slice(0,150):'-')));};
pr('grok live (base, tail line)',g_live);pr('grok base with (b) only',g_b);pr('grok pkgCM',g_new);
T('(a) live reproduced: S20 not applied, flagged line not in judge text',/NOT APPLIED: the flagged line is not in the judge text/.test(s20(g_live)));
T('(b) alone is not enough: S20 found but refused for form',/NOT APPLIED: the CHANGE TO line has no line form/.test(s20(g_b)));
T('(a)+(b): S20 applies',(g_new.A.applied||[]).includes('S20'));
T('(a)+(b): no gate item names S20 (G2 of live is gone)',!g_new.G.some(g=>g.src==='S20'||String(g.key||'').includes('S20')));
T('(a)+(b): grok counted 0',g_new.c.uncured===0);
{const t=String(g_new.A.text||'').split('\n').filter(l=>/CHAIN MARK/.test(l));console.log('   grok corrected CHAIN MARK lines: '+t.map(l=>l.slice(0,90)).join(' / '));T('(a) corrected text: CHALLENGER CHAIN MARK STRAINED, DEFENDER CHAIN MARK untouched',t.some(l=>/^CHALLENGER CHAIN MARK: STRAINED/.test(l.trim()))&&!t.some(l=>/^CHALLENGER CHAIN MARK: FOOTED/.test(l.trim())));}
// units on the same-side rule
{const b=X0.bodies.find(b=>b.seat==='grok');const PT=N.gatePromptText2024(X0.PB.judges.find(q=>q.seat==='grok').body);const R=N.ciRounds(PT);const T0=String(N.cureJText(String(b.verdict_raw),true)).split('\n');const cc=T0.find(l=>/^\s*CHALLENGER CHAIN MARK/.test(l)),dc=T0.find(l=>/^\s*DEFENDER CHAIN MARK/.test(l)),col=T0.find(l=>/^\s*D\d+ vs C\d+/.test(l));
 const ap=(line,to)=>N.sbApply2024('grok',b.verdict_raw,b.fields,[{seat:'grok',sid:'U1',ans:'CHANGE',line,to}],R);const why=r=>((r.items||[]).find(z=>z.sid==='U1')||{}).why||((r.applied||[]).includes('U1')?'APPLIED':'?');
 T('unit: DEFENDER CHAIN MARK over the CHALLENGER CHAIN MARK line is refused',/moves the CHALLENGER CHAIN MARK to the DEFENDER side/.test(why(ap(cc,'DEFENDER CHAIN MARK: STRAINED -- x'))));
 T('unit: a CHAIN MARK line over a collision line is refused',col&&/may replace only a CHAIN MARK line/.test(why(ap(col,'CHALLENGER CHAIN MARK: STRAINED -- x'))));
 T('unit: a collision line over a CHAIN MARK line is refused',/drops the DEFENDER CHAIN MARK/.test(why(ap(dc,'D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- x'))));
 T('unit: DEFENDER CHAIN MARK FOOTED -> SLACK applies',why(ap(dc,'DEFENDER CHAIN MARK: SLACK'))==='APPLIED');
 T('unit: SB_FORM still refuses "CHAIN MARK: FOOTED" without a side, and "DEFENDER CHAIN MARK: BROKEN"',!N.SB_FORM.test('CHAIN MARK: FOOTED')&&!N.SB_FORM.test('DEFENDER CHAIN MARK: BROKEN'));}
// ---- regression: every other fixture, base vs patched, gate items and cures unchanged
const RUNS=[['32998','pkgGD/fixture_32998.json',null],['33014','pkgKF/fixture_33014.json',null],['33020','pkgGD/probe_33020/fixture_33020.json',null],['33021','probe_33021/fixture_33021.json','R21'],['33025','probe_33025/fixture_33025.json','probe_33025/gate_replies.json'],['33040','corpus/fix_33040.json',null]];
const REP21={gemini:'GATE: G1 || CHANGE TO: D1: STANDS -- GROUND: Answered in [CR4]; Matthew 1:18 dates the finding before they came together, which can agree with the finding preceding the taking of Matthew 1:24. || In [DR3], the challenger explains that "before they came together" means before the taking of 1:24, which can agree with the finding preceding the taking.'};
const sig=r=>JSON.stringify([r.A&&r.A.applied,r.G.map(g=>g.gid+' '+g.kind+' '+g.key),r.c.res.map(x=>x.gid+' '+x.cured+' '+x.why),r.c.uncured]);
const diffs=[];for(const [name,f,rp] of RUNS){const X0b=JSON.parse(rd(f));const REPx=rp==='R21'?REP21:rp?JSON.parse(rd(rp)):null;for(const X of [X0b,X0b.alt].filter(x=>x&&x.bodies&&x.bodies.length)){for(const b of X.bodies){const rep=(REPx||X.gate_replies||{})[b.seat];const a=run(O,X,b.seat,rep),n=run(N,X,b.seat,rep);if(sig(a)!==sig(n))diffs.push(name+' '+b.seat+(X===X0b?'':' (alt)'));}}}
console.log('   gate sbApply/items/cures that differ base -> pkgCM (fixtures as stored): '+(diffs.join(', ')||'none'));
T('regression: no gate result changes on the 6 stored fixtures (33040 as stored keeps the tail, so S20 is still not found there)',diffs.length===0);
// corpus: every CHANGE TO in the corpus whose SB_FORM verdict changes
{let n=0,flip=[];for(const l of rd('corpus/texts.jsonl').split('\n')){if(!l.trim())continue;let o;try{o=JSON.parse(l);}catch(e){continue;}if(o.src!=='change_to')continue;n++;const t=String(o.text||'').trim();if(O.SB_FORM.test(t)!==N.SB_FORM.test(t))flip.push((o.run||'')+' '+(o.seat||'')+' '+t.slice(0,70));}
 console.log('   corpus CHANGE TO payloads: '+n+'; SB_FORM flips: '+flip.length);flip.forEach(x=>console.log('     '+x));T('corpus: every SB_FORM flip is a CHAIN MARK line',flip.every(x=>/CHAIN MARK/.test(x)));}
// ---- (c) Send Back Build message on the E-HOLD items
{const src=rd('pkgCM/patched/Send_Back_Build.js');const i=src.indexOf(' const hold421=');const j=src.indexOf('\n',src.indexOf('};',i));const H=new Function('cut',src.slice(i,j+1)+'\nreturn hold421;')((s,n)=>String(s).slice(0,n));
 const it=X0.sb_items.filter(x=>x.rule==='E-HOLD');const out=it.map(x=>({sid:x.seat+' '+x.sid,m:H({rule:'E-HOLD',item:x.item,reason:x.reason,src:{cure_reason:'ENFORCER DISAGREE '+x.reason}})}));
 out.forEach(o=>console.log('   '+o.sid+': '+(o.m?o.m.slice(1,140)+' ...':'(no rule line)')));
 T('(c) the rule line goes on exactly the "right: BROKEN" E-HOLD items (chatgpt S19, S20; grok S17)',out.filter(o=>o.m).map(o=>o.sid).join(',')==='chatgpt S19,chatgpt S20,grok S17');
 T('(c) chatgpt S19 names its pair in the FORCED form',/FORCED: D2 vs C2 -- MEANS \[<round>\]/.test(out.find(o=>o.sid==='chatgpt S19').m));
 T('(c) not on other rules',H({rule:'E-ANS',item:'x',reason:'(right: BROKEN)'})==='');}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
