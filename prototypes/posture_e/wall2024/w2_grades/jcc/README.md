# W2 study: the closing-contradiction enforcer giving two answers on one pair (offline, study only, nothing built)

Data: every stored execution that ran the enforcers (ex34299, ex34626, ex34703, ex34726, ex34780; inputs/ holds none of these nodes). Scripts: dump_jcc.cjs, rows_jcc.cjs (rows_jcc_out.txt). Saved DeepSeek user messages: user_34726.txt, user_34780.txt, user_34703_CE.txt.

## 1. Confirmations on stored runs (MEASURED count; hand readings are W2's)
| Pair | Where confirmed | Not confirmed | Hand reading |
|---|---|---|---|
| D link 1, "coming together" is the 1:24 taking (CR2) vs "distinct from the taking" (CR4) | 34726 JCC + CE, 34780 JCC + CE | none | TRUE (all seats agreed earlier) |
| D link 4, Genesis 3:15 "not an independent proof" (CR2) vs "carries my D4 on its own words" (CR4) | 34726 JCC | 34780 JCC | WRONGFUL (W1, W3, W4, W2) |
| D link 6, "I drop the wording 'no biological father' as a bare statement. I rest it on these rows." (CR3) vs "Christ had no biological father." (CR4) | 34626 CE, 34703 CE (NEW) | none | W2: WRONGFUL. The closing states it after "D6 stands on Luke 1:35 and Matthew 1:20 ..." i.e. on the rows, which is what the CR3 sentence said it would do. Differs from the earlier hand reading of 34703 (TRUE): needs a second seat. |
34299: no confirmation. Total 7 confirmations of 3 distinct pairs; 1 pair wrongful by all seats, 1 wrongful on W2's reading.

## 2. Same input, two answers (MEASURED)
34726 and 34780 JCC: same model (deepseek-flash), temperature 0 in both bodies, the debate text byte-equal; the only input difference is the candidate lines (straight vs single quotes around "her seed"; J2 quoted longer). J1 CONFIRMED in one, NOT A CONTRADICTION in the other. So temperature 0 does not make the answer repeat, and one draw decides.

## 3. What lets a non-contradiction be confirmed
1. The candidate reaches the enforcer as two bare sentences. The instruction says to read the closing against the earlier rounds but does not tell it to read each sentence inside its own block. In the link 4 pair the earlier sentence sits in the block that narrows D4 to a support; the closing speaks of that narrowed D4.
2. The NOT-a-contradiction list covers a CLOSING sentence that narrows; it says nothing of an EARLIER sentence made inside a narrowing or a qualified drop ("as a bare statement ... I rest it on these rows").
3. The CONFIRMED reason may add words that neither sentence holds: 34726 J1 "carry D4 on its own words AS AN INDEPENDENT PROOF"; the closing sentence does not say "independent proof".
4. One draw at temperature 0 decides, and the result is not stable (section 2).

## 4. Smallest remedies (sizes ESTIMATE unless marked)
- R1 (prompt, both Build nodes: Judge Contradiction Build, Close Enforcer Build): add after the NOT list: " Read each sentence within its own block, as that block narrowed or granted it; a contradiction must stand between the two sentences' own words, not between words your reason adds." 180 characters each (MEASURED length), +360 prompt, 0 code. Addresses causes 1 to 3. Could be offset by shortening the NOT list, not drafted.
- R2 (code, prompt 0): confirm a pair only when two draws both say CONFIRMED (second DeepSeek call with the same body; a split goes to the record as NOT CONFIRMED, SPLIT). Addresses cause 4. Code about +400 to +700 per enforcer path (ESTIMATE), one more DeepSeek call per run where the enforcer runs; changes no text DeepSeek reads.
- R3 (prompt replace, about 0 net): replace "or differs only in wording" with "or differs only in wording, or holds again, on its rows, what the side dropped only as a bare statement". Covers the link 6 shape only; depends on the second seat's reading of that pair.
Not offered: making the judges' and the close enforcer's answers agree (the close enforcer already read the closing before the judges; requiring agreement would empty the judge path).

## 5. Limits
- Only 5 stored executions hold these nodes; 3 distinct pairs. NOT SHOWN: how often a split happens on a pair (needs paid repeat calls).
- No remedy is tested; R1 and R3 change DeepSeek-read text and go to the operator first.
