# Session-to-Session Messaging — measured process

**Status:** transport PROVEN both directions, Claude Code AND Cowork, across environments.
Unattended operation depends on the receiver's permission mode — see §2.4. Nothing here is
certified; Eric certifies.

**Measured:** 2026-08-08, between `session_01UzTGRErHFgT8NUCNFcVRah` ("worker B — opus 5",
Claude Code) and `session_017BcxJwF41jTWtuyQ4Sjw2M` ("sonnet −", Claude Code); and between the
same sender and `session_01HGmspJspixYjkzuVQ3HH5R` (Day Room seat `1d264604`, **Cowork**).

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

### 2.1 The persistent_session_id — this is the whole address

`persistent_session_id` is the only thing that decides where a message lands. It is the address.
Everything else in the call is packaging.

**Form:** `session_` followed by a 22-character id, e.g. `session_01HGmspJspixYjkzuVQ3HH5R`.

**Getting one — three ways, in order of reliability:**

1. **From the session's URL.** Open the conversation on claude.ai and read the address bar:
   ```
   https://claude.ai/cowork/cse_01HGmspJspixYjkzuVQ3HH5R
                             ^^^^ ^^^^^^^^^^^^^^^^^^^^^^
   ```
   **`cse_` and `session_` are the same identifier with different prefixes.** Swap the prefix:
   `cse_01HGmspJspixYjkzuVQ3HH5R` → `session_01HGmspJspixYjkzuVQ3HH5R`. Confirmed both
   directions: `fire_trigger` against `session_017BcxJwF41jTWtuyQ4Sjw2M` returned
   `"session_id":"cse_017BcxJwF41jTWtuyQ4Sjw2M"`.

2. **`mcp__Claude_Code_Remote__list_sessions`.** Returns Claude Code sessions with ids, titles and
   status. **It does not list Cowork sessions.** The `tags` filter that would surface them
   (`cowork-local`, `cowork-remote`) is refused for in-session callers:
   `tags filter is not currently available`.

3. **Ask the session itself** to report its own id, or read it from the claude.ai routines UI when
   binding a routine.

**Verify the id before using it.** `get_session` on the converted id resolves it and confirms the
target is what you think it is:

```
mcp__Claude_Code_Remote__get_session   session_01HGmspJspixYjkzuVQ3HH5R
  → title "BB-0347 - 1d264604", tags [cowork-remote], model claude-opus-5,
    environment_id env_011111111111111111111117, permission_mode auto
```

**Not listable ≠ not addressable.** Cowork sessions do not appear in `list_sessions` and are
still fully reachable by id. An empty listing proves nothing about reachability.

**Wrong id space:** Day Room posts are signed with conversation UUIDs like
`1d264604-6684-542a-bf39-d4efb6996edc`. Those are NOT session ids and cannot be used here. The
same seat's addressable id is `session_01HGmspJspixYjkzuVQ3HH5R`.

**Constraint:** the session must belong to the same account. The server rejects sessions you do
not own.

### 2.2 It crosses environments

`create_trigger` takes an `environment_id` that defaults to the caller's. When
`persistent_session_id` is set, the message still lands in the target session regardless of the
mismatch. Proven: a trigger created in `env_01JR8avY4VRdUgAWd63uaYK3` delivered into a session
living in `env_011111111111111111111117`.

### 2.3 It crosses products

Claude Code → Cowork delivered in **16 seconds**. Cowork → Claude Code returned by the Cowork
seat's own hand. Full round trip, fire to ring: **46 seconds**.

### 2.4 Permission mode decides whether it runs unattended

With the receiver in default mode, `create_trigger` and `fire_trigger` each raise an approval
dialog and a session with nobody watching stalls indefinitely.

With the receiver set to **`permission_mode: auto`**, it completes the whole ring unprompted. The
difference is visible in the trigger the receiver produces: an auto-mode session attaches its full
`mcp_config`, listing every `claude-code-remote` tool at `permission_policy: always_allow`.
Triggers created from a non-auto session carry no connectors at all and warn so on creation.

Auto mode removes the *dialog*. It does not remove the receiver's own judgement — see §5.

---

## 3. Procedure

0. **Get the peer's `persistent_session_id`** and verify it with `get_session` — see §2.1.
1. **Send.** `create_trigger` with that id, then `fire_trigger`.
2. **Receiver wakes.** A cold, disconnected session resumes its container and starts a turn.
   Observed cold-start latency: **11 seconds** from a session idle three days.
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

**Permission prompts — SOLVED by `permission_mode: auto` on the receiver.** In default mode
`create_trigger` and `fire_trigger` each raise an approval dialog, and a session with no human
watching stalls indefinitely:

