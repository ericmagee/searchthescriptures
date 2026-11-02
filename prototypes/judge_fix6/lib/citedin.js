// judge_fix5 G2 (run 32284: the ledger's line "cited in [CR1], [CR2] or [CR3] and not named in a later round of the challenger (42 of 92)" was
// ruled on by one judge only: ChatGPT counted challenger premises 4 and 5 UNEXHIBITED for Luke 3:31, Gemini and GLM said nothing of the line,
// and the panel outcome turned on it; rulings 372 and 373): every judge rules on every verse each "cited in" line lists, one line per verse,
//   PRESSED: <book chapter:verse> -- [<pressing round>] -- "<the pressing sentence, quoted>" -- UNANSWERED
//   PRESSED: <book chapter:verse> -- [<pressing round>] -- "<the pressing sentence, quoted>" -- ANSWERED IN [<round>]
//   NOT PRESSED: <book chapter:verse>
// K-G9 marks a side when (a) a listed verse has no valid ruling (no line, a quotation not found in the round named, a round that does not press
// that side, or ANSWERED IN a round that does not name the verse: an answer counts only by book, chapter and verse, ruling 376), or (b) a verse
// ruled PRESSED and UNANSWERED is not counted: under ruling 372 the premise is UNEXHIBITED and counts, so the side's count must be at least 1 and
// its CONCEDED LINKS (or CHALLENGER CONCEDED LINKS) line must name the verse. The cure follows the mark-and-cure pattern (RESPONSE required).
// judge_fix6 H5 (run 32293: Gemini, ChatGPT, GLM and the single judge wrote NOT PRESSED for Luke 1:27 and Matthew 1:22 with no reason, and the
// outcome turned on those rulings): a NOT PRESSED ruling gives its reason in one clause after the reference,
//   NOT PRESSED: <book chapter:verse> -- <reason, e.g. quoted for the defender's own chain, not against a link or listed premise of the challenger>
// (or after a semicolon, a colon, a comma, in parentheses, or as a "because ..." clause); a NOT PRESSED with no reason of three words or more
// is not a valid ruling (cure: the line with its reason, or PRESSED), and with RESPONSE as for every item. When a side passes, the seat's text
// carries "K-G9 PASS: n verses ruled", so the record shows the check ran. K-G9 is a TRIAL rule (ENF_STATUS): it removes no seat.
const CI_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const CI_ANS={DEFENDER:['CR2','CR3','CR4'],CHALLENGER:['DR1','DR2','DR3']};
const CI_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const ciQ=s=>String(s==null?'':s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\s+/g,' ').trim();
const ciFound=(q,txt)=>{const T=ciQ(txt);const ps=String(q).split(/\.{3}|…/).map(x=>ciQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));};
const ciKeys=s=>new Set(REFP.keys(String(s||''),{scoped:true,cap:12}).map(k=>k.key));
// The two "cited in" lines of the PRESSED-WITNESS LEDGER in the judge's prompt: the verses listed against each side.
function ciLedger(ptext){const out={};const t=String(ptext||'');
 for(const m of t.matchAll(/^cited in [^\n]*?not named in a later round of the (defender|challenger)[^\n]*?\((\d+) of (\d+)\):\s*([^\n]*)$/gmi)){const side=m[1].toUpperCase();if(out[side])continue;
  const list=/^none\s*$/i.test(m[4].trim())?[]:m[4].split(/,\s+(?=(?:[1-3]\s)?[A-Z])/).map(x=>x.trim()).filter(Boolean);out[side]={n:+m[2],total:+m[3],labels:list,line:m[0]};}
 return out;}
// The rounds as the judge was sent them ("=== [CR2] ... ===" sections of the prompt).
function ciRounds(ptext){const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;out[x.k]=t.slice(x.e,end);});return out;}
// The ruling lines in a text (a judgment's reasoning or a cure reply).
const CI_LINE=/^\s*(?:[-*•>]|\d+[.)])?\s*(NOT PRESSED|PRESSED)\s*:\s*(.+)$/i;
const CI_PRESSED=/^(.+?)\s*(?:--|—|–)\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*(?:--|—|–)\s*["“](.+)["”]\s*(?:--|—|–)\s*(UNANSWERED|ANSWERED\s+IN\s*\[?\s*((?:CR|DR)[1-4])\s*\]?)\s*\.?$/i;
function ciForm(kind,rest){if(/^NOT PRESSED$/i.test(kind))return /^[^|]*\d+:\d+[^|]*$/.test(rest)&&!/\bvs\.?\s+C\d/i.test(rest);return CI_PRESSED.test(rest);}
// The reference part of a NOT PRESSED line and the reason after it.
function ciNP(rest){const s=String(rest||'');const ps=REFP.parse(s,{scoped:true}).filter(r=>r.at===REFP.parse(s,{scoped:true})[0].at);let end=ps.length?Math.max(...ps.map(r=>r.end)):0;
 const ref=s.slice(0,end).replace(/[.\s]+$/,'').trim();const why=s.slice(end).replace(/^\s*\)?\s*(?:--|—|–|-|;|:|,|\()?\s*/,'').replace(/\)?[\s.]*$/,'').trim();return {ref:ref||s.replace(/[.\s]+$/,''),why};}
