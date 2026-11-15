// ASK 325 build: Close Enforcer Record demotes a CONFIRMED row whose EARLIER grounds are the other side's words, which the flagged side only quoted (pkgOSW).
const fs=require('fs'),cr=require('crypto');const IN=process.argv[2]||'../a330/target_331.json',OUT=process.argv[3]||'target_325.json';
const d=JSON.parse(fs.readFileSync(IN));const n=d.nodes.find(x=>x.name==='Close Enforcer Record');const s0=n.parameters.jsCode;
const A="if(__two)rows.forEach(x=>{if(x.status!=='CONFIRMED')return;if(rows.some(";
if(s0.split(A).length!==2)throw new Error('anchor');
const F=String.raw`{const __OSW_FLOOR=40;const __nm={DEFENDER:'defender',CHALLENGER:'challenger'};const __lab=p=>/\bmeans\s+(?:(?:cr|dr)\d\s+)?(?:(?:[a-z]\d+|\d+)(?:\s\d+)*\s*)?(?:at\s+[a-z]?\d+(?:\s\d+)*\s*)?:?\s*$/.test(p);const __own=(p,who)=>new RegExp('\\b'+who+'s\\b').test(p);
 const __sp=(nl,ml,k)=>{const wi=(nl.slice(0,k).match(/ /g)||[]).length;const part=nl.slice(nl.lastIndexOf(' ',k-1)+1,k);let c=-1,st=0;const w=[];for(let i=0;i<ml.length;i++){if(ml[i]==='qqsbqq'){if(c+1<=wi){w.length=0;}continue;}c++;if(c>=wi)break;w.push(ml[i]);}return (w.length?w.join(' ')+' ':'')+part;}; /* the sentence that holds the quote, split on . ! ? ; before cecN (W2 6967) */
 const __occ=(pre,x)=>{const o=[];for(const r of [1,2,3,4]){const t=F[CEC_RK[pre+r]];if(typeof t!=='string')continue;for(const l of t.split(/\r?\n/)){const nl=cecN(l);if(nl.indexOf(x)<0)continue;const ml=cecN(l.replace(/([.!?;]["”’')\]]*)\s+/g,'$1 qqsbqq ')).split(' ');let k=nl.indexOf(x);while(k>=0){o.push({r:pre+r,p:__sp(nl,ml,k)});k=nl.indexOf(x,k+1);}}}return o;};
 rows.forEach(row=>{if(row.status!=='CONFIRMED'||!row.side)return;const x=cecN(String(row.earlier_q||'').split(/\.\.\.|…/)[0]);if(!x||x.length<__OSW_FLOOR)return; /* fail-safe: empty or short quote */
  const P=CEC_PRE[row.side],O=P==='CR'?'DR':'CR',me=__nm[row.side],them=row.side==='DEFENDER'?'challenger':'defender';
  const mine=__occ(P,x),theirs=__occ(O,x);if(!mine.length||!theirs.length)return; /* found nowhere in one side: no change */
  const tagMe=new RegExp('\\bmeans\\s+'+P.toLowerCase()+'\\d\\b');
  const theirsOwn=theirs.filter(o=>!((__lab(o.p)&&tagMe.test(o.p))||__own(o.p,me)));if(!theirsOwn.length)return; /* the other side only quotes it: no change */
  if(!mine.every(o=>__lab(o.p)||__own(o.p,them)))return; /* the flagged side states it as its own somewhere: it stays counted */
  row.status='NOT CONFIRMED (other side\'s words)';row.note=(row.note?row.note+'; ':'')+'the EARLIER quotation is the '+them+'\'s own words ('+[...new Set(theirsOwn.map(o=>o.r))].join(', ')+'), which the '+me+' only quoted under a MEANS label or named as the '+them+'\'s ('+[...new Set(mine.map(o=>o.r))].join(', ')+'); a contradiction needs the side\'s own earlier words (pkgOSW, ASK 325)';});} /* pkgOSW */
`;
n.parameters.jsCode=s0.replace(A,()=>F+A);
new Function('$','$input',n.parameters.jsCode);
fs.writeFileSync(OUT,JSON.stringify(d));console.log('Close Enforcer Record',s0.length,'->',n.parameters.jsCode.length,cr.createHash('sha256').update(n.parameters.jsCode).digest('hex').slice(0,12));
