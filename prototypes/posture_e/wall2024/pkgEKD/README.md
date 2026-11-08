# pkgEKD: DeepSeek E-KEY reads the defender's own words for the keystone

DeepSeek enforcer fix (Judge Enforcer Build and Alt Judge Enforcer Build), on pkgEWB = live s58.

## Fault
DeepSeek E-KEY rules DISAGREE while its own right grade equals the judge's grade, because it reads a keystone ground that restates the
defender's thesis as "the judge's own doctrinal statement".
- 33617 gemini: "KEYSTONE: D6 -- STANDS -- D6 is the conclusion link affirming Christ had no biological father and was conceived of the Holy Ghost ..." -> "ENFORCER DISAGREE (right: STANDS)".
- 33617 sol: "KEYSTONE: D6 -- STANDS -- The conclusion is that Christ had no biological human father, with Mary as mother and the Holy Ghost as the source ..." -> "ENFORCER DISAGREE (right: STANDS)".
- The defender's own [CR1] opening: "I affirm that Jesus Christ had a biological mother, Mary, and no biological human father. His conception was of the Holy Ghost." Its LINK 6 premise line [CR2]: "Christ had no biological father; Mary was his biological mother and the Holy Ghost the source of the conception."
- debate_enforcer_log, last 3 days: 13 E-KEY rows where DISAGREE names the judge's own grade as right (11 STANDS, 2 BROKEN), in 9 debates.
- Cause: the E-KEY item gave DeepSeek only the keystone line and the judge's collision lines, never the defender's words, so it could not tell a restated thesis from the judge's doctrine.

## Change
- ekdWords(link): for a D keystone, a block "THE DEFENDER'S OWN WORDS FOR THE KEYSTONE (from the rounds)" with the [CR1] opening statement (text before its first numbered section, 900 chars) and the LINK n premise line of the first link round that writes "LINK n ... Premise: ...".
- RULE E-KEY gains one sentence: a ground that restates those words rests on the debate's words; the defender's thesis restated is not the judge's own doctrine.
- Nothing else changes. C keystones and every other rule are untouched.

## Test (node pkgEKD/test_EKD.cjs): 6 OK, 0 FAIL
- Base equals live s58 (fetchback_live_s58.json): Judge e623516c11e9, Alt 0d1f052f879f.
- 79 node runs: every item and the system text equal the base apart from the block and the sentence.
- 139 of 139 D keystone items carry the opening statement. The premise line is found only where the link round writes "Premise:" under the LINK heading (33617); older runs get the opening only.
- 33617 gemini and sol items carry "no biological human father ... of the Holy Ghost".

## Shas
Judge Enforcer Build e623516c11e9 -> 2cb78eabaca7; Alt Judge Enforcer Build 0d1f052f879f -> 79898dee1307 (plan_EKD.json).

## Live bar
E-KEY DISAGREE rows whose right grade equals the judge's grade go to 0. Record-only rule (ruling 428), so no verdict changes.
