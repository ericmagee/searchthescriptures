// Offline chain replay of execution 34626 from a start node to Replay Rows with a chosen library source set (W1).
// Code nodes run (library nodes from pkgLIB/strip_<SET>/patched, others from the s110 fetch-back); IF nodes pass their input to the branch the stored run took;
// HTTP (model) nodes keep their stored output. Usage: module chain(SET, start) -> {out: map node -> main}
const fs=require('fs');const run=require('./run_node.cjs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
let W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s110.json','utf8'));W=W.data||W;W=W.workflow||W;const BY={};W.nodes.forEach(n=>BY[n.name]=n);
module.exports=async function chain(SET,start,stop,hook){const order=Object.entries(rd).map(([n,r])=>[n,r[0].startTime]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
 const over={};const fb=[];if(hook)hook('__start',over,rd);const lib=n=>{const f='pkgLIB/strip_'+SET+'/patched/'+n.replace(/ /g,'_')+'.js';return fs.existsSync(f)?fs.readFileSync(f,'utf8'):null;};
 const inOf=n=>{const s=(rd[n][rd[n].length-1].source||[])[0];if(!s)return [];const m=over[s.previousNode]||(rd[s.previousNode]?(rd[s.previousNode][rd[s.previousNode].length-1].data||{}).main:null);return m?(m[s.previousNodeOutput||0]||[]):[];};
 for(const n of order.slice(order.indexOf(start))){if(stop&&n===stop)break;const t=BY[n]&&BY[n].type;const st=(rd[n][rd[n].length-1].data||{}).main||[];
  if(/\.code$/.test(t)){const code=lib(n)||BY[n].parameters.jsCode;const r=await run(code,n,rd,over,n==='Alternate Build'?(over['Alternate Needed?']||[])[0]:null);if(r&&r.err){if(lib(n))return {err:n+': '+r.err,over};fb.push(n+' ('+r.err.slice(0,60)+')');over[n]=st;}else over[n]=[r.map(j=>({json:j}))];}
  else if(/\.if$/.test(t)){const inp=inOf(n);over[n]=st.map(o=>o&&o.length?inp:[]);}
  else if(n==='Send Back Call openrouter'){/* replies renumbered to the candidate's items: a withheld item's lines are removed (W2's method, 4224) */
   const key=it=>it.rule+'|'+String(it.item||'').replace(/\bS\d+\b/g,'S#')+'|'+(process.env.KEYNOLINE?String(it.line).slice(0,12):it.line);const B0=(rd['Send Back Build'][0].data.main[0]||[]).map(x=>x.json).filter(j=>!j.sb_skip),B1=(over['Send Back Build'][0]||[]).map(x=>x.json).filter(j=>!j.sb_skip);
   over[n]=[st[0].map((r,i)=>{const b0=B0[i],b1=B1.find(j=>j.seat===(b0&&b0.seat));if(!b0||!b1)return r;const mp={};(b0.items||[]).forEach(it=>{const k=key(it);const t=(b1.items||[]).find(z=>key(z)===k);mp[it.sid]=t?t.sid:null;});
    const r2=JSON.parse(JSON.stringify(r));const c=r2.json.choices[0].message;/* the reply may be JSON with SENDBACK lines inside a string (escaped \\n): split on both real and escaped line breaks, keep separators */
    const parts=String(c.content).split(/(\n|\\n)/);const out=[];let keep=true;for(let q=0;q<parts.length;q+=2){const l=parts[q],sep=q+1<parts.length?parts[q+1]:'';const m=l.match(/^SENDBACK:\s*S(\d+)\b/);if(m){const to=mp['S'+m[1]];keep=to!==null;if(keep&&to){out.push(l.replace(/^SENDBACK:\s*S\d+/,'SENDBACK: '+to));out.push(sep);}else if(keep){out.push(l);out.push(sep);}}else if(keep||/^\s*"/.test(l)){out.push(l);out.push(sep);}}c.content=out.join('');return r2;})].concat(st.slice(1));}
  else over[n]=st;
  if(hook)hook(n,over);}
 return {over,fb};};
