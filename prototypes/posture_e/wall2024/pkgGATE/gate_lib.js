// E-GATE (W2; WALL-2024 2242 design, 2243 and 2251 rulings; Eric 23:13 CST "did the judge have statement and the enforcer act on this?").
// After the send-back, the engine applies the judge's own changes (E-APPLY) and reads the corrected judgment again. A line it cannot accept goes
// back to the judge once more, as a GATE item: a change that contradicts the keystone (2251 rules 0 to 2), a change with no line the engine
// reads (NOT APPLIED), a RESULT that differs from the derived one, an ANSWER CHECK the judge grades MISSES whose verse is the footing of a
// collision it grades against the side that pressed it (item B), and a LIVE K-* breach the corrected text raises that the first text did not.
// The judge answers each "GATE: Gn || CHANGE TO: <line> || <reason>" or "GATE: Gn || KEEP || <reason>". A KEEP cures a NOT APPLIED item only.
// Any other item is cured only when the corrected text no longer raises it. Silence counts. Each uncured LIVE item adds 1 to the seat's
// drv_uncured, so the seat is removed for an alternate as with any uncured item.
// RECORD-ONLY: a TRIAL-rule breach; a new item a gate change itself raises; K-G6, K-G7 and K-G8 (drvLedger, drvBroken) are not re-read here.
const GATE_STATUS={'CONTRADICTION':'LIVE','NOT APPLIED':'LIVE','RESULT DIFFERS':'LIVE','ANSWER GROUND':'LIVE','RULE':'LIVE'};
function sbBrokenWord2024(P){const k=P.col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length;const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];
 const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));return k>=1||(n!=null&&2*w>n)||kw;}
