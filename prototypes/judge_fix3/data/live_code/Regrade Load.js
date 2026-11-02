// REGRADE (operator ruling 2026-10-09): load the saved run for a panel re-judging. Fails closed; nothing is written here.
const S=$('Init Seats').first().json;const TOK=S.run_token;const RT=' run_token='+TOK;
const rows=$('Regrade Row').all().map(i=>i.json).filter(r=>r&&r.id);
if(rows.length!==1)throw new Error('REGRADE refused: expected exactly 1 saved row for this run token, found '+rows.length+'.'+RT);
const r=rows[0];
if(r.variant!=='ORACLE_DEBATE_V1')throw new Error('REGRADE refused: the saved row is not an ORACLE_DEBATE_V1 run.'+RT);
if(String(r.topic)!==String(S.topic))throw new Error('REGRADE refused: the request topic differs from the saved topic.'+RT);
if(r.defender_engine!==S.defender.engine||r.defender_profile!==S.defender.profile||r.challenger_engine!==S.challenger.engine||r.challenger_profile!==S.challenger.profile)throw new Error('REGRADE refused: the request seats differ from the saved seats.'+RT);
const pe=(r.panel_expected||[]).slice().sort().join(',');if(pe!==S.panel_expected.join(','))throw new Error('REGRADE refused: saved panel ['+pe+'] differs from the derived panel ['+S.panel_expected.join(',')+'].'+RT);
const judged=$('Regrade Judgments').all().map(i=>i.json).filter(j=>j&&j.debate_id);
if(judged.length&&S.dry!==true)throw new Error('REGRADE refused: '+judged.length+' panel judgments already exist for this debate; a re-judging would replace them.'+RT);
const f={topic:r.topic,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
['cr1','gr1','cr2','gr2','cr3','dr3'].forEach(k=>{if(!f[k]||String(f[k]).trim()==='')throw new Error('REGRADE refused: the saved round '+k+' is empty.'+RT);});
if(!r.synthesis||String(r.synthesis).trim()==='')throw new Error('REGRADE refused: the saved synthesis is empty.'+RT);
// Same role line as Init with Guards builds for the live run.
// ORDER K (BB-6218, ruling BB-6221 (2)(ii)): the named lists rebuilt from today's corpus: the served conclusions and sights as
// fetched now (Regrade Served Conclusions, Regrade Served Sights), and today's guards and tensions from Resolve Seats. Old runs are
// read against today's text, not the text served then, and their link notes are not stored: the lists are approximate for them.
const NAMED=(txt,served)=>{const T=String(txt||'');const sv=new Set(served||[]);const out=[];const add=l=>{if(!sv.has(l)&&out.indexOf(l)<0)out.push(l);};let m;
 const rc=/(?:\bConclusions?\s*#?\s*|#)(\d{1,4}(?:\s*(?:,|and|&)\s*#?\d{1,4})*)\b/gi;while((m=rc.exec(T))!==null){for(const n of m[1].match(/\d{1,4}/g))add('#'+n);}
 const rs=/\b(?:S-|Sights?\s*#?\s*)(\d{1,4}(?:\s*(?:,|and|&)\s*(?:S-)?\d{1,4})*)\b/gi;while((m=rs.exec(T))!==null){for(const n of m[1].match(/\d{1,4}/g))add('S-'+n);}
 return out.sort((a,b)=>(a[0]===b[0]?0:(a[0]==='#'?-1:1))||(+a.replace(/\D/g,''))-(+b.replace(/\D/g,'')));};
const RSV=$('Resolve Seats').first().json;
const rgC=$('Regrade Served Conclusions').all().map(i=>i.json).filter(x=>x&&x.id!==undefined&&x.id!==null);
const rgS=$('Regrade Served Sights').all().map(i=>i.json).filter(x=>x&&x.sight_number!==undefined&&x.sight_number!==null);
const rgText=rgC.map(x=>String(x.conclusion_text||'')).concat(rgS.map(x=>(String(x.title||'')+' — '+String(x.summary||'')).slice(0,300))).join('\n')+'\n'+(RSV.gt||'')+'\n'+(RSV.tt||'');
const dSv=Array.isArray(r.defender_served)?r.defender_served:[];const cSv=Array.isArray(r.challenger_served)?r.challenger_served:[];
const ig={posline:'Roles this debate: DEFENDER = opened, holding '+S.dpos+' of the topic; CHALLENGER = answered second, holding '+S.cpos+'.',d_served:dSv,c_served:cSv,d_named:r.defender_profile==='oracle'?NAMED(rgText,dSv):[],c_named:r.challenger_profile==='oracle'?NAMED(rgText,cSv):[]};
$execution.customData.set('debate_id',String(r.id));
return [{json:{run_token:TOK,debate_id:r.id,f,synthesis:r.synthesis,ig}}];
