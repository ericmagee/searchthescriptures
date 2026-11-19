// ASK 435 replay (W4, coordinator 05:29Z): the L2 chain (Citation Scan .. L2 Count Plan) of the pre-435 engine against the post-435 engine, on every stored debate. Lists every node output that differs.
// Usage (from the folder holding debates.json and cache.json): node c435.cjs OLD_ENGINE.json NEW_ENGINE.json
const fs=require('fs');const {replay,save,net}=require('../a430_w1/chain430.cjs');
const rd=f=>{let w=JSON.parse(fs.readFileSync(f));return w.workflow||(w.data&&w.data.nodes?w.data:w);};const O=rd(process.argv[2]),N=rd(process.argv[3]);
const D=JSON.parse(fs.readFileSync('debates.json')).filter(r=>!process.env.ONLY||new RegExp(process.env.ONLY).test(r.run_token));
// deep diff: every leaf path that differs, old and new value (strings cut to 300)
const sh=v=>{const t=JSON.stringify(v);return t===undefined?'(absent)':t.length>300?t.slice(0,300)+'...':t;};
function dd(a,b,p,o){if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){if(Array.isArray(a)&&a.length!==b.length&&a.every(x=>typeof x!=='object')){o.push('  '+p+'\n    OLD '+sh(a)+'\n    NEW '+sh(b));return;}for(const k of new Set([...Object.keys(a),...Object.keys(b)]))dd(a[k],b[k],p+'.'+k,o);return;}o.push('  '+p+'\n    OLD '+sh(a)+'\n    NEW '+sh(b));}
const tot={runs:0,errors:0,runs_changed:0,nodes_changed:0};const out=[];
for(const r of D){let A,B;try{A=replay(O,r);B=replay(N,r);}catch(e){tot.errors++;out.push(r.run_token+' ERROR '+e.message);continue;}tot.runs++;let ch=false;
 for(const k of Object.keys(A).filter(k=>!k.startsWith('__'))){const a=JSON.stringify(A[k]),b=JSON.stringify(B[k]);if(a===b)continue;ch=true;tot.nodes_changed++;
  const ja=(A[k]||[]).map(i=>i.json),jb=(B[k]||[]).map(i=>i.json);out.push('=== '+r.run_token+' node '+k+' items '+ja.length+' -> '+jb.length);
  dd(ja,jb,'',out);}
 if(ch)tot.runs_changed++;}
save&&save();console.log(JSON.stringify(tot),'net',net());console.log(out.join('\n'));
