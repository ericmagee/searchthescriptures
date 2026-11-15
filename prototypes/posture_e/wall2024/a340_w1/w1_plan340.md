# W1 grading plan, ASK 340 (Part A English words set aside; Part B gloss trial), from live s225 657d2953

## Live (measured)
- L2C tagWords kinds: strongs, greek, hebrew, latin. latin comes from italics, a lowercase run before "(x", diacritic words,
  Hebrew prefix forms, and quoted words when nothing else was found. A latin word with no lexicon match prints "<w> in none of them"
  and the tag is NOT COUNTED (37510: womb/gastēr, thing/begotten/gennōmenon, coming/together, own/therefore).
- KJV English words that are also transliterations: ho, ara, sun, men (kjv_word_map); en, gar stand in KJV text.
- kjv_word_map renders H5959 damsels/maid/virgin/virgins; H1330 maid/maiden/maidens/maids/virgin/virgins.
- No live node reads a gloss.

## Part A checks (counted path; all L2C copies identical, as 336)
1. Set aside only when: maps to nothing today; no diacritic/Greek/Hebrew script; is a kjv_word; is NOT a transliteration in lexicon_words (W2 4).
2. Replay 68 debates: every tag that changes, every word set aside; COUNTED -> NOT COUNTED must be 0 (wrong-if b).
3. Hand-read every set-aside word of 4 letters or fewer (W2 h), and a sample of 20 others.
4. A tag of English words only keeps today's status (wrong-if d).
## Part B checks (trial, record-only)
5. Counts, tag statuses, Panel Build, Build Independent Verdict byte-identical (wrong-if e). Output only in the AUDIT line and Format Markdown.
6. Multi-word part checked whole ("young woman"); plural/singular accepted (maid/maids, virgin/virgins).
7. Margin words: W3 7073 item 7 is open; if kjv_word_map lacks margins, margin hits are listed separately, not flagged.
## Plants
- A1 37510 CR2 "womb/gastēr" -> COUNTED. A2 "thing/begotten/gennōmenon" -> COUNTED. A3 "ho (G3588, the)" unchanged.
- A4 "synelthein" (spelling miss, lexicon transliteration) not set aside. A5 an [L2] of English words only: unchanged.
- A6 "el" style word that is both Hebrew transliteration and English: not set aside.
- B1 "almah (young woman, maid)" -> flags "young woman" only. B2 "almah (virgin, maid)" -> no flag.
- B3 "betulah (virgin)" / H1330 -> no flag. B4 "(G4905, to come together, cohabit)" -> gloss bound to G4905; flags only parts outside KJV renderings.
- B5 a transliteration mapping to two numbers -> both printed or REVIEW (wrong-if g).
