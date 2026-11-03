// QUESTION ROUND TRIAL (md_notes_rulings 413, 415): shared helpers, inlined into each QR node at build time.
const QR_C8="Commitment 8. I ask only for explanation.\nA question I put to a debater quotes a passage from that debater's own earlier round and asks it to explain that passage further: what a word, a step or a cited verse there means, or how the passage fits the verse it names. I do not ask a debater to defend its link, to answer the other side, to meet a verse or argument it did not touch, or to choose between positions, and I do not put the other side's case to it. The answer explains the quoted passage and is read with the round it came from; anything beyond that passage, and any verse not already cited, is disregarded.";
const QR_SIDE={defender:['CR1','CR2','CR3','CR4'],challenger:['DR1','DR2','DR3','DR4']};
const QR_KEY={CR1:'cr1',DR1:'gr1',CR2:'cr2',DR2:'gr2',CR3:'cr3',DR3:'dr3',CR4:'cr4',DR4:'dr4'};
const QR_REF=/(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?\.?\s\d{1,3}:\d{1,3}/g;
const qrNorm=s=>String(s||'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[*_]+/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const qrRefs=s=>[...new Set((String(s||'').match(QR_REF)||[]).map(r=>r.replace(/\.\s/,' ').replace(/^Psalm\s/,'Psalms ')))];
const qrSideText=(F,side)=>QR_SIDE[side].map(k=>String(F[QR_KEY[k]]||'')).join('\n');
const QR_FRAME=/\b(?:defend(?:s|ed|ing)?|respond(?:s|ed|ing)?\s+to|the\s+challenger\s+argues|the\s+defender\s+argues)\b/i;
function qrParse(t){const s=String(t||'');const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a<0||b<a)return null;try{return JSON.parse(s.slice(a,b+1));}catch(e){return null;}}
function qrText(j){try{if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message)return String(j.choices[0].message.content||'');}catch(e){}return null;}
// the three program checks of ruling 415, for one question
function qrCheck(q,side,F){const f=[];if(!q||typeof q!=='object')return ['no question object'];
 const rd=String(q.round||'').toUpperCase().replace(/[\[\]\s]/g,'');if(!QR_SIDE[side].includes(rd))f.push('round "'+q.round+'" is not one of that debater\'s rounds ('+QR_SIDE[side].join(', ')+')');
 const quote=qrNorm(q.quote);if(quote.length<8)f.push('quotation missing or under 8 characters');
 else if(QR_SIDE[side].includes(rd)&&!qrNorm(F[QR_KEY[rd]]).includes(quote))f.push('the quotation is not found word for word in '+rd);
 const own=new Set(qrRefs(qrSideText(F,side)));const nv=qrRefs((q.question||'')+' '+(q.quote||'')).filter(r=>!own.has(r));if(nv.length)f.push('verse(s) that debater has not cited: '+nv.join(', '));
 const fr=String(q.question||'').match(QR_FRAME);if(fr)f.push('framing words: "'+fr[0]+'"');
 if(String(q.question||'').trim().length<10)f.push('question missing');return f;}

// QR Final (TRIAL): the questions that pass, first reply or the one return; a question that still fails is dropped and recorded.
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;const F=$('Regrade Load').first().json.f;
const C=$('QR Check').all().map(x=>x.json);const R=$input.all().map(x=>x.json);
const RG=$('Regrade Row').first().json;const MODEL={defender:RG.defender_model,challenger:RG.challenger_model};
if(!MODEL.defender||!MODEL.challenger)throw new Error('FAIL-CLOSED: QR Final: the saved row names no debater model.'+RT);
const SYS=side=>'You are the '+side.toUpperCase()+' in a finished debate. A judge asks you to explain a passage from your own earlier round. Explain only that passage: what a word, a step or a cited verse there means, or how the passage fits the verse it names. Do not defend your link, answer the other side, add an argument, or cite a verse you did not already cite: any such material is disregarded. Answer in at most 250 words.';
const rec=[];const items=[];
C.forEach((c,i)=>{let qs=c.qs,faults=c.faults,second=null;
 if(c.retry){second=qrText(R[i]);const o=qrParse(second);qs={};faults={};for(const side of ['defender','challenger']){const q=o&&o[side];qs[side]=q||null;faults[side]=qrCheck(q,side,F);}}
 for(const side of ['defender','challenger']){const q=qs[side];const ok=faults[side].length===0;rec.push({judge:c.seat,side,round:q&&q.round,quote:q&&q.quote,question:q&&q.question,status:ok?(c.retry?'PASSED ON RETURN':'PASSED'):'DROPPED',faults:faults[side],first_faults:c.faults[side]});
  if(!ok)continue;const rd=String(q.round).toUpperCase().replace(/[\[\]\s]/g,'');
  const rounds=QR_SIDE[side].filter(k=>F[QR_KEY[k]]).map(k=>'['+k+']\n'+F[QR_KEY[k]]).join('\n\n');
  items.push({json:{judge:c.seat,side,round:rd,quote:q.quote,question:q.question,body:{model:MODEL[side],max_tokens:4000,messages:[{role:'system',content:SYS(side)},{role:'user',content:'YOUR ROUNDS IN THIS DEBATE:\n\n'+rounds+'\n\n=== A JUDGE\'S QUESTION ===\nThe judge quotes your round '+rd+': "'+q.quote+'"\nQuestion: '+q.question}]}}});}});
if(!items.length)throw new Error('FAIL-CLOSED: QR Final: no question passed the checks.'+RT);
items[0].json.record=rec;return items;
