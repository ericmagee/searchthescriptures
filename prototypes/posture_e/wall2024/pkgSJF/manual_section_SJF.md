# pkgSJF: the single judge's full re-ask also covers a judgment with no COLLISION POINTS section

Built offline on s136 by W2. File parent_s136_SJF.json. Nodes: SJ Re-ask? (If) and SJ Re-ask Build (Code). No other node, no connection, no library line changes.

## What it does
The single judge's first Verdict is read by Extract Independent Verdict. When that judgment has no COLLISION POINTS section, the extractor writes the audit line "COLLISION MAP: NO COLLISION POINTS SECTION" into independent_verdict_raw.

Before this package, the one re-ask (pkgSJR) ran in FULL mode only when the verdict word was missing or UNKNOWN. A judgment that named a verdict word but had no collision points got MARKS mode (only the two CHAIN MARK lines asked for), or no re-ask at all when both marks were present. The saved record then had no collision points from that judge.

With this package, on the single judge (jidx 5) under audit prompt ODV1-A2:
- SJ Re-ask? also fires when that audit line is present.
- SJ Re-ask Build adds "no COLLISION POINTS section" to the miss list and uses FULL mode: the judge is asked to write the whole judgment again. The fixed ask text is unchanged.
- SJ Re-ask Pick, unchanged, takes the re-ask reply whole in FULL mode.
The re-ask still runs at most once per run.

## Forms it catches
- A verdict-word decline (for example "Provisional result: BROKEN ..." with no rulings).
- A judgment wrapped in JSON ({"reasoning": ..., "verdict": ...}, plain or fenced). The verdict reader does not unwrap it, so its collision points are not read.
- A collision heading the extractor does not read, such as "4. COLLISION POINTS:".

## Forms it leaves alone
- A full judgment, and a partial judgment with a LIMITATION paragraph that still has COLLISION POINTS.
- "## COLLISION POINTS", "**COLLISION POINTS:**" and "COLLISION POINTS: NONE": the extractor reads these headings, so the audit line is not written.
- Panel judges (jidx other than 5).

## Limits
- If the judge declines the FULL re-ask too, the record holds the second reply whole. Before, MARKS mode would have added the two mark lines to the first reply. So in that case the record can lose its chain marks. One call is spent either way.
- A numbered heading ("4. COLLISION POINTS:") on an otherwise full judgment fires a FULL re-ask. Today the collision points of such a judgment are not read either.
- It reads the audit line's exact wording. If the extractor's wording changes, this package stops firing.

## Size (MEASURED against s136)
SJ Re-ask Build +184 code characters; SJ Re-ask? expression +90 characters. Prompt 0 fixed. When it fires, the miss list carries "no COLLISION POINTS section" (27 characters), and the FULL ask replaces the MARKS ask.
