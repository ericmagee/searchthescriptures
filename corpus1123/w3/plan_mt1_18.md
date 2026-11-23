# CORPUS PLAN rev 1 (W3): the operator's reading of Matthew 1:18-25, and the opening sequence, into the corpus. For W1 and W2 to review. Nothing is written until the operator presses W3's card. Rev 1 adds the operator's second message (09:10 CST) and replaces rev 0 (md5 efeaa1f0).

## 1. The operator's text, verbatim
A. 09:07 CST 11-23: "Matthew already calls Joseph and Mary husband and wife. The pregnancy became known before they "came together," meaning before their ceremonial or household union. Joseph's concern was the public scandal created by their private marital relations becoming visible before that public union. Therefore, being unwilling to make Mary a public example, he considered putting her away privately to shield her. The angel's "fear not to take unto thee Mary thy wife" answers that fear and directs him to proceed with taking her publicly into his household. After doing so, Joseph "knew her not" until the birth. Thus, "came together," "took unto him his wife," and "knew her" describe distinct events in the narrative. Mark 7:8 supplies the distinction between the social tradition producing the scandal and the commandment of God."
B. 09:10 CST 11-23: "also include: State the social-scandal reading explicitly in the opening chain. ... Joseph and Mary, already called husband and wife, had sexual relations during the espousal; the pregnancy became visible before the ceremonial or household coming together; Joseph considered private separation to protect Mary from public scandal; the angel told him not to fear proceeding with the public taking; and he abstained from further relations after taking her until the birth. Making that sequence explicit near the beginning would reduce the chance that readers, judges, or reviewers import the adultery narrative."

## 2. Where each part goes, and why
How the defender is served, read this turn:
- The engine calls debate_arsenal_guarded(topic). For "Did Christ have a biological father?" it returns S-1578, S-1822, S-519, S-32 and S-266 (and others) as GUARD SET (DG-8) rows.
- Init with Guards serves a GUARD SET or SIGHT LINK row whole. Only other sights are cut to 300 characters.
- So the whole summary of S-266 and of S-1822 reaches the defender. The judges get neither (ruling 383).

Part 1, the layered reading (A): appended to Sight 266 (kb_sights id 374, "Matthew 1:19 - Joseph Just and Not Willing to Make Her a Publick Example"). That sight already holds Mark 7:8 and "her husband" / "thy wife", and S-1822 already points to it for Joseph's grounds ("His grounds are held in Sight 266"). Block: block266.txt, 3,645 characters, md5 c387aa22.

Part 2, the opening sequence (B): put before the first line of Sight 1822 (kb_sights id 2028). That sight is the only served sight that tells the defender what to say and in what order ("IN DEBATE, SAY: ... in this order"). The new paragraph comes before that head and is told to open round 1. The IN DEBATE items keep their numbers, because the sight refers to "Item (4) of the IN DEBATE head". Paragraph: open1822.txt, 1,613 characters, md5 1bfc3352.

Each notes field gets one dated line (note266.txt, 199 characters, 7c69e74c; note1822.txt, 279 characters, 881283fa).

Not changed: S-32, S-519, S-1578 and every other row (scope rule). S-32 step (4) already says "Joseph knew Mary his wife within the espousal", and the new text agrees with it and with S-1822's READ IN CONTEXT.

## 3. Layout (A, in S-266)
- L1: Matthew 1:18, 1:19, 1:20, 1:24, 1:25 and Mark 7:8, each quoted in full from kjv_verses.
- L2: synerchomai (G4905); paralambano (G3880) for both "take unto thee" and "took unto him"; ginosko (G1097); deigmatizo (G1165); lathra (G2977); paradosis (G3862). The glosses are quoted from lexicon_words.
- L3: Matthew 1:16, 1:19 and 1:20 name them husband and wife. Matthew 1:20 with 1:24 is one verb, first bidden and then done. Matthew 1:25 comes after 1:24.
- L4: five steps, and then the conclusion: three distinct events; Matthew 1:18 dates the finding before the ceremony, not before any union.

The opening sequence (B, in S-1822) has six steps, in the operator's order. Each step cites its rows:
1. Matthew 1:16, 1:19 and 1:20.
2. Matthew 1:19 and 1:20, with Genesis 4:1 and 1 Samuel 1:19.
3. Matthew 1:18, 1:20 and 1:24.
4. Matthew 1:19 and Mark 7:8.
5. Matthew 1:20 and 1:24.
6. Matthew 1:25 and 1:24.
Every quoted fragment was checked as an exact substring of kjv_verses this turn (10 of 10).

## 4. Rulings
- Rulings 500 and 359: "came together" is the ceremony, which includes living together, not the union (whose word is "knew"). Both parts state this and cite them.
- Ruling 383: only the Debate Oracle is bound by the guards, and the judges grade the evidence present to them. These sights are the defender's private record. A judge sees the sequence only when the defender puts it in the rounds. No judge prompt, guard or engine code changes.
- "Single verse doctrine is prohibited": every step rests on two or more rows. A reviewer should fail any step that does not.
- Ruling 394 (Sight 32): the child is Joseph's. Step 2 rests on the same rows as Sight 32 step (2).

## 5. The write (write_corpus.sql)
One DO block with two UPDATEs. Each is guarded on the current md5 of summary and of notes:
- S-266: summary e4cc8dfa29ffdbcc9dc194e23bc550e6; notes 7d341d1808cd3d2cda951bcf9ccaa287.
- S-1822: summary ed7a8a8b686c60bb61eeaf41f6330529; notes 705463260e1e81ba4c064a8065ec8901.

If either row has moved, the block raises and nothing is written.

Expected lengths after the write:
- S-266: summary 1,559 + 3,645 = 5,204; notes 490 + 199 = 689.
- S-1822: summary 32,358 + 1,613 = 33,971; notes 10,586 + 279 = 10,865.

Triggers read on kb_sights:
- title, status and layer_status do not change, so the title, layer and conclusion-flag triggers do nothing.
- The new text has no "seed", "blood", "LXX" or "Septuagint", so the fences pass.
- snapshot_kb_sights logs the prior rows to table_snapshot_queue. That is the revert source.

Readback: each new summary equals the old summary with the block added, byte for byte; each new notes field equals the old notes plus its line; md5 and length are reported.

## 6. Run evidence
At the next released run on this topic, the defender's round 1 states the six-step sequence before its links. This is model output, and the write cannot force it. Until such a run, it is UNEXERCISED. If round 1 leaves it out, that is a finding for the next review, not a cause to edit the judges.
