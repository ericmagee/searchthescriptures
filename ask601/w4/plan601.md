# ASK 601 PLAN rev 1 (W4): a judge never runs the same model as a debater
Rev 1 answers W1 Wall 11609 (F1 to F3, the standard note, and N1). PASS WITH N1, N2 (Wall 11612); both notes closed here.

## OBJECTIVE
A judge whose model is the same as either debater's model never sits: not on the panel, not as the reserve, and not as an alternate. This holds even when both debaters are Anthropic.
- Ruling: decision card cmsg_017ZQamDMHrS6fqMHnQDVo583pdnTfBZeZFqgAwoz5sr1g, pressed "Keep same-model judges out", 15:48Z 11-24.
- The change goes LIVE (ruling 512).

## ROLES
- W4 builds and writes. A write happens only on a press of W4's card.
- W1 grades the plan and the build, and does the readback after the write.
- The coordinator relays.
- W3 drafts the manual entry and the AAR row.

## SCOPE, with SEARCH
Search done on live engine ff7ab4cf, child ecdc6218 and the DB (11-24, about 11:40 CST):
- The both-Anthropic rule (__BOTHC in Init Seats pfree0; __CC in Resolve Seats; bothc in dash_judge_lineup; the G1 exemption in odv1_record_panel_alternates) lets an Anthropic judge sit when both debaters are Anthropic. None of the four compares models.
- Debater "claude" is seat claude_synthesis, model anthropic/claude-sonnet-5.5. Judge seat sonnet has the same model. Among the active model_config rows, this is the only pair of seats sharing a model.
- The child has no seat filter of its own; its alternates come from Resolve Seats.
- odv1_record_panel_substitution reads no models.

In scope (touched code only):
1. Init Seats: one filter on pfree0, which the panel, the reserve and the alternates all come from.
   - It drops a seat whose model equals either debater's model, with the reason "runs the same model as a debater (<model>)".
   - Models come from the Accept Models rows Init Seats already reads, keyed by D.mc_seat and C.mc_seat.
   - If a debater's row is missing, nothing is dropped here; Resolve Seats already fails the run on a missing debater row.
2. Resolve Seats: a second guard, using D.model and C.model.
   - A panel judge with a debater's model fails the run, closed, with the reason.
   - A reserve or alternate with a debater's model is filtered out.
3. odv1_record_panel_alternates (DB): new guard G4. An alternate whose model equals a debater's model raises.
4. dash_judge_lineup (DB, the Judge order page): the same filter at the same point.

Out of scope: reasoning and prompt text, model settings, the child, the dashboard files.

Model match:
- Two models are the same when their names match after four steps: trim; lower-case; drop a leading "anthropic/"; turn "." into "-".
- Dropping "anthropic/" and turning "." into "-" is what Resolve Seats' __AID already does. Trim and lower-case are NEW here (N1), added so case or spaces in model_config cannot hide a match.

Why four homes (standard):
- The engine picks seats in Init Seats. Resolve Seats is the first node that holds the debaters' resolved models.
- The DB records the alternates and guards them on its own.
- The page cannot run engine code, so it has its own copy in dash_judge_lineup.
- Each home already carries the family rule today, so the model rule goes beside it in each.
- Test T5 keeps all four equal.

## CRITERIA AND DONE
- Opus vs Claude and Claude vs Opus: sonnet is dropped as "runs the same model as a debater (anthropic/claude-sonnet-5.5)". The panel (sol, sol62, spark) and the other alternates are unchanged.
- Every other pairing is unchanged.
- Tests:
  - T1: Init Seats plus Resolve Seats code run on all 240 debater pairs against judge order v2. Output differs from live only in the pairs where a judge's model equals a debater's, and there the seat is dropped with the reason.
  - T2: the new dash_judge_lineup (pg_temp copy) equals the engine line-up on all 240 pairs.
  - T3: the new odv1_record_panel_alternates (pg_temp copy) raises G4 for sonnet in Opus vs Claude, and passes the stored alternates of runs 42071 and 42234.
  - T4: standing set 29/29; pair Library Check passes.
  - T5 (four homes equal): for all 240 pairs, the same seats are dropped for the same model in Init Seats, Resolve Seats, dash_judge_lineup and the G4 check.
  - No DELETE or UPDATE in the tests, so safeupdate does not apply.
- Done means:
  - written;
  - fetch-back equals the target;
  - W1 readback MATCH;
  - two clean live runs (the two-live-runs rule, 11-24).

## WRONG-IF
This plan is wrong if any of these holds:
- any of the four homes still lets a same-model seat through;
- any pairing without a same-model seat changes;
- a seat is dropped for a family reason it was not dropped for before;
- the page and the engine disagree on any pair.

## RUN EVIDENCE (ASK 417)
- I found no ASK 417 registry entry for seat selection (searched the plans in git and the DB table names). This plan's check below is its run evidence.
- Live: the next run where a debater runs Sonnet 5.5 and both debaters are Anthropic shows sonnet in the dropped list in review_notes, with the reason.
- Runs with other pairings show the same line-up as before.
- Two clean live runs count as a pass.

## INPUTS IN GIT
- Live fetch-back: ask588/w4/fixqr/fetchback_eng_fixqr.json (ff7ab4cf) and fetchback_child_fixqr.json.
- dash_judge_lineup is live at md5 caea9e6c.
- Build and tests go in ask601/w4/.

## STEPS, with their cards
1. Build the four changes and T1 to T5. Post them on the Wall for W1's grade.
2. On PASS: ONE card to the operator, "Write the same-model rule". It writes in this order: the DB functions (G4, page copy), then the engine (Init Seats, Resolve Seats). Revert files are kept for each part.
3. After the write: fetch-back, audit row, Wall post, W1 readback, memory and md_notes.
4. W3 drafts the manual entry and the AAR row.
