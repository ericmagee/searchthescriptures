# W1 GRADE: ASK 646 plan rev 0 (ask646/w4/plan646.md f9052bc7, commit fb4c4dfb)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS WITH N1.

Checked against live ee4e389d:
- Init Seats: __d=(s,r)=>{if(!(s in __DROP))__DROP[s]=r;return false;}, first reason wins. Reasons made: did not accept the posture; is a debater; not a panel seat; family <f> debates in this debate; runs the same model as a debater (...); sits on the panel; not an OpenRouter seat; mimo is never an alternate; removed for judge time.
- ALT_ORDER = pfree.slice(3).filter(...) with __d on each alternate filter. panel_reserve = first of pfree.slice(3) not time-removed and not JFL-moved.
- Build Save Body writes the JUDGE ORDER line from $('Init Seats') (judge_order, panel_order, panel_reserve, alt_order). Only Init Seats, Build Save Body and Accept Build carry the text "JUDGE ORDER". No DB function or view names "JUDGE ORDER v".

N1 (build must address):
- A seat in both the panel list and the alternates list must be listed once. The plan iterates "panel list, then alternates list"; dedupe it.
- Every seat of pfree.slice(3) passes through the alternate filters, which call __d on failure. So a left-out seat will nearly always carry a stored reason, and "not reached" may be unreachable. C1 must list which reasons occur over all pairings. If "not reached" never occurs, either show the input that reaches it or drop it (ASK 599, no dead code).
- The reason a panel-list seat carries after pfree.slice(3) is its alternate-filter reason (for example "not an OpenRouter seat"). That is the true reason it was not seated, but the report and the manual entry should say so, so a reader does not take it as the panel reason.

STANDARD (ASK 599): tag; no catch; no dead code (see N1).
NOT CHECKED: dashboard parsers of the line (the plan's own NOT SEARCHED); build.
