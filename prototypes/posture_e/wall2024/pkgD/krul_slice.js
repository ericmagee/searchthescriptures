// WALL-2024 Commitment 11, K-RUL (TRIAL; ruling card, /mnt/project-files/w3/ruling_card_draft.md, operator go 2026-11-05 19:37 CST).
// Every deciding ruling needs a ruling card (RULING / CLAIM / NAMED BY / RULE / APPLIED). Deciding rulings: each number in
// counted_premises_defender and counted_premises_challenger; the KEYSTONE line; each "D<i> vs C<j> (refs): <grade>" line graded DEFENDER LINK
// BROKEN, CHALLENGER LINK BROKEN or WITHDRAWN; each RESTATED D/C line. A ruling with no card, an incomplete card, a NAMED BY quote not in the
// record, a NAMED BY: NONE under a breaking grade, or a RULE quote that differs from the seat's accepted line is one item. It removes no seat.
const __KRUL_HEADS=__KRUL_HEADS_JSON__;
function krulTx(c){return typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';}
function krulAcc(body){try{const b=body||{};const A=(b.messages||[]).map(m=>({role:m&&m.role,t:krulTx(m&&m.content)}));
  (b.contents||[]).forEach(c=>A.push({role:c&&c.role==='model'?'assistant':(c&&c.role),t:(c&&c.parts||[]).map(p=>p&&typeof p.text==='string'?p.text:'').join('')}));
  let acc=null;for(let i=1;i<A.length;i++){if(A[i].role==='assistant'&&A[i-1].role==='user'&&/^POSTURE (?:FOR ACCEPTANCE|RETURNED)/.test(A[i-1].t))acc=A[i].t;}return acc;}catch(e){return null;}}
function krulOwn(acc){const out={};if(typeof acc!=='string')return out;const st=l=>String(l).replace(/^[\s>#*_\-•]+/,'').replace(/[\s*_]+$/,'').trim();const L=acc.split('\n').map(st);
 __KRUL_HEADS.forEach((h,k)=>{const at=L.findIndex(l=>l.startsWith(h));if(at<0)return;let own=L[at].slice(h.length).replace(/^[\s:\-–—*_]+/,'').trim();
  if(!own){for(let i=at+1;i<L.length;i++){if(!L[i])continue;if(/^Commitment\s*\d/i.test(L[i])||L[i].includes('I ACCEPT'))break;own=L[i];break;}}if(own)out[k+1]=own;});return out;}
function krulNorm(s){return String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/\[[lr]\d\]/g,' ').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]+/g,' ').replace(/\s+/g,' ').trim();}
function krulFound(q,src){const parts=String(q||'').split(/\.\.\.|\u2026/).map(krulNorm).filter(p=>p.split(' ').length>=2);if(!parts.length)return false;const S=' '+krulNorm(src)+' ';return parts.every(p=>S.includes(' '+p+' '));}
function krulText(text){let T=String(text||'');let J=null;const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){J=null;}}return {T:T.replace(/\n\n\[AUDIT v[\s\S]*$/,''),J};}
function krulRulings(T,CP){const out=[];const seen=new Set();const add=(id,side)=>{if(!seen.has(id)){seen.add(id);out.push({id,side});}};
 for(const side of ['DEFENDER','CHALLENGER'])for(const n of ((CP&&Array.isArray(CP[side]))?CP[side]:[]))add(side+' premise '+n,side);
 const L=T.split('\n');if(L.some(l=>/^\s*[-*•]?\s*\**KEYSTONE\s*:/.test(l)))add('keystone','JUDGE');
 for(const l of L){let m=l.match(/^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\b/);if(m)add(m[1]+' vs '+m[2],'JUDGE');
  m=l.match(/^\s*(?:[-•*]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/);if(m)add(m[1]+' vs '+m[2],'JUDGE');}
 return out;}
function krulCards(T){const L=String(T||'').split('\n').map(l=>l.replace(/[*`]+/g,'').trim());const cards=[];
 for(let i=0;i<L.length;i++){const m=L[i].match(/^(?:[-•]\s*)?RULING\s*(?:--|—|–|:)\s*(.*)$/i);if(!m)continue;const segs=m[1].split(/\s+(?:--|—|–)\s+/);const c={head:L[i],target:segs[0]||'',grade:(segs.length>1?segs[segs.length-1]:'').trim(),f:{}};
  for(let k=i+1;k<L.length&&k<=i+8;k++){if(/^(?:[-•]\s*)?RULING\s*(?:--|—|–|:)/i.test(L[k]))break;const f=L[k].match(/^(?:[-•]\s*)?(CLAIM|NAMED BY|RULE|APPLIED)\s*:\s*(.*)$/i);if(f&&!(f[1].toUpperCase() in c.f))c.f[f[1].toUpperCase()]=f[2].trim();}
  cards.push(c);}
 return cards;}
function krulMatch(c,id){const t=c.target;if(id==='keystone')return /\bkeystone\b/i.test(t);
 let m=id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(m)return new RegExp('\\b'+m[1]+'\\b','i').test(t)&&new RegExp('\\bpremise\\s*'+m[2]+'\\b','i').test(t);
 m=id.match(/^(D\d+) vs (C\d+)$/);if(m)return new RegExp('\\b'+m[1]+'\\s*vs\\.?\\s*'+m[2]+'\\b','i').test(t);return false;}
const KRUL_BAD=/^(?:UNEXHIBITED|VOID|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|BROKEN)\b/i;
function krulCheckCard(c,SRC,own){if(!c)return 'no ruling card';const miss=['CLAIM','NAMED BY','RULE','APPLIED'].filter(k=>!c.f[k]);if(miss.length)return 'the card has no '+miss.join(', ')+' line';
 const nb=c.f['NAMED BY'];if(/^NONE\b/i.test(nb)){if(KRUL_BAD.test(c.grade.toUpperCase()))return 'NAMED BY: NONE, so the ruling cannot rest on that meaning, yet it is graded '+c.grade;}
 else{const qs=[...nb.matchAll(/["\u201c]([^"\u201d]{3,})["\u201d]/g)].map(m=>m[1]);if(!qs.length)return 'the NAMED BY line quotes nothing';const bad=qs.find(q=>!krulFound(q,SRC));if(bad)return 'the NAMED BY quote "'+bad.slice(0,120)+'" does not stand in the record';}
 const r=c.f['RULE'].match(/Commitment\s*(\d+)\s*(?:--|—|–|:)?\s*["\u201c]([^"\u201d]+)["\u201d]/i);if(!r)return 'the RULE line is not in the form Commitment <N> -- "<your accepted line>"';
 if(own&&own[+r[1]]&&krulNorm(own[+r[1]])!==krulNorm(r[2]))return 'the RULE quote differs from your accepted line for Commitment '+r[1]+' ("'+own[+r[1]].slice(0,120)+'")';
 return null;}
function krulLines2024(text,R,CP,ACC,PT){const items=[],marks=[];if(typeof text!=='string'||!text.trim())return {items,marks};const X=krulText(text);
 const cp=CP||(X.J?{DEFENDER:X.J.counted_premises_defender,CHALLENGER:X.J.counted_premises_challenger}:null);const RUL=krulRulings(X.T,cp);if(!RUL.length)return {items,marks};
 const cards=krulCards(X.T);const own=krulOwn(ACC);const SRC=Object.values(R||{}).filter(v=>typeof v==='string').join('\n')+'\n'+String(PT||'');
 for(const u of RUL){const c=cards.find(c=>krulMatch(c,u.id));const why=krulCheckCard(c,SRC,own);if(!why)continue;
  items.push({rule:'K-RUL',side:u.side,link:u.id,ruling:u.id,line:'deciding ruling '+u.id+': '+why+'; answer with the five-line card (RULING, CLAIM, NAMED BY, RULE, APPLIED)'});
  marks.push('[AUDIT v34: RULING WITHOUT A VALID CARD (K-RUL; Commitment 11) -- '+u.id+': '+why.replace(/[\[\]"]/g,'')+'. TRIAL rule: it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
// cure (form only, TRIAL): K-CON by a capture line quoting 6 consecutive words of the flagged sentence; K-CMT by a RESPONSE naming a commitment
// or NOT A GRADE; K-RUL by a valid card for the ruling in the cure reply.
function krulCure(x,replyText,rounds,respText){const T=String(replyText||'');
 if(x.rule==='K-RUL'){const c=krulCards(T).find(c=>krulMatch(c,x.ruling||x.link));const why=krulCheckCard(c,Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n'),null);return why?{st:'UNCURED',why}:{st:'CURED',why:'a valid ruling card for '+(x.ruling||x.link),line:c.head};}
 if(x.rule==='K-CMT'){const rp=String(respText||'');if(/\bCommitment\s*\d+\b/i.test(rp)||/\bNOT A GRADE\b/.test(rp))return {st:'CURED',why:'the response names the commitment, or NOT A GRADE',line:rp};return {st:'UNCURED',why:rp?'the RESPONSE names no Commitment N and no NOT A GRADE':'no written response'};}
 if(x.rule==='K-CON'){const qs=[...String(x.line||'').matchAll(/"([^"]{12,})"/g)].map(m=>m[1]); /* any quoted sentence of the item, EARLIER or LATER (W2, reply 2160) */
  const runs=[];for(const q of qs){const w=krulNorm(q).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++)runs.push(w.slice(i,i+6).join(' '));}
  const ln=T.split('\n').find(l=>/^\s*(?:[-•*]\s*)?\**(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b)/i.test(l)&&!/NONE FOUND/i.test(l)&&runs.some(r=>(' '+krulNorm(l)+' ').includes(' '+r+' ')));
  return ln?{st:'CURED',why:'captured with a quote of the flagged sentence',line:ln.trim()}:{st:'UNCURED',why:'no CONTRADICTION, NOT HELD or REASSERTED IN line quotes the flagged sentence'};}
 return null;}

// a RESTATED D/C line written in a cure reply, under any rule, needs a valid card in that reply (W3, reply 2157; R7). One recorded K-RUL row
// per such line (TRIAL, UNCURED, recorded only); a line already answered by a K-RUL item of this cure is not counted twice.
function krulRestated(items,reply,rounds){const out=[];const T=krulText(reply&&reply.ok?reply.text:'').T;if(!T)return out;
 const covered=new Set((items||[]).filter(x=>x&&x.rule==='K-RUL').map(x=>x.ruling||x.link));const cards=krulCards(T);const SRC=Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n');const seen=new Set();
 for(const l of T.split('\n')){const m=l.replace(/[*`]+/g,'').match(/^\s*(?:[-•]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);if(!m)continue;const id=m[1].toUpperCase()+' vs '+m[2].toUpperCase();if(covered.has(id)||seen.has(id))continue;seen.add(id);
  const why=krulCheckCard(cards.find(c=>krulMatch(c,id)),SRC,null);if(!why)continue;
  out.push({rule:'K-RUL',side:'JUDGE',link:id+' (restated in the cure)',ruling:id,line:'restated line '+id+' in the cure reply: '+why,judge_statement:null,response:null,status:'UNCURED',why:'TRIAL, recorded only: the cure reply restated '+id+' without a valid ruling card ('+why+')',statement:l.trim().slice(0,400),kinds:[]});}
 return out;}