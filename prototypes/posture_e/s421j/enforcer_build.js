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
const excerpt=(rk,s)=>{const t=clean(R&&R[rk]);if(!t)return '(round text not available)';const k=clean(s).slice(0,60);let i=k?t.indexOf(k):-1;if(i<0)i=t.indexOf(clean(s).slice(0,30));if(i<0)return '(sentence not found in ['+rk+'])';
 const a=Math.max(0,t.lastIndexOf('\n#',i)>=0&&i-t.lastIndexOf('\n#',i)<1600?t.lastIndexOf('\n#',i):i-1200),b=Math.min(t.length,i+900);return t.slice(a,b).trim();};
const G=[];const key=r=>r.rule+'|'+rkOf(r)+'|'+clean(sentOf(r)).slice(0,120);
for(const r of rows){let g=G.find(x=>x.key===key(r));if(!g){g={key:key(r),rule:r.rule,rk:rkOf(r),sent:sentOf(r),item:r.item,ans:[]};G.push(g);}g.ans.push(r);}
const ids=[];const parts=G.map((g,k)=>{const lines=g.ans.map((r,j)=>{const id='A'+(k+1)+'.'+(j+1);ids.push({id,row:r});return '- '+id+' ('+r.seat+'): '+(r.response_line?String(r.response_line).replace(/\s+/g,' ').slice(0,700):'none written');});
 return 'ITEM G'+(k+1)+' ('+g.rule+', '+g.item+'):\nTHE SIDE\'S SENTENCE: "'+String(g.sent).slice(0,300)+'"\nROUND EXCERPT ['+(g.rk||'?')+']:\n'+excerpt(g.rk,g.sent)+'\nTHE JUDGES\' ANSWERS:\n'+lines.join('\n');});
const SYS='You are the enforcer of a debate panel. You check the judges\' written answers against the debate round words quoted to you. You bring nothing from outside the record: no doctrine, no training knowledge, no reading of your own. You check only whether each answer agrees with the quoted round words. You do not judge the debate.';
const RULES='RULE K-W (a side withdrew or granted, in its own round, footing of a link it keeps). A judge answers STANDS WITHOUT IT because <a layer>, or CONCEDED. AGREE with STANDS WITHOUT IT only when the layer the judge names stands in the round excerpt for that link and does not itself need what the side withdrew or granted. AGREE with CONCEDED only when the link\'s own conclusion needed what the side withdrew or granted. Otherwise DISAGREE.\n'
 +'RULE K-S3 (a close-round concession the judge\'s count did not mark COUNTED). A judge answers COUNTED, or TOUCHES NO LINK: <why>. AGREE with COUNTED when the concession gives up part of a declared link or of a listed premise. AGREE with TOUCHES NO LINK only when it gives up neither. Otherwise DISAGREE.\n'
 +'An answer that is missing, or in neither form: NO ANSWER.\n'
 +'Reply with exactly one line per answer id, and nothing else, in this form:\nENFORCER: <answer id> -- AGREE | DISAGREE | NO ANSWER -- <one sentence that quotes the round words that decide it>';
const USER=RULES+'\n\n'+parts.join('\n\n');
const body={model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:USER}]};
return [{json:{enf_skip:false,body,ids:ids.map(x=>({id:x.id,seat:x.row.seat,seat_role:x.row.seat_role,rule:x.row.rule,item:x.row.item,flagged_line:x.row.flagged_line,response_line:x.row.response_line,cure_status:x.row.cure_status})),groups:G.length,model:ds.api_model,run_token:S.run_token}}];
