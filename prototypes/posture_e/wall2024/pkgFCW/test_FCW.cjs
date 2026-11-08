// pkgFCW test (W2, 11-08). Run from wall2024/: node pkgFCW/test_FCW.cjs
// (1) Replay the three cure merges, strip_RI2 vs strip_FCW, on every saved run: Panel Cure Check, Alternate Merge Seat, Cure Check. List every seat whose
//     text changes: each change must be exactly one FORCED line inserted after its collision line, for a K-G4 item CURED "forced link".
// (2) 33506: Send Back Record's stored bodies replaced by the FCW Panel Cure Check bodies, then Gate Build (strip_FCW): grok S9-S11 must no longer be
//     NOT APPLIED "the flagged line is not in the judge text".
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const A=n=>fs.readFileSync('pkgLIB/strip_RI2/patched/'+n+'.js','utf8'),B=n=>fs.readFileSync('pkgLIB/strip_FCW/patched/'+n+'.js','utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Panel_Cure_Check\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const texts=(node,j)=>{if(node==='Cure Check')return [['single',j.independent_verdict_raw]];return (j.bodies||[]).map(s=>{try{const b=JSON.parse(s);return [b.payload.judge_seat,b.payload.verdict_raw];}catch(e){return null;}}).filter(Boolean);};
const diffLines=(a,b)=>{const x=String(a).split(/\n|\\n/),y=String(b).split(/\n|\\n/);const ins=y.filter((l,i)=>!x.includes(l));const del=x.filter(l=>!y.includes(l));return {ins,del};};
let n=0,changed=0,wrong=0,err=0,skip=0;const seen=[];
for(const [node,fd,file] of [['Panel Cure Check','Panel Cure Normalize 3','Panel_Cure_Check'],['Alternate Merge Seat','Alternate Cure Normalize','Alternate_Merge_Seat'],['Cure Check','Cure Normalize','Cure_Check']]){
 for(const R of runs){if(!fs.existsSync(D+R+'_'+file+'.json'))continue;let a,b;try{a=harness(R)(A(file),fd);}catch(e){skip++;log('   '+node+' '+R+' skipped: the base node fails on this saved input too ('+String(e.message).slice(0,60)+')');continue;}try{b=harness(R)(B(file),fd);}catch(e){err++;log('   '+node+' '+R+' error '+String(e.message).slice(0,80));continue;}n++;
  const ta=texts(node,a[0].json),tb=texts(node,b[0].json);
  ta.forEach(([seat,t],k)=>{const u=tb[k]&&tb[k][1];if(t===u)return;changed++;const d=diffLines(t,u);const okc=d.del.length===0&&d.ins.length>=1&&d.ins.every(l=>/^FORCED\b/.test(l.replace(/^\s+/,'')));if(!okc)wrong++;
   seen.push(node+' '+R+' '+seat);log('   '+node+' '+R+' '+seat+': +'+d.ins.length+' line(s)'+(okc?'':' UNEXPECTED (-'+d.del.length+')'));d.ins.forEach(l=>log('       + '+l.slice(0,150)));});
  const oa=JSON.stringify({...a[0].json,bodies:null,independent_verdict_raw:null,enforcer_log:null}),ob=JSON.stringify({...b[0].json,bodies:null,independent_verdict_raw:null,enforcer_log:null});if(oa!==ob){wrong++;log('   '+node+' '+R+': a field other than the judge text changed');}}}
log('replay: '+n+' node runs, '+changed+' seat texts changed, '+err+' errors, '+skip+' skipped (base fails)');
T(err===0&&n>=30,'replay ran with no errors ('+n+')');T(wrong===0,'every change is FORCED line(s) inserted, nothing removed, no other field changed');
T(seen.includes('Panel Cure Check 33506 grok'),'33506 grok gets its FORCED lines');
// (2) 33506 downstream: Gate Build sees grok's FORCED lines
{const pcc=harness('33506')(B('Panel_Cure_Check'),'Panel Cure Normalize 3')[0].json;const sbr=JSON.parse(fs.readFileSync(D+'33506_Send_Back_Record.json'))[0].data.main[0];
 const by={};pcc.bodies.forEach(s=>{const b=JSON.parse(s);by[b.payload.judge_seat]=b.payload.verdict_raw;});
 const sb=sbr.map(it=>{const j=JSON.parse(JSON.stringify(it.json));j.bodies=(j.bodies||[]).map(s=>{const b=JSON.parse(s);if(by[b.payload.judge_seat]!=null&&b.payload.judge_seat==='grok'){const old=b.payload.verdict_raw;const tail=old.slice(old.indexOf('\n\n[AUDIT'));const nb=by.grok;b.payload.verdict_raw=nb.slice(0,nb.indexOf('\n\n[AUDIT')>=0?nb.indexOf('\n\n[AUDIT'):nb.length)+(tail.startsWith('\n\n[AUDIT')?tail:'');}return JSON.stringify(b);});return {json:j};});
 const ga=harness('33506',{'Send Back Record':sbr})(A('Gate_Build'),'Send Back Record'),gb=harness('33506',{'Send Back Record':sb})(B('Gate_Build'),'Send Back Record');
 const na=JSON.stringify(ga).match(/S(?:9|10|11)[^}]{0,80}the flagged line is not in the judge text/g)||[];const nb=JSON.stringify(gb).match(/S(?:9|10|11)[^}]{0,80}the flagged line is not in the judge text/g)||[];
 log('   33506 Gate Build grok S9-S11 "not in the judge text": base '+na.length+', FCW '+nb.length);T(na.length>0&&nb.length===0,'33506 grok S9-S11 are no longer NOT APPLIED for a missing line');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgFCW/test_FCW.txt',out.join('\n')+'\n');
