# engine_manual v178 draft (W3). Base: v177, md5 8e1a80d8273e5f1506dd0226cc4a8d1d, 507,412 characters.

Ten guarded literal edits, applied in order. Each OLD occurs exactly once in v177 (checked by SQL on 16 Nov), and no NEW text holds a later OLD.
Expected length 523,374 (+15,962). Build: build178_expr.sql (read-only SELECT); it returns no row if v177's md5 differs.
Body law (engine_manual section 0): no provenance in the new text. Grades, cards and write reports go in the log row (LOGROW below).

## E1 ASK 347 entry (section 6)

OLD:
```
connections unchanged, W4 7057).
- D3 LINK ROUND:
```
NEW:
```
connections unchanged, W4 7057).
- A CHARGED ASSUMPTION IS CARRIED INTO THE ROUND 2 PREMISE LIST (ASK 347, pkgACR rev 2; C2 Build and Init with Guards):
  - What it does: C2 Build (+485 characters) adds, after the sentence that ends "...alone, every or no other." and before "After the quote, write PRESSED WITH:": "If your earlier rounds charged an assumption (CHARGE THE ASSUMPTION), carry each such charge into this list as its own numbered premise: LINK n:, the defender's own words that assert the fact, quoted verbatim, and the STEP/ASSUMES/ROWS GIVE line. If no words of the defender assert the fact, do not list the charge. The STEP/ASSUMES/ROWS GIVE line carries none of the words no, not, none, never, only, without, alone, every or no other. A charge left outside this list is not graded." Init with Guards (+81 characters) ends the CHARGE THE ASSUMPTION paragraph of the Oracle system prompt, after "never ask a verse to state the conclusion.", with: "Charge it in your round 2 UNSUPPORTED-L4 PREMISES list; it is graded only there."
  - Why: E-ASSUME reads only numbered premises carrying ASSUMES under an UNSUPPORTED-L4 PREMISES heading (round 2, and round 1 through pkgEAG). It did not fire in the 5 runs 37281 to 37719. In 37719 the Oracle's only charge stood in a free-standing round 1 section headed CHARGE THE ASSUMPTION, outside any premise list, so the check could not see it.
  - No code change: the extractor and pkgEAG are untouched. Connections and model settings are unchanged.
  - Success measure: every listed ASSUMES premise quotes the defender's own words verbatim, and no charge stands on words the defender denied. The number of E-ASSUME rows is not the measure.
- D3 LINK ROUND:
```

## E2 Commitment 13 (section 8)

OLD:
```
13 I give the layers of every break I grade ([L1] quoted, [L2] when the break turns on a word's meaning, [L3] when relied on, after GROUND:)
```
NEW:
```
13 I give the layers of every grade (every collision line, whether a LINK BROKEN, STANDS or UNDERDETERMINED line, carries its layers after GROUND: ([L1] quoted, [L2] when it turns on a word's meaning, [L3] when relied on) and quotes the words that decide it: for a break, the answer words that fail; for STANDS, at least 6 words in a row of the answer that fit and the verse words they fit; for UNDERDETERMINED, at least 6 words in a row from each side and the verse words that leave the point open; RESULT and KEYSTONE lines name by label the collision lines that decide them and carry at least one [L1])
```

## E3 E-COL rival-reading rule (section 9)

OLD:
```
(a rival reading of a contested word, footed by the answer's own layers, is not a break;
```
NEW:
```
(a rival reading of a contested word is not a break when the answer quotes the row words that carry it (CARRIED BY: a verse the answering round cites, at least 6 words in a row); layers named without such words do not carry a rival reading;
```

## E4 status label (section 9, pkgEAF)

OLD:
```
"(judge wrote ...; RECORD-ONLY TRIAL, ruling 428)"
```
NEW:
```
"(judge wrote ...; SENT BACK: a DISAGREE is sent back; an uncured item counts against the seat only under an enforced package its CURE note names, such as pkgUND, pkgUNA or pkgABS; a silent item always counts, ruling 428)" (the status label of ASK 345; until s232 it read "RECORD-ONLY TRIAL")
```

## E5 ASK 345 and 346 entries (section 9)

