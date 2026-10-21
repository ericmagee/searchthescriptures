# Draft: the same mistake-reporting behaviour for every worker (operator's ask, 21 Oct 2026, 11:44 CDT)

Drafted by Worker_E. Nothing below is written to any live file, table or function. Each part is a system change and
needs the operator's word, routed through the advisor.

## Part 1. CLAUDE.md, the "Board replies" section (read by every session at start)

BEFORE (current text, items 1 and 2 unchanged):

    When you post to any board, every reply must:

    1. **Include your session ID.** ...
    2. **Poke the person you are replying to.** ...

    This applies to every board reply, including short ones and acknowledgements.

AFTER: add item 3, and one new section below it.

    3. **Carry a mistakes line.** End the body, above your signature, with exactly one of:
       - `MISTAKES THIS TURN: none`
       - `MY ERROR, owned: <what I did> | <when, read from the clock> | <effect> | <fix or countermeasure>`
         (one line per mistake)
       A mistake found in someone else's work is reported on their row. Your own goes on yours.

    ## Owning mistakes

    - Report every mistake you made, in the same turn you learn of it, whether you found it or someone else did.
      Say it to the operator in plain words as well as on the board.
    - An owned mistake is accepted and costs nothing. Only a repeat of the same class is escalated: the third entry
      of one class on one order goes to the operator as a recurrence.
    - A breach of a written rule also gets a drift row and a journal entry: what happened, the rule quoted, why, and the
      countermeasure.
    - When you delegate to a subagent, the brief's first line names every rule the task is bound by, copied from its
      source document. A subagent inherits none of your rules, and its breach is yours.
    - Self-reporting is required, but it is not detection. Every build has a second hand that checks it.

## Part 2. The board enforces the mistakes line (blackboard_post, blackboard_answer, blackboard_post_closed)

Specification (the code is written only after the operator's word, under the normal build-and-verify path):

- The body must contain a line matching `^MISTAKES THIS TURN: none$` or one or more lines starting `MY ERROR, owned: `.
- If neither is present, the function refuses with nothing inserted and no id used, in the same form as the 2,000-character
  refusal: `body carries no mistakes line; add "MISTAKES THIS TURN: none" or "MY ERROR, owned: ..."`.
- The line counts toward the 2,000-character cap.
- Rows posted before the change are untouched.
- Undo: restore the three functions' prior definitions, saved before the change.

## Part 3. The mandatory refresh asks for it

Add to the operator's refresh order, as its last item, and to the tandem manual's refresh section:

    N. List every mistake you made since your last refresh: each one owned on the board? If any was not, own it now
       (board row, and drift and journal if it breached a written rule), then report the list to the operator.

## Order of application, if approved

1. Part 1 (CLAUDE.md): a commit to the repository; takes effect for each session at its next start.
2. Part 3 (refresh text): a new version of the tandem manual and the refresh order.
3. Part 2 (board function): last, after workers have used the line for a while, so the refusal catches omissions, not
   habits still forming.
