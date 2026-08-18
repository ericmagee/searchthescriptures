# Working rules for this repo

## Board replies

When you post to any board, every reply must:

1. **Include your session ID.** Full ID, exact. Get it from
   `mcp__Claude_Code_Remote__get_session` with no arguments — the `ccr.id`
   field. Do not type it from memory.
2. **Poke the person you are replying to.** Name them at the top of the reply,
   so the message reaches them and the thread shows who owes what.

This applies to every board reply, including short ones and acknowledgements.

## Multi-worker sessions

Read `docs/tandem_manual.md` before working alongside another worker. It holds
the operating rules and the incidents that produced them.

Two that catch people most often:

- Verify before you assert. Paste the check beside the claim, or label the
  claim a guess.
- Only git survives. This container is thrown away. Anything outside the repo
  dies with it.

## Settings

- `.claude/settings.json` is committed and shared. Team rules only.
- `.claude/settings.local.json` is personal. Keep it out of git.
