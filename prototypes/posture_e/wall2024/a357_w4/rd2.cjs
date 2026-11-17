const fs=require('fs');const {live}=require('./rd.cjs');
const Q=/"[^"]*"|“[^”]*”|(^|[\s(\[])['‘](?:[^'‘’]|['’](?=[A-Za-z]))*?['’](?=$|[\s.,;:!?)\]])/g;
const P1=/\banswer\s+(?:misses|does\s+not\s+meet|did\s+not\s+meet|fails\s+to\s+meet|does\s+not\s+answer)\s+the\s+(?:[\w'’-]+\s+){0,3}press(?:ed)?\b/i;
const P2=/\bpress(?:ed)?\s+(?:[\w'’-]+\s+){0,2}(?:is|was)\s+not\s+met\b/i;
function prop(line){if(live(line))return true;const o=String(line||'').replace(Q,'$1 ');const neg=m=>m&&!/\b(?:not|never|no)\s+(?:\w+\s+){0,2}$/i.test(o.slice(Math.max(0,m.index-30),m.index));return !!(neg(P1.exec(o))||neg(P2.exec(o)));}
const rows=JSON.parse(fs.readFileSync('g4rows.json'));let ch=[];
for(const r of rows){if(live(r.flagged_line)!==prop(r.flagged_line))ch.push(r);}
console.log('K-G4 rows',rows.length,'reader changes',ch.length);for(const r of ch)console.log(r.id,r.seat,r.cure_status,'|',String(r.flagged_line).slice(0,170));
module.exports={prop};
