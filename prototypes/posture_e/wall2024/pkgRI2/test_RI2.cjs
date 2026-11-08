// pkgRI2 test (W2, 11-08). Run from wall2024/: node pkgRI2/test_RI2.cjs
// Replays Extract Independent Verdict, v19_GDA (strip_GDA19) against pkgRI2 (strip_RI2), on every saved run, with each verdict text the run holds as its input:
// the independent verdict (Verdict Normalizer), each panel judge (Panel Judges Collect, or Panel Judge k openrouter), and each alternate (Alternate Call openrouter).
// Every output field that differs is listed with the line that decides it. The other 21 library sources must be byte-identical.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const A=fs.readFileSync('pkgLIB/strip_GDA19/patched/Extract_Independent_Verdict.js','utf8'),B=fs.readFileSync('pkgLIB/strip_RI2/patched/Extract_Independent_Verdict.js','utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const others=fs.readdirSync('pkgLIB/strip_GDA19/patched').filter(f=>f!=='Extract_Independent_Verdict.js');
T(others.every(f=>fs.readFileSync('pkgLIB/strip_GDA19/patched/'+f,'utf8')===fs.readFileSync('pkgLIB/strip_RI2/patched/'+f,'utf8')),'the other '+others.length+' library sources are byte-identical to strip_GDA19');
const rd=f=>{try{return JSON.parse(fs.readFileSync(D+f))[0].data.main[0];}catch(e){return null;}};
const content=j=>{const r=j&&(j.response||j);const c=r&&r.choices&&r.choices[0]&&r.choices[0].message&&r.choices[0].message.content;if(typeof c!=='string')return null;
 const s=c.trim().replace(/^```[a-zA-Z]*\s*/,'').replace(/```\s*$/,'');const a=s.indexOf('{');if(a>=0){try{const o=JSON.parse(s.slice(a,s.lastIndexOf('}')+1));if(o&&typeof o.reasoning==='string')return o.reasoning;}catch(e){}}return c;};
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Extract_Independent_Verdict\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const F=['verdict_tag','defense_standing','conceded_links','challenge_standing','challenger_conceded_links','keystone_link','keystone_state','out_of_round_concessions','challenger_chain_mark','defender_chain_mark','data_class','audit_flags','void_links','challenger_void_links'];
let n=0,texts=0,diffs=0,err=0;const flips=[];
for(const R of runs){const src=[];const vn=rd(R+'_Verdict_Normalizer.json');if(vn)src.push(['independent',content(vn[0].json)]);
 const pc=rd(R+'_Panel_Judges_Collect.json');if(pc)pc.forEach((x,k)=>src.push(['panel '+(k+1),content(x.json)]));else for(const k of [1,2,3]){const p=rd(R+'_Panel_Judge_'+k+'_openrouter.json');if(p)src.push(['panel '+k,content(p[0].json)]);}
 const al=rd(R+'_Alternate_Call_openrouter.json');if(al)al.forEach((x,k)=>src.push(['alternate '+(k+1),content(x.json)]));
 n++;for(const [who,t] of src){if(typeof t!=='string')continue;texts++;const inp=[{json:{choices:[{message:{content:t},finish_reason:'stop'}]}}];let a,b;
  try{a=harness(R,{'Verdict Normalizer':inp})(A,'Verdict Normalizer')[0].json;b=harness(R,{'Verdict Normalizer':inp})(B,'Verdict Normalizer')[0].json;}catch(e){err++;log('   '+R+' '+who+': error '+String(e.message).slice(0,90));continue;}
  const d=F.filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));const ra=String(a.independent_verdict_raw).slice(t.length),rb=String(b.independent_verdict_raw).slice(t.length);
  const ma=ra.split('\n').filter(l=>/^\[/.test(l)),mb=rb.split('\n').filter(l=>/^\[/.test(l));const gone=ma.filter(l=>!mb.includes(l)),added=mb.filter(l=>!ma.includes(l));
  if(!d.length&&!gone.length&&!added.length&&JSON.stringify(a.debate_rule_violations)===JSON.stringify(b.debate_rule_violations))continue;diffs++;
  flips.push({run:R,who,fields:d.map(k=>k+': '+JSON.stringify(a[k])+' -> '+JSON.stringify(b[k])),gone,added,drv:JSON.stringify(a.debate_rule_violations)!==JSON.stringify(b.debate_rule_violations)});}}
log('replay: '+n+' runs, '+texts+' verdict texts, '+diffs+' texts with any change, '+err+' errors');
for(const f of flips){log('-- '+f.run+' '+f.who+(f.drv?' (debate_rule_violations changed)':''));f.fields.forEach(x=>log('     field '+x));f.gone.forEach(x=>log('     mark gone:  '+x.slice(0,230)));f.added.forEach(x=>log('     mark added: '+x.slice(0,230)));}
const cls=l=>/COLLISION POINTS ENTRY NOT READ: "D\d+ VS C\d+[^"]*: STANDS\b/.test(l)||/COLLISION POINTS CARRIES NO ENTRY FOR D\d+/.test(l)||/^\[AUDIT v18 COLLISION MAP:/.test(l)||/^\[AUDIT FLAGS:/.test(l);
T(flips.every(f=>!f.drv&&f.fields.every(x=>/^audit_flags:/.test(x))&&f.gone.every(cls)&&f.added.every(l=>/^\[AUDIT v18 COLLISION MAP:|^\[AUDIT FLAGS:/.test(l))),'every change is one class: a "D<i> vs C<j> (verse): STANDS" collision line the old read refused is now read STANDS (its ENTRY NOT READ and NO ENTRY flags go, the map and flag count follow); no stored verdict field other than audit_flags changes');
T(n>=20&&texts>=60,'replay ran ('+n+' runs, '+texts+' texts)');T(err===0,'no errors');
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRI2/test_RI2.txt',out.join('\n')+'\n');
