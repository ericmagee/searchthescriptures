// pkgMER (W2, 11-08; W3 grade_33705): the main K-W enforcer call (Enforcer Call deepseek) is split and resent once when it failed:
// no reply, an error, empty content, finish_reason "length", or 2 or more of its answer ids not covered by an ENFORCER line (a G<k> or bare <k> line covers item k).
// 33705: one call, finish_reason "length", 0 characters of content after 64,000 reasoning tokens; all 61 checks went NO VERDICT and nothing retried.
// The call is cut into parts of whole ITEMs (at most 7 items per part, at least 2 parts), balanced by text length; each part keeps the system message and the
// rules head unchanged. Emits one marker item ({esr_retry:false}) when the call did not fail.
const B=$('Enforcer Build').first().json;const r=($input.all()[0]||{}).json||null;
const cov=(txt,ids)=>{const got=new Set();for(const l of String(txt).split('\n')){const u=l.replace(/[*_`]+/g,'').trim();if(!/^ENFORCER\s*:/i.test(u))continue;
  const a=u.match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?(?:(?:G|ITEM\s*)?\d+\s*[\/:,]\s*)?(A\d+\.\d+)\s*(?:--|—|–|-)/i);if(a){got.add(a[1].toUpperCase());continue;}
  const g=u.match(/^ENFORCER\s*:\s*(?:(?:ITEM\s+)?G(\d+)|(\d+))\s*(?:--|—|–|-)/i);if(g){const k=g[1]||g[2];for(const x of ids)if(new RegExp('^A'+k+'\\.\\d+$','i').test(x.id))got.add(x.id.toUpperCase());}}
 return ids.filter(x=>got.has(String(x.id).toUpperCase())).length;};
const why=()=>{if(!r)return 'no reply';if(r.error)return 'error: '+String(r.error.message||JSON.stringify(r.error)).slice(0,160);const c=r.choices&&r.choices[0];
 if(!c)return 'no choices ('+String(r.message||Object.keys(r).slice(0,6).join(',')).slice(0,120)+')';const txt=String((c.message&&c.message.content)||'');
 if(c.finish_reason==='length')return 'finish_reason length ('+((r.usage&&r.usage.completion_tokens)||'?')+' completion tokens, '+txt.length+' characters of content)';
 if(!txt.trim())return 'empty content';const want=(B.ids||[]).length,n=cov(txt,B.ids||[]);if(want>=2&&want-n>=2)return 'short reply: '+n+' of '+want+' answer ids have an ENFORCER line (finish_reason '+(c.finish_reason||'none')+')';return null;};
const out=[];
if(!B.enf_skip&&Array.isArray(B.ids)&&B.body&&Array.isArray(B.body.messages)){const w=why();
 if(w){const msg=String(B.body.messages[1]&&B.body.messages[1].content||'');const parts=msg.split(/\n\n(?=ITEM G?\d+(?: OF \d+)? \()/);const head=parts[0];
  const its=parts.slice(1).map(t=>({t,k:(t.match(/^ITEM G?(\d+)(?: OF \d+)? \(/)||[])[1]}));const own=k=>B.ids.filter(x=>String(x.id).split('.')[0].toUpperCase()==='A'+k);
  const whole=its.length>=2&&its.every(x=>x.k&&own(x.k).length)&&its.reduce((a,x)=>a+own(x.k).length,0)===B.ids.length; /* every id belongs to exactly one item text */
  if(whole){const P=Math.max(2,Math.ceil(its.length/7));const tot=its.reduce((a,x)=>a+x.t.length,0);const G=[[]];let acc=0;
   its.forEach((x,i)=>{const g=G[G.length-1];if(g.length&&(g.length>=7||(G.length<P&&acc>=tot*G.length/P)))G.push([]);G[G.length-1].push(x);acc+=x.t.length;});
   G.forEach((g,h)=>out.push({json:{esr_retry:true,esr_part:h+1,esr_parts:G.length,esr_why:w,ids:g.flatMap(x=>own(x.k)),
    body:{...B.body,messages:[B.body.messages[0],{...B.body.messages[1],content:head+'\n\n'+g.map(x=>x.t).join('\n\n')}]},model:B.model,run_token:B.run_token}}));}}}
return out.length?out:[{json:{esr_retry:false}}];
