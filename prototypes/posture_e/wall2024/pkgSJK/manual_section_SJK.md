# Engine manual section: pkgSJK (single judge's K-W and K-S3 cures in the stored review notes)

Node: Build Save Body only. Prompt: none.

## What it does
Build Save Body copies the single judge's REVIEW THIS ROW flags into review_notes. A flag is stored with "CURED by the single judge's
cure reply; recorded, not for review." when its key is in the set read from that judge's CURED rule reports (AUDIT v21 DEBATE RULE
VIOLATION REPORT). Before this package the key reader had no K-W and no K-S3 form, so those flags were always stored as REVIEW THIS ROW.
- K-W key: the item "<SIDE ROUND ...> #N" before the quotation, matched to the report ITEM (same key as the export, pkgRVF).
- K-S3 key: side and round plus the first 40 letters and digits of the conceded sentence, matched to the report's LINE field (same as pkgRVF).
- The report reader now also reads a report whose ITEM holds a closed bracket pair ("LINK 6 [premise 1] #5"). It tries that form first,
  else the old form, so every report the old reader read is still read; an ITEM with a lone "[" is still read.

## Limits
- Two K-S3 flags of one single judge whose sentences share the first 40 letters and digits share one key (as in pkgRVF).
- Reports other than AUDIT v21 are not read (all stored K-W and K-S3 reports are v21).
- Record and display only: review_notes is shown by the dashboard and appended to by derive_debate_outcome and Failure Salvage; no grade,
  count or verdict reads these flags.

## Size
+586 code characters (measured); prompt 0.
