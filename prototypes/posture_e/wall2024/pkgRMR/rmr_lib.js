/* pkgRMR (W1; rulings 2026-11-07 item 10, outside review D7): the rules that put a seat's drv_uncured above 0, read from its own stored lines. */
function rmrOf(raw,drv,isLive){const by={};const add=(k,n)=>{by[k]=(by[k]||0)+n;};
 const top=(s,sep)=>{const o=[];let d=0,cur='';for(let i=0;i<s.length;i++){const ch=s[i];if(ch==='('||ch==='[')d++;else if((ch===')'||ch===']')&&d>0)d--;if(d===0&&s.startsWith(sep,i)){o.push(cur);cur='';i+=sep.length-1;continue;}cur+=ch;}if(cur.trim())o.push(cur);return o.filter(x=>x.trim()).length;};
 for(const l of String(raw==null?'':raw).split('\n')){
  let m=l.match(/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- (?:SEAT: [^;]*; )?ITEM: [^;]*; RULE: ([^;]+); RESULT: ([A-Z ]+?)(?:;|\])/);
  if(m){if(m[2].trim()!=='CURED'&&isLive(m[1].trim()))add(m[1].trim()+' (cure)',1);continue;}
  if(!/counted in drv_uncured/.test(l)||/not counted in drv_uncured/.test(l))continue;
  m=l.match(/^\[AUDIT v38: E-GATE -- SEAT: [^;]*; \S+ ([^;(]+?) \(/);if(m){add('E-GATE '+m[1].trim(),1);continue;}
  m=l.match(/^\[AUDIT v(\d+): (.+?) -- SEAT: [^;]*; ITEMS: (.*?); (?:no written answer|counted in drv_uncured)/);
  if(m){const tag=m[2].replace(/\s*\(.*$/,'').trim();add(tag,top(m[3],m[1]==='40'?', ':'; '));continue;}
  add('UNREAD COUNTED LINE',1);}
 const rules=Object.keys(by).map(k=>k+' x'+by[k]);const total=Object.values(by).reduce((a,b)=>a+b,0);
 return {rules,total,match:total===(drv||0)};}