const ciReasoned=w=>(String(w||'').match(/[A-Za-z]{2,}/g)||[]).length>=3;
function ciRulings(text){const out=[];const T=String(text||'').replace(/\\n/g,'\n');
 for(const raw of T.split('\n')){const l=raw.replace(/\*\*/g,'').replace(/`/g,'').trim();const m=l.match(CI_LINE);if(!m)continue;const kind=m[1].toUpperCase().replace(/\s+/g,' ');const rest=m[2].trim();
  if(kind==='NOT PRESSED'){if(!ciForm(kind,rest))continue;const np=ciNP(rest);out.push({kind,keys:ciKeys(np.ref),ref:np.ref,reason:np.why,line:l});continue;}
  const p=rest.match(CI_PRESSED);if(!p)continue;const ans=/^UNANSWERED$/i.test(p[4])?'UNANSWERED':'ANSWERED';
  out.push({kind,keys:ciKeys(p[1]),ref:p[1].trim(),round:p[2].toUpperCase(),q:p[3],ans,ansRound:p[5]?p[5].toUpperCase():null,line:l});}
 return out;}
// Whether one ruling is valid against the rounds R: its pressing round presses that side and holds the quotation; ANSWERED IN names a later round
// of the holding side that names the verse by book, chapter and verse.
function ciValid(x,side,R){if(x.kind==='NOT PRESSED')return ciReasoned(x.reason)?{ok:true}:{ok:false,why:'NOT PRESSED gives no reason'};
 if(!CI_PRESS[side].includes(x.round))return {ok:false,why:'['+x.round+'] does not press the '+side.toLowerCase()};
 if(typeof R[x.round]!=='string')return {ok:false,why:'the text of ['+x.round+'] could not be read'};
 if(!ciFound(x.q,R[x.round]))return {ok:false,why:'the quotation is not found in ['+x.round+']'};
 if(x.ans==='ANSWERED'){const a=x.ansRound;if(!CI_ANS[side].includes(a)||CI_ORD.indexOf(a)<=CI_ORD.indexOf(x.round))return {ok:false,why:'ANSWERED IN ['+a+'] is not a later round of the '+side.toLowerCase()};
  const K=ciKeys(R[a]);if(![...x.keys].some(k=>K.has(k)))return {ok:false,why:'ANSWERED IN ['+a+'], which does not name '+x.ref+' by book, chapter and verse (ruling 376)'};}
 return {ok:true};}
// The count section of a side: its CONCEDED LINKS (or CHALLENGER CONCEDED LINKS) line and the item lines under it.
function ciCountSection(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const L=T.split('\n');const head=side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:/i:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:/i;
 const STOP=/^[ \t>#-]*(?:CHALLENGE STANDING|DEFENSE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|COLLISION POINTS|CITATION CHECK|OUT-OF-ROUND|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|CITED-IN RULINGS|NOT PRESSED|PRESSED|REASONING|VERDICT)\b/i;
 const i=L.findIndex(l=>head.test(l));if(i<0)return null;const out=[L[i]];for(const l of L.slice(i+1)){if(STOP.test(l))break;out.push(l);}return out.join('\n');}
// The check, on one judgment: items (one K-G9 per side at most) and marks.
function drvCited(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const LG=ciLedger(ptext);if(!LG.DEFENDER&&!LG.CHALLENGER){marks.push('[AUDIT v26: K-G9 PASS: 0 verses ruled -- the prompt holds no cited-in line of the ledger; TRIAL rule]');return {items,marks};}const R=ciRounds(ptext);const RU=ciRulings(text);const pass=[];
 for(const side of ['DEFENDER','CHALLENGER']){const lg=LG[side];const conc=side==='DEFENDER'?dConc:cConc;const st=side==='DEFENDER'?dStand:cStand;
  const missing=[],why=[];const mine=RU.filter(x=>x.kind==='NOT PRESSED'||CI_PRESS[side].includes(x.round)||(lg&&lg.labels.some(l=>[...ciKeys(l)].some(k=>x.keys.has(k)))));
  if(lg)for(const lab of lg.labels){const K=ciKeys(lab);const rs=mine.filter(x=>[...x.keys].some(k=>K.has(k)));if(!rs.length){missing.push(lab);continue;}
   const bad=rs.map(x=>({x,v:ciValid(x,side,R)})).filter(z=>!z.v.ok);if(bad.length===rs.length){missing.push(lab);why.push(lab+': '+bad[0].v.why);}}
  const pu=RU.filter(x=>x.kind==='PRESSED'&&x.ans==='UNANSWERED'&&CI_PRESS[side].includes(x.round)&&ciValid(x,side,R).ok);
  const cs=ciCountSection(text,side);const CK=cs?ciKeys(cs):new Set();const uncounted=pu.filter(x=>typeof conc!=='number'||conc<1||![...x.keys].some(k=>CK.has(k))).map(x=>x.ref);
  if(!missing.length&&!uncounted.length){if(lg)pass.push({side,n:lg.labels.length});continue;}
  const line=(missing.length?'the ledger lists '+lg.labels.length+' verse(s) cited against the '+side.toLowerCase()+' and not named in a later round of it; no valid ruling for '+missing.length+': '+missing.join(', ')+(why.length?' ('+why.join('; ')+')':''):'')+(missing.length&&uncounted.length?'; ':'')+(uncounted.length?'ruled PRESSED and UNANSWERED but not counted in '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+': '+[...new Set(uncounted)].join(', '):'');
  items.push({rule:'K-G9',side,link:side+' CITED-IN',line,missing,uncounted:[...new Set(uncounted)],conc:typeof conc==='number'?conc:0,st,L:(LN&&LN[side])||null});
  marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G9) -- '+side+' CITED-IN: '+line.replace(/[\[\]]/g,'')+'. Ruling 372: a pressed witness left unanswered makes the premise UNEXHIBITED and counts; a NOT PRESSED ruling gives its reason in one clause. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 if(pass.length)marks.push('[AUDIT v26: K-G9 PASS: '+pass.reduce((a,p)=>a+p.n,0)+' verses ruled -- '+pass.map(p=>p.side+' CITED-IN '+p.n).join('; ')+'; TRIAL rule]');
 return {items,marks};}
