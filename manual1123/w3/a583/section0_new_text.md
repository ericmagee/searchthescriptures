# ASK 583: new text for engine manual section 0 (part '00.1'), two bullets change, one bullet is added; the other four are untouched

## Bullet 1, NOW
- The active version is `SELECT max(version) FROM engine_manual`. `SELECT engine_manual_toc()` gives the live map. The revision history is `engine_manual_log`.

## Bullet 1, NEW
- The manual is held in parts: table `engine_manual_parts`, one row per part per version of that part. `SELECT engine_manual_toc()` lists the parts. `SELECT engine_manual_part('<part>')` gives one part; `SELECT * FROM engine_manual_full()` gives the whole text and its version. The manual's version is the highest part version. The revision history is `engine_manual_log`; its column `part` names the part a version changed. The parts are read in the order `engine_manual_toc()` gives. The table `engine_manual` holds the whole-text versions up to the cut and is not written again.

## New bullet, placed directly after the "To revise" bullet
- New text enters only through engine_manual_part_apply on an existing part. A part that has grown is divided in two with engine_manual_part_split, at a text that occurs once in it, with no change of text; no part and no size is refused.

## Bullet 4, four phrases change (the rest of the bullet stands)
- NOW: To revise: call engine_manual_apply (ASK 421) in the same batch as
  NEW: To revise: call engine_manual_part_apply on the one part (engine_manual_apply refuses now that the manual is in parts) in the same batch as
- NOW: it refuses unless the base is the max version and has the given md5
  NEW: it refuses unless the base is that part's latest version and has the given md5
- NOW: it inserts version+1 with its summary
  NEW: it inserts that part at the manual's highest version + 1 with its summary
- NOW: the readback is mrb.cjs (ASK 420(b))
  NEW: the readback is mrb.cjs with the part as its fourth argument, node mrb.cjs <base> <new> <pairs.json> <part> (ASK 420(b))
