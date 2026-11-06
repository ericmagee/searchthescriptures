// pkgGATE test. Run from wall2024/: node pkgGATE/test_GATE.cjs
const fs=require('fs');const {runs}=require('./run_probe.cjs');
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const P='pkgGATE/patched/';const AM=fs.readFileSync(P+'Alternate_Merge.js','utf8');const GBc=fs.readFileSync(P+'Gate_Build.js','utf8');const GRc=fs.readFileSync(P+'Gate_Record.js','utf8');
const libOf=src=>src.slice(0,src.indexOf("let PP=$('Panel Cure Check')"));
const lib=libOf(AM);T('Alternate Merge library found',lib.length>100000);
const mk=(PB)=>new Function('$','$input',lib+'\nreturn {sbApply2024,gateItems2024,gateCure2024,gateAnsGround2024,sbKeyExempt2024,sbRoundsOf2024,ciRounds,gatePromptText2024,drvLinks,cureJText,rcLines};')(n=>{if(n==='Panel Build'&&PB)return {first:()=>({json:PB})};throw new Error('offline');},null);
const base=fs.readFileSync('pkgKCR/patched/Alternate_Merge.js','utf8');const lib1=base.slice(0,base.indexOf("const PP=$('Panel Cure Check')"));
const M1=new Function('$','$input',lib1+'\nreturn {sbApply2024};')(()=>{throw new Error('offline');},null);
// 1. the library nodes carry the same library
T('Gate Build and Gate Record carry the Alternate Merge library',GBc.startsWith(lib)&&GRc.startsWith(lib));
// 2. E-APPLY v2 against v1 on every stored seat: the same, except where a 2251 keystone rule decides
const ctxOf=(M,PB,seat)=>{const j=PB&&PB.judges.find(q=>q.seat===seat);const PT=j?M.gatePromptText2024(j.body):'';return {R:PT?M.ciRounds(PT):null,DL:PT?M.drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};};
const seen=[];
for(const r of runs){const M=mk(r.PB);for(const b of r.bodies){const its=r.SB.filter(x=>x.seat===b.seat&&x.run===b.run);if(!its.length)continue;const ctx=ctxOf(M,r.PB,b.seat);
 const a=M1.sbApply2024(b.seat,b.verdict_raw,b.fields,its);const c=M.sbApply2024(b.seat,b.verdict_raw,b.fields,its,ctx.R);
 const same=JSON.stringify(a.applied)===JSON.stringify(c.applied)&&JSON.stringify(a.fields)===JSON.stringify(c.fields)&&a.result===c.result&&a.items.length===c.items.length;
 T('E-APPLY v2 = v1 on '+b.run+' '+b.seat+' (applied '+c.applied.length+', items '+c.items.length+')',same,JSON.stringify({v1:[a.applied,a.items.map(z=>z.sid+' '+z.kind)],v2:[c.applied,c.items.map(z=>z.sid+' '+z.kind)]}));
 const G=M.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx);G.items.forEach(x=>seen.push(b.run+' '+b.seat+' '+x.gid+' '+x.kind+' '+x.src+(x.live?'':' record-only')));}}
console.log('   gate items on the stored runs:\n     '+seen.join('\n     '));
// 3. item B fires: exactly the three read by hand
const BX=seen.filter(s=>/E-GATE B/.test(s));T('item B fires 3 times',BX.length===3,BX.join('; '));
T('item B fires on 32980 gemini (W3 2243 expectation: D5, Galatians 4:4)',BX.some(s=>/^32980 gemini/.test(s)));
T('item B fires on 32949 grok and 32973 grok (Matthew 1:25)',BX.some(s=>/^32949 grok/.test(s))&&BX.some(s=>/^32973 grok/.test(s)));
// 4. keystone rule 1 (2251)
{const r=runs[1];const M=mk(r.PB);const R=ctxOf(M,r.PB,'grok').R;const P0=M.rcLines('');
 const k15='KEYSTONE: D6 -- BROKEN -- GROUND: [CR3] "I grant loins reach descendants across generations through begetters" and "I do not claim a row names Mary\'s house," against Acts 2:30.';
 T('rule 1: grok S15 names [CR3] (the defender\'s round 3, where the grant stands): exempt',M.sbKeyExempt2024(k15,P0,R));
 T('rule 1: the same quote named [DR3] (a challenger round, where it does not stand) is not exempt',!M.sbKeyExempt2024(k15.replace('[CR3]','[DR3]'),P0,R));
 T('rule 1: a [DR3] quote that is not a grant is not exempt',!M.sbKeyExempt2024('KEYSTONE: D6 -- BROKEN -- GROUND: [CR3] "Neither verse routes the seed through a father at the last step."',P0,R));
 T('rule 1: without the rounds nothing is exempt',!M.sbKeyExempt2024(k15,P0,null));
 const P1=M.rcLines('CONCEDED LINKS: 1 -- Premise 2 is conceded (stated) as the defender dropped its span.');
 T('rule 1: a GROUND naming a premise the CONCEDED LINKS line counts is exempt',M.sbKeyExempt2024('KEYSTONE: D6 -- BROKEN -- GROUND: Premise 2 is conceded by the defender.',P1,null));
 T('rule 1: a premise the line does not count is not exempt',!M.sbKeyExempt2024('KEYSTONE: D6 -- BROKEN -- GROUND: Premise 4 is conceded.',P1,null));}