// 2251 rule 1. RD: the rounds of the judge's prompt (ciRounds): [CRn] are the DEFENDER's rounds, [DRn] the challenger's (the prompt's own
// headers, "=== [CR3] DEFENDER R3 ..."). A defender grant stands in a [CRn] round. Without the rounds no quote can be found, so nothing is exempt.
function sbKeyExempt2024(keyRaw,P,RD){const l=String(keyRaw||'').replace(/[*_`]+/g,'');const g=(l.match(/\bGROUND\s*:([\s\S]*)$/i)||[null,l.replace(/^[^]*?\bBROKEN\b/i,'')])[1];
 if(RD&&typeof RD==='object'){for(const m of g.matchAll(/\[\s*(CR[1-4])\s*\]\s*[:,]?\s*["“]([^"”]{12,})["”]/gi)){const r=m[1].toUpperCase();
  if(typeof RD[r]==='string'&&/\b(?:grant|grants|granted|concede|concedes|conceded|allow|drop|withdraw|do not claim)\b/i.test(m[2])&&ciFound(m[2],RD[r]))return true;}}
 const cn=P.cn&&P.cn['CONCEDED LINKS'];if(cn){const cu=cn.u;for(const m of g.matchAll(/\bPremise\s+(\d+)\b/gi)){if(new RegExp('\\bPREMISE\\s+'+m[1]+'\\b[^.;]*\\b(?:CONCEDED|UNEXHIBITED)\\b').test(cu))return true;}}
 return false;}
// Item B (2243): ANSWER CHECK: <verse> -- [CRn] -- MEANS: ... -- ANSWER: ... -- MISSES. A MISSES on a [CRn] row leaves the challenger's press
// standing; a collision graded CHALLENGER LINK BROKEN that cites that verse after its grade (footing or GROUND) contradicts it. [DRn] alike, with
// DEFENDER LINK BROKEN. The verse is matched by its reference (book chapter:verse), not by its words.
function gateAnsGround2024(T){const out=[];const P=rcLines(T);const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 for(const raw of String(T||'').split('\n')){const l=raw.replace(/[*_`]+/g,'').trim();const m=l.match(/^(?:[-•]|\d+[.)])?\s*ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i);if(!m)continue;
  const gs=[...l.matchAll(/(?:--|—)\s*(MEETS|MISSES)\b/gi)];if(!gs.length||gs[gs.length-1][1].toUpperCase()!=='MISSES')continue;
  const ref=m[1].replace(/\s+/g,' ').trim();if(!/^(?:[1-3]\s)?[A-Za-z][A-Za-z ]*\s\d+:\d+$/.test(ref))continue;const side=m[2].toUpperCase().startsWith('C')?'CHALLENGER':'DEFENDER';
  const rx=new RegExp('(?:^|[^A-Za-z0-9])'+esc(ref).replace(/ /g,'\\s+')+'(?![0-9]|:\\d)','i');
  for(const z of P.col){if(z.grade!==side+' LINK BROKEN')continue;const zl=z.raw.replace(/[*_`]+/g,'');const at=zl.toUpperCase().indexOf(z.grade);if(at<0)continue;
   if(rx.test(zl.slice(at+z.grade.length)))out.push({key:'ANSWER GROUND|'+ref.toUpperCase()+'|'+m[2].toUpperCase()+'|'+z.link.toUpperCase(),why:'your ANSWER CHECK on '+ref+' ['+m[2].toUpperCase()+'] grades the answer MISSES, so that press stands for the '+side.toLowerCase()+'; yet '+z.link+' is graded '+z.grade+' with '+ref+' among its footing or ground. Change one of the two lines so they agree.',lines:[raw.trim(),z.raw]});}}
 return out;}
function gatePromptText2024(body){try{const b=body||{};const out=[];(b.messages||[]).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);else if(Array.isArray(c))c.forEach(p=>out.push(p&&typeof p.text==='string'?p.text:''));});(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
function sbRoundsOf2024(seat){try{const PB=$('Panel Build').first().json;const j=(PB.judges||[]).find(q=>q.seat===seat);return j&&j.body?ciRounds(gatePromptText2024(j.body)):null;}catch(e){return null;}}
// LIVE K-* breaches drvCheck raises on the corrected text and not on the first text (2243 ask 2: LIVE only; a new TRIAL breach is named, record-only).
function gateNewK2024(T0,T1,F0,F1,ctx){let MK=[];const run=(T,F)=>{PRS_CTX.R=ctx.R||null;PRS_L2BAD=null;const D=drvCheck(T,F.conceded_links,F.challenger_conceded_links,F.defense_standing,F.challenge_standing,!!ctx.ask,ctx.DL||[]);MK=D.marks||[];return D.items||[];};
 const key=x=>x.rule+'|'+(x.side||'')+'|'+(x.link?String(x.link).toUpperCase():String(x.why||'').slice(0,80));
 let a,b;try{a=run(T0,F0);b=run(T1,F1);}catch(e){return {error:String(e&&e.message||e).slice(0,200),items:[]};}
 const k0=new Set(a.map(key));const seen=new Set();const items=[];for(const x of b){const k=key(x);if(k0.has(k)||seen.has(k))continue;seen.add(k);
  const mk=x.link?MK.find(t=>t.includes('('+x.rule+') -- '+x.link)):null;const w=x.why||(mk?mk.replace(/^\[AUDIT v\d+:\s*/,'').replace(/\s*REVIEW THIS ROW\.\]$/,'').replace(/\]$/,''):'');
  items.push({key:'RULE|'+k,rule:x.rule,live:enfStatus(x.rule)==='LIVE',why:(w?String(w):x.rule+(x.link?' '+x.link:'')).slice(0,500),lines:x.line?[String(x.line)]:[]});}
 return {items};}
// One seat: apply the send-back answers, then list every gate item. its: the seat's send-back answers (Send Back Record sb_items).
function gateItems2024(seat,raw,F,its,ctx){const R1=sbApply2024(seat,raw,F,its,ctx.R);if(!R1)return {R1:null,items:[]};const T0=cureJText(raw,true);const T1=R1.text;const items=[];
 for(const x of R1.items){const kind=x.kind;items.push({kind,src:'E-APPLY '+x.sid,sid:x.sid,key:kind+'|'+x.sid,why:x.why,lines:(x.lines&&x.lines.length?x.lines:[]),to:x.to,live:GATE_STATUS[kind]==='LIVE'});}
 for(const x of gateAnsGround2024(T1))items.push({kind:'CONTRADICTION',src:'E-GATE B',key:x.key,why:x.why,lines:x.lines,live:GATE_STATUS['ANSWER GROUND']==='LIVE'});
 const NK=gateNewK2024(T0,T1,F,R1.fields,ctx);for(const x of NK.items)items.push({kind:'RULE '+x.rule,src:'K re-read',key:x.key,why:x.why,lines:x.lines,live:x.live&&GATE_STATUS.RULE==='LIVE'});
 items.forEach((x,i)=>x.gid='G'+(i+1));return {R1,items,T1,newk_error:NK.error||null};}
const GATE_LINE=/GATE\s*:?\s*(?:ITEM\s*)?#?\s*(G\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i;
function gateRead2024(txt){const A={};const J=/^\s*[{\[]/.test(txt);const T2=String(txt||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();const m=l.match(GATE_LINE);if(!m)continue;const id=m[1].replace(/\s+/g,'').toUpperCase();if(A[id])continue;
  A[id]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?String(m[4]||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(m[4]||'')).trim(),line:l};}
 return A;}
// The line a gate CHANGE replaces: the item's line with the same label (collision, KEYSTONE, count, standing) or the same ANSWER CHECK verse and round.
function gateLineFor2024(item,to){const L=item.lines||[];const t=String(to||'');const lab=sbLabel(t);if(lab){const h=L.find(l=>sbLabel(l)===lab);if(h)return h;}
 const ac=s=>{const m=String(s).replace(/[*_`]+/g,'').trim().match(/^(?:[-•]|\d+[.)])?\s*ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i);return m?(m[1].replace(/\s+/g,' ')+'|'+m[2]).toUpperCase():null;};
 const a=ac(t);if(a){const h=L.find(l=>ac(l)===a);if(h)return h;}return L[0]||'';}
