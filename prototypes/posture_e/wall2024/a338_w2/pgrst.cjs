// W2 local stand-in for PostgREST kjv_verses reads (REST host is blocked in this container). Rows from kjv.json (SQL dump, id order).
const fs=require('fs');const R=JSON.parse(fs.readFileSync(process.env.KJV)).map(([id,book,chapter,verse,text])=>({id,book,chapter,verse,text}));
const splitTop=s=>{const o=[];let d=0,q=false,b='';for(const ch of s){if(ch==='"')q=!q;if(!q&&ch==='(')d++;if(!q&&ch===')')d--;if(!q&&d===0&&ch===','){o.push(b);b='';}else b+=ch;}if(b)o.push(b);return o;};
const unq=v=>v.startsWith('"')?v.slice(1,-1):v;
const ilike=(pat,t)=>{const re=new RegExp('^'+pat.split('*').map(x=>x.replace(/[.+?^${}()|[\]\\%_]/g,'\\$&')).join('.*')+'$','is');return re.test(t);};
const cond=c=>{if(c.startsWith('and(')){const ps=splitTop(c.slice(4,-1)).map(cond);return r=>ps.every(p=>p(r));}
 const m=c.match(/^(\w+)\.(eq|in|ilike|gte|lte)\.(.*)$/s);if(!m)throw new Error('cond '+c);const [,f,op,v]=m;
 if(op==='eq')return r=>String(r[f])===unq(v);if(op==='in'){const S=new Set(splitTop(v.slice(1,-1)).map(unq));return r=>S.has(String(r[f]));}
 if(op==='gte')return r=>+r[f]>=+v;if(op==='lte')return r=>+r[f]<=+v;return r=>ilike(unq(v),String(r[f]));};
globalThis.fetch=async u=>{const q=new URL(u).searchParams;let rows=R;const lim=+(q.get('limit')||1e9);
 for(const [k,v] of q){if(k==='select'||k==='limit')continue;if(k==='or'){const ps=splitTop(v.slice(1,-1)).map(cond);rows=rows.filter(r=>ps.some(p=>p(r)));}else{const p=cond(k+'.'+v);rows=rows.filter(p);}}
 const sel=q.get('select').split(',');const out=rows.slice(0,lim).map(r=>Object.fromEntries(sel.map(s=>[s,r[s]])));if(process.env.LIMLOG&&rows.length>=lim)console.error('LIMIT HIT',lim,rows.length);return {json:async()=>out};};
