// pkgG4L test. Run from wall2024/: node pkgG4L/test_G4L.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const P=JSON.parse(rd('pkgG4L/plan_G4L.json'));T('19 nodes carry cureAsk',P.nodes.length===19);
const lib=f=>{const s=rd(f);const a=s.indexOf('function g4Label2024');const fn=s.slice(a,s.indexOf('\n',s.indexOf("counts against your seat (LIVE rule).]';}",a))+1);const dw=s.match(/const DRV_WORDS=[^;]*;/)[0];return new Function(dw+'\n'+fn+'\nreturn {g4Label2024,DRV_WORDS};')();};
for(const n of P.nodes){const b=rd('pkgKIND/final/'+n.file),s=rd('pkgG4L/patched/'+n.file);T(n.name+': shas match',sha(b)===n.base_sha&&sha(s)===n.final_sha);
 let p=true;try{new Function('$','$input',s);}catch(e){p=false;}T(n.name+': parses',p);
 const L=lib('pkgG4L/patched/'+n.file);T(n.name+': the label is printed only on K-G4 items',/\(x\.rule==='K-G4'\?g4Label2024\(x\):''\)/.test(s)&&!L.g4Label2024({line:'D1 vs C1: BROKEN -- GROUND: x unanswered'}).includes('MEANING'));}
// the cure check's class (ruling 421) on the 9 uncured K-G4 items of 32985, and the label each would carry
const PCC=rd('pkgG4L/patched/Panel_Cure_Check.js');T('the cure check classes K-G4 by the same DRV_WORDS test',/const __mb421=!DRV_WORDS\.test\(String\(x\.line\|\|''\)\)/.test(PCC));
const L=lib('pkgG4L/patched/Panel_Cure_Build_1.js');const B=JSON.parse(rd('/mnt/project-files/wall2024/enforcer_log_body_32985.json'));const rows=(Array.isArray(B)?B:(B.p_rows||B.rows)).filter(r=>r.rule==='K-G4'&&r.cure_status==='UNCURED');
T('32985 has 9 uncured K-G4 items',rows.length===9);
for(const r of rows){const line=String(r.flagged_line||'');const meaning=!L.DRV_WORDS.test(line);const lab=L.g4Label2024({line});
 T('32985 '+r.seat+' '+r.item+': engine class '+(meaning?'MEANING':'UNANSWERED-WITNESS')+', label agrees',meaning===lab.includes('MEANING BREAK'));
 console.log('     GROUND: '+(line.match(/GROUND:\s*([\s\S]{0,140})/)||[,line.slice(0,140)])[1]);console.log('     label: '+lab.slice(0,60)+' ...');}
// the label reaches the prompt: run cureAsk from Panel Cure Build 1 on one item of each class
{const s=rd('pkgG4L/patched/Panel_Cure_Build_1.js');const a=s.indexOf('function cureAsk(items,broken)');const e=s.indexOf('\n// The BROKEN links',a);
 const need="const CURE_RULE='R',CURE_RULE_G='G',CURE_FORM='F';"; /* the instruction constants are stubbed; only the item list is under test */
 const f=new Function(need+'\n'+s.match(/const DRV_WORDS=[^;]*;/)[0]+'\n'+s.slice(s.indexOf('const cureLabel='),s.indexOf('\n',s.indexOf('const cureLabel=')))+'\n'+s.slice(s.indexOf('// pkgG4L (W3 2291)'),e)+'\nreturn cureAsk;')();
 const t=f([{rule:'K-G4',link:'D2 vs C2',line:'D2 vs C2 (Isaiah 7:16): DEFENDER LINK BROKEN -- GROUND: The defender did not answer the pressed claim.'},{rule:'K-G4',link:'D3 vs C1',line:'D3 vs C1 (x): BROKEN -- GROUND: Luke 1:34 left unanswered in [CR3].'}],{});
 T('cureAsk prints a MEANING BREAK label on the first and an UNANSWERED-WITNESS label on the second',/K-G4 D2 vs C2: [^\n]*\[MEANING BREAK:/.test(t)&&/K-G4 D3 vs C1: [^\n]*\[UNANSWERED-WITNESS BREAK:/.test(t));}
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
