// W1 grade of pkgCCM, labels in labels_CCM_w1.md (commit 427c81b5). Own harness; stored inputs /mnt/project-files/wall2024/inputs/.
const fs=require('fs');const J=f=>JSON.parse(fs.readFileSync(f));const L=J('/mnt/project-files/wall2024/fetchback_live_s115.json'),C=J('/mnt/project-files/wall2024/parent_s115_CCM.json');const S=JSON.stringify;
// K1
const by={};L.nodes.forEach(n=>by[n.name]=n);let names=[],tot=0,other=0;C.nodes.forEach(n=>{const a=by[n.name];if(!a){other++;return;}if(S(a)!==S(n)){names.push(n.name);tot+=(n.parameters.jsCode||'').length-(a.parameters.jsCode||'').length;if(S({...n,parameters:{...n.parameters,jsCode:0}})!==S({...a,parameters:{...a.parameters,jsCode:0}}))other++;}});
console.log('K1',L.nodes.length,C.nodes.length,'| differ',names.join(', '),'| code',tot,'| non-code diffs',other,'| connections equal',S(L.connections)===S(C.connections));
const mk=(w,n)=>{const s=w.nodes.find(x=>x.name===n).parameters.jsCode;const a=s.indexOf("const __RND=");const b=s.indexOf('const bodyFor=');const e=s.indexOf('messages:m};};',b)+14;return new Function('__L','$',s.slice(a,e)+'\nreturn bodyFor;')({},()=>{});};
const d='/mnt/project-files/wall2024/inputs/';const body=f=>{try{const j=J(d+f);const x=Array.isArray(j)?j[0]:j;return ((x.data||x).main[0][0].json).call.body;}catch(e){return null;}};
const txt=c=>Array.isArray(c)?c.map(z=>z.text).join(''):c;const cc=m=>m.map((x,i)=>Array.isArray(x.content)&&x.content.some(z=>z.cache_control)?i:-1).filter(i=>i>=0);
const nbp=b=>(S(b).match(/cache_control/g)||[]).length;
const R={K2:[0,0],K3:[0,0],K4:[0,0],K5:[0,0]};const ok=(k,c,why)=>{R[k][c?0:1]++;if(!c)console.log('FAIL',k,why);};let k7=[0,0];
for(const n of ['C2','C3','C4']){const fL=mk(L,n+' Build'),fC=mk(C,n+' Build');
 for(const f of fs.readdirSync(d).filter(f=>f.endsWith('_'+n+'_Build.json'))){const r=f.split('_')[0];const B=body(f);if(!B||!B.messages)continue;
  const sys=B.system.map(x=>x.text).join('');const msgs=B.messages.map(m=>({role:m.role,content:txt(m.content)}));
  const lb=fL('anthropic',B.model,B.max_tokens,sys,msgs),cb=fC('anthropic',B.model,B.max_tokens,sys,msgs);
  const want=n==='C2'?S([0]):S([]);ok('K2',S(cc(cb.messages))===want&&S(cb.system)===S(lb.system)&&nbp(cb)<=4,r+' '+n+' markers '+S(cc(cb.messages)));
  ok('K5',S(cb.system.map(x=>x.text))===S(lb.system.map(x=>x.text))&&S(cb.messages.map(m=>[m.role,txt(m.content)]))===S(lb.messages.map(m=>[m.role,txt(m.content)])),r+' '+n);
  const c1=body(r+'_C1_Build.json');
  if(n==='C2'&&c1){ok('K3',cb.model===c1.model&&S(cb.system)===S(c1.system)&&S(cb.messages[0])===S(c1.messages[0])&&S(Object.keys(c1).filter(k=>!['max_tokens','diagnostics','messages'].includes(k)))===S(['model','system']),r);}
  if(n!=='C2'&&c1){k7[S(txt(B.messages[0].content))===S(txt(c1.messages[0].content))?0:1]++;}
  for(const [fam,mod] of [['gemini','g'],['openai','gpt-x'],['openrouter','x-ai/grok-4.7'],['openrouter','google/gemini'],['openrouter','openai/gpt-6.1-terra'],['openrouter','xiaomi/m'],['openrouter','other/x'],['other','m']])ok('K4',S(fL(fam,mod,B.max_tokens,sys,msgs))===S(fC(fam,mod,B.max_tokens,sys,msgs)),r+' '+fam+' '+mod);
  // openrouter anthropic branch: same marker rule as direct
  const ob=fC('openrouter','anthropic/claude-opus-5.5',B.max_tokens,sys,msgs);ok('K2',S(cc(ob.messages.slice(1)))===want,r+' '+n+' openrouter-anthropic markers');
 }}
for(const k in R)console.log(k,'pass',R[k][0],'fail',R[k][1]);console.log('K7 (record) C3/C4 message 0 equal to C1 message 0:',k7[0],'of',k7[0]+k7[1]);
