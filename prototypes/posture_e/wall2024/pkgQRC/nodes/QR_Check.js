// QUESTION ROUND TRIAL (md_notes_rulings 413, 415): shared helpers, inlined into each QR node at build time.
const QR_C8="Commitment 9. I ask only for explanation.\nA question I put to a debater quotes a passage from that debater's own earlier round and asks it to explain that passage further: what a word, a step or a cited verse there means, or how the passage fits the verse it names. I do not ask a debater to defend its link, to answer the other side, to meet a verse or argument it did not touch, or to choose between positions, and I do not put the other side's case to it. The answer explains the quoted passage and is read with the round it came from; anything beyond that passage, and any verse not already cited, is disregarded. When a debater's closing round ([CR4] for the defender, [DR4] for the challenger) says what contradicts its own earlier round, my question to that debater quotes both passages, the earlier one and the closing one, and asks it to explain how the two agree. Its answer cannot withdraw either passage: a contradiction made in the closing round stands as made, and whether it is one is confirmed by the closing enforcer.";
const QR_SIDE={defender:['CR1','CR2','CR3','CR4'],challenger:['DR1','DR2','DR3','DR4']};
const QR_KEY={CR1:'cr1',DR1:'gr1',CR2:'cr2',DR2:'gr2',CR3:'cr3',DR3:'dr3',CR4:'cr4',DR4:'dr4'};
const QR_BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation|Psalm";
const QR_REF=new RegExp("\\b(?:"+QR_BOOKS+")\\.?\\s\\d{1,3}:\\d{1,3}","g"); /* book names only: "So 1:18" or "In Matthew 1:18" is not a new verse */
const qrNorm=s=>String(s||'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[*_]+/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const qrRefs=s=>[...new Set((String(s||'').match(QR_REF)||[]).map(r=>r.replace(/\.\s/,' ').replace(/^Psalm\s/,'Psalms ')))];
const qrSideText=(F,side)=>QR_SIDE[side].map(k=>String(F[QR_KEY[k]]||'')).join('\n');
const QR_FRAME=/\b(?:defend(?:s|ed|ing)?|respond(?:s|ed|ing)?\s+to|the\s+challenger\s+argues|the\s+defender\s+argues)\b/i;
function qrParse(t){const s=String(t||'');const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a<0||b<a)return null;try{return JSON.parse(s.slice(a,b+1));}catch(e){return null;}}
function qrText(j){try{if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message)return String(j.choices[0].message.content||'');}catch(e){}return null;}
// the three program checks of ruling 415, for one question
function qrCheck(q,side,F){const f=[];if(!q||typeof q!=='object')return ['no question object'];
 const rd=String(q.round||'').toUpperCase().replace(/[\[\]\s]/g,'');if(!QR_SIDE[side].includes(rd))f.push('round "'+q.round+'" is not one of that debater\'s rounds ('+QR_SIDE[side].join(', ')+')');
 if(q.earlier_round!=null||q.earlier_quote!=null){const CL={defender:'CR4',challenger:'DR4'}[side];if(rd!==CL)f.push('a contradiction question quotes the closing round '+CL+', not "'+q.round+'"');const er=String(q.earlier_round||'').toUpperCase().replace(/[\[\]\s]/g,'');if(!QR_SIDE[side].includes(er)||er===CL)f.push('earlier round "'+q.earlier_round+'" is not one of that debater\'s earlier rounds');const eq=qrNorm(q.earlier_quote);if(eq.length<8)f.push('earlier quotation missing or under 8 characters');else if(QR_SIDE[side].includes(er)&&er!==CL&&!qrNorm(F[QR_KEY[er]]).includes(eq))f.push('the earlier quotation is not found word for word in '+er);} /* pkgQRC */
 const quote=qrNorm(q.quote);if(quote.length<8)f.push('quotation missing or under 8 characters');
 else if(QR_SIDE[side].includes(rd)&&!qrNorm(F[QR_KEY[rd]]).includes(quote))f.push('the quotation is not found word for word in '+rd);
 const own=new Set(qrRefs(qrSideText(F,side)));const nv=qrRefs((q.question||'')+' '+(q.quote||'')+' '+(q.earlier_quote||'')).filter(r=>!own.has(r));if(nv.length)f.push('verse(s) that debater has not cited: '+nv.join(', '));
 const fr=String(q.question||'').match(QR_FRAME);if(fr)f.push('framing words: "'+fr[0]+'"');
 if(String(q.question||'').trim().length<10)f.push('question missing');return f;}

// QR Check (TRIAL): the program checks of ruling 415 on each judge's two questions; a judge with a failing question is returned once.
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;const F=$('Regrade Load').first().json.f;
const A=$('QR Ask Build').all().map(x=>x.json);const R=$input.all().map(x=>x.json);
if(R.length!==A.length)throw new Error('FAIL-CLOSED: QR Check: '+R.length+' replies for '+A.length+' asks.'+RT);
return A.map((a,i)=>{const t=qrText(R[i]);const o=qrParse(t);const out={i,seat:a.seat,first_text:t,qs:{},faults:{}};let bad=[];
 for(const side of ['defender','challenger']){const q=o&&o[side];const f=qrCheck(q,side,F);out.qs[side]=q||null;out.faults[side]=f;if(f.length)bad.push(side+': '+f.join('; '));}
 if(!o)bad=['the reply is not JSON in the form asked'];
 const RET='=== QUESTION ROUND (TRIAL): RETURNED ONCE ===\nYour questions are returned once. Faults: '+bad.join(' | ')+'.\nReply again with JSON only, in the same form, both questions.';
 const body=JSON.parse(JSON.stringify(a.body));if(bad.length){body.messages.push({role:'assistant',content:t||'(no reply)'});body.messages.push({role:'user',content:RET});}
 else{body.messages=[{role:'user',content:'Reply with the single word OK.'}];body.max_tokens=16;} /* a passing judge's retry slot is a no-op call */
 return {json:{...out,retry:bad.length>0,why:bad,body}};});
