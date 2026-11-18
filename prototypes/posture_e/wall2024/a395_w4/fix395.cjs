// ASK 395 item 6.2: one fixture per difference, through text I and text L (library blocks), plus the mid-line PRESSED case (W3 8205 note)
const T=require('../tools/lib.cjs');const w=require('../a397/t397.json');const U=T.unpack(w);const L=U.L;
const idx=k=>Array.isArray(k)?Array.from({length:k[1]-k[0]+1},(_,j)=>k[0]+j):[k];
const mk=P=>new Function(P.flatMap(idx).map(i=>L[i]).join('\n')+';return __RL;')();
const I=mk([[240,285],2635,[287,288],[290,309],2636,[312,318],2637,[320,328]]),Lr=mk([[240,328]]);
const FX=['RETRACTED: K-V D2 vs C1 -- the press is withdrawn','RESTATED: C1 vs D2 (Luke 1:35): STANDS','PRESSED: D1 vs C2 | [CR3] | "the power of the Highest shall overshadow thee"','SHORT: D1 vs C2 | [DR3] | "made of the seed of David" | the quote stops before the words that answer',
 'D2 vs C2 (Luke 3:23): STANDS -- PRESSED: D2 vs C2 | [DR2] | "as was supposed"'];
const sh=r=>JSON.stringify(r&&{form:r.form,code:r.code||null,kind:r.f&&r.f.kind,pair:r.f&&r.f.pair,round:r.f&&r.f.round,grade:r.f&&r.f.grade,restated:r.f&&r.f.restated,why:r.f&&r.f.why,text:r.f&&r.f.text&&!r.f.pair?'text only':undefined});
for(const l of FX){const a=sh(I.readLine(l)),b=sh(Lr.readLine(l));console.log((a===b?'SAME ':'DIFF ')+l.slice(0,60)+'\n   text I: '+a+'\n   text L: '+b);}
