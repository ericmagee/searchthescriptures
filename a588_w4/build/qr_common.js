/* ASK 588 (W4): the judges' question round, live on every fresh run (rulings 413, 414; operator 23:36 CST 11-23). Fixed question forms (ruling 414 item 2). A fault anywhere in the round skips the round and is recorded; it never stops the run. */
const QR_SIDE={defender:['CR1','CR2','CR3','CR4'],challenger:['DR1','DR2','DR3','DR4']};
const QR_KEY={CR1:'cr1',DR1:'gr1',CR2:'cr2',DR2:'gr2',CR3:'cr3',DR3:'dr3',CR4:'cr4',DR4:'dr4'};
const QR_CLOSE={defender:'CR4',challenger:'DR4'};
const QR_REF=new RegExp("\\b(?:"+QR_BOOKS+")\\.?\\s\\d{1,3}:\\d{1,3}","g");
const QR_FORMS=QR_AGREE?['MEANING','FIT','AGREE']:['MEANING','FIT'];
const qrNorm=s=>String(s||'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[*_]+/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const qrRefs=s=>[...new Set((String(s||'').match(QR_REF)||[]).map(r=>r.replace(/\.\s/,' ').replace(/^Psalm\s/,'Psalms ')))];
const qrSideText=(F,side)=>QR_SIDE[side].map(k=>String(F[QR_KEY[k]]||'')).join('\n');
const qrRd=r=>String(r||'').toUpperCase().replace(/[\[\]\s]/g,'');
const qrEmpty=v=>{const s=String(v==null?'':v).trim();return /^(?:none|n\/a|na|null|-+)?$/i.test(s);};
function qrParse(t){const s=String(t||'');const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a<0||b<a)return null;try{return JSON.parse(s.slice(a,b+1));}catch(e){return null;}}
/* reads an OpenRouter reply (choices) and a direct Anthropic reply (content parts) */
function qrText(j){try{if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message)return String(j.choices[0].message.content||'');if(j&&Array.isArray(j.content)){const t=j.content.filter(p=>p&&p.type==='text'&&typeof p.text==='string').map(p=>p.text).join('');return t||null;}}catch(e){}return null;}
function qrFinish(j){try{if(j&&Array.isArray(j.choices)&&j.choices[0])return j.choices[0].finish_reason||null;if(j&&j.stop_reason)return j.stop_reason;}catch(e){}return null;}
function qrForm(q){return String(q&&q.form||'').toUpperCase().trim();}
/* ruling 414 item 2: the judge gives the passage and the form; the program writes the question */
function qrCheck(q,side,F){const f=[];if(!q||typeof q!=='object')return ['no question object'];
 const rd=qrRd(q.round);if(!QR_SIDE[side].includes(rd))f.push('round "'+q.round+'" is not one of that debater\'s rounds ('+QR_SIDE[side].join(', ')+')');
 const form=qrForm(q);if(!QR_FORMS.includes(form))f.push('form "'+q.form+'" is not one of '+QR_FORMS.join(', '));
 const quote=qrNorm(q.quote);if(quote.length<8)f.push('quotation missing or under 8 characters');
 else if(QR_SIDE[side].includes(rd)&&!qrNorm(F[QR_KEY[rd]]).includes(quote))f.push('the quotation is not found word for word in '+rd);
 let eqt='';
 if(form==='AGREE'){const CL=QR_CLOSE[side];if(rd!==CL)f.push('an AGREE question quotes the closing round '+CL+', not "'+q.round+'"');const er=qrRd(q.earlier_round);if(!QR_SIDE[side].includes(er)||er===CL)f.push('earlier round "'+q.earlier_round+'" is not one of that debater\'s earlier rounds');const eq=qrNorm(q.earlier_quote);eqt=q.earlier_quote||'';if(eq.length<8)f.push('earlier quotation missing or under 8 characters');else if(QR_SIDE[side].includes(er)&&er!==CL&&!qrNorm(F[QR_KEY[er]]).includes(eq))f.push('the earlier quotation is not found word for word in '+er);}
 else if(!qrEmpty(q.earlier_round)||!qrEmpty(q.earlier_quote))f.push('earlier_round and earlier_quote belong only to an AGREE question');
 if(form==='MEANING'){const t=qrNorm(q.term);if(t.length<2)f.push('term missing');else if(!quote.includes(t))f.push('the term "'+q.term+'" does not stand in the quotation');}
 let vr=[];if(form==='FIT'){vr=qrRefs(q.verse);if(vr.length!==1)f.push('verse missing, or not one verse reference');else if(!qrRefs(q.quote).includes(vr[0]))f.push('the verse '+vr[0]+' is not named in the quotation');}
 const own=new Set(qrRefs(qrSideText(F,side)));const nv=qrRefs((q.quote||'')+' '+eqt+' '+(form==='FIT'?(q.verse||''):'')).filter(r=>!own.has(r));if(nv.length)f.push('verse(s) that debater has not cited: '+nv.join(', '));
 return f;}
function qrQuestion(q){const form=qrForm(q);if(form==='MEANING')return 'What does "'+String(q.term).trim()+'" in this passage mean?';if(form==='FIT')return 'How does this passage fit '+qrRefs(q.verse)[0]+'?';if(form==='AGREE')return 'How do these two passages agree?';return null;}
function qrRounds(){let G=null;try{if($('Regrade Load').isExecuted)G=$('Regrade Load').first().json;}catch(e){G=null;}const F=G?G.f:$('Final Output').first().json;if(!F||typeof F!=='object')throw new Error('no rounds to read');return F;}
const qrSkipOf=arr=>{const x=(arr||[]).find(a=>a&&a.qr_skip);return x?x.qr_skip:null;};
const qrErr=(node,e)=>node+': '+String((e&&e.message)||e).slice(0,300);
