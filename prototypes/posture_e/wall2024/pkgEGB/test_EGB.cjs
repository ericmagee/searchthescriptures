// pkgEGB-1 tests: gateAnsGround2024 copied byte for byte (with what it uses) from base and patched Gate Build, on stored E-GATE B flagged lines (debate_enforcer_log).
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');const DIR=process.argv[2]||'pkgEGB/patched';const BDIR=DIR==='pkgEGB/patched'?'pkgEGB/base':DIR+'_base';
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const fn=d=>new Function(closure(fs.readFileSync(d+'/Gate_Build.js','utf8'),['gateAnsGround2024']).text+';return gateAnsGround2024;')();
const B=fn(BDIR),P=fn(DIR);
const X=[
['33149 chatgpt G1 (MEANS NONE)',`ANSWER CHECK: Matthew 1:19 -- [CR3] -- MEANS: NONE -- ANSWER: NONE -- MISSES -- The ledger marks this associated press unproven, not a witness (Commitment 5).
D3 vs C2 (Matthew 1:19): CHALLENGER LINK BROKEN (Commitment 5) -- The proven press was left unanswered -- GROUND: [L1] Matthew 1:19 "not willing to make her a publick example, was minded to put her away privily" | [L3] Deuteronomy 22:24 "because he hath humbled his neighbour's wife"`,0],
['33299 chatgpt G1 (MEANS NONE)',`ANSWER CHECK: Luke 1:27 -- [DR2] -- MEANS: NONE -- ANSWER: NONE -- MISSES (Commitment 5) -- UNPROVEN under premise 4, not a witness there.
D6 vs C6 (Luke 1:27): DEFENDER LINK BROKEN (Commitment 5) -- [CR3] grants Joseph's house but does not address the pressed relationship to Elisabeth -- GROUND: [L1] Luke 1:27 'a man whose name was Joseph, of the house of David' | [L3] Luke 1:5 'his wife was of the daughters of Aaron, and her name was Elisabeth' exhibit the unanswered press.`,0],
['33025 grok G2 (real)',`ANSWER CHECK: Matthew 1:25 -- [CR3] -- MEANS: "till limits the abstinence to the pregnancy after the taking." -- ANSWER: "knew her not till she had brought forth her firstborn son." -- MISSES -- the answer only repeats the verse and shows no fit of its own (Commitment 5).
D5 vs C4 (Matthew 1:20): CHALLENGER LINK BROKEN -- no biological father agrees with a conception of the Holy Ghost and a not-knowing until the birth; the espousal-knowing link does not -- GROUND: [L1] Matthew 1:20 "that which is conceived in her is of the Holy Ghost" [L3] Matthew 1:25 "knew her not till she had brought forth her firstborn son"`,1],
['33311 gemini G13 (real)',`ANSWER CHECK: Matthew 1:18 -- [CR3] -- MEANS: "the finding is dated before the coming together, the taking of verse 24." -- ANSWER: "I grant that the coming together is the taking" -- MISSES (Commitment 7) -- "I grant that the coming together is the taking"
D4 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN -- challenger claims Joseph knew Mary during espousal, directly contradicted by the explicit timeline of scripture (Commitment 3) -- GROUND: [L1] Matthew 1:25 "And knew her not till she had brought forth her firstborn son" | [L2] heōs (G2193, until) | [L3] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost."`,1],
['33083 gemini G1 (shared verse; unchanged)',`ANSWER CHECK: Matthew 1:20 -- [CR4] -- MEANS: "the row that says "of the Holy Ghost" names Joseph and his wife in the same sentence." -- ANSWER: "The challenger reads "son of David" as the fear's cause. But the angel's "for" gives the cause as the Holy Ghost's begetting." -- MISSES (Commitment 3) -- "the angel's "for" gives the cause as the Holy Ghost's begetting"
D2 vs C6 (Matthew 1:20): CHALLENGER LINK BROKEN -- Matthew 1:20 assigns the source of the physical conception in the womb to the Holy Ghost, whereas C6 limits the phrase to spiritual adoption -- GROUND: [L1] Matthew 1:20 "that which is conceived in her is of the Holy Ghost" [L2] gennaō (G1080, to beget) modifies the child in the womb as shown in [L3] Matthew 1:18 "found with child of the Holy Ghost".`,1],
['33006 chatgpt G1 (no MEANS; unchanged)',`ANSWER CHECK: Matthew 1:19 -- [CR3] -- MISSES (Commitment 5)
D2 vs C4 (Matthew 1:19): CHALLENGER LINK BROKEN (Commitment 5) -- Matthew 1:19 says "not willing to make her a publick example, was minded to put her away privily"; Matthew 1:18 says "she was found with child". GROUND: The challenger did not meet the pressed meaning about whose child occasioned the mercy.`,1],
['N1 MEANS quoted "none of" is not NONE',`ANSWER CHECK: Matthew 1:25 -- [CR3] -- MEANS: "none of the knowing before the birth" -- ANSWER: "x" -- MISSES
D5 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN -- GROUND: [L1] Matthew 1:25 "knew her not"`,1],
['N2 MEETS never fires',`ANSWER CHECK: Matthew 1:25 -- [CR3] -- MEANS: NONE -- MEETS
D5 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN -- GROUND: [L1] Matthew 1:25 "knew her not"`,0]];
for(const [n,T,exp] of X){const b=B(T).length,p=P(T).length;
 if(/MEANS NONE/.test(n))t(n+': base raises 1, patched 0',b===1&&p===0,'b='+b+' p='+p);
 else t(n+': base '+b+' = patched '+p+' = '+exp,b===exp&&p===exp,'b='+b+' p='+p);}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