// The gate's verdict on each item, after the judge's gate answers are applied with its send-back answers (the last change to a line wins).
function gateCure2024(seat,raw,F,its,G,reply,ctx){const A=gateRead2024(reply||'');const add=[];
 for(const x of G){const a=A[x.gid];if(a&&a.ans==='CHANGE'&&a.to)add.push({seat,sid:x.gid,rule:'E-GATE',item:x.kind,line:gateLineFor2024(x,a.to.replace(/^["“]+|["”]+$/g,'')),ans:'CHANGE',to:a.to,why:a.why});}
 const its2=(its||[]).concat(add);const R2=gateItems2024(seat,raw,F,its2,ctx);const now=new Set((R2.items||[]).map(z=>z.key));const applied=new Set(R2.R1?R2.R1.applied:[]);
 const res=G.map(x=>{const a=A[x.gid];let cured=false,why;
  if(!a){why='no GATE line for this item (silence counts)';}
  else if(x.kind==='NOT APPLIED'){cured=a.ans==='KEEP'||applied.has(x.gid);why=a.ans==='KEEP'?'KEEP: the change stays unapplied':(cured?'the gate change was applied':'the gate change was not applied');}
  else if(a.ans==='KEEP'){const gch=[...applied].some(z=>/^G\d+$/.test(z));cured=gch&&!now.has(x.key);why=cured?'KEEP, and another gate change of this judge cleared the item':'KEEP does not cure a '+x.kind+' item (2243): a line must change';}
  else{cured=!now.has(x.key)&&applied.has(x.gid);why=cured?'the gate change was applied and the item is no longer raised':(!applied.has(x.gid)?'the gate change was not applied':'the corrected text still raises it');}
  return {gid:x.gid,kind:x.kind,src:x.src,live:x.live,ans:a?a.ans:'NO ANSWER',to:a?a.to:'',reason:a?a.why:'',line:a?a.line:null,cured,why};});
 const keys0=new Set(G.map(x=>x.key));const fresh=(R2.items||[]).filter(z=>!keys0.has(z.key)).map(z=>({kind:z.kind,src:z.src,why:z.why}));
 return {res,its2,add,fresh,uncured:res.filter(r=>!r.cured&&r.live).length,R2};}
