// pkgKDN rev 2 unit cases: kwLines421 old (live s184) vs new (target). usage: node unit.cjs <live json> <target json>
const {load}=require(__dirname+'/kwload.cjs');const [, , fl, ft]=process.argv;const OLD=load(fl),NEW=load(ft);
let pass=0,fail=0;const K=(f,R)=>f('',R).items.filter(i=>i.rule==='K-W').map(i=>i.line);
const t=(name,R,wantOld,wantNew)=>{const a=K(OLD,R),b=K(NEW,R);const ok=JSON.stringify(a)===JSON.stringify(wantOld)&&JSON.stringify(b)===JSON.stringify(wantNew);ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+name+' -> old '+JSON.stringify(a)+' new '+JSON.stringify(b));};
const C4='DEFENDER (standard reading) -- ROUND 4, CLOSE ROUND\n\n## Answers on D6\n\n';const q=s=>'"'+s+'"';
t('36677 sentence is put to the judge', {CR4:C4+'Romans 1:3 is granted as to the flesh. I do not rest on the route through the woman. The promise stands on its own words.'}, [], ['[CR4] no link heading: '+q('I do not rest on the route through the woman.')]);
t('under a LINK heading the label is the link', {CR3:'LINK 6: SUPPORTED -- footing.\nThe flesh is granted. I do not rest on Galatians 4:4 alone.'}, [], ['[CR3] LINK 6: '+q('I do not rest on Galatians 4:4 alone.')]);
t('a modifier word is allowed (I still do not rest)', {CR4:C4+'The row is read. I still do not rest on the route through the woman.'}, [], ['[CR4] no link heading: '+q('I still do not rest on the route through the woman.')]);
t('"do not restate" is not the verb', {CR4:C4+'I do not restate the link here.'}, [], []);
const NL=['[CR4] no link heading: '+q('I no longer rest on Luke 3:23.')];t('"I no longer rest" unchanged', {CR4:C4+'I no longer rest on Luke 3:23.'}, NL, NL);
t('heading line "## What I do not rest on" is not an item', {CR4:C4+'## What I do not rest on\n\nThe challenger reads the verse plainly.'}, [], []);
const G=['[CR4] no link heading: '+q('I grant Romans 1:3 as to the flesh.')];
// LIMIT, recorded not fixed: the pkgKWH heading guard needs the verb to end the heading, so "...what I do not rest on:" is not caught
// (nor was "...what I no longer rest on:" before). No stored round has this shape (full-population replay: 0 "what I" items).
t('LIMIT: heading-shaped "What I grant and what I do not rest on:" is not caught by the heading guard', {CR4:C4+'What I grant and what I do not rest on:\nI grant Romans 1:3 as to the flesh.'}, ['[CR4] no link heading: '+q('I grant and what I do not rest on:')].concat(G), ['[CR4] no link heading: '+q('I grant and what I do not rest on:'),'[CR4] no link heading: '+q('I do not rest on:')].concat(G));
t('"on it" is led by the previous sentence', {CR3:'LINK 6: SUPPORTED -- footing.\nRomans 1:3 is granted as to the flesh. I do not rest on it.'}, [], ['[CR3] LINK 6: '+q('Romans 1:3 is granted as to the flesh. I do not rest on it.')]);
t('"on it" inside a started sentence takes that start', {CR4:C4+'As for Galatians 4:4, I do not rest D6 on it.'}, [], ['[CR4] no link heading: '+q('As for Galatians 4:4, I do not rest D6 on it.')]);
t('fronted object ("..., I do not rest on.") takes the sentence start', {CR2:'Luke 1:36 and Luke 1:5, I do not rest on.'}, [], ['[CR2] no link heading: '+q('Luke 1:36 and Luke 1:5, I do not rest on.')]);
t('a named object is not led by anything', {CR4:C4+'The verse is granted. I do not rest D1 on John 1:13.'}, [], ['[CR4] no link heading: '+q('I do not rest D1 on John 1:13.')]);
const CO=['[CR4] no link heading: '+q('The row reads plainly. I concede it.')];t('older verbs unchanged ("I concede it.")', {CR4:C4+'The row reads plainly. I concede it.'}, CO, CO);
t('the other side (challenger DR4)', {DR4:'CHALLENGER -- ROUND 4\n\nI do not rest on the passive.'}, [], ['[DR4] no link heading: '+q('I do not rest on the passive.')]);
console.log('\n'+pass+' pass, '+fail+' fail');process.exit(fail?1:0);
