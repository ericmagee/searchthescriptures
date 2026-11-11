# Engine manual section: pkgNBR rev 2 (flags with an inner bracket)

Nodes: Format Markdown (export) and Build Save Body (the single judge's flags copied into review_notes). Prompt: none.

## What it does
Both nodes find REVIEW THIS ROW flags with one pattern. The old pattern stopped at the first "]", so a flag holding an inner
bracket (for example a K-W item "DEFENDER CR3 LINK 6 [premise 1] #5", or "pressed: [DR2] premise 5") was not found at all: it was
left out of the export's flag table, and the single judge's copy of it never reached the stored review notes. The pattern is now
one alternation: first a form that allows one level of closed inner brackets, else the old form, so every flag the old pattern found is
still found (for example a quotation cut off after an open "[" with no "]"):
`\[(?:EXTRACTOR|AUDIT) v\d+(?:[^\]\[\n]|\[[^\]\[\n]*\])*REVIEW THIS ROW(?:[^\]\[\n]|\[[^\]\[\n]*\])*\]|\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]`.

## Limits
- Two levels of inner brackets ("[[CR3]]") and an open "[" followed later by a closed pair ("[CR3] AND [CR") are still missed, as before.
  Stored in 30 days: 3 single-judge flags of these forms; 0 panel flags.
- Build Save Body cures only the flag forms its own key reader knows; it has no K-W or K-S3 key (pkgRVF changed only the export),
  so a single judge's K-W flag is copied as REVIEW THIS ROW even when that judge cured it.
- Record only: no grade, count or verdict reads these flags. Failure Salvage only appends to review_notes.

## Size
+102 code characters per node, +204 in all (measured on live s133); prompt 0.
