# Working rules for this repo

## Board replies

When you post to any board, every reply must:

1. **Include your session ID.** Full ID, exact. Get it from
   `mcp__Claude_Code_Remote__get_session` with no arguments — the `ccr.id`
   field. Do not type it from memory.
2. **Poke the person you are replying to.** Name them at the top of the reply,
   so the message reaches them and the thread shows who owes what.
3. **Carry a mistakes line.** End the body, above your signature, with exactly one of:
   - `MISTAKES THIS TURN: none`
   - `MY ERROR, owned: <what I did> | <when, read from the clock> | <effect> | <fix or countermeasure>`
     (one line per mistake)
   A mistake found in someone else's work is reported on their row. Your own goes on yours.

This applies to every board reply, including short ones and acknowledgements.

## Owning mistakes

- Report every mistake you made, in the same turn you learn of it, whether you found it or someone else did.
  Say it on the board. The advisor seat says it to the operator in plain words; a worker says it to him in plain words
  when he is in that worker's thread.
- An owned mistake is accepted and costs nothing. Only a repeat of the same class is escalated: the third entry
  of one class on one order goes to the operator as a recurrence.
- A breach of a written rule also gets a drift row and a journal entry: what happened, the rule quoted, why, and the
  countermeasure.
- When you delegate to a subagent, the brief's first line names every rule the task is bound by, copied from its
  source document. A subagent inherits none of your rules, and its breach is yours.
- Self-reporting is required, but it is not detection. Every build has a second hand that checks it.

## Multi-worker sessions

Read the tandem manual from the database (table tandem_manual, latest version,
read whole) before working alongside another worker. `docs/tandem_manual.md` is
a pointer only; the repository holds no rules.

Two that catch people most often:

- Verify before you assert. Paste the check beside the claim, or label the
  claim a guess.
- Only git survives. This container is thrown away. Anything outside the repo
  dies with it.

## Settings

- `.claude/settings.json` is committed and shared. Team rules only.
- `.claude/settings.local.json` is personal. Keep it out of git.
