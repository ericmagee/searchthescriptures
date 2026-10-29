# P1 (order BB-7994, P2D BB-8004 step 2): item 7 build, falsifiers declared before building

Base: live ORACLE_DEBATE_V1 23cf8db4 node code in ../fix7/live_*.js (A3 measured byte-equal to live, WALL-1844 reply 1862).
Build: ../fix7 agreed set (1)-(4) (WALL-1853) plus rule (A) with its two conditions (WALL-1864, 1865).

Rule (A): a quotation MATCHES only when each of its segments (the quote split at "..." or the ellipsis
character, each segment folded: lower case, letters and spaces only) stands contiguous in the folded cited
text, the segments in order; the cited text first loses every bracket holding a colon (margin notes);
italic-word brackets keep their words. 0.75 stays only to bind a quote to its verse or its rebound verse.

Falsifiers (harness p1/test_p1.cjs, live vs new):
- F7a: the four altered quotes of WALL-1862 (Genesis 16:10 "thy daughters"; Luke 3:23 "as was never supposed";
  Galatians 4:4 "made of a virgin"; Galatians 4:4 "born without a father"): MATCHES 0 under new.
- F7b: the eleven true quotes of testA/wrongif.cjs, including Luke 1:35 with its ellipsis: MATCHES 11 of 11 under new.
- F7c: fix7/test.cjs rows: NOT CHECKED 0 under new (was 7 live), unchanged from the fix7 result.
- F7d: a quotation made of a margin note's words ("Gr. sabbath day", Acts 16:13): not MATCHES under new.
- F7e: Luke 1:35 with its two segments reversed: not MATCHES under new (order kept).
- F7f (single-site mutants, each must FAIL a named falsifier): (i) no ellipsis split -> F7b fails on Luke 1:35;
  (ii) no margin drop -> F7d fails; (iii) contiguity off (word share only) -> F7a fails; (iv) order off -> F7e fails.
- F7g: Quote Report is run on the new Quote Compare output with a Find Words stand-in that searches only the
  verses in the harness (declared limit: the live node searches the whole book); every altered quote ends as a
  mismatch status, every true quote as MATCHES.
Not tested by this harness: a whole stored run; the live Find Words search; other spellings or translations.

## Amendment 1 (ruling BB-8010 on BB-8006), declared before building
Quote Report: a PENDING quote whose best found row (0.75 share) lies inside the cited range reports
"WORDING DIFFERS FROM <ref>"; a best row outside the range keeps "WORDS ARE AT <ref>"; no row keeps
"WORDING NOT FOUND IN <book>"; MATCHES and NOT CHECKED untouched.
- F7h: Genesis 16:10 "thy daughters", Luke 3:23 "as was never supposed" and Luke 1:35 reversed report
  WORDING DIFFERS FROM Genesis 16:10 / Luke 3:23 / Luke 1:35. Galatians 4:4 "born without a father" keeps
  WORDING NOT FOUND IN Galatians (its best row, Galatians 4:4, scores 5 of 8 = 0.625, under 0.75; by the ruled
  design, not by BB-8010's sentence "the altered quotes of 1862 ... each report WORDING DIFFERS", which this
  quote cannot meet). "made of a virgin" and "Gr. sabbath day" keep NOT CHECKED. The eleven true quotes MATCHES.
- F7h2 (outside the range still names the other verse): a quote cited to Luke 1:34 whose words are Luke 1:35's
  ("The Holy Ghost shall come upon thee") reports WORDS ARE AT Luke 1:35.
- F7h3 (mutant): the range test removed (every found best row treated as inside) -> F7h2 fails.
