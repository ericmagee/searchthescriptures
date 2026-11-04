// ruling 427 (md_notes_rulings 427: "approved, build it"; the operator's anti-cheat idea, ruling 426 item 7.3): the closing-round anti-cheat check.
// After both closes and before the judges are seated, one DeepSeek call reads each side's close-round blocks that name a verse beside the
// same side's own earlier words on that verse (its rounds 1 to 3), and answers CONSISTENT, REVERSED or NO EARLIER READING. A REVERSED close
// sentence is marked to the judges and disregarded (ruling 412 item 3 widened from grants and narrowings to a side's own reading of a verse).
// TRIAL: marks only; it removes no seat and changes no count. Anticheat Record checks every quote it returns against the rounds.
// s427c (dry re-grade 32703 missed the known case, Deuteronomy 22:24 CONSISTENT, and marked a fuller gloss REVERSED): the rules read each side's
// conclusions from the verse, name re-assertion of a withdrawn claim, and keep a fuller gloss CONSISTENT; the example is not drawn from any test case.
// s427d (acx_only 32713: the defender's own close withdrawal on Matthew 1:19 was marked REVERSED): a withdrawal made in the close is CONSISTENT here.
const S=$('Init Seats').first().json;let RS=null;try{RS=$('Resolve Seats').first().json;}catch(e){RS=null;}
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}
let F=null;try{F=RGL?RGL.f:$('Final Output').first().json;}catch(e){F=null;}
const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;
if(!F||!ds)return [{json:{acx_skip:true,why:!F?'no rounds found':'no DeepSeek model_config row',items:[]}}];
// A verse key is the book's first three letters (spaces removed) and chapter:verse; a range "22:23-24" keys each verse.
const REF=/\b((?:[1-3]\s?)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})(?:\s?[-–]\s?(\d{1,3}))?/g;
const keysOf=t=>{const K=new Map();for(const m of String(t||'').matchAll(REF)){const b=m[1].replace(/\s/g,'');const b3=b.slice(0,3).toLowerCase();const a=+m[3],z=m[4]?+m[4]:a;
 if(z<a||z-a>12)continue;for(let v=a;v<=z;v++){const k=b3+' '+m[2]+':'+v;if(!K.has(k))K.set(k,m[1]+' '+m[2]+':'+v);}}return K;};
