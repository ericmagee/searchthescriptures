const {carry}=require('./match.js');const R=require('./rows31.json');const by={};R.forEach(r=>by[r.id]=r);
const out=[];let n={pass:0,refuse:0,fallback:0,flag:0};
for(const r0 of R){const r=r0.dup?{...by[r0.dup],id:r0.id}:r0;const ans=[r.answer,r.fails].filter(Boolean).join(' | ');
 if(!ans){n.fallback++;out.push(r.id+' '+r.run+' FALLBACK (the line quotes no answer words; today\'s test, passes) CB "'+r.cb+'"');continue;}
 const c=carry(r.cb,ans,r.means);c.pass?n.pass++:n.refuse++;if(c.topicOnly)n.flag++;
 out.push(r.id+' '+r.run+' '+(c.pass?'PASS':'REFUSED')+(c.topicOnly?' [TOPIC WORDS ONLY]':'')+' shared: '+(c.shared.join(', ')||'none')+' | CB "'+r.cb+'"');}
console.log(out.join('\n'));console.log(JSON.stringify(n));
