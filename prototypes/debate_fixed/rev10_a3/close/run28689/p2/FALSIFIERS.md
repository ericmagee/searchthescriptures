# P2 (order BB-7994, P2D BB-8004 step 4): items 5 and 6, the Alternate cure trace, the DoD 8 run. Builder Worker_A3.
Declared before any build file. Base: Build Independent Verdict 499ac1eb and Panel Build 11d97584 (P1, verified BB-8014/8017);
Build Diagnostic Prompt and Extract Diagnostic from live 23cf8db4 (my saved node code, scratchpad n/072, n/074).
Agreed text: item 5 WALL-1842 reply 1880 (with 1870 edits 2-3, 1875 edit 1); item 6 WALL-1843 reply 1881 (1871 edits 1-2, 1876).

## Item 5 (DoD 2)
- F5a: Build Independent Verdict body, built from a stored row's rounds, prints the six headers '=== <Panel Build label> ===' once each,
  and Cure Build's own cureRounds (extracted verbatim from live) finds 6 of 6 rounds, each round's text equal to the stored column it came from.
- F5b (mutant): headers in the bare form '[CR1] DEFENDER R1' (no ===): cureRounds finds fewer than 6 -> F5a fails.
- F5c: Build Diagnostic Prompt, BROKEN branch: the six '=== label ===' headers once each; the string '[GR' 0 times.
- F5d: the neither-seat line once in each branch, on the line after the roles line (posline).
## Item 6 (DoD 3)
- F6a: both branches: "SECOND OPINION (single judge, not the debate's verdict): " once; "INDEPENDENT VERDICT" 0 times; the agreed second line once.
- F6b: Extract Diagnostic: both separator strings byte-unchanged; the review line "(A review of the single judge's second opinion, which was
  <tag>. The debate's verdict is the panel's.)" comes right after the separator, both branches.
- F6c: Format Markdown (P1 35de12a3, synthParts unchanged) splits a synthesis built by the new Extract Diagnostic into synthesis and
  diagnostic, the review line at the head of the diagnostic part; mutant renaming the separator -> the split fails.
## Alternate trace (open item of WALL-1880)
- FA: every cureRounds caller is listed with the body it reads; any caller reading Build Independent Verdict's or Build Diagnostic
  Prompt's body is run under F5a. Expected from a first read: Alternate Build reads Panel Build, so no alternate reads the changed bodies.
## DoD 8 (operational_doc 27), rows e6253a01 (run 28689), 8a510163 (HELD, run 28662), 33263d94 (challenger_r3 empty)
- F8a: old and new Build Independent Verdict bodies for each row differ only in the six header lines and the P1 RULE sentence.
- F8b: Extract Independent Verdict (unchanged) run on each row's stored independent_verdict_raw: its fields compared with the row's stored
  defense_standing, conceded_links, challenge_standing, challenger_conceded_links, framework_verdict; every difference listed with its cause
  (a cure, or the code); a difference caused by the P1/P2 changes stops the publish.
Not tested: model behaviour under the new prompts (the live run, DoD 7).
