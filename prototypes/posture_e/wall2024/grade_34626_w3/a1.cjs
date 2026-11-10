const {out}=require('./x.cjs');const S=JSON.stringify;
const F=out('Regrade Load')[0].json.f;
const ctx=(t,re,w)=>{const o=[];let m;const r=new RegExp(re,'gi');while((m=r.exec(t)))o.push('...'+t.slice(Math.max(0,m.index-w),m.index+w).replace(/\n/g,' / ')+'...');return o;};
for(const k of ['cr1','cr2','cr3','cr4']){console.log('== '+k+' ('+String(F[k]).length+' chars): "biological father" contexts');ctx(String(F[k]),'biological father',380).forEach(x=>console.log('  '+x));}
console.log('== Close Enforcer replies');out('Close Enforcer Call deepseek').forEach((c,i)=>console.log(i,S(c.json.choices?c.json.choices[0].message.content:c.json).slice(0,3000)));
const rec=out('Close Enforcer Record')[0].json;console.log('== record keys',Object.keys(rec));console.log(S(rec).slice(0,5000));
