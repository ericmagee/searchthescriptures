// pkgOGS C4G Build (W3-approved plan, pkgOGR/PLAN.md): the one send-back of the Oracle's close round for its OPPONENT'S GRANTS section.
// Reads C4 Extract's grants_check. When it passes (or no grant was harvested, or the check errored) the item passes through: resend false, and
// C4G Route sends it straight to C4G Extract. Otherwise one call that continues the Oracle's own conversation: the C4 request, its reply, then
// a user turn naming each missing or misquoted G line and asking for the whole close round again, section first. Same seat, model and body form.
const X=$('C4 Extract').first().json;const C=$('C4 Build').first().json;const B=C.call;const gc=X.grants_check;
const pass=o=>[{json:{run_token:X.run_token,round:'C4G',resend:false,why:o}}];
if(!gc||gc.error||!gc.applies||gc.pass)return pass(!gc?'no check':gc.error?'check error: '+gc.error:!gc.applies?'no grant harvested':'the section passed');
const G=Array.isArray(X.grants)?X.grants:[];const want=new Set(gc.missing.concat(gc.misquoted.map(x=>x.split(' ')[0])));
const note="OPPONENT'S GRANTS CHECK -- computed by the system from the transcript, not by a model. Your close round "+(gc.section?'':'has no OPPONENT\'S GRANTS section. ')
 +(gc.missing.length?'leaves out '+gc.missing.join(', ')+'. ':'')+(gc.misquoted.length?'misquotes '+gc.misquoted.join('; ')+'. ':'')
 +"Write your whole close round again, the same case in the same words, but open it with the OPPONENT'S GRANTS section: every G line of the list, each grant quoted word for word as listed, with its round, then SUPPORTS: <the claim you challenge that it supports> or SUPPORTS: none -- <why>. The grants to fix:\n"
 +G.filter(x=>want.has('G'+x.g)).map(x=>'G'+x.g+' ['+x.round+'] "'+x.text+'"').join('\n')+"\nReturn the whole round; this is the only request of its kind.";
const body=JSON.parse(JSON.stringify(B.body));
if(B.fam==='gemini'){body.contents=(body.contents||[]).concat([{role:'model',parts:[{text:X.raw}]},{role:'user',parts:[{text:note}]}]);}
else{body.messages=(body.messages||[]).concat([{role:'assistant',content:X.raw},{role:'user',content:note}]);}
if(body.diagnostics)body.diagnostics={previous_message_id:X.msg_id||null};
return [{json:{run_token:X.run_token,round:'C4G',resend:true,note,call:{...B,body}}}];
