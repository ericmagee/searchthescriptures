# pkgKWC (W1, 11-07; W3 grade_33430, HIGH): a K-W grant with no object ("..., which I grant.")

33430: [CR2] "Jesus is of David's flesh, which I grant. He is not of Joseph's seed." was flagged as "I grant." (kwLines421 cuts the sentence from the verb).
The body was empty, so no NOT HELD reason could quote it: sol and the alternate grok were both UNCURED, and sol was not counted (panel 2-0).
(1) kwLines421, 22 library nodes: when nothing but punctuation follows the verb, the flagged sentence is the whole sentence that holds it; when no words
    stand before the verb (after a trailing which/as/that/this), no K-W item is raised (the number is kept, as pkgKW does for quoted/heading/negated).
(2) the K-W NOT HELD runs, 19 nodes: a body ending "[which|as|that|this] I grant|concede|withdraw|drop" ALSO takes the runs of the words before it
    when 3 or more remain. Runs are only added (monotone), like pkgKWT.
Base: pkgLIB v7 full sources (pkgKWC/base_v7 = pkgLIB_v7/orig_stack). Ships as pkgLIB_v8.
test_KWC.txt 7 OK: the 33430 sentence is flagged whole; a bare "I grant." after a full stop raises nothing; "I grant that X" and "I withdraw it from
Hebrews 10:5." are unchanged; the runs include "jesus is of davids flesh"; sol's 33430 JUDGE STATEMENT (quotes "Jesus is of David's flesh") now quotes it;
grok's reason (quotes only "I grant.") still does not. In a live run every judge is shown the whole sentence.
replay_KWC.txt: 14 runs (33218-33430) x 22 = 308, 305 identical; the 3 changes are 33430 Panel Payloads, Alternate Payloads and Extract Independent Verdict,
where the K-W line now reads "Jesus is of David's flesh, which I grant." (the cure nodes read saved payloads, so the cure change shows in test_KWC).
