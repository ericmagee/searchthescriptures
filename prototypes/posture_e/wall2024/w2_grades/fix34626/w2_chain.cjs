// W2 chain replay of execution 34626 from Panel Cure Check to Replay Rows for any write file (own runner; model nodes keep stored output,
// IF nodes follow the stored branch, the send-back replies are renumbered to the candidate's items with withheld items' lines removed).
// module: chain(parentJsonPath, mutateRD?) -> {rows, over, err}
const fs=require('fs');const run=require('../../pkgKSR/run_node.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD0=(X.data||X).resultData.runData;
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
module.exports=async function chain(PF,mut){const w=L(PF);const BY={};w.nodes.forEach(n=>BY[n.name]=n);const lib=BY['Shared Library'].parameters.jsCode;
 const RD=mut?mut(JSON.parse(JSON.stringify(RD0))):RD0;
 const order=Object.entries(RD).map(([n,r])=>[n,r[0].startTime]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);const over={};
 const srcOf=n=>{let c=BY[n].parameters.jsCode;if(!/^\/\/ pkgLIB stub/.test(c))return c;const i=c.indexOf('\nconst __e4h');if(i<0)return rebuild(c,lib);return null;};
 for(const n of order.slice(order.indexOf('Panel Cure Check'))){const nd=BY[n];if(!nd)continue;const t=nd.type;const st=(RD[n][RD[n].length-1].data||{}).main||[];
  if(/\.code$/.test(t)){const c=srcOf(n);if(c===null){over[n]=st;continue;} /* E4 head (Alternate Build): unchanged in these packages, stored output */
   const r=await run(c,n,RD,over);if(r&&r.err)return {err:n+': '+r.err,over};over[n]=[r.map(j=>({json:j}))];}
  else if(/\.if$/.test(t)){const s=(RD[n][RD[n].length-1].source||[])[0];const m=s&&(over[s.previousNode]||(RD[s.previousNode]&&RD[s.previousNode][0].data.main));const inp=m?(m[s.previousNodeOutput||0]||[]):[];over[n]=st.map(o=>o&&o.length?inp:[]);}
  else if(n==='Send Back Call openrouter'&&over['Send Back Build']){const key=i=>i.rule+'|'+i.item+'|'+i.line;
   const B0=RD['Send Back Build'][0].data.main[0].map(x=>x.json),B1=over['Send Back Build'][0].map(x=>x.json);
   over[n]=[st[0].map((c,k)=>{const b0=B0[k],b1=B1.find(j=>j.seat===b0.seat);if(!b1)return c;const map={};(b0.items||[]).forEach(i=>{const z=(b1.items||[]).find(x=>key(x)===key(i));map[i.sid]=z?z.sid:null;});
    const j=JSON.parse(JSON.stringify(c.json));const t=j.choices[0].message.content;let out;
    if(/^\s*\{/.test(t)){/* JSON verdict reply: SENDBACK lines inside an escaped string */const o=JSON.parse(t);const fix=s=>String(s).split('\n').filter(l=>{const m=l.match(/^SENDBACK: (S\d+) \|\|/);return !m||map[m[1]];}).map(l=>l.replace(/^SENDBACK: (S\d+) \|\|/,(a,s)=>'SENDBACK: '+map[s]+' ||')).join('\n');
     const walk=v=>typeof v==='string'?(/SENDBACK: S\d+/.test(v)?fix(v):v):Array.isArray(v)?v.map(walk):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([a,b])=>[a,walk(b)])):v;out=JSON.stringify(walk(o),null,2);}
    else out=t.split('\n').filter(l=>{const m=l.match(/^SENDBACK: (S\d+) \|\|/);return !m||map[m[1]];}).map(l=>l.replace(/^SENDBACK: (S\d+) \|\|/,(a,s)=>'SENDBACK: '+map[s]+' ||')).join('\n');
    j.choices[0].message.content=out;return {json:j};})];}
  else over[n]=st;
  if(n==='Replay Rows')break;}
 const rows=(over['Replay Rows']||[[]])[0].map(x=>x.json);return {rows,over};};
