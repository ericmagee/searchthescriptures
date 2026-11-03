# Lexicon check against its source (2026-11-02)

Source: MetaV Strongs.csv (theonize/KJV-bible-database-with-metadata-MetaV-, master, CSV/Strongs.csv), fetched 2026-11-02, 14,300 lines, md5 72304f38839dcacebc5205086edacb13. The same file the 2026-07-05 import used (audit 1330, 1413).

## Findings (compared by per-bucket md5 over every row, then per row where a bucket differed)
1. Hebrew and Aramaic: every imported row (8,664) equals the source text exactly.
2. Greek: every imported row equals the source text, except:
   - 365 rows where the import left the CSV escape in place: a quotation mark is stored doubled ("" for "). Words unchanged. Example G32: an ""angel"" (source: an "angel").
   - 12 rows imported with an empty gloss, because the source description is empty for those numbers (G1393, G1435, G2434, G2471, G2606, G2733, G2920, G3875, G4069, G4627, G5536, G5598). The source also has 100 empty numbers G3203-G3302, which were not imported.
3. The 16 seed rows (ids 1-18, created 2026-07-03 and 2026-07-04, before the import) do not match the source. src16.json holds the source text for each. Example H5959: seed "young woman, maid, virgin"; source "feminine of [elem]; a lass (as veiled or private); damsel, maid, virgin." No audit row records who wrote the seed rows.

## fix.sql (superseded: applied by server-side fetch of the same file, see below)
16 UPDATEs setting each seed row to its source text plus the import's source tag (guarded: only rows without the tag), and one UPDATE undoing the doubled quotes in tagged rows.

## APPLIED 2026-11-02 22:2x CST (his "proceed")
- Undo record written first: build log 26492 (the 16 prior seed glosses and the 365 doubled-quote ids).
- The 16 seed rows were set from the source file fetched inside the database (http_get, file md5 72304f38 checked in the statement), so no text was retyped. Each row's new md5 equals the hash computed here from the same file.
- 365 rows: doubled quotation marks undone.
- Verification: per-bucket md5 of every row with a source description, table against file: 8 of 8 buckets equal (14,185 rows). Build log of the write: next id after 26492.
