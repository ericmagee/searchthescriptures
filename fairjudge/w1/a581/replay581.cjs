// ASK 581 replay (W1): LAY before (stacked base after 559+560, 549, 561+569: LIB 3499-3557) and after the 581 edits.
// (1) W4's 50 stored rounds (ask562/w4/rounds50.json), rows=[] as in W4's replays, plain and with the Oracle gate.
// (2) Oracle first drafts of runs 41822 and 41418 (ask566/w4/in_*.json) with their stored KJV rows, with the Oracle gate as D2B/D3B/D4B call it.
// (3) the stored rounds of run 41822 (r41822.json) with the 41822 rows.
const fs=require('fs');const {B,A}=require(__dirname+'/mk.cjs');
const key=x=>x.kind+'|'+(x.head||x.line||'').slice(0,200)+'|'+x.why;
const diff=(b,a)=>{const bk=new Set(b.items.map(key)),ak=new Set(a.items.map(key));return {nw:a.items.filter(x=>!bk.has(key(x))),gone:b.items.filter(x=>!ak.has(key(x)))};};
const res=[];let T={b:0,a:0};
function run(tag,t,rows,o){const b=B.check(t,rows,o),a=A.check(t,rows,o);T.b+=b.items.length;T.a+=a.items.length;const d=diff(b,a);
 res.push({tag,before:b.items.length,after:a.items.length,new:d.nw.map(x=>({head:(x.head||x.line||'').slice(0,160),why:x.why})),gone:d.gone.map(x=>({head:(x.head||x.line||'').slice(0,160),why:x.why}))});}
const R=JSON.parse(fs.readFileSync('/mnt/project-files/ask562/w4/rounds50.json','utf8'));
for(const r of R){run(r.run+' '+r.k,r.t,[]);run(r.run+' '+r.k+' oracle',r.t,[],{oracle:true});}
for(const ex of ['41822','41418']){const I=JSON.parse(fs.readFileSync('/mnt/project-files/ask566/w4/in_'+ex+'.json','utf8'));for(const k of Object.keys(I.rounds))run(ex+' draft '+k+' oracle',I.rounds[k],I.rows,{oracle:true});}
if(fs.existsSync(process.env.R41822||'r41822.json')){const I=JSON.parse(fs.readFileSync('/mnt/project-files/ask566/w4/in_41822.json','utf8'));const X=JSON.parse(fs.readFileSync(process.env.R41822||'r41822.json','utf8'));for(const [k,t] of Object.entries(X))if(t){run('41822 stored '+k,t,I.rows);if(/claude|defender/.test(k))run('41822 stored '+k+' oracle',t,I.rows,{oracle:true});}}
fs.writeFileSync(process.env.OUT||'replay581_results.json',JSON.stringify(res,null,1));
console.log('checks '+res.length+'; items before '+T.b+', after '+T.a+'; checks with new items '+res.filter(r=>r.new.length).length+'; checks with items gone '+res.filter(r=>r.gone.length).length);
for(const r of res)if(r.new.length||r.gone.length)console.log(r.tag+' '+r.before+'->'+r.after+(r.gone.length?' GONE: '+r.gone.map(x=>'"'+x.head.slice(0,70)+'" ('+x.why.slice(0,50)+')').join(' | '):'')+(r.new.length?' NEW: '+r.new.map(x=>'"'+x.head.slice(0,70)+'" ('+x.why.slice(0,50)+')').join(' | '):''));
