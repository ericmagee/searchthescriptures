# W1 grading plan, ASK 338 (quote run + reference list; rule O with L fallback), from live s225 657d2953

## Live (measured)
- Citation Scan quote-first patterns: rq (quote then "(" or dash then ONE ref), rqP (quote, up to 30 non-quote chars, then "(ref)"),
  rqL (quote then [Ln] ref), rqB/rqBP (book-less "(c:v)"). The tail after the first ref accepts only "-v", ", c:v", ", v"
  (book-less). A full second reference ("Matthew 1:20") or a ";" part ends the item at the first ref.
- Quote Report: an item carries parts [{chapter,v1,v2}] in ONE book. WORDS ARE AT is chosen only among verses of the SAME book
  (`if(r.book!==i.book)continue`); a quote whose words stand in another book prints WORDING NOT FOUND IN <book>.
- Row 1 (37510 defender R4): quote 2 is caught by rqP (<=30 chars to "("); quote 1 is >30 chars away, so it has no item.

## Checks
1. Diff: Citation Scan (and Quote Report only if parts must carry a book) and nothing else; connections same; reasoning guard.
2. Single-reference items byte-identical PRE/POST on all 148 stored citation_check runs (wrong-if a).
3. NOT FOUND / DOES NOT EXIST counts unchanged except where a list member itself does not exist (wrong-if d, W1 f).
4. Every new item listed (wrong-if c); every changed item listed with PRE/POST status.
5. O vs L: when the run has n quotes and the list n references, quote i is checked at reference i ONLY; else every quote at every listed verse.
6. "Run of quotes" defined in code and tested: quotes joined only by short connectives (" and ", ", ", "; ") with no reference between.
7. Margin text: no new tolerance (W1 e) — "[Gr. begotten]" graded as Quote Compare grades it today.

## Plants (PRE s225 vs POST)
- P1 37510 row as stored: q1 MATCHES at Matthew 1:18 (new item), q2 MATCHES/WORDING DIFFERS at Matthew 1:20 (was WORDS ARE AT).
- P2 33014 row as stored: one quote, (Luke 1:36; 1:5): falls to L, binds Luke 1:5, no WORDS ARE AT.
- P3 reversed pair: "q(1:20 words)" and "q(1:18 words)" (Matthew 1:18, Matthew 1:20): O -> both WORDS ARE AT (O is meant to report this).
- P4 single reference: unchanged.
- P5 list where the quote stands in no listed verse: WORDS ARE AT kept.
- P6 cross-book list "(Luke 1:36; Acts 1:5)" with words at Acts 1:5: binds Acts 1:5 (today: WORDING NOT FOUND IN Luke).
- P7 bad member "(Luke 1:36; 1:95)": DOES NOT EXIST still fires for 1:95 (W1 f).
- P8 range inside a list "(Luke 1:31-35, Matthew 1:20)": range kept (W2 e).
- P9 book-less parts "(Matthew 1:18, 20)" and "(Luke 1:36; 1:5)": book and chapter carried (W2 f).
- P10 a ";" list closed by "[L1]".
- P11 three quotes, two refs (counts differ): L for all three.
- P12 no quote gets two items (W2 g): count items per quote.
- P13 27795 D6 as stored: still WORDS ARE AT Matthew 1:21 (true misstated verse, W4 7061).

# W1 grading plan, ASK 340 (English words in [L2]; gloss trial) -> see ../a340_w1/w1_plan340.md
