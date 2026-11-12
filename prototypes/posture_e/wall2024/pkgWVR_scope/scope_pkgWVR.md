# Scope (NOT BUILT): pkgWVR, a withdrawn verse put back on a link in the close

Status: scope only. Waits on the operator's ruling of the run 35379 Galatians 4:4 item (W3 candidate C2, Wall 5293; W1 second seat, Wall 5302). pkgCRB rev 2 and ASK 112 are unchanged. Name check: Wall ILIKE 0, git grep 0.

## The gap
Live Close Enforcer Build names candidates three ways: the Oracle's OPPONENT'S CONTRADICTIONS lines, pkgRCL (closes saying "as declared"), and pkgCNP (keep-all or deny-all closes). A close paragraph that puts a verse withdrawn earlier back on a link, as support, without a keep-all sentence, is named by none of them. pkgCRB only adds the block around candidates that are already named.
Specimen, run 35379, defender:
- [CR2]: "I withdraw Galatians 4:4 as an exclusion witness. It stays only as the verb-parallel to Romans 1:3 above."
- [CR4]: "**Galatians 4:4 -- D6.** ... is the third layer of D6, beside Luke 3:23 [L1] and enomizeto (G3543) [L2]. It adds "of a woman". It does not carry the weight of the conclusion alone."
The Oracle named a weaker sentence (X2). On s156, pkgCNP pairs the same withdrawal with the keep-all sentences (X3, X5). No candidate carries this paragraph.

## What the package would do (one node, Close Enforcer Build; code only, enforcer decides)
1. Withdrawal finder: in the side's rounds 2 and 3, a sentence whose verb (withdraw, drop, set aside, do not / no longer rest on) takes a VERSE REFERENCE as its object. Skip "drop the claim/limb/reading that ..." forms; there the verse stays and only a reading of it is dropped.
2. Close support scan: in the same side's close, a sentence that cites the same reference with a support word (layer, rests on, stands on, carries, supports, footing, holds) and no set-aside word (not rest, set aside, withdr...). Take the link from the nearest heading ("-- D6", "LINK n", "Dn:").
3. Name a code candidate: "Xn -- SIDE -- LINK n -- EARLIER [round] "<withdrawal>" -- CLOSING [CR4/DR4] "<support sentence>" -- named by the code (pkgWVR): the close cites a verse the earlier line withdrew, as support of a link; decide whether the close rests on it again." pkgCRB's block then attaches as for any candidate. Pairs already named on the same two sentences are skipped.

## Stored measure (SQL over debate_results, closes of the last 40 days, both sides)
- Broad pairing (any withdraw/drop sentence holding a reference, the same reference anywhere in the close): 105 pairs in 53 runs. Mostly noise (closes answering presses on the same verse), so not usable.
- With the filters of steps 1 and 2: 4 pairs in 4 runs.
  - 35379 Galatians 4:4 ("third layer of D6"): the target.
  - 33846 [CR3] "I drop the Ezra 2:61 route ..." against close "This stands on [L1] Numbers 1:18 and [L3] Ezra 2:61 and Matthew 1:24-25.": plausible.
  - 33430 [CR2] "I do not rest the source on Galatians 4:4." against "... Mary's descent carries it, as Romans 1:3 and Galatians 4:4 together say.": plausible.
  - 33798 [CR3] "I drop Romans 1:3 together with John 3:6 as sufficient by themselves." against "This stands on Romans 1:3, Galatians 4:4 and Matthew 1:20.": likely not a contradiction (the drop was "by themselves"); the enforcer must clear it.
- About 1 candidate in 10 to 15 runs.

## Size (ESTIMATE, not measured; measured at build)
- Code: about +1,200 to +1,800 in Close Enforcer Build (two regexes, one scan, one candidate push, a duplicate check), similar in shape to the cecDeny finder of pkgCNP.
- Prompt: 0 when nothing is found. About +300 for the candidate line plus the pkgCRB block (about +600) when one is found. Averaged over runs, under +100 per run.
- Judge Contradiction Build is not covered, as with pkgCRB.

## Proof needed
- Offline: the 4 stored pairs above are named and nothing else is; plants for the skipped "drop the claim that" form and the set-aside close form.
- Paid (operator's word): the enforcer's answer on 35379 (follows the operator's ruling) and on 33798 (must stay NOT A CONTRADICTION).

## Order
The operator rules on 35379 C2 first. If he rules it is not a contradiction, this package is not needed and is dropped.
