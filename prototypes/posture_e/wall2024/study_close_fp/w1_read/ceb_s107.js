try{
// pkgCEC (W1, item A of Wall 3714): CLOSE ENFORCER BUILD. One DeepSeek call after both closing rounds and before any judge (single judge and panel).
// It gives the enforcer each side's four rounds in full, each side's declared links, and every candidate already named (item B: the Oracle's
// OPPONENT'S CONTRADICTIONS lines in [DR4]). Close Enforcer Record confirms each answer by code. Nothing here changes a grade.
const CEC_RK={CR1:'cr1',CR2:'cr2',CR3:'cr3',CR4:'cr4',DR1:'gr1',DR2:'gr2',DR3:'dr3',DR4:'dr4'};
const CEC_PRE={DEFENDER:'CR',CHALLENGER:'DR'};
const cecN=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
/* a quotation stands when its words are found together in the round named (case, quote marks, markdown and punctuation ignored).
   rev 3 (W2 3736 fix 1): a quotation with an ellipsis stands only when all its parts fall inside ONE sentence of that round, in order, so two
   sentences cannot be spliced into one; each part of five words or more */
const cecSents=raw=>String(raw||'').split(/\n+|(?<=[.!?]["”’')\]]*)\s+/).map(cecN).filter(Boolean);
const cecStands=(q,raw)=>{const x=cecN(q);if(x.split(' ').length<3)return false;const T=cecN(raw);if(T.includes(x))return true;const parts=String(q).split(/\.\.\.|…/).map(cecN).filter(Boolean);if(parts.length<2||parts.some(p=>p.split(' ').length<5))return false;
 return cecSents(raw).some(z=>{let at=0;for(const p of parts){const k=z.indexOf(p,at);if(k<0)return false;at=k+p.length;}return true;});};
/* declared links: the defender's DECLARED CHAIN in [CR1] (as Panel Build reads it), the challenger's LINK blocks in [DR3] */
const cecDeclared=F=>{const t=String(F&&F.cr1||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const a=t.lastIndexOf('\n',i)+1;const L=t.slice(a).split('\n');const out=[L[0]];let on=false,pre=0;
 for(const l of L.slice(1)){const num=/^\s*\**\s*\d+[.)]\s+\S/.test(l);if(num){on=true;out.push(l);continue;}if(!on){if(l.trim()){if(/^\s*#/.test(l)||++pre>3)break;}out.push(l);continue;}
  if(!l.trim()||/^\s+\S/.test(l)||/^\s*[-*•]\s/.test(l)){out.push(l);continue;}break;}
 return out.join('\n').replace(/\s+$/,'');};
const cecDlinks=F=>{const t=cecDeclared(F);if(!t)return [];const L=[];let cur=null;for(const l of t.split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(.*)$/);if(m){cur={n:+m[1],text:m[2]};L.push(cur);continue;}if(cur&&l.trim())cur.text+=' '+l.trim();}return L;};
const cecCblocks=F=>{const t=String(F&&F.dr3||'');const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index,head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim()});return H.map(x=>({n:x.n,head:x.head}));};
const cecLinks=F=>({DEFENDER:[...new Set(cecDlinks(F).map(x=>x.n))],CHALLENGER:[...new Set(cecCblocks(F).map(x=>x.n))]});
/* item B (W4): the Oracle's OPPONENT'S CONTRADICTIONS section in [DR4]; each line names the defender: X<n> LINK <n> (or PREMISE <n>) | EARLIER [<round>] "<...>" | CLOSING [CR4] "<...>" | <why> */
const cecOracle=F=>{const t=String(F&&F.dr4||'');const i=t.search(/OPPONENT['’]S CONTRADICTIONS\s*:?/i);if(i<0)return [];const out=[];
 for(const l of t.slice(i).split('\n').slice(1,60)){const s=l.replace(/[*_]+/g,'').trim();if(!s)continue;const m=s.match(/^(?:[-•]\s*)?(X\d+)\s+(LINK|PREMISE)\s+(\d+)\s*\|\s*EARLIER\s*\[\s*([CD]R\d)\s*\]\s*["“](.+?)["”]\s*\|\s*CLOSING\s*\[\s*([CD]R\d)\s*\]\s*["“](.+?)["”]\s*(?:\|\s*(.*))?$/i);
  if(m){out.push({id:m[1].toUpperCase(),side:'DEFENDER',by:'the Oracle (OPPONENT\'S CONTRADICTIONS, [DR4])',kind:m[2].toUpperCase(),n:+m[3],earlier_round:m[4].toUpperCase(),earlier_q:m[5],closing_round:m[6].toUpperCase(),closing_q:m[7],why:(m[8]||'').trim()});continue;}
  if(/^#|^[A-Z][A-Z' ]{6,}:/.test(s)&&out.length)break;}
 return out;};
const S=$('Init Seats').first().json;let RS=null;try{RS=$('Resolve Seats').first().json;}catch(e){RS=null;}
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}
let F=null;try{F=RGL?RGL.f:$('Final Output').first().json;}catch(e){F=null;}
const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;
const miss=F?['cr1','cr2','cr3','cr4','gr1','gr2','dr3','dr4'].filter(k=>!String(F[k]||'').trim()):['all rounds'];
if(!F||!ds||F&&(!String(F.cr4||'').trim()&&!String(F.dr4||'').trim()))return [{json:{cec_skip:true,why:!F?'no rounds found':!ds?'no DeepSeek model_config row':'no closing round',run_token:S.run_token}}];
const links=cecLinks(F);const cands=cecOracle(F);
const PROMPT="You are the closing enforcer. A debater's closing round may not contradict what the same debater stated in its earlier rounds. Below are one debater's four rounds.\nRead its closing round against its earlier rounds. List every closing sentence that cannot be true together with an earlier sentence, and answer every candidate listed.\nA contradiction is two statements that cannot both be true. A closing sentence that asserts again, as the debater's own, what it withdrew, dropped or gave up in an earlier round IS a contradiction.\nIt is NOT a contradiction when the closing sentence: grants, concedes, narrows or withdraws something; states or quotes the other side's position; answers a press with a further reason the earlier sentence leaves room for; or differs only in wording.\nQuote both sentences word for word and name the link: the link whose closing block holds the sentence, else the link the earlier sentence supports.\nReply with one line per contradiction and per candidate, and nothing else:\nCLOSE-CONTRADICTION: <candidate id or NEW> -- <DEFENDER|CHALLENGER> -- LINK <n> -- CONFIRMED | NOT A CONTRADICTION -- EARLIER [<round>] \"<words>\" -- CLOSING [<round 4>] \"<words>\" -- <one sentence: why both cannot be true, or why they can>\nIf you find none and there is no candidate, reply: CLOSE-CONTRADICTION: NONE"; /* pkgCSS: one side per call */
const R=(lab,k)=>'=== ['+lab+'] ===\n'+(String(F[k]||'').trim()||'(no text)');
const lk=sd=>links[sd].length?links[sd].map(n=>(sd==='DEFENDER'?'D':'C')+n+' = LINK '+n).join(', '):'(none read)';
const SYS='You check each debater against its own earlier words. You bring nothing from outside the words given to you: no doctrine, no training knowledge, no reading of your own. You do not judge who is right, and you do not judge one side by the other side\'s words.';
const SD={DEFENDER:{src:'its DECLARED CHAIN in [CR1]',close:'CR4',r:[['CR1','cr1'],['CR2','cr2'],['CR3','cr3'],['CR4 -- THE DEFENDER\'S CLOSING ROUND','cr4']]},CHALLENGER:{src:'its LINK blocks in [DR3]',close:'DR4',r:[['DR1','gr1'],['DR2','gr2'],['DR3','dr3'],['DR4 -- THE CHALLENGER\'S CLOSING ROUND','dr4']]}};
const out=[];for(const sd of ['DEFENDER','CHALLENGER']){const X=SD[sd];if(!String(F[X.r[3][1]]||'').trim())continue;const cs=cands.filter(c=>c.side===sd);
 const cl=cs.length?cs.map(c=>c.id+' -- '+c.side+' -- '+c.kind+' '+c.n+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- named by '+c.by+(c.why?': '+c.why:'')).join('\n'):'none';
 const user=PROMPT+'\n\nCANDIDATES ALREADY NAMED (answer each one by its id):\n'+cl+'\n\n######## THE '+sd+' ########\nThe '+sd.toLowerCase()+'\'s links: '+lk(sd)+' ('+X.src+'). Its closing round is ['+X.close+'].\n\n'+X.r.map(x=>R(x[0],x[1])).join('\n\n');
 const body={model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:user}]};
 out.push({json:{cec_skip:false,side:sd,body,links,cands:cs,missing_rounds:miss,model:ds.api_model,run_token:S.run_token}});}
return out;
}catch(__e){let __rt=null;try{__rt=$('Init Seats').first().json.run_token||null;}catch(e){}return [{json:{cec_skip:true,why:'Close Enforcer Build failed: '+String(__e&&__e.message||__e).slice(0,300),run_token:__rt}}];} /* pkgCEC rev 5: a failed check never stops the debate */