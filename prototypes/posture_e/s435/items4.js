// s435 (WALL-1963 revision 8, piece 4a; rulings 428, 439, 443). Code checks, a row only on a violation: E-OOR, each OUT-OF-ROUND CONCESSIONS line
// against its own rule (a round outside the link rounds, the sentence verbatim in that round, COUNTED only on a close-round line); E-CHAIN, a chain mark
// FOOTED while a block of that side's link round exhibits fewer than two prior layers. Model reading: E-WD, each "D<i>: WITHDRAWN" line, read
// against the defender's own give-up sentences.
const RT={CR1:R&&R.CR1,CR2:R&&R.CR2,CR3:R&&R.CR3,CR4:R&&R.CR4,DR1:R&&R.DR1,DR2:R&&R.DR2,DR3:R&&R.DR3,DR4:R&&R.DR4};
const NQ=s=>N(s).replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const cv4=(rule,seat,line,why)=>code_rows.push({run_token:S.run_token,seat,seat_role:'panel',judge_model:null,kind:'enforcer_check',rule,item:rule==='E-OOR'?'OUT-OF-ROUND CONCESSION':'CHAIN MARK',flagged_line:String(line||'').slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:String(line||'').slice(0,700),cure_status:null,
 cure_reason:'ENFORCER DISAGREE: '+why+' (code check of the judges\' own rules; ruling 443)',at:T0});
const layersOf=b=>{const has=k=>new RegExp('\\[L'+k+'\\][ \\t*:]*[A-Za-z0-9"\u201c\'(]').test(b);return [1,2,3].filter(has).length;}; /* a tag followed on its own line by words, not an empty tag */
for(const j of judges){const ls=linesOf(j.t);const i0=ls.findIndex(l=>/^OUT-OF-ROUND CONCESSIONS\s*:?\s*$/.test(l));
 if(i0>=0)for(let i=i0+1;i<ls.length;i++){const l=ls[i];if(/^(DEFENDER|CHALLENGER) CHAIN MARK\b/.test(l)||/^\[AUDIT/.test(l)||/^NONE\b/.test(l))break;
  const m=l.match(/^(DEFENDER|CHALLENGER)\s*\|\s*\[?((?:CR|DR)[1-4])\]?\s*\|\s*([\s\S]+)$/);if(!m)continue;
  const rd=m[2];let sent=m[3].trim();const counted=/(?:\||--)\s*COUNTED\.?\s*$/.test(sent);sent=sent.replace(/\s*(?:\||--)\s*COUNTED\.?\s*$/,'').replace(/^["“]|["”]$/g,'');
  if(/^(CR3|DR3)$/.test(rd))cv4('E-OOR',j.seat,l,'an OUT-OF-ROUND CONCESSIONS line names ['+rd+'], a link round; the section lists ground granted "OUTSIDE the two link rounds"');
  const side=m[1]==='DEFENDER'?'CR':'DR';if(rd.slice(0,2)!==side)cv4('E-OOR',j.seat,l,'the line names '+m[1]+' but the round ['+rd+'] is the other side\'s');
  const q=NQ(sent);if(q.split(' ').length>=4&&!NQ(RT[rd]).includes(q.slice(0,240)))cv4('E-OOR',j.seat,l,'the sentence is not found verbatim in ['+rd+'] ("the verbatim sentence in which the ground was granted")');
  if(counted&&!/^(CR4|DR4)$/.test(rd))cv4('E-OOR',j.seat,l,'COUNTED ends a line from ['+rd+']; only a close-round ([CR4] or [DR4]) concession enters the counts ("Ground granted in [CR1], [DR1], [CR2] or [DR2] ... does not enter those counts")');}
 for(const sd of ['DEFENDER','CHALLENGER']){const ml=ls.find(l=>new RegExp('^'+sd+' CHAIN MARK\\s*:').test(l));if(!ml)continue;const mk=(ml.match(/CHAIN MARK\s*:\s*(FOOTED|STRAINED|SLACK)\b/)||[])[1];if(mk!=='FOOTED')continue;
  const bl=blocksOf(sd==='DEFENDER'?R&&R.CR3:R&&R.DR3).filter(b=>/\[L[1-4]\]/.test(b.t));const thin=bl.filter(b=>layersOf(b.t)<2);
  if(thin.length)cv4('E-CHAIN',j.seat,ml,sd+' CHAIN MARK is FOOTED, but '+thin.map(b=>'LINK '+b.link+' exhibits '+layersOf(b.t)+' prior layer(s)').join('; ')+' in its link round; "a link floats only when the block that states it exhibits fewer than two prior layers" (STRAINED)');}}
const WG=[];
for(const j of judges)for(const l of linesOf(j.t)){const m=l.match(/^D(\d+)\s*:\s*WITHDRAWN\b\s*(?:--|—|–|-)?\s*(?:GROUND\s*:\s*)?([\s\S]*)$/);if(!m)continue;WG.push({seat:j.seat,line:l,link:'D'+m[1],ground:m[2]||''});}
let wi=0;
for(const g of WG){wi++;const id='W'+wi+'.1';const gu=giveUp([R&&R.CR3,R&&R.CR4].join('\n'),g.ground+' '+g.link);
 items.push({ids:[{id,rule:'E-WD',seat:g.seat,grade:'WITHDRAWN',item:'WITHDRAWN '+g.link,flagged_line:g.line.slice(0,1500),response_line:g.line.slice(0,700)}],
  text:'ITEM W'+wi+' (E-WD, a defender link graded WITHDRAWN):\nTHE LINE ('+id+', '+g.seat+'): '+cut(g.line,700)+'\nTHE DEFENDER\'S OWN GIVE-GROUND SENTENCES IN [CR3] AND [CR4]:\n'+(gu||'(none found)')});}
