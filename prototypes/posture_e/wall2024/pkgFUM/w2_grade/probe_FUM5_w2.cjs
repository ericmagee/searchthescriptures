// W2 grade of pkgFUM rev 5: can a kept follow-up card change a K-RUL item that was NOT asked?
// The joined text is kept follow-up lines first, then the first reply; krulCure takes the FIRST card krulMatch accepts.
// Run from wall2024/: node pkgFUM/w2_grade/probe_FUM5_w2.cjs
const fs=require('fs');const s=fs.readFileSync('pkgLIB/strip_FUM/patched/Panel_Cure_Normalize_1.js','utf8');
const grab=n=>{const i=s.indexOf('function '+n+'(');const j=s.indexOf('\nfunction ',i+10);return s.slice(i,j);};
const f=new Function(['krulCards','krulMatch','fumKey2024','fumKeep2024'].map(grab).join('\n')+';return {krulCards,krulMatch,fumKeep2024};')();
const head=(T,id,ctx)=>{const c=f.krulCards(T).find(c=>f.krulMatch(c,id,ctx||null));return c?c.head:null;};
let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
const card=(h,tag)=>[h,'CLAIM: '+tag+' claim.','NAMED BY: "'+tag+' quote of six words here."','RULE: '+tag+' rule.','APPLIED: '+tag+' applied.'].join('\n');
const join=(fu,first,items)=>{const k=f.fumKeep2024(fu,items);return {k,J:(k?k+'\n\n':'')+first};};
// Case 1: asked K-RUL D1 vs C2 (no line). Unasked K-RUL D2 vs C2 has its own card in the first reply.
{const items=[{rule:'K-RUL',side:'JUDGE',link:'D1 vs C2',ruling:'D1 vs C2'}];
 const first=card('RULING: D2 vs C2 -- STANDS','first-reply D2');
 const fu=card('RULING: D1, D2 vs C2 -- DEFENDER LINK BROKEN','follow-up grouped');
 const {k,J}=join(fu,first,items);console.log('  kept:',JSON.stringify(k.split('\n')[0]));
 const before=head(first,'D2 vs C2'),after=head(J,'D2 vs C2');console.log('  unasked D2 vs C2 card: before',JSON.stringify(before),'after',JSON.stringify(after));
 T(before===after,'case 1: a grouped card "D1, D2 vs C2" for the asked D1 vs C2 does not replace the unasked D2 vs C2 card');}
// Case 2: asked K-RUL D3 vs C1. Unasked K-RUL keystone has its own card in the first reply. Follow-up names the keystone in its RULING line.
{const items=[{rule:'K-RUL',side:'JUDGE',link:'D3 vs C1',ruling:'D3 vs C1'}];
 const first=card('RULING: keystone -- STANDS','first-reply keystone');
 const fu=card('RULING: keystone D3 vs C1 -- CHALLENGER LINK BROKEN','follow-up');
 const {k,J}=join(fu,first,items);console.log('  kept:',JSON.stringify(k.split('\n')[0]));
 const before=head(first,'keystone'),after=head(J,'keystone');console.log('  unasked keystone card: before',JSON.stringify(before),'after',JSON.stringify(after));
 T(before===after,'case 2: a card "keystone D3 vs C1" for the asked D3 vs C1 does not replace the unasked keystone card');}
// Case 3 (control): asked D1 vs C2, follow-up card names only D1 vs C2: unasked D2 vs C2 keeps its own card.
{const items=[{rule:'K-RUL',side:'JUDGE',link:'D1 vs C2',ruling:'D1 vs C2'}];
 const first=card('RULING: D2 vs C2 -- STANDS','first-reply D2');const {J}=join(card('RULING: D1 vs C2 -- STANDS','fu'),first,items);
 T(head(J,'D2 vs C2')===head(first,'D2 vs C2'),'case 3 (control): a card naming only the asked pair leaves D2 vs C2 alone');}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
