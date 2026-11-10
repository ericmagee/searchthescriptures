// W2 check of W3's Wall 4237 finding: KEYSTONE line with a leading bullet under pkgKSR+pkgECB rev 2b.
const fs=require('fs');const chain=require('./w2_chain.cjs');
const S110='/mnt/project-files/wall2024/fetchback_live_s110.json',ALL='pkgKSR/parent_s110_ALL.json';
const KS=r=>{const t=String(r.verdict_raw||'').replace(/\\n/g,'\n');const m=[...t.matchAll(/(?:^|\n|")\s*(?:[•\-]\s*)?KEYSTONE: D6 -- (STANDS|BROKEN)/g)].map(x=>x[1]);return m[0]||'-';};
const R=rs=>rs.flatMap(x=>x.body?JSON.parse(x.body).p_rows:[x.payload||x]);
(async()=>{for(const b of ['• ','- ']){const mut=rd=>{const s=JSON.stringify(rd);const n=s.split('\\nKEYSTONE: D6 -- STANDS').length-1;console.log('   bullet',JSON.stringify(b),'lines planted',n);return JSON.parse(s.split('\\nKEYSTONE: D6 -- STANDS').join('\\n'+b+'KEYSTONE: D6 -- STANDS'));};
 const c=await chain(ALL,mut);if(c.err){console.log('ERR',c.err);continue;}console.log('   ALL',JSON.stringify(R(c.rows).map(r=>(r.judge_seat||r.seat)+':'+KS(r))));}})();
