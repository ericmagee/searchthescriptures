// pkgKS test. Run from wall2024/ after pkgKS/build_KS.py: node pkgKS/test_KS.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgKS/plan_KS.json'));
T('22 nodes: base and final shas match the plan',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgFC/patched/'+n.file))===n.base_sha&&sha(rd('pkgKS/patched/'+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgKS/patched/'+n.file));return true;}catch(e){console.log('   '+n.file+': '+e.message);return false;}}));
T('the 6 gate-library nodes carry all 7 edits, the 13 other cure-library nodes 6, the 3 payload/verdict nodes 5',plan.nodes.filter(n=>n.edits.length===7).length===6&&plan.nodes.filter(n=>n.edits.length===6).length===13&&plan.nodes.filter(n=>n.edits.length===5).length===3);
const cut=t=>t.slice(0,t.indexOf("const AM=$('Alternate Merge Seat')"));
const mk=f=>new Function('$','$input',cut(rd(f))+'\nreturn {drvCheck,kfLines,__kfHas,cureVerdicts,gateForced2024,gateRead2024,cureJText};')(()=>{throw new Error('offline');},null);
const B=mk('pkgFC/patched/Alternate_Merge.js'),N=mk('pkgKS/patched/Alternate_Merge.js');
// 1. grok 33020 G2: its DEFENDER LINK BROKEN line beside its own FORCED line that breaks the challenger (MEANS [CR3])
const L='D1 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost" [L3] Matthew 1:24 "took unto him his wife" -- the [CR3] answer "So Matthew 1:18 finds her with child before the union" misses the pressed meaning that the finding is dated before the taking, so the press stands against D1 -- GROUND: an unanswered press of the taking-date stands for the challenger. (Commitment 3)';
const F='FORCED: D1 vs C2 -- MEANS [CR3]: "the pregnancy was found before the marital union" -- ANSWER [DR3]: "So 1:18 dates the finding before the taking into his house, inside the espousal. That is where my link places the knowing. It fits the link." -- FAILS: "That is where my link places the knowing."';
const run=(M,t)=>M.drvCheck(t,1,0,'PROP-DEPENDENT','SELF-SUPPORTED',false,[]).items.map(x=>x.rule+' '+x.side+' '+x.link);
T('base (pkgFC, as live): grok 33020 G2 line raises nothing beside its FORCED line',run(B,L+'\n'+F).length===0,JSON.stringify(run(B,L+'\n'+F)));
T('pkgKS: grok 33020 G2 line raises K-G4 DEFENDER D1 vs C2 (the FORCED line breaks the challenger)',run(N,L+'\n'+F).includes('K-G4 DEFENDER D1 vs C2'),JSON.stringify(run(N,L+'\n'+F)));
const LC=L.replace('DEFENDER LINK BROKEN','CHALLENGER LINK BROKEN');
{const r=N.drvCheck(LC+'\n'+F,1,0,'PROP-DEPENDENT','PROP-DEPENDENT',false,[]).items.map(x=>x.rule+' '+x.side+' '+x.link);T('pkgKS: the same line graded CHALLENGER LINK BROKEN is still exempt by that FORCED line',!r.some(z=>/^K-G[14] /.test(z)),JSON.stringify(r));}
T('pkgKS: a FORCED line with MEANS [DR2] exempts a DEFENDER LINK BROKEN line',run(N,L+'\n'+F.replace('MEANS [CR3]','MEANS [DR2]').replace('ANSWER [DR3]','ANSWER [CR3]')).length===0);
// 2. the K-G4 cure: a FORCED line in the reply for the other side does not cure
{const x={rule:'K-G4',side:'DEFENDER',link:'D1 vs C2',line:L};const vb=B.cureVerdicts([x],{ok:true,text:'RESPONSE: K-G4 D1 vs C2 | NOT HELD: the link cannot take the witness meaning, as the FORCED line shows.\n'+F},{},{})[0],vn=N.cureVerdicts([x],{ok:true,text:'RESPONSE: K-G4 D1 vs C2 | NOT HELD: the link cannot take the witness meaning, as the FORCED line shows.\n'+F},{},{})[0];
 T('K-G4 cure: base cures a DEFENDER item with a FORCED line that breaks the challenger',vb.status==='CURED',vb.why);
 T('K-G4 cure: pkgKS does not',vn.status!=='CURED'||!/forced link/.test(vn.why),vn.status+' '+vn.why);
 const F2=F.replace('MEANS [CR3]','MEANS [DR2]').replace('ANSWER [DR3]','ANSWER [CR3]');const v2=N.cureVerdicts([x],{ok:true,text:'RESPONSE: K-G4 D1 vs C2 | NOT HELD: the link cannot take the witness meaning, as the FORCED line shows.\n'+F2},{},{})[0];
 T('K-G4 cure: pkgKS cures it with a FORCED line that breaks the defender (MEANS [DR2])',v2.status==='CURED'&&/forced link/.test(v2.why),v2.why);}
