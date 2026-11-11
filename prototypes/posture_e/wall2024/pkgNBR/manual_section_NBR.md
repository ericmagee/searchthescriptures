# Engine manual section: pkgNBR (flags with an inner bracket)

Nodes: Format Markdown (export) and Build Save Body (the single judge's flags copied into review_notes). Prompt: none.

## What it does
Both nodes find REVIEW THIS ROW flags with one pattern. The old pattern stopped at the first "]", so a flag holding an inner
bracket (for example a K-W item "DEFENDER CR3 LINK 6 [premise 1] #5", or "pressed: [DR2] premise 5") was not found at all: it was
left out of the export's flag table, and the single judge's copy of it never reached the stored review notes. The pattern now allows
one level of inner brackets: `\[(?:EXTRACTOR|AUDIT) v\d+(?:[^\]\[\n]|\[[^\]\[\n]*\])*REVIEW THIS ROW(?:[^\]\[\n]|\[[^\]\[\n]*\])*\]`.
In 30 days of stored text no flag has deeper nesting.

## Limits
- Two levels of inner brackets would still be missed (none stored).
- Build Save Body cures only the flag forms its own key reader knows; it has no K-W or K-S3 key (pkgRVF changed only the export),
  so a single judge's K-W flag is copied as REVIEW THIS ROW even when that judge cured it.
- Record only: no grade, count or verdict reads these flags. Failure Salvage only appends to review_notes.

## Size
+42 code characters per node, +84 in all (measured); prompt 0.
