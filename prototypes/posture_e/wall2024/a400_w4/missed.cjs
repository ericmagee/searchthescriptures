// W1/W2/W3 after 8521-8523: stored rows where a link in the seat's retracted list still reads STANDS or UNDERDETERMINED but v25 never rewrote it (no "RETRACTED <link> (... to ...)" in the seat's v25 TRIGGER).
const J=require('../a384/judgments_all.json');const D=require('../a386/dbcols.json');const E=require('./ev.cjs')(__dirname+'/../a386/t386.json');
const byId=new Map(D.map(x=>[x[0],{verdict_tag:x[1],defense_standing:x[2],challenge_standing:x[3],conceded_links:x[4],challenger_conceded_links:x[5]}]));
const W=t=>(t.split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];const K=s=>String(s||'').replace(/\s+/g,' ').trim().toUpperCase();
const out=[];let rowsWithRet=0,keptRewritten=0,keptRestated=0;const restated=[];let keptMissed=0,brokenLeft=0;
for(const j of J){const v=j.v||'';const ret=E.ret386(v,j.seat)||[];if(!ret.length)continue;rowsWithRet++;
 const col=E.rcLines(E.cureJText(v,true)).col||[];
 const trig=[...v.matchAll(/\[AUDIT v25: RECOMPUTED AFTER CURE -- SEAT: ([^;\]]*); TRIGGER: ([^\n]*?); ORIGINAL:/g)].filter(m=>m[1]===j.seat).map(m=>m[2]).join(' | ');
 for(const l of ret){const lines=col.filter(z=>K(z.link)===K(l));
  for(const z of lines){const g=String(z.grade||'');
   if(/LINK BROKEN$/.test(g)){brokenLeft++;continue;}
   const re=new RegExp('RETRACTED '+l.replace(/\s+/g,'\\s+')+' \\([^)]*? to [^)]*\\)','i');
   const sup=new RegExp('\\[AUDIT v27: SUPERSEDED LINE -- SEAT: '+j.seat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'; LABEL: '+l.replace(/\s+/g,'\\s+')+'; ORIGINAL: [^\\n]*?LINK BROKEN','i').test(v);
   if(re.test(trig))keptRewritten++;else if(sup){keptRestated++;restated.push({id:j.id,seat:j.seat,link:l,grade:g});}else{keptMissed++;out.push({id:j.id,seat:j.seat,link:l,grade:g,v25_trigger:trig.slice(0,200)||'(no v25 tag for this seat)',word_rev4c:W(E.ert386(v,j.seat,byId.get(j.id)||{}))});}}}}
console.log({rows_with_retracted_list:rowsWithRet,retracted_lines_rewritten_by_v25_kept:keptRewritten,retracted_lines_restated_by_judge_v27_kept:keptRestated,retracted_lines_never_rewritten_STANDS_or_UND_kept:keptMissed,retracted_lines_still_LINK_BROKEN_left_out:brokenLeft});
for(const o of restated)console.log('RESTATED',JSON.stringify(o));for(const o of out)console.log(JSON.stringify(o));require('fs').writeFileSync(__dirname+'/missed_out.json',JSON.stringify({restated,out},null,1));
