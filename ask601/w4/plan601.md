# ASK 601 plan rev 0 (W4): a judge never runs the same model as a debater
Ruling (card "Keep same-model judges out", 15:48Z 11-24): a judge whose model is the same as either debater's model never sits, even when both debaters are Anthropic. The change goes LIVE (ruling 512).

## What happens now (read on live ff7ab4cf and the DB, 11-24)
- When both debaters are Anthropic, the engine's both-Anthropic rule (bothc, ASK 375) lets an Anthropic judge sit. It does not compare models.
- Debater "claude" is seat claude_synthesis, whose model is anthropic/claude-sonnet-5.5. Judge seat sonnet has the same model.
- So in Opus vs Claude, sonnet stays in the line-up as alternate 5. Eric saw this on the Judge order tab.
- Among the active model_config rows, the only pair of seats sharing one model is claude_synthesis and sonnet. The rule compares models, not names, so it also covers any pair added later.

## The rule
Two models are the same when their names match after this tidy-up: trim, lower-case, drop a leading "anthropic/", and turn "." into "-". This is the form Resolve Seats already uses for the direct Anthropic id, so "anthropic/claude-sonnet-5.5" equals "claude-sonnet-5-5".

## Changes (touched code only; no model settings; no prompt or reasoning text)
1. Init Seats (engine) builds the panel, the reserve and the alternates from one list (pfree0).
   - Add one filter to pfree0: drop a seat whose model is the same as either debater's model, with the reason "runs the same model as a debater (<model>)".
   - The models come from the Accept Models rows Init Seats already reads (model_config_jfl). For the debaters it uses D.mc_seat and C.mc_seat.
   - If a debater's row is missing, nothing is dropped here; Resolve Seats already fails the run on a missing debater row.
   - Because panel, reserve and alternates all come from this list, the one filter covers all three.
   - The drop reason reaches review_notes through the existing dropped-seat report (ALT_DROPPED).
2. Resolve Seats (engine) is a second guard, using D.model and C.model, which it already holds:
   - a panel judge with a debater's model fails the run, closed, with the reason;
   - a reserve or alternate with a debater's model is filtered out.
   This guards against the two nodes disagreeing later.
3. odv1_record_panel_alternates (DB) gets a new guard G4: an alternate whose model equals a debater's model raises, beside G1 (family) and G2.
   - The change is an exact-text replace with an md5 gate, as in fix 1 and fix 2.
   - odv1_record_panel_substitution reads no models, so it is unchanged.
4. dash_judge_lineup (DB, the Judge order page copy) gets the same filter at the same point, so the page shows what the engine will seat.
   - The change is an exact-text replace with an md5 gate (caea9e6c).
   - The page's dropped list shows the reason.
5. The child workflow is not touched; its alternates come from Resolve Seats.

## Effect
- Opus vs Claude, and Claude vs Opus: sonnet is dropped as "runs the same model as a debater (anthropic/claude-sonnet-5.5)".
  - Judge order v2 panel (sol, sol62, spark) and the other alternates are unchanged.
  - Sonnet can still sit when neither debater runs Sonnet 5.5, which today means opus against another Anthropic seat.
- Every other pairing: no change.

## Tests (offline, before the card)
- T1: run the Init Seats and Resolve Seats code on the 16x15 = 240 debater pairs against judge order v2. The output differs from live only where a judge seat's model equals a debater's model, and in each such pair that seat is dropped with the reason.
- T2: dash_judge_lineup new copy (in pg_temp) equals the engine line-up on all 240 pairs (as the 591 test did).
- T3: odv1_record_panel_alternates new copy (pg_temp) raises G4 for sonnet when Opus vs Claude, and passes the stored alternates of runs 42071 and 42234.
- T4: standing set 29/29; pair Library Check passes; fetch-back after write equals the target.
- No DELETE or UPDATE in the tests, so the safeupdate difference does not apply.

## Write (one card, three parts, in this order)
DB functions (G4, page copy), then the engine (Init Seats and Resolve Seats). The dashboard needs no deploy. Revert files are kept for each part.

## Proof live
The next run with a claude debater and both debaters Anthropic shows sonnet in the dropped list. Two clean live runs count as a pass (Eric 11-24).
