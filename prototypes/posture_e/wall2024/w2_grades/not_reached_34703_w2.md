# NOT REACHED items of execution 34703: which stored debate could reach each one on a dry regrade (W2, 11-10)
Sources: stored executions ex34703, ex34626, ex34299 (dry regrades of 34108) and ex33490, ex33371 (live, 11-07); debate_judgments, debate_replay_judgments and debate_enforcer_log; the s112 fetch-back (wiring). Offline; nothing built.
A dry regrade re-calls every judge and DeepSeek, so a trigger that depends on a model's reply can be made likely by picking a debate, but never certain. A trigger fixed by the wiring or by the debate text is certain either way.

| Item | What reaches it | Stored evidence (measured) | Best stored debate for a dry regrade | Verdict |
|---|---|---|---|---|
| Single judge (and SJ re-ask) | Regrade After Quotes? sends a regrade (regrade = true) to Anticheat Build; only regrade = false reaches Build Independent Verdict | It ran in live 33371 and 33490; it did not run in 34299, 34626 or 34703 | none | ONLY A LIVE RUN (wiring) |
| Round 2 and the pkgF3A retry (one path: pkgA2R round 2 offers the same model once when the round 1 reply is unusable) | a removed seat, then an unusable alternate reply; the pool is haiku only | Unusable alternate replies stored: 6 (qwen null x3, glm null x1, glm no JSON x1, haiku JSON parse x1). haiku: 1, in 34626 (dry regrade of 34108) | 34108 (it produced the only stored unusable haiku reply) | MODEL-DEPENDENT, rare |
| pkgGCC narrow (rev 3) | a counted send-back line (v40 to v48, v51) and an applied gate change curing the same S | 9 counted send-back items stored (runs 33149, 33461, 33482, 33490); 1 with a gate cure on the same S: 33490 gemini S8 (pkgECF) | 33490 | MODEL-DEPENDENT |
| pkgGUB rev 2 | a pkgUND count (v42) and an applied gate change on the same S | v42 counts only in 33149 (chatgpt S17, S18; sol S17 KEEP); none had a gate item. 0 stored cases of the full trigger | 33149 (nearest: the only pkgUND counts) | MODEL-DEPENDENT; never seen whole |
| pkgGCP rev 1b | a counted v21 cure line whose line a later applied send-back or gate change replaced and cleared | W3's sweep: 10 rows in 4 runs (33371, 33490, 32973, 33846); W1's stored replay of 33490: gemini 8 to 2 | 33490, then 33371 | MODEL-DEPENDENT |
| pkgRLF rev 2 (bare "[N]" label) | DeepSeek's closing-enforcer reply writing a bare "[4]" | 2 of 40 stored per-side replies, both from 34108; 34626 and 34703 used "[round 4]" (pkgRLF rev 1) | 34108 | MODEL-DEPENDENT (DeepSeek fix) |
| pkgACM (period after the last quote) | DeepSeek's anti-cheat answer ending with "." | stored in 33389 (X34, X36) and 33617 (X75); 0 of 114 lines in 34626 | 33389, then 33617 | MODEL-DEPENDENT (DeepSeek fix) |
| KEEP readers (KQG2, KVQ, KBG5, KDV2, KVL2, KBN, KBF) | a judge answering an E-ANS send-back with KEEP | 189 of 1,568 stored E-ANS send-back answers are KEEP (12%), in 30 runs, including live 34108. Most: 32949 (25), 32924 (20), 33482 (17), 33025 (16), 33371 (13) | 32949 or 32924 | MODEL-DEPENDENT, common |
| COUNTED reader (K-S3) | a judge answering a K-S3 cure item with COUNTED | 2 cure rows in all stored data, both in run 33149 (chatgpt, sol: "COUNTED: ... Jeconiah had a son, Salathiel") | 33149 | MODEL-DEPENDENT, rare |
| pkgVPD (VP3 trial deferrals) | an E-ANS item on a verse whose answering round defers to a LINK or a round | VP3 trial notes in 5 stored executions: 34703 12, 34626 7, 34299 1, 33490 0, 33371 0; none names a deferral. W1's cases were plants on 34108 terra Luke 1:34 | none found | MODEL-DEPENDENT; no stored case |
| pkgVP4 (assumption check) | an UNSUPPORTED-L4 premise carrying ASSUMES in [DR2] or [CR3] (debate text) | It RAN in 34299, 34626 and 34703: 8 facts, 2 with both readers NOT STATED, 6 items each time (Assume Check Record, acx) | 34108 (already) | REACHED, record-only; it does not belong on the NOT REACHED list unless "reached" means something more than its items |

Notes:
- pkgGFC, pkgQRD and pkgKSR+ECB were reached in 34703 (W3 Wall 4336; W2 Wall 4331 for pkgQRD).
- pkgK7C (offline) would be reached by 34108 again: every dry regrade of 34108 has the confirmed D6 contradiction.