// 5. keystone rule 2: a change that leaves KEYSTONE BROKEN with a derived verdict not BROKEN is refused, even when rule 1 exempts it
{const M=mk(null);const raw='KEYSTONE: D2 -- BROKEN -- GROUND: Premise 2 is conceded.\nCONCEDED LINKS: 1 -- Premise 2 is conceded.\nD1 vs C1 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x.\nD2 vs C2 (Luke 1:34): UNDERDETERMINED -- GROUND: y.\nCLAUSE: BROKEN-1 n=2 w=0 k=1\nRESULT: CHALLENGER WINS';
 const F={verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',conceded_links:1,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
 const its=[{seat:'s',sid:'S1',ans:'CHANGE',line:'D1 vs C1 (Luke 1:35): DEFENDER LINK BROKEN -- GROUND: x.',to:'D1 vs C1 (Luke 1:35): UNDERDETERMINED -- GROUND: x.'}];
 const R=M.sbApply2024('s',raw,F,its,null);T('rule 2: KEYSTONE BROKEN left with no broken collision by a change is a CONTRADICTION; the change is refused',R.items.some(z=>z.kind==='CONTRADICTION'&&/derived/.test(z.why))&&!R.applied.includes('S1'),JSON.stringify(R.items));
 const its2=[{seat:'s',sid:'S1',ans:'CHANGE',line:'D2 vs C2 (Luke 1:34): UNDERDETERMINED -- GROUND: y.',to:'D2 vs C2 (Luke 1:34): DEFENDER LINK BROKEN -- GROUND: y.'}];
 const R2=M.sbApply2024('s',raw,F,its2,null);T('rule 2: a change that agrees with the keystone is applied',R2.applied.includes('S1')&&!R2.items.length,JSON.stringify(R2.items));}
// 5b. W3 2261 (b): the 32973 gemini S9 shape, a non-keystone collision changed to BROKEN under KEYSTONE STANDS, raises no item
{const r=runs[0];const M=mk(null);const b=r.bodies.find(x=>x.run==='32973'&&x.seat==='gemini');const its=r.SB.filter(x=>x.run==='32973'&&x.seat==='gemini');
 const s9=its.find(x=>x.sid==='S9');T('32973 gemini S9 changes D5 vs C5 to DEFENDER LINK BROKEN, and the KEYSTONE is D6 STANDS',s9&&/^D5 vs C5/.test(s9.to)&&/DEFENDER LINK BROKEN/.test(s9.to)&&/KEYSTONE\s*:\s*D6\s*--\s*STANDS/i.test(M.cureJText(b.verdict_raw,true)),s9&&s9.to.slice(0,120));
 const R=M.sbApply2024(b.seat,b.verdict_raw,b.fields,its,null);T('32973 gemini: S9 applied, no item, BROKEN-1',R.applied.includes('S9')&&!R.items.length&&R.tag==='BROKEN-1',JSON.stringify([R.applied,R.items,R.tag]));
 const raw='KEYSTONE: D6 -- STANDS -- GROUND: x.\nD5 vs C5 (Luke 3:23): UNDERDETERMINED -- GROUND: y.\nD6 vs C6 (Acts 2:30): CHALLENGER LINK BROKEN -- GROUND: z.\nCLAUSE: HELD-1 n=6 w=0 k=0\nRESULT: DEFENDER WINS';
 const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:0};
 const R2=M.sbApply2024('s',raw,F,[{seat:'s',sid:'S9',ans:'CHANGE',line:'D5 vs C5 (Luke 3:23): UNDERDETERMINED -- GROUND: y.',to:'D5 vs C5 (Luke 3:23): DEFENDER LINK BROKEN -- GROUND: y.'}],null);
 T('synthetic S9 shape: applied, no item, BROKEN-1',R2.applied.includes('S9')&&!R2.items.length&&R2.tag==='BROKEN-1',JSON.stringify([R2.items,R2.tag]));
 const R3=M.sbApply2024('s',raw,F,[{seat:'s',sid:'S1',ans:'CHANGE',line:'D6 vs C6 (Acts 2:30): CHALLENGER LINK BROKEN -- GROUND: z.',to:'D6 vs C6 (Acts 2:30): DEFENDER LINK BROKEN -- GROUND: z.'}],null);
 T('rule 0 still refuses the keystone\'s own collision broken under KEYSTONE STANDS',R3.items.some(z=>z.kind==='CONTRADICTION')&&!R3.applied.includes('S1'),JSON.stringify(R3.items));}
