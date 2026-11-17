// Panel change rev 4 on s255 (operator 14:47 CST 11-17: "i also need sol 6.2 added to the panel.   keep sol 6.1... bumb haiku."; check call 38433 PASS).
// Panel terra, sol (6.1), sol62 (openai/gpt-6.2-sol); haiku becomes the first alternate.
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]||'../rdf/fetchback_s255.json'));if(w.versionId!=='7a6593c4-8ca8-457e-a122-778518af4cc4')throw new Error('base '+w.versionId);const N={};w.nodes.forEach(n=>N[n.name]=n);
const rep=(nm,o,n)=>{const s=N[nm].parameters.jsCode;const c=s.split(o).length-1;if(c!==1)throw new Error(nm+' count '+c+' :: '+o.slice(0,70));N[nm].parameters.jsCode=s.replace(o,()=>n);};
const O3="['chatgpt','sol','haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet','qwen']",O4="['chatgpt','sol','sol62','haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet','qwen']";
rep('Init Seats',"const ORDER0="+O3+";","const ORDER0="+O4+"; /* operator 14:47 CST 11-17: sol 6.2 (seat sol62) on the panel, sol 6.1 kept, haiku bumped to first alternate */");
rep('Init Seats',"const __ALT=['hydrogen','gemini','argon','spark','ernie','ember','sonnet'];","const __ALT=['haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet']; /* operator 14:47 CST 11-17: haiku bumped to first alternate */");
rep('Init Seats',"const FAM_PANEL={chatgpt:'openai',sol:'openai',","const FAM_PANEL={chatgpt:'openai',sol:'openai',sol62:'openai',");
for(const nm of ['Init Seats','Resolve Seats'])rep(nm,"sol:'openrouter',luna:'openrouter',haiku:'openrouter',argon:'openrouter'","sol:'openrouter',sol62:'openrouter',luna:'openrouter',haiku:'openrouter',argon:'openrouter'");
rep('Accept Build',"sol:'sol',luna:'luna',","sol:'sol',sol62:'sol62',luna:'luna',");
rep('Accept Build',"const ORDER="+O3+";","const ORDER="+O4+"; /* operator 14:47 CST 11-17, same list as Init Seats ORDER0 */");
for(const nm of ['Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt'])rep(nm,"sol:'openrouter',luna:'openrouter',haiku:'openrouter'};","sol:'openrouter',sol62:'openrouter',luna:'openrouter',haiku:'openrouter'};");
const u=unpack(w);const L=u.L.slice();const XO='["openai/gpt-6.1-terra","openai/gpt-6.1-sol","openai/gpt-6-luna","anthropic/claude-haiku-5.5"]';const hit=L.map((l,i)=>l.includes(XO)?i:-1).filter(i=>i>=0);if(hit.length!==1)throw new Error('xk');L[hit[0]]=L[hit[0]].replace(XO,'["openai/gpt-6.1-terra","openai/gpt-6.1-sol","openai/gpt-6.2-sol","openai/gpt-6-luna","anthropic/claude-haiku-5.5"]');
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
N['Shared Library'].parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[3]||'tpnl4_on255.json',JSON.stringify(w));console.log('xk line',hit[0],'MAP n updated',fixed.join(', '));
