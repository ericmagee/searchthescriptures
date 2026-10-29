const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// From the runner KXoI9 I6b: fail closed; tolerant parser; two envelopes; complete payloads. Reads each slot BY NODE NAME.
const P=$('Panel Build').first().json;const S=$('Init Seats').first().json;
// PANEL FALLBACK (BB-5693 S3): Panel Check's sub names the one failed slot; that slot is read from the reserve judge.
const SUB=$('Panel Check').first().json.sub||null;const RESERVE_NODES=['Panel Reserve deepseek','Panel Reserve openai','Panel Reserve gemini','Panel Reserve grok','Panel Reserve mimo','Panel Reserve openrouter'];
const TAGS=['HELD','PARTIAL','BROKEN'];const STAND=['SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED'];
const SLOT_NODES=[['Panel Judge 1 deepseek','Panel Judge 1 openai','Panel Judge 1 gemini','Panel Judge 1 grok','Panel Judge 1 mimo','Panel Judge 1 openrouter'],['Panel Judge 2 openai','Panel Judge 2 gemini','Panel Judge 2 grok','Panel Judge 2 mimo','Panel Judge 2 openrouter'],['Panel Judge 3 openai','Panel Judge 3 gemini','Panel Judge 3 grok','Panel Judge 3 mimo','Panel Judge 3 openrouter']];
const ran=names=>names.filter(n=>{try{return $(n).isExecuted;}catch(e){return false;}});
function envelope(seat,j){
 // 7107 item 4: a normal chat envelope whose content is null names what happened.
 if(j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content===null)throw new Error('seat "'+seat+'" returned content null (finish_reason '+(j.choices[0].finish_reason||'none')+'). NO ROW IS WRITTEN.'+RT);
 if(j&&j.choices&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
 if(j&&j.candidates&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {text:t,finish:j.candidates[0].finishReason||null};}
 throw new Error('FAIL-CLOSED: seat "'+seat+'" returned an envelope this parser does not recognise. Top-level keys: ['+Object.keys(j||{}).join(',')+']. NO ROW IS WRITTEN.'+RT);}
// READER REPAIR (BB-5700 step 3): a judge sometimes leaves a double quotation mark unescaped inside the text of its last key, "reasoning"
// (ODV1-25634, gemini). When JSON.parse fails, escape only the bare quotation marks inside that one string value and parse once more.
// The five graded keys come before "reasoning" in the required form and are never touched; if any key follows "reasoning", the repair
// swallows it, the closed-set checks then fail, and the seat fails closed as before.
function repairReasoning(x){const m=/"reasoning"\s*:\s*"/.exec(x);if(!m)return null;const vs=m.index+m[0].length;
 const ve=x.lastIndexOf('"');if(ve<vs||!/^"\s*}\s*$/.test(x.slice(ve)))return null;let out='',bs=0;
 for(let i=vs;i<ve;i++){const c=x[i];if(c==='\\'){bs++;out+=c;continue;}if(c==='"'&&bs%2===0)out+='\\"';else out+=c;bs=0;}
 return x.slice(0,vs)+out+x.slice(ve);}
function verdict(seat,text){let s=String(text).trim();s=s.replace(/^```[a-zA-Z]*\s*/,'').replace(/```\s*$/,'').trim();const a=s.indexOf('{');const b=s.lastIndexOf('}');
 if(a===-1||b===-1||b<=a)throw new Error('FAIL-CLOSED: seat "'+seat+'" returned no JSON object. First 200 chars: '+s.slice(0,200)+RT);
 const x=s.slice(a,b+1);try{return JSON.parse(x);}catch(e){const r=repairReasoning(x);if(r!==null){try{return JSON.parse(r);}catch(e2){}}throw new Error('FAIL-CLOSED: seat "'+seat+'" JSON did not parse: '+e.message+RT);}}
function intOrFail(seat,f,v){const n=Number(v);if(!Number.isInteger(n)||n<0)throw new Error('FAIL-CLOSED: seat "'+seat+'" field '+f+' is not an integer >= 0. Got: '+JSON.stringify(v)+RT);return n;}
// v2 K2 (fault F9(b), advisor ruling, binding): WITHDRAWN MISSED, the panel form of Extract Independent Verdict's v20 K2 check, read
// from the judge's own "reasoning" text with that node's COLLISION POINTS, KEYSTONE, CLAUSE and CONCEDED LINKS readers copied verbatim.
// A review line only: the panel has no rejection path and this node sets no data_class, so nothing graded is changed.
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}const F=RGL?RGL.f:$('Final Output').first().json;
function k2Marks(text){if(typeof text!=='string'||!F)return [];
 const D='[\\s\\u2010-\\u2015\\u2212-]';const SEP='[\\s:'+D.slice(3,-1)+']*?';const DM=(s)=>String(s||'').replace(/[‐-―−]/g,'-');
 const upper=text.toUpperCase().replace(/[*_`]+/g,'');const upperD=upper.replace(/CHALLENGER\s+CONCEDED\s+LINKS/g,'XCHALLENGERCONCEDEDLINKSX');
 const clauseLineM=upper.match(new RegExp('(^|\\n)([ \\t]*CLAUSE'+SEP+'(?:BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)[^\\n]*)'));
 const nwk=clauseLineM?clauseLineM[2].match(/N\s*=\s*([0-9]+)\s+W\s*=\s*([0-9]+)\s+K\s*=\s*([0-9]+)/):null;const n=nwk?parseInt(nwk[1],10):null;
 const colSec=(()=>{const L=upper.split('\n');const i=L.findIndex(x=>/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS\b/.test(x));if(i<0)return null;const out=[];const f=L[i].replace(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS[ \t]*:?/,'');if(f.trim())out.push(f);for(let j=i+1;j<L.length;j++){const x=L[j];if(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?(CITATION CHECK|OUT-OF-ROUND CONCESSIONS|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CONCEDED LINKS|CHALLENGER CONCEDED LINKS|LINK AUDIT)\b/.test(x))break;if(/^[ \t]*\[(EXTRACTOR|REVIEW|TRUNCATED|AUDIT)/.test(x))break;out.push(x);}return out;})();
 const colMap={};if(colSec){for(const x0 of colSec){const x=x0.trim();if(!x)continue;const m=x.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m)continue;const rest=m[2];let st=null;if(/^VS\.?\s/.test(rest)){const g=rest.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);st=g?g[1]:null;}else{const g=rest.match(/^(WITHDRAWN|STANDS)\b/);st=g?g[1]:null;}if(!st)continue;(colMap[+m[1]]=colMap[+m[1]]||[]).push(st);}}
 const colState=(i)=>{const a=colMap[i];if(!a)return null;const w=a.includes('WITHDRAWN'),b=a.includes('DEFENDER LINK BROKEN');return (w&&b)?'CONFLICT':w?'WITHDRAWN':b?'BROKEN':'STANDS';};
 const KSM=upper.match(new RegExp('(^|\\n)[ \\t]*KEYSTONE'+SEP+'D([0-9]+)'+SEP+'(WITHDRAWN|BROKEN|STANDS)(?![A-Z0-9])(?![ \\t]*(?:\\||/|OR[ \\t]))'));
 const keystone_link=KSM?parseInt(KSM[2],10):null,keystone_state=KSM?KSM[3]:null;
 const chain_count=(()=>{const t=F.cr1;if(typeof t!=='string')return null;const L=DM(t).split('\n');let hi=-1;for(let i=0;i<L.length;i++){if(/^\s*#*\s*\**\s*DECLARED CHAIN\s*:?\s*\**\s*(?:-{1,3}[^\n]*)?:?\s*$/i.test(L[i]))hi=i;}if(hi<0)return null;let c=0;for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**D?([0-9]+)(?:\.|\s+-{1,3}(?:\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;}return c;})();
 const gL=DM(F.gr2).split('\n');let gh=-1;for(let i=0;i<gL.length;i++){if(/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i.test(gL[i]))gh=i;}
 const labs=[];if(gh>=0){let c=0;for(let i=gh+1;i<gL.length;i++){const m=gL[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m)continue;if(parseInt(m[1],10)!==c+1)break;c++;const lm=gL[i].replace(/[*_`]+/g,'').match(/^(?:#+\s*)?[0-9]+\.\s*LINK\s*([0-9]+|NONE)\b/i);labs.push(lm?lm[1].toUpperCase():null);}}
 const ent=[];const seen=new Set();
 for(const x of DM(F.cr3).replace(/[*_`]+/g,'').toUpperCase().split('\n')){if(/^[ \t#>]*CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES[ \t:]*$/.test(x))break;
  const m=x.match(/^[ \t#>•-]*LINK[ \t]+([0-9]+|NONE)[ \t]*(?:\[[ \t]*PREMISE[ \t]*([0-9]+)[ \t]*\])?[ \t]*:?[ \t]*(SUPPORTED|CONCEDED)\b/);if(!m)continue;
  const key=m[1]+'#'+(m[2]||'');if(seen.has(key+'#'+m[3]))continue;seen.add(key+'#'+m[3]);ent.push({lab:m[1],p:m[2]?+m[2]:null,st:m[3],key});}
 const keys=[...new Set(ent.map(e=>e.key))];const kl=keys.map(x=>x.split('#')[0]);const ms=(a)=>a.slice().sort().join(',');
 const pmode=ent.length>0&&ent.every(e=>e.p===null)&&keys.length===labs.length&&kl.every((x,i)=>x===String(i+1))&&labs.every(x=>x!==null)&&ms(labs)!==ms(kl);
 if(pmode){for(const e of ent){e.lab=labs[+e.lab-1];}}
 const conc=new Set(ent.filter(e=>e.st==='CONCEDED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));const sup=new Set(ent.filter(e=>e.st==='SUPPORTED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));
 const vIds=new Set();const clm=upperD.match(new RegExp('(^|\\n)[ \\t]*CONCEDED\\s+LINKS'+SEP+'(?:[0-9]+)?([^\\n]*)'));const cl=clm?clm[2]:null;
 if(cl!==null){for(const it of cl.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,2}\s+VOID\b/.test(it);if(!isV)continue;
  let m;const r1=/\b(?:D|C|LR)(\d+)\b/g;while((m=r1.exec(it))!==null)vIds.add(+m[1]);
  const r2=/\b(LINKS?|PREMISES?)\s+(\d+(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*\d+)*)/g;
  while((m=r2.exec(it))!==null){const ids=[];for(const p of m[2].split(/\s*(?:,\s*AND|,|AND)\s*/)){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push(q);}else if(/^\d+$/.test(p.trim()))ids.push(+p.trim());}
   for(const q of ids){if(/^PREMISE/.test(m[1])){const lb=labs[q-1];if(lb&&/^[0-9]+$/.test(lb))vIds.add(+lb);}else vIds.add(q);}}}}
 const nD=(chain_count!==null)?chain_count:n;const stands=(i)=>{const s=colState(i);return s==='STANDS'||(s===null&&keystone_link===i&&keystone_state==='STANDS');};
 const out=[];if(nD!==null){for(let i=1;i<=nD;i++){if(!conc.has(i)||!stands(i)||vIds.has(i))continue;
  if(sup.has(i))out.push('[EXTRACTOR v18: SPLIT LINK D'+i+' -- CR3 concedes and supports premises mapped to it. REVIEW THIS ROW.]');
  else{out.push('[EXTRACTOR v18: WITHDRAWN MISSED D'+i+' -- CR3 states LINK '+i+': CONCEDED; the judge marks it STANDS. REVIEW THIS ROW.]');(out.missed=out.missed||[]).push(i);}}}
 out.nwk=nwk?[n,parseInt(nwk[2],10),parseInt(nwk[3],10)]:null;out.ks=keystone_state==='STANDS'?keystone_link:null; // P2D v6a item 2: the missed withdrawals and the judge's own counts
 return out;}
// K3 (advisor ruling, binding): STANDING COUNT, the panel form of Extract Independent Verdict's check, read from the judge's own "reasoning" text.
// The W1 standing line carries "L=<n> c=<n>". Where both parse and the graded standing (the JSON field) disagrees with the count (COLLAPSED iff
// 2c > L, a tie is NOT COLLAPSED), a review line follows the judge's JSON. A grade is never rewritten; the panel has no rejection path. If L or c
// does not parse, nothing is written.
function k3Marks(text,dGiven,cGiven){if(typeof text!=='string')return [];
 const D='[\\s\\u2010-\\u2015\\u2212-]';const SEP='[\\s:'+D.slice(3,-1)+']*?';const STD='(SELF'+D+'SUPPORTED|PROP'+D+'DEPENDENT|COLLAPSED)';const upper=text.toUpperCase().replace(/[*_`]+/g,'');const out=[];
 for(const [label,given] of [['DEFENSE',dGiven],['CHALLENGE',cGiven]]){
  const m=upper.match(new RegExp('(^|\\n)[ \\t]*'+label+'\\s+STANDING'+SEP+STD+'([^\\n]*)'))||upper.match(new RegExp(label+'\\s+STANDING'+SEP+STD+'([^\\n]*)'));if(!m)continue;
  const q=m[m.length-1].match(/^[\s:,;.(‐-―−-]*L\s*=\s*([0-9]+)[\s,;]*C\s*=\s*([0-9]+)(?![0-9])/);if(!q)continue;const L=parseInt(q[1],10),c=parseInt(q[2],10);
  if((given==='COLLAPSED')!==(2*c>L))out.push('[EXTRACTOR v18: STANDING COUNT -- '+label+' STANDING '+given+' but L='+L+' c='+c+' gives '+((2*c>L)?'COLLAPSED':'not COLLAPSED')+'. REVIEW THIS ROW.]');}
 return out;}
// F4 (BB-6689, ruling BB-6692 (4)): SAME-MODEL DIVERGENCE. The panel seat that runs the single judge's model is set beside the single
// judge's grades: either standing, either stated conceded count, either VOID count (Extract Independent Verdict's itemIds and deriveConc,
// copied, the negation window widened from {0,2} to {0,4}). A review line in that seat's verdict_raw only; no grade, verdict, outcome
// or fingerprint changes. Premise ids are not compared, so equal counts on different premises stay silent. Single judge: the saved row
// on a regrade, Build Save Body's saveBody on a live run.
// BB-7397 rev 9 DoD 20 (v): on a live run the single judge's four values come from Build Save Body's sj_values (saveBody carries null for them);
// on a regrade the row's four are the single judge's only while panel_verdict is null; on a stamped row they are the panel's, so the check
// compares the VOID counts only and its line says so.
let SJ=null;try{if(RGL){const RR=$('Regrade Row').all().map(i=>i.json).find(r=>r&&r.id)||null;SJ=RR?(RR.panel_verdict==null?RR:Object.assign({},RR,{defense_standing:null,challenge_standing:null,conceded_links:null,challenger_conceded_links:null,sj_void_only:true})):null;}else if($('Build Save Body').isExecuted){const B=$('Build Save Body').first().json;SJ=B.saveBody?Object.assign({},B.saveBody,B.sj_values||{}):null;}}catch(e){SJ=null;}
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
 return ['[AUDIT v1: SAME-MODEL DIVERGENCE -- seat '+p.judge_seat+' and the single judge both ran '+p.judge_api_model+'; seat vs single judge: '+diffs.join('; ')+'. Counts only; premise ids are not compared.'+(SJ.sj_void_only?' Stamped row: VOID counts only.':'')+' REVIEW THIS ROW.]'];}
// BB-6904 (b), portion 3: DEBATE RULE VIOLATION, rule B on the judge's own BROKEN lines. A line graded DEFENDER LINK BROKEN or
// CHALLENGER LINK BROKEN must exhibit, on the line itself, two lower layers of different kinds (6903): [L1] with quoted words, [L2] with
// a source word (own script, transliteration marks, or a Strong's number; 6926; the Latin range narrowed to transliteration letters, 6936),
// [L3] with a named reference. A tag after "no", "without", "lacks" or "not" never counts. K-G1 (6892): a BROKEN line resting on a
// witness left unanswered while that side's stated conceded count is 0. K-G3 (6934): a side graded SELF-SUPPORTED while any of its
// links is graded BROKEN. K-G2: an absent CITATION CHECK line on text from a prompt that asks for it, recorded only. The counter is
// kb.cjs (git 29caa5c), names prefixed. Lines are chosen the extractor's way: a "D<n> vs" collision entry whose first grade is DEFENDER
// or CHALLENGER LINK BROKEN. No grade is changed; each violation is a review line (6890 AMEND 2).
const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_REF_END=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}(?:\s?[-–]\s?\d{1,3})?[\s*_]*$/; // BB-7994 step 6b: a reference written just before its [L3] tag ("Job 15:14 [L3]") names the reference
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
const DRV_QUOTE=/(?:^|[\s(\[{])["“'‘][^"”\n]{4,}?["”'’](?=$|[\s.,;:!?)\]}])/; // a mark inside a word (Joseph's) never opens or closes a quote (BB-6898 D1)
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
function drvExhibits(line,needQuote,formC,distinct){
  const re=/\[L([1-3])\](?:\s*\/\s*\[L[1-3]\])*/g;let m,n=0;const met=new Set(); // distinct: count layer kinds met, not tags (BB-6899)
  while((m=re.exec(line))!==null){
    const before=line.slice(Math.max(0,m.index-30),m.index);
    if(DRV_NEG.test(before))continue;
    let rest=line.slice(m.index+m[0].length);
    // BB-7994 step 6b: a quotation that opens the text runs to its closing mark before any cut ("Adam knew Eve his wife; and she conceived").
    {const q=rest.match(/^\s*["“]/);let from=0;if(q){const k=rest.slice(q[0].length).search(/["”]/);if(k>=0)from=q[0].length+k+1;}
     const cut=rest.slice(from).search(/;|(?<!\.)\.\s|\s--\s|\s—\s|\[L[1-4]\]/);if(cut>=0)rest=rest.slice(0,from+cut);}
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&DRV_QUOTE.test(rest))||(t==='2'&&DRV_SRC.test(rest))||(t==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(line.slice(Math.max(0,m.index-40),m.index)))));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=DRV_REF.test(rest)||DRV_SRC.test(rest);
    if(anchor&&(!needQuote||DRV_QUOTE.test(rest)))n++;
  }
  return distinct?[...met].sort().map(t=>'L'+t):n;
}
const drvKinds=(line)=>drvExhibits(line,false,true,true);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
// P2D v6a item 1b (BB-8136): K-S, a STANDS or UNDERDETERMINED line whose ground is that a single verse does not state a link or its
// contrary, naming no later round ([CR2], [CR3], [DR2], [DR3]) that answered the witness. Sent to the cure to be regraded on the answered test.
const DRV_STATE=/\b(?:do|does|did)\s+not\s+state\b|\bnot\s+stated\b|\bnever\s+states?\b|\bneither\s+states?\b|\bnor\s+states?\b|\bno\s+(?:\S+\s+){0,4}?(?:verse|row|witness|quotation|passage|text)s?\b(?:\s+\S+){0,4}?\s+(?:states?|names?)\b|\bno\s+\[L[1-4]\](?:\s*\/\s*\[L[1-4]\])*\s+(?:states?|names?)\b|\b(?:met\s+by|without)\s+any\s+(?:verse|row|witness|quotation)\s+that\s+(?:states?|names?)\b/i;
const DRV_ANS=/[\[(](?:CR|DR)[23]\b/i;
// THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: per premise, both sides. A premise line of the PRESSED-WITNESS LEDGER sent
// to this judge that marks a verse NOT NAMED, and that the judge's CONCEDED LINKS (defender) or CHALLENGER CONCEDED LINKS (challenger) line
// does not count as CONCEDED or UNEXHIBITED (by "premise n", or "LINK m"), is one item. No ledger or no count line in the text: no item.
// BB-7397 rev 9 DoD 26 (2): C-LABEL OFF THE GUIDE. A collision line "D<i> vs C<j>[/C<k>] (<verses>)" whose number is above the count of [DR3]
// LINK blocks, or whose verses (when it gives any) meet none of the verses its LINK blocks name (a compound label: their union), is recorded
// by one line. Not a violation, not an item, not counted; [DR3] is read from the text sent to the judge. The verse reader is the cure library's.
const C_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
function cRefs(t){const out=[];const s=String(t||'');let last=null;const re=/(?:((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+)?(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*,\s*(?:\d{1,3}:)?\d{1,3}(?:\s*[-–]\s*\d{1,3})?)*)/g;let m;
 while((m=re.exec(s))){let bk=last;if(m[1]){const b=m[1].toLowerCase().replace(/\s+/g,' ');const n=b.match(/^([1-3]) (.+)$/);const base0=n?n[2]:b;bk=(n?n[1]+' ':'')+(C_BK[base0]||base0.slice(0,3));last=bk;}
  if(!bk)continue;const add=(c,v1,v2)=>{if(!v2||v2<v1||v2-v1>30)v2=v1;for(let v=v1;v<=v2;v++)out.push({key:bk+' '+c+':'+v,pos:m.index});};
  let ch=+m[2];add(ch,+m[3],m[4]?+m[4]:0);
  for(const p of (m[5]||'').split(',').map(x=>x.trim()).filter(Boolean)){const q=p.match(/^(?:(\d{1,3}):)?(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/);if(!q)continue;if(q[1])ch=+q[1];add(ch,+q[2],q[3]?+q[3]:0);}}
 return out;}
function cAudit(text,ptext){const P=String(ptext||'');const i=P.lastIndexOf('=== [DR3]');if(i<0)return [];const e=P.indexOf('\n=== ',i+1);const t=P.slice(P.indexOf('\n',i)+1,e<0?P.length:e);
 const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+\d+/gmi))H.push(h.index);if(!H.length)return [];
 const links=H.map((a,k)=>new Set(cRefs(t.slice(a,k+1<H.length?H[k+1]:t.length)).map(r=>r.key)));const N=links.length;const out=[];
 for(const ln of String(text||'').replace(/\\n/g,'\n').split('\n')){const m=ln.trim().match(/^[*_>-]*\s*(D\d+)\s+vs\s+(C\d+(?:\s*\/\s*C\d+)*)\s*(?:\(([^)]*)\))?/);if(!m)continue;
  const js=m[2].split('/').map(x=>+x.trim().slice(1));let why='';
  if(js.some(j=>j<1||j>N))why='C'+js.filter(j=>j<1||j>N).join(', C')+' is above the '+N+' LINK blocks of DR3';
  else if(m[3]){const want=cRefs(m[3]).map(r=>r.key);const U=new Set();js.forEach(j=>links[j-1].forEach(k=>U.add(k)));if(want.length&&!want.some(k=>U.has(k)))why='DR3 LINK block '+js.join('/')+' names none of '+m[3].trim();}
  if(why)out.push('[AUDIT v21: C-LABEL OFF THE GUIDE -- '+m[1]+' vs '+m[2].replace(/\s+/g,'')+(m[3]?' ('+m[3].trim()+')':'')+': '+why.replace(/[\[\]]/g,'')+'; recorded, not a violation, not counted.]');}
 return out;}
function drvPromptText(body){try{const b=body||{};const out=[];if(b.systemInstruction&&b.systemInstruction.parts)b.systemInstruction.parts.forEach(p=>out.push(String(p.text||'')));
 (b.messages||[]).forEach(m=>out.push(typeof m.content==='string'?m.content:JSON.stringify(m.content)));(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
// THE DEBATE FIXED (BB-7397, DoD 9 as typed fields, BB-7455): the panel judge's own JSON fields counted_premises_defender and
// counted_premises_challenger, each an array of ledger premise numbers. Missing or null: ABSENT. Anything but an array of integers >= 1:
// INVALID, the raw value kept for the mark; so is a number above the count of that side's ledger premises (BB-7457 F-range). No text of the judge's prose is read for the set. Where a field is ABSENT or INVALID the checks
// by number fall back to the stated count (A): an item only at a count of 0. The single judge returns no fields, so it is always (A).
function drvLedgerN(ptext,side){if(typeof ptext!=='string')return null;const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);
 const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);if(i<0||j<0||k<0)return null;const n=(side==='DEFENDER'?ptext.slice(i,j):ptext.slice(j,k)).split('\n').filter(l=>/^\s*premise \d+/.test(l)).length;return n||null;}
function drvCPA(val,max){if(val===undefined||val===null)return {present:false,why:'absent'};
 if(!Array.isArray(val)||!val.every(x=>Number.isInteger(x)&&x>=1&&(!max||x<=max))){let r;try{r=JSON.stringify(val);}catch(e){r=String(val);}return {present:false,why:'invalid',raw:String(r).slice(0,200)};}
 return {present:true,set:new Set(val),line:JSON.stringify(val)};}
// The ledger's own map from a defender link to the premises graded against it ("A challenger premise written LINK i: is graded against Di"):
// LINK m -> the premise numbers written "(LINK m)". No LINK label in the ledger: null, and premise n stands for D<n>.
function drvLinkMap(ptext){if(typeof ptext!=='string')return null;const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);
 if(i<0||j<0)return null;const M={};let any=false;for(const l of ptext.slice(i,j).split('\n')){const m=l.trim().match(/^premise (\d+) \(LINK (\d+)\)/);if(m){any=true;(M[+m[2]]=M[+m[2]]||[]).push(+m[1]);}}
 return any?M:null;}
const drvCountLine=(T,side)=>{const m=T.match(side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:.*$/im:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:.*$/im);return m?m[0]:null;};
// DoD 7 (BB-7420) K-G7: a COLLISION POINTS line graded DEFENDER LINK BROKEN on D<n> whose premise n (or LINK n) the same judge's CONCEDED LINKS
// line does not count. No word test. Not raised where K-G1 already raised the link. The challenger count numbers premises from the defender's
// list, not by C<j> (BB-7430, option (c)): a CHALLENGER LINK BROKEN line is raised only when CHALLENGER CONCEDED LINKS is 0 and the line reads an
// unanswered witness (DRV_WORDS7). LIMIT: with the challenger count above 0, an uncounted challenger premise is not checked by number and is not
// raised. L and the standing are read from the judge's own STANDING lines.
const DRV_WORDS7=/\b(?:unanswered|not answered|unnamed|not named|never named|none named|neither named|unaddressed|unexhibited)\b/i;
function drvBroken(text,dConc,dStand,prior,cConc,cStand,ptext,CPV){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const T=text.replace(/[*_`]+/g,'');
 const cl=drvCountLine(T,'DEFENDER');const lm=T.match(/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const L=drvLedgerN(ptext,'DEFENDER')||(lm?+lm[1]:null);
 const cm=T.match(/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const LC=drvLedgerN(ptext,'CHALLENGER')||(cm?+cm[1]:null);
 // DoD 9 (BB-7455): each side's counted_premises field; ABSENT or INVALID is written to the row; a valid array whose size differs from its count is K-G8.
 const LK=drvLinkMap(ptext);const CP={DEFENDER:drvCPA(CPV&&CPV.DEFENDER,drvLedgerN(ptext,'DEFENDER')),CHALLENGER:drvCPA(CPV&&CPV.CHALLENGER,drvLedgerN(ptext,'CHALLENGER'))};
 for(const sd of ['DEFENDER','CHALLENGER']){const cp=CP[sd],sc=sd==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;
  if(!cp.present){marks.push('[AUDIT v21: COUNTED PREMISES '+sd+' FIELD '+(cp.why==='invalid'?'INVALID: '+String(cp.raw||'').replace(/\[/g,'(').replace(/\]/g,')'):'ABSENT')+' -- the checks by number fall back to the stated count (A).]');continue;}
  if(typeof sc==='number'&&cp.set.size!==sc){items.push({rule:'K-G8',side:sd,link:sd+' COUNTED PREMISES',line:cp.line,premise:null,conc:cp.set.size,st:sd==='DEFENDER'?dStand:cStand,L:sd==='DEFENDER'?L:LC});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G8) -- counted_premises_'+sd.toLowerCase()+' lists '+cp.set.size+' premise(s) while the count is '+sc+'. REVIEW THIS ROW.]');}}
 const dBase=CP.DEFENDER.present?CP.DEFENDER.set.size:dConc;const cZero=cConc===0;
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');const n=+m[1];
  if((prior||[]).some(x=>x.rule==='K-G1'&&x.link===id))continue;
  if(g[1]==='CHALLENGER LINK BROKEN'){if(!cZero||!DRV_WORDS7.test(line))continue;
   items.push({rule:'K-G7',side:'CHALLENGER',link:id,line,premise:null,conc:cConc,st:cStand,L:LC});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' CHALLENGER LINK BROKEN for a witness left unanswered while CHALLENGER CONCEDED LINKS is 0. REVIEW THIS ROW.]');continue;}
  if(typeof dConc!=='number')continue;const ps=LK?(LK[n]||[]):[n];const viaA=!CP.DEFENDER.present||!ps.length;
  if(viaA){if(dConc!==0)continue;}else if(ps.some(q=>CP.DEFENDER.set.has(q)))continue;
  items.push({rule:'K-G7',side:'DEFENDER',link:id,line,premise:ps.length?ps[0]:null,conc:dBase,st:dStand,L});
  marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' DEFENDER LINK BROKEN while '+(viaA?'CONCEDED LINKS is 0':'counted_premises_defender does not list premise '+ps.join(' or '))+'. REVIEW THIS ROW.]');}
 return {items,marks};}
function drvLedger(text,ptext,dConc,cConc,dStand,cStand,CPV){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);
 if(i<0||j<0||k<0)return {items,marks};
 const prem=s=>s.split('\n').map(l=>l.trim()).filter(l=>/^premise \d+/.test(l));const LG={DEFENDER:prem(ptext.slice(i,j)),CHALLENGER:prem(ptext.slice(j,k))};
 const T=text.replace(/[*_`]+/g,'');
 const countLine=side=>drvCountLine(T,side);

 for(const side of ['DEFENDER','CHALLENGER']){const cp=drvCPA(CPV&&CPV[side],drvLedgerN(ptext,side));const sc=side==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;
  if(!cp.present&&sc!==0)continue;
  for(const l of LG[side]){const m=l.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);if(!m||/^none\s*$/i.test(m[3]))continue;
   if(cp.present&&cp.set.has(+m[1]))continue;
   const id=side+' premise '+m[1];
   items.push({rule:'K-G6',side,link:id,line:l,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:LG[side].length});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G6) -- '+id+(m[2]?' (LINK '+m[2]+')':'')+': the PRESSED-WITNESS LEDGER marks '+m[3].trim()+' NOT NAMED and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it. REVIEW THIS ROW.]');}}
 return {items,marks};}
function drvCheck(text,dConc,cConc,dStand,cStand,askedCC){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const cnt={DEFENDER:0,CHALLENGER:0};
 const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  {const ms=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(ms){const vs=/^VS\.?\s/.test(ms[2]);const gs=vs?((ms[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null):(/^STANDS\b/.test(ms[2])?'STANDS':null);
   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(line)&&!DRV_ANS.test(line)){const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}}}
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const side=g[1].split(' ')[0];cnt[side]++;const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');
  // BB-7994 step 6b (BB-8044, 8056): the line under a BROKEN line carries its footing when it is not itself a collision, a label line or a concession line (SIDE | round |).
  const nx=String(LS[li+1]||''),nu=nx.toUpperCase().replace(/[*_`]+/g,'').trim();
  const k=(nu&&!/^(?:[-•]|\d+[.)])?\s*[DC]\d+\b/.test(nu)&&!/^[A-Z][A-Z \-]{2,}:/.test(nu)&&!/^(?:DEFENDER|CHALLENGER)\s*\|/.test(nu))?[...new Set([...drvKinds(line),...drvKinds(nx)])].sort():drvKinds(line);
  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line or the line under it. REVIEW THIS ROW.]');}
  const conc=side==='DEFENDER'?dConc:cConc;
  if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G1) -- '+id+' '+g[1]+' rests on a witness left unanswered while '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' is 0. REVIEW THIS ROW.]');}
  // BB-6904 rev 8 K-G4: every other LINK BROKEN line answers the pressing-sentence rule too; cured by a PRESSED line whose quotation is
  // found in the named pressing round, or by WITHDRAWN (7176, 7184, 7186).
  else{items.push({rule:'K-G4',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- '+id+' '+g[1]+' counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round. REVIEW THIS ROW.]');}}
 for(const [side,st,lab] of [['DEFENDER',dStand,'DEFENSE'],['CHALLENGER',cStand,'CHALLENGE']]){
  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}
 if(askedCC&&!/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CITATION CHECK\b/im.test(text.replace(/[*_`]+/g,'')))marks.push('[AUDIT v21: CITATION CHECK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT (K-G2); recorded, not counted as a violation.]');
 return {items,marks};}
const ALTB=$('Alternate Build').all().map(x=>x.json.alt).filter(a=>a&&!a.skip);
const callOut=$input.all().map(x=>x.json);
const out=ALTB.map((a,k)=>{const raw=callOut[k];const res={alt:a,ok:false,why:null,body:null,summary:null,drv:[]};
 try{if(!raw)throw new Error('no call output');if(raw.error){const e=raw.error;throw new Error('call failed: '+String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e))).slice(0,200));}
  const env=envelope(a.seat,raw);let v;try{v=verdict(a.seat,env.text);}catch(e){throw new Error(String(e&&e.message||e)+' (finish_reason '+(env.finish||'none')+')');}
  if(TAGS.indexOf(v.verdict_tag)===-1)throw new Error('verdict_tag "'+v.verdict_tag+'" outside the closed set');
  if(STAND.indexOf(v.defense_standing)===-1)throw new Error('defense_standing "'+v.defense_standing+'" outside the closed set');
  if(STAND.indexOf(v.challenge_standing)===-1)throw new Error('challenge_standing "'+v.challenge_standing+'" outside the closed set');
  const p={debate_id:P.debate_id,judge_seat:a.seat,judge_api_model:a.api_model,verdict_raw:env.text,verdict_tag:v.verdict_tag,defense_standing:v.defense_standing,challenge_standing:v.challenge_standing,conceded_links:intOrFail(a.seat,'conceded_links',v.conceded_links),challenger_conceded_links:intOrFail(a.seat,'challenger_conceded_links',v.challenger_conceded_links),finish_reason:env.finish};
  const marks=[];if(p.defense_standing==='SELF-SUPPORTED'&&p.conceded_links>0)marks.push('[AUDIT v1: DEFENSE SELF-SUPPORTED WITH '+p.conceded_links+' CONCEDED LINKS. REVIEW THIS ROW.]');
  if(p.challenge_standing==='SELF-SUPPORTED'&&p.challenger_conceded_links>0)marks.push('[AUDIT v1: CHALLENGE SELF-SUPPORTED WITH '+p.challenger_conceded_links+' CHALLENGER CONCEDED LINKS. REVIEW THIS ROW.]');
  const offKey=v.reasoning==null&&v.reason!=null;const WT=offKey?v.reason:v.reasoning;
  {const K2W=k2Marks(WT);for(const x of K2W)marks.push(x); // P2D v6a item 2 (BB-8136): the conceded link counts in w; the clause is recomputed from the judge's own counts
  if(K2W.missed&&K2W.missed.length&&K2W.nwk){const n0=K2W.nwk[0],w1=K2W.nwk[1]+K2W.missed.length,k0=K2W.nwk[2],ksW=K2W.ks!=null&&K2W.missed.includes(K2W.ks);
   const tg=k0>=1?'BROKEN-1':((2*w1>n0||ksW)?'BROKEN-2':(w1>=1?'PARTIAL-1':(p.defense_standing==='COLLAPSED'?'PARTIAL-2':'HELD-1')));const wd2=tg.split('-')[0];
   if(wd2!==p.verdict_tag){marks.push('[AUDIT v22: WITHDRAWAL COUNTED -- D'+K2W.missed.join(', D')+' stated CONCEDED in CR3 and marked STANDS by the judge, counted withdrawn: n='+n0+' w='+w1+' k='+k0+(ksW?' keystone WITHDRAWN':'')+' gives '+tg+'; ORIGINAL: '+p.verdict_tag+'; COUNTED: '+wd2+']');p.verdict_tag=wd2;}}}for(const x of k3Marks(WT,p.defense_standing,p.challenge_standing))marks.push(x);
  if(offKey)marks.push('[AUDIT v1: WORKED TEXT KEYED "reason", NOT "reasoning"; READ UNDER "reason". REVIEW THIS ROW.]');
  for(const x of sameModelMarks(p,WT))marks.push(x);
  let drvAsk=false;try{drvAsk=JSON.stringify(a.body||{}).includes('CITATION CHECK');}catch(e){drvAsk=false;}
  const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);
  const DL=drvLedger(WT,drvPromptText(a.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,{DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger});for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)marks.push(x);
  const DB=drvBroken(WT,p.conceded_links,p.defense_standing,DRV.items,p.challenger_conceded_links,p.challenge_standing,drvPromptText(a.body),{DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger});for(const x of DB.items)DRV.items.push(x);for(const x of DB.marks)marks.push(x);
 for(const x of cAudit(WT,drvPromptText(a.body)))marks.push(x); // BB-7397 rev 9 DoD 26 (2), recorded only
  p.drv_uncured=DRV.items.length; // 5B fail-closed: the cure check below lowers it
  marks.push('[AUDIT v21: ALTERNATE JUDGE -- SEAT: '+a.seat+'; REPLACES: '+a.removed_seat+'; MODEL: '+a.api_model+(a.qualify?'; QUALIFY RUN':'')+']');
  p.verdict_raw=p.verdict_raw+'\n\n'+marks.join('\n');
  res.ok=true;res.body=JSON.stringify({payload:p});res.drv=DRV.items;res.summary={seat:a.seat,node:'Alternate Call openrouter',api_model:a.api_model,verdict_tag:p.verdict_tag,raw_chars:env.text.length,finish_reason:p.finish_reason,flags:marks.length,drv:DRV.items,substitute:false,alternate_of:a.removed_seat};}
 catch(e){res.why=String(e.message||e).replace(/^FAIL-CLOSED:\s*/,'').slice(0,300);}
 return {json:res};});
return out.length?out:[{json:{alt:null,ok:false,why:'no alternate call'}}];
