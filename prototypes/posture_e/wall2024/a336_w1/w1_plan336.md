# W1 grading plan, ASK 336 ([L2] list binds to its [L1] run), prepared from live s221 67e89720

## What live does (measured)
- L2 Count Plan `tags()` binds each [L2] tag: `vs = own refs of the tag segment ∪ refsIn(blockAt(t,i))`
  (or the line only, when the line is a `-- MEANS:` press line).
- `blockAt` (L2 Count Plan copy): headers H = `LINK n`, numbered item, `#` heading, `UNSUPPORTED-L4 PREMISES`.
  When the block is not a link head it takes the paragraph (`\n\n` to `\n\n`); if that paragraph has no
  reference it extends back ONE paragraph only. That is the 37510 fault: the [L2] list paragraph
  ("[L2] standing in these rows: ...") has no reference, so it binds to the one [L1] paragraph above (Matthew 1:20).
- 37510 claude_r2 shape: `## I. LINK ROUND` (heading) / `**LISTED PREMISE 1 — LINK 2 (...)**` (not a header
  to blockAt: starts with LISTED) / `Footing exhibited:` / [L1] Matthew 1:18 / [L1] Matthew 1:20 / [L2] list / [L3] / [L4].
- The second binder (329 trial, ~char 30835 of L2 Count Plan) also calls `L2C.blockAt` and keeps its own B sets.

## Checks
1. LOCAL CHANGE: the run rule must live in the [L2] binding path only (tags() and the 329 binder), NOT inside
   `blockAt` itself, because blockAt also serves link blocks, PRESSED WITH, Citation Scan and the judges' builds.
   If W4 changes blockAt, every non-[L2] caller needs its own PRE/POST equality proof.
2. COPIES: W4's sort of the blockAt copies (6 Shared Library lines, 23 standalone nodes). For each copy left
   out, the reason (its caller builds no [L2] tag). Every copy that builds [L2] tags must be identical (sha per copy).
3. MAP lengths and header sha recomputed if the Shared Library changes; node --check every touched node.
4. PLANTS (7013 P1-P6) through the built tags(), PRE vs POST, plus:
   - P7 the stored 37510 claude_r2 text: G4905, G4250, G2147, G1064 COUNTED at Matthew 1:18; G4815 at Luke 1:31;
     G1097, G435 at Luke 1:34 (original_words, measured at 7018). G1537 and G1080 stay COUNTED.
   - P8 bold [L1] heads (`**[L1]** Matthew 1:18`) and `[L1] **Matthew 1:18**`: still in the run.
   - P9 "Footing exhibited:" line and a bold premise line above the run: the run stops there (D1).
   - P10 [L2] tag inside a numbered/LINK block (linkHead true): unchanged (whole link block, today's binding).
   - P11 `-- MEANS:` press line [L2]: unchanged (line binding).
   - P12 [L2] with its own reference and [L2] | [L3] pipe form: unchanged (D4).
   - P13 two [L1] paragraphs joined by a single newline (one paragraph today): unchanged result.
5. REPLAY (68 debates, live L2 Count Plan PRE/POST): every tag that changes, with run, round, numbers, run verses.
   COUNTED -> NOT COUNTED must be 0 outside D3 own-language cases; each D3 case listed by itself.
   drvCheck and kl2Lines on stored judge replies: which judges' [L2] lines change, any K-L2 removal that comes or goes.
6. 329 trial comparison rebased on 336 (order: 336 then 329 compare).
7. Reasoning guard on the package diff. Ruling 383: the card says plainly that the judges' [L2] lines change.

## Next-run watch list (W1)
- ASK 334: each E-ASSUME rows_give must not contain "PRESSED WITH" (the seat may still write PRESSED WITH on the STEP line).
