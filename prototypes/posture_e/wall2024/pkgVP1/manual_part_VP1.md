# Engine manual part: pkgVP1 (W3), for the write request

## Send-back section: every replaced line is read (RECORD-ONLY; md_notes_rulings 459)
- **E-ANS and E-PREM rows:** the engine's cure reading of the replaced line is written to cure_status (CURED or UNCURED).
- **E-OOR rows:** code runs the E-OOR checks again on the replaced line and writes CURED or UNCURED with the reason.
- **Second reading (E-REREAD):** Send Back Record -> Reread Build -> Reread Needed? -> Reread Call deepseek -> Reread Record -> Gate Build (the same four nodes on the Alt and R2 Alt paths).
  - Asked: each replaced line whose send-back reason opens "(right:" and whose answer is CHANGE. One DeepSeek call, with the first call's rules and ITEM block and the replaced line.
  - Reply line: the first call's own line form for that id (AGREE or DISAGREE, with RIGHT: when it disagrees).
  - Log: debate_enforcer_log, kind send_back, rule E-REREAD; cure_status CURED on AGREE, UNCURED on DISAGREE, empty when no readable line came back.
- Nothing here is counted, removes a seat or changes a verdict field.

## Gate section: E-GATE M, ANSWER OPEN (LIVE)
- **Rule:** "An answer that MISSES or FAILS leaves the witness unanswered (md_notes_rulings 372)". A judge that grades an ANSWER CHECK on a proven press MISSES or FAILS and leaves that link's collision UNDERDETERMINED, with no line of that link graded LINK BROKEN for the pressed side, gets a gate item.
- **Link of an answer check:** a [DR2] premise entry labelled "LINK k" gives Dk; an unlabelled defender entry gives no item; challenger entry j gives Cj.
- **The judge keeps the decision (ruling 428).** The item is cleared by either:
  1. changing the answer check to MEETS; or
  2. changing the collision line to LINK BROKEN for the pressed side, with one FORCED line for that pair as the reason of the GATE line: `FORCED: D<i> vs C<j> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "..."`, each quotation word for word in the round named (ruling 411). The engine writes the FORCED line under the collision line and derives the counts, the standing and the RESULT.
- **Several items on one link:** one cured change to LINK BROKEN, with its FORCED line, answers every ANSWER OPEN item that no longer stands after it; those need no GATE line. A change back to MEETS cures only its own item.
- **With the closing contradiction rule:** a link broken by a confirmed closing contradiction is read as BROKEN for that side; no ANSWER OPEN item is raised on it.
- **UNCURED:** KEEP, silence, a change that stays UNDERDETERMINED, or LINK BROKEN without a FORCED line that passes.
- **Limits:** the gate runs only for a seat that had send-back items; an answered-with-a-fit collision does not count toward a defender win (the operator's ruling, row 459; not built).
