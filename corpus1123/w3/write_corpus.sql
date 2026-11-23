DO $do$ DECLARE a int; c int; BEGIN
UPDATE kb_sights SET summary = summary || $c$

THREE EVENTS, NOT ONE: THE COMING TOGETHER, THE TAKING AND THE KNOWING (operator, 11-23; rulings 359 and 500).
L1:
- "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost." (Matthew 1:18)
- "Then Joseph her husband, being a just [man], and not willing to make her a publick example, was minded to put her away privily." (Matthew 1:19)
- "But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream, saying, Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Ghost." (Matthew 1:20)
- "Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife:" (Matthew 1:24)
- "And knew her not till she had brought forth her firstborn son: and he called his name JESUS." (Matthew 1:25)
- "For laying aside the commandment of God, ye hold the tradition of men, [as] the washing of pots and cups: and many other such like things ye do." (Mark 7:8)
L2:
- "came together" (Matthew 1:18) is synerchomai (G4905): "to convene, depart in company with, associate with, or (specially), cohabit (conjugally)".
- "take unto thee" (Matthew 1:20) and "took unto him" (Matthew 1:24) are one verb, paralambano (G3880): "to receive near, i.e. associate with oneself (in any familiar or intimate act or relation)".
- "knew" (Matthew 1:25) is ginosko (G1097), a different word from both.
- "make her a publick example" (Matthew 1:19) is deigmatizo (G1165): "to exhibit:--make a shew"; "privily" is lathra (G2977): "privately:--privily, secretly".
- "tradition" (Mark 7:8) is paradosis (G3862): "transmission, i.e. (concretely) a precept".
L3:
- The rows name them husband and wife before the coming together: "Joseph the husband of Mary" (Matthew 1:16), "Joseph her husband" (Matthew 1:19), "Mary thy wife" (Matthew 1:20).
- The angel bids the taking (Matthew 1:20), and Joseph does what he was bidden (Matthew 1:24) with the same verb, paralambano: the taking of Matthew 1:24 is the one the angel ordered.
- The knowing has its own word and its own place in the order: "knew her not till she had brought forth" (Matthew 1:25) comes after the taking (Matthew 1:24).
L4 (each step rests on more than one row):
1. "Came together" (Matthew 1:18) is the ceremony and the household living that follows it (rulings 359 and 500). Matthew shows it as the taking into his house, which the angel bids (Matthew 1:20) and Joseph does (Matthew 1:24). It is not the union, whose word is "knew" (Matthew 1:25).
2. Husband and wife before the ceremony (Matthew 1:16, 1:19, 1:20), she was found with child before they came together (Matthew 1:18). What became visible was the private relation of husband and wife, before the public union.
3. The publick example Joseph would not make (Matthew 1:19, deigmatizo, "to exhibit") is that exposure. The putting away privily (lathra) shields her from it. The scorn rests on the tradition of men, not on the commandment of God (Mark 7:8): the rows call her his wife (Matthew 1:19, 1:20).
4. "Fear not to take unto thee Mary thy wife" (Matthew 1:20) answers that fear and bids the public taking, and Joseph takes her (Matthew 1:24).
5. After the taking, he "knew her not till she had brought forth her firstborn son" (Matthew 1:25 read with Matthew 1:24): the withholding runs from the taking to the birth.
So "came together", "took unto him his wife" and "knew her" are three distinct events in the narrative. Matthew 1:18 dates the finding before the ceremony, not before any union.
$c$, notes = notes || $c$
ADDED 2026-11-23 (operator's reading of Matthew 1:18-25, 09:07 CST 11-23, on the operator's write card): the block "THREE EVENTS, NOT ONE" appended to the summary. Nothing else in this row changed.
$c$, updated_at = now()
 WHERE id=374 AND sight_number=266 AND md5(summary)='e4cc8dfa29ffdbcc9dc194e23bc550e6' AND md5(notes)='7d341d1808cd3d2cda951bcf9ccaa287';
GET DIAGNOSTICS a = ROW_COUNT;
UPDATE kb_sights SET summary = $c$IN ROUND 1, OPEN WITH THE ACCOUNT (operator, 11-23), before the IN DEBATE order below. State the whole sequence plainly and early, so that no reader, judge or reviewer brings in an adultery reading. Quote each row whole:
1. Husband and wife already in the espousal: "Joseph the husband of Mary" (Matthew 1:16); "Joseph her husband" (Matthew 1:19); "Mary thy wife" (Matthew 1:20).
2. They had relations as husband and wife during the espousal. The rows name them husband and wife (Matthew 1:19, 1:20), and the canon's way of conceiving is a husband knowing his wife ("Adam knew Eve his wife; and she conceived", Genesis 4:1; "Elkanah knew Hannah his wife", 1 Samuel 1:19).
3. The pregnancy became visible before the ceremonial or household coming together: "before they came together, she was found with child" (Matthew 1:18). The coming together is the taking into his house, which the angel bids (Matthew 1:20) and Joseph does (Matthew 1:24) (rulings 359 and 500).
4. Joseph, "not willing to make her a publick example, was minded to put her away privily" (Matthew 1:19): a private separation, to shield her from public scandal. The scandal rests on the tradition of men, not on the commandment of God (Mark 7:8).
5. The angel told him not to fear going on with the public taking: "fear not to take unto thee Mary thy wife" (Matthew 1:20); and he "took unto him his wife" (Matthew 1:24).
6. After the taking, no relations until the birth: "knew her not till she had brought forth her firstborn son" (Matthew 1:25, read with Matthew 1:24).
The layers for each step are held in Sight 266 (THREE EVENTS, NOT ONE).

$c$ || summary, notes = notes || $c$
ADDED 2026-11-23 (operator, 09:10 CST 11-23, "State the social-scandal reading explicitly in the opening chain", on the operator's write card): the paragraph "IN ROUND 1, OPEN WITH THE ACCOUNT" was put before the IN DEBATE head of the summary. Nothing else in this row changed.
$c$, updated_at = now()
 WHERE id=2028 AND sight_number=1822 AND md5(summary)='ed7a8a8b686c60bb61eeaf41f6330529' AND md5(notes)='705463260e1e81ba4c064a8065ec8901';
GET DIAGNOSTICS c = ROW_COUNT;
IF a<>1 OR c<>1 THEN RAISE EXCEPTION 'corpus write refused: a prior state moved (S-266 rows %, S-1822 rows %)', a, c; END IF;
END $do$;
SELECT id, sight_number, length(summary) ls, left(md5(summary),8) ms, length(notes) ln, left(md5(notes),8) mn FROM kb_sights WHERE id IN (374,2028) ORDER BY id;