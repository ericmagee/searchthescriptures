// QUESTION ROUND TRIAL (md_notes_rulings 413, 415): shared helpers, inlined into each QR node at build time.
const QR_C8="Commitment 9. I ask only for explanation.\nA question I put to a debater quotes a passage from that debater's own earlier round and asks it to explain that passage further: what a word, a step or a cited verse there means, or how the passage fits the verse it names. I do not ask a debater to defend its link, to answer the other side, to meet a verse or argument it did not touch, or to choose between positions, and I do not put the other side's case to it. The answer explains the quoted passage and is read with the round it came from; anything beyond that passage, and any verse not already cited, is disregarded.";
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
 const quote=qrNorm(q.quote);if(quote.length<8)f.push('quotation missing or under 8 characters');
 else if(QR_SIDE[side].includes(rd)&&!qrNorm(F[QR_KEY[rd]]).includes(quote))f.push('the quotation is not found word for word in '+rd);
 const own=new Set(qrRefs(qrSideText(F,side)));const nv=qrRefs((q.question||'')+' '+(q.quote||'')).filter(r=>!own.has(r));if(nv.length)f.push('verse(s) that debater has not cited: '+nv.join(', '));
 const fr=String(q.question||'').match(QR_FRAME);if(fr)f.push('framing words: "'+fr[0]+'"');
 if(String(q.question||'').trim().length<10)f.push('question missing');return f;}

// QR Merge (TRIAL): the six questions and answers go to all three judges, appended to each judge's own conversation before it judges.
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;const F=$('Regrade Load').first().json.f;
const Q=$('QR Final').all().map(x=>x.json);const A=$input.all().map(x=>x.json);const PB=$('Panel Build').first().json;
if(A.length!==Q.length)throw new Error('FAIL-CLOSED: QR Merge: '+A.length+' answers for '+Q.length+' questions.'+RT);
const qa=Q.map((q,i)=>{let a=qrText(A[i]);const own=new Set(qrRefs(qrSideText(F,q.side)));const nv=a?qrRefs(a).filter(r=>!own.has(r)):[];
 return {judge:q.judge,side:q.side,round:q.round,quote:q.quote,question:q.question,answer:a,new_verses:nv,finish:(A[i]&&A[i].choices&&A[i].choices[0]&&A[i].choices[0].finish_reason)||null};});
const block=qa.map((x,k)=>'Q'+(k+1)+' -- judge '+x.judge+' to the '+x.side+', quoting ['+x.round+']: "'+x.quote+'"\nQuestion: '+x.question+'\nAnswer ['+(x.side==='defender'?'CR':'DR')+'Q]: '+(x.answer==null?'(no answer)':x.answer)+(x.new_verses.length?'\n[NEW VERSE, NOT COUNTED: '+x.new_verses.join(', ')+']':'')).join('\n\n');
const TXT='=== QUESTION ROUND (TRIAL) ===\n'+QR_C8+'\n\nThe judges asked the questions below and the debaters answered. Each answer explains only the passage it quotes and is read with the round it came from: an answer that gives up ground counts as a concession made in that round; material beyond the quoted passage, and any verse marked NEW VERSE, NOT COUNTED, is disregarded.\n\n'+block+'\n=== END QUESTION ROUND ===';
const add=(body)=>{const b=JSON.parse(JSON.stringify(body));const m=b.messages;const last=m[m.length-1];
 if(last.role==='user'){if(typeof last.content==='string')last.content+='\n\n'+TXT;else if(Array.isArray(last.content))last.content.push({type:'text',text:TXT});}else m.push({role:'user',content:TXT});return b;};
const judges=PB.judges.map(j=>({...j,body:add(j.body)}));
return [{json:{run_token:S.run_token,judges,qa,record:(Q[0]&&Q[0].record)||[],qa_text:TXT}}];
