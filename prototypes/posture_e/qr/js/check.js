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
