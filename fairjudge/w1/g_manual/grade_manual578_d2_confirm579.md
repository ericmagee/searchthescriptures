# GRADE: ASK 578 MANUAL PAIRS DRAFT 2 (W3, Wall 11869) and CONFIRM 579 RE-CUT (Wall 11867)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 2026-11-24 CST.

## ASK 578 draft 2: manual1123/w3/a578/em_pairs_578_draft2.json md5 9ec8ae09
GRADE: FAIL (one fix, F1)
COMMIT: graded at W3's posted file; this grade file.
RULES READ: section 0 of the engine manual; build rule; ASK 422(a) one writer.
OBJECTIVE MET: no, on F1 alone; every other statement is checked true.
STANDARD (ASK 599): not applicable to manual text; each quoted string was checked against the code that prints it.

Preview (my run): 09.6 v294 base 181bac44 -> 3b5b2bde, 41,416 characters, counts [1,1,1,1,1,1,1]. Equals W3's figures.
Pairs 1 to 6 are unchanged from draft 1. Checked against live child aad0ad9c and engine 912dd47a:
- child has no Shared Library node: true.
- 14 readers of pass.lib, the same 14 names: true.
- Library Check texts "pkgLIB1: the call carries no library text (ASK 578)" and "...the library text received differs from the engine library, engine lib <x> map <y>, received lib <x> map <y>": true, both in the code.
- Library Check drops lib from pass and passes lib422 with four values: true.
- MAPEXTRA ["REFP","Alternate Merge CPD"] in the child: true.
- engine library length 1,276,323: true.
Pair 7 (new), against W4's tools in ask578/w4/tools: runstart.py check 3 refusals "3 ENGINE Alternate Pass Call DOES NOT SEND the library text" and "3 MAPEXTRA DIFFERS: engine <x>, child <y>": true (lines 73, 75). libsha.py child line "no Shared Library node: served the engine library in the call (ASK 578); engine sends it: <True|False>": true (line 26).

F1 (required). The old text ends "a library change is written to both workflows by the one writer, libw.py." The new text ends "A library change is written to the engine only; the child takes it from the next call." and names no writer. The ASK 422(a) one-writer rule still stands, and its tool is now libw.py --engine-only (graded PASS, Wall 11871). Fix: "A library change is written to the engine only, by the one writer, libw.py --engine-only; the child takes it from the next call."
N1 (not blocking). runstart.py prints ok lines as "ok" plus four spaces ("ok    3 child has no ..."). Pair 7 quotes "ok 3 child ...". Either quote the line without "ok", or as printed.

## 579 re-cut: manual1123/w3/a579/em_pairs_579_draft1.json md5 5114ec60
CONFIRMED. My preview: 11.2 v312 base 59f3a6af -> 9c844df7, 18,648 characters, counts [1]. Equals W3's figures. The pair text is the one I graded PASS earlier (ce9981f9).

## ASK 578 draft 3 (Wall 11876, em_pairs_578_draft3.json md5 50019d51, commit 398872b3): PASS
Diff from draft 2: pair 7 only. F1 applied ("by the one writer, libw.py --engine-only"); N1 applied (the ok line quoted without "ok"). Pairs 1 to 6 byte-equal to draft 2.
My preview: 09.6 v294 base 181bac44 -> 8f288364, 41,455 characters, counts [1,1,1,1,1,1,1]. Equals W3's figures.
On the AAR N1: W3 says 19:31 is the write (guard rows 41868, 41869) and 41871 is the audit row after; accepted, NOT CHECKED by me.
