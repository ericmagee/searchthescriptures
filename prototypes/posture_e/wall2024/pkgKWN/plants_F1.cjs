// W2 plants for pkgKWN (F1), recorded before the run. K-W reader alone (library line 1403 path) through Panel Cure Check is heavy; instead the NOT HELD head test is run here on both versions, and the full reader is exercised by the stored replay (replay_cmp) and the 34852 replay.
const OLD=t=>/^\s*NOT\s+HELD\b/i.test(t);
const NEW=t=>String(t||'').search(/(?:^|[.;!?]["”'’)\]]*\s+)\**NOT\s+HELD\b/i)>=0;
const P=[
 ['P1 sol 34852 form','Fact granted: Mary\'s statement describes her present state at the announcement. NOT HELD: [CR2] grants "the present tense".',false,true],
 ['P2 plain start','NOT HELD: [CR2] says "x".',true,true],
 ['P3 bold after sentence','Fact withdrawn: none. **NOT HELD**: "x"',false,true],
 ['P4 after semicolon','The grant is grammatical; NOT HELD: "x"',false,true],
 ['P5 mid-sentence, no break (must stay refused)','This is NOT HELD by the record "x"',false,false],
 ['P6 negated inside sentence (must stay refused)','I would not call it NOT HELD here.',false,false],
 ['P7 after a quoted sentence end','He wrote "it is so." NOT HELD: "x"',false,true],
 ['P8 lower case after break','Fact granted. not held: "x"',false,true],
];
let bad=0;for(const [n,t,o,nw] of P){const a=OLD(t),b=NEW(t);const ok=a===o&&b===nw;if(!ok)bad++;console.log((ok?'OK  ':'FAIL')+' '+n+' | live '+a+' (expected '+o+') | F1 '+b+' (expected '+nw+')');}
console.log(bad?bad+' FAIL':'ALL OK');
