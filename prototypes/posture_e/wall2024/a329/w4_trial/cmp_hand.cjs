const m=require('./map116.json');const E={};
const set=(l,c)=>l.forEach(n=>E[n]=c);
set([6,7,9,10,11,13,14,15,16,20,21,22,23,24,25,27,28,29,34,35,36,37,41,43,44,49,50,52,56,57,58],'A');
set([1,4,33,39,42,47,53],'B');set([54],"B'");set([3,5,17,26,30,31,32,38,40,45,46],'C1');set([2,8,12,18,19,48,51,55],'C2');
for(let n=59;n<=116;n++)E[n]='A';set([74,113],'B');set([107,112],'B(ruling)');
set([66,75,81,84,92,101,103,105],'C-bare');set([78,79,86,88],'C-quote');set([70],'C-not');set([63,65,71,77],'C-pipe');set([97,98,108],'C-footing');
const T6988={};[3,5,6,9,11,13,14,16,17,22,38,41,61,63,65,71,73,77,29,34].forEach(n=>T6988[n]='COUNTED');[21,33,53,74,56,58,94].forEach(n=>T6988[n]='NOT COUNTED'); /* Wall 6988 expected */
const want0=c=>/^A|^B/.test(c)&&c!=="B'"?'NOT COUNTED':(c==="C2"||c==="C-quote"||c==="C-not"||c==="B'")?'COUNTED|REVIEW':'COUNTED';
const fin=o=>/^\(today/.test(o.trial)?o.today:o.trial;
const bad=[],tally={};
const want=(c,n)=>T6988[n]||want0(c);
for(const o of m){const c=E[o.n]+(T6988[o.n]?'>6988':''),w=want(E[o.n],o.n),f=fin(o);const ok=w.split('|').includes(f)||(w==='NOT COUNTED'&&f==='NUMBERING PAIR');tally[ok?'agree':'differ']=(tally[ok?'agree':'differ']||0)+1;
 if(!ok)bad.push(`${o.n} ${o.num} hand=${c} today=${o.today} trial=${f} bind=${o.binding||'-'} | ${(o.why||'').slice(0,90)}`);}
console.log(tally);console.log(bad.join('\n'));
