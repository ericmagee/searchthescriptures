const giveUp=(T,claim)=>{const cw=new Set((N(claim).match(/[a-z]{4,}/g)||[]));const out=[];for(const p of String(T||'').split(/\n+/)){if(/\bI\s+(?:withdraw|drop|grant|concede|do\s+not\s+claim|no\s+longer\s+claim)\b|\bNARROWED\s+TO\b|\bConceded\b/i.test(p)){const sc=(N(p).match(/[a-z]{4,}/g)||[]).filter(w=>cw.has(w)).length;out.push({p:p.trim(),sc});}}
 out.sort((a,b)=>b.sc-a.sc);let t='';for(const o of out){if(t.length+o.p.length>3500)break;t+=o.p+'\n';}return t.trim();};
let si=0;
for(const s of SY.split(/\n|(?<=[.!?])\s+(?=[A-Z*_"“])/)){const m=s.match(/\b(defender|challenger)\b[^.;:]{0,60}?\b(withdr(?:ew|awn|aws)|conced(?:ed|es)|grant(?:ed|s)|dropp?(?:ed|s)|narrow(?:ed|s))\b/i);if(!m)continue;if(/\b(?:no|not|never|neither)\b/i.test(s.slice(0,m.index+m[0].length)))continue;
 const sd=/^d/i.test(m[1])?'D':'C';si++;if(si>20)break;const id='Y'+si+'.1';
