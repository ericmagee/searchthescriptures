const chain=require('./chain.cjs');const rd=chain.rd;
const sb=rd['Send Back Build'][0].data.main[0];console.log('SBB items',sb.length,Object.keys(sb[0].json));
sb.forEach(x=>{const j=x.json;console.log(j.seat,'items',(j.items||[]).length,Object.keys(j));(j.items||[]).forEach(i=>console.log('  ',JSON.stringify(i).slice(0,260)));});
const sc=rd['Send Back Call openrouter'][0].data.main[0];sc.forEach(x=>{const c=x.json.choices&&x.json.choices[0].message.content;console.log('REPLY',Object.keys(x.json),String(c).slice(0,1500));console.log('=====');});
const rr=JSON.parse(rd['Replay Rows'][0].data.main[0][0].json.body).p_rows;console.log(rr.length,Object.keys(rr[0]));
