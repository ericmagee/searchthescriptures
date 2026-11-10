# W2 grade of pkgCSS rev 2 (W1, commit 62c62270, Wall 4069): PASS

Second grader. Labels G1-G10 committed before the first run (e38b2b4e). Script `w2_css.cjs`, output `w2_css_run.txt`: 10 OK, 0 FAIL.

My test faults, fixed after the first run with labels unchanged (written in the script header):
1. require paths;
2. log rows carry their status at the head of cure_reason, because cure_status is null by table rule;
3. 34108's [DR4] yields no Oracle candidate, so G8 plants two OPPONENT'S CONTRADICTIONS lines into a copy of it.

## Base and build
- `parent_s104_CSS.json` against the s104 fetch-back: 418 nodes; only Close Enforcer Build and Close Enforcer Record differ.
- `build_CSS.cjs` run on the s104 fetch-back rebuilds the write file byte for byte.
- Close Enforcer Build is the same in rev 1 and rev 2. Only Record changed.

## Planted forms
The oracle is live Record given the two replies joined into one reply: the same text, one call.
- **G1**, all 39 stored debates. The candidate skips exactly when live skips. There is one item per side whose closing round has text. Each side section, the system text and the body parameters are byte-equal to live. The instruction is prompt_side.txt. The candidates equal live's, each on its own side.
- **G2**: defender NONE, challenger CONFIRMED (real DR3/DR4 quotes). C1 breaks, the defender gets a NONE FOUND row, and none is false.
- **G3**: both sides CONFIRMED. Two breaks, equal to live.
- **G4**: the defender call times out and the challenger CONFIRMED. C1 breaks, the defender gets a NOT CHECKED row, and the error names the defender.
- **G5**: the defender reply holds D6 CONFIRMED and a NONE line. D6 breaks, equal to live.
- **G6**: the same pair is CONFIRMED in one call and NOT A CONTRADICTION in the other. It reads as conflicting answers and nothing breaks, equal to live.
- **G7**: the defender call answers with a CHALLENGER line using defender quotes. It reads NOT CONFIRMED (form) and nothing breaks, equal to live.
- **G8**: two planted Oracle candidates go on the defender item only. The first is answered and the second is NO ANSWER, equal to live.
- **G9**: a repeated D6 line gives one break, and the repeat is noted.
- **G10**: an empty defender reply with a challenger NONE gives NO LINE DEFENDER, NOT CHECKED. None is false and nothing breaks.

## Size (reproduced: my run of size_CSS.cjs is identical to size_CSS.txt)
- Per DeepSeek call: the mean largest call goes from 143,384 to 77,010 characters (-46.3%).
- Per debate: the total sent is +1,242 characters (about 311 tokens, +0.87%), because the instruction is sent twice.
- Node code: Build -228, Record +874, net +646 bytes.
- Model calls: one more DeepSeek call per debate, two instead of one.

## Notes (not faults; same as live)
- **G7**: when the defender call answers only about the other side, no row says the defender went unchecked. The line is logged as NOT CONFIRMED (form) under CHALLENGER.
- **G5**: none reads true beside a confirmed break when one reply carries both, as live does on the same text.
- Not measured: DeepSeek reasoning over two calls. The replay through the test relay would show it.
