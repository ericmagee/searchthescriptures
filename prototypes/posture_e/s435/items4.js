// s435 (WALL-1963 revision 8, piece 4a; rulings 428, 439, 443). Code checks, a row only on a violation: E-OOR, each OUT-OF-ROUND CONCESSIONS line
// against its own rule (a round outside the link rounds, the sentence verbatim in that round, COUNTED only on a close-round line); E-CHAIN, a chain mark
// FOOTED while a block of that side's link round exhibits fewer than two prior layers.
// E-WD (the withdrawal reading) is not built: ruling 445, "withdrawals will not be included in send-backs"; a reading that can never act is barred (443).
const RT={CR1:R&&R.CR1,CR2:R&&R.CR2,CR3:R&&R.CR3,CR4:R&&R.CR4,DR1:R&&R.DR1,DR2:R&&R.DR2,DR3:R&&R.DR3,DR4:R&&R.DR4};
const NQ=s=>N(s).replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const cv4=(rule,seat,line,why)=>code_rows.push({run_token:S.run_token,seat,seat_role:'panel',judge_model:null,kind:'enforcer_check',rule,item:rule==='E-OOR'?'OUT-OF-ROUND CONCESSION':'CHAIN MARK',flagged_line:String(line||'').slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:String(line||'').slice(0,700),cure_status:null,
 cure_reason:'ENFORCER DISAGREE: '+why+' (code check of the judges\' own rules; ruling 443)',at:T0});
const layersOf=b=>{const has=k=>new RegExp('\\[L'+k+'\\][ \\t*:]*[\\p{L}\\p{N}"\u201c\'(]','u').test(b);return [1,2,3].filter(has).length;}; /* a tag followed on its own line by a letter or number of any script, not an empty tag */
for(const j of judges){const ls=linesOf(j.t);const i0=ls.findIndex(l=>/^OUT-OF-ROUND CONCESSIONS\s*:?\s*$/.test(l));
 if(i0>=0)for(let i=i0+1;i<ls.length;i++){const l=ls[i];if(/^(DEFENDER|CHALLENGER) CHAIN MARK\b/.test(l)||/^\[AUDIT/.test(l)||/^NONE\b/.test(l))break;
  const m=l.match(/^(DEFENDER|CHALLENGER)\s*\|\s*\[?((?:CR|DR)[1-4])\]?\s*\|\s*([\s\S]+)$/);if(!m)continue;
  const rd=m[2];let sent=m[3].trim();const counted=/(?:\||--)\s*COUNTED\.?\s*$/.test(sent);sent=sent.replace(/\s*(?:\||--)\s*COUNTED\.?\s*$/,'').replace(/^["“]|["”]$/g,'');
  if(/^(CR3|DR3)$/.test(rd))cv4('E-OOR',j.seat,l,'an OUT-OF-ROUND CONCESSIONS line names ['+rd+'], a link round; the section lists ground granted "OUTSIDE the two link rounds"');
  const side=m[1]==='DEFENDER'?'CR':'DR';if(rd.slice(0,2)!==side)cv4('E-OOR',j.seat,l,'the line names '+m[1]+' but the round ['+rd+'] is the other side\'s');
  const q=NQ(sent);if(q.split(' ').length>=4&&!NQ(RT[rd]).includes(q.slice(0,240)))cv4('E-OOR',j.seat,l,'the sentence is not found verbatim in ['+rd+'] ("the verbatim sentence in which the ground was granted")');
  if(counted&&!/^(CR4|DR4)$/.test(rd))cv4('E-OOR',j.seat,l,'COUNTED ends a line from ['+rd+']; only a close-round ([CR4] or [DR4]) concession enters the counts ("Ground granted in [CR1], [DR1], [CR2] or [DR2] ... does not enter those counts")');}
 for(const sd of ['DEFENDER','CHALLENGER']){const ml=ls.find(l=>new RegExp('^'+sd+' CHAIN MARK\\s*:').test(l));if(!ml)continue;const mk=(ml.match(/CHAIN MARK\s*:\s*(FOOTED|STRAINED|SLACK)\b/)||[])[1];if(mk!=='FOOTED')continue;
  /* only the link the judge's own mark names is read (the rule speaks of the load-bearing link; the mark names it: "one clause naming the load-bearing
     link that decides the mark"); a mark that names no link by number, or "keystone" for the last link, is not checked */
  const bl=blocksOf(sd==='DEFENDER'?R&&R.CR3:R&&R.DR3);if(!bl.length)continue;const clause=ml.replace(/^[A-Z ]+CHAIN MARK\s*:\s*[A-Z]+\s*/,'');
  const nm=clause.match(/\b(?:[DC]|LINK\s*)(\d+)\b/i);const ln=nm?+nm[1]:(/\bkeystone\b/i.test(clause)?Math.max(...bl.map(b=>b.link)):null);if(ln===null)continue;
  const named=bl.filter(b=>b.link===ln);if(!named.length)continue;const best=Math.max(...named.map(b=>layersOf(b.t)));
  if(best<2)cv4('E-CHAIN',j.seat,ml,sd+' CHAIN MARK is FOOTED, but the link its own clause names (LINK '+ln+') exhibits '+best+' prior layer(s) in its link round; "a link floats only when the block that states it exhibits fewer than two prior layers" (STRAINED)');}}
