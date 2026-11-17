// K-V negation guard design test (run 37891 Root 3). Strip negated VOID clauses, then flag only if VOID remains.
const W='(?:[A-Za-z]+\\s+){0,3}';const N='(?:premise|charge|link)s?';
const NEG=new RegExp([
 '\\b(?:not|never)\\s+(?:be\\s+|been\\s+|ruled\\s+)?VOID\\b',
 '\\bno\\s+'+W+N+'(?:\\s+of\\s+the\\s+[A-Za-z]+)?\\s+(?:is|are|was|were|stands?)\\s+(?:ruled\\s+)?VOID\\b',
 '\\bnone\\s+(?:of\\s+(?:the\\s+|them\\s*)'+W+'(?:'+N+'\\s+)?)?(?:is|are|was|were)\\s+(?:ruled\\s+)?VOID\\b',
 '\\b(?:rule|ruled|rules|find|finds|found)\\s+no\\s+'+W+N+'\\s+VOID\\b',
 '\\bneither\\b[^.;:]{0,60}?\\b(?:is|are)\\s+VOID\\b',
 '\\bnothing\\s+(?:is\\s+|was\\s+)?(?:ruled\\s+)?VOID\\b'].map(a=>'(?:'+a+')(?!\\s*,?\\s*(?:except|but|save|besides|other\\s+than)\\b)').join('|'),'gi'); // rev 2 (W2 7385): an exception clause keeps the VOID
const skip=t=>!/\bVOID\b/.test(t.replace(NEG,' '));
const OLD=/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i;
const C=[ // [text, expected: true = skip (no VOID ruling), false = flag]
 ['Premises 1, 2, 3 and 5 are spared; no listed premise is VOID.',true],
 ['no premise is VOID',true],['No defender premise is VOID.',true],['no listed premises are ruled VOID',true],
 ['No premise of the defender is VOID.',true],['None of the listed premises is VOID.',true],['None of them is VOID.',true],
 ['I rule no premise VOID.',true],['Neither premise 2 nor premise 3 is VOID.',true],['Nothing is VOID.',true],
 ['Premise 1 is not VOID.',true],['Premise 4 was never ruled VOID.',true],
 ['Premise 3 is VOID: its quote says only what the verse says; no other premise is VOID.',false],
 ['Premise 2 is VOID because the charge adds never.',false],['Premises 1 and 4 are VOID.',false],
 ['No premise stands; premise 2 is VOID.',false],
 ['Premise 5 is VOID; it is not spared.',false],
 ['no premise, as the defender says, is VOID; premise 1 is VOID.',false],
 ['No premise is VOID except premise 2.',false],['Nothing is VOID but premise 4.',false],
 ['None of the premises is VOID other than premise 3.',false],['No premise is VOID save premise 1.',false],
 ['No listed premise is VOID, besides premise 5.',false],
];
let bad=0;for(const [t,e] of C){const s=skip(t);if(s!==e)bad++;console.log((s===e?'ok  ':'FAIL')+' '+(s?'skip':'FLAG')+' (live '+(!/\bVOID\b/.test(t)||OLD.test(t)?'skip':'FLAG')+') | '+t);}
console.log(bad?'FAILS '+bad:'ALL OK');