OLD:
```

- SEND-BACK AND APPLY (E-APPLY;
```
NEW:
```

- E-COL SEND-BACK, THE CARRIED BY GATE AND THE KEEP (pkgECF; pkgECW rev c, ASK 345):
  - Seat consequence (pkgECF, ENFORCED): an E-COL item sent back is CURED by a CHANGE TO, or by a KEEP whose sentence quotes both sides of the conflict: at least 6 words in a row of the answering side's own words (its FAILS words may be these) and at least 6 words in a row of the verse those words cannot agree with, as a round quotes it (pkgECF2). For a line resting on an unanswered press, the KEEP says it was left unanswered and quotes the pressing sentence, at least 6 words in a row (ruling 392). Since ASK 345 a third KEEP cures: 6 words of the CARRIED BY row shown to the judge and 6 words of the meaning pressed, taken from the pressing side's rounds and not from inside the row; when the row text was not read, the KEEP names the reference and quotes 6 words of the meaning pressed. A KEEP without one of these, or silence, leaves the item UNCURED: it adds to drv_uncured, writes "[AUDIT v41: E-COL UNCURED (pkgECF, W3 2534) -- SEAT: <seat>; ITEMS: ...; counted in drv_uncured. REVIEW THIS ROW.]", and the seat is replaced (alt_needed).
  - The CARRIED BY gate (pkgECW; module ECW, Shared Library line 3500). DeepSeek's RULE E-COL and the judge's send-back rule (__ecfR) read: "a rival reading of a contested word is not a break when the answer quotes the row words that carry it (CARRIED BY: a verse the answering round cites, at least 6 words in a row); layers named without such words do not carry a rival reading." An E-COL DISAGREE whose right grade is STANDS must name CARRIED BY: a row the answering round cites (the round in the line's ANSWER tag, otherwise every round of the answering side), with at least 6 words in a row as kjv_verses holds them, or an [L2] word that original_words holds at that verse. A reference may be "Book c:v", a range covering it, or a bare "c:v" within 400 characters after the same book and chapter. Each quotation of 3 or more words in DeepSeek's sentence must stand, piece by piece and in order, in a round, the judge's line, or a verse read this run; brackets, round and layer tags, curly quotes, apostrophes, case and spacing are normalized. Exempt, read as phrases: rests on an absence, witness ledger, footing rule, no footing, borrowed footing, contested links, no answer words are quoted. A row that fails the gate is held and recorded: "ENFORCER HELD (pkgECW, recorded, not sent back: <why>)". A verse not read this run is sent, marked NOT CHECKED. The send-back shows the judge the CARRIED BY row.
  - Status labels (judge-facing, in THE ENFORCER text): each enforcer row ends "(judge wrote <grade>; <status>, ruling 428)". E-COL: "E-COL ENFORCED, pkgECF: a DISAGREE is sent back and an uncured item counts against the seat". E-B7: "E-B7 ENFORCED, pkgEB7: a DISAGREE is sent back and an uncured item counts against the seat". E-SYN and K-W: "RECORD-ONLY: not sent back". Every other rule: "SENT BACK: a DISAGREE is sent back; an uncured item counts against the seat only under an enforced package its CURE note names, such as pkgUND, pkgUNA or pkgABS; a silent item always counts". No row now says record-only for a rule that can count against a seat. Effect: the database function jfl_counted skips text reading record-only or TRIAL, so E-COL, E-B7 and pkgUND/pkgUNA UNCURED send-backs now count in judge_fault_ledger, as they already counted in drv_uncured.
  - Why: in run 37719 DeepSeek accepted a rival "status" reading with no row words and sent it back as an E-COL DISAGREE; luna moved from BROKEN to UNDERDETERMINED, and the panel from 2-1 to 3-0.
- LAYERS ON EVERY GRADE (pkgLAY rev 2c, ASK 346; Commitment 13; E-LAY):
  - Commitment 13 (Panel Build, Reserve Build, Accept Build, Accept Check, Accept Return Build, Accept Final, Accept DS Return Build and Enforcer Build; 10 identical copies) is headed "I give the layers of every grade." Its body stays word for word, and these sentences follow its example: "Every collision line I write, whether DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, STANDS or UNDERDETERMINED, carries after GROUND: [L1] ...; [L2] ...; [L3] .... I quote the words that decide it: for a break, the answer words that fail; for STANDS, at least 6 words in a row of the answer that fit, and the verse words they fit; for UNDERDETERMINED, at least 6 words in a row from each side, and the verse words that leave the point open. 'Leaves it disputed' with no quoted words is not a ground. My RESULT and KEYSTONE lines name, by label, the collision lines that decide them, and carry at least one [L1]. A grade without the record's words is a grade from outside the record, and I give none."
  - Code check (LAY.scan, in Send Back Build on each judge's text with AUDIT and EXTRACTOR lines removed; module LAY, Shared Library line 3501). An item on a line already sent back joins that item; otherwise it is a new E-LAY item. LIVE (enforced): a STANDS line with no counted [L1]; a RESULT line with no collision label or no counted [L1]; a KEYSTONE line with no label of its own link or no counted [L1]. TRIAL for one run, counting nowhere: STANDS-FIT, "a STANDS line that quotes no 6 words in a row of the answer that fit (Commitment 13)"; UND-SIDES, an UNDERDETERMINED line that does not quote 6 words in a row from each side. Exempt: engine-derived lines ("derived by the engine", "derived after the send-back", "recomputed", closing-contradiction lines) and KEYSTONE WITHDRAWN.
  - Cure: a CHANGE TO in the required form; RETRACTED for a collision line (not for a RESULT or KEYSTONE line); or a KEEP whose sentence gives what was missing. An uncured LIVE item counts in drv_uncured and writes "[AUDIT v58: LAYERS UNCURED (pkgLAY, Commitment 13) -- SEAT: <seat>; ITEMS: ...; counted in drv_uncured. REVIEW THIS ROW.]". TRIAL items are logged UNCURED and count nowhere.
  - Engine-derived KEYSTONE and RESULT lines now end with "GROUND: <labels> | <[L1]> (the labels and [L1] of the lines it is derived from; pkgLAY)", preceded by " -- " on a KEYSTONE line.
  - E-HOLD through the gate (ECW HOLD on): an E-HOLD DISAGREE that pushes a line toward UNDERDETERMINED passes the same CARRIED BY gate as E-COL, DeepSeek's E-HOLD rule asks for CARRIED BY, and the send-back shows the judge the row.
  - The TRIAL part is ruled on at the AAR of the next run: it goes LIVE, is changed, or is dropped.
- SEND-BACK AND APPLY (E-APPLY;
```

