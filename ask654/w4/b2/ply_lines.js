const PLY=(()=>{ /* ASK 654: a pressed verse answered at the verse, in the FORM the Oracle is told: on its ANSWER block, [L1] the verse and a verse of its chapter, [L2] a Strong's number, [L3] a verse of another chapter, [L4] the opponent's words from its round. Oracle seat only; used by D3B Build and D4B Build; a send-back, never a strike */
 const RF='((?:[1-3] )?[A-Z][a-z]+(?: (?:of )?[A-Z][a-z]+)* \\d+:\\d+)';
 const HEAD=new RegExp('^[\\s>*_#-]*(?:ANSWER\\s*:\\s*|Answer\\s+to\\s+)'+RF,'i');
 const W=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 const RQ=new RegExp(RF+'[\\s:*_,]*["“`][^"”`\\n]{6,}','g'),QR=new RegExp('["“`][^"”`\\n]{6,}["”`][\\s*_]*\\(\\s*'+RF+'\\s*\\)','g'); /* the reference before the quotation, or in brackets directly after it (W1 N3) */
 const refs=l=>[...l.matchAll(RQ)].map(m=>m[1]).concat([...l.matchAll(QR)].map(m=>m[1]));
 const tagged=(lines,k)=>lines.filter(l=>new RegExp('^[\\s>*_-]*\\[L'+k+'\\]').test(l));
 const chap=r=>{const m=String(r).match(/^(.*) (\d+):(\d+)$/);return m?{b:m[1],c:+m[2]}:null;};
 const same=(a,b)=>{const x=chap(a),y=chap(b);return !!(x&&y&&x.b===y.b&&x.c===y.c);};
 function blocks(t){const out=[];let cur=null;for(const l of String(t||'').split('\n')){const m=l.match(HEAD);if(m||/^\s*(?:#{1,6}\s|-{3,}\s*$)/.test(l)){if(cur)out.push(cur);cur=m?{ref:m[1],lines:[l]}:null;continue;}if(cur)cur.lines.push(l);}if(cur)out.push(cur);return out;}
 const LACK={B:'no ANSWER block at the verse',V:'[L1] the verse quoted with its reference',S:'[L1] another verse of its chapter quoted with its reference',G:'[L2] a Strong\'s number',X:'[L3] a verse of another chapter quoted with its reference',O:'[L4] your opponent\'s words from its round, [<round>] "<6 or more, word for word>"'};
 function check(pressedRounds,own,opp){const P=PRESSL.pressed(pressedRounds||[]);const B=blocks(own);const items=[];
  for(const r of P){const bs=B.filter(b=>b.ref===r);if(!bs.length){items.push({ref:r,lacks:['B']});continue;}const lines=bs.flatMap(b=>b.lines);const lacks=[];
   const l1=tagged(lines,1).flatMap(refs);if(!l1.includes(r))lacks.push('V');if(!l1.some(x=>x!==r&&same(x,r)))lacks.push('S');
   if(!tagged(lines,2).some(l=>/\b[GH]\d{1,5}\b/.test(l)))lacks.push('G');
   if(!tagged(lines,3).flatMap(refs).some(x=>chap(x)&&!same(x,r)))lacks.push('X');
   let ok=false;for(const m of tagged(lines,4).join('\n').matchAll(/\[\s*(DR[1-4])\s*\][\s:,]*["“]([^"”\n]+)["”]/gi)){const k=m[1].toUpperCase(),q=W(m[2]);if(q.split(' ').length>=6&&opp&&opp[k]&&W(opp[k]).includes(q)){ok=true;break;}}if(!ok)lacks.push('O');
   if(lacks.length)items.push({ref:r,lacks});}
  return {applies:true,pressed:P.length,items,pass:!items.length};}
 function note(items){const G={};for(const i of items)for(const x of i.lacks)(G[x]=G[x]||[]).push(i.ref);
  return 'PRESSED VERSES SHORT OF THEIR LAYERS -- computed by the system from your round, not by a model ('+items.length+' verse(s)). On the answer to each verse below, add what it lacks:\n'+Object.keys(LACK).filter(k=>G[k]).map(k=>'- '+LACK[k]+': '+G[k].join('; ')).join('\n')+'\nWrite your whole round again, the same case, with each answer in the FORM your instructions give. Return the whole round; this is the only request of its kind.';}
 return {check,note,blocks,LACK};})();
