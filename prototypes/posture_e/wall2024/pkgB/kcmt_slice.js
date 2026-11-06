// WALL-2024 package B, K-CMT (TRIAL): a contested grade (BROKEN, FORCED, MISSES, VOID, UNPROVEN) in the judge's reasoning that names no
// "(Commitment N)". One item per judgment, counting the lines, with up to five shown. It removes no seat and changes no count.
function kcmtLines2024(text){const items=[],marks=[];if(typeof text!=='string'||!text.trim())return {items,marks};
 let T=text;{const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')T=j.reasoning;}catch(e){}}}
 const L=T.split('\n').map(l=>l.trim()).filter(l=>l&&!/^\[AUDIT\b/.test(l)&&/\b(BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/.test(l)&&!/\bCommitment\s*\d+\b/i.test(l));
 if(!L.length)return {items,marks};
 items.push({rule:'K-CMT',side:'JUDGE',link:'contested grades without a commitment',line:L.length+' contested grade line'+(L.length===1?'':'s')+' name no commitment (answer each with its Commitment N, or NOT A GRADE); first: '+L.slice(0,5).map(l=>'"'+l.slice(0,160)+'"').join('; ')});
 marks.push('[AUDIT v33: GRADE WITHOUT ITS COMMITMENT (K-CMT) -- '+L.length+' contested grade line'+(L.length===1?'':'s')+' name no "(Commitment N)"; first: '+L.slice(0,3).map(l=>l.replace(/[\[\]"]/g,'').slice(0,120)).join(' / ')+'; the judge answers each line with its (Commitment N), or NOT A GRADE where the line carries a grade word but grades nothing. TRIAL rule: it removes no seat. REVIEW THIS ROW.]');
 return {items,marks};}
