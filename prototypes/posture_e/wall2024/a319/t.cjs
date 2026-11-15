// ASK 319 test: parse every rebuilt user node; replay pwf + pwc3 + the E-ANS cure path on 40025 and controls (fit() stubbed: COUNTED when an [L1] tag still stands before a reference with a quote).
const fs=require('fs');const ld=f=>{const W=JSON.parse(fs.readFileSync(f));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return {L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};};
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
let p=0,t=0;const ok=(nm,c)=>{t++;if(c)p++;console.log((c?'PASS ':'FAIL ')+nm);};
const NEW=ld(process.argv[2]),OLD=ld(process.argv[3]);
for(const k of ['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record']){const s=rb(NEW.L,NEW.M[k]);let e=null;try{new (Object.getPrototypeOf(async function(){}).constructor)('$','$input','items',s);}catch(x){e=x.message;}ok('parse '+k+' ('+s.length+')',!e);if(e)console.log(e);}
const pre=L=>{const g=L.join('\n');const pick=re=>{const m=g.match(re);if(!m)throw new Error('miss '+re);return m[0];};return pick(/ const N=s=>String\(s==null\?'':s\)\.replace\(\/\\\\\+"\/g,'"'\);/)+pick(/ const AQ=\/ANSWER:[^\n]*?\$\/i;/);};
const fn=(L)=>{const s=L[2532];const a=s.indexOf('function pwf');const b=s.indexOf(' function cure(it,a,ctx){');return s.slice(a,b);};
const fitS=t=>/\[L1\]\s*(?:[1-3] )?[A-Z][a-z]+ \d{1,3}:\d{1,3}[^\[]*?["“]/.test(t)?'COUNTED':'NONE';
const mk=(L,nw)=>new Function('fit',pre(L)+fn(L)+';return (to,a,it)=>{const m=to.match(AQ);const f=fit(m?(m[1]+" || "+(m[3]||"")):to);if(f!=="COUNTED")return "UNCURED no fit";const g=pwf(to,a);if(g===null||fit(g)==="COUNTED"){'+(nw?'const c3=pwc3(to,it);if(c3)return "UNCURED "+c3;':'')+'return "CURED";}return "UNCURED pwf";};')(fitS);
const cN=mk(NEW.L,1),cO=mk(OLD.L,0);
const A='ANSWER CHECK: Luke 2:48 -- [CR4] -- MEANS: "Mary herself names Joseph the child\'s father." -- ANSWER: "The row is Mary\'s speech, and the answer at 2:49 places \'my Father\'s business\' against it." -- MEETS -- ';
const why='CR4 quotes Mary\'s "thy father and I have sought thee sorrowing" and expressly identifies it as "Mary\'s speech," positively retaining the meaning pressed.';
const it={rule:'E-ANS',item:'ANSWER CHECK Luke 2:48 [CR4]'};
const B40025='[L1] Luke 2:48 "his mother said unto him" and "thy father and I have sought thee sorrowing" positively establish the maternal designation that the answer accepts, while [L3] Luke 2:49 "my Father\'s business" supplies its distinction between the fatherhoods (Commitment 3).';
const cases=[
 ['40025 stored line: live UNCURED (pwf), rev 2 CURED',A+B40025,why,'UNCURED pwf','CURED'],
 ['40025 without the [L3] Luke 2:49 layer: rev 2 UNCURED (condition 3)',A+'[L1] Luke 2:48 "his mother said unto him" and "thy father and I have sought thee sorrowing" positively establish the maternal designation.',why,'UNCURED pwf','UNCURED c3'],
 ['40025 with a reason quoting nothing: neither quote owned, still UNCURED (pwf)',A+B40025,'The answer is fine.','UNCURED pwf','UNCURED pwf'],
 ['ANSWER naming no verse, only the pressed verse cited: live CURED, rev 2 UNCURED (condition 3)',A.replace('at 2:49','that follows')+'[L1] Luke 2:48 "thy father and I have sought thee sorrowing" establishes it.',why,'CURED','UNCURED c3'],
 ['ANSWER naming no verse, another verse carries the fit: CURED both',A.replace('at 2:49','that follows')+'[L1] Luke 2:48 "thy father and I have sought thee sorrowing" and [L3] Luke 2:49 "my Father\'s business" establish it.',why,'CURED','CURED'],
 ['Fit carried by [L1] Luke 2:49 the ANSWER names, pressed verse absent: CURED both',A+'[L1] Luke 2:49 "my Father\'s business" supplies the distinction.',why,'CURED','CURED'],
 ['Range Luke 2:48-49 at [L1]: not the pressed verse alone, CURED both',A+'[L1] Luke 2:48-49 "thy father and I have sought thee sorrowing" and "my Father\'s business".',why,'CURED','CURED'],
 ['Another verse only at [L4]-style untagged mention: condition 3 holds (UNCURED)',A.replace('at 2:49','that follows')+'[L1] Luke 2:48 "thy father and I have sought thee sorrowing" establishes it; compare Luke 2:49 later.',why,'CURED','UNCURED c3'],
];
for(const [nm,to,w,eo,en] of cases){const o=cO(to,{why:w},it),n=cN(to,{why:w},it);ok(nm+' | live: '+o.slice(0,40)+' | rev2: '+n.slice(0,40),o.startsWith(eo)&&(en==='UNCURED c3'?/condition 3/.test(n):n.startsWith(en)));}
console.log(p+' of '+t);