## E6 ASK 338, 340, 343 entries (section 12)

OLD:
```

- A single-quoted quotation after a verse reference pairs with that reference in the ECL pair reader
```
NEW:
```

- EACH QUOTE BEFORE A REFERENCE LIST IS CHECKED AGAINST ITS OWN LISTED VERSE (ASK 338 rev 2; Citation Scan, Quote Compare, Quote Report):
  - What it does: Citation Scan reads a list site before the quote-first loop: a run of 1 to 4 quotes followed by one parenthesised list of 2 or more references. When the quote count equals the reference count (row O), quote i is checked against reference i. Otherwise (row L) every quote is checked against the whole list. Each part carries its own book. Not read as a list site: a quote already bound by a reference-first form; one quote with a list that the existing grammar already reads whole; a negation between quote and list; an [L2] line; a site whose last quote ends in . ! or ? and is followed by a capitalised new sentence before the list. Quote text that opens or closes with a space, or whose opening mark is not preceded by a space or punctuation, is not read as a quote.
  - Quote Compare checks each part in its own book; in row L a member that does not exist reports CITED VERSE DOES NOT EXIST naming that member. Quote Report accepts a found verse only from the list's books, and its not-found text names those books ("WORDING NOT FOUND IN Acts, Romans"). A row L item's reference reads as the whole list ("Luke 1:36; Luke 1:5"). No note, AUDIT line or rule text is added; the CITATION CHECK block the judges read changes in content, not in form.
  - Why: run 37510 DR4 showed a false "WORDS ARE AT Matthew 1:20" for a quote whose listed verse, Matthew 1:18, holds it, and run 33014 showed WORDS ARE AT Luke 1:5 for a quote standing in a listed verse. Only one reference of a list had been checked.
  - Limits: a list with a bad member ("(Luke 1:5; Luke 1:95)") shows only CITED VERSE DOES NOT EXIST for that member; the match at the good member is not shown. A quote that misstates its verse still does not count (the operator's misstated-verse ruling).
- ENGLISH WORDS IN AN [L2] LINE ARE SET ASIDE, AND A GLOSS TRIAL (ASK 340; 23 nodes edited, 3 new):
  - Part A: an English word in an [L2] line no longer makes the tag NOT COUNTED when it maps to no Strong's number, carries no mark, is a KJV word, and is not a lexicon transliteration. It counts neither for nor against the line. check() is edited identically in the round Build and Extract nodes and the Shared Library; L2 Count Plan computes the set-aside list (e340), and the judge paths read e340 from L2 Count Plan, so under Ruling 383 the judges' [L2] statuses change with it. The judge-visible why-text reads "<word> = English, set aside", and a not-in-verse reason adds "; set aside as English: ...".
  - Part B (record-only; it changes no count): each gloss in parentheses after an original-language word is checked against that Strong's number's KJV renderings. Statuses: FOUND, NOT IN THE KJV RENDERINGS, LEXICON WORDING, REVIEW (a word mapping to two or more numbers), NO ANSWER.
  - New nodes: L2 Gloss Plan (emits reads only when a candidate or a gloss exists), L2 Gloss Any (IF), L2 Gloss Read (HTTP; timeout 30,000 ms, 2 tries, continues on error). Edges: L2 Lexicon to L2 Gloss Plan to L2 Gloss Any; true to L2 Gloss Read to L2 Count Plan; false to L2 Count Plan. The edge L2 Lexicon to L2 Count Plan is removed.
  - Reads: lexicon_words transliteration pages, kjv_word_map by kjv_word for each candidate, and kjv_word_map by strongs_number for glossed numbers (limit 1,000, up to 30 numbers). Words are folded on both sides (NFD, accents dropped, lower case, a to z only). An incomplete read (unequal page totals, rows short of the Content-Range total, duplicate ids) gives no answer, and nothing is set aside.
  - Record: AUDIT v57 "[L2] ENGLISH WORDS AND GLOSS TRIAL (ASK 340)" in review_notes, and the debate-document section "## [L2] English words and glosses" (at most 40 gloss items shown).
  - Why: false [L2] NOT COUNTED findings against English words (37510 CR2 womb, CR1 thing), and an [L2] NOT COUNTED reaches the judges, who mark the link UNPROVEN.
  - Limits: Part B misses -ed forms (H2030 "conceived" is flagged though the KJV renders "conceive"); binding errors remain (G4771); numbers with more than 1,000 rendering rows (G2532, G3739) give NO ANSWER. The Send Back Build and Send Back Record stubs do not name L2 Count Plan, so their read of it returns nothing there (pre-existing).
- INDEX ON kjv_word_map.kjv_word (ASK 343; database only): idx_kjv_word_map_kjv_word, a btree on kjv_word, so the ASK 340 read by kjv_word is an index scan and not a full-table scan that can time out (4.4 ms, against 942 ms before). No row, result, node or model setting changed. Revert: DROP INDEX public.idx_kjv_word_map_kjv_word.
- A single-quoted quotation after a verse reference pairs with that reference in the ECL pair reader
```

