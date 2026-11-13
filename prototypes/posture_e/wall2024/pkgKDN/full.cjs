// full-text replay: kwLines421 old vs new on whole stored rounds. usage: node full.cjs <live> <target> <rounds json files...>
const {load}=require(__dirname+'/kwload.cjs');const fs=require('fs');const [, , fl, ft, ...fr]=process.argv;const OLD=load(fl),NEW=load(ft);
const rnd=k=>k.match(/r(\d)$/)[1];const role=(t,k)=>/^DEFENDER/.test(t)?'CR':/^CHALLENGER/.test(t)?'DR':({claude_r2:'CR',engine_r2:'DR',engine_r3:'CR',challenger_r3:'DR',defender_r4:'CR',challenger_r4:'DR'})[k];
const out=[];let rounds=0,lost=0;const deb=new Set();
for(const f of fr){let s=fs.readFileSync(f,'utf8');try{s=JSON.parse(s).result||s;}catch(e){}const a=s.indexOf('[{'),b=s.lastIndexOf('}]');const rows=JSON.parse(s.slice(a,b+2));
 for(const r of rows){const o=r.r||r.json_build_object||Object.values(r)[0];const id=o.id;for(const k of Object.keys(o)){if(k==='id'||!o[k])continue;rounds++;deb.add(id);const key=role(o[k],k)+rnd(k);
  const L=x=>x.items.filter(i=>i.rule==='K-W').map(i=>i.line);const A=L(OLD('',{[key]:o[k]})),B=L(NEW('',{[key]:o[k]}));const ex=B.slice();
  for(const l of A){const j=ex.indexOf(l);if(j>=0)ex.splice(j,1);else{lost++;console.log('OLD ITEM GONE',id,k,l);}}
  for(const l of ex)out.push({id,k,side:key,line:l});}}}
console.log('rounds',rounds,'debates',deb.size,'new K-W items',out.length,'old items gone',lost);
fs.writeFileSync(process.env.OUT||'full_items.json',JSON.stringify(out,null,1));
