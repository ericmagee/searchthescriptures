const fs=require('fs');const C=[];const W='the register stops at Joseph',CL='The register stops at Joseph.';
const add=(id,e,want,note,c=CL,side='DEFENDER')=>{const er=side==='DEFENDER'?'cr3':'dr3',cr=side==='DEFENDER'?'cr4':'dr4';C.push({id,adds:[[er,e],[cr,c]],side,closing:c,want,note});};
// the side's own drop, with the opponent or a he/she/they named before the verb
add('T1','Because the challenger pressed Ezra 2:62, I drop the wording "'+W+'".','LISTED','opponent named in a reason clause before my drop');
add('T2','I grant the challenger this row and withdraw the wording "'+W+'".','LISTED','opponent is the nearest noun before my second verb');
add('T3','As the challenger says, the wording overreaches, and I withdraw "'+W+'".','LISTED','as the challenger says');
add('T4','Matthew says he took his wife, and I drop the claim that the register stops at Joseph in every row.','LISTED','he = Joseph in the verse','The register stops at Joseph in every row.');
add('T5','The rows name no tribe; they set no house, and I drop the wording "'+W+'".','LISTED','they = the rows');
add('T8','I concede to the challenger and withdraw "'+W+'".','LISTED','concede to the challenger and withdraw');
add('T11','Since he asks for a row and I have none, I drop the wording "'+W+'".','LISTED','he asks, I drop');
add('T19','I grant what the defender pressed and drop the claim that the two lists name one man in every row.','LISTED','challenger side','The two lists name one man in every row.','CHALLENGER');
// negation words after the verb that do not negate the drop
add('T6','I withdraw not the verse but the wording "'+W+'".','LISTED','not X but the wording');
add('T15','I drop no verse, only the wording "'+W+'".','LISTED','no X, only the wording');
// strike in the side's own passive / imperative
add('T7','The sentence "'+W+'" is struck from my LINK 2.','LISTED','passive strike by the side');
add('T20','Strike the wording "'+W+'" from my LINK 2.','LISTED','imperative strike');
// other
add('T17','I no longer defend the wording "'+W+'".','LISTED','no longer defend');
add('T21','I drop the Luke 3:23 register reading through Heli alone.','LISTED','verse colon inside the dropped object','The Luke 3:23 register reading through Heli alone stands.');
// controls expected LISTED
add('T9','The challenger is right that the row is silent; the wording "'+W+'" is withdrawn.','LISTED','control: passive after semicolon');
add('T14','I drop the wording "'+W+'", which the challenger struck at in round 2.','LISTED','control: opponent after the verb');
// closing side: the reclaim sentence itself holds a drop or grant word, or quotes the wording
add('V1','I drop the wording "'+W+'".','LISTED','closing holds "granted"','I granted too much in round 3: the register stops at Joseph.');
add('V2','I drop the wording "'+W+'".','LISTED','closing withdraws the narrowing','I withdraw my round 3 narrowing, and the register stops at Joseph.');
add('V3','I drop the wording "'+W+'".','LISTED','closing restores the wording in quote marks','I restore the wording "the register stops at Joseph".');
// not the side's drop
add('U1','The challenger would have me withdraw the wording "'+W+'", and I keep it.','NOT LISTED','opponent demand');
add('U2','The challenger\'s demand that the wording "'+W+'" be withdrawn fails.','NOT LISTED','possessive opponent, passive');
add('U3','I have not withdrawn the wording "'+W+'".','NOT LISTED','negated perfect');
add('U4','Nothing in LINK 2 is withdrawn, least of all "'+W+'".','NOT LISTED','nothing is withdrawn');
add('U5','The defender dropped the wording "the two lists name one man" in round 2.','NOT LISTED','challenger reports the defender','The two lists name one man.','CHALLENGER');
fs.writeFileSync(__dirname+'/cases_rev8.json',JSON.stringify({about:'W3 labeled cases for pkgCDR rev 8, labels fixed before the run. T = the side\'s own drop against the opponent, negation and strike rules; V = closing side; U = not the side\'s drop.',cases:C},null,1));
