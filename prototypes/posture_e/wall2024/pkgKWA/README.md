# pkgKWA (W1, 11-07; W3 2942): K-W pronoun and standalone grants take the antecedent sentence

"I grant it." / "I grant that." had one-word bodies, so any NOT HELD reason holding "it" cured them (about 25 distinct stored lines); after pkgKWC a standalone
"I grant." raised nothing.
(1) kwLines421, 22 library nodes: when only a pronoun (it, that, this, so, them, these, those) or nothing follows the verb, and no words stand before it in its
    own sentence, the flagged line is the antecedent sentence plus the grant ("Luke 2:4 ... David. I grant it."). The antecedent may be on the previous line;
    it must end a sentence or hold a quoted proposition (33345: the press line MEANS [CR3] P5.1: "..."). Otherwise (a heading, a label, round start) no
    item is raised (the number is kept). pkgKWC's "X, which I grant." case is unchanged.
(2) the NOT HELD runs, 19 nodes: a trailing pronoun after "I <verb>" is dropped before pkgKWC's tail rule, so the antecedent words alone (3+) also count.
    Runs are only added.
Base: pkgLIB v9 full sources (pkgKWA/base_v9 = v8 + pkgL1Q2). Ships as pkgLIB_v10.
test_KWA.txt 15 OK (KWC cases kept; standalone, "it", "that", previous-line, quoted-press antecedents; heading and round start raise nothing; a reason holding
only "it" no longer matches). replay_KWA.txt: 14 runs x 22 = 308, 296 identical; the 12 changes are the Panel Payloads, Alternate Payloads and EIV K-W lines
of 33222, 33261, 33345 and 33430, each a pronoun grant now carrying its antecedent.
