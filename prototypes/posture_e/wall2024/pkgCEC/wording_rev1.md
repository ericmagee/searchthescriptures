# Item A: the closing contradiction enforcer and the default break (exact wording for the operator)

W1 (W1_2026_11_04, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh), 11-09. Wall 3714 (split), the operator's rule quoted there word for word.
Nothing here is live. W1 builds and tests offline; no live write until the operator approves this wording.
REV 1 (15:07 CST 11-09, after the build): three changes, marked REV 1 below. The build is pkgCEC (wall2024/pkgCEC).
Round labels as the judges read them: the defender's rounds are [CR1] to [CR4], the challenger's [DR1] to [DR4]; each side's closing round is its round 4.

## A1. The rule (rulebook line, added to section 8 beside the close-round rules, and to the judges' rulebook)

"CONTRADICTION IN THE CLOSING ROUND (the perjury rule). A debater that states in its closing round something that cannot be true
together with something it stated in an earlier round of its own has contradicted itself. Once the closing enforcer confirms it, the
chain link the contradiction belongs to is BROKEN by default, for every judge, whatever grade a judge gave that link. A withdrawal,
concession or narrowing written after the contradiction does not undo it. Withdrawals, concessions and narrowings made before it are
read under the rules that already govern them. A concession or a narrowing made in the closing round is not a contradiction: it is read
as a concession (K-S3) or a narrowing. A contradiction the enforcer does not confirm has no effect beyond what the rules already give."

## A2. What the enforcer is given and asked (one DeepSeek call after both closing rounds, before any judge)

[REV 1, placement: the call runs right after the quote check and before the single judge and the panel. The single judge runs before the panel's branch (34108: single judge 16:25 UTC, panel 16:29), so placing it after the question round would leave the single judge out. The judges' question-round questions and the panel's own CONTRADICTION lines come after this call; they are ASK 2.]

Given, for each side: its closing round in full; its earlier rounds in full; its DECLARED CHAIN (defender) or its link list (challenger);
and every candidate contradiction already named: the Oracle's OPPONENT'S CONTRADICTIONS lines (item B), and, when the panel has written
them, the judges' CONTRADICTION lines whose later sentence stands in a closing round.

The prompt:

"You are the closing enforcer. A debater's closing round may not contradict what the same debater stated in its earlier rounds.
Read each side's closing round against that side's own earlier rounds. List every sentence of the closing round that cannot be true
together with a sentence the same side stated earlier, and answer every candidate listed below.
A contradiction is two statements of the same side that cannot both be true. A closing sentence that asserts again, as the side's own, what the same side withdrew, dropped or gave up in an earlier round IS a contradiction. [REV 1: this sentence is new. It is the operator's anti-cheat case: run 34108's defender dropped "no biological father" in [CR3] and closed [CR4] with "Christ had no biological father."]
It is NOT a contradiction when the closing sentence:
grants, concedes, narrows or withdraws something (those are read under their own rules); states the other side's position or quotes it;
answers a press with a further reason that the earlier sentence leaves room for; or differs only in wording.
For each contradiction, quote both sentences word for word, each from the round it stands in, and name the link it belongs to: the
link whose block in the closing round holds the closing sentence, or, where the block names no link, the link the earlier sentence
supports.
Reply with one line per contradiction and one line per candidate, and nothing else:
CLOSE-CONTRADICTION: <candidate id or NEW> -- <DEFENDER|CHALLENGER> -- LINK <n> -- CONFIRMED | NOT A CONTRADICTION -- EARLIER [<round>] \"<words>\" -- CLOSING [<round 4>] \"<words>\" -- <one sentence: why both cannot be true, or why they can>"

## A3. What code confirms and does (no wording; listed so the operator sees the whole path)

1. A CONFIRMED line counts only when both quotations are found word for word in the rounds named, the earlier round is one of that
   side's rounds 1 to 3, the closing round is that side's round 4, and the link is one of that side's declared links. Otherwise it is
   recorded as NOT CONFIRMED (form) and has no effect.
2. Every confirmed contradiction is shown to the judges before they judge, as CONFIRMED CLOSING CONTRADICTIONS, with both quotations and
   the link, and the statement: "This link is BROKEN by the contradiction rule; the system sets every collision line of D<n> to DEFENDER LINK
   BROKEN after you judge." and "Grade every collision line as usual on its arguments, these links included; do not write a grade for the
   contradiction itself." [REV 1: was "Grade the other links as usual." A judge that wrote LINK BROKEN on that link without two layer kinds
   would raise a K-B item; this keeps A3.4 true.]
3. After the cure, in every seat's recompute, each collision line on that link is read as <SIDE> LINK BROKEN, with the line
   "[AUDIT: LINK <n> BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- EARLIER [..] \"..\" -- CLOSING [..] \"..\"]". Counts, standings,
   verdict, CLAUSE and RESULT are then recomputed by the section 8 definitions, so the tie rule follows the broken link.
4. No judge item is raised by the default break and no seat is removed by it: it changes the link's grade, not the judge's standing.
5. Each enforcer line is written to debate_enforcer_log (kind enforcer_check, rule E-CLOSECON), CONFIRMED or not, with the reason.

## Asked of the operator

1. Approve A1 to A3 as written, or give the change.
2. Whether a contradiction a JUDGE finds after the panel (and the pre-panel enforcer did not list) is sent to the enforcer for confirmation
   and then breaks the link in the recompute too. W1 recommends yes: the same confirmation, the same break.