// 3. kfLines "no FORCED line": the other side's FORCED line does not count
{const KG='D1 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- GROUND: the link cannot take that meaning.';const R={CR3:'x the pregnancy was found before the marital union x',DR3:'So 1:18 dates the finding before the taking into his house, inside the espousal. That is where my link places the knowing. It fits the link.'};
 const kb=B.kfLines(KG+'\n'+F,R).items.filter(z=>z.why==='no FORCED line').length,kn=N.kfLines(KG+'\n'+F,R).items.filter(z=>z.why==='no FORCED line').length;
 T('K-F: base finds the challenger-side FORCED line enough for a DEFENDER forced break; pkgKS raises "no FORCED line"',kb===0&&kn===1,kb+' '+kn);}
// 4. gateForced2024: a FORCED line for the other side does not cure a RULE K-G4 gate item
{const x={gid:'G1',kind:'RULE K-G4',key:'RULE|K-G4|DEFENDER|D1 VS C2'};const a=N.gateRead2024('GATE: G1 || KEEP || '+F).G1;const g=N.gateForced2024(x,a,{R:{}});
 T('gate: a FORCED line that breaks the challenger does not cure a DEFENDER RULE K-G4 item, and says why',g&&!g.cured&&/breaks the challenger link/.test(g.why),JSON.stringify(g));}
// 5. replay: drvCheck and kfLines on the 35 stored judgments that hold a FORCED line (debate_judgments, every run in the log)
const FX=JSON.parse(rd('pkgKS/fixture_judgments_forced.json'));const ch=[];
for(const j of FX){const t=B.cureJText?B.cureJText(j.raw,true):String(j.raw).replace(/\\n/g,'\n');
 const a=B.drvCheck(t,j.dc,j.cc,j.ds,j.cs,false,[]).items.map(x=>x.rule+' '+(x.side||'')+' '+(x.link||'')).sort(),b=N.drvCheck(t,j.dc,j.cc,j.ds,j.cs,false,[]).items.map(x=>x.rule+' '+(x.side||'')+' '+(x.link||'')).sort();
 const ka=B.kfLines(t,{}).items.map(x=>x.link+' '+x.why).sort(),kb=N.kfLines(t,{}).items.map(x=>x.link+' '+x.why).sort();
 const add=b.filter(z=>!a.includes(z)),rem=a.filter(z=>!b.includes(z)),kadd=kb.filter(z=>!ka.includes(z)),krem=ka.filter(z=>!kb.includes(z));
 if(add.length||rem.length||kadd.length||krem.length)ch.push('judgment '+j.id+' '+j.seat+' (debate '+j.debate+'): drvCheck +['+add.join('; ')+'] -['+rem.join('; ')+'] kfLines +['+kadd.join('; ')+'] -['+krem.join('; ')+']');}
console.log('   replay of '+FX.length+' stored judgments with a FORCED line; changes:\n     '+(ch.join('\n     ')||'none'));
T('replay: every change only adds an item (no exemption is gained)',ch.every(c=>/-\[\] kfLines \+\[[^\]]*\] -\[\]$/.test(c)));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
