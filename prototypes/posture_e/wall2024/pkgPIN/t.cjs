// ASK 298 test: the whole C2B Build node (s206 and built) run on the 62 stored debates with a stubbed $ (C2 Extract = DR2, D1 Extract = CR1, C1B Extract = DR1, D2B Extract = CR2).
const fs=require('fs'),zlib=require('zlib');const AF=Object.getPrototypeOf(async function(){}).constructor;
const code=f=>JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name==='C2B Build').parameters.jsCode;
const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));let rows=Object.values(R).map(x=>x.r).concat(JSON.parse(zlib.gunzipSync(fs.readFileSync(__dirname+'/../a293/data/rounds8.json.gz'))));
(async()=>{const fo=new AF('$','$input',code(__dirname+'/../w293/fresh_s206.json')),fn=new AF('$','$input',code(__dirname+'/target.json'));const seen=new Set();const st={old:0,nw:0,both:0,pinOnly:0,barOnly:0,n:0,same:0};
for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);st.n++;const J={'C2 Extract':{raw:r.engine_r2,run_token:'t',msg_id:null},'C2 Build':{call:{fam:'openrouter',fam_idx:1,body:{messages:[{role:'user',content:'x'}]}}},'D1 Extract':{raw:r.claude_r1},'C1B Extract':{raw:r.engine_r1},'D2B Extract':{raw:r.claude_r2}};
 const $=nm=>({isExecuted:nm in J,first:()=>({json:J[nm]})});const a=(await fo($))[0].json,b=(await fn($))[0].json;if(a.resend)st.old++;if(b.resend)st.nw++;const bar=b.bar_check&&b.bar_check.hits&&b.bar_check.hits.length,pin=(b.pin_check||[]).length;
 if(bar&&pin)st.both++;else if(pin)st.pinOnly++;else if(bar)st.barOnly++;if(a.resend&&b.resend&&b.note.startsWith(a.note))st.same++;
 if(String(r.id).startsWith('eaef1fa9'))console.log('37113: old resend',a.resend,'| new resend',b.resend,'|',b.why,'\n',b.note.slice(-500));}
console.log(JSON.stringify(st),'(same = old note kept as the start of the new note)');})();
