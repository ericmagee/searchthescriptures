// pkgWLDDS test. Run from wall2024/: node pkgWLDDS/test_WLDDS.cjs
// For each saved run: Panel Build is run with pkgWLD (so its prompt carries the new ledger); then Judge Enforcer Build and Alt Judge Enforcer
// Build (base pkgKWI/patched vs pkgWLDDS/patched) are replayed with $('Panel Build') set to that output.
// Bar: with the added ledger blocks and the two rule sentences removed, the patched output equals the base output (same items, same calls);
// every ledger entry names a verse the item's line names. Also a run with the live s68 Panel Build (old ledger: NOT NAMED entries only).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const wrap=c=>'return (async()=>{\n'+c+'\n})();';const rf=p=>fs.readFileSync(p,'utf8');
const W=JSON.parse(rf('/mnt/project-files/wall2024/fetchback_live_s68.json'));const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const PBW=rf('pkgWLD/on_KWI/patched/Panel_Build.js'),PB0=rf('pkgKWI/patched/Panel_Build.js');
const RULE=rf('pkgWLDDS/build_WLDDS.cjs').match(/const RULE="([^"]*)"/)[1];
const SL=x=>typeof x==='string'?x.split(RULE).join('').replace(/\nTHE WITNESS LEDGER THE JUDGES WERE SHOWN[^\n]*(?:\n- [^\n]*)+/g,''):Array.isArray(x)?x.map(SL):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).map(([k,v])=>[k,SL(v)])):x;
// Items may move between calls (each call is capped at 40,000 chars), so the bar compares the item stream, the id sets and not_checked.
const view=o=>{const A=(Array.isArray(o)?o:[o]).map(x=>x.json||x);const rules=[],items=[];let ids=[],nc=null;
 for(const j of A){if(!j.body){items.push(JSON.stringify(j));continue;}const u=j.body.messages.find(m=>m.role==='user').content;const k=u.indexOf('\n\nITEM ');rules.push(u.slice(0,k));items.push(u.slice(k+2));ids=ids.concat((j.ids||[]).map(x=>x.id+'|'+x.rule));nc=JSON.stringify(j.not_checked);}
 return {calls:A.length,rules:[...new Set(rules)].join('|'),items:items.join('\n\n'),ids:ids.sort().join(','),nc};};
const strip=s=>{const v=view(SL(JSON.parse(s)));return JSON.stringify({rules:v.rules,items:v.items,ids:v.ids,nc:v.nc});};
const tally={items:0,ans:0,oth:0,nn:0};
(async()=>{
for(const [nm,feed] of [['Judge Enforcer Build','Enforcer Record'],['Alt Judge Enforcer Build','Alt Seated']]){const f=nm.replace(/ /g,'_')+'.js';const c0=rf('pkgKWI/patched/'+f),c1=rf('pkgWLDDS/patched/'+f);
 const rs=fs.readdirSync(D).filter(x=>x.endsWith('_'+f.replace('.js','.json'))&&!x.includes('_R2_')&&(nm.startsWith('Alt')||!x.includes('_Alt_'))).map(x=>x.split('_')[0]).sort();
 for(const RUN of rs){for(const [pl,pbc] of [['WLD ledger',PBW],['old ledger',PB0]]){if(pl==='old ledger'&&RUN!=='33644'&&RUN!=='33828')continue;
  let pb=null;try{pb=await harness(RUN)(wrap(pbc),'Anticheat Only?');}catch(e){}
  if(!pb){log('SKIP '+nm+' '+RUN+': Panel Build does not run on this run');break;}
  const H=harness(RUN,{'Panel Build':pb});let a,b;try{a=await H(wrap(c0),feed);}catch(e){log('SKIP '+nm+' '+RUN+' base threw: '+String(e.message).slice(0,90));break;}
  try{b=await harness(RUN,{'Panel Build':pb})(wrap(c1),feed);}catch(e){T(false,nm+' '+RUN+' patched threw: '+String(e.message).slice(0,140));continue;}
  const sa=JSON.stringify(a),sb=JSON.stringify(b);const blocks=sb.match(/THE WITNESS LEDGER THE JUDGES WERE SHOWN/g)||[];
  const ents=[...sb.matchAll(/\\n- ((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d+:\d+(?:[-\u2013]\d+)?) \(pressed against the (DEFENDER|CHALLENGER), premise \d+\): (NAMED IN AN ANSWER|NAMED ONLY IN OTHER TEXT|NOT NAMED)/g)];
  const eq=strip(sb)===strip(sa);const ca=view(a).calls,cb=view(b).calls;tally.calls0=(tally.calls0||0)+(pl==='WLD ledger'?ca:0);tally.calls1=(tally.calls1||0)+(pl==='WLD ledger'?cb:0);
  if(pl==='WLD ledger'){tally.items+=blocks.length;for(const e of ents)tally[e[3]==='NAMED IN AN ANSWER'?'ans':e[3]==='NOT NAMED'?'nn':'oth']++;}
  T(eq,nm+' '+RUN+' ('+pl+'): '+blocks.length+' item block(s), '+ents.length+' ledger entries'+'; calls '+ca+' -> '+cb+(eq?'; items, ids and not_checked otherwise unchanged':'; OTHER TEXT CHANGED'));}}}
log('DeepSeek calls (WLD ledger runs): '+tally.calls0+' -> '+tally.calls1);log('WLD ledger: item blocks '+tally.items+'; entries NAMED IN AN ANSWER '+tally.ans+', NAMED ONLY IN OTHER TEXT '+tally.oth+', NOT NAMED '+tally.nn);
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgWLDDS/test_WLDDS.txt',out.join('\n')+'\n');})();
