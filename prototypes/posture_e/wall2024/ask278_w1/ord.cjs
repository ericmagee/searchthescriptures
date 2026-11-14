// W1 ASK 278 order-sentence match, run beside pkgVBC/rounds8.json (gunzip rounds8.json.gz).
const d=require('./rounds8.json');const C={claude_r1:'CR1',claude_r2:'CR2',engine_r3:'CR3',defender_r4:'CR4',engine_r1:'DR1',engine_r2:'DR2',challenger_r3:'DR3',challenger_r4:'DR4'};
let n=0,fp=0;for(const r of d)for(const [col,lab] of Object.entries(C)){const t=String(r[col]||'');
 for(const s of t.split(/(?<=[.!?])\s+|\n+/)){if(!/\b(?:first\b[^.]{0,80}\b(?:then|after|afterward|second)\b|comes? first|came first)/i.test(s))continue;if(/\d+:\d+/.test(s)||/["“”]/.test(s))continue;
  if(/\b(?:I|my|me)\b/.test(s)){fp++;continue;}n++;console.log(r.id.slice(0,8),lab,'|',s.trim().slice(0,240));}}
console.log('kept',n,'first-person dropped',fp);
