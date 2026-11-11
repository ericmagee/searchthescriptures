const fs=require('fs');
const L=fs.readFileSync('cer_code.js','utf8').split('\n');
const pre=L.slice(1,8).join('\n');
const row=JSON.parse(fs.readFileSync('row_clean.json'));
const rd=JSON.parse(fs.readFileSync('nodes/Close_Enforcer_Record.json'))[0].data.main[0][0].json.cec;
const jr=JSON.parse(fs.readFileSync('nodes/Judge_Contradiction_Record.json'))[0].data.main[0][0].json.jcc;
const f=new Function('F','rows',pre+`
const res=[];for(const r of rows){const b=cecBlk(r.side,r.closing_q,F[CEC_RK[r.closing_round]]);const skipNamed=(r.side==='DEFENDER'?/\\b(?:D|LINK\\s+)\\d+\\b/i:/\\b(?:C|LINK\\s+)\\d+\\b/i).test(r.closing_q||'');res.push({id:r.id,link:r.link,answer:r.answer,blk:b,closing_names_link:skipNamed,norm_closing:cecN(r.closing_q),norm_earlier:cecN(r.earlier_q)});}
const G={};rows.forEach(x=>{if(x.side==null)return;const a=cecN(x.earlier_q),b=cecN(x.closing_q);[/^NEW/.test(x.id)?'':'I|'+x.id,a&&b?'P|'+x.side+'|'+a+'|'+b:''].forEach(k=>{if(k)(G[k]=G[k]||[]).push(x.id+':'+x.answer);});});
return {res,G};`);
const F={cr1:row.claude_r1,cr2:row.claude_r2,cr3:row.engine_r3,cr4:row.defender_r4,gr1:row.engine_r1,gr2:row.engine_r2,dr3:row.challenger_r3,dr4:row.challenger_r4};
const a=f(F,rd.rows),b=f(F,jr.rows);
fs.writeFileSync('clk_out.json',JSON.stringify({cec:a,jcc:b},null,1));
console.log(JSON.stringify(a.res.map(x=>[x.id,x.link,x.blk,x.closing_names_link])),Object.keys(a.G).map(k=>k.slice(0,20)+'..'+JSON.stringify(a.G[k])));
console.log(JSON.stringify(b.res.map(x=>[x.id,x.link,x.blk,x.closing_names_link])));