## E7 status list (section 12)

OLD:
```
WORDING NOT FOUND IN <book>;
```
NEW:
```
WORDING NOT FOUND IN <book> (for a quote checked against a whole reference list, the list's books joined by commas, such as "WORDING NOT FOUND IN Luke, Isaiah"; ASK 338);
```

## E8 ASK 339 entry (section 13)

OLD:
```

- When the panel verdict and the outcome differ, the outcome comes first
```
NEW:
```

- AN S-C NOTE ON THE DRAWN SYNTHESIS LINE (ASK 339 rev 2; Format Markdown only):
  - What it does: when review_notes hold a "SYNTHESIS CHECK (S-C) -- " finding whose item stands on a charge line, the drawn synthesis line that says no side charged that item gets a note at its end: "[SYSTEM CHECK S-C: the words "<words>" stand in a premise of a premise list; this line says no side charged it.]", or for a verse, "[SYSTEM CHECK S-C: <ref> is named in a premise of a premise list; this line says no side charged it.]" (for several verses: "... are named ...; ... charged them."). The stored synthesis, review_notes and every judge input are unchanged.
  - The line test is S-C's own (as in Build Save Body), on the challenger's round 2 list (engine_r2, from its last "UNSUPPORTED-L4 PREMISES" heading) and the defender's round 3 list (engine_r3, from its last "CHALLENGER'S UNSUPPORTED-L4 PREMISES" heading). Charge lines are the numbered premise text up to "PRESSED WITH:"; PRESSED WITH lines, "-- MEANS" lines, grant sections, headings and PREMISE COUNT lines are left out. A hit counts only when it matches a stored S-C item. No note is put on KJV wording (Quote Report MATCHES or Get Verse text), and none when the verse text is not at hand. A note goes on a line only when exactly one line matches. Any error returns the line unchanged.
  - Why: the synthesis can call an item "charged by neither side" while it stands in a premise list; S-C flagged it in review_notes, but the document printed the flag apart from the line (run 37510, Genesis 4:1 and Matthew 1:19).
  - Limits: no side is named, because S-C does not record the side; 41 items get no note (stored item text cut at 700 characters, or an older S-C version).
- When the panel verdict and the outcome differ, the outcome comes first
```

