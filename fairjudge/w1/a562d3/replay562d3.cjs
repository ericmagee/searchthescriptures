// ASK 562 draft 3 replay (W1): LAY with 581 (base, BASE_E) against LAY with 581 + 562 draft 3 (TARGET_E), on W4's 50 stored rounds (rows=[]), the 41822/41418 Oracle drafts (stored rows, Oracle gate) and 41822's 8 stored rounds (R41822, 41822 rows).
const fs=require('fs');const {B,A}=require(__dirname+'/../a581/mk.cjs');
const key=x=>x.kind+'|'+(x.head||x.line||'').slice(0,200)+'|'+x.why;const out=[];let tb=0,ta=0;
const run=(tag,t,rows,o)=>{const b=B.check(t,rows,o),a=A.check(t,rows,o);tb+=b.items.length;ta+=a.items.length;const bk=new Set(b.items.map(key)),ak=new Set(a.items.map(key));
 out.push({tag,before:b.items.length,after:a.items.length,new:a.items.filter(x=>!bk.has(key(x))).map(x=>({head:(x.head||'').slice(0,160),why:x.why})),gone:b.items.filter(x=>!ak.has(key(x))).map(x=>({head:(x.head||x.line||'').slice(0,160),why:x.why}))});};
for(const r of JSON.parse(fs.readFileSync('/mnt/project-files/ask562/w4/rounds50.json','utf8')))run(r.run+' '+r.k,r.t,[]);
for(const ex of ['41822','41418']){const I=JSON.parse(fs.readFileSync('/mnt/project-files/ask566/w4/in_'+ex+'.json','utf8'));for(const k of Object.keys(I.rounds))run(ex+' draft '+k+' oracle',I.rounds[k],I.rows,{oracle:true});}
{const rw=JSON.parse(fs.readFileSync('/mnt/project-files/ask566/w4/in_41822.json','utf8')).rows;for(const [k,t] of Object.entries(JSON.parse(fs.readFileSync(process.env.R41822,'utf8'))))run('41822 stored '+k,t,rw);}
fs.writeFileSync(process.env.OUT,JSON.stringify(out,null,1));
const nw=out.reduce((s,r)=>s+r.new.length,0),gn=out.reduce((s,r)=>s+r.gone.length,0);
console.log('checks '+out.length+'; items before '+tb+', after '+ta+'; new '+nw+' in '+out.filter(r=>r.new.length).length+' checks; gone '+gn);
for(const r of out)for(const x of r.new)console.log('NEW '+r.tag+' "'+x.head.slice(0,60)+'" -- '+x.why.slice(0,70));
for(const r of out)for(const x of r.gone)console.log('GONE '+r.tag+' "'+x.head.slice(0,60)+'" -- '+x.why.slice(0,70));
