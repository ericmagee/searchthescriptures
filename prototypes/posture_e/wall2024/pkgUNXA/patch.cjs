// the kunxLines edit (one anchor) and the library text; used by the replay, the build and the tests
const fs=require('fs');const LIB=fs.readFileSync(__dirname+'/unxa_lib.js','utf8');
const ANCH="for(const j of s.ns){const all=segsOf(j);if(all.some(z=>UNX_OTHER.test(z.seg)))continue;";
const NEW="for(const j of s.ns){const all=segsOf(j);if(all.some(z=>UNX_OTHER.test(z.seg))){const bk=lbBlockText(R[rk],j);const ua=bk?unxaCheck(all,bk,lbFoot(bk,true),PR.filter(p=>p.n===j)):null; /* pkgUNXA */\n"+
"    if(ua){const id=side+' premise '+j;if(!items.some(x=>x.link===id)){const k=lbFoot(bk,true);const L1=ua.l1?ua.l1.ref+' \"'+ua.l1.q.slice(0,160)+'\"':'';\n"+
"     const why=ua.a==='ASSUMES'?'counted UNEXHIBITED in '+lab+' on an ASSUMES ground, but its ['+rk+'] block exhibits '+k.join(' and ')+' and the ASSUMES clause does not quote the block\\'s [L1] '+L1\n"+
"      :'counted UNEXHIBITED in '+lab+' as unanswered, but its ['+rk+'] block quotes the MEANS of the press '+ua.press.ref+' under a MEANS line and answers it with '+k.join(' and ');\n"+
"     items.push({rule:'K-UNX',a:ua.a,side,link:id,premise:j,kinds:k,conc:n0,l1:ua.l1?ua.l1.q:'',l1ref:ua.l1?ua.l1.ref:'',press:ua.press?ua.press.ref:'',why,line:id+': '+why+'. Quote the block\\'s [L1]'+(L1?' ('+L1+')':'')+(ua.a==='UNANSWERED'?' answering that press':'')+' in a STATEMENT for this item and name what that verse lacks for the step, or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). A KEEP does not cure it. Your count: '+ua.seg.replace(/\\s+/g,' ').trim().slice(0,400)});\n"+
"     marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}}\n"+
"    continue;}";
function patch(code){const n=code.split(ANCH).length-1;if(n!==1)throw new Error('anchor count '+n);return code.replace(ANCH,()=>NEW).replace('function kunxLines(',()=>LIB+'\nfunction kunxLines(');}
module.exports={LIB,ANCH,NEW,patch};
