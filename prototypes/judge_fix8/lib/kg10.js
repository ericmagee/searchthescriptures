// judge_fix8 K2 (md_notes_rulings 392, the operator: "a press must have a premise behind it; a verse pressed without one isn't a witness"):
// a pressed witness is a verse carried under PRESSED WITH: beside a numbered premise of the list against that side (against the defender: the
// list that closes [DR2]; against the challenger: the CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3]). The ledger's "cited in"
// verses are not witnesses, so K-G9 (a ruling on every cited-in verse) is retired. K-G10 (TRIAL, ENF_STATUS) marks a seat that counts a premise
// UNEXHIBITED on a verse no listed premise of that side's list carries under PRESSED WITH: (runs 32284 ChatGPT, Luke 3:31; 32293 Sol, Luke 1:27
// and Matthew 1:22). It reads the seat's count section (CONCEDED LINKS or CHALLENGER CONCEDED LINKS and the item lines under it), one segment
// per premise named there; a segment tagged UNEXHIBITED on a witness ground (unanswered, unnamed, pressed, witness, no later answer, ruling
// 372) names as its witnesses the verses of the clauses that say a verse was left unanswered and are not footing clauses (exhibit, footing, a
// layer tag, quotations, prior layers). A premise is marked only when every witness it is counted on is carried under no PRESSED WITH: and its
// segment states no footing ground as well (fewer than two layers, only [L1], no footing): a premise also counted on a true witness, or on its
// footing, is counted rightly (run 32302 GLM, premise 4: Luke 3:31 under PRESSED WITH, Matthew 1:1 not). A premise the seat ruled VOID is skipped. Cure: a CORRECTED COUNT without the premise (and the standing that count makes true), or a STATEMENT
// for the item quoting the PRESSED WITH: line that carries the verse.
// judge_fix8 R13 (the operator, md_notes_rulings 393): a listed premise carries at most 8 pressed verses under PRESSED WITH:, both sides; the
// verses after the 8th (in the order written) are not witnesses (ruling 392 applies to them) and the system lists them as over the cap.
const PW_CAP=8;
const PW_ROUND={DEFENDER:'DR2',CHALLENGER:'CR3'};
const pwHead=side=>side==='CHALLENGER'?/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
// The listed premises against a side, each with its PRESSED WITH: segment (to the item's end or its first blank line) and the verses it carries.
function pwList(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return null;
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);let seg=j<0?'':x.slice(j);const b=seg.search(/\n\s*\n/);if(b>=0)seg=seg.slice(0,b);
  const body=seg.replace(/^PRESSED WITH\s*:\s*/i,'');const none=/^[\s*_]*none\b/i.test(body);
  const K=none||j<0?[]:[...ciKeys(body)]; /* judge_fix8 R13 (md_notes_rulings 393): at most PW_CAP pressed verses per premise; a verse beyond the cap is not a witness */
  return {n:k+1,has:j>=0,seg:none?'':seg,keys:new Set(K.slice(0,PW_CAP)),over:K.slice(PW_CAP)};});}
