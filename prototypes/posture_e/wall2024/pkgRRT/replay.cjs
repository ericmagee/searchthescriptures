// pkgRRT replay: old and new Reread Build + Record on each stored export; the Record reads the stored DeepSeek replies.
const fs=require('fs');const [,,exF]=process.argv;const ex=JSON.parse(fs.readFileSync(exF,'utf8'));const rd=ex.data.resultData.runData;
const items=n=>{const r=rd[n];return r?r[r.length-1].data.main.flat().filter(Boolean):[];};
const run=async(src,$,inp)=>new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,{all:()=>inp,first:()=>inp[0],item:inp[0]});
(async()=>{for(const p of ['','Alt ']){const bn=p+'Reread Build',rn=p+'Reread Record';if(!rd[bn]){console.log(bn,'NOT RUN');continue;}
 const f=n=>'pkgRRT/src/'+n.replace(/ /g,'_');const out={};
 for(const v of ['old','new']){const B=await run(fs.readFileSync(f(bn)+'.'+v+'.js','utf8'),n=>({first:()=>items(n)[0],all:()=>items(n),isExecuted:!!rd[n]}),[]);
  const $=n=>n===bn?{first:()=>B[0],all:()=>B}:({first:()=>items(n)[0],all:()=>items(n),isExecuted:!!rd[n]});
  const R=await run(fs.readFileSync(f(rn)+'.'+v+'.js','utf8'),$,B[0].json.rr_skip?[]:items(p+'Reread Call deepseek'));out[v]={B:B.map(x=>x.json),R:R[0].json};}
 const o=out.old,n=out.new;const st=items(rn)[0].json;
 console.log('==',p+'Reread','| old Record equals stored rows:',JSON.stringify(o.R.rr_rows.map(r=>[r.seat,r.item,r.cure_reason]))===JSON.stringify(st.rr_rows.map(r=>[r.seat,r.item,r.cure_reason])));
 const ask=x=>x.B.reduce((a,b)=>a+(b.ids||[]).length,0),body=x=>x.B.reduce((a,b)=>a+JSON.stringify(b.body||'').length,0);
 console.log(' items asked old',ask(o),'new',ask(n),'| request chars old',body(o),'new',body(n),'diff',body(n)-body(o),'| tally old',JSON.stringify(o.R.reread.tally||{}),'new',JSON.stringify(n.R.reread.tally||{}));
 console.log(' rows old',o.R.rr_rows.length,'new',n.R.rr_rows.length,'| NOT MADE rows new',n.R.rr_rows.filter(r=>/NOT MADE/.test(r.cure_reason)).length);
 for(const r of n.R.rr_rows.filter(r=>/pkgRRT/.test(r.cure_reason)))console.log('   ',r.seat,r.item,'|',r.cure_reason.slice(0,170));
 const same=o.R.rr_rows.filter(r=>!/^RETRACTED/.test(r.flagged_line||'')).every(r=>n.R.rr_rows.some(z=>z.seat===r.seat&&z.item===r.item&&z.cure_reason===r.cure_reason));console.log(' every non-retraction row unchanged:',same);}})();
