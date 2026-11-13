// pkgKDN rev 3 unit cases: kwLines421 old (live s184) vs new (rev 3 target). usage: node unit_rev3.cjs <live json> <target json>
const {load}=require(__dirname+'/kwload.cjs');const [, , fl, ft]=process.argv;const OLD=load(fl),NEW=load(ft);
let pass=0,fail=0;const K=(f,R)=>f('',R).items.filter(i=>i.rule==='K-W').map(i=>i.line);
const t=(name,R,wantOld,wantNew)=>{const a=K(OLD,R),b=K(NEW,R);const ok=JSON.stringify(a)===JSON.stringify(wantOld)&&JSON.stringify(b)===JSON.stringify(wantNew);ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+name+' -> old '+JSON.stringify(a)+' new '+JSON.stringify(b));};
const C4='DEFENDER (standard reading) -- ROUND 4, CLOSE ROUND\n\n## Answers on D6\n\n';const q=s=>'"'+s+'"';const nh=(r,s)=>'['+r+'] no link heading: '+q(s);
// scope: closing rounds only
t('36677 closing sentence is put to the judge', {CR4:C4+'Romans 1:3 is granted as to the flesh. I do not rest on the route through the woman. The promise stands on its own words.'}, [], [nh('CR4','I do not rest on the route through the woman.')]);
t('challenger closing round DR4', {DR4:'CHALLENGER -- ROUND 4\n\nI do not rest on the passive.'}, [], [nh('DR4','I do not rest on the passive.')]);
t('scope: CR3 link-round footing is not an item', {CR3:'LINK 6: SUPPORTED -- footing.\nThe flesh is granted. I do not rest on Galatians 4:4 alone.'}, [], []);
t('scope: CR2 is not an item', {CR2:'I do not rest the exclusion of a father on ek alone.'}, [], []);
t('scope: DR2 and DR3 are not items', {DR2:'I do not rest on the present tense alone.',DR3:'I do not rest C2 on it.'}, [], []);
const NL3=['[CR3] LINK 6: '+q('I no longer rest on Luke 3:23.')];t('scope: the old verb in CR3 is unchanged', {CR3:'LINK 6: SUPPORTED -- footing.\nI no longer rest on Luke 3:23.'}, NL3, NL3);
const NL=[nh('CR4','I no longer rest on Luke 3:23.')];t('"I no longer rest" unchanged', {CR4:C4+'I no longer rest on Luke 3:23.'}, NL, NL);
t('"do not restate" is not the verb', {CR4:C4+'I do not restate the link here.'}, [], []);
t('a modifier word is allowed (I still do not rest)', {CR4:C4+'The row is read. I still do not rest on the route through the woman.'}, [], [nh('CR4','I still do not rest on the route through the woman.')]);
t('heading line "## What I do not rest on" is not an item', {CR4:C4+'## What I do not rest on\n\nThe challenger reads the verse plainly.'}, [], []);
// rev 2 lead-in, kept
t('"on it" is led by the previous sentence', {CR4:C4+'Romans 1:3 is granted as to the flesh. I do not rest on it.'}, [], [nh('CR4','Romans 1:3 is granted as to the flesh. I do not rest on it.')]);
t('"on it" inside a started sentence takes that start', {CR4:C4+'As for Galatians 4:4, I do not rest D6 on it.'}, [], [nh('CR4','As for Galatians 4:4, I do not rest D6 on it.')]);
t('fronted object takes the sentence start', {CR4:C4+'Luke 1:36 and Luke 1:5, I do not rest on.'}, [], [nh('CR4','Luke 1:36 and Luke 1:5, I do not rest on.')]);
t('a named object is not led by anything', {CR4:C4+'The verse is granted. I do not rest D1 on John 1:13.'}, [], [nh('CR4','I do not rest D1 on John 1:13.')]);
// (a)
t('(a) nothing before it in the round: followed by the next sentence', {CR4:'I do not rest on it. The promise stands on Isaiah 7:14.'}, [], [nh('CR4','I do not rest on it. The promise stands on Isaiah 7:14.')]);
t('(a) nothing before or after: stays bare, still an item', {CR4:'I do not rest on it.'}, [], [nh('CR4','I do not rest on it.')]);
// (b)
const GJ=['[CR4] D6: '+q('I grant ‘Joseph her husband,’ and I do not rest D6 on denying it.')];
t('(b) inside a grant sentence already quoted: one item, as live', {CR4:C4+'D6: answered.\nI grant "Joseph her husband," and I do not rest D6 on denying it.'}, GJ, GJ);
t('(b) two in one sentence: one item', {CR4:C4+'I do not rest on Luke 3:23, and I do not rest on Luke 1:36.'}, [], [nh('CR4','I do not rest on Luke 3:23, and I do not rest on Luke 1:36.')]);
t('(b) two sentences: two items', {CR4:C4+'I do not rest on Luke 3:23. I do not rest on Luke 1:36.'}, [], [nh('CR4','I do not rest on Luke 3:23.'),nh('CR4','I do not rest on Luke 1:36.')]);
const G10=Array.from({length:10},(_,i)=>'I grant row '+(i+1)+' reads plainly.').join(' ');
t('(b) a grant past the cap of 10 is no item, so its "do not rest" still is', {CR4:C4+G10+' I grant row 11 reads plainly, and I do not rest on row 11.'}, Array.from({length:10},(_,i)=>nh('CR4','I grant row '+(i+1)+' reads plainly.')), Array.from({length:10},(_,i)=>nh('CR4','I grant row '+(i+1)+' reads plainly.')).concat([nh('CR4','I do not rest on row 11.')]));
// (c)
t('(c) a stop inside a quotation does not split the lead-in (stored 1cd2f5ce)', {CR4:C4+'D3: answered.\n- [L3] The challenger answers with Jeremiah 22:24. The sentence is written on "this man ... in his days". I do not rest D3 on it.'}, [], ['[CR4] D3: '+q('The sentence is written on ‘this man ... in his days’. I do not rest D3 on it.')]);
t('(c) curly quotation too', {CR4:C4+'The verse says “behold. a virgin” of the sign. I do not rest on it.'}, [], [nh('CR4','The verse says ‘behold. a virgin’ of the sign. I do not rest on it.')]);
// (d)
const G=[nh('CR4','I grant Romans 1:3 as to the flesh.')];
t('(d) heading "What I grant and what I do not rest on:" adds no item', {CR4:C4+'What I grant and what I do not rest on:\nI grant Romans 1:3 as to the flesh.'}, [nh('CR4','I grant and what I do not rest on:')].concat(G), G);
t('(d) the same with the old verb', {CR4:C4+'What I grant and what I no longer rest on:\nI grant Romans 1:3 as to the flesh.'}, [nh('CR4','I grant and what I no longer rest on:'),nh('CR4','I no longer rest on:')].concat(G), G);
const CO=[nh('CR4','The row reads plainly. I concede it.')];t('older verbs unchanged ("I concede it.")', {CR4:C4+'The row reads plainly. I concede it.'}, CO, CO);
console.log('\n'+pass+' pass, '+fail+' fail');process.exit(fail?1:0);
