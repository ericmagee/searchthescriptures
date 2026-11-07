// pkgKWA unit test (includes the pkgKWC cases): (1) the K-W item line from kwLines421 (patched Gate Record) on 33430's [CR2] text and controls; (2) the NOT HELD runs on 33430's reasons.
const fs=require('fs');const src=fs.readFileSync('pkgKWA/patched/Gate_Record.js','utf8');let ok=0,bad=0;const T=(n,p,d)=>{p?ok++:bad++;console.log((p?'OK   ':'FAIL ')+n+(d?' | '+d:''));};
// (1) run only the K-W sentence loop: a copy of kwLines421 with the WALL-2024 add-ons cut off
const i=src.indexOf('function kwLines421(');let f=src.slice(i,src.indexOf('\nfunction ',i+10));f=f.replace(/\n \{const P=wpLines2024[^\n]*/,'');const kw=new Function(f+'\n;return kwLines421;')();
const nw0=s=>String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff]+/g,' ').trim().split(' ').filter(Boolean);
const L=(cr2)=>kw('',{CR2:cr2}).items.map(x=>x.line);
T('33430: "Jesus is of David\'s flesh, which I grant." is flagged whole',JSON.stringify(L("LINK 6: the chain.\nJesus is of David's flesh, which I grant. He is not of Joseph's seed."))===JSON.stringify(['[CR2] LINK 6: "Jesus is of David\'s flesh, which I grant."']),JSON.stringify(L("LINK 6: the chain.\nJesus is of David's flesh, which I grant. He is not of Joseph's seed.")));
const EQ=(n,cr2,want)=>{const g=L(cr2);T(n,JSON.stringify(g)===JSON.stringify(want),JSON.stringify(g));};
EQ('standalone "I grant." takes the antecedent sentence',"LINK 6: x.\nMary is of David. I grant.",['[CR2] LINK 6: "Mary is of David. I grant."']);
EQ('"I grant it." takes the antecedent sentence',"LINK 6: x.\nMary is of David. I grant it. More.",['[CR2] LINK 6: "Mary is of David. I grant it."']);
EQ('"I grant that." takes the antecedent sentence',"LINK 6: x.\nMary is of David. I grant that.",['[CR2] LINK 6: "Mary is of David. I grant that."']);
EQ('antecedent on the previous line',"LINK 6: x.\nMary is of David.\nI grant it.",['[CR2] LINK 6: "Mary is of David. I grant it."']);
{const g=L("**Answers to the presses**\n\n**MEANS [CR3] P5.1: \"the angel gave the name before the conception\"**\n\n- I grant it. [L1] Luke 2:21.");T('33345: antecedent is the quoted press line',g.length===1&&g[0].endsWith('P5.1: "the angel gave the name before the conception" I grant it."'),JSON.stringify(g));}
EQ('no antecedent (heading line before): no item',"## LINK 6: the chain\nI grant it.",[]);
EQ('no antecedent (round start): no item',"I grant it.",[]);
{const a=src.indexOf('const __rn0=');const rn2=new Function(src.slice(a,src.indexOf('/* pkgKWC (2)',a))+'\nreturn r;};return __rn;')();const r=rn2(nw0("Mary is of the house of David. I grant it."));
T('runs of "Mary is of the house of David. I grant it." include 6-word runs of the antecedent alone',r.includes('is of the house of david')&&r.filter(x=>x==='is of the house of david').length===2,JSON.stringify(r));
T('a reason holding only "it" no longer matches',!r.some(x=>' it '.includes(' '+x+' ')));}
T('"I grant that X" is unchanged',JSON.stringify(L("LINK 6: x.\nI grant that two fatherhoods stand together there."))===JSON.stringify(['[CR2] LINK 6: "I grant that two fatherhoods stand together there."']));
T('"I withdraw it from Hebrews 10:5." is unchanged',L("LINK 8: x.\nI withdraw it from Hebrews 10:5. More.")[0]==='[CR2] LINK 8: "I withdraw it from Hebrews 10:5."');
// (2) runs + match as the NOT HELD test does (normalised words, a run must appear in the reason)
const a=src.indexOf('const __rn0=');const rn=new Function(src.slice(a,src.indexOf('/* pkgKWC (2)',a))+'\nreturn r;};return __rn;')();
const nw=s=>String(s||'').toLowerCase().replace(/[‘’“”"'`*_]/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿]+/g,' ').trim().split(' ').filter(Boolean);
const body=nw("Jesus is of David's flesh, which I grant.");const runs=rn(body);const hit=r=>runs.some(x=>(' '+nw(r).join(' ')+' ').includes(' '+x+' '));
T('runs include the granted words "jesus is of davids flesh"',runs.includes('jesus is of davids flesh'),JSON.stringify(runs));
T('33430 sol JUDGE STATEMENT (quotes "Jesus is of David\'s flesh") now quotes it',hit('NOT HELD: "I grant." (CR2) grants the immediately preceding proposition, "Jesus is of David\'s flesh"; it withdraws no footing needed for the no-biological-father conclusion.'));
T('33430 grok reason (quotes only "I grant.") still does not',!hit('NOT HELD: "I grant." states no descent, source, time or person withdrawn from a kept link.'));
console.log(ok+' OK, '+bad+' FAIL');
