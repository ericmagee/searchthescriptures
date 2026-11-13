const fs=require('fs');
const t=JSON.parse(fs.readFileSync(process.argv[2]));const s=t.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(s.slice(s.indexOf('\n/*LIB*/')+8,s.lastIndexOf('\n/*MAP*/')));
const old=fs.readFileSync('lib189.txt','utf8').split('\n').find(l=>l.includes('const OPEN='));
const nl=LIB.find(l=>l.includes('const OPEN='));
const mk=L=>eval(L.slice(L.indexOf('const OPEN=')+11, L.lastIndexOf(';')));
const OLD=mk(old),NEW=mk(nl);
console.log('uses? present in new:', /uses\?/.test(nl), '| delta', nl.length-old.length);
const P=[
['T luna D5','D5 vs C5 (Luke 3:23): UNDERDETERMINED -- the record gives both a mistaken-supposition use and a household-usage reading of the sonship -- GROUND: [L1] Luke 3:23 "being (as was supposed) the son of Joseph."'],
['T two competing readings','UNDERDETERMINED -- the rows sustain two competing readings of the verb'],
['T both legal and natural senses','UNDERDETERMINED -- the record leaves both the legal and the natural senses standing'],
['F verb: defender uses it','UNDERDETERMINED -- both sides cite the verse and the defender uses it'],
['F verb: Matthew and Luke use','UNDERDETERMINED -- both Matthew and Luke use the word'],
['F verb: Luke and Acts use','UNDERDETERMINED -- both Luke and Acts use the verb in its usage sense'],
['F noun use alone','UNDERDETERMINED -- both the defender and the challenger make use of it'],
['F one side wins (both..and..reading)','UNDERDETERMINED -- both the verse and the context support the challenger\'s reading'],
['F of the two readings only one fits','UNDERDETERMINED -- of the two readings, only the defender\'s fits the verse'],
['F rival readings rejected','UNDERDETERMINED -- the rival readings are both refuted by Matthew 1:18'],
['F dash boundary','UNDERDETERMINED -- both -- and a reading'],
['F no open','UNDERDETERMINED -- the challenger is right'],
];
for(const [n,l] of P)console.log((OLD.test(l)?'old PASS':'old fail').padEnd(9),(NEW.test(l)?'new PASS':'new fail').padEnd(9),n);
