function __use328(raw,a){/* pkgUSE (ASK 328): one fixed-form line for a failed alternate call, read only from the reply and the request body built for that call; it changes no request field. A value the provider does not give reads "not reported". */
 const nr='not reported',N=v=>(typeof v==='number'&&isFinite(v))?String(v):nr;
 try{const R=(raw&&typeof raw==='object')?((raw.usage||raw.usageMetadata||raw.choices||raw.candidates)?raw:((raw.reply&&typeof raw.reply==='object')?raw.reply:raw)):{};
  const u=(R.usage&&typeof R.usage==='object')?R.usage:null,m=(R.usageMetadata&&typeof R.usageMetadata==='object')?R.usageMetadata:null;
  const pt=u?u.prompt_tokens:(m?m.promptTokenCount:null),ct=u?u.completion_tokens:(m?m.candidatesTokenCount:null),rt=u?((u.completion_tokens_details||{}).reasoning_tokens):(m?m.thoughtsTokenCount:null);
  const c0=Array.isArray(R.choices)&&R.choices[0],g0=Array.isArray(R.candidates)&&R.candidates[0];const fr=(c0&&c0.finish_reason)||(g0&&g0.finishReason)||null;
  const mt=a&&a.body&&typeof a.body==='object'?a.body.max_tokens:null;
  return 'USAGE: prompt='+N(pt)+' completion='+N(ct)+' reasoning='+N(rt)+' finish='+(fr?String(fr).replace(/\s+/g,'_'):nr)+' max_tokens='+N(mt);
 }catch(e){return 'USAGE: prompt='+nr+' completion='+nr+' reasoning='+nr+' finish='+nr+' max_tokens='+nr;}}
