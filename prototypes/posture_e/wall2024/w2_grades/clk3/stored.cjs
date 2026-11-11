const {LIVE,CAND,load,rec}=require('./h.cjs');const fs=require('fs');
(async()=>{for(const f of ['ex34299_full.json','ex34626_full.json','ex34703_full.json','ex34726_full.json','ex34780_full.json','ex34852_full.json']){const RD=load(f);if(!RD['Close Enforcer Record']){console.log(f,'no node');continue;}
 const st=RD['Close Enforcer Record'][0].data.main[0][0].json;const sc=st.cec||st;
 const a=await rec(LIVE,JSON.parse(JSON.stringify(RD))),b=await rec(CAND,JSON.parse(JSON.stringify(RD)));
 const stored={rows:(sc.rows||[]).map(r=>[r.id,r.side,r.link,r.status,r.link_named||'',(r.note||'').slice(0,90)].join('|')),confirmed:(sc.confirmed||[]).map(x=>x.side+' '+x.link)};
 console.log('##',f,'live==stored',JSON.stringify(a)===JSON.stringify(stored),'cand==live',JSON.stringify(a)===JSON.stringify(b));if(JSON.stringify(a)!==JSON.stringify(b))console.log(' live',JSON.stringify(a),'\n cand',JSON.stringify(b));if(a.err||b.err)console.log(a.err,b.err);}})();
