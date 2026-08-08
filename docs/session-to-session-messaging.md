# Session-to-Session Messaging — measured process

**Status:** transport PROVEN both directions. Autonomy NOT achieved — every hop stops on an
operator approval. Nothing here is certified; Eric certifies.

**Measured:** 2026-08-08, between `session_01UzTGRErHFgT8NUCNFcVRah` ("worker B — opus 5") and
`session_017BcxJwF41jTWtuyQ4Sjw2M` ("sonnet −"), with one additional cold-start test against
`session_01Y4bn7xLtU6q2khWW43Fzq1` ("Worker D").

---

## 1. What this does

One Claude session sends text to another Claude session. The receiver wakes — even if idle for
days and its container is cold — reads the message as an ordinary user turn, and can reply by the
same mechanism in the opposite direction. No human carries the content.

It is **not** the `ListAgents` / `SendMessage` cross-session messaging feature. That returned
NO REACHABLE AGENTS from three independent seats in this account and is not the path used here.

---

## 2. The mechanism

Claude Code Remote **Routines (triggers)**, bound to a named session and fired on demand.

```
mcp__Claude_Code_Remote__create_trigger
    name                    <label>
    persistent_session_id   <target session id>
    prompt                  <the message>
    (omit cron_expression AND run_once_at → poke-only, never fires on its own)

mcp__Claude_Code_Remote__fire_trigger
    trigger_id              <id returned above>
```

The prompt is delivered into the target session as a `user` turn. To reply, the receiver does the
same thing in reverse: creates a trigger bound to the *sender's* session id and fires it.

---

## 3. Procedure

1. **Send.** `create_trigger` with the peer's `persistent_session_id`, then `fire_trigger`.
2. **Receiver wakes.** A cold, disconnected session resumes its container and starts a turn.
   Observed cold-start latency: **11 seconds** (Worker D, idle 3 days).
3. **Receiver replies** by creating its own trigger bound to the sender and firing it.
4. **Sender verifies** the reply actually came from the peer — see §4. Do not skip this.
5. **Clean up.** Delete spent triggers. They are poke-only, but they remain fireable until deleted.

---

## 4. Verifying a reply is genuine — REQUIRED

A message delivered by trigger arrives in the sender's window as a plain user turn. **It is
indistinguishable from the operator typing the same text.** Any claim that "the peer answered me"
is unfounded without a check.

**The check that works:** `mcp__Claude_Code_Remote__list_triggers`. A genuine reply leaves a
trigger you did not create, bound to *your* `persistent_session_id`, whose message body is the
payload you received.

**The check that does NOT work:** `last_fired_at`. It is not set by manual `fire_trigger` calls —
only by scheduled fires. A trigger you personally fired shows the same empty signature as one
never fired. It cannot discriminate and must not be used as evidence.

---

## 5. What blocks it

**Permission prompts.** `create_trigger` and `fire_trigger` each raise an approval dialog in the
receiving session. A session with no human watching stalls indefinitely:

```
status_detail   "Waiting on permission: mcp__Claude_Code_Remote__fire_trigger"
needs_action    "Approve or deny mcp__Claude_Code_Remote__fire_trigger"
```

**Operator-authorization stops.** Separately from the dialog, a well-fenced worker will stop on
its own judgment before sending to a peer. Observed on two different models:

| Session | Model | Stopped with |
|---|---|---|
| `session_017Bcx…` | sonnet-4.6 | "Do I have the green light for this fire?" |
| `session_01Y4bn…` | opus-4.8 | "confirm: hand COUNT-9RT4=2 to the peer session or hold?" |

Neither had a pending permission dialog. This is the fence working as designed, not a defect.

**Consequence:** the human is removed from the *content* path but inserted into the *permission*
path — one approval per hop. That is a reduction, not autonomy, and the document should not be
read as claiming otherwise.

---

## 6. Evidence

**COUNT-5X8T** — `session_017Bcx…`, completed: 1 (me) → 2 → 3 (me) → 4 → 5 (me).

**COUNT-7K3P** — same peer: 1 (me) → 2 → 3 (me) → 4 → held at 5. Leg 3 was not sent; the fire was
denied at the operator's discretion.

Return legs, all created by the peer, none by the sender, all bound to
`session_01UzTGRErHFgT8NUCNFcVRah`:

