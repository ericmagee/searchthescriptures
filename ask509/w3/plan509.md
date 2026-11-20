# ASK 509 plan (W3, seat 33), rev 2, 2026-11-20

## Ruling
Eric, 08:30:57Z 11-20, W3 thread: "50k". That answered his own question at 08:30:36Z, "remove it or set to 50k.. what do you think?", after W3 recommended 50k. ASK number from the coordinator (08:31:02Z).

## Record
- The cap was proposed by Worker_A3 (BB-6416, 19 Oct): at most 6 link sights and 8,000 characters, whole sights only, as a cost bound (+2,367 tokens, 5.1% of run 26613). Advisor_Code_D ruled the design in BB-6417; the context window was "UNMEASURED". It is not an operator ruling.
- Sight 1822 is 24,114 characters as served, so under 8,000 the link path never serves it. Test: on 'Is the Holy Ghost the source of the flesh of Christ?' S-1462 is served whole as SIGHT LINK and S-1822 only as a plain row (row 15) cut to 300 characters by Init with Guards.
- All approved linked sights: 25, 55, 519, 1462, 1822 = 30,204 characters.

## The change (debate_sight_links only)
Current def md5 75a7aa5be77844b7c526b080f51c7b5f, 3,533 chars (pg_get_functiondef). Three literal replacements, each occurring once:
1. `p_char_cap integer DEFAULT 8000` -> `p_char_cap integer DEFAULT 50000`
2. `least(coalesce(p_char_cap, 8000), 8000)` -> `least(coalesce(p_char_cap, 50000), 50000)`
3. comment `to 6 sights and 8,000 chars` -> `to 6 sights and 50,000 chars` (keeps the comment true; no new comment)
Target def md5 d43c0860b9593b3fcde9169b55502a6c, 3,537 chars; "8000" occurs 0 times after, "50000" 3 times.
- The 6-sight limit is unchanged. debate_arsenal_guarded (md5 93e129a4c696922bcd76ad545cb90d61), the engine and the tables are untouched. Signature unchanged (CREATE OR REPLACE keeps grants).

## Checks
- Fetchback def md5 equals the target.
- A topic that fires link group 11 and no guard word, e.g. "Is the Holy Ghost the source of the flesh of Christ?" (holy, ghost; none of the DG-8 words, before or after ASK 508): before, S-1462 whole as SIGHT LINK and S-1822 as a 300-character excerpt (plain row); after, S-1822 whole with "SIGHT LINK (group 11, link 10 ...)". (Corrected in rev 2: rev 1 said S-1462 only.)
- 'Did Christ have a biological father?' returns the same 30 rows as before (1822 and 519 come by the guard set and are removed from the link path first).
- Not measured: prompt size against each debater's context limit. The most the link path can now add is 30,204 characters (all linked sights).

## Revert
Write back the current def (75a7aa5b), saved by W4 before the write.

## Order with ASK 508
Independent. Either may go first; the checks above hold in either order.

## Roles
W3 plans and grades. W4 builds, checks live, and posts the card in W4's thread. Second grade held ("Just you two"). Engine manual entry after the write (W3).
