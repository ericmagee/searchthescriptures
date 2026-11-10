// W2: every KEYSTONE line form live readers accept, planted on all three judges' "KEYSTONE: D6 -- STANDS" lines in 34626 (every copy),
// whole chain to Replay Rows. Usage: node w2_ks_forms.cjs <write file> [more write files]. Reports the final KEYSTONE D6 grade per seat.
const chain=require('./w2_chain.cjs');
const F={ /* name: replacement for the text "KEYSTONE: D6 -- STANDS" at the start of a line */
 base:'KEYSTONE: D6 -- STANDS',
 bullet_dot:'• KEYSTONE: D6 -- STANDS', bullet_dash:'- KEYSTONE: D6 -- STANDS', bullet_star:'* KEYSTONE: D6 -- STANDS', quote_gt:'> KEYSTONE: D6 -- STANDS',
 num_dot:'1. KEYSTONE: D6 -- STANDS', num_paren:'7) KEYSTONE: D6 -- STANDS', indent:'   KEYSTONE: D6 -- STANDS',
 bold_label:'**KEYSTONE:** D6 -- STANDS', bold_whole:'**KEYSTONE: D6 -- STANDS**', bold_value:'KEYSTONE: **D6 -- STANDS**', italic_us:'_KEYSTONE_: D6 -- STANDS', code_tick:'`KEYSTONE: D6 -- STANDS`',
 bullet_bold:'- **KEYSTONE:** D6 -- STANDS', num_bold:'2. **KEYSTONE**: D6 -- STANDS',
 space_colon:'KEYSTONE : D6 -- STANDS', wide_space:'KEYSTONE:   D6   --   STANDS', no_space:'KEYSTONE:D6--STANDS',
 sep_em:'KEYSTONE: D6 — STANDS', sep_en:'KEYSTONE: D6 – STANDS', sep_hyphen:'KEYSTONE: D6 - STANDS', sep_colon:'KEYSTONE: D6: STANDS', sep_none:'KEYSTONE: D6 STANDS',
 title_case:'Keystone: D6 -- Stands', lower_case:'keystone: d6 -- stands', lower_label:'keystone: D6 -- STANDS',
 restated:'RESTATED: KEYSTONE: D6 -- STANDS',
};
const nrm=l=>l.replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-•>*]|\d+[.)])\s*/,'').replace(/^RESTATED\s*:\s*/i,'').trim();
const KS=r=>{const t=String(r.verdict_raw||'').replace(/\\+n/g,'\n');for(const l of t.split('\n')){const m=nrm(l).match(/^KEYSTONE\s*:\s*D6\s*(?:--|—|–|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/i);if(m)return m[1].toUpperCase();}return '-';};
const R=rs=>rs.flatMap(x=>x.body?JSON.parse(x.body).p_rows:[x.payload||x]);
const only=process.env.FORMS?process.env.FORMS.split(','):Object.keys(F);
const fields=rows=>JSON.stringify(rows.map(r=>{const o={...r};delete o.verdict_raw;delete o.created_at;return o;}));const gate=c=>JSON.stringify(((c.over['Gate Record']||[[]])[0]||[]).map(x=>(x.json.gate_rows||[]).map(r=>r.seat+' '+r.item+':'+r.cure_status)));
(async()=>{for(const PF of process.argv.slice(2)){console.log('## '+PF.split('/').pop());let B=null;
 for(const k of only){const to=F[k];let n=0;const mut=rd=>{const s=JSON.stringify(rd);const parts=s.split(/(\\+n)KEYSTONE: D6 -- STANDS/);n=(parts.length-1)/2;let o=parts[0];for(let i=1;i<parts.length;i+=2)o+=parts[i]+to+parts[i+1];return JSON.parse(o);};
  const c=await chain(PF,mut);if(c.err){console.log(k+' ERR '+c.err);continue;}const rr=R(c.rows);if(!B)B={f:fields(rr),g:gate(c)};const allB=rr.every(r=>KS(r)==='BROKEN');console.log((allB?'OK   ':'FAIL ')+(k.padEnd(12))+' planted '+String(n).padStart(3)+'  '+rr.map(r=>(r.judge_seat||r.seat)+':'+KS(r)+'/drv'+r.drv_uncured).join(' ')+'  fields '+(fields(rr)===B.f?'=':'DIFF')+'  gate '+(gate(c)===B.g?'=':'DIFF '+gate(c).slice(0,300)));}}})();
