// Evaluates the body branches of the debater builders (bodyFor) and of Panel/Reserve Build, base vs patched, per model.
const fs=require('fs');
const grab=(src,start,end)=>{const i=src.indexOf(start);if(i<0)throw new Error('no '+start);const j=src.indexOf(end,i);return src.slice(i,j+end.length);};
const cases=[['openrouter','anthropic/claude-sonnet-5.5'],['anthropic','claude-sonnet-5-5'],['openrouter','deepseek/deepseek-v4.1-flash'],['openrouter','x-ai/grok-4.7'],['openrouter','xiaomi/mimo-v2.6-pro'],['grok','grok-4.7'],['mimo','mimo-v2.6-pro'],['openrouter','z-ai/glm-5.3'],['openrouter','google/gemini-3.8-flash'],['deepseek','deepseek-flash']];
for(const nm of ['D1 Build','C1 Build','D2 Build','C2 Build','D3 Build','C3 Build']){
 for(const ver of ['base','new']){const src=fs.readFileSync(`${ver}/${nm}.js`,'utf8');
  const f=eval('('+grab(src,'const bodyFor=','return {model,max_tokens:tok,messages:m};};').replace('const bodyFor=','').replace(/;$/,'')+')');
  const res=cases.map(([fam,m])=>fam+':'+m+'='+JSON.stringify(Object.fromEntries(Object.entries(f(fam,m,32000,'S',[{role:'user',content:'u'}])).filter(([k])=>!['model','contents','systemInstruction'].includes(k)))));
  console.log(nm.padEnd(9),ver,res.join(' | '));}}
