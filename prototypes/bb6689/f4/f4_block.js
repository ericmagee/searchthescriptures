// F4 (BB-6689, ruling BB-6692 (4)): SAME-MODEL DIVERGENCE. The panel seat that runs the single judge's model is set beside the single
// judge's grades: either standing, either stated conceded count, either VOID count (Extract Independent Verdict's itemIds and deriveConc,
// copied, the negation window widened from {0,2} to {0,4}). A review line in that seat's verdict_raw only; no grade, verdict, outcome
// or fingerprint changes. Premise ids are not compared, so equal counts on different premises stay silent. Single judge: the saved row
// on a regrade, Build Save Body's saveBody on a live run.
let SJ=null;try{if(RGL){SJ=$('Regrade Row').all().map(i=>i.json).find(r=>r&&r.id)||null;}else if($('Build Save Body').isExecuted){SJ=$('Build Save Body').first().json.saveBody||null;}}catch(e){SJ=null;}
function voidCounts(text){if(typeof text!=='string')return null;
 const D='[\\s\\u2010-\\u2015\\u2212-]';const SEP='[\\s:'+D.slice(3,-1)+']*?';
 const upper=text.toUpperCase().replace(/[*_`]+/g,'');const upperD=upper.replace(/CHALLENGER\s+CONCEDED\s+LINKS/g,'XCHALLENGERCONCEDEDLINKSX');
 const itemIds=(it)=>{const ids=[];let m;const r1=/\b(?:D|C|LR)(\d+[A-Z]?)\b/g;while((m=r1.exec(it))!==null)ids.push('L'+m[1]);
 const r2=/\bLINKS?\s+((?:\d+[A-Z]?|NONE)(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*(?:\d+[A-Z]?))*)/g;
 while((m=r2.exec(it))!==null){const body=m[1];if(/^NONE/.test(body)){ids.push('NONE#'+ids.length);continue;}
  const parts=body.split(/\s*(?:,\s*AND|,|AND)\s*/);for(const p of parts){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push('L'+q);}else if(p.trim())ids.push('L'+p.trim());}}
 const u=new Set(ids.filter(x=>!/^NONE#/.test(x)));return u.size+ids.filter(x=>/^NONE#/.test(x)).length;};
 const TAGC=/\bCONCEDED\s*\(?\s*(?:STATED|CONDITIONAL)\b|\bUNEXHIBITED\s*\(/;
 const deriveConc=(line)=>{if(line===null)return null;let nC=0,nV=0,tags=0;for(const it of line.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,4}\s+VOID\b/.test(it);const isT=TAGC.test(it);if(!isV&&!isT)continue;tags++;const c=Math.max(1,itemIds(it));if(isV)nV+=c;else nC+=c;}return {nC,nV,tags};};
 const concLine=(src,lab)=>{const m=src.match(new RegExp('(^|\\n)[ \\t]*'+lab+SEP+'(?:[0-9]+)?([^\\n]*)'));return m?m[2]:null;};
 const d=deriveConc(concLine(upperD,'CONCEDED\\s+LINKS')),c=deriveConc(concLine(upper,'CHALLENGER\\s+CONCEDED\\s+LINKS'));
 return {def:d?d.nV:null,ch:c?c.nV:null};}
function sameModelMarks(p,WT){if(!SJ||!SJ.judge_model||p.judge_api_model!==SJ.judge_model)return [];const diffs=[];
 const cmp=(lab,a,b)=>{if(a===null||a===undefined||b===null||b===undefined)return;if(a!==b)diffs.push(lab+' '+a+' vs '+b);};
 cmp('defense standing',p.defense_standing,SJ.defense_standing);cmp('challenge standing',p.challenge_standing,SJ.challenge_standing);
 cmp('defender conceded count',p.conceded_links,SJ.conceded_links);cmp('challenger conceded count',p.challenger_conceded_links,SJ.challenger_conceded_links);
 const vp=voidCounts(WT),vs=voidCounts(SJ.independent_verdict_raw);if(vp&&vs){cmp('defender VOID count',vp.def,vs.def);cmp('challenger VOID count',vp.ch,vs.ch);}
 if(!diffs.length)return [];
 return ['[AUDIT v1: SAME-MODEL DIVERGENCE -- seat '+p.judge_seat+' and the single judge both ran '+p.judge_api_model+'; seat vs single judge: '+diffs.join('; ')+'. Counts only; premise ids are not compared. REVIEW THIS ROW.]'];}
