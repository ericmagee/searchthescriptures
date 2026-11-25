# ASK 632 build b1 (W1, offline)

Plan: ask632/w1/plan632.md rev 1 (W4 grade PASS WITH N1-N3, Wall 11988; N1-N3 applied).
Base: live engine moMxiV4Irg1uRBZN version 066525aa (copy base_eng.json).
Builder: b632.cjs (2b9d009e). One statement replaced in place in Panel Tokens __CU, OpenRouter/other branch:
  old: e.i=__N(u.prompt_tokens)-e.cr-e.w5;
  new: if((e.w5>0&&e.w5===e.cr)||__N(u.prompt_tokens)-e.cr-e.w5<0){e.ov=1;e.i=Math.max(0,__N(u.prompt_tokens)-e.cr);}else e.i=__N(u.prompt_tokens)-e.cr-e.w5; /* ASK 632 ... */
Target: tg/target_engine_632.json (d46b0b59). Changed nodes: Panel Tokens only; 423 nodes both sides; connections equal.

Tests:
- t632.cjs (44dbc1ad): ALL PASS (20), tg/out_t632.txt (b11b52e1). 1922 stored entries (fx/or_entries.json 6f5c47bc) rebuild exactly.
  C1 57 negative entries -> i = prompt - cr, ov 1. C2 1865 other entries byte-equal. C3 7 synthetic cases. C4 structure. C5 the line differs only by the tagged statement (exact compare, NEW read from b632.cjs). C6 per-model i sums: 19 models unchanged; gemini-3.8-flash 29593 -> 1818652 (= old + 1789059, the w5 sum over the 57).
- Standing set with live child aad0ad9c: target 31 PASS 0 FAIL (tg/out_standing_632.txt 8a425031); base 31 PASS 0 FAIL.

Mistake reported: the first t632 C5 check used a regex whose [^;]* could not cross the semicolons inside the braces, so C5 failed on a correct build. Replaced by an exact comparison. No build change.
Shared Library untouched; child untouched. Write is W4's (op doc s29). Revert: restore 066525aa.
