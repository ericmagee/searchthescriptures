# ASK 420(b) build (W1): engine manual readback script

Assignment Wall 8826 (item 8 of 8821): build W1, grade W2 and W3. A tool in git; no system change.

- `mrb.cjs`: `node mrb.cjs <base_version> <new_version> <pairs.json>` prints one read-only SELECT (no write word).
  Run it with execute_sql. It applies the pairs to the base version in SQL, in order, with replace(); each pair must
  occur exactly once in the text as it stands when applied. RESULT is MATCH only when every pair occurs once and the
  applied text equals the stored new version in md5 and length; otherwise MISMATCH with the reason. The last row shows
  the new version's engine_manual_log row; rows are ordered by an explicit ORDER BY (W2 8880 note). It does not call engine_manual_apply (ASK 421), so it is a second reader of it.
- `plants.cjs`: `node plants.cjs <pairs.json> <out_dir>` writes 4 wrong pair sets (pair 1 new text + one space;
  pair 2 old absent; pair 1 old = one space; last pair dropped).
- `pairs_v191_v192.json` (sha256 03a7401700e0): the 4 pairs of engine manual v192 (ASK 374 and 376 entries).

## Shown
- Prod, read-only, 191 -> 192: pairs 1-4 each occur once; RESULT MATCH, md5 be475a1e200c2b99f3f72a6e42f33991,
  length 567,729; base v191 md5 2e0b969951a29c5e30c7e7118ba99934; log row "ASK 374 and ASK 376 entries", char_len 567,729.
- Local copy (/tmp/pg421, v191 and v192 from prod): the same MATCH. Plants all MISMATCH: new_changed (md5, 567,730),
  old_absent (2=0), old_short (1=102388 and 2-4 = 0), pair_dropped (md5, 566,001); base 190 not found; version 193 not found.

## Limits
- The pairs file must be the one used for the write; the script proves the stored text equals base + those pairs, not
  that the pairs are right.
- The whole SELECT carries the pairs inline, so a large pair set makes a large statement.
