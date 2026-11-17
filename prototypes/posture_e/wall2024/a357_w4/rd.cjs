const fs=require('fs');const {unpack}=require('../tools/lib.cjs');const L=unpack(JSON.parse(fs.readFileSync('../rdf/fetchback_w353.json'))).L;
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
const live=new Function('DRV_WORDS',L[850]+'\n'+L[851]+'\n'+L[852]+'\nreturn g4Unans2024;')(DRV_WORDS);
// proposed: (a) Commitment 5 press form; (b) answer MISSES/FAILS read outside quotations anywhere on the line
const Q=/"[^"]*"|“[^”]*”/g;
function prop(line){if(live(line))return true;const s=String(line||'');const o=s.replace(Q,' ');
 if(/\(\s*Commitment 5\s*\)/i.test(o)&&/\bPRESSED\s*:\s*D\d+\s*vs\.?\s*C\d+\s*\|\s*\[(?:CR|DR)[1-4]\]/i.test(s))return true;
 return /\b(?:the\s+)?answer\s+(?:misses|fails\s+to\s+(?:answer|meet|address))\b/i.test(o);}
const rows=JSON.parse(fs.readFileSync('g4rows.json'));let ch=[];
for(const r of rows){const a=live(r.flagged_line),b=prop(r.flagged_line);if(a!==b)ch.push(r);}
console.log('K-G4 rows',rows.length,'reader changes',ch.length);
for(const r of ch)console.log(r.id,r.run_token,r.seat,r.cure_status,'|',String(r.flagged_line).slice(0,230).replace(/\n/g,' '));
module.exports={live,prop};
