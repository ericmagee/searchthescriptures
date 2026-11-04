// s429 F11 (ruling 428 steps 4 and 5). E-COL: each FORCED line and each "... LINK BROKEN" collision line a panel judge wrote. E-SYN: each synthesis
// sentence that says a named side withdrew, conceded, granted, dropped or narrowed something, read against that side's own words.
const CG=[];
for(const j of judges)for(const l0 of j.t.split('\n')){const l=l0.replace(/^[\s*\-•]+/,'');
 if(!(/^FORCED\s*:/.test(l)||(/^(?:[DC]\d+\s*(?:vs\.?\s*[DC]\d+)?)\s*:/.test(l)&&/LINK BROKEN/.test(l))))continue;
 const key=N(l).slice(0,160);let g=CG.find(x=>x.key===key);if(!g){g={key,line:l,seats:[]};CG.push(g);}g.seats.push(j.seat);}
let ci=0;
for(const g of CG){ci++;const ids=g.seats.map((s,k)=>({id:'K'+ci+'.'+(k+1),rule:'E-COL',seat:s,grade:/^FORCED/.test(g.line)?'FORCED':'LINK BROKEN',item:'COLLISION '+(g.line.match(/^(?:FORCED\s*:\s*)?([DC]\d+(?:\s*vs\.?\s*[DC]\d+)?)/)||[])[1],flagged_line:g.line.slice(0,1500),response_line:g.line.slice(0,700)}));
 items.push({ids,text:'ITEM K'+ci+' (E-COL, a collision line graded against a link):\nTHE LINE: '+cut(g.line,1600)+'\nTHE JUDGES WHO WROTE IT: '+ids.map(x=>x.id+' ('+x.seat+')').join(', ')});}
let SY='';try{const RG=$('Regrade Load').isExecuted?$('Regrade Load').first().json.f:$('Final Output').first().json;SY=String(RG.synthesis||'');}catch(e){SY='';}
const SIDEW={D:[R&&R.CR1,R&&R.CR2,R&&R.CR3,R&&R.CR4].join('\n'),C:[R&&R.DR1,R&&R.DR2,R&&R.DR3,R&&R.DR4].join('\n')};
const giveUp=(T,claim)=>{const cw=new Set((N(claim).match(/[a-z]{4,}/g)||[]));const out=[];for(const p of String(T||'').split(/\n+/)){if(/\bI\s+(?:withdraw|drop|grant|concede|do\s+not\s+claim|no\s+longer\s+claim)\b|\bNARROWED\s+TO\b|\bConceded\b/i.test(p)){const sc=(N(p).match(/[a-z]{4,}/g)||[]).filter(w=>cw.has(w)).length;out.push({p:p.trim(),sc});}}
 out.sort((a,b)=>b.sc-a.sc);let t='';for(const o of out){if(t.length+o.p.length>3500)break;t+=o.p+'\n';}return t.trim();}; /* the give-ground sentences sharing most words with the claim come first */
let si=0;
for(const s of SY.split(/\n|(?<=[.!?])\s+(?=[A-Z*_"“])/)){const m=s.match(/\b(defender|challenger)\b[^.;:]{0,60}?\b(withdr(?:ew|awn|aws)|conced(?:ed|es)|grant(?:ed|s)|dropp?(?:ed|s)|narrow(?:ed|s))\b/i);if(!m)continue;if(/\b(?:no|not|never|neither)\b/i.test(s.slice(0,m.index+m[0].length)))continue;
 const sd=/^d/i.test(m[1])?'D':'C';si++;if(si>20)break;const id='Y'+si+'.1';
 items.push({ids:[{id,rule:'E-SYN',seat:'synthesis',grade:'CLAIM',item:'SYNTHESIS '+(sd==='D'?'defender':'challenger')+' '+m[2].toLowerCase(),flagged_line:s.slice(0,1500),response_line:s.slice(0,700)}],
  text:'ITEM Y'+si+' (E-SYN, a sentence of the synthesis about the '+(sd==='D'?'defender':'challenger')+'):\nTHE SENTENCE: '+cut(s,700)+'\nTHAT SIDE\'S OWN SENTENCES THAT GIVE GROUND (withdraw, drop, grant, concede, narrow):\n'+(giveUp(SIDEW[sd],s)||'(none found)')+'\nANSWER ID: '+id});}
