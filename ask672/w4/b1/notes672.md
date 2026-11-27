# ASK 672 BUILD b1 (W4), on plan rev 1 a2121513 (W1 PASS Wall 12779). Not written.
Base: live engine 66ba992d, fresh fetch 12:0x CST 11-27, no run live. Node touched: Assume Check Build only (jsCode before 8a46e5b3, after 78b2a878). Function replaced: vp524Verses (old_vp524.js -> new_vp524.js fa5dc887). Library not touched.
Change: form (a) Reference "quote" kept with the same regex text; form (b) "quote" (Reference) added; same dedupe.
C1 replay 43103 (replay672_out.txt): rounds 1-3 old/new: CR1 0/21, CR2 13/18, CR3 0/22, DR1 0/97, DR2 0/49, DR3 24/50. Challenger list holds Matthew 1:23 and Luke 1:27 words.
C2 cure replay (c2_out.txt; case list only, without the premise block quotes p.quotes, so OLD rows here may read UNCURED where the stored row was CURED through p.quotes): Sonnet 55074 item 93 UNCURED -> CURED ("Behold, a virgin shall be with child, and shall bring forth a son"); terra 55214 item 93 UNCURED -> CURED ("To a virgin espoused to a man"). Still UNCURED: terra 55215, 55217-55219, whose KEEPs quote the debater's own sentences, not verse words (right under the rule).
C3 superset over 10 latest debate rows (c3c4_out.txt): 0 old entries uncovered (one 43103 DR3 John 6:42 short quote is now inside a longer quote of the same verse, dropped by the existing dedupe rule).
C4 verse block growth: 10 rows +0 to +8,493 chars (f810b760 the largest); 43103 6,230 -> 22,994 chars. Enforcer luna input limit is far above this.
C5 compiles (new Function). Library Check not affected (Library untouched).
WRONG-IF known-bad cases: 0 new-form matches each (replay672_out.txt). Every new-form match on 43103 printed in new_form_matches_43103.txt for W1.
