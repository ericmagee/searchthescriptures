// Item 7 test: run live and new Citation Scan + Quote Compare on excerpts copied verbatim from run 28689 (row e6253a01)
// and run 27 Oct 09:52 (row 8a510163, WALL-1822), with KJV rows pulled from kjv_verses. Prints each item's status, old vs new.
const fs = require('fs'), path = require('path');
const D = __dirname;
const R = {
 cr1: '- **[L1]** Gal 4:4 says "made of a woman" (*genomenon ek gynaikos*, come to be out of a woman). Paul names no man.\n- **[L1]** Romans 1:3 "made of the seed of David according to the flesh" is the promise.',
 gr1: '**[L3]** "made of a woman" (Galatians 4:4) is the mortality idiom: "how can he be clean that is born of a woman?" (Job 25:4); of John the baptist, "among them that are born of women" (Matthew 11:11) — whose father Zacharias is named (Luke 1:13, 62–63). "Born of a woman" excludes no father.\nThe same verb form stands at Acts 16:13 "where prayer was **wont** to be made" — custom, not falsehood.\n3. Acts 16:13 "wont to be made"; custom, not denial.',
 cr2: '- **[L1]** Luke 3:23 gives Joseph "(as was supposed)" the son of Joseph, "which was the son of Heli", and the list runs through Nathan.\n- "no man knew her then" is not what (Luke 1:34) says.',
 gr2: 'Nothing here.',
 cr3: 'LINK 2: SUPPORTED\n- [L1] "Is not this Jesus, the son of Joseph" (John 6:42), "Jesus of Nazareth, the son of Joseph" (John 1:45).',
 dr3: 'LINK 1: SUPPORTED\n- [L3] What the Spirit\'s coming produces is a named child and a title: "The Holy Ghost shall come upon thee... therefore also that holy thing which shall be born of thee shall be called the Son of God" (Luke 1:35) — "shall be called" (*klēthēsetai*), a title given.\nLINK 3: SUPPORTED\n- [L1] The other three rows name the sire in the passage: "I will multiply thy seed" to Hagar (Genesis 16:10) — "Abram... Ishmael" (16:16); "thou art the mother of thousands of millions" (24:60).'
};
const KJV = [
 ['Job',25,4,'How then can man be justified with God? or how can he be clean [that is] born of a woman?'],
 ['Luke',1,34,'Then said Mary unto the angel, How shall this be, seeing I know not a man?'],
 ['Luke',1,35,'And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God.'],
 ['Luke',1,13,'But the angel said unto him, Fear not, Zacharias: for thy prayer is heard; and thy wife Elisabeth shall bear thee a son, and thou shalt call his name John.'],
 ['Luke',1,62,'And they made signs to his father, how he would have him called.'],
 ['Luke',1,63,'And he asked for a writing table, and wrote, saying, His name is John. And they marvelled all.'],
 ['Acts',16,13,'And on the sabbath we went out of the city by a river side, where prayer was wont to be made; and we sat down, and spake unto the women which resorted [thither]. [sabbath: Gr. sabbath day]'],
 ['Galatians',4,4,'But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law,'],
 ['John',1,45,'Philip findeth Nathanael, and saith unto him, We have found him, of whom Moses in the law, and the prophets, did write, Jesus of Nazareth, the son of Joseph.'],
 ['John',6,42,'And they said, Is not this Jesus, the son of Joseph, whose father and mother we know? how is it then that he saith, I came down from heaven?'],
 ['Genesis',16,10,'And the angel of the LORD said unto her, I will multiply thy seed exceedingly, that it shall not be numbered for multitude.'],
 ['Luke',3,23,'And Jesus himself began to be about thirty years of age, being (as was supposed) the son of Joseph, which was [the son] of Heli,'],
 ['Matthew',11,11,'Verily I say unto you, Among them that are born of women there hath not risen a greater than John the Baptist: notwithstanding he that is least in the kingdom of heaven is greater than he.'],
 ['Romans',1,3,'Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;'],
].map(([book,chapter,verse,text])=>({book,chapter,verse,text}));

function run(which) {
  const cs = fs.readFileSync(path.join(D, which + '_Citation_Scan.js'), 'utf8');
  const qc = fs.readFileSync(path.join(D, which + '_Quote_Compare.js'), 'utf8');
  const nodes = {};
  const $ = n => {
    if (n === 'Regrade Load') return { isExecuted: false };
    if (n === 'Final Output') return { first: () => ({ json: R }) };
    if (n === 'Citation Scan') return { first: () => ({ json: nodes.cs }) };
    if (n === 'Cited Verses') return { all: () => KJV.map(json => ({ json })) };
    throw new Error('no node ' + n);
  };
  nodes.cs = new Function('$', cs)($)[0].json;
  return new Function('$', qc)($)[0].json.items;
}
const key = i => i.side + ' ' + i.round + ' ' + i.ref + ' "' + String(i.quote).slice(0, 34) + '"';
const old = run('live'), neu = run('new');
const all = new Map();
old.forEach(i => all.set(key(i), [i.status, '-']));
neu.forEach(i => { const k = key(i); all.set(k, [(all.get(k) || ['-'])[0], i.status + (i.phrase ? ' (phrase)' : '') + (i.cite_form === false ? ' [not a citation]' : '')]); });
for (const [k, [o, n]] of all) console.log((o === n ? '  ' : '* ') + k.padEnd(78) + ' OLD ' + String(o).padEnd(12) + ' NEW ' + n);
console.log('old NOT CHECKED', old.filter(i => i.status === 'NOT CHECKED').length, '| new NOT CHECKED', neu.filter(i => i.status === 'NOT CHECKED').length);
