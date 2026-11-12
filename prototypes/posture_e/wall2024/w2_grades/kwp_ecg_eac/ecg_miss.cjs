// W2: K-B/K-G4/K-G7 items left in drv after pkgECG whose collision names a confirmed link (by the item's link id), with their line, to see any the split missed
const run=require('./rep.cjs');
run('parent_s148_ECG.json',['Panel Payloads','Alternate Payloads','R2 Alternate Payloads'],(fn,n,a,b,rd)=>{if(b.ERR)return;
 const conf=k=>{try{return ((rd[k].slice(-1)[0].data.main.flat()[0].json[k==='Close Enforcer Record'?'cec':'jcc']||{}).confirmed||[]).map(y=>y.side+' '+(+y.link));}catch(e){return [];}};
 const C=new Set([...conf('Close Enforcer Record'),...(n==='Panel Payloads'?[]:conf('Judge Contradiction Record'))]);if(!C.size)return;
 const S=b[0].json.alt?b.map(x=>({seat:x.json.alt.seat,drv:x.json.drv||[]})):b[0].json.summary;
 for(const s of S)for(const x of (s.drv||[])){if(!/^K-(B|G4|G7)$/.test(x.rule))continue;const m=String(x.link||x.line).match(/D(\d+)\s+vs\.?\s+C(\d+)/);if(!m)continue;
  const hit=C.has('DEFENDER '+(+m[1]))?'DEFENDER '+m[1]:C.has('CHALLENGER '+(+m[2]))?'CHALLENGER '+m[2]:null;if(hit)console.log(fn,n,s.seat,x.rule,'confirmed',hit,'| KEPT line:',String(x.line).replace(/\s+/g,' ').slice(0,120));}
});
