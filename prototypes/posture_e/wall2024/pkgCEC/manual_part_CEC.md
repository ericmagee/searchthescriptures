# Engine manual part: pkgCEC (W1), for the write request

## Section 8, beside the close-round rules (rulebook line A1)
CONTRADICTION IN THE CLOSING ROUND (the perjury rule).
- A debater that states in its closing round something that cannot be true together with something it stated in an earlier round of its own has contradicted itself.
- Once the closing enforcer confirms it, the chain link the contradiction belongs to is BROKEN by default, for every judge, whatever grade a judge gave that link.
- A withdrawal, concession or narrowing written after the contradiction does not undo it.
- Withdrawals, concessions and narrowings made before it are read under the rules that already govern them.
- A concession or a narrowing made in the closing round is not a contradiction: it is read as a concession (K-S3) or a narrowing.
- A closing sentence that asserts again, as the side's own, what the same side withdrew, dropped or gave up earlier is a contradiction.
- A contradiction the enforcer does not confirm has no effect beyond what the rules already give.

## Flow (after Quote Report, before Regrade After Quotes?)
**Close Enforcer Build -> Close Enforcer Needed? -> Close Enforcer Call deepseek -> Close Enforcer Record**
- It is one DeepSeek call, made before the single judge and before the panel.
- **Inputs:**
  - each side's four rounds in full;
  - its declared links: the [CR1] DECLARED CHAIN, and the [DR3] LINK blocks;
  - the candidates: the Oracle's OPPONENT'S CONTRADICTIONS lines in [DR4].
- **Reply line:** `CLOSE-CONTRADICTION: <id|NEW> -- <DEFENDER|CHALLENGER> -- LINK <n> -- CONFIRMED | NOT A CONTRADICTION -- EARLIER [<round>] "<words>" -- CLOSING [<round 4>] "<words>" -- <why>`
- **Code confirms a CONFIRMED line** only when all of these hold; otherwise the line is NOT CONFIRMED (form):
  - both quotes are found word for word in the rounds named;
  - the earlier round is that side's round 1 to 3;
  - the closing round is its round 4;
  - the link is declared.
- **Log:** debate_enforcer_log, kind enforcer_check, rule E-CLOSECON, seat "close enforcer". Alternate Merge adds the rows to enforcer_log.

## Shown to the judges
Panel Build and Build Independent Verdict add a CONFIRMED CLOSING CONTRADICTIONS block under the side's close round. It holds both quotes and the link, and says:
- "This link is BROKEN by the contradiction rule; the system sets every collision line of Dn to DEFENDER LINK BROKEN after you judge."
- "Grade every collision line as usual on its arguments, these links included; do not write a grade for the contradiction itself."

## The break (library cecBroken2024, cureRecompute, sbApply2024)
- **Each seat's recompute.** It applies after the cure, and the send-back recompute applies it too. Every collision line of the broken link reads `<SIDE> LINK BROKEN`, with `[AUDIT: LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- <SIDE> -- EARLIER [..] ".." -- CLOSING [..] ".."]`. The trigger reads `CLOSE-CONTRADICTION <line> (<old> to <new>)`.
- **Recomputed after it:** counts, standings, CLAUSE, verdict and RESULT, by the section 8 definitions and the tie rule.
- **When both sides' breaks reach one line:** the defender's break holds, and the trigger names the challenger's.
- **A broken link that no line names:** it counts as one broken line.
- **Seats with no rule item:** they still recompute when a contradiction is confirmed. This covers the panel, the alternates (rounds 1 and 2) and the single judge.
- **No item or removal:** the break raises no judge item and removes no seat.

## Rev 2: contradictions a judge finds (operator ASK 2 = YES, 15:15 CST 11-09)
**Judge Contradiction Build -> Needed? -> Call deepseek -> Record** sits between Panel Payloads and Panel Cure Needed?.
- **Candidates:**
  - each judge's CONTRADICTION line whose later sentence stands in that side's closing round (panel and single judge);
  - each contradiction question of the dry question round.
- **Not sent again:** a pair the pre-panel enforcer already answered. No candidate means no call.
- **Checks:** the same prompt rules and the same code checks as before; the call answers candidates only.
- **A confirmed line** breaks its link in every panel, reserve and alternate seat's recompute. The single judge's recompute runs before the panel and is not reached.
- **Log:** seat "judge contradiction enforcer", rule E-CLOSECON.
