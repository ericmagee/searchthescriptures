// pkgKCQ rev 2 plants: W3 4403's four true K-C lines (must stay raised), sol's stored line (must not), W2's T2 and K2-K4 forms.
const {O,N}=require('./scan.cjs');const head='CHALLENGER CONCEDED LINKS: 0 -- Premises 1, 2, 3 and 6 are spared on their exhibited footing and answers. Premise 4 is VOID (Commitment 6): the charge adds the universal restriction "an office only", whereas its [DR2] quotation says "In those rows the coming-upon yields an office: witnesses, and a king." ';
const P=[['sol stored (false raise)',head+'That quotation limits its observation to those rows and does not assert the added exclusion.',false],
['W3 a (true)',head+'Premise 5 is conceded: the challenger\'s rows are set aside because none of the verses states the begetting in its own words.',true],
['W3 b (true)',head+'Premise 5 is conceded: none of the verses states the begetting in its own words, whatever quotation is offered.',true],
['W3 c (true)',head+'Premise 5 is conceded: each quotation in the challenger\'s rows names a house and none of the verses states the begetting in its own words.',true],
['W3 d (true)',head+'Premise 5 is conceded: the rows of quotation the challenger gathers are set aside because none of the verses states the begetting in its own words.',true],
['T2-like (true, quotation subject, stating verb)',head+'Premise 5 is conceded: that quotation of those rows does not state the begetting in its own words.',true],
['quotation subject, assert verb, not "the added" (true)',head+'Premise 5 is conceded: the quotation of those rows does not assert the begetting in its own words.',true],
['VOID form written with "that quotation ... does not assert the added" in another wording (skipped)',head+'Premise 5 is VOID (Commitment 6): this quotation names the rows only and does not assert the added universal.',false],
['K2 form "quote" (W2 limit: stays raised)',head+'Premise 5 is VOID: its quote "x y z" limits its observation to those rows and does not assert the added exclusion.',true]];
const t=s=>'{"verdict_tag":"BROKEN","reasoning":"RESULT: CHALLENGER WINS\\n'+s.replace(/"/g,'\\"')+'"}';
for(const [n,l,want] of P){const a=O.netLines(O.cureJText?l:l,null,null).length>0,b=N.netLines(l,null,null).length>0;console.log((b===want?'AS EXPECTED ':'DIFFERS     ')+n+' | live '+(a?'K-C':'none')+' | rev 2 '+(b?'K-C':'none'));}
