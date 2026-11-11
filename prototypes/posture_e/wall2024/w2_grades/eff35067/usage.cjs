// W2: usage of the calls in W3 items 1-2 on 35067, and response_format on every terra/luna/sol request body
const {items,bodies}=require('./prefix.cjs');
const u=n=>items(n).filter(j=>j&&j.usage).map(j=>({n,model:j.model,p:j.usage.prompt_tokens,r:(j.usage.prompt_tokens_details||{}).cached_tokens||0,w:(j.usage.prompt_tokens_details||{}).cache_write_tokens||0}));
const G=(label,ns)=>{const a=ns.flatMap(u);const s=k=>a.reduce((x,y)=>x+y[k],0);console.log(label,'calls',a.length,'prompt',s('p'),'cache read',s('r'),'cache write',s('w'),'read %',(100*s('r')/s('p')).toFixed(1));a.forEach(x=>console.log('   ',x.n,x.model,x.p,x.r,x.w));};
G('ITEM 1 panel cure',['Panel Cure Call 1 openrouter','Panel Cure Call 2 openrouter','Panel Cure Call 3 openrouter']);
G('ITEM 2 single judge',['Synthesis Call openrouter','Verdict Call openrouter','Cure Call openrouter','Diagnostic Call openrouter']);
G('panel judges',['Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter']);
G('send back',['Send Back Call openrouter']);G('gate',['Gate Call openrouter']);
const rf=b=>b&&b.response_format?b.response_format.type+':'+((b.response_format.json_schema||{}).name||''):'none';
console.log('response_format: Panel Judges Prep',bodies['Panel Judges Prep'].map(rf).join(','),'| Send Back Build',bodies['Send Back Build'].map(rf).join(','),'| Gate Build',bodies['Gate Build'].map(rf).join(','),
 '| Panel Cure Build 1-3',[1,2,3].map(k=>rf(items('Panel Cure Build '+k)[0].cure.body)).join(','),'| Cure Build',rf(items('Cure Build')[0].cure.body),'| Verdict',rf(items('Build Independent Verdict')[0].verdictBody),'| Synthesis',rf(items('Build Synthesis')[0].requestBody),'| Diagnostic',rf(items('Build Diagnostic Prompt')[0].requestBody));
const gb=bodies['Gate Build'][0],sb=bodies['Send Back Build'].find(b=>b.model===gb.model);const ss=JSON.stringify(sb.messages),gs=JSON.stringify(gb.messages);let i=0;while(ss[i]===gs[i])i++;console.log('Gate body extends the chatgpt Send Back body exactly:',i===ss.length-1||gs.startsWith(ss.slice(0,-1)),'(common',i,'of',ss.length,')');
