// pkgOAN C3G Build (W3 33160 grade, build 2): the one send-back of the Oracle's link round [DR3] for the MEANS of the defender's presses.
// Reads C3 Extract's press_check. When it passes (or no press was harvested, or the check errored) the item passes through: resend false, and
// C3G Route sends it straight to C3G Extract. Otherwise one call that continues the Oracle's own conversation: the C3 request, its reply, then
// a user turn naming each press whose MEANS the round does not quote and answer, asking for the whole link round again. Same seat, model and body form.
const X=$('C3 Extract').first().json;const C=$('C3 Build').first().json;const B=C.call;const pc=X.press_check;
const pass=o=>[{json:{run_token:X.run_token,round:'C3G',resend:false,why:o}}];
if(!pc||pc.error||!pc.applies||pc.pass)return pass(!pc?'no check':pc.error?'check error: '+pc.error:!pc.applies?'no press harvested':'every press is answered');
const P=Array.isArray(X.presses)?X.presses:[];const miss=new Set(pc.missing||[]),una=new Set(pc.unanswered||[]);
const note="PRESS CHECK -- computed by the system from the transcript, not by a model. Your link round "
 +(miss.size?'does not quote the MEANS of '+[...miss].join(', ')+'. ':'')+(una.size?'quotes the MEANS of '+[...una].join(', ')+' but gives no layer that answers it. ':'')
 +"The judges grade each answer against the MEANS the defender claims (ANSWER CHECK, ruling 412): a verse named without its MEANS met is graded MISSES, and the premise is counted against you.\n"
 +"Write your whole link round again, the same links in the same words, but under \"Answers to the presses\" answer each press below: first the line MEANS [CR3] <id>: \"<the MEANS, word for word>\", then the layers ([L1] to [L4]) that meet that meaning. A LINK you concede needs no answers. The presses to answer:\n"
 +P.filter(p=>miss.has(p.id)||una.has(p.id)).map(p=>p.id+' (LINK '+p.n+') '+p.ref+' -- MEANS: "'+p.means+'"').join('\n')+"\nReturn the whole round; this is the only request of its kind.";
const body=JSON.parse(JSON.stringify(B.body));
if(B.fam==='gemini'){body.contents=(body.contents||[]).concat([{role:'model',parts:[{text:X.raw}]},{role:'user',parts:[{text:note}]}]);}
else{body.messages=(body.messages||[]).concat([{role:'assistant',content:X.raw},{role:'user',content:note}]);}
if(body.diagnostics)body.diagnostics={previous_message_id:X.msg_id||null};
return [{json:{run_token:X.run_token,round:'C3G',resend:true,note,call:{...B,body}}}];
