const keysOf=t=>{const K=new Map();for(const m of String(t||'').matchAll(REF)){const b=m[1].replace(/\s/g,'');const b3=b.slice(0,3).toLowerCase();const a=+m[3],z=m[4]?+m[4]:a;
 if(z<a||z-a>12)continue;for(let v=a;v<=z;v++){const k=b3+' '+m[2]+':'+v;if(!K.has(k))K.set(k,m[1]+' '+m[2]+':'+v);}}return K;};
const blocksOf=t=>{const out=[];let head='';for(const raw of String(t||'').split(/\n\s*\n/)){let cur=null;for(const l of raw.split('\n')){const s=l.trim();if(!s)continue;
 if(/^#{1,6}\s/.test(s)||/^\*\*[^*]{2,120}\*\*:?$/.test(s)){if(cur){out.push(cur);cur=null;}head=s;continue;}
 const ind=/^\s+[-*•]|^\s{2,}\S/.test(l);if(ind&&cur){cur.text+=' / '+s;continue;}if(cur)out.push(cur);cur={text:s,head};}if(cur)out.push(cur);}return out;};
