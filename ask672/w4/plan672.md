# ASK 672 PLAN rev 1 (W4; rev 0 cf25f342 graded PASS WITH C1 TO C3 by W1, Wall 12777): the E-ASSUME verse harvest reads both quoting forms, on both sides

## ROLES
W4 builds and writes. W1 grades the plan and build and reads back the write. W3 drafts the manual entry and the AAR row.

## OBJECTIVE
The list "every verse the side quoted in rounds 1 to 3" (ASK 524) holds every verse a side quoted, whether the round writes Reference "quote" or "quote" (Reference). A right KEEP that quotes the side's own verse words is then CURED, and the enforcer's assumption question is asked with the full verse list in front of it.

## FINDINGS FROM SEARCH (live engine 66ba992d, child aad0ad9c; node code re-fetched 11:53 CST 11-27, unchanged from my 10:38 CST fetch; run 43103, debate 0731a1ea)
1. Assume Check Build, vp524Verses: one regex, Reference then optional colon then "quote". The form "quote" (Reference), used by both debaters in several rounds, is never matched.
2. Replay on the stored 43103 rounds: challenger rounds 1, 2, 3 give 0, 22, 0 verses; defender rounds 1, 2, 3 give 0, 0, 25 (W1 confirmed by his own replay, Wall 12773). Matthew 1:23 and Luke 1:27, quoted by the challenger in every round, are absent.
3. The harvest has three users, all in the E-ASSUME path:
   a. The enforcer's prompt block "EVERY VERSE THE <SIDE> QUOTED IN ROUNDS 1 TO 3" (Assume Check Build). In 43103 the enforcer was shown a near-empty challenger list, then wrote of items 92 to 96 "Neither the enforcer nor the code finds a verse the challenger quoted that states it".
   b. case_quotes on each premise, read by Assume Check Record for a STATED answer ("verse words not found in the side's quoted verses").
   c. vq[side], read by the KEEP cure in the Shared Library (acx531Cure). In 43103 this refused Sonnet's KEEP on item 93 (Matthew 1:23 words) and terra's (Luke 1:27 words). That one item removed Sonnet, the HELD seat.
   Also press_vq (ASK 532 name test, record-only).
4. Error: W4 built the ASK 524 harvest with one quoting form.

## CHANGES
1. Assume Check Build only: vp524Verses matches both forms: (a) Reference ["quote"], as now; (b) "quote" followed within the same line by (Reference), allowing [Ln] tags, bold marks and a verse range (for example "(Matthew 1:24-25)"). The same dedupe stays (one entry per distinct quotation; a quotation inside a longer one of the same verse is dropped).
2. Nothing else changes: no prompt wording, no rule, no Shared Library line, no model setting.

## NOT IN SCOPE
The round-label crossing when the Oracle sits as DEFENDER (Wall 12772 item 9; cause not yet read). The pkgPS rule (Sol62). ASK 673 (Sol's unread reply).

## CRITERIA
C1. Replay on 43103 stored rounds: each side's rounds 1 to 3 each give more than 0 verses; challenger list holds Matthew 1:23 and Luke 1:27.
C2. Replay of acx531Cure on 43103 items: Sonnet S10 and terra S14 KEEPs read CURED; every other cure result is unchanged or listed with its reason.
C3. Old-form superset: on the last 10 debate rows, every (reference, quotation) the old regex finds, the new one finds.
C4. Prompt size: the enforcer user prompt growth on those 10 rows is measured and stated (chars), and stays under the model's input limit.
C5. Assume Check Build compiles; Library Check pair unchanged (the Library is not touched).

## WRONG-IF
Known-bad cases (W1 C3), each must give 0 new-form matches, result shown: the judges' reasoning ("MISSES (Commitment 7)"); a gloss quote before a Strong's parenthesis ('"thy father" (*patḗr*, G3962)', defender round 2 line 36); opponent quotes in [L4] lines ([CR1] "..."); MEANS lines. Known-good cases, each must match: challenger rounds 1 and 3, Matthew 1:23 and Luke 1:27.
The new form takes words that are not a quotation (a gloss, a MEANS line, a judge's sentence) as verse words: checked by printing every new-form match on 43103 for W1 to read. A dropped old-form match (C3).

## RUN EVIDENCE
43103 (Wall 12767, 12772, 12773). Rows debate_enforcer_log 55074, 55214 (KEEP refused), debate_removals for sonnet.

## STEPS
1. Plan graded by W1. 2. Build offline from a fresh live fetch; replays C1 to C5; W1 grades the build. 3. Write card to Eric (engine, Assume Check Build only). 4. Write on his press; fetch-back, audit row, Wall, W1 readback. 5. First live run: users 3a and 3b change what the enforcer is shown and what counts as STATED, so WHICH E-ASSUME ITEMS ARE RAISED CAN CHANGE (not replayable offline without a model call). Count E-ASSUME items per seat against 43103 (sol 7, sol62 6, sonnet 1) and read every raised item against the fuller verse list; KEEP cures read against the rounds.
Cost: no model call in plan or build.

## INPUTS IN GIT
The plan, the 43103 stored rounds used for replay (cr1-cr4, dr1-dr4 as fetched 11:46 CST 11-27), the replay script and its outputs are saved under ask672/w4/inputs/ with md5s and committed to branch claude/untitled-9jle0o before the build is graded; commit id posted on the Wall.

## DONE
Written on Eric's press; W1 readback MATCH; two clean live runs in which every KEEP that quotes the side's own verse words reads CURED and the E-ASSUME counts are read against 43103; manual entry and AAR row by W3.
