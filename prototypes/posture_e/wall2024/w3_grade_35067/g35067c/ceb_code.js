try{
const CEC_RK={CR1:'cr1',CR2:'cr2',CR3:'cr3',CR4:'cr4',DR1:'gr1',DR2:'gr2',DR3:'dr3',DR4:'dr4'};
const CEC_PRE={DEFENDER:'CR',CHALLENGER:'DR'};



const cecDeclared=F=>{const t=String(F&&F.cr1||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const a=t.lastIndexOf('\n',i)+1;const L=t.slice(a).split('\n');const out=[L[0]];let on=false,pre=0;
 for(const l of L.slice(1)){const num=/^\s*\**\s*\d+[.)]\s+\S/.test(l);if(num){on=true;out.push(l);continue;}if(!on){if(l.trim()){if(/^\s*#/.test(l)||++pre>3)break;}out.push(l);continue;}
  if(!l.trim()||/^\s+\S/.test(l)||/^\s*[-*•]\s/.test(l)){out.push(l);continue;}break;}
 return out.join('\n').replace(/\s+$/,'');};
const cecDlinks=F=>{const t=cecDeclared(F);if(!t)return [];const L=[];let cur=null;for(const l of t.split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(.*)$/);if(m){cur={n:+m[1],text:m[2]};L.push(cur);continue;}if(cur&&l.trim())cur.text+=' '+l.trim();}return L;};
const cecCblocks=F=>{const t=String(F&&F.dr3||'');const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index,head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim()});return H.map(x=>({n:x.n,head:x.head}));};
const cecLinks=F=>({DEFENDER:[...new Set(cecDlinks(F).map(x=>x.n))],CHALLENGER:[...new Set(cecCblocks(F).map(x=>x.n))]});
const cecOracle=F=>{const t=String(F&&F.dr4||'');const i=t.search(/OPPONENT['’]S CONTRADICTIONS\s*:?/i);if(i<0)return [];const out=[];
 for(const l of t.slice(i).split('\n').slice(1,60)){const s=l.replace(/[*_]+/g,'').trim();if(!s)continue;const m=s.match(/^(?:[-•]\s*)?(X\d+)\s+(LINK|PREMISE)\s+(\d+)\s*\|\s*EARLIER\s*\[\s*([CD]R\d)\s*\]\s*["“](.+?)["”]\s*\|\s*CLOSING\s*\[\s*([CD]R\d)\s*\]\s*["“](.+?)["”]\s*(?:\|\s*(.*))?$/i);
  if(m){out.push({id:m[1].toUpperCase(),side:'DEFENDER',by:'the Oracle (OPPONENT\'S CONTRADICTIONS, [DR4])',kind:m[2].toUpperCase(),n:+m[3],earlier_round:m[4].toUpperCase(),earlier_q:m[5],closing_round:m[6].toUpperCase(),closing_q:m[7],why:(m[8]||'').trim()});continue;}
  if(/^#|^[A-Z][A-Z' ]{6,}:/.test(s)&&out.length)break;}
 return out;};
const cecReclaim=(F,links,prev)=>{/* pkgRCL rev 3: a close keeps links "as declared" after a narrowing; names from the clause "as declared" closes; no negation, no condition, no question, no other side, not inside a quotation */const out=[],st=x=>x.replace(/[*_]+/g,'').replace(/^[\s>#-]+/,'').trim(),SE=/(?<=[.!?]["”’')\]]*)\s+/;let k=Math.max(0,...prev.map(c=>+String(c.id).slice(1)||0));
 for(const [sd,P,r,O] of [['DEFENDER','CR',['cr2','cr3','cr4'],/\b(?:challenger|opponent|other side)/i],['CHALLENGER','DR',['gr2','dr3','dr4'],/\b(?:defender|opponent|other side)/i]]){let q=null,cl='';
  for(const x of String(F[r[2]]||'').split(/\n+/).flatMap(l=>l.split(SE)).map(st)){const m=x.match(/\bas declared\b/i);if(!m)continue;const c=x.slice(0,m.index+11).split(/[;:]|\bbut\b|\bas narrowed\b/i).pop()+x.slice(m.index+11).split(/\band\b|[;:.]|\bbut\b/i)[0];
   if(/\b(?:stands?|keep|kept|holds?|remains?)\b/i.test(c)&&!/\b(?:not|never|no longer|cannot)\b|n[’']t\b/i.test(c)&&!/\b(?:if|unless|whether|would|should|could)\b/i.test(c)&&!/\?["”’')\]]*$/.test(x)&&!O.test(c)&&(x.slice(0,m.index).match(/["“”]/g)||[]).length%2===0){q=x;cl=c;break;}}
  if(!q)continue;const T=sd[0],nm=new Set();for(const m of cl.matchAll(new RegExp('\\b'+T+'(\\d+)(?:\\s*(?:to|through|-|–)\\s*'+T+'?(\\d+))?','gi')))for(let i=+m[1];i<=+(m[2]||m[1]);i++)nm.add(i);
  const last={};r.slice(0,2).forEach((key,j)=>{for(const l of String(F[key]||'').split('\n')){const m=st(l).match(/^LINK\s+(\d+)\s*:\s*(NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b.*$/i);if(m)last[+m[1]]=[P+(j+2),m[0].split(SE)[0],m[2].toLowerCase().replace(/ to$/,'')];}});
  for(const n of (links[sd]||[]).filter(n=>last[n]&&(!nm.size||nm.has(n)))){const e=last[n];out.push({id:'X'+(++k),side:sd,by:'the code (pkgRCL)',kind:'LINK',n,earlier_round:e[0],earlier_q:e[1],closing_round:P+'4',closing_q:q,why:'the code found a closing sentence that keeps LINK '+n+' "as declared" and a line in ['+e[0]+'] that '+e[2]+' it; decide whether the close asserts again a part the earlier line left out (a part left out of a narrowed restatement counts as dropped)'});}}
 return out;};
const S=$('Init Seats').first().json;let RS=null;try{RS=$('Resolve Seats').first().json;}catch(e){RS=null;}
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}
let F=null;try{F=RGL?RGL.f:$('Final Output').first().json;}catch(e){F=null;}
const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;
const miss=F?['cr1','cr2','cr3','cr4','gr1','gr2','dr3','dr4'].filter(k=>!String(F[k]||'').trim()):['all rounds'];
if(!F||!ds||F&&(!String(F.cr4||'').trim()&&!String(F.dr4||'').trim()))return [{json:{cec_skip:true,why:!F?'no rounds found':!ds?'no DeepSeek model_config row':'no closing round',run_token:S.run_token}}];
const links=cecLinks(F);const cands=cecOracle(F);cands.push(...cecReclaim(F,links,cands));
const PROMPT="You are the closing enforcer. A debater's closing round may not contradict what the same debater stated in its earlier rounds. Below are one debater's four rounds.\nRead its closing round against its earlier rounds. List every closing sentence that cannot be true together with an earlier sentence, and answer every candidate listed.\nA contradiction is two statements that cannot both be true. A closing sentence that asserts again, as the debater's own, what it withdrew, dropped or gave up in an earlier round IS a contradiction.\nIt is NOT a contradiction when the closing sentence: grants, concedes, narrows or withdraws something; states or quotes the other side's position; answers a press with a further reason the earlier sentence leaves room for; or differs only in wording.\nQuote both sentences word for word and name the link: the link whose closing block holds the sentence, else the link the earlier sentence supports.\nReply with one line per contradiction and per candidate, and nothing else:\nCLOSE-CONTRADICTION: <candidate id or NEW> -- <DEFENDER|CHALLENGER> -- LINK <n> -- CONFIRMED | NOT A CONTRADICTION -- EARLIER [<round>] \"<words>\" -- CLOSING [<round 4>] \"<words>\" -- <one sentence: why both cannot be true, or why they can>\nIf you find none and there is no candidate, reply: CLOSE-CONTRADICTION: NONE";
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
}catch(__e){let __rt=null;try{__rt=$('Init Seats').first().json.run_token||null;}catch(e){}return [{json:{cec_skip:true,why:'Close Enforcer Build failed: '+String(__e&&__e.message||__e).slice(0,300),run_token:__rt}}];}