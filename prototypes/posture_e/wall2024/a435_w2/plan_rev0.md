# ASK 435 plan rev 0 (W2): a bare verse number before a capitalized word is bound

## 1. OBJECTIVE
The reference reader (REFP, Shared Library) binds a bare verse number after a full reference when a capitalized word follows it, unless that number and word form a numbered book ("1 John", "2 Kings", "1 Cor").
"Psalms 2:7, 12 Kiss the Son" gives Psalms 2:7 and Psalms 2:12. Today it gives Psalms 2:7 only (finding W2 8410 4b; ASK 384 fixture, 8417).

## 2. ROLES
Planner and builder: W2 (register 9071 owner; coordinator 03:24Z). Graders: W1 and W3 (two non-builder seats).
Write: W4, on the operator's card in W4's thread. Engine manual entry: W3 (manual writer).

## 3. SCOPE with SEARCH
Change: Shared Library only (engine and child; the library is one text in both, ASK 409), REFP lines 496 and 507 (1-based, live 06967796):
- line 496, BARE, the comma form: the lookahead (?!\d|:\d|\s+[A-Z]) becomes (?!\d|:\d).
- line 507, the BARE step: before binding, if a capitalized word follows the number and BK[key(number+word)] is a book, stop (do not bind); if the match is the "and"/"&" form, also stop when a capitalized word follows (that form is unchanged in effect).
- The MAP n of the library stubs that take lines 489 to 496 changes; the stubs are rebuilt by lib_apply as in ASK 409, 422 and 429.
SEARCH (my fetch of live engine 06967796 and child e1f2b1c4):
- The capital-word guard (?!\d|:\d|\s+[A-Z]) occurs in two places: Shared Library line 496 (REFP) and Quote Report. Quote Report's trimmed copy returns only {BK, BOOKS} and calls no parse, keys or book (0 REFP.parse calls), so it is inert and stays as it is (as ASK 384, 8424 item 6).
- REFP.parse is called in 32 engine nodes and in the child's Shared Library (count by my scan: C1..C4, D2..D4 Build and Extract and their B and G variants, Build Synthesis, Build Independent Verdict, Build Save Body, Panel Build, Format Markdown, Citation Scan, L2 Count Plan, L2 Gloss Plan, Shared Library). All take the new binding; none has its own copy of BARE.
- Citation Scan's quote-pair regexes (re, rqP, rqL, rqB, rqBP) carry their own ",\s?\d{1,3}(?![\d:])" tail with no capital guard; they are not changed.
Not in scope: the "and 12 Kiss" form (no terminator, not bound today or after); NARROW (ASK 384) is unchanged and still runs after the new test.
If ASK 429 (or another library ASK) is written first, the build is made on that live library and the pairs are re-anchored.

## 4. CRITERIA and DONE
C1. Diff confined to library lines 496 and 507 and the MAP n entries; ASK 385 check PASS; every stub rebuilds; library equal in engine and child; no model setting changes (reasoning guard clean).
C2. Fixtures (p435.cjs, 12): the Psalms case binds 2:12; numbered books after a comma stay their own references (1 John, 2 Kings, 1 Cor, 3 John); the 384 NARROW fixtures ("Matthew 1:20, 18 says", "Luke 1:36, 5 makes") unchanged; the ASK 384 suite (a384_w4 fx) passes with its Psalms fixture changed to 2:7 and 2:12 and no other change.
C3. Stored runs (240 debates, every round and synthesis, scoped and unscoped): every difference old against new is a gained item that is a bare number before a capitalized non-book word; 0 items lost. Probe on the live text (p435_out.txt): 6 texts, 12 items gained (both modes), 0 lost: Isaiah 28:12 (24355), John 10:16 (24566), John 12:32 (26163, 26285), Matthew 1:25 (27613), Galatians 4:29 (32157). Each is a real verse.
C4. A replay of Citation Scan and L2 Count Plan on those 6 runs: outputs equal except the added keys and what follows from them, listed per run.
C5. rbx 0 diffs after the write, two readbacks.
DONE: C1 to C5 hold, the manual entry is written, and the ASK 417 entry is registered.

## 5. WRONG-IF
a. A numbered book after a comma ("John 3:16, 1 John 4:8") is bound as a verse of the first book.
b. Any stored item is lost, or any gained item is not a bare number before a capitalized word.
c. An abbreviation of a numbered book not in BK ("John 3:16, 1 Jn 4:8" is in BK as 1jn; a form not in BK) is bound as a verse: listed as a known limit with the count from the stored runs (0 in the probe).

## 6. RUN EVIDENCE
ASK 417 entry. Case: a run whose round or synthesis text holds a full reference followed by ", N Word" (N a bare number, Word capitalized, N+Word not a book). Mark: the Citation Scan of that run, replayed from debate_results on the live engine, lists the reference book c:N; MISSED if absent. Known-good case on stored data: 24566 (John 10:16).

## 7. INPUTS IN GIT
a435_w2/p435.cjs and p435_out.txt (this probe). The debates dump is the one named in a432_w2/README.md (not committed, size). The build adds build435.cjs, pairs_435.json, the targets and the fixture and replay outputs.

## 8. STEPS
1. W1 and W3 grade this plan.
2. W2 builds on a fresh fetch of live (pairs on lines 496 and 507, lib_apply), runs C1 to C4, posts the build.
3. W1 and W3 grade the build.
4. W4 posts the card in W4's thread and writes on the operator's press; C5 by two readbacks.
5. W3 writes the engine manual entry (ONE REFERENCE PARSER paragraph, the bare-number rule); W2 adds the ASK 417 registry entry.
