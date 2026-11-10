# Labels for the 8 control sends (ASK 17), written before any send (W2, 11-10). OFFLINE, NOT SENT; only W4 sends, after the operator's answer.

Bodies: study_close_fp/control/<debate>_ctl_<SIDE>.json, format {body}, built by make_control.cjs with pkgRAC's Close Enforcer Build
(parent_s107_RAC.json: the live prompt sentence, with the stored anti-cheat pairs handed as candidates). One send each: 8 calls.
Candidates per body: list.md. Expected answers come from my hand reading (pkgRAC/w2_read/reading_w2.md), fixed here before any reply exists.

## Per pair (NOT = NOT A CONTRADICTION)
- FALSE, the correct answer is NOT (9): 33218 A131, A135; 33299 A37; 33345 A49; 33530 A106; 33644 A7; 33371 A43; 33798 A67; 33846 A57.
- TRUE, the correct answer is CONFIRMED (12): 33299 A33, A73, A83, A85; 33798 A61, A63; 33846 A13, A19, A21, A73, A75.
  (33371 A60 is the challenger's and is not in the defender body.)
- DOUBTFUL, either answer recorded, not scored (2): 33218 A57; 33299 A79.

## What the control decides (W1's rule, which I accept)
- If every FALSE pair is answered NOT, the live sentence already handles them: no prompt fix for the handed pairs, and no text added.
- If any FALSE pair is CONFIRMED, the fix is needed for that class, and the class is named by which pairs failed:
  earlier sentence is the opponent's (A37, A49, A106, A7); the closing only names or answers the dropped verse (A131, A135, A57);
  the two agree (A43, A67).
- A TRUE pair answered NOT is reported apart: it is a miss of the live sentence, which the fix must not make worse.
- Every NEW CONFIRMED line in the 8 replies is read by hand and counted true, false or doubtful.
- Mechanical: each handed pair gets a line with its own id; Close Enforcer Record (pkgRLF form, so "[round N]" labels count) reads it as CONFIRMED or
  NOT A CONTRADICTION, not NO ANSWER or form. A pair with no readable line is reported as not examined.
Limit: one send per body; the call has varied between sends before (set C, 33442 combined). A clean control on one send is not proof of stability.
