// ruling 421 (#1 and #4; TRIAL; md_notes_rulings 421: "remove deepseek as a judge and debator and make it a default enforcer"): the DeepSeek enforcer.
// Code found each item (K-W: a side's own withdrawal or grant; K-S3: a close-round concession not marked COUNTED), each panel judge answered it in
// its cure (Panel Cure Check, enforcer_log rows), and here one DeepSeek call checks every answer against the round words. TRIAL: its verdicts are
// recorded in debate_enforcer_log (kind enforcer_check) and remove no seat. Items are grouped by the side's sentence, so a round excerpt is sent once.
const PCC=$('Panel Cure Check').first().json;const S=$('Init Seats').first().json;let RS=null;try{RS=$('Resolve Seats').first().json;}catch(e){RS=null;}
const rows=(PCC.enforcer_log||[]).filter(r=>r&&(r.rule==='K-W'||r.rule==='K-S3'));
const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;
if(!rows.length||!ds)return [{json:{enf_skip:true,why:!rows.length?'no K-W or K-S3 item was asked':'no DeepSeek model_config row'}}];
let R=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if($(n).isExecuted)for(const it of $(n).all()){const c=it.json&&it.json.cure;if(c&&c.rounds){R=c.rounds;break;}}}catch(e){}if(R)break;}
const clean=s=>String(s||'').replace(/[*_`]+/g,'');
const sentOf=r=>{const l=String(r.flagged_line||'');if(r.rule==='K-W'){const m=l.match(/:\s*"([\s\S]*)"\s*$/);return m?m[1]:l;}const m=l.match(/^(?:DEFENDER|CHALLENGER)\s+(?:CR|DR)[1-4]\s*:?\s*([\s\S]*)$/i);return m?m[1]:l;};
const rkOf=r=>((String(r.item||'')+' '+String(r.flagged_line||'')).match(/\b((?:CR|DR)[1-4])\b/)||[])[1]||null;
const nzd=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/["\u201c\u201d\u2018\u2019']/g,'').replace(/\s+/g,' '); /* run 32662: a judge wrote "ginosko" for the round's "ginōskō" and dropped the marks around "only"; accents, quotation marks and spacing are not read */
// ruling 424 (run 32677): the enforcer reads the link's own blocks from every round of the side that holds it, not a window around the sentence.
const HD=/(?:^|\n)[ \t>#*-]*((?:LINK\s*\d+|[DC]\d+)\b[^\n:]{0,60}):/gi;
const blocksOf=t=>{t=clean(t);const hs=[...t.matchAll(HD)].map(m=>({at:m.index,lab:m[1]}));return hs.map((h,k)=>({lab:h.lab,text:t.slice(h.at,k+1<hs.length?hs[k+1].at:t.length).trim()}));};
const tokOf=lab=>{const m=String(lab||'').match(/LINK\s*\d+|\b[DC]\d+\b/i);return m?m[0].replace(/\s+/g,' ').toUpperCase():null;};
const SIDE_RK={CR:['CR1','CR2','CR3','CR4'],DR:['DR1','DR2','DR3','DR4']};
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const excerpt=(rk,s,lab)=>{if(!R||!rk)return '(round text not available)';const fam=rk.slice(0,2);const tok=tokOf(lab);const key=nzd(s).slice(0,60),key2=nzd(s).slice(0,30);const parts=[];let own=null;
 for(const r of SIDE_RK[fam]){const t=R[r];if(!t)continue;
  if(r.endsWith('1')){if(tok){const rx=new RegExp('\\b'+tok.replace(' ','\\s*')+'\\b','i');const ls=clean(t).split('\n').filter(l=>rx.test(l)).slice(0,4);if(ls.length)parts.push('['+r+'] '+ls.map(l=>cut(l,500)).join(' / '));}continue;}
  for(const b of blocksOf(t)){const bt=tokOf(b.lab);const mine=!!tok&&bt===tok;const nb=nzd(b.text);const hasS=nb.includes(key)||(!!key2&&nb.includes(key2));
   if(r===rk&&hasS&&(mine||!own))own={r,b,mine};if(mine)parts.push('['+r+'] '+cut(b.text,3500));}}
 if(!own){const k=nzd(R[rk]||'').indexOf(key);if(k<0)parts.unshift('(the sentence was not found in ['+rk+'])');}
 else if(!own.mine)parts.unshift('['+own.r+'] (the block holding the sentence) '+cut(own.b.text,3500));
 return cut(parts.join('\n\n'),9000)||'(no block of this link found)';};
const G=[];const key=r=>r.rule+'|'+String(r.item||'').replace(/\s*#\d+$/,'')+'|'+clean(sentOf(r)).slice(0,120); /* ruling 424: "I grant that." under D3 and under D5 are two items */
for(const r of rows){let g=G.find(x=>x.key===key(r));if(!g){g={key:key(r),rule:r.rule,rk:rkOf(r),sent:sentOf(r),item:r.item,lab:(String(r.item||'').match(/(?:CR|DR)[1-4]\s+(.+?)\s+#\d+$/)||[])[1]||null,ans:[]};G.push(g);}g.ans.push(r);}
const ids=[];const parts=G.map((g,k)=>{const lines=g.ans.map((r,j)=>{const id='A'+(k+1)+'.'+(j+1);ids.push({id,row:r});return '- '+id+' ('+r.seat+'): '+(r.response_line?String(r.response_line).replace(/\s+/g,' ').slice(0,700):'none written');});
 return 'ITEM G'+(k+1)+' ('+g.rule+', '+g.item+'):\nTHE SIDE\'S SENTENCE: "'+String(g.sent).slice(0,300)+'"\nTHE SIDE\'S OWN BLOCKS FOR THIS LINK, FROM EVERY ROUND OF THAT SIDE:\n'+excerpt(g.rk,g.sent,g.lab)+'\nTHE JUDGES\' ANSWERS:\n'+lines.join('\n');});
const SYS='You are the enforcer of a debate panel. You check the judges\' written answers against the debate round words quoted to you. You bring nothing from outside the record: no doctrine, no training knowledge, no reading of your own. You check only whether each answer agrees with the quoted round words. You do not judge the debate.';
const RULES='RULE K-W (a side withdrew or granted, in its own round, footing of a link it keeps). A judge answers STANDS WITHOUT IT because <a layer>, or CONCEDED. Decide FIRST, from the side\'s own blocks given you: does the link\'s own conclusion, as the side states it, need what the sentence withdrew or granted? If it NEEDS it, the right answer is CONCEDED: AGREE with CONCEDED and DISAGREE with STANDS WITHOUT IT. If it does NOT need it, the right answer is STANDS WITHOUT IT: AGREE when the layer the judge names is footing the side itself gives this link, and DISAGREE when the judge supplies footing the side never gave. A verse missing from the blocks given you is not, by that alone, a reason to disagree: read the meaning the side shows.\n'
 +'RULE K-S3 (a close-round concession the judge\'s count did not mark COUNTED). A judge answers COUNTED, or TOUCHES NO LINK: <why>. Decide FIRST: does the concession give up part of a declared link or of a listed premise? If it does, AGREE with COUNTED and DISAGREE with TOUCHES NO LINK; if it does not, the reverse.\n'
 +'An answer that is missing, or in neither form: NO ANSWER.\n'
 +'Reply with exactly one line per answer id, and nothing else, in this form:\nENFORCER: <answer id> -- AGREE | DISAGREE | NO ANSWER -- NEEDS: YES | NO -- <one sentence that quotes the side\'s words that decide it>';
const USER=RULES+'\n\n'+parts.join('\n\n');
const body={model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:USER}]};
return [{json:{enf_skip:false,body,ids:ids.map(x=>({id:x.id,seat:x.row.seat,seat_role:x.row.seat_role,rule:x.row.rule,item:x.row.item,flagged_line:x.row.flagged_line,response_line:x.row.response_line,cure_status:x.row.cure_status})),groups:G.length,model:ds.api_model,run_token:S.run_token}}];
