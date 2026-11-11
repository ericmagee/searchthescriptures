// W2 second reading of ASK 74: does W4's replay request equal what s136 sends for the single judge's Verdict on 35067?
const fs=require('fs');const W='/mnt/project-files/';const {run}=require('./replay.cjs');
const X=JSON.parse(fs.readFileSync(W+'wall2024/ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const R=JSON.parse(fs.readFileSync(W+'w4/ask74/request_body.json','utf8'));const sent=R.body||R;
(async()=>{const b=(await run('Build Independent Verdict',rd,null,null))[0].json;const vb=b.verdictBody;
 const st=rd['Build Independent Verdict'].slice(-1)[0].data.main[0][0].json.verdictBody;
 console.log('W4 keys',Object.keys(sent).join(','),'| BIV keys',Object.keys(vb).join(','));
 for(const k of Object.keys(Object.assign({},sent,vb)))if(k!=='messages')console.log('  ',k,JSON.stringify(sent[k]),JSON.stringify(vb[k]),JSON.stringify(st[k]));
 const T=c=>typeof c==='string'?c:(Array.isArray(c)?c.map(x=>x.text||'').join(''):JSON.stringify(c));
 console.log('messages',sent.messages.length,vb.messages.length);sent.messages.forEach((m,i)=>{const a=T(m.content),e=T(vb.messages[i].content),s=T(st.messages[i].content);console.log('  ',i,m.role,vb.messages[i].role,'| W4',a.length,'s136',e.length,'stored',s.length,'| W4==s136',a===e,'| cc',JSON.stringify(m.content).includes('cache_control'),Array.isArray(m.content)?'array':'string');});
 // the Verdict call node's own body expression
 let D=JSON.parse(fs.readFileSync(W+'wall2024/fetchback_live_s136.json','utf8'));D=D.data||D;D=D.workflow||D;const vc=D.nodes.find(n=>n.name==='Independent Verdict Call openrouter'||n.name==='Independent Verdict Call');console.log('Verdict call node',vc&&vc.name,vc&&JSON.stringify(vc.parameters).slice(0,900));
 const rep=JSON.parse(fs.readFileSync(W+'w4/ask74/reply.json','utf8'));const r=rep.body||rep;console.log('reply keys',Object.keys(r).join(','),'| model',r.model,'provider',r.provider,'| usage',JSON.stringify(r.usage&&{p:r.usage.prompt_tokens,c:r.usage.completion_tokens,cached:r.usage.prompt_tokens_details,reason:r.usage.completion_tokens_details}));
 const txt=r.choices?r.choices[0].message.content:'';console.log('finish',r.choices&&r.choices[0].finish_reason,'| reply:',JSON.stringify(txt));
 const sv=rd['Independent Verdict Call openrouter']||rd['Verdict Call openrouter'];if(sv){const j=sv.slice(-1)[0].data.main[0][0].json;console.log('stored verdict call usage',JSON.stringify(j.usage&&j.usage.completion_tokens_details),'| stored reply starts',JSON.stringify(String(j.choices[0].message.content).slice(0,300)));}
})();
