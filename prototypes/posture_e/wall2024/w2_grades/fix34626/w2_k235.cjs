// W2 M3: a judge's own unmarked DEFENDER LINK BROKEN on D6 (sol only), written in the judge's verdict before Panel Cure Check.
// Usage: node w2_k235.cjs <write file>... ; PL=c5 (one line) or c56 (both of sol's D6 lines)
const chain=require('./w2_chain.cjs');
const L5=['D6 vs C5 (John 3:6; 1 John 5:1; Romans 1:3): UNDERDETERMINED -- ','D6 vs C5 (John 3:6; 1 John 5:1; Romans 1:3): DEFENDER LINK BROKEN -- [CR4] asserts the wording [CR3] dropped; '];
const L6=['D6 vs C6 (Luke 2:4; Numbers 1:18): UNDERDETERMINED -- ','D6 vs C6 (Luke 2:4; Numbers 1:18): DEFENDER LINK BROKEN -- [CR4] asserts the wording [CR3] dropped; '];
const LU=['D6 vs C5 (Romans 1:3): DEFENDER LINK BROKEN -- [L1] Romans 1:3 says','D6 vs C5 (Romans 1:3): DEFENDER LINK BROKEN -- [CR4] asserts the wording [CR3] dropped; [L1] Romans 1:3 says'];
const PL=process.env.PL||'c5';const KS=r=>{const t=String(r.verdict_raw||'').replace(/\\+n/g,'\n');const m=t.match(/(?:^|\n)\s*KEYSTONE\s*:\s*D6\s*(?:--|—|–|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)/);return m?m[1]:'-';};
const R=rs=>rs.flatMap(x=>x.body?JSON.parse(x.body).p_rows:[x.payload||x]);
(async()=>{for(const PF of process.argv.slice(2)){let n=0;const mut=rd=>{const pre=new Set(Object.entries(rd).filter(([k,r])=>r[0].startTime<rd['Panel Cure Check'][0].startTime).map(x=>x[0]));
  for(const k of pre){let s=JSON.stringify(rd[k]);for(const [a,b] of (PL==='luna'?[LU]:PL==='c56'?[L5,L6]:[L5])){const c=s.split(a).length-1;n+=c;s=s.split(a).join(b);}rd[k]=JSON.parse(s);}return rd;};
 const c=await chain(PF,mut);if(c.err){console.log(PF.split('/').pop(),'ERR',c.err);continue;}const rr=R(c.rows);
 const sb=(c.over['Send Back Build']||[[]])[0].flatMap(x=>(x.json.items||[]).filter(i=>/D6 vs C|KEYSTONE/.test(i.line||'')).map(i=>x.json.seat+' '+i.rule+' '+i.item+' :: '+String(i.line).slice(0,70)));
 const gr=((c.over['Gate Record']||[[]])[0]||[]).flatMap(x=>(x.json.gate_rows||[]).map(r=>r.seat+' '+r.item+':'+r.cure_status));
 console.log('## '+PF.split('/').pop()+' PL='+PL+' strings planted '+n+'\n   rows '+rr.map(r=>r.judge_seat+':'+r.verdict_tag+'/KS '+KS(r)+'/drv'+r.drv_uncured+'/'+String(r.result_line||'').slice(0,22)).join(' | ')+'\n   D6/KEYSTONE send-back items: '+sb.length+'\n'+sb.map(x=>'     '+x).join('\n')+'\n   gate rows: '+gr.join(' | '));}})();