// 6. the two nodes, end to end, on 32980 (gemini B item; grok keystone pair)
const r=runs[1];const bodies=r.bodies.map(b=>JSON.stringify({payload:{judge_seat:b.seat,verdict_raw:b.verdict_raw,...b.fields,drv_uncured:0}}));
const SBB=r.bodies.filter(b=>r.SB.some(x=>x.seat===b.seat)).map(b=>{const j=r.PB.judges.find(q=>q.seat===b.seat);return {seat:b.seat,api_model:j.body.model,run_token:r.PB.run_token,body:j.body,items:[]};});
const SBC=SBB.map(x=>({choices:[{message:{content:'SENDBACK: S1 || KEEP || stored reply'}}]}));
const SBR={bodies,alt_needed:false,sb_items:r.SB,summary:r.bodies.map(b=>({seat:b.seat}))};
const nodes=(extra)=>n=>{const t={'Panel Build':{first:()=>({json:r.PB})},'Send Back Build':{all:()=>SBB.map(json=>({json}))},'Send Back Call openrouter':{isExecuted:true,all:()=>SBC.map(json=>({json}))},'Send Back Record':{first:()=>({json:SBR})},'Panel Cure Check':{first:()=>({json:{bodies}})},...extra}[n];if(!t)throw new Error('no node '+n);return t;};
const GB=new Function('$','$input',GBc)(nodes({}),{first:()=>({json:SBR})});
T('Gate Build: two calls (gemini, grok)',GB.length===2&&GB[0].json.seat==='gemini'&&GB[1].json.seat==='grok',GB.map(x=>x.json.seat+':'+(x.json.items||[]).length).join(','));
const gi=s=>GB.find(x=>x.json.seat===s).json;
T('Gate Build: gemini G1 is the B item, grok G1 and G2 the keystone pair',gi('gemini').items.length===1&&gi('gemini').items[0].src==='E-GATE B'&&gi('grok').items.map(x=>x.src).join()==='E-APPLY S14,E-APPLY S15');
T('Gate Build: the request continues the send-back conversation and states the forms',(()=>{const m=gi('grok').body.messages;return m[m.length-2].role==='assistant'&&m[m.length-2].content===SBC[1].choices[0].message.content&&/GATE: <item id> \|\| CHANGE TO:/.test(m[m.length-1].content)&&/ITEM G2/.test(m[m.length-1].content);})());
const d5=gi('gemini').items[0].lines[1];const d6=gi('grok').items[0].lines.find(l=>/^D6 vs C6/.test(l));
const run=(replies,err)=>{const R=replies.map(t=>err?{error:{message:'timeout'}}:{choices:[{message:{content:t}}]});return new Function('$','$input',GRc)(nodes({'Gate Build':{all:()=>GB}}),{all:()=>R.map(json=>({json}))})[0].json;};
const du=(o,s)=>JSON.parse(o.bodies.find(b=>JSON.parse(b).payload.judge_seat===s)).payload.drv_uncured;
const d5to=d5.replace(/CHALLENGER LINK BROKEN \(Commitment 3\)/,'UNDERDETERMINED');const M0=mk(null);const d6to=M0.cureJText(r.bodies.find(b=>b.seat==='grok').verdict_raw,true).split('\n').find(l=>/^D6 vs C6/.test(l)&&/DEFENDER LINK BROKEN/.test(l)); /* grok answers by restoring its first D6 vs C6 line */
T('the gate shows grok its D6 vs C6 line as S14 rewrote it (STANDS)',/STANDS/.test(d6)&&!!d6to);
{const o=run(['GATE: G1 || CHANGE TO: '+d5to+' || the press on Galatians 4:4 stands.','GATE: G1 || CHANGE TO: '+d6to+' || "I grant loins reach descendants across generations through begetters"\nGATE: G2 || KEEP || the keystone stays BROKEN.']);
 T('Gate Record: gemini changes D5 to UNDERDETERMINED: cured, nothing counted',du(o,'gemini')===0&&o.gate_rows.filter(x=>x.seat==='gemini').every(x=>x.cure_status==='CURED'),JSON.stringify(o.gate.seats));
 T('Gate Record: grok keeps D6 vs C6 BROKEN (G1), so its KEYSTONE BROKEN change S15 now applies and G2 KEEP is cleared by that change',du(o,'grok')===0,JSON.stringify(o.gate_rows.filter(x=>x.seat==='grok').map(x=>x.item+' '+x.cure_status+' '+x.cure_reason.slice(-160))));
 T('Gate Record: no seat counted, alt_needed stays false',o.alt_needed===false);
 T('Gate Record: the gate changes join sb_items for Alternate Merge',o.sb_items.length===r.SB.length+2&&o.sb_items.slice(-2).every(x=>/^G\d$/.test(x.sid)&&x.ans==='CHANGE'));}
{const o=run(['GATE: G1 || KEEP || "made of a woman" is the ground.','']);
 T('Gate Record: gemini KEEP on a CONTRADICTION: uncured, drv_uncured 1',du(o,'gemini')===1);
 T('Gate Record: grok silent on G1 and G2: both uncured, drv_uncured 2 (silence counts)',du(o,'grok')===2);
 T('Gate Record: alt_needed true',o.alt_needed===true);
 T('Gate Record: one log row per item, kind gate, the full reply on the first row only',o.gate_rows.length===3&&o.gate_rows.every(x=>x.kind==='gate')&&o.gate_rows.filter(x=>x.full_reply).length===1);
 T('Gate Record: the AUDIT v38 lines are in the bodies',JSON.parse(o.bodies[0]).payload.verdict_raw.includes('[AUDIT v38: E-GATE'));}
{const o=run(['x','y'],true);T('Gate Record: a failed call is recorded and not counted',du(o,'gemini')===0&&du(o,'grok')===0&&o.gate_rows.every(x=>/the gate call failed/.test(x.cure_reason)&&/RECORD-ONLY/.test(x.cure_reason)));}
{const o=run(['GATE: G1 || CHANGE TO: Remove the D5 line. || no.','']);T('Gate Record: a CHANGE with no line form is not applied: uncured',du(o,'gemini')===1);}
{const o=run(['**GATE: ITEM G1** || CHANGE TO: '+d5to+' || folded.','']);T('Gate Record: the reader folds bold, ITEM and spacing',du(o,'gemini')===0);}
// 7. skip path
{const S={...SBR,sb_items:[]};const g=new Function('$','$input',GBc)(nodes({}),{first:()=>({json:S})});T('Gate Build: no send-back answers -> skip',g.length===1&&g[0].json.gate_skip===true);
 const o=new Function('$','$input',GRc)(nodes({'Gate Build':{all:()=>g},'Send Back Record':{first:()=>({json:S})}}),{all:()=>g})[0].json;T('Gate Record: skip passes Send Back Record on unchanged, with gate.skipped',o.gate.skipped===true&&o.bodies===S.bodies&&o.alt_needed===false);}
// 8. Alternate Merge edits
T('Alternate Merge: reads Gate Record bodies, sb_items and gate_rows, and passes the rounds to E-APPLY',AM.includes("PP={...PP,bodies:GR.bodies}")&&AM.includes("SBI=$('Gate Record').first().json.sb_items||SBI")&&AM.includes("gate_rows||[]).forEach(x=>enforcer_log.push(x))")&&AM.includes("sbApply2024(sm.seat,b.payload.verdict_raw,F0,its,sbRoundsOf2024(sm.seat))"));
{const M=mk(r.PB);const R=M.sbRoundsOf2024('grok');T('sbRoundsOf2024 reads the 8 rounds from Panel Build',R&&Object.keys(R).length===8);}
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
