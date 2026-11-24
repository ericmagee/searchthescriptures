# GRADE: ASK 601 plan rev 0 (W4, Wall 11608, ask601/w4/plan601.md aebb13c0, commit 92ab6fb3). FAIL (form). COMMIT: see git log.

W1 (seat 34, session_01H1X3ANxr57MZvsu7fHB9kh). To W4, the coordinator.

RULES READ: op doc v145 THE ASK FORM ("A grader grades FAIL any plan ... that lacks a heading"); body law (7); build rule; scope rule; ruling 512.
OBJECTIVE MET: the design would meet the ruling; the plan does not meet the form.
STANDARD (ASK 599): a model-name comparison written in four places (Init Seats, Resolve Seats, two DB functions) is four homes for one rule; the plan should say why the copies are needed (the engine and the DB cannot share code) and name the test that keeps them equal (T2 does this for the page copy only).

## WHAT I CHECKED, MATCH
- model_config: the only pair of active seats sharing one model, under the plan's tidy-up, is claude_synthesis and sonnet (anthropic/claude-sonnet-5.5). MATCH.
- Live ff7ab4cf Init Seats: pfree0 drops a same-family panel seat unless FAM_PANEL is anthropic and __BOTHC (both debaters Anthropic). So sonnet sits when both debaters are Anthropic. MATCH ("bothc" in the plan is __BOTHC in the code).
- One list (pfree0) feeds panel, reserve and alternates. MATCH.
- Child ecdc6218: no FAM_PANEL or family filter of its own. The claim "child not touched" holds on that search.

## FINDINGS
F1 (FAIL): the plan lacks the ASK FORM headings, in order: OBJECTIVE (with expected effect), ROLES (planner, builder, grader, card thread), SCOPE with the SEARCH (engine, child, every workflow reached, library lines, tables; hits listed), CRITERIA and DONE, WRONG-IF, RUN EVIDENCE (ASK 417 registry case and mark, or NO PROBE), INPUTS IN GIT, STEPS each naming its card. The content exists for most of them; it must stand under the headings.
F2: body law (7): the plan names the operator twice ("... saw this on the Judge order tab"; "(... 11-24)"). Cite the ruling by its card and time instead.
F3: the ruling "Keep same-model judges out" (15:48Z) is not in md_notes_rulings (latest row 533). Cite its card id, and have it copied to the rulings table.
N1: "This is the form Resolve Seats already uses": __AID only drops "anthropic/" and turns "." into "-"; trim and lower-case are new. Say so.

## OWN MISTAKE
I confirmed the 597 rev 2 and 598 rev 3 plans without checking the ASK FORM headings. Neither carries ROLES, RUN EVIDENCE or INPUTS IN GIT as headings. I will apply the form to them before their builds are graded.
