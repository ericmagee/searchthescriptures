// ASK 581 with the 562 draft 2 CP anchor (W4 replay562b.js form): items of 562 alone vs 562 + 581, on the 50 stored rounds (rows=[]).
const fs=require('fs');const {base,after}=require(__dirname+'/mk.cjs');
const A0='Point\\s+\\d+\\b)/i;';const CP562=String.raw`Point\s+\d+\b)|^\s*(?:#{1,6}\s*|\*\*\s*)against\s+(?:the\s+answer\s+to\s+)?[CD]\d+\b|^\s*(?:D\d+\s+)?against\s+[CD]\d+\b[^\n.]{0,80}:\s*$/i;`;
const sw=S=>{if(S.split(A0).length!==2)throw new Error('anchor');return S.replace(A0,()=>CP562);};
const mk=S=>new Function('$',S+'\nreturn LAY;')(undefined);const L0=mk(base),P=mk(sw(base)),PA=mk(sw(after));
const key=x=>x.kind+'|'+(x.head||x.line||'').slice(0,200)+'|'+x.why;
const R=JSON.parse(fs.readFileSync('/mnt/project-files/ask562/w4/rounds50.json','utf8'));let n562=0,n562a=0,cleared=[],added=[];
for(const r of R){const z=L0.check(r.t,[]),p=P.check(r.t,[]),q=PA.check(r.t,[]);const zk=new Set(z.items.map(key)),qk=new Set(q.items.map(key)),pk=new Set(p.items.map(key));
 const new562=p.items.filter(x=>!zk.has(key(x)));n562+=new562.length;const new562a=q.items.filter(x=>!zk.has(key(x)));n562a+=new562a.length;
 for(const x of new562)if(!qk.has(key(x)))cleared.push(r.run+' '+r.k+' "'+(x.head||'').slice(0,60)+'"');
 for(const x of q.items)if(!pk.has(key(x)))added.push(r.run+' '+r.k+' "'+(x.head||'').slice(0,60)+'" '+x.why.slice(0,60));}
if(fs.existsSync(process.env.R41822||'r41822.json')){const rw=JSON.parse(fs.readFileSync('/mnt/project-files/ask566/w4/in_41822.json','utf8')).rows;const X=JSON.parse(fs.readFileSync(process.env.R41822||'r41822.json','utf8'));
 for(const [k,t] of Object.entries(X)){const z=L0.check(t,rw),p=P.check(t,rw),q=PA.check(t,rw);const zk=new Set(z.items.map(key)),qk=new Set(q.items.map(key)),pk=new Set(p.items.map(key));
  const a=p.items.filter(x=>!zk.has(key(x))),b=q.items.filter(x=>!zk.has(key(x)));console.log('41822 '+k+': live '+z.items.length+'; 562 adds '+a.length+'; 562+581 adds '+b.length+(a.length?' | 562 heads: '+a.map(x=>'"'+(x.head||'').slice(0,50)+'" ('+x.why.slice(0,40)+')').join(' ; '):''));}}
console.log('new items over live LAY: 562 alone '+n562+'; 562 + 581 '+n562a);console.log('cleared by 581 ('+cleared.length+'):\n '+cleared.join('\n '));console.log('items in 562+581 not in 562 alone ('+added.length+'):\n '+added.join('\n '));
