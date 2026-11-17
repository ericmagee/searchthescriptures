const ECW=(()=>{ /* pkgECW (ASK 345, Wall 7221/7223/7225; passes W2 7224, W1 7229): a STANDS push on meaning shows the row words that carry it; one gate for any rule (E-COL now; ASK 346 calls it for E-HOLD) */
 const LIVE=true;const HOLD=true; /* E-HOLD pushes toward UNDERDETERMINED: ASK 346 turns this on */
 const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’ʼ`]/g,"'").replace(/[“”]/g,'"').replace(/\[(?:l[1-4]|[cd]r[1-4])\]/g,' ').replace(/[\[\]]/g,'').replace(/'/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿]+/g,' ').replace(/\s+/g,' ').trim();
 const NM=s=>String(s==null?'':s).replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/\([^)]*:\s*(?:Gr\.|Heb\.|or,|that is)[^)]*\)/g,' ');
 const has=(t,q)=>{const a=' '+N(t)+' ',b=N(q);return !!b&&a.includes(' '+b+' ');};
 const run6=(s,txts,not)=>{const w=N(s).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(not&&(' '+not+' ').includes(' '+r+' '))continue;if(txts.some(t=>(' '+N(t)+' ').includes(' '+r+' ')))return r;}return null;};
 const EX=/\b(?:rests? on|rest(?:ing|s)? upon|by|from) (?:an |the )?absence\b|\bno verse (?:states|says|names)|\bstating verse|\bnamed in an answer\b|\banswered by name\b|\bwitness ledger\b|\bthe ledger\b|\bfooting rule\b|\bno footing\b|\bborrowed (?:footing|from)\b|\bcontested links\b|\bno (?:answer(?:'s|ing)?|challenger|defender)(?: answer| answering)?(?:'s)? (?:own )?(?:words )?(?:are |is )?quoted|\bquotes no (?:answer|answering)|\bno quoted answer/i; /* grounds that are not a reading of the answer: absence, the witness ledger, the footing rule, a line that quotes no answer words */
 const BK='((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?)';
 const REF=new RegExp(BK+'\\s+(\\d{1,3}):(\\d{1,3})(?:\\s*[-–]\\s*(\\d{1,3}))?');
 /* the CARRIED BY field: only the last one on the enforcer's own reply line, outside its quotations (a judge FORCED line it quotes may hold the K-FC field of the same name) */
 function field(why){const w=String(why||'').replace(/\\+"/g,'"');let at=-1;const re=/CARRIED BY\s*:/gi;let m;while((m=re.exec(w))){const before=w.slice(0,m.index);const q=(before.match(/"/g)||[]).length+(before.match(/“/g)||[]).length-(before.match(/”/g)||[]).length;if(q%2===0)at=m.index;}
  if(at<0)return null;const f=w.slice(at).replace(/^CARRIED BY\s*:\s*/i,'').trim();
  const l2=f.match(new RegExp('^\\[L2\\]\\s*([^(\\n]{1,60}?)\\s*\\(\\s*([GH])\\s*0*(\\d{1,5})\\b[^)]*\\)\\s*(?:,|at|in|of)?\\s*'+REF.source));
  if(l2)return {kind:'L2',word:l2[1].trim(),num:l2[2].toUpperCase()+l2[3],book:l2[4],ch:+l2[5],v1:+l2[6],v2:+(l2[7]||l2[6]),ref:l2[4]+' '+l2[5]+':'+l2[6]+(l2[7]?'-'+l2[7]:''),raw:f.slice(0,300)};
  const r=f.match(new RegExp('^(?:\\[L[1-3]\\]\\s*)?'+REF.source+'[\\s,:—-]*["“]([^"”]{4,600})["”]'));
  if(r)return {kind:'ROW',book:r[1],ch:+r[2],v1:+r[3],v2:+(r[4]||r[3]),ref:r[1]+' '+r[2]+':'+r[3]+(r[4]?'-'+r[4]:''),words:r[5].trim(),raw:f.slice(0,300)};
  return {kind:'BAD',raw:f.slice(0,300)};}
 function verseText(c,rows){const parts=[];for(let n=c.v1;n<=c.v2;n++){const x=(rows||[]).find(q=>q&&String(q.book)===c.book&&+q.chapter===c.ch&&+q.verse===n);if(!x)return null;parts.push(NM(x.text));}return parts.join(' ');}
 function cites(c,texts){const b=c.book.replace(/\s+/g,'\\s+');for(const t of texts){const T=String(t||'');for(const m of T.matchAll(new RegExp('\\b'+b+'\\.?\\s+'+c.ch+'\\s*:\\s*(\\d{1,3})(?:\\s*[-–]\\s*(\\d{1,3}))?','g'))){const a=+m[1],z=+(m[2]||m[1]);if(c.v1>=a&&c.v2<=z)return true;}
   for(const m of T.matchAll(new RegExp('\\b'+b+'\\.?\\s+'+c.ch+'\\s*:','g'))){const tail=T.slice(m.index,m.index+400);for(const k of tail.matchAll(new RegExp('(?:^|[^0-9:])'+c.ch+'\\s*:\\s*(\\d{1,3})(?:\\s*[-–]\\s*(\\d{1,3}))?(?![0-9])','g'))){const a=+k[1],z=+(k[2]||k[1]);if(c.v1>=a&&c.v2<=z)return true;}}}return false;}
 function side(line,item){const L=String(line||'').replace(/\\+"/g,'"');const am=L.match(/ANSWER\s*\[\s*(?:([CD])R([1-4])|(Defender|Challenger))/i);
  const s=am?(am[1]?am[1].toUpperCase():(/^d/i.test(am[3])?'C':'D')):/CHALLENGER LINK BROKEN/.test(L)?'D':/DEFENDER LINK BROKEN/.test(L)?'C':null;return {s,round:am&&am[1]?am[1].toUpperCase()+'R'+am[2]:null};}
 function quotesIn(why,c){const w=String(why||'').replace(/\\+"/g,'"');const cut=c&&c.raw?w.lastIndexOf(c.raw.slice(0,20)):-1;const body=(cut>0?w.slice(0,cut):w);const out=[];for(const m of body.matchAll(/"([^"\n]{8,})"|“([^”\n]{8,})”/g))out.push(m[1]||m[2]);return out;}
 function inOrder(q,t){const ps=String(q).split(/\.\.\.|…/).map(N).filter(x=>x.split(' ').length>=2);if(!ps.length)return true;const T=' '+N(t)+' ';let at=0;for(const p of ps){const k=T.indexOf(' '+p+' ',at);if(k<0)return false;at=k+p.length+1;}return true;}
 /* ASK 355 (Wall 7487/7490; reviews W3 7489, W2 7492): the line's own pressed verse = the references at the head of the collision line and the GROUND's [L1] verse; a FORCED item reads them from the same seat's collision line for the pair */
 function pressed(x,sib){let L=String(x&&x.flagged_line||'').replace(/\\+"/g,'"');let from='line';const fm=L.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?FORCED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)\b/i);
  if(fm){const re=new RegExp('^\\s*(?:[-•]\\s*|\\d+[.)]\\s*)?'+fm[1]+'\\s+vs\\.?\\s+'+fm[2]+'\\b','i');const s=(sib||[]).find(y=>y&&y!==x&&y.rule===x.rule&&y.item===x.item&&String(y.seat||'')===String(x.seat||'')&&re.test(String(y.flagged_line||'')));if(!s)return {refs:[],from:null};L=String(s.flagged_line).replace(/\\+"/g,'"');from='collision line';}
  const out=[];const add=t=>{for(const m of String(t||'').matchAll(new RegExp(REF.source,'g')))out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3])});};
  const h=L.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?D\d+\s+vs\.?\s+C\d+\s*\(([^)]*)\)/i);if(h)add(h[1]);
  const gi=L.search(/GROUND\s*:/i);if(gi>=0)for(const g of L.slice(gi).matchAll(/\[L1\]([\s\S]*?)(?=\[L[1-4]\]|\s\|\s|\s--\s|$)/gi))add(g[1].replace(/"[^"]*"|“[^”]*”/g,' ')); /* rev 2 (W3 7502 F1): every [L1] segment of the GROUND */
  return {refs:out,from};}
 function onPressed(c,pv){return (pv&&pv.refs||[]).some(p=>p.book===c.book&&p.ch===c.ch&&c.v1<=p.v2&&c.v2>=p.v1);}
 function pvHeld(x,c,ctx){const pv=pressed(x,ctx&&ctx.sib);return onPressed(c,pv)?{applies:true,send:false,why:'its CARRIED BY '+c.ref+' is the line\'s own pressed verse'+(pv.from==='collision line'?', read from its collision line':'')+'; the words in dispute cannot carry a rival reading of themselves; a rival reading is carried by another row read with it (Commitment 16; ASK 355)'}:null;}
 /* gate: {applies:false} | {send:true,note,cb} | {send:false,why} */
 function gate(x,v,ctx){if(!v||v.v!=='DISAGREE')return {applies:false};const want=x.rule==='E-COL'?'STANDS':(HOLD&&x.rule==='E-HOLD')?'UNDERDETERMINED':null;if(!want||v.right!==want)return {applies:false};
  const why=String(v.why||'');if(EX.test(why)&&!field(why))return {applies:false,exempt:true}; /* ASK 355: a reply line that names CARRIED BY offers a rival reading and goes through the gate */
  const R=ctx&&ctx.R;const sd=side(x.flagged_line,x.item);if(!R||!sd.s){const c0=field(why);const ph=c0&&c0.kind!=='BAD'?pvHeld(x,c0,ctx):null;if(ph)return ph;} /* rev 2: the pressed-verse check runs before the NOT CHECKED path too */
  if(!R||!sd.s)return {applies:true,send:true,note:'NOT CHECKED: '+(!R?'no rounds were read':'the line names no answering side')};
  const keys=Object.keys(R).filter(k=>k[0]===sd.s&&/^[CD]R[1-4]$/.test(k));const ans=(sd.round&&R[sd.round]?[sd.round]:keys).map(k=>String(R[k]||''));
  const c=field(why);if(!c)return {applies:true,send:false,why:'the push names no CARRIED BY row'};if(c.kind==='BAD')return {applies:true,send:false,why:'its CARRIED BY is not in a form the code reads: '+c.raw.slice(0,120)};
  {const ph=pvHeld(x,c,ctx);if(ph)return ph;}
  if(!cites(c,ans))return {applies:true,send:false,why:'its CARRIED BY reference '+c.ref+' is not cited in the answering round'+(sd.round?' '+sd.round:'s')};
  const allR=Object.keys(R).filter(k=>/^[CD]R[1-4]$/.test(k)).map(k=>String(R[k]||''));const vt=verseText(c,ctx.rows);
  for(const q of quotesIn(why,c)){if(N(q).split(' ').length<3)continue;if(ans.some(t=>inOrder(q,t)))continue;if(allR.some(t=>inOrder(q,t))||has(x.flagged_line,q)||(vt&&inOrder(q,vt))||(ctx.rows||[]).some(r=>inOrder(q,NM(r.text))))continue;
   return {applies:true,send:false,why:'the words it quotes, "'+String(q).slice(0,120)+'", are not found in that order in any round, in the line or in a verse'};}
  if(c.kind==='ROW'){const n=N(c.words).split(' ').filter(Boolean).length;if(n<6)return {applies:true,send:false,why:'its CARRIED BY quotes '+n+' words of '+c.ref+', fewer than 6'};
   if(vt==null)return {applies:true,send:true,cb:{kind:'ROW',ref:c.ref,words:c.words,text:''},note:'CARRIED BY '+c.ref+' "'+c.words.slice(0,200)+'"; NOT CHECKED against the verse: '+c.ref+' was not read this run'};
   const r6=run6(c.words,[vt]);if(!r6||!inOrder(c.words,vt))return {applies:true,send:false,why:'its CARRIED BY words "'+c.words.slice(0,120)+'" are not 6 words in a row of '+c.ref+' as the record holds it'};
   return {applies:true,send:true,cb:{kind:'ROW',ref:c.ref,words:c.words,text:vt},note:'CARRIED BY '+c.ref+' "'+c.words.slice(0,200)+'": the words stand in the verse and the answering round cites it'};}
  const W=(ctx.words||[]).filter(r=>r&&String(r.book)===c.book&&+r.chapter===c.ch&&+r.verse>=c.v1&&+r.verse<=c.v2);
  if(!W.length)return {applies:true,send:true,cb:{kind:'L2',ref:c.ref,word:c.word,num:c.num,text:vt||''},note:'CARRIED BY [L2] '+c.word+' '+c.num+' at '+c.ref+'; NOT CHECKED against original_words: the verse was not read this run'};
  if(!W.some(r=>String(r.strongs_number||'').toUpperCase().replace(/^([GH])0*/,'$1')===c.num))return {applies:true,send:false,why:'its CARRIED BY word '+c.num+' is not held at '+c.ref+' in original_words'};
  return {applies:true,send:true,cb:{kind:'L2',ref:c.ref,word:c.word,num:c.num,text:vt||''},note:'CARRIED BY [L2] '+c.word+' '+c.num+' at '+c.ref+': original_words holds it there and the answering round cites the verse'};}
 const clean=s=>String(s||'').replace(/[()]/g,' ').replace(/\s+/g,' ').trim();
 /* the Record nodes: apply the gate to each row, reading the enforcer's full sentence (not the 600-character cut in cure_reason) */
 function apply(rows,ids,V,R){const st={checked:0,held:0,sent:0,exempt:0,skipped:false};if(!LIVE||!Array.isArray(rows)||!Array.isArray(ids)||ids.length>rows.length){st.skipped=true;return st;}
  let cv=[],ow=[];try{cv=$('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book);}catch(e){cv=[];}try{ow=$('L2 Words').all().map(i=>i.json).filter(r=>r&&r.book);}catch(e){ow=[];}
  ids.forEach((x,k)=>{const r=rows[k];if(!r||r.rule!==x.rule||r.item!==x.item)return;const v=V[String(x.id).toUpperCase()];const g=gate(x,v,{R,rows:cv,words:ow,sib:ids});if(g.exempt)st.exempt++;if(!g.applies)return;st.checked++;
   const cr=String(r.cure_reason||'');if(!/^ENFORCER DISAGREE\b/.test(cr))return;
   if(!g.send){st.held++;r.cure_reason=cr.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgECW, recorded, not sent back: '+clean(g.why)+')');return;}
   st.sent++;const at=cr.lastIndexOf(' (judge wrote ');const tag=' [pkgECW code check: '+clean(g.note)+']';r.cure_reason=at>=0?cr.slice(0,at)+tag+cr.slice(at):cr+tag;});return st;}
 /* the Send Back Build nodes: the row the judge is shown, read from the code-check note only */
 function item(x){const cr=String(x&&x.cure_reason||'');const m=cr.match(/\[pkgECW code check: CARRIED BY (?:\[L2\] (.+?) ([GH]\d+) at )?((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d{1,3}:\d{1,3}(?:-\d{1,3})?)(?: "([^"]*)")?[:;]/);if(!m)return null;
  const c=String(m[3]).match(new RegExp('^'+REF.source));if(!c)return null;const cc={book:c[1],ch:+c[2],v1:+c[3],v2:+(c[4]||c[3])};let rows=[];try{rows=$('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book);}catch(e){rows=[];}
  const vt=verseText(cc,rows);return {kind:m[2]?'L2':'ROW',ref:m[3],word:m[1]||null,num:m[2]||null,words:m[4]||null,text:vt||m[4]||''};}
 function show(e){if(!e)return '';return '\nTHE ROW THE ENFORCER SAYS CARRIES THE READING (pkgECW): '+e.ref+(e.kind==='L2'?' ([L2] '+e.word+', '+e.num+')':'')+(e.text?' "'+String(e.text).slice(0,600)+'"':'')+'. A third KEEP also cures this item: quote at least 6 words in a row of that row'+(e.text?' as given here':'')+', and at least 6 words in a row of the meaning pressed as the pressing side wrote it, and say that the row does not carry the rival reading. The code checks only the two quotations; the meaning is yours to decide (ruling 428).';}
 /* the Send Back Record nodes: the third KEEP, checked against the exact row text the judge was shown */
 function keep3(why,e,PRS){if(!e)return null;const rowT=String(e.text||'');if(!rowT){const b=run6(why,PRS||[]);const rf=new RegExp(String(e.ref).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+'));return b&&rf.test(String(why||''))?'names the row the enforcer named ('+e.ref+', its words not read this run) and quotes the meaning pressed ("'+b+'") (pkgECW third KEEP)':null;}const a=run6(why,[rowT]);if(!a)return null;const b=run6(why,PRS||[],N(rowT));if(!b)return null;return 'quotes the row the enforcer named ('+e.ref+': "'+a+'") and the meaning pressed ("'+b+'") (pkgECW third KEEP)';}
 function showHold(e){if(!e)return '';return '\nTHE ROW THE ENFORCER SAYS LEAVES THE POINT OPEN (pkgECW, ASK 346): '+e.ref+(e.kind==="L2"?' ([L2] '+e.word+', '+e.num+')':'')+(e.text?' "'+String(e.text).slice(0,600)+'"':'')+'. You keep the decision: KEEP your grade with a sentence that quotes what that row says and what the answer says, or CHANGE it.';}
 function label(rule){if(rule==='E-COL')return 'E-COL ENFORCED, pkgECF: a DISAGREE is sent back and an uncured item counts against the seat';
  if(rule==='E-B7')return 'E-B7 ENFORCED, pkgEB7: a DISAGREE is sent back and an uncured item counts against the seat';
  if(rule==='E-SYN'||rule==='K-W')return 'RECORD-ONLY: not sent back';
  return 'SENT BACK: a DISAGREE is sent back; an uncured item counts against the seat only under an enforced package its CURE note names, such as pkgUND, pkgUNA or pkgABS; a silent item always counts';}
 return {LIVE,N,field,pressed,onPressed,pvHeld,gate,apply,item,show,showHold,keep3,label,cites,verseText};})();