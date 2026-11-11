# W1 grade of pkgDFR (second grader; W2 builder; W4 first grader)

Parent /mnt/project-files/wall2024/parent_s143_DFR.json, sha256 03b0e907751acb13. Base b6d0d27a (ASK 89 joint).

## Change
Library line 1898 (OPEN regex) only: `disputing|differ(?:s|ed|ing)?\s+(?:on|over|about|as\s+to)` added after `disputes`. Line +58; code +60 (measured). Prompt 0 (OPEN is a code test; no prompt text changes).

## Map check
mapcheck.cjs: 0 faults. Only Shared Library differs; 9 stubs +58 each (Send Back Build, Send Back Record, Gate Record, each with Alt and R2 Alt). mapcheck_out not separate; recorded in dfr_out.txt run notes.

## Stored text (dfr.cjs, dfr_out.txt)
- 1,814 distinct UNDERDETERMINED collision strings across the 12 exports (every string, including copies in send-back and audit text).
- 35 strings FAIL->PASS, 0 PASS->FAIL.
- The 35 reduce to 13 distinct collision lines (run + label): 33490 1, 34626 2, 34703 3, 34780 3, 35067 2, 35173 2 (cores.txt). Each matched phrase (m_out.txt, m2_out.txt) states what is left open: "differ over/on/about", "disputing whether ...". No match is on an unrelated word.
- W2 reported 16 changed lines; my 13 counts run + label once. I have not reconciled the 3; it may be a counting basis (per seat). Guess, not checked.

## W4's 33497 copy (t33497.cjs, t33497_out.txt)
Stored H6.1 chatgpt D1 vs C1 (Matthew 1:18) passes under both old and new OPEN: old matches "leaves the competing timing inferences open"; new matches "differ on" first. With the closing clause removed the line fails old and passes new. So 33497 does not change on stored text, as W2 Wall 5041 said; the form is covered by the plant.

## Plants: 10 of 10 as expected
Five new forms pass new and fail old; four non-statements fail both. LIMIT: "The sides do not differ on the timing." passes new (a negation reads as open). No stored line has that form.

## Grade
PASS WITH LIMIT (the negation form). Evidence is stored text and plants only; the effect on a live send-back is not proven by any run.
