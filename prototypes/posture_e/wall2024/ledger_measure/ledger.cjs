const fs=require('fs');const L=require('./lib.cjs');const D='/mnt/project-files/wall2024/inputs/';
const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_C3_Extract\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const rd=(R,n)=>{try{return JSON.parse(fs.readFileSync(D+R+'_'+n+'_Extract.json'))[0].data.main[0][0].json;}catch(e){return null;}};
const heads=t=>{const h=[];const re=/^(#{1,4} .*|\*\*LINK.*|\*[A-Z][^*\n]{3,60}:\*|MEANS \[[CD]R\d\][^\n]*|- \*\*Press\b[^\n]*|PRESSED WITH:.*|.*UNSUPPORTED-L4 PREMISES.*)$/gm;let m;while((m=re.exec(t)))h.push({i:m.index,s:m[0]});return h;};
const ctxOf=(t,pos)=>{const H=heads(t).filter(x=>x.i<=pos);const near=H.length?H[H.length-1].s:'';const sec=H.filter(x=>/^#/.test(x.s)).pop();
 const lineStart=t.lastIndexOf('\n',pos)+1;const line=t.slice(lineStart,t.indexOf('\n',pos)<0?t.length:t.indexOf('\n',pos));
 if(/PRESSED WITH|UNSUPPORTED-L4/i.test(near)||/^\s*PRESSED WITH/i.test(line))return 'own-press-row';
 if(/^MEANS \[|^- \*\*Press\b|answer|press/i.test(near)||(sec&&/ANSWER|PRESS/i.test(sec.s)))return 'answer-section';
 return 'elsewhere';};
const out=[];const tally={};const add=k=>tally[k]=(tally[k]||0)+1;
for(const R of runs){const T={};for(const s of ['C1','C2','C3','C4','D1','D2','D3','D4']){const j=rd(R,s);if(j)T[(s[0]==='C'?'CR':'DR')+s[1]]=j.labelled||j.raw;}
 const P=[];const c3=rd(R,'C3');
 if(c3&&Array.isArray(c3.presses)){const pc=c3.press_check||{};for(const p of c3.presses){const st=(pc.unanswered||[]).includes(p.id)?'unanswered':(pc.missing||[]).includes(p.id)?'missing':(pc.conceded||[]).includes(p.id)?'conceded':(pc.ok||[]).includes(p.id)?'ok':'?';
  for(const k of L.cureRefs(p.ref))P.push({side:'CHALLENGER',round:'DR2',ref:k.key,id:p.id,pc:st});}}
 for(const pr of ['CR1','CR2']){const t=T[pr]||'';const seen=new Set();for(const m of t.matchAll(/PRESSED WITH\s*:([^\n]*(?:\n(?!\s*\n)(?!\s*\d+\.\s)[^\n]*)*)/gi)){for(const row of m[1].split('\n')){const head=row.split(/["\u201c]|--/)[0];const k=L.cureRefs(head)[0];if(!k||seen.has(k.key))continue;seen.add(k.key);P.push({side:'DEFENDER',round:pr,ref:k.key,id:'-',pc:'-'});}}}
 for(const p of P){const own=p.side==='DEFENDER'?['DR1','DR2','DR3']:['CR1','CR2','CR3','CR4'];const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  const hits=[];for(const k of later){const t=T[k];if(typeof t!=='string')continue;for(const h of L.cureRefs(t,true))if(h.key===p.ref)hits.push({round:k,pos:h.pos,ctx:ctxOf(t,h.pos),snip:t.slice(Math.max(0,h.pos-160),h.pos+200).replace(/\s+/g,' ')});}
  const named=hits.length>0,inAns=hits.some(h=>h.ctx==='answer-section');
  const cls=!named?'NOT NAMED':inAns?'NAMED in an answer section':'NAMED only outside an answer section';add(p.side+' | '+cls+(p.pc!=='-'?' | press_check '+p.pc:''));
  out.push({run:R,...p,cls,hits});}}
fs.writeFileSync('ledger_out.json',JSON.stringify(out,null,1));
console.log('runs',runs.length,'presses',out.length);Object.entries(tally).sort().forEach(([k,v])=>console.log(v,k));
