const fs=require('fs');eval(fs.readFileSync(__dirname+'/wvr_fn.js','utf8').replace('const cecWvr','globalThis.cecWvr'));
const E={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};const f=o=>Object.assign({},E,o);
const P=[
['withdraw then layer of D6',f({cr2:'I withdraw Galatians 4:4 as an exclusion witness.',cr4:'**ANSWER: Luke 1:35 -- D6 --** "x"\n**Galatians 4:4 -- D6.** "made of a woman" is the third layer of D6, beside Luke 3:23.'}),1],
['drop the route then stands on',f({cr3:'I drop the Ezra 2:61 route, since Ezra 2:62 puts them out.',cr4:'ANSWER: Numbers 1:18 -- D4 -- "x"\n- [L4] This stands on [L1] Numbers 1:18 and [L3] Ezra 2:61.'}),1],
['partial drop (by themselves) skipped',f({cr3:'I drop Romans 1:3 together with John 3:6 as sufficient by themselves.',cr4:'This stands on Romans 1:3, Galatians 4:4 and Matthew 1:20.'}),0],
['drop the claim that skipped',f({cr3:'I drop the claim that Matthew 1:25 closes the espousal.',cr4:'This stands on Matthew 1:25 and Matthew 1:18.'}),0],
['close negated skipped',f({cr2:'I do not rest the source on Galatians 4:4.',cr4:'I do not rest D6 on Galatians 4:4; it stands on Luke 1:35.'}),0],
['close "carries" not a footing word',f({cr2:'I do not rest the source on Galatians 4:4.',cr4:'Mary\'s descent carries it, as Romans 1:3 and Galatians 4:4 together say.'}),0],
['verse only answered, no footing word',f({cr2:'I withdraw Galatians 4:4.',cr4:'ANSWER: Galatians 4:4 -- D6 -- "made of a woman" is said of men with fathers too.'}),0],
['different verse not paired',f({cr2:'I withdraw Galatians 4:4.',cr4:'This stands on Galatians 4:5.'}),0],
['chapter-verse prefix not matched (4:40)',f({cr2:'I withdraw Galatians 4:4.',cr4:'This stands on Galatians 4:40.'}),0],
['challenger side',f({dr3:'I withdraw Jeremiah 22:30 as a bar.',dr4:'C3 rests on Jeremiah 22:30 and Matthew 1:12.'}),1],
['defender verse not taken for challenger',f({cr2:'I withdraw Jeremiah 22:30.',dr4:'C3 rests on Jeremiah 22:30.'}),0],
['already named pair skipped',f({cr2:'I withdraw Galatians 4:4.',cr4:'This stands on Galatians 4:4.'}),0,[{id:'X1',earlier_q:'I withdraw Galatians 4:4.',closing_q:'This stands on Galatians 4:4.'}]],
['cap 3 per side',f({cr2:'I withdraw Luke 1:1. I withdraw Luke 1:2. I withdraw Luke 1:3. I withdraw Luke 1:4.',cr4:'This stands on Luke 1:1. This stands on Luke 1:2. This stands on Luke 1:3. This stands on Luke 1:4.'}),3],
['ids continue after prev',f({cr2:'I withdraw Galatians 4:4.',cr4:'This stands on Galatians 4:4.'}),1,[{id:'X4',earlier_q:'a',closing_q:'b'}],o=>o[0].id==='X5'],
];let ok=0;for(const [n,F,want,prev,chk] of P){const o=cecWvr(F,prev||[]);const p=o.length===want&&(!chk||chk(o));if(p)ok++;console.log(p?'OK ':'BAD',n,o.length,o.map(c=>c.side+' L'+c.n).join(','));}console.log(ok+'/'+P.length);
