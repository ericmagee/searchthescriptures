# ASK 637 PLAN (W4), rev 0: the agreement step asks only seats that can sit in this debate

Source: W4 Wall 12016 (cause and fix), corrected here (sonnet); the 42528 AAR; the coordinator's assignment, 06:26 CST 11-25.
Live base: engine ccaf4660 (after ASK 633). Child aad0ad9c (not touched). Nothing here touches reasoning, a model setting, a token limit, a prompt, or who sits.

## 1. OBJECTIVE
Accept Build sends the posture to every seat of the judge order except the two debaters' own seats (by name) and qwen. Init Seats then drops, among others, every seat of a debater's family (unless both debaters are anthropic) and every seat that runs a debater's model (ASK 601). Those seats were asked and paid for, but they can never sit.
- In 42528 (hydrogen, google, against spark, meta), gemini, argon and neon (all google) were asked: $0.0117 + $0.0162 + $0.0552 = $0.0831. Init Seats then dropped all three for "family google debates in this debate".
- CORRECTION to Wall 12016: sonnet was asked and CAN sit (anthropic is not a debater's family here). It sat as an alternate in 42528. It stays asked. The effect is 3 calls, not 4.
Change: Accept Build skips a seat when Init Seats would drop it for family or for the same model, with the same tests.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator (engine = infrastructure).
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change: Accept Build only, the line `const seats=ORDER.filter(s=>deb.indexOf(s)<0&&s!=='qwen');`. The new filter also drops a seat s when:
- (family) M[s].family equals a debater's family, unless both debaters' families are anthropic; or
- (same model) M[s].api_model, normalised as __MN601 (trim, lower case, drop "anthropic/", "." to "-"), equals a debater's model.
- A debater's family and model are read from the same Accept Models rows (M), at the debater's model_config seat. That seat is Init Seats' ENG table mc value (claude -> claude_synthesis; every other engine -> its own name). Accept Build gets that map as one tagged constant, and C3 proves it equals Init Seats' ENG mc for every engine.
- Tagged ASK 637.
Not changed: the prompt; Accept Check, Accept Return, Accept Final; Init Seats (it still applies its own tests, and a seat not asked passes its agreement filter and is dropped by its family or model test, with that reason); every reader of Accept Final.

SEARCH:
- Init Seats: __AASKED/__AOK: a seat not asked is not dropped by the agreement test. Its later test FAM_PANEL[s] in dfam (with the __BOTHC exception) and __SAMEM give the reason.
- model_config_jfl (read 06:3x CST 11-25): family per seat equals Init Seats' FAM_PANEL for every seat in FAM_PANEL that has a row.
- Readers of Accept Final: Init Seats, Panel Build, Reserve Build, Build Independent Verdict, Plain Rule Lines, Build Save Body, Replay Rows, Shared Library (alternate posture, single-judge quote). Each finds a seat by name (find or a map), none by position in the order. Accept Check and Accept Final pair build items with replies by position inside the step, so a shorter list keeps them paired.
- The single judge (Init Seats single_judge) already excludes debater families, so it is always asked. Every alternate comes from pfree, which excludes them too.

NOT SEARCHED:
- Replay Rows' accept_probe mode (role 'panel' filter). It is not on the live path; C2 runs it if its inputs can be built.
- The dashboard's AGREEMENT display. Fewer AGREEMENT lines will show.

## 4. CRITERIA AND DONE
- C1. Replay Accept Build (old and new) and Init Seats on every debater pairing of the launch list, with the live judge order (v6) and model_config_jfl rows:
  - the new asked set = the old asked set minus exactly the seats Init Seats drops for family or same model;
  - with every asked seat ACCEPTing, Init Seats' panel_order, panel_reserve, alt_order and single_judge are equal under both, for every pairing.
  - 42528 pairing: gemini, argon and neon are not asked; sonnet is asked.
- C2. Synthetic: both debaters anthropic (claude vs opus): sonnet is not asked (same model as claude_synthesis), other anthropic seats are asked; a pairing with no barred seat: asked set unchanged.
- C3. The engine-to-seat map in Accept Build equals Init Seats' ENG mc for every engine.
- C4. Engine: only Accept Build changes; every other node byte-equal to ccaf4660; connections equal; standing 31/0; S4 compile; Library Check pair PASSES.
- C5. ASK 599: tagged; no dead code (Accept Build's unused ENG_SEAT is left as it is: not this ASK); no new catch.
- DONE: W1 PASS on plan and build; operator presses W4's card; W4 writes; W1 reads back; two clean live runs (section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if a family-barred seat's agreement is used for something besides seating: for example, the single judge, the enforcer or the synthesis seat. Searched: the single judge excludes debater families; the enforcer and synthesis seats are not drawn from the agreement. C1 shows equal seating on every pairing.
- A second wrong-if: the operator wants every judge's agreement on record whether or not it can sit. Nothing found says so. The agreement step's rule is that a judge that refused does not judge (Plain Rule Lines).

## 6. RUN EVIDENCE
- Case: the first live run whose debaters' family has a judge seat in the order (any google, openai, meta or anthropic debater).
- Mark: no AGREEMENT line and no "Accept Call openrouter" cost for those seats. The row's seating equals what the old engine would seat.
- Cost: saves about $0.08 a run in the 42528 pairing. NO PROBE: the replay is the test.

## 7. INPUTS IN GIT
ask637/w4/plan637.md (this file). The build goes in ask637/w4/b1/: the build script, the target engine, the tests, and a fixture (judge order v6 and the model_config_jfl rows).

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C5 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 637 (judges who cannot sit are not asked to agree)?"
4. W4 writes; fetch back; audit row; Wall post; W1 readback.
5. W3: manual entry and AAR rows.
6. Two clean live runs.
