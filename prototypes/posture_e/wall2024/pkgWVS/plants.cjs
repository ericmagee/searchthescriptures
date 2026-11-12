// pkgWVS plants (W1). node pkgWVS/plants.cjs <fn.js>  expected: S = candidate whose note carries the scope sentence with that limit; P = candidate without it; N = no candidate
const fs=require('fs');const g={};new Function('g',fs.readFileSync(process.argv[2],'utf8').replace('const cecWvr','g.f'))(g);
const R='## D2\n- [L3] Galatians 4:4: "made of a woman"';
const P=[
['S1 32924 form "as load-bearing for the exclusion"','S:for the exclusion','I withdraw Genesis 3:15 and Galatians 4:4 as load-bearing for the exclusion. Link 4 stands on Isaiah 7:14.',R],
['S2 "for Link 4"','S:for Link 4','I withdraw Galatians 4:4 for Link 4.',R],
['S3 "from D1"','S:from D1','I withdraw Galatians 4:4 from D1.',R],
['S4 "as a witness for the exclusion of a father"','S:for the exclusion of a father','I withdraw Galatians 4:4 as a witness for the exclusion of a father.',R],
['S5 "in the exclusion argument"','S:in the exclusion argument','I drop Galatians 4:4 in the exclusion argument.',R],
['P1 no limit','P','I withdraw Galatians 4:4.',R],
['P2 "as load-bearing" (ruled: a lesser weight is still a rest)','P','I withdraw Galatians 4:4 as load-bearing.',R],
['S6 "as an exclusion witness" (35379 form; a named use under ASK 144-2)','S:exclusion witness','I withdraw Galatians 4:4 as an exclusion witness.',R],
['P4 limit in the next sentence is not read','P','I withdraw Galatians 4:4. For the exclusion I rest on Isaiah 7:14.',R],
['P5 "it" form keeps no limit (not read)','P','Galatians 4:4 says made of a woman. I withdraw it for the exclusion.',R],
['P6 "as an independent proof" is a weight, not a use','P','I withdraw Galatians 4:4 as an independent proof.',R],
['N1 "alone" stays a partial (not named, as before)','N','I withdraw Galatians 4:4 alone.',R],
];
let ok=0;for(const [nm,exp,e,c] of P){const o=g.f({t:'ODV1-00000-plant',cr2:e,cr3:'',cr4:c,gr2:'',dr3:'',dr4:''},[]);const m=o[0]&&o[0].why.match(/limits the withdrawal to "([^"]*)"/);
 const got=!o.length?'N':m?'S:'+m[1]:'P';const pass=got===exp;ok+=pass;console.log((pass?'PASS ':'FAIL ')+nm+' | expected '+exp+' | got '+got);}
console.log(ok+'/'+P.length);
