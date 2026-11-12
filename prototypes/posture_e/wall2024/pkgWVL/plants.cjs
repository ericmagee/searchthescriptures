// pkgWVL plants (W1). node plants.cjs <fn.js> ; expected: Y = a candidate names the verse, N = no candidate
const fs=require('fs');const g={};new Function('g',fs.readFileSync(process.argv[2],'utf8').replace('const cecWvr','g.f'))(g);
const P=[
['P1 row after withdrawal (35856 form)','Y','I hold only that Ezra 2:61 shows the usage, and I do not rest the case on it.','**ANSWER: Hebrews 7:14 -- D3 --**\n- [L3] Luke 2:4 and Ezra 2:61: "which took a wife"'],
['P2 "[L4] On" argument row','Y','I drop Galatians 4:4 as load-bearing.','## D4\n- [L4] On Matthew 1:22 and Galatians 4:4: "all this" takes in the conception.'],
['P3 row that refuses the verse','N','I drop Galatians 4:4 as load-bearing.','## D4\n- [L3] Galatians 4:4: I do not rest on it.'],
['P4 row naming the opponent\'s link only','N','I drop Galatians 4:4 as load-bearing.','## C4\n- [L3] Galatians 4:4: the challenger says C4 stands on this.'],
['P5 same numbers, other book','N','I drop Galatians 4:4 as load-bearing.','## D4\n- [L3] Ephesians 4:4: "one body"'],
['P6 duplicate of a "stands on" candidate (cap not spent)','Y1','I drop Galatians 4:4 as load-bearing.','## D4\n- [L3] Galatians 4:4: "made of a woman"\nLink 4 stands on [L3] Galatians 4:4.'],
['P7 scoped withdrawal, row of another link','Y','I withdraw Galatians 4:4 as an exclusion witness for D5.','## D2\n- [L3] Galatians 4:4: "made of a woman"'],
['P8 withdrawal only "rest no weight on it" (verbs option)','V','It shows the reckoning (Ezra 2:61). I rest no weight on it.','## D3\n- [L3] Ezra 2:61: "called after their name"'],
['P9 row with no withdrawal','N','Ezra 2:61 shows the usage.','## D3\n- [L3] Ezra 2:61: "called after their name"'],
['P10 verse cited in row body, not the row head','N','I drop Galatians 4:4 as load-bearing.','## D4\n- [L4] The text sends the Son (Galatians 4:4).'],
];
for(const [nm,exp,e,c] of P){const F={t:'ODV1-00000-plant',cr2:e,cr3:'',cr4:c,gr2:'',dr3:'',dr4:''};const o=g.f(F,[]);const n=o.length;
 console.log(nm,'| expected',exp,'| got',n,o.map(x=>'LINK '+x.n+' '+JSON.stringify(x.closing_q.slice(0,50))).join(' ; '));}
