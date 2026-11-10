// W1 labeled case set for the VP3 trial listing (pkgVPD). Labels were written BEFORE any build was run against them.
// Run 34108, terra, E-ANS "ANSWER CHECK Luke 1:34 [CR3]", the judge KEEPs. The defender's [CR3] answer to Luke 1:34 is a bare grant
// ("I grant the present tense states her state when the angel spoke.") plus the deferral each case names. Unless a case says otherwise,
// every other line naming Luke 1:34, quoting its words ("How shall this be", "know not a man") or saying "her question" is taken out of
// [CR1] [CR2] [CR3] [CR4], and LINK 4 is kept with its own naming of the verse reworded.
// want: 'LISTED' = the answer is truly bare (WOULD REMOVE terra); 'NOT' = the side answers the verse with substance somewhere it points to.
// kind: true-bare / substance / control; note says why.
const GRANT='I grant the present tense states her state when the angel spoke.';
module.exports=[
 // ---- truly bare: must be listed
 {id:'T1',want:'LISTED',kind:'true-bare',defer:'I answer it fully under LINK 4.',link4:'short-in-CR4',note:'W1-A: LINK 4 is short, no layers, and stands only in [CR4]'},
 {id:'T2',want:'LISTED',kind:'true-bare',defer:'I answer it fully under LINK 4.',link4:'short-in-CR3',note:'W1-B: LINK 4 short, in [CR3]'},
 {id:'T3',want:'LISTED',kind:'true-bare',defer:'I answer it fully under LINK 9.',note:'W1-C: no round holds LINK 9; defers to nothing'},
 {id:'T4',want:'LISTED',kind:'true-bare',defer:'I answer it in [CR3].',note:'W1-D: defers to its own round, which holds only this bare answer'},
 {id:'T5',want:'LISTED',kind:'true-bare',defer:'I answer it fully in [CR4].',note:'W1-E: [CR4] holds text but nothing on the verse'},
 {id:'T6',want:'LISTED',kind:'true-bare',defer:'I answer it in [CR2].',note:'earlier round [CR2] holds nothing on the verse'},
 {id:'T7',want:'LISTED',kind:'true-bare',defer:'I answer it in [CR2].',add:{CR2:'- Luke 1:34: I grant it is her question.'},note:'earlier round names the verse only in another bare grant'},
 {id:'T8',want:'LISTED',kind:'true-bare',defer:'I answer it in [CR1].',add:{CR1:'- Luke 1, verse 34: I grant it.'},note:'earlier round writes the reference another way, but only in a bare grant'},
 // ---- substance: must not be listed
 {id:'N1',want:'NOT',kind:'substance',defer:'I answer it fully under LINK 4.',link4:'stored',note:'the stored layered LINK 4 block'},
 {id:'N2',want:'NOT',kind:'substance',defer:'I answer it fully in [CR4].',add:{CR4:'- On her question, "How shall this be": [L3] the angel answers the how by the Holy Ghost (Luke 1:35), so no man is the means.'},note:'W3 G1: [CR4] answers with a layer, no reference written'},
 {id:'N3',want:'NOT',kind:'substance',defer:'I answer it in [CR2].',add:{CR2:'- Luke 1, verse 34: [L2] "know" is the verb of Genesis 4:1, so she denies any coming together before the angel spoke.'},note:'W3 G2: reference written "Luke 1, verse 34", with a layer'},
 {id:'N4',want:'NOT',kind:'substance',defer:'I answer it in [CR2].',add:{CR2:'- v. 34: [L2] "know" is the verb of Genesis 4:1, so she denies any coming together before the angel spoke.'},note:'reference written "v. 34", with a layer'},
 {id:'N5',want:'NOT',kind:'substance',defer:'I answer it fully in [CR4].',add:{CR4:'- "seeing I know not a man": [L2] the verb is that of Genesis 4:1, so no coming together had been.'},note:'no reference; the verse is found by its KJV words, with a layer'},
 {id:'N6',want:'NOT',kind:'substance',defer:'I answer it in [CR2].',add:{CR2:'- Luke 1:34 shows she knew no man, so the conception came before any coming together, as Matthew 1:18 says "before they came together".'},note:'earlier round answers with a reasoned sentence, no layer tag'},
 {id:'N7',want:'NOT',kind:'substance',defer:'I answer it in [CR1].',add:{CR1:'- Luke 1:34: [L1] "How shall this be" asks the means; [L3] Luke 1:35 gives the means as the Holy Ghost.'},note:'earlier round [CR1] answers under the exact reference with layers'},
 {id:'N8',want:'NOT',kind:'control',defer:'[L2] "know" here is the verb of Genesis 4:1, so she denies any coming together.',note:'the answer itself carries a layer; no deferral'},
 {id:'N9',want:'NOT',kind:'control',defer:'I answer it in [DR3].',note:'a deferral to the challenger\'s round: unchanged by pkgVPD (rev 3 reads a round with text as not bare)'},
 {id:'N10',want:'NOT',kind:'substance',defer:'I answer it fully under LINK 4.',link4:'long-plain',note:'LINK 4 has no layers but runs 25 words or more'}];
module.exports.GRANT=GRANT;