## E9 live flow (section 18)

OLD:
```
Live flow: s227 (n8n version d23c65ca, 455 nodes; Shared Library 963,897 characters, sha 515f047ee6cad94f).
```
NEW:
```
Live flow: s234 (n8n version 25b8559b, 458 nodes; Shared Library 990,979 characters, sha c2880321e430dbf1).
```

## E10 version chain (section 18)

OLD:
```
s227 (d23c65ca) = s226 + ASK 342 with condition e. Run 37510 ran on s221: it exercised ASKs 327, 328 and 329; 325, 330 and 331 were not exercised; 333 to 337, 341 and 342 are UNEXERCISED until a run.
```
NEW:
```
s227 (d23c65ca) = s226 + ASK 342 with condition e. s228 (dfdb4931) = s227 + ASK 338 rev 2. s229 (6d1d3310) = s228 + ASK 339 rev 2. s230 (749395b4) = s229 + the ASK 340 nodes, without their connections. s231 (f96cbf43) = s230 + the ASK 340 connections. The kjv_word_map index (ASK 343) is database only. s232 (f32177d9) = s231 + ASK 345 rev c. s233 (7f46c420) = s232 + ASK 346 rev 2c. s234 (25b8559b) = s233 + ASK 347 rev 2. ASK 344 (panel candidates) is not written. Run 37510 ran on s221: it exercised ASKs 327, 328 and 329; 325, 330 and 331 were not exercised. Run 37719 ran on s231: ASKs 338, 340 and 343 fired; 339 was not exercised; 333 to 337, 341 and 342 were not graded fired or unexercised on it. 345 to 347 are UNEXERCISED until a run.
```

## LOGROW (engine_manual_log, version 178)

title: s228 to s234 and ASKs 338 to 347

content:
```
Register: s228 dfdb4931 ASK 338 rev 2 (operator card "Write 338", 15 Nov 14:32 CST); s229 6d1d3310 ASK 339 rev 2 ("Write 339", 15 Nov 14:37 CST); s230 749395b4 ASK 340 nodes, written without their connections ("Write 340", 16 Nov 07:03 CST); s231 f96cbf43 the ASK 340 connections ("Write the 340 wiring", 16 Nov); ASK 343 index idx_kjv_word_map_kjv_word, database only ("Write ASK 343", 16 Nov 07:34 CST); s232 f32177d9 ASK 345 rev c ("Write ASK 345", 16 Nov 18:29 CST, and "Allow and write ASK 345", 18:35 CST); s233 7f46c420 ASK 346 rev 2c ("Write ASK 346", 16 Nov 18:49 CST); s234 25b8559b ASK 347 rev 2 ("Write ASK 347", 16 Nov 18:53 CST). ASK 344 not written. Grades: 338 W2 7132, W1 7133; 339 W1 7136 and 7141, W2 7138 and 7142; 340 W2 7157, W1 7158; 343 W1 7167, W2 7168; 345 W1 7258, W2 7260; 346 W2 7272, W1 7273; 347 W2 7278, W1 7279. Write reports: W4 7140, 7144, 7159, 7163, 7170, 7262, 7274, 7280. Run 37719 (s231): 338, 340 and 343 fired (measured from citation_check and review_notes; W1 7199, W4 7230); 339 not exercised. Body: new entries for 347 (section 6), 345 with the pkgECF KEEP rule and seat consequence, which v177 did not state, and 346 (section 9), 338, 340 and 343 (section 12), 339 (section 13); Commitment 13 summary (section 8); the E-COL rival-reading rule (section 9); the status label in the pkgEAF entry; the list form of WORDING NOT FOUND (section 12); section 18 live flow and chain. Reads: (non-writer read to be named).
```
