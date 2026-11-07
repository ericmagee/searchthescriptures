// pkgESR (rulings item 9): each enforcer call that came back with no reply, an empty reply, an error or finish_reason "length" is split into two
// halves of whole items and sent once more. Emits one marker item ({esr_retry:false}) when no call failed.
const B=$('Alt Judge Enforcer Build').all().map(x=>x.json);const R=$input.all().map(x=>x.json);
const why=r=>{if(!r)return 'no reply';if(r.error)return 'error: '+String(r.error.message||JSON.stringify(r.error)).slice(0,160);const c=r.choices&&r.choices[0];if(!c)return 'no choices ('+String(r.message||Object.keys(r).slice(0,6).join(',')).slice(0,120)+')';
 if(c.finish_reason==='length')return 'finish_reason length (the reply was cut at the token cap)';if(!String((c.message&&c.message.content)||'').trim())return 'empty content';return null;};
const out=[];
/* pkgESK (W4 33430): a reply that answers fewer items than were sent is retried for the unanswered items only */
const __essAns=(b,r)=>{const c=r&&r.choices&&r.choices[0];const txt=String(c&&c.message&&c.message.content||'');const L=txt.split('\n').map(l=>l.replace(/[*_`]+/g,'').trim()).filter(l=>/^ENFORCER\s*:/i.test(l)).map(l=>l.replace(/^ENFORCER\s*:\s*/i,'').split(/\s+(?:--|—|–)\s+|\s+-\s+/)[0].toUpperCase());
 const toks=new Set(L.flatMap(l=>l.match(/[A-Z]\d+(?:\.\d+)?/g)||[]));const hit=new Set(b.ids.filter(x=>{const id=String(x.id).toUpperCase();return toks.has(id)||toks.has(id.split('.')[0]);}).map(x=>x.id));
 if(!toks.size&&L.length>=b.ids.length)return new Set(b.ids.map(x=>x.id));return hit;};
B.forEach((b,i)=>{if(!b||b.je_skip||!Array.isArray(b.ids)||!b.body||!Array.isArray(b.body.messages))return;let w=why(R[i]);let __keep=null;
 if(!w){const a=__essAns(b,R[i]);if(a.size>=b.ids.length)return;__keep=[...a];w='short reply: '+a.size+' of '+b.ids.length+' ids answered (finish_reason '+String(((R[i].choices||[])[0]||{}).finish_reason)+')';}
 const msg=String(b.body.messages[1]&&b.body.messages[1].content||'');const parts=msg.split(/\n\n(?=ITEM [A-Z]\d+ \()/);const head=parts[0];const its=parts.slice(1).map(t=>({t,p:(t.match(/^ITEM ([A-Z]\d+) \(/)||[])[1]}));
 const __all=its.slice();if(__keep){const ks=new Set(__keep);its.splice(0,its.length,...its.filter(x=>b.ids.filter(y=>String(y.id).split('.')[0]===x.p).some(y=>!ks.has(y.id))));} /* pkgESK: only unanswered items */
 if(!__keep&&its.length<2)return; /* one item cannot be split; it stays NO VERDICT */
 if(!its.length)return;
 const own=p=>b.ids.filter(x=>String(x.id).split('.')[0]===p);if(__all.some(x=>!x.p||!own(x.p).length)||__all.reduce((a,x)=>a+own(x.p).length,0)!==b.ids.length)return; /* every id must belong to exactly one item text */
 const tot=its.reduce((a,x)=>a+x.t.length,0);let acc=0,cut=1;for(let k=0;k<its.length-1;k++){acc+=its[k].t.length;if(acc>=tot/2){cut=k+1;break;}cut=k+1;}
 [its.slice(0,cut),its.slice(cut)].forEach((g,h)=>{if(!g.length)return;const body={...b.body,messages:[b.body.messages[0],{...b.body.messages[1],content:head+'\n\n'+g.map(x=>x.t).join('\n\n')}]};
  out.push({json:{esr_retry:true,esr_of:i,esr_half:h+1,esr_why:w,ids:g.flatMap(x=>own(x.p)),body,model:b.model,run_token:b.run_token,...(__keep?{esr_short:true,esr_keep:__keep}:{})}});});});
return out.length?out:[{json:{esr_retry:false}}];