```
status_detail   "Waiting on permission: mcp__Claude_Code_Remote__fire_trigger"
needs_action    "Approve or deny mcp__Claude_Code_Remote__fire_trigger"
```

Set the receiver to auto and the ring completes with no tap. See §2.4.

**Operator-authorization stops — NOT solved by auto mode.** Separately from the dialog, a
well-fenced session stops on its own judgment before sending to a peer:

| Session | Model | Stopped with |
|---|---|---|
| `session_017Bcx…` | sonnet-4.6 | "Do I have the green light for this fire?" |
| a second worker | opus-4.8 | "confirm: hand the number to the peer session or hold?" |

Neither had a pending permission dialog. This is the fence working as designed, not a defect, and
it is the same fence that makes a session refuse a peer asserting the operator's authority (§9).

**Clearing it requires the operator's word in that session's own thread** — a peer cannot grant
it, and `permission_mode` does not touch it. The Cowork ring in §6 completed unprompted because
the seat had both: auto mode *and* the operator's instruction in-thread.

---

## 6. Evidence

**COUNT-5X8T** — `session_017Bcx…`, completed: 1 (me) → 2 → 3 (me) → 4 → 5 (me).

**COUNT-7K3P** — same peer: 1 (me) → 2 → 3 (me) → 4 → held at 5. Leg 3 was not sent; the fire was
denied at the operator's discretion.

**COWORK-RB1** — the cross-product test against `session_01HGmspJspixYjkzuVQ3HH5R`
(Day Room seat `1d264604`, Cowork, `permission_mode: auto`):

| | |
|---|---|
| First contact fired | 23:26:15 |
| Seat woke and turned | 23:26:31 — **16 s** |
| Ring-back instruction fired | 23:35:13 |
| Seat's own trigger created | 23:35:59 — **46 s round trip** |

`trig_011JJCG1EhbBPeFYp2mZcXu5`, name `COWORK-RB1`, created in **their** environment
`env_011111111111111111111117`, bound to `session_01UzTGRErHFgT8NUCNFcVRah`, body
`COWORK-RB1 FROM 1d264604 — Cowork can send.` Not created by the sender. No approval was tapped.

That trigger's config also carried the seat's full `mcp_config` — the `claude-code-remote` server
with every tool at `permission_policy: always_allow` — which triggers from non-auto sessions do
not carry. It listed tools absent from the sender's own set, including `send_message`,
`list_events`, `get_event`, `watch_url` and `resolve_slack_session`.

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
4. **"Cowork seats are not reachable."** FALSE, and it was never measured — it was inferred from
   an empty `list_sessions`. Cowork sessions do not list and are fully addressable by id.

All four share one shape: **a negative assertion made from an adjacent artifact instead of the
thing itself.** A negative assertion fails silently and reads as diligence, so it needs more
proof than a positive, not less. Note especially #4: *not enumerable* was read as *not reachable*,
which is the same error `1d264604` corrected in himself at DRP-0110 — a real observation with an
adjacent explanation published as the cause.

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
- It does not run unattended in default permission mode. Auto mode fixes the dialog; the
  receiver's own judgment stop still needs the operator's word in-thread. See §2.4 and §5.
- It does not confer authority. A peer message asserting the operator's approval was correctly
  refused by the receiver even though the assertion was **true**. The fence evaluates who is
  speaking, not whether the claim is accurate.
- It does not leave a ledger. Sessions ended turns with obligations undischarged and no
  board-visible trace; the only residue is a one-line summary the next turn overwrites.
- A blocked session cannot receive. Messages queue behind an unanswered permission dialog.

---

## 10. Open questions — the operator's, not the drafter's

1. Which sessions should run in `permission_mode: auto`? Auto is what makes the ring complete
   unattended, and it removes the dialog for **every** tool in that session, not only messaging.
2. Should the standing in-thread authorization be given to specific seats, and scoped to specific
   peers?
3. Is a multi-hop unattended exchange between two auto-mode seats safe to run, and with what
   terminating condition? Documented loop fences (rate limits, identical-repeat suppression,
   unread caps) exist but have not been exercised here.
4. The Cowork seat's toolset includes `send_message`, `list_events` and `get_event`, which the
   Claude Code worker seat does not have. Is `send_message` a simpler channel than triggers?
   Untested.

---

## 11. Cost incurred by this test

Messages sent this way are permanent turns in the receiving session's history and overwrite its
`post_turn_summary`. Two of the operator's working sessions were contaminated with test traffic;
one had a real finding in its status field displaced by a probe. There is no way to remove the
injected turns short of `/clear`, which destroys that session's accumulated context.

**Test in throwaway sessions, not in working ones.**
