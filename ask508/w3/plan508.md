# ASK 508 plan (W3, seat 33), rev 1, 2026-11-20

## Ruling
Eric, 08:24:13Z 11-20, W3 thread, card "Which fix do you mean for serving Flesh After His Kind?": chose "Guard words for begetting only" ("Add beget, begat, begetting, pregnant, impregnated; this covers \"Did the Holy Ghost beget the flesh\" and leaves other Holy Ghost topics alone.").

## Why (read only, 11-20)
- The DG-8 guard set (guard_served_sets guard 8) fires on the topic words: father, biological, virgin, conception, conceived, joseph, mary, begotten, paternity (trigger_terms md5 e515ba0aeb06e53c21469c864212f58b).
- The link path (debate_sight_links) stops at 6 sights and 8,000 characters (BB-6417). Sight 1822 is 24,114 characters served, so the link path can never serve it.
- Test: debate_arsenal_guarded('Did the Holy Ghost beget the flesh of Christ?') returns only S-1462 ("SIGHT LINK (group 11, link 10: S-1462 supports S-1822)"); S-1822 is absent.
- Past topics: no distinct debate_results topic holds beget, begat, begetting, pregnant or impregnated (one Spirit-baptism topic holds "spirit" only). No past topic would have been served differently.

## The change (one statement, nothing else)
UPDATE guard_served_sets SET trigger_terms = trigger_terms || ARRAY['beget','begat','begetting','pregnant','impregnated'] WHERE guard_num = 8;
- Only trigger_terms. sight_numbers, active, ruled_ref and the functions are untouched (scope rule, Eric 18:26 CST 11-19).
- Readers: debate_arsenal_guarded and debate_sight_links (both read guard_served_sets; no table trigger).
- Each word is over 3 letters, so the topic word filter (length > 3) keeps it.

## Checks
- Before: trigger_terms md5 e515ba0a...; the test topic returns no S-1822.
- After: trigger_terms = the 9 old words then the 5 new, in that order; debate_arsenal_guarded('Did the Holy Ghost beget the flesh of Christ?') returns S-1822 second with link_note "GUARD SET (DG-8)"; 'Did Christ have a biological father?' returns the same 30 rows as before.
- Not changed: a topic with holy or ghost and none of the 14 words still does not fire DG-8.

## Revert
UPDATE guard_served_sets SET trigger_terms = ARRAY['father','biological','virgin','conception','conceived','joseph','mary','begotten','paternity'] WHERE guard_num = 8;

## Roles
W3 plans and grades. W4 builds, checks, and posts the write card in W4's thread. Second grade held ("Just you two").
