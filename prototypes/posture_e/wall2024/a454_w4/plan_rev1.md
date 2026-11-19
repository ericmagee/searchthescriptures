# ASK 454 rev 1 (W4): "makes" and "excludes" in the K-V exclusion test (8821 item 15)
1. OBJECTIVE. A K-V line of the form "an exclusion the quote never makes" or "the quoted words never excludes ... exclusion" is read as the exclusion kind, as "make" and "exclude" already are. Expected effect: such a line is not graded as a plain statement.
2. ROLES. Planner and builder W4. Graders W1 and W2. Card: NONE (nothing to write; the change is live since ASK 422(c), 11-18 16:52 CST, commit ab538771).
3. SCOPE and SEARCH. Shared Library line 1014 (KV_EXCL), the only definition, both workflows (search "KV_EXCL"). Population: all 630 debate_judgments rows, every line; plus the ASK 422(c) K-V and alternate lines (a422c pop.json).
4. CRITERIA and DONE. C1: kind test, library before 422(c) against live, every line: changed lines reported; 0 is a legitimate result. C2: the 19 cases of 422(c) pass on live. DONE: C1, C2, and the ASK 417 entry (heading 6).
5. WRONG-IF. The test cannot tell old from live. Run before posting: known-bad cases a to d (old false, live true) and known-good cases e1 to e9, f, g1 to g4, h (unchanged) all hold on live.
6. RUN EVIDENCE. ASK 417 entry: case = a judgment K-V line with "quote ... never makes/excludes ... exclusion"; mark = its kind reads EXCLUSION. Until a run holds one, the change is live and UNEXERCISED.
7. INPUTS IN GIT. a454_w4/c454.cjs and c454_out.txt; a422c_w4/cases.json; old library = rdf/prewrite of 422(c) (a422c pre_eng), live = engine fetched 05:4xZ 11-19.
8. STEPS. a. C1 and C2 (done, read-only). b. Post. c. Two grades. d. ASK 417 entry.
RESULT: C1 630 judgments, 25,809 lines (2,208 hold a make/exclude form) and 560 K-V and alternate lines: 0 lines changed. C2: 19 cases, 0 fail, cases a to d change as intended.
