// W2 grade plants for pkgWVS (+ pkgWVL rev 2), ASK 144 option 2: a withdrawal "for" a named use covers only that use.
// Runs cecWvr from Close Enforcer Build of each file given. Prints candidates and whether the scope sentence is attached, with its limit.
// Usage: node plants.cjs <file.json> [file2.json ...]
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const fnOf=f=>{const s=g(f).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;const i=s.indexOf('const cecWvr=');const j=s.indexOf('\nconst ',i+10);return new Function(s.slice(i,j)+'\nreturn cecWvr;')();};
const F=(o)=>Object.assign({cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''},o);
const D2=v=>'**ANSWER: Romans 1:4 -- D2 --**\n- [L3] '+v+': "God sent forth his Son, made of a woman."\n- [L4] The Son is already "his Son" before he is "made of a woman" ('+v+').';
const D4=v=>'## D4\n'+v+' is the third layer of D4.';
const P=[
 ['S1 32924 form, close link 2 (other purpose)',F({cr2:'I withdraw Genesis 3:15 and Galatians 4:4 as load-bearing for the exclusion. Link 4 stands on Isaiah 7:14.',cr4:D2('Galatians 4:4')}),'scope'],
 ['S2 32924 form, close link 4 (the given-up purpose)',F({cr2:'I withdraw Genesis 3:15 and Galatians 4:4 as load-bearing for the exclusion. Link 4 stands on Isaiah 7:14.',cr4:D4('Galatians 4:4')}),'scope (enforcer decides)'],
 ['S3 35379 ruled form, no "for" limit',F({cr2:'I withdraw Galatians 4:4 as an exclusion witness.',cr4:D4('Galatians 4:4')}),'no scope'],
 ['S4 whole withdrawal',F({cr2:'I withdraw Galatians 4:4.',cr4:D4('Galatians 4:4')}),'no scope'],
 ['S5 "from D4", close D2',F({cr2:'I withdraw Galatians 4:4 from D4.',cr4:D2('Galatians 4:4')}),'scope'],
 ['S6 "for now" (time, not a purpose)',F({cr2:'I withdraw Galatians 4:4 for now.',cr4:D4('Galatians 4:4')}),'no scope (watch)'],
 ['S7 "for" as because',F({cr2:'I withdraw Galatians 4:4, for it is said of all men.',cr4:D4('Galatians 4:4')}),'no scope (watch)'],
 ['S8 "in this round" (time)',F({cr2:'I withdraw Galatians 4:4 in this round.',cr4:D4('Galatians 4:4')}),'no scope (watch)'],
 ['S9 rest form with "for"',F({cr2:'I do not rest on Galatians 4:4 for the exclusion of a father.',cr4:D2('Galatians 4:4')}),'scope'],
 ['S10 mixed: one limited, one whole',F({cr2:'I withdraw Galatians 4:4 for the exclusion; I withdraw Genesis 3:15 entirely.',cr4:D2('Galatians 4:4')+'\n'+D2('Genesis 3:15')}),'scope on Gal 4:4 only'],
 ['S11 quote marks inside the limit',F({cr2:'I withdraw Galatians 4:4 for "the exclusion" of a father.',cr4:D2('Galatians 4:4')}),'scope, quotes safe'],
 ['S12 challenger side',F({dr3:'I withdraw Luke 3:23 as load-bearing for the begetting.',dr4:'**ANSWER: Luke 3:23 -- C2 --**\n- [L3] Luke 3:23: "as was supposed".'}),'scope'],
 ['S13 "as load-bearing" with no "for"',F({cr2:'I withdraw Galatians 4:4 as load-bearing.',cr4:D2('Galatians 4:4')}),'no scope (ruled: lesser weight still a rest)'],
 ['S14 limit to a link number',F({cr2:'I withdraw Galatians 4:4 from Link 4.',cr4:D2('Galatians 4:4')}),'scope'],
];
for(const f of process.argv.slice(2)){const fn=fnOf(f);console.log('#### '+f.split('/').pop());
 for(const [nm,Fi,exp] of P){let o;try{o=fn(Fi,[]);}catch(e){console.log('THROW',nm,e.message);continue;}
  const sc=o.map(c=>{const t=JSON.stringify(c);const k=(t.match(/limited the withdrawal to a named use/g)||[]).length;const m=t.match(/limits the withdrawal to \\"([^\\]*)\\"/);return c.side[0]+' LINK '+c.n+(m?' [scope: '+m[1]+']':'')+(k?' [fixed sentence x'+k+']':'');});
  console.log(nm+' | expect '+exp+' | got '+(sc.join('; ')||'none'));}}