// A block is a paragraph, or a list line together with the indented lines under it, so a sub-line keeps the verse its parent names; a heading
// line rides with the blocks under it when they name no verse themselves.
const blocksOf=t=>{const out=[];let head='';for(const raw of String(t||'').split(/\n\s*\n/)){let cur=null;for(const l of raw.split('\n')){const s=l.trim();if(!s)continue;
 if(/^#{1,6}\s/.test(s)||/^\*\*[^*]{2,120}\*\*:?$/.test(s)){if(cur){out.push(cur);cur=null;}head=s;continue;}
 const ind=/^\s+[-*•]|^\s{2,}\S/.test(l);if(ind&&cur){cur.text+=' / '+s;continue;}if(cur)out.push(cur);cur={text:s,head};}if(cur)out.push(cur);}return out;};
const SIDES={D:{name:'DEFENDER',close:F.cr4,earlier:[['R1',F.cr1],['R2',F.cr2],['R3',F.cr3]]},C:{name:'CHALLENGER',close:F.dr4,earlier:[['R1',F.gr1],['R2',F.gr2],['R3',F.dr3]]}};
const CUT=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
// Transport budget, not a rule threshold: each item carries at most 1,200 characters of close words and 2,400 of earlier words; items are sent
// in calls of at most 60,000 characters each (one DeepSeek call per output item of this node), at most 8 calls; an item past that is recorded
// NOT CHECKED, never dropped silently. Both sides are interleaved so neither side's items are crowded out; within a side, verses the other side
// also argued come first, then verses the side's own link round (R3) names.
const ITEM_CLOSE=1200,ITEM_EARLY=2400,CALL_CHARS=60000,MAX_CALLS=8;
const items=[];
for(const sd of ['D','C']){const X=SIDES[sd];if(!X.close)continue;const cb=blocksOf(X.close);const byKey=new Map();
 for(const b of cb){const K=keysOf(b.text+' '+(/\d+:\d+/.test(b.text)?'':b.head));for(const [k,lab] of K){if(!byKey.has(k))byKey.set(k,{lab,close:[]});const e=byKey.get(k);if(!e.close.includes(b.text))e.close.push(b.text);}}
 for(const [k,e] of byKey){const early=[];let inR3=false;
  for(const [r,txt] of [...X.earlier].reverse()){for(const b of blocksOf(txt)){const K=keysOf(b.text+' '+(/\d+:\d+/.test(b.text)?'':b.head));if(K.has(k)){early.push('['+r+'] '+b.text);if(r==='R3')inR3=true;}}}
  if(!early.length)continue; // a verse the side never read before its close has nothing to reverse; the new-footing mark covers it
  const oth=keysOf(SIDES[sd==='D'?'C':'D'].earlier.map(x=>x[1]).join('\n')+'\n'+(SIDES[sd==='D'?'C':'D'].close||'')).has(k);
  items.push({side:sd,key:k,verse:e.lab,inR3,oth,close:CUT(e.close.join(' / '),ITEM_CLOSE),earlier:CUT(early.join('\n'),ITEM_EARLY)});}}
const pri=x=>(x.oth?2:0)+(x.inR3?1:0);const LD=items.filter(x=>x.side==='D').sort((a,b)=>pri(b)-pri(a)),LC=items.filter(x=>x.side==='C').sort((a,b)=>pri(b)-pri(a));
const order=[];for(let i=0;i<Math.max(LD.length,LC.length);i++){if(LD[i])order.push(LD[i]);if(LC[i])order.push(LC[i]);}
order.forEach((it,i)=>{it.id='X'+(i+1);});
const calls=[[]];let used=0;const not_checked=[];
for(const it of order){const sz=it.close.length+it.earlier.length+200;if(used+sz>CALL_CHARS&&calls[calls.length-1].length){if(calls.length>=MAX_CALLS){not_checked.push(it);continue;}calls.push([]);used=0;}calls[calls.length-1].push(it);used+=sz;}
const sent=calls.flat();
if(!sent.length)return [{json:{acx_skip:true,why:'no close-round verse that the same side read earlier',items:[],not_checked:not_checked.map(x=>({id:x.id,side:x.side,verse:x.verse}))}}];
const SYS='You check one debater against its own earlier words. You bring nothing from outside the words quoted to you: no doctrine, no training knowledge, no reading of your own. You do not judge who is right, and you do not judge the other side.';
const RULES='Each item gives one verse, the words a side wrote about it in its CLOSE round, and the words the SAME side wrote about it in its EARLIER rounds (R1 to R3).\n'
 +'Decide only this: does the close assert a reading of that verse, or draw a conclusion from it, that the same side\'s earlier words deny or contradict? A reading here is who did what to whom, whom the verse forbids or allows what, what it states or shows. Read each side\'s own conclusion sentences (the sentences that begin "So", "Therefore", "This shows", or that state what the verse means for the case), not only its quotation of the verse: two passages can quote the same words and draw opposite conclusions.\n'
 +'REVERSED, in either of two ways: (1) the close draws from the verse a conclusion the earlier words deny, or denies a conclusion they drew (for example, earlier: the verse shows the son is the heir; close: the verse shows the son is not the heir); (2) the close asserts again a claim about the verse that the same side earlier withdrew, dropped or gave up ("I withdraw", "I drop", "I do not claim").\n'
 +'CONSISTENT: the close repeats, narrows, adds footing, answers the opponent, or keeps the earlier reading. A fuller or more exact quotation or gloss of the same word is CONSISTENT, not REVERSED. A close that itself withdraws, drops or grants an earlier claim ("I withdraw", "I drop", "I grant") is CONSISTENT here: giving ground is counted elsewhere; only asserting again what was given up is REVERSED.\n'
 +'NO EARLIER READING: the earlier words name the verse but state no reading of it.\n'
 +'Quote exactly, copying the words as they stand in the item.\n'
 +'Reply with exactly one line per item id, and nothing else, in this form:\nANTICHEAT: <item id> -- CONSISTENT | REVERSED | NO EARLIER READING -- CLOSE: "<the close words that decide it>" -- EARLIER: "<the earlier words they keep or contradict>"';
const mk=list=>{const parts=list.map(it=>'ITEM '+it.id+' ('+SIDES[it.side].name+', '+it.verse+'):\nCLOSE ROUND WORDS: '+it.close+'\nEARLIER WORDS OF THE SAME SIDE:\n'+it.earlier);
 return {model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:RULES+'\n\n'+parts.join('\n\n')}]};};
const NC=not_checked.map(x=>({id:x.id,side:x.side,verse:x.verse}));
return calls.filter(l=>l.length).map((l,ci)=>({json:{acx_skip:false,call:ci+1,calls:calls.length,body:mk(l),items:l.map(x=>({id:x.id,side:x.side,verse:x.verse,oth:x.oth,inR3:x.inR3})),not_checked:NC,model:ds.api_model,run_token:S.run_token}}));
