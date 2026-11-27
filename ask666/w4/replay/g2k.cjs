// ASK 664 Part 2 rev 2 retest reader: G2 (C1 matching as taken, Wall 12421) and G3 (two sends).
const fs=require('fs');const A=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),E=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const KEY={A1:'A',A3:'A',A5:'A',A7:'A',A9:'A',B1:'A',B4:'A',B6:'A'};
const toks=s=>String(s).toLowerCase().replace(/\[[^\]]*\]/g,' ').replace(/[“”"]/g,' ').replace(/(^|\s)['‘’]+|['‘’]+(?=\s|$)/g,' ').replace(/’/g,"'").match(/[a-z0-9']+/g)||[];
const run=(q,s)=>{const a=toks(q),b=toks(s);if(!a.length)return false;for(let i=0;i+a.length<=b.length;i++){let ok=true;for(let j=0;j<a.length;j++)if(b[i+j]!==a[j]){ok=false;break;}if(ok)return true;}return false;};
const wwords=w=>{const m=w.match(/"(.*)"\s*$/);return m?m[1]:w;};
const F=(process.argv[4]||'').split(',');
const strip1=q=>F.includes('strip')?q.replace(/[()]/g,''):q;
const runP=(q,s)=>{if(F.includes('ell')&&/\.\.\.|…/.test(q)){const p=q.split(/\.\.\.|…/).map(x=>x.trim()).filter(x=>toks(x).length);return p.length>0&&p.every(x=>run(x,s));}return run(q,s);};
const read=(ans,e)=>{let t=String(ans||'').trim();const L=t.split('\n').filter(x=>x.trim());if(F.includes('first')&&L.length>1)t=L[0].trim();else if(L.length!==1)return {r:'DNA',why:'not one line'};
 let m=t.match(/^ACCOUNTS\s+--\s+TAKES:\s+"(.*)"\s+--\s+WITNESS WORDS:\s+"(.*)"\s*$/);
 if(m){const [_,tq,wq]=m;if(!F.includes('ell')&&/\.\.\.|…/.test(tq+wq))return {r:'DNA',why:'ellipsis in a quotation'};
  if(!runP(strip1(tq),e.takes))return {r:'DNA',why:'TAKES quotation not in the TAKES words'};
  if(F.includes('ell')&&/\.\.\.|…/.test(wq))return {r:'DNA',why:'ellipsis in WITNESS WORDS'};
  if(toks(wq).length<3)return {r:'DNA',why:'WITNESS WORDS fewer than 3 words'};
  if(!run(strip1(wq),wwords(e.witness)))return {r:'DNA',why:'WITNESS WORDS not a run of the witness'};
  return {r:'A',why:'form and quotations hold'};}
 if(/^DOES NOT ACCOUNT\s+--\s+"(.*)"\s*$/.test(t))return {r:'DNA',why:'answered DOES NOT ACCOUNT'};
 return {r:'DNA',why:'out of form'};};
const byId={};for(const e of E)byId[e.id]=e;const out={};let cost=0;
for(const a of A){const e=byId[a.id];const g=read(a.answer,e);(out[a.id]=out[a.id]||{}) ['s'+a.send]={raw:a.answer,raw_kind:/^ACCOUNTS/.test(a.answer||'')?'A':/^DOES NOT ACCOUNT/.test(a.answer||'')?'DNA':'FORM?',g2:g.r,why:g.why};cost+=(a.usage&&a.usage.cost_details&&a.usage.cost_details.upstream_inference_cost)||0;}
let ok=0,lenient=0,strict=0;const rows=[];
for(const e of E){const o=out[e.id];const fin=(o.s1.g2==='A'&&o.s2.g2==='A')?'A':'DNA';const k=KEY[e.id]||'DNA';if(fin===k)ok++;else if(k==='DNA')lenient++;else strict++;rows.push({id:e.id,key:k,s1:o.s1,s2:o.s2,final:fin,match:fin===k});}
console.log(JSON.stringify({ok,of:E.length,lenient,strict,cost:+cost.toFixed(6),rows},null,1));
