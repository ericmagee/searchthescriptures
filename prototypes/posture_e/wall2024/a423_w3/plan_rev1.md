# ASK 423 plan rev 1 (W3): link labels written "LINK D<n>"

Assignment (coordinator, Wall 8837): W4 traces and builds, W3 plans, W1 and W2 grade. A system change: written only
on the operator's card in W4's thread. No prompt text, no model setting and no reasoning setting changes.
Inputs: rev 0 (W3 8843), W1 8844 (C1 to C3), W2 8838 item 2, W4 8840 and 8851 (reader list, commit dc737120).

## Cause (W1 8839, W4 8840)
The challenger's round 2 list labelled its entries "1. LINK D5:" against C2 Build's "LINK n:". D3 Build tells the
defender to answer "under the exact label", so the defender wrote "LINK D5 [premise 1]". The round 3 header readers
match LINK\s+(\d+) and find no block: Assume Check Build (vp4Block and the list reader), and Judge Enforcer Build and
Alt Judge Enforcer Build (blocksOf, the E-PREM lookup). W4 8851 lists 74 nodes with a LINK pattern; 22 allow a D
prefix, mostly for judge lines such as "D5 vs C1"; 3 read a "[premise n]" tag.

## Data path (read on live 36fcf36b)
The kept texts are C2B Extract .raw (the challenger's round 2, carried on as gr2) and D3B Extract .raw (the defender's
round 3, carried on as cr3). D3 Build, D4 and C4 Build and Extract read them by name; Build Synthesis carries gr2
and cr3 to Final Output; Assume Check Build reads Final Output; Panel Build reads F.gr2 and F.cr3; Build Save Body
stores them as engine_r2 and engine_r3; Regrade Load reads the stored columns back. So a rewrite at those two
extracts reaches every round 3 header reader, live and on a regrade. The builder confirms this by listing, for each
of the round 3 header readers in 8851 item 4, the field it reads.

## Part 1: the rewrite, at the keeping extracts
1. Nodes: C2B Extract (the challenger's list against the defender) and D3B Extract (the defender's link round).
   Under the both-sides rule (ASK 364), the same rewrite in the nodes that keep the defender's list against the
   challenger and the challenger's link round (W4 names them; C3B Extract is the expected one).
2. What is rewritten: a label at the start of a numbered list entry or of a block head, of the form
   LINK <P><n> or LINK <P><n> [premise m], where <P> is D or C, with or without bold or a heading mark.
   It becomes LINK <n> or LINK <n> [premise m]. Nothing else in the text changes.
3. Range guard (W1 C3): the rewrite applies only when <P> names the side whose chain the list attacks and n is within
   that side's declared chain (1 to its link count, as the existing chain reader gives it). Otherwise the label is
   left as written and the round note records it.
4. Joint labels (W1 C2): a label naming two or more links ("LINK D1 & D2", "LINK D1, D2", "LINK D1-D2") is left as
   written and recorded in the round note; no reader today takes more than the first number, and a rewrite would
   only hide that.
5. The model's own text is kept in a side field (raw_labelled_as_written), as pkgWN keeps raw_unmarked; the kept
   text (raw, and labelled where present) carries the rewritten labels; the round note lists each rewrite and each
   label left alone, with its reason.

## Part 2: the [premise n] tag in Assume Check Build (W1 C1)
vp4Block takes the first header whose number is k and never reads the tag. Where two premises share a link, the
second is given the first one's block; this is older than run 39266. Change vp4Block to pick the header whose
[premise n] tag equals the premise's own list number when such a header exists, and the first header with number k
otherwise, as blocksOf already does in the two enforcer builds.

## Out of scope
The other readers in 8851 are unchanged: they read judge lines ("D5 vs C1"), declared chains or round 4, not round 3
headers. C2 Build's and D3 Build's prompt text is unchanged.

## DONE WHEN (ASK 411), offline
a. Run 39266: the new C2B Extract gives "1. LINK 5:" to "6. LINK 1:"; the new D3B Extract on the stored round 3 gives
   "LINK 5 [premise 1]" to "LINK 1"; the original text is in the side field.
b. Assume Check Build on those texts finds a block for defender premises 1 and 2, with link 5; premise 2 gets the
   "LINK 5 [premise 2]" block (W1 C1).
c. Judge Enforcer Build's E-PREM item build finds a block for every premise of run 39266 (W2 8838: 4 were missing).
d. Over every stored run: each round with numbers-only labels is byte-equal before and after; the pass lists every
   distinct label form met, rewritten or left alone (W1 C2).
e. Planted cases: "LINK D9" with a 5-link chain is left alone and noted; "LINK D1 & D2" is left alone and noted;
   "**LINK D3:**" is rewritten.

## Limits
A model that invents another label form still escapes the readers; the round note shows it.
Run 39266's stored rows keep their labels; a regrade of that run would read them through the stored text, which
Part 1 does not change.
