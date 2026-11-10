// W2 copy of W1's pkgEAD/chain.cjs: gate replies renumbered too, and JSON-prefixed reply lines handled.
// Offline chain replay of execution 34626 from a start node to Replay Rows with a chosen library source set (W1).
// Code nodes run (library nodes from pkgLIB/strip_<SET>/patched, others from the s110 fetch-back); IF nodes pass their input to the branch the stored run took;
// HTTP (model) nodes keep their stored output. Usage: module chain(SET, start) -> {out: map node -> main}
const fs=require('fs');const MAPLOG=[];const run=require('../../pkgKSR/run_node.cjs');
const X=JSON.parse(fs.readFileSync(process.env.CHAIN_EX||'/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
let W=JSON.parse(fs.readFileSync(process.env.CHAIN_WF||'/mnt/project-files/wall2024/fetchback_live_s110.json','utf8'));W=W.data||W;W=W.workflow||W;const BY={};W.nodes.forEach(n=>BY[n.name]=n);
module.exports=async function chain(SET,start,stop,hook){const order=Object.entries(rd).map(([n,r])=>[n,r[0].startTime]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
 const over={};const fb=[];if(hook)hook('__start',over,rd);const lib=n=>{const f='pkgLIB/strip_'+SET+'/patched/'+n.replace(/ /g,'_')+'.js';return fs.existsSync(f)?fs.readFileSync(f,'utf8'):null;};
 const inOf=n=>{const s=(rd[n][rd[n].length-1].source||[])[0];if(!s)return [];const m=over[s.previousNode]||(rd[s.previousNode]?(rd[s.previousNode][rd[s.previousNode].length-1].data||{}).main:null);return m?(m[s.previousNodeOutput||0]||[]):[];};
 for(const n of order.slice(order.indexOf(start))){if(stop&&n===stop)break;const t=BY[n]&&BY[n].type;const st=(rd[n][rd[n].length-1].data||{}).main||[];
  if(/\.code$/.test(t)){const code=lib(n)||BY[n].parameters.jsCode;const r=await run(code,n,rd,over,n==='Alternate Build'?(over['Alternate Needed?']||[])[0]:null);if(r&&r.err){if(lib(n))return {err:n+': '+r.err,over};fb.push(n+' ('+r.err.slice(0,60)+')');over[n]=st;}else over[n]=[r.map(j=>({json:j}))];}
  else if(/\.if$/.test(t)){const inp=inOf(n);over[n]=st.map(o=>o&&o.length?inp:[]);}
  else if(n==='Send Back Call openrouter'||n==='Gate Call openrouter'){/* W2: replies renumbered to the candidate's items for send-back AND gate; a line may start with a JSON key prefix such as "reasoning": " (terra's form); a withheld item's lines are removed */
   const G=n==='Gate Call openrouter',BN=G?'Gate Build':'Send Back Build',TAG=G?'GATE':'SENDBACK',P=G?'G':'S',ID=G?'gid':'sid';
   const key=it=>G?(it.kind+'|'+it.key):(it.rule+'|'+String(it.item||'').replace(/\bS\d+\b/g,'S#')+'|'+it.line);const B0=(rd[BN][0].data.main[0]||[]).map(x=>x.json).filter(j=>!j.sb_skip&&!j.gate_skip),B1=((over[BN]||[])[0]||[]).map(x=>x.json).filter(j=>!j.sb_skip&&!j.gate_skip);
   const rx=new RegExp('^(\\s*"\\w+":\\s*")?'+TAG+':\\s*'+P+'(\\d+)\\b');
   over[n]=[st[0].map((r,i)=>{const b0=B0[i],b1=B1.find(j=>j.seat===(b0&&b0.seat));if(!b0||!b1)return r;const mp={};(b0.items||[]).forEach(it=>{const k=key(it);const t=(b1.items||[]).find(z=>key(z)===k);mp[it[ID]]=t?t[ID]:null;});
    MAPLOG.push(n+' '+b0.seat+' '+JSON.stringify(mp)+' new-only: '+JSON.stringify((b1.items||[]).filter(z=>!(b0.items||[]).some(y=>key(y)===key(z))).map(z=>z[ID]+' '+key(z))));
    const r2=JSON.parse(JSON.stringify(r));const c=r2.json.choices[0].message;const parts=String(c.content).split(/(\n|\\n)/);const out=[];let keep=true;
    for(let q=0;q<parts.length;q+=2){const l=parts[q],sep=q+1<parts.length?parts[q+1]:'';const m=l.match(rx);if(m){const to=mp[P+m[2]];keep=to!==null;if(keep&&to){out.push(l.replace(new RegExp(TAG+':\\s*'+P+'\\d+'),TAG+': '+to));out.push(sep);}else if(keep){out.push(l);out.push(sep);}else if(m[1]){out.push(m[1]);}}else if(keep||/^\s*"/.test(l)){out.push(l);out.push(sep);}}c.content=out.join('');return r2;})].concat(st.slice(1));}
  else over[n]=st;
  if(hook)hook(n,over);}
 return {over,fb,MAPLOG};};
