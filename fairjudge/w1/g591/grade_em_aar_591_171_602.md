# W1: Wall 11570 (W3) items 1-3, ASK 591 fix 2 proof, ASK 602 (W4), 09:48 CST 11-24
Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. RULES READ: 497, s7.4, scope rule, 512. STANDARD (ASK 599): 602 met (two changes, syntax clean).

## (1) READBACK ASK 594 manual entry: MATCH
10.0 v300 md5 876d9be2, 43,098 chars = my graded preview (11566); v286 521226 (43,079) unchanged; only 10.0 at v300.

## ASK 591 fix 2 proof: SHOWN
odv1_judge_order_log row 2, saved_at 15:43:40Z (09:43 CST), saved_by dashboard; after: panel sol, sol62, spark; alternates chatgpt, qwen4max, gemini, argon, sonnet; the table holds that order. The save ran under the API role's safeupdate guard and passed.

## (2) GRADE ASK 591 (+ fix 1, fix 2) manual pairs e690ae0e and AAR row aeb58e05: PASS WITH F1
- 10.0 base v300 latest; six OLDs once each; preview by SQL (JSON pasted, recursive replace) 47,523 chars md5 8f8ac12a = W3's.
- Lines against live: read node executeOnce, retry, maxTries 3, no onError, credential "Supabase account" = Write Tokens' credential; both throw texts verbatim in Accept Build and Init Seats; start paths Debate Start -> Library Check and Manual Start -> Dry Run Config -> Judge Order Read -> Accept Models; Init Seats outputs judge_order and still names single_judge; tables: RLS on, 0 policies, no grant to anon/authenticated; dash_api checks the passphrase hash before any action; dash_judge_order fields as stated; dash_judge_lineup holds NOT_PANEL, JUDGE_TIME_REMOVED/TIME_REMOVED, FAM, FAM_PANEL, JFAM_OR; "LIVE AS OF ASK 437" entry exists in v300; fault check strips comments; save WHERE true. "A regrade enters by the same start path": W3's reading (the regrade route not traced by me).
- Row: md5_written e8a3c37a = target_engine_591.json and the live engine I read back (11547); 47b637c5 = live save def md5 (my read 09:34, 11561). All 16 file md5s confirmed by my md5sum. 'in part' right (no run).
- F1 (both): the save is now shown. Manual Limits "A save from the page is not shown; its mark is version 2" and the row's "EXPECT on the operator's next Save" are stale: state "the page's save is shown: log row 2, 09:43 CST 11-24, saved_by dashboard".

## (3) GRADE 17.1 pkgMUS pair 25704163: PASS
17.1 v281 latest; OLD once; preview 20,633 chars md5 bc653584 = W3's. NEW true of live (recorder accepts only its own list). Nit: "of gemini or spark" narrows the old general claim; "a reserve substitution is not shown by a run" would do.

## ASK 602 (W4, fix3/judge591.js 6b871855; base 1aec0757 = live AJ7N file, sha1 b00c6868): PASS
Diff is the two named changes only: one injected style rule #jolists .btn:disabled (grey, opacity 1, not-allowed); the line-up heading "(preview only; nothing here is saved)". Save and Undo sit in #jolists and are disabled when JO.dirty is false; node --check clean.

## READBACK ASK 602 deploy (Wall 11576, audit 41496): MATCH
Alias truth-app-dashboard.vercel.app -> dpl_HpfP5aLJ24XMAKupFK7we5L6fnUn. judge591.js sha1 312a8119 = the graded fix3/judge591.js (md5 6b871855); the other 7 files unchanged from AJ7N.
