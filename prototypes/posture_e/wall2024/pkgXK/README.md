# pkgXK: one reader for judge cure replies, on one exact item key (WALL-3627 item 1)

Approved by the operator 16:27Z 11-09 ("all approve. i want all in the next run"). Builder W2. Base: live s79 library (pkgLIB/strip_RPN; rebased from s78 strip_FUM after pkgRPN went live 11:05 CST).

## Stage A: exact item key (pkgLIB/strip_XK, build_XK.cjs)

Today the cure reader gives an item the FIRST line that matches it. A line naming two items can therefore take an item away from its own line when it comes first (FUM rev 6 grade: terra D2 #2 went CURED to UNCURED).

Change: among the lines that match an item, the reader takes the line that names the FEWEST distinct item keys (the link, or SIDE STANDING). On a tie it takes the first line, as live.
- cureVerdicts: respOf passes 1 to 3 and stmtOf. Pass 4 (lone rule) and the K-CMT/K-CMTL paths are unchanged.
- krulCure: among the cards krulMatch ties to the item, the card whose RULING target names the fewest K-RUL items of the build (xkCard). With no item list, the first card, as live.
- Two rules on one key (K-B D3 vs C6 and K-F D3 vs C6) count as one key. The first cut counted them as two, and the replay caught it (run 33705, grok's K-B statement took the K-F line). Fixed before grading.

Proof: probe_XK.txt (9 OK); test_XK_lib.txt (replay of every saved run, every library node).

## Stage B: JSON cure answers, line reader as fallback (pkgLIB/strip_XKB, build_XKB.cjs)

- cureBody: an OpenRouter cure call whose model is on the JSON list carries response_format json_schema "cure_lines" ({kind RESPONSE|STATEMENT|OTHER, item, text} in order) and a format note on the last user message. Any other model, and Gemini, is sent exactly as stage A.
- cureText: a reply that parses as cure_lines is turned back into the lines the stage A reader reads ("RESPONSE: item | text", "STATEMENT: item | text", OTHER as the whole line, in the model's order). Anything else (plain lines, cut-off JSON, other JSON) is returned unchanged, so the line reader is the fallback and nothing is lost.
- fumAsk2024: the follow-up repeats the format note when the first call carried the schema.
- The JSON list is set at build time: `XK_JSON_MODELS="id1,id2" node pkgXK/build_XKB.cjs`. Default: terra, sol, luna, haiku.

W4 check calls (required before the list goes live): `pkgXK/check_calls/<model>.json` are the request bodies, built by the stage B cureBody. Send each to OpenRouter chat completions and save the raw response, then `node pkgXK/make_check_calls.cjs grade <response.json> ...`. A model that FAILs is left off the list (rebuild with XK_JSON_MODELS without it); it keeps the line reader.

Proof: probe_XKB.txt (11 OK); test_XKB_lib.txt (replay stage A vs stage B).

## Files
- build_XK.cjs, plan_XK.json, probe_XK.cjs/.txt, test_XK_lib.cjs/.txt (stage A)
- build_XKB.cjs, plan_XKB.json, probe_XKB.cjs/.txt, test_XKB_lib.cjs/.txt, make_check_calls.cjs, check_calls/ (stage B)
- Write source for W4: pkgLIB/strip_XKB/patched (A and B together).

## Shared gate (s79, required)
- Stage A: `node gate/replay.cjs --base pkgLIB/strip_RPN --cand pkgLIB/strip_XK --out pkgXK/gate_XK.txt`: GATE PASS, 0 target item changes, 16 near-miss checks.
- Stage A+B: `node gate/replay.cjs --base pkgLIB/strip_RPN --cand pkgLIB/strip_XKB --targets pkgXK/targets_XKB.json --out pkgXK/gate_XKB.txt`: GATE PASS. Targets allow only the response_format lines, the ANSWER FORMAT note lines, and prompt_sent on item rows.
- Rev 2 (W1 3661): a matching line that names no item key under its own rule ranks after every line that names one (xkPick). Gate case XK-B-34016-terra-W1 (W1 probe line) fails on rev 1, passes on rev 2.
- New near-miss case gate/cases/w2_cases.json XK-A-34016-terra: a two-item line just before terra's D2 #2 line. Live s79 gives UNCURED (check fails on live); pkgXK gives CURED.
- Pack for W4: `node gate/pack.cjs pkgLIB/strip_XKB pkgLIB_XK` (after the check calls; rebuild strip_XKB with XK_JSON_MODELS first if a model fails).

## Rev 3 (W1 ASK 1, operator approved 18:16Z 11-09): cut-off JSON keeps complete answers
- xkJson2024: a reply that begins with { and names cure_lines but does not parse (cut off) goes to xkSalvage2024, which keeps every COMPLETE entry of the cure_lines array (string- and escape-aware brace scan, each entry parsed on its own) and drops the cut entry and anything after it. With no complete entry the reply is left as text, as before.
- Probe probe_XKB.txt 14 OK: cuts inside entries 1, 14 and 27 of 28 (terra 34016) read exactly as the line reply holding those complete lines; a cut before any entry falls back as stage A.
- W1's cut-off probe rerun (probe_XK_w1_trunc_rev3.txt): at 60% the four check replies keep 3, 3, 3 and 2 lines (rev 2: 0).
- Shared gate A+B on rev 3: gate_XKB.txt.
