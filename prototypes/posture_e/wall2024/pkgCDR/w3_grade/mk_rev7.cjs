const fs=require('fs');const C=[];const add=(id,e,c,want,note,round='cr3')=>C.push({id,adds:(e?[[round,e]]:[]).concat([['cr4',c]]),side:'DEFENDER',closing:c,want,note});
// real forms from stored debates (run named in note), each restated in the closing round
add('R1','I drop two limbs: that every house-row points to Mary alone, and that Joseph\'s name and house stand outside the register.','Every house-row points to Mary alone.','LISTED','33261 cr3 form: two limbs, colon, that-clauses');
add('R2','I drop two things: that Luke 3\'s line is expressly given as Mary\'s, and that Joseph is "counted \'of Heli\' by marriage".','Luke 3\'s line is expressly given as Mary\'s.','LISTED','33482 cr3 form');
add('R3','I drop my earlier wording that all the father rows come from the crowd.','All the father rows come from the crowd.','LISTED','33506 cr3 form: adjective before the noun');
add('R4',null,'Justice could never move a husband who knew the child to be his.','LISTED','34108 cr3 as stored: "I drop the broader claim that ..."');
add('R5','- **Link 3.** I drop the claim that Matthew 1:25 by itself covers the time before the taking.','Matthew 1:25 by itself covers the time before the taking.','LISTED','33815 cr2 form: bold label ending in a period','cr2');
add('R6','**Narrowed.** I withdraw "at the one place where the pattern would require it" as a proof of absence.','The verb is absent at the one place where the pattern would require it.','LISTED','33411 cr2 form','cr2');
add('R7','**Narrowed.** I withdraw "marks a false report" for *enomizeto*.','The verb marks a false report.','LISTED','33497 cr2 form','cr2');
add('R8','- **Luke 1:27.** I withdraw "on the plain statement of Luke 1:27" for Mary\'s Davidic descent.','Mary is of David on the plain statement of Luke 1:27.','LISTED','33705 cr2 form','cr2');
add('R9','The limb I drop is any claim that the text names Mary\'s father outright.','The text names Mary\'s father outright.','LISTED','33617 cr3 form');
add('R10','I take back "points to Mary alone" as a claim about the pronoun by itself.','The pronoun points to Mary alone.','LISTED','33261 cr2 form: take back','cr2');
add('R11','The limb dropped is that this act set the tribe of the child.','This act set the tribe of the child.','LISTED','33249 cr3 form');
add('R12','I drop "the flesh comes through Mary" and the assumption that Mary is of David\'s house by her father.','Mary is of David\'s house by her father.','LISTED','33345 cr3 form: second object');
// new planted forms
add('S1','Here I drop the wording "the register stops at Joseph".','The register stops at Joseph.','LISTED','lead-in adverb');
add('S2','On Luke 3:23, I drop the wording "the register stops at Joseph".','The register stops at Joseph.','LISTED','lead-in phrase');
add('S3','I formally withdraw the wording "the register stops at Joseph".','The register stops at Joseph.','LISTED','adverb not on the list');
add('S4','I have dropped the wording "the register stops at Joseph".','The register stops at Joseph.','LISTED','perfect tense');
add('S5','The wording "the register stops at Joseph" is withdrawn.','The register stops at Joseph.','LISTED','passive');
add('S6','I drop the statement "the register stops at Joseph".','The register stops at Joseph.','LISTED','noun not on the list');
add('S7','I grant the press and drop the wording "the register stops at Joseph".','The register stops at Joseph.','LISTED','second verb of the clause');
add('S8','I drop from LINK 2 the wording "the register stops at Joseph".','The register stops at Joseph.','LISTED','phrase between verb and wording');
add('S9','I no longer hold that the register stops at Joseph in every row.','The register stops at Joseph in every row.','LISTED','no longer hold');
add('S10','I drop the wording "the register stops at Joseph" and keep the rest of LINK 2.','The register stops at Joseph.','LISTED','control: plain drop');
add('S11','I hereby withdraw the phrase "the register stops at Joseph".','The register stops at Joseph.','LISTED','control: hereby, phrase');
// structural non-drops
add('Q1','I do not drop the wording "the register stops at Joseph".','The register stops at Joseph.','NOT LISTED','negated at the verb');
add('Q2','Do I drop the wording "the register stops at Joseph"?','The register stops at Joseph.','NOT LISTED','question');
add('Q3','I never drop the wording "the register stops at Joseph".','The register stops at Joseph.','NOT LISTED','never');
add('Q4','The challenger demands that I withdraw the wording "the register stops at Joseph".','The register stops at Joseph.','NOT LISTED','reported demand');
add('Q5','I will not withdraw the wording "the register stops at Joseph".','The register stops at Joseph.','NOT LISTED','will not');
add('Q6','I refuse to drop the wording "the register stops at Joseph".','The register stops at Joseph.','NOT LISTED','refuse');
fs.writeFileSync(__dirname+'/cases_rev7.json',JSON.stringify({about:'W3 labeled cases for pkgCDR rev 7 (standard: no true drop hidden), labels fixed before the run. R = forms taken from stored debates; S = new planted forms; Q = structural non-drops.',cases:C},null,1));
