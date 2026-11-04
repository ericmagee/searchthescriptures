// s434 (WALL-1963 revision 6, piece 3; rulings 428, 439). E-PREM: each premise listed against a side, with the answering side's link-round block for
// it and each panel judge's CONCEDED LINKS line for that side; the enforcer reads only what each judge rules on that premise. E-RES: each judge's
// verdict word, RESULT, CLAUSE, KEYSTONE and both STANDING and CONCEDED LINKS lines, with that judge's collision lines, read against the judges' own rules.
const ANS={D:String(R&&R.CR3||''),C:String(R&&R.DR3||'')};
const listCut=t=>{t=String(t||'');const i=t.search(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);return i>0?t.slice(0,i):t;};
const blocksOf=t=>listCut(t).split(/\n(?=\s*(?:#+\s*|\*\*)?\s*LINK\s+\d+\b)/).map(b=>{const h=b.match(/^\s*(?:#+\s*|\*\*)?\s*LINK\s+(\d+)\b([^\n]*)/);if(!h)return null;const p=(h[2].match(/\[premise\s+(\d+)\]/i)||[])[1];return {link:+h[1],prem:p?+p:null,t:b.trim()};}).filter(Boolean);
/* a block tagged "[premise n]" answers premise n; else the untagged block LINK n is read as its answer, and the item says it was found by number */
const answerFor=(sd,n)=>{const bs=blocksOf(ANS[sd]);const tg=bs.filter(b=>b.prem===n);if(tg.length)return {t:tg.map(b=>b.t).join('\n'),by:'tag'};const b=bs.find(b=>b.prem===null&&b.link===n);return b?{t:b.t,by:'number'}:null;};
const CLN={D:[],C:[]};
for(const j of judges)for(const l of linesOf(j.t)){if(/^CHALLENGER CONCEDED LINKS\b/.test(l))CLN.C.push({seat:j.seat,line:l});else if(/^CONCEDED LINKS\b/.test(l))CLN.D.push({seat:j.seat,line:l});}
const listNums=sd=>{const t=LIST[sd];if(!t)return [];const o=[];for(const m of String(t).matchAll(/\n\s*(?:\*\*)?\s*(\d{1,2})[.)]\s/g))if(!o.includes(+m[1]))o.push(+m[1]);return o;};
let pi=0;
for(const sd of ['D','C']){if(!CLN[sd].length)continue;
 for(const n of listNums(sd)){const e=entry(sd,n);if(!e)continue;pi++;const a=answerFor(sd,n);
  const ids=CLN[sd].map((x,k)=>({id:'P'+pi+'.'+(k+1),rule:'E-PREM',seat:x.seat,grade:'PREMISE '+n,item:(sd==='D'?'premise listed against the defender':'premise listed against the challenger')+' '+n,flagged_line:x.line.slice(0,1500),response_line:x.line.slice(0,700)}));
  items.push({ids,text:'ITEM P'+pi+' (E-PREM, '+(sd==='D'?'a premise the challenger listed against the defender':'a premise the defender listed against the challenger')+', number '+n+'):\nTHE LIST ENTRY: '+cut(e,1200)
   +'\nTHE ANSWERING SIDE\'S LINK-ROUND BLOCK FOR IT'+(a&&a.by==='number'?' (found by its LINK number; the side tagged no block for this premise)':'')+': '+(a?cut(a.t,1800):'(no block answering this premise was found by its number or tag)')
   +'\nEACH JUDGE\'S LINE FOR THIS SIDE (rule only on what it says about premise '+n+'):\n'+ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+cut(CLN[sd][k].line,900)).join('\n')});}}
/* E-RES split (WALL-1963 revision 8; ruling 443 "i don't want unnecessary activity within the flow .. i want to avoid bloat"; ruling 428 "reading
   only what code cannot"): the verdict lines' arithmetic is checked here in code against the judges' own rules, and a row is written only when a line does
   not follow (a violation, sent back like the others). The model reads only each RESULT reason sentence. */
const code_rows=[];const T0=new Date().toISOString();
const cv=(seat,line,why)=>code_rows.push({run_token:S.run_token,seat,seat_role:'panel',judge_model:null,kind:'enforcer_check',rule:'E-RES',item:'VERDICT LINES',flagged_line:String(line||'').slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:String(line||'').slice(0,700),cure_status:null,
 cure_reason:'ENFORCER DISAGREE: '+why+' (code check of the judges\' own rules; ruling 443)',at:T0});
const pickL=(ls,k)=>ls.find(l=>new RegExp('^'+k+'\\s*:').test(l))||'';
let ri=0;
for(const j of judges){const ls=linesOf(j.t);const res=pickL(ls,'RESULT'),cl=pickL(ls,'CLAUSE'),ky=pickL(ls,'KEYSTONE'),ds=pickL(ls,'DEFENSE STANDING'),cs=pickL(ls,'CHALLENGE STANDING'),dc=pickL(ls,'CONCEDED LINKS'),cc=pickL(ls,'CHALLENGER CONCEDED LINKS');
 const word=(ls.find(l=>/^(HELD|PARTIAL|BROKEN)\b/.test(l))||'').match(/^(HELD|PARTIAL|BROKEN)\b/);
 const c=cl.match(/^CLAUSE\s*:\s*(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)\s*(?:--|—|–|-)\s*n\s*=\s*(\d+)\s*w\s*=\s*(\d+)\s*k\s*=\s*(\d+)/);
 if(!c){if(res||cl)cv(j.seat,cl||res,'the CLAUSE line is not in its form ("CLAUSE: <clause> -- n=<n> w=<w> k=<k>")');}
 else if(/RECOMPUTED AFTER CURE/.test(j.t)){/* the cure recomputed this seat's lines; its raw lines are superseded, so no line-by-line arithmetic is checked here */}
 else{const [ ,cla,n0,w0,k0]=c;const n=+n0,w=+w0,k=+k0;
  const retr=new Set([...String(j.t).matchAll(/RETRACTED[:\s]+D(\d+)\s*vs\.?\s*C\d+/g)].map(m=>+m[1]));
  const brokenD=new Set();for(const l of ls){const m=l.match(/^(?:FORCED\s*:\s*)?D(\d+)\s*(?:vs\.?\s*C\d+)?\s*(?:\([^)]*\))?\s*:\s*DEFENDER LINK BROKEN\b/);if(m&&!retr.has(+m[1]))brokenD.add(+m[1]);}
  if(brokenD.size!==k)cv(j.seat,cl,'k='+k+' on the CLAUSE line, but '+brokenD.size+' defender link(s) are graded DEFENDER LINK BROKEN on this judge\'s collision lines ('+[...brokenD].map(x=>'D'+x).join(', ')+')');
  const kw=ky.match(/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|–|-)\s*(WITHDRAWN|BROKEN|STANDS)\b/);
  const coll=/COLLAPSED/.test((ds.match(/^DEFENSE STANDING\s*:\s*([A-Z-]+)/)||[])[1]||'');
  const want=k>=1?'BROKEN-1':(2*w>n||(kw&&kw[2]==='WITHDRAWN'))?'BROKEN-2':w>=1?'PARTIAL-1':coll?'PARTIAL-2':'HELD-1';
  if(want!==cla)cv(j.seat,cl,'the clauses are tried in order and the first match wins; with n='+n+' w='+w+' k='+k+(kw?' and KEYSTONE '+kw[2]:'')+(coll?' and DEFENSE STANDING COLLAPSED':'')+' the clause is '+want+', not '+cla);
  if(word&&word[1]!==cla.split('-')[0])cv(j.seat,word.input||'',('the verdict word is '+word[1]+' but the clause is '+cla));
  if(/^BROKEN/.test(cla)&&!/^RESULT\s*:\s*CHALLENGER WINS\b/.test(res))cv(j.seat,res,'"BROKEN gives CHALLENGER WINS", but the clause is '+cla+' and the RESULT is not CHALLENGER WINS');
  if(!kw)cv(j.seat,ky||cl,'the KEYSTONE line is not in its form ("KEYSTONE: D<n> -- WITHDRAWN | BROKEN | STANDS")');
  else{if(+kw[1]!==n)cv(j.seat,ky,'"The number after D MUST equal the n on the CLAUSE line": KEYSTONE D'+kw[1]+', CLAUSE n='+n);
   if(brokenD.has(+kw[1])&&kw[2]!=='BROKEN')cv(j.seat,ky,'D'+kw[1]+' is graded DEFENDER LINK BROKEN on this judge\'s collision lines, so its KEYSTONE state is BROKEN, not '+kw[2]);}}
 const stand=(st,cn,side)=>{const s0=(st.match(/STANDING\s*:\s*([A-Z-]+)/)||[])[1];const nn=cn.match(/CONCEDED LINKS\s*:\s*(\d+)/);if(!s0||!nn)return;
  if(+nn[1]>=1&&s0==='SELF-SUPPORTED')cv(j.seat,st,'"A SIDE WITH A COUNTED LINK IS NOT SELF-SUPPORTED": '+side+' CONCEDED LINKS is '+nn[1]+' and its STANDING is SELF-SUPPORTED');
  const cc0=(st.match(/\bc\s*=\s*(\d+)/)||[])[1];if(cc0!==undefined&&+cc0!==+nn[1])cv(j.seat,st,side+' STANDING gives c='+cc0+' but its CONCEDED LINKS line counts '+nn[1]);};
 stand(ds,dc,'DEFENSE');stand(cs,cc,'CHALLENGE');
 if(!res)continue;ri++;const id='R'+ri+'.1';
 items.push({ids:[{id,rule:'E-RES',seat:j.seat,grade:((res.match(/^RESULT\s*:\s*([A-Z][A-Z ]*?)\s*(?:--|—|–|$)/)||[])[1]||'?').trim(),item:'RESULT REASON',flagged_line:res.slice(0,1500),response_line:res.slice(0,700)}],
  text:'ITEM R'+ri+' (E-RES, the RESULT line of '+j.seat+'):\nTHE LINE ('+id+'): '+cut(res,900)});}
