# CONFIRM: ASK AAR rows 186 to 197 (coordinator request): ALL TWELVE MATCH
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 21:05 CST 11-24.

Method: per-column md5 of to_jsonb(row) and ask_aar_builders (builder_seats, sources), 27 keys per row, against the drafts parsed by g_aar/draftmd5.py. Same query returned ask_aar_snapshots_check() and ask_aar_grades_check().

| id | ask rev | prior | objective_met | draft | keys eq | row_md5 (check d) | builders |
|---|---|---|---|---|---|---|---|
| 186 | 588 1 | 185 | in part | aar_row_588_run42373_draft3 adbe2171 | 27/27 | 5688f229cdea55ff3103505c0ae52c73 | 1 |
| 187 | 587 3 | 158 | in part | draft2 4197544e | 27/27 | d2bf83d8b26917f9ccb5087b7e2d7c4a | 1 |
| 188 | 593 1 | 160 | in part | draft2 f5d3eade | 27/27 | a050ac4086ffb1bc2722ece54ce82880 | 1 |
| 189 | 590 1 | 161 | in part | draft2 7c92a84e | 27/27 | 7298e571ee21de1170357ab0ef2de76b | 1 |
| 190 | 586 J1 | 163 | in part | draft2 25cbf7d0 | 27/27 | ca454884491ab28f4c2a05f76a053338 | 1 |
| 191 | 586 J6 | 164 | in part | draft2 a678d0cb | 27/27 | 37e2c9875a7c2cdd4f03f0cee41e936b | 1 |
| 192 | 586 J2 | 166 | in part | draft2 d7863283 | 27/27 | ea6a05ecaa26b30edd36f5edffe71223 | 1 |
| 193 | 586 J3 | 167 | in part | draft2 f747f645 | 27/27 | bb332145ad3bfc1b306c92749026a2a4 | 1 |
| 194 | 591 0 | 169 | in part | draft2 02f8bea3 | 27/27 | 2ac9b86cd7369bafea66fed1b1b9711a | 1 |
| 195 | 601 1 | 172 | in part | draft2 e60ce9ea | 27/27 | 5ba88415496ecf8425eeaf59f50df5d1 | 1 |
| 196 | 623 1A | 174 | in part | draft2 16680581 | 27/27 | 0ca26e17fcbccc30a43bc3f99849268b | 1 |
| 197 | 608 1 | 176 | in part | draft2 01ec4711 | 27/27 | 53572dc055f3a98b24aaf8922fc948b6 | 1 |

- Every row_md5 equals the coordinator's list. Every snapshot check code is d.
- ask_aar_grades_check(): every entry for 186 to 197 ok=true (28 grade lines, pass seat W1).
- Priors 185 (186) and 176 (197) as stated. All twelve read 'in part', consistent with the two-live-runs rule.
