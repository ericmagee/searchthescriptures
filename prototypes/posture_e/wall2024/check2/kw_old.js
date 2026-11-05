function kwLines421(text,R){const items=[],marks=[];if(!R)return {items,marks};const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/gi;
 for(const [side,rks] of [['DEFENDER',['CR2','CR3','CR4']],['CHALLENGER',['DR2','DR3','DR4']]]){let n=0;
  for(const rk of rks){const t=String(R[rk]||'').replace(/[*_`]+/g,'');if(!t)continue;
   for(const m of t.matchAll(RX)){if(n>=10)break;const pre=t.slice(0,m.index);const hd=[...pre.matchAll(/(?:^|\n)[ \t>#-]*((?:LINK\s*\d+|[DC]\d+)\b[^\n:]{0,40}):/gi)].pop();const lab=hd?hd[1].replace(/\s+/g,' ').trim().slice(0,30):'no link heading';
    const s=t.slice(m.index).split(/(?<=[.!?])\s|\n/)[0].slice(0,220).trim();n++;const id=side+' '+rk+' '+lab+' #'+n;
    items.push({rule:'K-W',side,link:id,line:'['+rk+'] '+lab+': "'+s+'"'});
    marks.push('[AUDIT v30: WITHDRAWAL TO ANSWER (K-W; ruling 421) -- '+id+': "'+s.replace(/[\[\]"]/g,'')+'"; the judge answers STANDS WITHOUT IT because <layer>, or CONCEDED. TRIAL rule: it removes no seat. REVIEW THIS ROW.]');}}}
 return {items,marks};}