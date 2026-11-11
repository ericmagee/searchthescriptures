const fs=require('fs');const L=fs.readFileSync('stored_rt_lines.txt','utf8').split('\n').filter(Boolean).map(s=>{try{return JSON.parse('"'+s+'"')}catch(e){return s}});
const nrm=s=>String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
const R=/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*(?:\.?$|(?:--|[–—])(?!.*\b(?:NOT\s+(?:RETRACTED|WITHDRAWN)|STANDS?|KEEP|KEPT|REMAINS?)\b))/i;
const W=/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*(?:\.?$|(?:--|[–—])(?!.*\b(?:NOT|NO|NEVER|STAND\w*|KEEP\w*|KEPT|REMAIN\w*|UPH[OE]LD\w*|MAINTAIN\w*|RETAIN\w*)\b))/i;
let c={};for(const l of L){const a=!!R.test(nrm(l)),b=!!W.test(nrm(l));const k=(a?'RTE:read':'RTE:no')+' '+(b?'W2:read':'W2:no');c[k]=(c[k]||0)+1;if(a!==b)console.log('DIFF',k,l.slice(0,220));}
console.log(c);
const N=/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*(?:\.?$|(?:--|[–—])(?!.*\b(?:NOT\s+(?:BE\s+)?(?:RETRACT\w*|WITHDRAW\w*)|STAND\w*|KEEP\w*|KEPT|REMAIN\w*|UPH[OE]LD\w*|MAINTAIN\w*|RETAIN\w*)\b))/i;
let d=0;for(const l of L){if(!!R.test(nrm(l))!==!!N.test(nrm(l))){d++;console.log('N DIFF',l.slice(0,200))}}console.log('stored lines where narrow guard differs from RTE:',d);
for(const s of ['RETRACTED: D1 vs C3 -- I do not retract this ruling','RETRACTED: D1 vs C3 -- the break is upheld','RETRACTED: D1 vs C3 -- maintained','RETRACTED: D1 vs C3 -- not withdrawing it','RETRACTED: D1 vs C3 -- still standing','RETRACTED: D1 vs C3 -- the forced-link ruling is withdrawn','RETRACTED: D1 vs C3 -- the ruling stands'])console.log(N.test(nrm(s))?'read':'NOT APPLIED',JSON.stringify(s));
console.log('guard length change vs RTE:',String(N).length-String(R).length);
