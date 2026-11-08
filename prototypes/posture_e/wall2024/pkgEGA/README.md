# pkgEGA (W1, 11-08): DeepSeek K-W/K-S3 Enforcer Record reads "G<k>/A<k>.<n>" answer ids

Fault (33506, replayed on live s54 code, EGL v2 included): DeepSeek wrote its verdicts as "ENFORCER: G2/A2.1 -- AGREE -- ...". The Record reads an
answer id only when the line starts with A<k>.<n>, and an item verdict only for "G<k> --"; "G2/A2.1" fits neither, so 35 of 36 answers were
ENFORCER NO VERDICT although DeepSeek had answered each one on its own line.

Change (Enforcer Record only, base live s54 250ff3e1b2e1 -> 0e55e8d2a3db): the A-id pattern accepts an optional item label before the id, "G<k>/",
"ITEM k/", "k/" (also ":" or "," as the separator). The label is read only when its k equals the answer's item number; a line whose label disagrees
is not read (stays NO VERDICT, as today). Plain "A<k>.<n>" lines read exactly as before; the G<k> item-verdict branch (pkgEGL) is unchanged.

Test `node --max-old-space-size=6000 pkgEGA/test_EGA.cjs` (test_EGA.txt): 7 OK, 0 FAIL.
- replay over every saved run whose inputs reach the Record (20 runs; 7 older runs lack Enforcer Build): only 33506 changes,
  tally {AGREE 0, DISAGREE 1, NO ANSWER 0, NO VERDICT 35} -> {AGREE 22, DISAGREE 6, NO ANSWER 8, NO VERDICT 0}; no row that had a verdict changes.
- 33506: each of the 35 "G<k>/A<k>.<n>" lines puts its own verdict on its own answer (35/35).
- units: disagreeing label not read; plain A-id unchanged; "ITEM 2/A2.2", "4: A4.1", markdown and spaces read.
EGL v2 (live since 33530) removed G labels from the prompt headers; this still matters because DeepSeek wrote item labels before EGL too, and
"ITEM k/" is the form the new "ITEM k OF n" headers invite.
Revert: base Enforcer Record (live s54).
