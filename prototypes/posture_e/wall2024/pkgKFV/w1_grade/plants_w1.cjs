// W1 grade plants for pkgKFV. node pkgKFV/w1_grade/plants_w1.cjs <live> <new>
const fs=require('fs');const fnOf=f=>{const W=JSON.parse(fs.readFileSync(f));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));
 const src=[];for(const nm of ['kkjvFold','__kfLB']){let i=Lb.findIndex(l=>new RegExp('(?:function|const)\\s+'+nm.replace('$','\\$')+'\\b').test(l));src.push(Lb[i]);while(!/^\s*(?:function|const|let)\s/.test(Lb[i+1]||'const')){i++;src.push(Lb[i]);}}
 let i=Lb.findIndex(l=>/^const KFC_REF=/.test(l));src.push(Lb[i]);i=Lb.findIndex(l=>/^function kfcVerse/.test(l));do{src.push(Lb[i]);i++;}while(!/if\(!r\)return null/.test(Lb[i-1]));return new Function(src.join('\n')+'\nreturn kfcVerse;')();};
const [L,K]=process.argv.slice(2,4).map(fnOf);
const P=[
['W1 MEANS words on the second press line; first line has them before MEANS only','the register was refused',
 '- Luke 1:27 the register was refused, "To a virgin" -- MEANS: x -- [L3] Ezra 2:61\n- Ezra 2:62 "therefore were they, as polluted" -- MEANS: the register was refused -- [L3] Ezra 2:61','Ezra 2:62'],
['W2 two MEANS lines both carry the words: first kept','the house is joseph',
 '- Luke 2:4 "of the house" -- MEANS: the house is joseph\n- Luke 3:23 "as was supposed" -- MEANS: the house is joseph','Luke 2:4'],
['W3 lower-case means: on a press line','the sign is bounded',
 '- Isaiah 7:16 "before the child shall know" -- means: the sign is bounded -- [L3] Isaiah 8:4','Isaiah 7:16'],
['W4 words only before MEANS on every line: old first-line path','the virgin is mary',
 'Prose: Luke 1:27 shows the virgin is mary.\n- Matthew 1:23 "a virgin" -- MEANS: other words','Luke 1:27'],
['W5 bold markup around MEANS','the line is carried in the loins',
 '- **Hebrews 7:10** "in the loins" -- **MEANS:** the line is carried in the loins -- [L3] Genesis 46:26','Hebrews 7:10'],
['W6 MEANS line names no verse before MEANS: first ref of the line','the seed is joseph',
 '- MEANS: the seed is joseph -- [L3] Romans 1:3','Romans 1:3'],
];
P.push(['W7 LIMIT: words after MEANS on line 1 only inside its [L3] layer','the register was refused','- Luke 1:27 "To a virgin" -- MEANS: x -- [L3] Ezra 2:61, the register was refused\n- Ezra 2:62 "therefore" -- MEANS: the register was refused','Luke 1:27']);
let ok=0;for(const [nm,m,rt,exp] of P){const l=L(m,rt),k=K(m,rt);const got=k&&k.ref;const pass=got===exp;if(pass)ok++;console.log((pass?'OK   ':'FAIL ')+nm+' | live '+(l&&l.ref)+' | new '+got+' | expect '+exp);}
console.log('checks',ok,'of',P.length);
