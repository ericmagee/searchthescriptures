// pkgERF test (W1, 11-08). With retryOnFail off on the two primary DeepSeek enforcer Call nodes, a failed call reaches Retry Build instead of
// a hidden whole-node re-send. Checks, on saved 33506 inputs with live s53 Retry Build code:
// 1. node-level failure (onError continueRegularOutput emits ONE error item): every call is split and re-sent; every id once; nothing lost.
// 2. one call fails (per-item error, as in 33060): only that call's halves are re-sent.
// 3. no failure: the marker item only (today's path).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s53.json','utf8'));const ns=(W.data||W).nodes||(W.data||W).workflow.nodes;
const code=n=>ns.find(z=>z.name===n).parameters.jsCode;let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const rd=(r,n)=>{const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/'+r+'_'+n.replace(/ /g,'_')+'.json','utf8'));return (Array.isArray(d)?d[0]:d).data.main[0];};
for(const [side,R] of [['Judge','33506'],['Alt Judge','33506'],['Judge','33497']]){
 const B=rd(R,side+' Enforcer Build').map(x=>x.json);const C=rd(R,side+' Enforcer Call deepseek');const RB=code(side+' Enforcer Retry Build');
 const live=B.filter(b=>b&&!b.je_skip&&Array.isArray(b.ids)&&b.body);const allIds=live.flatMap(b=>b.ids.map(x=>x.id)).sort();
 const run=items=>harness(R,{[side+' Enforcer Call deepseek']:items})(RB,side+' Enforcer Call deepseek').map(x=>x.json);
 const r0=run(C);T(r0.length===1&&r0[0].esr_retry===false,R+' '+side+': no failure -> marker only');
 const r1=run([{json:{error:{message:'simulated node-level failure'}}}]);const ids1=r1.flatMap(x=>x.ids||[]).map(x=>x.id).sort();
 const calls1=new Set(r1.map(x=>x.esr_of));
 T(r1.every(x=>x.esr_retry)&&JSON.stringify(ids1)===JSON.stringify(allIds)&&calls1.size===live.length,R+' '+side+': node-level failure -> '+r1.length+' halves for '+calls1.size+' of '+live.length+' calls, '+ids1.length+'/'+allIds.length+' ids, each once');
 const k=Math.min(1,C.length-1);const C2=C.map((x,i)=>i===k?{json:{error:{message:'Response body timed out after 300000ms without data'}}}:x);const r2=run(C2);
 const own=(B[k].ids||[]).map(x=>x.id).sort(),ids2=r2.flatMap(x=>x.ids||[]).map(x=>x.id).sort();
 T(r2.length===2&&r2.every(x=>x.esr_of===k)&&JSON.stringify(ids2)===JSON.stringify(own),R+' '+side+': call '+(k+1)+' fails alone -> its 2 halves only ('+ids2.length+' ids)');}
console.log(out.join('\n'));
// 4. Record after a node-level failure: Retry Call answers each half with its call's original reply (it holds lines for every id of that call);
//    the Record must give every id the same verdict as the no-failure Record.
{const out2=[];const R='33506',side='Judge';const C=rd(R,side+' Enforcer Call deepseek');const RB=code(side+' Enforcer Retry Build'),REC=code(side+' Enforcer Record');
 const err=[{json:{error:{message:'simulated node-level failure'}}}];const halves=harness(R,{[side+' Enforcer Call deepseek']:err})(RB,side+' Enforcer Call deepseek');
 const rc=halves.map(h=>({json:C[h.json.esr_of].json}));
 const v=o=>{const m={};const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(typeof x.id==='string'&&/^[A-Z]\d+\.\d+$/.test(x.id)&&('verdict' in x||'enforcer_verdict' in x))m[x.id]=String(x.verdict||x.enforcer_verdict);for(const y of Object.values(x))w(y);}};w(o);return m;};
 let a,b,e=null;try{a=harness(R)(REC,side+' Enforcer Retry Call deepseek');}catch(x){e='base '+x.message;}
 try{b=harness(R,{[side+' Enforcer Call deepseek']:err,[side+' Enforcer Retry Build']:halves,[side+' Enforcer Retry Needed?']:halves,[side+' Enforcer Retry Call deepseek']:rc})(REC,side+' Enforcer Retry Call deepseek');}catch(x){e=(e||'')+' patched '+x.message;}
 if(e){T(false,'Record replay threw: '+e.slice(0,200));}else{const st=x=>JSON.stringify(x,(k,v)=>(k==='at'||k==='esr'||k==='created_at')?undefined:v);
  const ja=a[0].json,jb=b[0].json;const dk=Object.keys(ja).filter(k=>st(ja[k])!==st(jb[k]));const n=(ja.enf428_rows||[]).length;
  const vd=r=>(r||[]).map(x=>st(Object.fromEntries(Object.entries(x).filter(([k])=>!/^(call|esr|at|prompt_sent|full_reply)$/.test(k))))).sort().join('\n');out.push('   row keys: '+Object.keys((ja.enf428_rows||[])[0]||{}).join(','));out.push('   tally equal: '+(st(ja.enf428.tally)===st(jb.enf428.tally))+'; calls '+ja.enf428.calls+' -> '+jb.enf428.calls);
  T(n>0&&vd(ja.enf428_rows)===vd(jb.enf428_rows),R+' Record: '+n+' enf428 rows, verdicts after node-level failure + half re-send equal the no-failure Record; top-level fields that differ: '+(dk.join(', ')||'none'));
  if(dk.length){const k=dk[0];const x=st(ja[k]),y=st(jb[k]);let i=0;while(i<x.length&&x[i]===y[i])i++;out.push('   first difference in '+k+': base ...'+x.slice(Math.max(0,i-120),i+120)+'\n   patched ...'+y.slice(Math.max(0,i-120),i+120));}}
 out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.slice(-3).join('\n'));fs.writeFileSync('pkgERF/test_ERF.txt',out.join('\n')+'\n');}
