// E-APPLY (W2; E-GATE keystone rules 2251 added by pkgGATE; WALL-2024 rulings 2236 and 2237; Eric 23:13 CST "did the judge have statement and the enforcer act on this?"): a panel judge's
// own send-back answer CHANGE TO is applied. Before this, Send Back Record recorded it and nothing used it (its header: "NOT BUILT"), so on
// run 32973 gemini rewrote all 14 flagged lines, its RESULT to CHALLENGER WINS among them, and its HELD vote was counted.
// Each CHANGE TO line replaces the judge's flagged line in that judge's text; the original is kept as a SUPERSEDED LINE. When several
// changes name one line (32973 gemini S10 to S13 on CONCEDED LINKS), the last one wins and the record says so. The counts, standings,
// verdict and RESULT are then derived from the corrected text by the cure's rule (engine_manual v85 section 8, the tie rule KB-0030 with it).
// Not applied, and listed as a SEND-BACK ITEM: a change whose flagged line is not in the judge's text; a change with no line form the
// engine reads (an instruction such as "Remove the [CR4] concession line"); a change that contradicts the judge's KEYSTONE line (the
// keystone STANDS while a keystone collision line is graded DEFENDER LINK BROKEN, or BROKEN while none is). A CHANGE TO "RESULT: X" is
// never written: the RESULT is derived, and a derived RESULT that differs from it is a SEND-BACK ITEM. KEEP answers change nothing.
// RECORD-ONLY part: a SEND-BACK ITEM is written to the row and the enforcer log; no further call is made, so it removes no seat yet.
const SB_ROW=/^(DEFENDER|CHALLENGER)\s*\|\s*\[?\s*([CD]R\d)\s*\]?\s*\|\s*(.+?)(?:\s+(?:--|\u2014)\s+.*)?$/i; /* an OUT-OF-ROUND CONCESSIONS row: SIDE | [round] | quote -- tag */
const SB_FORM=/^(?:(?:DEFENDER|CHALLENGER)\s*\|\s*\[?\s*[CD]R\d\s*\]?\s*\||D\d+\s+vs\.?\s+C\d+\b|D\d+\s*(?::|--|\u2014)|(?:CHALLENGER\s+)?CONCEDED LINKS\s*:|(?:DEFENSE|CHALLENGE) STANDING\s*:|KEYSTONE\s*:|CLAUSE\s*:|ANSWER CHECK\s*:|FORCED\s*:|PREMISE\s+\d+\b|RULING\b)/i;
function sbLabel(l){const u=String(l||'').replace(/\\+/g,'').replace(/[*_`]+/g,'').trim().replace(/^(?:[-\u2022]|\d+[.)])?\s*/,'').toUpperCase();const m=u.match(/^(D\d+)\s+VS\.?\s+(C\d+)\b/);if(m)return m[1]+' VS '+m[2];const k=u.match(/^(KEYSTONE|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENSE STANDING|CHALLENGE STANDING|CLAUSE)\s*:/);return k?k[1]:null;}
function sbApply2024(seat,raw,F,its,RD){const one=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();const nrm=s=>one(String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'')); /* the flagged line arrives with its quotes escaped once more than the text (run 32973: \\\\\" against \\") */const U=s=>String(s==null?'':s).toUpperCase();
 const text=cureJText(raw,true);const lines=text.split('\n');const find=l=>{const n=nrm(l);if(!n)return null;return lines.find(x=>nrm(x)===n)||null;};
 const ch=(its||[]).filter(x=>x&&x.ans==='CHANGE');const items=[];const map=new Map();let resTo=null;
 for(const x of ch){const to=one(String(x.to==null?'':x.to).replace(/\\+"/g,'"')).replace(/^["\u201c]+|["\u201d]+$/g,'').trim();
  if(/^RESULT\s*:/i.test(to)){resTo={sid:x.sid,to};continue;}
  let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}} /* E-GATE: a gate change may name a line as an earlier change rewrote it */
  /* a K-S3 item names the concession as "DEFENDER CR4: <quote>" (an engine line, not the judge's): a CHANGE TO in the row form replaces the
     judge's own row of that side, round and quote */
  if(!o){const m=to.match(SB_ROW);if(m){const q=nrm(m[3]).replace(/^["\u201c]+|["\u201d]+$/g,'').toUpperCase();o=lines.find(l=>{const r=nrm(l).match(SB_ROW);return r&&r[1].toUpperCase()===m[1].toUpperCase()&&r[2].toUpperCase()===m[2].toUpperCase()&&nrm(r[3]).replace(/^["\u201c]+|["\u201d]+$/g,'').toUpperCase()===q;})||null;}}
  if(/^NOT HELD\b/i.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'a NOT HELD dispute written under CHANGE TO, not a line change',to});continue;} /* W1, 2239: run 32949 grok S2, S3 */
  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}
  if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads',to});continue;}
  /* a judge may write one collision, KEYSTONE, count or standing line twice (or rewrite another line under that label): every
     line of that label takes the change, or the old grade would stand beside the new one */
  const lk=sbLabel(to);const same=lk?lines.filter(l=>sbLabel(l)===lk):[]; /* run 32973 grok S26: its FORCED line rewritten as "D6 vs C3 ...: STANDS" also replaces the D6 vs C3 collision line */
  for(const o2 of [...new Set([o].concat(same))]){const p=map.get(o2);map.set(o2,{sid:x.sid,to,over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[])});}}
 const build=M=>{let t=text;for(const [o,c] of M)t=t.split(o).join(c.to);return t;};
 // the keystone check (E-GATE, WALL-2024 2251): on the corrected text, the KEYSTONE line agrees with the keystone's collision lines (rule 0), and
 // with the verdict derived from all the collision lines when it says BROKEN (rule 2). Rule 1: a KEYSTONE BROKEN line with no broken keystone collision is exempt
 // from rule 0 when its GROUND quotes a defender grant standing in the named defender round, or names a premise its CONCEDED LINKS line counts.
 // Only a change that touches a line of the contradiction is refused; a contradiction no change touched was already in the judgment.
 const keyChecks=(T)=>{const P=rcLines(T);if(!P.key)return [];const m=P.key.u.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/);if(!m)return [];const out=[];
  const kc=P.col.filter(z=>U(z.link).startsWith(m[1]+' VS'));const br=kc.some(z=>z.grade==='DEFENDER LINK BROKEN');
  if(m[2]==='STANDS'&&br)out.push({k:m[1],rule:0,why:'KEYSTONE '+m[1]+' STANDS while '+kc.filter(z=>z.grade==='DEFENDER LINK BROKEN').map(z=>z.link).join(', ')+' is graded DEFENDER LINK BROKEN',lines:[P.key.raw].concat(kc.map(z=>z.raw))});
  if(m[2]==='BROKEN'&&!br&&!sbKeyExempt2024(P.key.raw,P,RD))out.push({k:m[1],rule:0,why:'KEYSTONE '+m[1]+' BROKEN while no '+m[1]+' collision line is graded DEFENDER LINK BROKEN, and its GROUND quotes no defender grant found in the named defender round and names no premise its CONCEDED LINKS line counts',lines:[P.key.raw].concat(kc.map(z=>z.raw))});
  if(m[2]!=='WITHDRAWN'){const bw=sbBrokenWord2024(P);const g0=new Map(rcLines(text).col.map(z=>[U(z.link),z.grade]));const fl=P.col.filter(z=>g0.has(U(z.link))&&(g0.get(U(z.link))==='DEFENDER LINK BROKEN')!==(z.grade==='DEFENDER LINK BROKEN'));
   if(m[2]==='BROKEN'&&!bw)out.push({k:m[1],rule:2,why:'KEYSTONE '+m[1]+' BROKEN while the verdict derived from the corrected collision lines is not BROKEN',lines:[P.key.raw].concat(fl.map(z=>z.raw))}); /* W3 2261 (b): no reverse half; a non-keystone collision broken under KEYSTONE STANDS is normal (BROKEN-1). Rule 0 covers the keystone's own collision. */}
  return out;};
 {const seen=new Set();for(const kx of keyChecks(build(map))){const kn=new Set(kx.lines.map(nrm));const hit=new Set();for(const [o,c] of [...map]){if(kn.has(nrm(c.to))||kn.has(nrm(o)))hit.add(c.sid);}for(const [o,c] of [...map]){if(hit.has(c.sid))map.delete(o);}for(const sid of hit){if(seen.has(sid))continue;seen.add(sid);const c=(ch.find(z=>z.sid===sid)||{});items.push({sid,kind:'CONTRADICTION',why:kx.why+' (the change is not applied)',to:String(c.to||''),lines:kx.lines});}}}
 if(!map.size&&!items.length&&!resTo)return null;
 const T=build(map);const P=rcLines(T);const col=P.col;
 const lab={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};const c={...cnt};const trig=[];
 const changed=new Set([...map.values()].map(z=>nrm(z.to)));
 for(const sd of ['DEFENDER','CHALLENGER']){const y=P.cn[lab[sd]];if(!y||!changed.has(nrm(y.raw)))continue;const m=y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)/);if(m&&+m[1]!==cnt[sd]){c[sd]=+m[1];trig.push('COUNT '+sd+' '+cnt[sd]+' to '+c[sd]);}}
 for(const [o,z] of map){const g0=(rcLines(o).col[0]||{}).grade||null,g1=(rcLines(z.to).col[0]||{}).grade||null;if(g1&&g0!==g1)trig.push('CHANGED '+(rcLines(z.to).col[0].link)+' ('+(g0||'no grade')+' to '+g1+')');}
 const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};
 const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};
 const stand=(sd,k,orig)=>{const x=P.st[k];if(x&&/FORFEIT/.test(x.u))return orig;const n=c[sd];if(typeof n!=='number')return orig;if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return 'SELF-SUPPORTED';};
 const dst=stand('DEFENDER','DEFENSE',F.defense_standing),cst=stand('CHALLENGER','CHALLENGE',F.challenge_standing);
 const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;
 const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|\u2014|-|:)\s*WITHDRAWN\b/.test(P.key.u));const k=brk.DEFENDER;
 const tag=k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=tag.split('-')[0];
 const res0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const tie=!col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&dst===cst&&c.DEFENDER===c.CHALLENGER;
 let res=word==='BROKEN'?'CHALLENGER WINS':((res0&&res0!=='CHALLENGER WINS')?res0:'UNDERDETERMINED');if(tie&&(res==='DEFENDER WINS'||res==='CHALLENGER WINS'))res='UNDERDETERMINED';
 if(resTo){const rw=(U(resTo.to).match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null;if(rw!==res)items.push({sid:resTo.sid,kind:'RESULT DIFFERS',why:'the judge wrote '+(rw?'RESULT: '+rw:'a RESULT line the engine cannot read')+'; the result derived from its corrected lines is '+res,to:resTo.to});}
 const sids=[...new Set([...map.values()].map(z=>z.sid))];const why='derived after the send-back from the judge\'s own changed lines ('+(sids.length?sids.join(', '):'none applied')+(trig.length?'; '+trig.join('; '):'')+')';
 const rp=[];for(const [o,z] of map){const k=Math.max(1,text.split(o).length-1);for(let i=0;i<k;i++)rp.push([o,z.to]);} /* cureRewrite replaces one occurrence per pair */
 if(P.result&&res!==res0)rp.push([P.result.raw,'RESULT: '+res+' -- '+why+': '+tag+'.']);
 for(const [sd,k2,st,st0] of [['DEFENDER','DEFENSE',dst,F.defense_standing],['CHALLENGER','CHALLENGE',cst,F.challenge_standing]]){const x=P.st[k2];if(x&&(st!==st0||c[sd]!==cnt[sd]))rp.push([x.raw,k2+' STANDING: '+st+' -- L='+(Lof(k2)!=null?Lof(k2):'?')+' c='+c[sd]+' -- '+why+'.']);}
 if(P.clause&&!new RegExp('^CLAUSE\\s*:\\s*'+tag+'\\b').test(P.clause.u))rp.push([P.clause.raw,P.clause.raw.replace(/^(\s*[*_]*CLAUSE[*_]*\s*:\s*[*_]*)(?:[A-Z]+-\d)?/i,'$1'+tag+' ').replace(/\bk\s*=\s*\d+/i,'k='+k)]);
 const fields={verdict_tag:word,defense_standing:dst,conceded_links:c.DEFENDER,challenge_standing:cst,challenger_conceded_links:c.CHALLENGER};
 const f=(t,d,dc,s2,cc,r)=>t+', DEFENSE '+d+' '+dc+', CHALLENGE '+s2+' '+cc+', RESULT '+(r||'none');
 const over=[...new Map([...map.values()].filter(z=>z.over.length).map(z=>[z.sid,z])).values()].map(z=>z.sid+' replaces '+z.over.join(', ')+' on the same line (the last change wins)');
 const audit='[AUDIT v37: SEND-BACK APPLIED (E-APPLY; WALL-2024 2236, 2237) -- SEAT: '+seat+'; APPLIED: '+(sids.length?sids.join(', '):'none')+(over.length?'; '+over.join('; '):'')+'; ORIGINAL: '+f(F.verdict_tag,F.defense_standing,F.conceded_links,F.challenge_standing,F.challenger_conceded_links,res0)+'; DERIVED: '+f(word+' ('+tag+')',dst,c.DEFENDER,cst,c.CHALLENGER,res)+'; RULE: engine_manual v85 section 8 and the tie rule KB-0030, applied to the corrected lines]'
  +items.map(z=>'\n[AUDIT v37: SEND-BACK ITEM -- SEAT: '+seat+'; '+z.sid+'; '+z.kind+': '+cureSafe(z.why)+'; LINE: '+cureSafe(String(z.to||'').slice(0,300))+'; RECORD-ONLY: no further call is made, it removes no seat. REVIEW THIS ROW.]').join('');
 return {text:T,fields,result:res,result0:res0,tag,trig,rp,audit,retracted:sids.length?['none; send-back changes '+sids.join(', ')+' applied']:['none'],cpAdd:null,items,applied:sids};}