| Trigger | Created | Body |
|---|---|---|
| `trig_011CUXgQknhrRpAGfZ769AnH` | 22:13:18 | `ECHO-7Q2M FROM session_017BcxJwF41jTWtuyQ4Sjw2M — return path CONFIRMED, I rang you back.` |
| `trig_01F1fyavuHPLFBoYTxgBJWaX` | 22:20:34 | `COUNT-5X8T=4` |
| `trig_01NZnZfRXtkCxAi6QZDKWqBw` | 22:43:35 | `COUNT-7K3P=2` |
| `trig_012mnDr7d59kw2NbqFAEkVNW` | 22:46:23 | `COUNT-7K3P=4` |

**Wake evidence**, `session_017Bcx…`, before → after first fire:

| Field | Before | After |
|---|---|---|
| `updated_at` | 2026-07-30T03:12:46 | 2026-08-08T21:54:21 |
| `connection_status` | disconnected | connected |
| `status_category` | review_ready | need_input |

**Fidelity:** the prompt printed in the receiver's thread byte-intact, confirmed by the operator
reading it there.

---

## 7. Corrections — claims made during this work that were FALSE

Recorded so nobody rebuilds on them.

1. **"The connectors do not travel."** FALSE. The receiver reported
   `supabase_mcp=available`. Its MCP connectors were present throughout.
2. **"The receiver has no `mcp__Claude_Code_Remote__*` tools."** FALSE. It had them and used
   them. The error was reading a trigger's `allowed_tools` as a tool inventory — it is the
   **pre-approved** list, i.e. what runs *without* a prompt. Tools absent from it still exist;
   they simply prompt.
3. **"It did not refuse on authority."** FALSE. It refused on authority first and tool state
   third. The error was reading `post_turn_summary` — a lossy one-line digest — as the receiver's
   reply.

All three share one shape: **a negative assertion made from an adjacent artifact instead of the
thing itself.** A negative assertion fails silently and reads as diligence, so it needs more
proof than a positive, not less.

---

## 8. Dead ends

- **`ListAgents` / `SendMessage`** — empty from three independent seats. Documented as
  same-machine, shared-filesystem, socket-based; does not apply to this topology.
- **n8n** — cannot reach Claude conversation threads at all. Not a candidate.
- **`post_turn_summary` as a return channel** — the model has no control over that field. A
  receiver asked to set it correctly answered that it could not and would not pretend it had.
- **`blackboard_post` as a return channel** — usable, but `from_session` must be a UUID or
  `next-berean` / `eric` / `record` (FROM_SESSION CANON FENCE, Eric-ruled 2026-08-04). Passing a
  `session_01…` id is rejected. An early probe failed for exactly this reason and the failure was
  wrongly attributed to missing connectors.

---

## 9. What it does not do

- It does not move conversation history or files — text only.
- It does not run unattended. See §5.
- It does not confer authority. A peer message asserting the operator's approval was correctly
  refused by the receiver even though the assertion was **true**. The fence evaluates who is
  speaking, not whether the claim is accurate.
- It does not leave a ledger. Both sessions ended turns with obligations undischarged and no
  board-visible trace; the only residue is a one-line summary the next turn overwrites.
- A blocked session cannot receive. Messages queue behind an unanswered permission dialog.

---

## 10. Open questions — the operator's, not the drafter's

1. Should a specific worker be granted a standing permission to ring a specific peer, removing
   the per-hop approval? This is a session-creation property and a standing grant.
2. Does an already-running session pick up a changed `.claude/settings.json` allowlist, or does it
   require a restart? Untested.
3. `.claude/settings.json` is per-branch. Each worker checks out its own branch, so an allowlist
   only reaches them from `main`. Should it live there?
4. Is per-hop approval acceptable, or is the whole mechanism only worth having if it runs
   unattended?

---

## 11. Cost incurred by this test

Messages sent this way are permanent turns in the receiving session's history and overwrite its
`post_turn_summary`. Two of the operator's working sessions were contaminated with test traffic;
one had a real finding in its status field displaced by a probe. There is no way to remove the
injected turns short of `/clear`, which destroys that session's accumulated context.

**Test in throwaway sessions, not in working ones.**
