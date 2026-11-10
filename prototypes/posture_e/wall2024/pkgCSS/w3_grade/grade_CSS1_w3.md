# W3 grade of pkgCSS rev 1 (W1, commit 282993eb): FAIL, one fix (Close Enforcer Record). Everything else passes.

Graded 23:51 CST 2026-11-09 (database time). Script pkgCSS/w3_grade/w3_css.cjs, output w3_css.txt, log rows rows_w3.json.

## Passes
- Base: built on live s104 (fetchback_live_s104.json). My rebuild with build_CSS.cjs is byte-equal to parent_s104_CSS.json. Against s104 only Close Enforcer Build and Close Enforcer Record differ; connections and settings equal; 418 nodes.
- Wiring: the IF node passes every item; the DeepSeek call node is an HTTP node (one call per item, error kept in place), so replies pair to Build items by position. Record is the only reader of the Build items. Panel Build, Build Independent Verdict, Judge Contradiction Build and the library read only cec.confirmed and cec.rows, whose shape is unchanged.
- Build on all 35 stored debates: each side's section is equal to the live prompt's section for that side; no round of the other side in a call. (No stored debate carries an Oracle candidate, so I planted one: it goes to the defender call only, P10, and is answered and confirmed there, P11.)
- Record, mixed replies: challenger-only break (P1), both sides with id NEW (P2), both calls failed reads NOT CHECKED as live (P6).
- Size, measured again by me: largest call mean 143,384 to 77,010 characters (-46.3%); total sent per debate +1,242 characters (+0.87%); node code -228 and +321, net +93. The figures in the Wall post stand. Not measured: DeepSeek's reasoning and reply tokens over two calls, and the wall-clock time of two calls in sequence.
- Rolled-back insert of my rows: rows 2, recorded true.

## FAIL: a side that was not read is logged as NONE FOUND, or not logged at all
Live has one call, so a failed or empty reply always logs NOT CHECKED. With two calls joined into one text, one side can fail while the other answers:
- P3: defender call fails, challenger replies NONE. Log row: item NONE, "NONE FOUND -- DEFENDER: no reply (timeout)"; cec.none is true. The defender (where the 34108 drop and reclaim stand) was never read, and the row leads with NONE FOUND. Live logs "NOT CHECKED".
- P12: the same with an Oracle candidate X1: X1 logs "NO ANSWER -- the enforcer did not answer this candidate" (wrong cause) beside the NONE FOUND row.
- P4, P5: one call fails and the other returns any line. No log row carries the failure (reply_error is null on every row); it stands only in cec.errors, which is not stored.
- P7, P8: one reply holds no CLOSE-CONTRADICTION line (prose, or empty) and the other replies NONE. Logged NONE FOUND with no error. Live logs NOT CHECKED with "the reply holds no CLOSE-CONTRADICTION line". This is the same class as the fault the package exists to close: a side not covered, with a clean row.
T6 of the builder's checks labels the P3 result as correct; I do not agree.

## Fix asked (Record only)
Judge each reply by itself before joining: for each Build item, when its call failed, or its reply holds neither a line nor NONE, write one row "NOT CHECKED" naming the side (item "<SIDE> NOT CHECKED", reply_error set), and log that side's candidates as NOT CHECKED, not NO ANSWER. Write "NONE FOUND" only when every side that was sent replied and no row exists; cec.none true only then.

## Note, not a fail (same as live)
P9: a true contradiction the defender call returns with the label CHALLENGER reads NOT CONFIRMED (form). In a one-side call the code knows the side; it could take the side from the call. Suggestion for rev 2 or later.

## Unproven
How DeepSeek reads one side per call (the 34108 D6 drop) is shown only by the replay through the test relay.