const PW_SEG=/(^|\n|[;.]\s+|--\s*|—\s*|:\s+)(?:[-•>]\s*)?(?:\d+[.)]\s*)?[*_]*\s*premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\b(?:\s*\(LINK\s+(?:\d+|none)\))?[*_]*(?=\s*(?:is\b|are\b|:|--|—|\(|UNEXHIBITED|CONCEDED|VOID|SUPPORTED|SPARED|STANDS|NOT\b))/gi;
const PW_WIT=/unanswer|unnamed|not named|no later|pressed|witness|ruling 372|\b372\b/i;
const PW_FOOT=/\bexhibit|\bfooting\b|\[L[1-3]\]|\bquotations\b|prior layers?/i;
const PW_UNANS=/unanswer|unnamed|not named|no later|not answered|receives no|\bleft\b|leaving|names or answers|without (?:an |any )?answer/i;
const PW_FOOTGROUND=/fewer than two|exhibits? only|only \[L[1-3]\]|no (?:layer )?footing|inadequate footing|one layer kind|single layer/i;
// The seat's premise segments of one side's count section that rest UNEXHIBITED on a witness, with the verses each names as its witness.
function pwSegments(text,side){const cs=ciCountSection(text,side);if(!cs)return [];const at=[];let m;PW_SEG.lastIndex=0;
 while((m=PW_SEG.exec(cs)))at.push({i:m.index+m[1].length,ns:m[2].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0)});
 return at.map((x,k)=>{const seg=cs.slice(x.i,k+1<at.length?at[k+1].i:cs.length);const wit=/UNEXHIBITED/.test(seg)&&PW_WIT.test(seg);
  const cl=seg.split(/;\s+|,\s+(?:and|but|while|whereas)\s+|(?<=[.!?]["”'’)]?)\s+(?=[\[("“A-Z])|\s+and\s+(?=(?:it\s+|that\s+block\s+|the\s+block\s+|only\s+)?(?:exhibit|offer|show|rest|give)s?\b)|\s+but\s+(?=(?:it\s+|only\s+)?exhibit)/);
  const keys=new Set();if(wit)for(const c of cl){if(PW_FOOT.test(c)||!PW_UNANS.test(c))continue;for(const k0 of ciKeys(c))keys.add(k0);}
  return {ns:x.ns,seg:seg.trim(),wit,foot:PW_FOOTGROUND.test(seg),keys:[...keys]};});}
function drvPressWith(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const R=ciRounds(ptext);let read=0;
 for(const side of ['DEFENDER','CHALLENGER']){const conc=side==='DEFENDER'?dConc:cConc;if(typeof conc!=='number'||conc<1)continue;
  const PL=pwList(R,side);if(!PL)continue;const PW=new Set();PL.forEach(p=>p.keys.forEach(k=>PW.add(k)));const VD=lbVoid(text,side);
  for(const sg of pwSegments(text,side)){if(!sg.wit)continue;read++;const bad=sg.keys.filter(k=>!PW.has(k));if(!bad.length||bad.length<sg.keys.length||sg.foot)continue;
   for(const n of sg.ns){if(VD.all||VD.set.has(n))continue;const id=side+' premise '+n;if(items.some(y=>y.link===id))continue;
    items.push({rule:'K-G10',side,link:id,premise:n,line:'premise '+n+': counted UNEXHIBITED on '+bad.join(', ')+', which no premise of the list that closes ['+PW_ROUND[side]+'] carries under PRESSED WITH; the count reads: '+sg.seg.replace(/\s+/g,' ').slice(0,360),verses:bad,conc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||PL.length,void:lbVoidList(VD),
     pw:PL.filter(p=>p.has).map(p=>({n:p.n,seg:p.seg.slice(0,1500)}))});
    marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G10) -- '+id+': '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' counts it UNEXHIBITED on '+bad.join(', ')+', which no premise of the list against the '+side.toLowerCase()+' (the list that closes '+PW_ROUND[side]+') carries under PRESSED WITH. Ruling 392: a press must have a premise behind it; a verse pressed without one is not a witness, and leaving it unanswered never counts. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}}
 const pass=!items.length; // judge_fix8 K5 (1): the collision check K-G11 (lib/kg11.js) runs in the same call
 {const B=drvBrokenPW(text,R);B.items.forEach(x=>items.push(x));B.marks.forEach(x=>marks.push(x));}
 {const V=drvVoid(text,ptext,dConc,cConc,dStand,cStand,LN);V.items.forEach(x=>items.push(x));V.marks.forEach(x=>marks.push(x));} // judge_fix8 K6: K-V (lib/kv.js)
 {const X=drvLxx(text,ptext);X.items.forEach(x=>items.push(x));X.marks.forEach(x=>marks.push(x));} // judge_fix8 R11: K-LXX (lib/klxx.js)
 if(pass)marks.push('[AUDIT v26: K-G10 PASS: '+read+' UNEXHIBITED witness ground'+(read===1?'':'s')+' read; every witness named is carried under a listed premise\'s PRESSED WITH; TRIAL rule]');
 return {items,marks};}
