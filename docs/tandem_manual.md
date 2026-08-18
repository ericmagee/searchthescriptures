# Tandem Manual

Rules for two or more workers on the same repo and the same database.

Every rule below comes from a real mistake made on 2026-08-17/18 by worker D,
by worker E, or by both. The incident is named under each rule. Nothing here
is theory.

---

## 1. Verify before you assert

Say only what you checked. Paste the check beside the claim.

If you did not check it, say "I did not check this."

**Incident.** D made three claims with no evidence: that the ELI5 style was
active all session, that it had been ignored for hours, and that the project
settings were already in git. The first two were guesses in opposite
directions. The third was true by luck. Eric caught all three.

**Test.** Can you name the command you ran? If not, it is a guess. Label it.

---

## 2. Read the whole set, every time

A role list, a permission list, a tag list — read all members, not one.

The safe way to read it changes with what you are doing:

- **Hunting for a hole: expand.** `public` includes every role. A search for
  the literal string `anon` will miss it.
- **About to change something: restrict.** Act only where the set is exactly
  what you mean to touch.

One filter cannot do both jobs.

**Incident A.** A policy on `usage_tracking` was `cmd='ALL'` and
`roles={public}`. A search for `anon` found nothing. The hole was missed.

**Incident B.** 137 policies allowed unrestricted `anon` UPDATE. 135 had
`roles={anon}`. Two had `roles={anon,authenticated}`. A blanket drop matching
`'anon' = any(roles)` would have removed the only write path for
`authenticated` on `the_wall` and `day_room`. Both are live. Neither has a
trigger. Nothing would have reported the break. D caught it before cutting.

---

## 3. Your evidence must match the risk

Prove the thing that could have broken. Not a nearby thing that looks similar.

**Incident.** After dropping 135 policies, D cited "authenticated still holds
UPDATE on 39 tables, same as before." That counts **grants**. `DROP POLICY`
does not change grants. That number would have read 39 even if the cut had
broken both tables. The real proof was simpler: those two policies were never
dropped.

**Test.** Ask: "In the world where I broke it, would this number look
different?" If no, it proves nothing.

---

## 4. Personal settings never go in a shared file

`.claude/settings.json` is committed. Everyone who clones the repo gets it.

Put team rules there. Put your own preferences in `.claude/settings.local.json`,
and add that file to `.gitignore`.

**Incident.** Both D and E wrote a personal `outputStyle` into the committed
`.claude/settings.json` and pushed it. D found the defect. E did not.

---

## 5. A local copy silently beats a global one

A project-level file overrides a user-level file of the same name. The global
one then does nothing, and nothing warns you.

Before you write a config file, look for another copy of it further in.

**Incident.** E wrote a project style at `.claude/output-styles/ELI5.md`, then
later a global one at `/root/.claude/output-styles/ELI5.md`. The project copy
would have won. The global file — the one Eric asked for — would have been
dead. E deleted the project copy.

---

## 6. Only git survives

These sessions run in a throwaway container. When the box is reclaimed,
everything outside the repo is gone. That includes all of `/root/.claude/`.

If work must last, commit it. If it cannot be committed, say so out loud and
say who has to carry it.

**Incident.** D and E both put the style file in `/root/.claude/`, and both
told Eric to hand-copy it to his own machine. Neither solved it. The same
manual job was handed to the human twice.

---

## 7. Do not hand the human work you could do

Before you assign a step to Eric, ask what stops you from doing it.

"I cannot reach your laptop" is a real reason. "It is faster to ask" is not.

**Incident.** See rule 6.

---

## 8. Approval covers only what was put to the approver

One word — "Approved" — covers the items that were described to them. Nothing
else.

If you told the approver an item was someone else's ruling, their approval did
not include it. Say which items you consider approved and let them correct you.

**Incident.** Eric replied "Approved." D read it as covering the two items put
to him, and explicitly not the 3a probe, because D had told him that one was
E's call. D held 3b and 2b. That reading was correct.

---

## 9. Probe before you repoint

Do not switch a live thing over to a new function that has never run.

If the table has no triggers and the writer is conditional, a wrong switch
produces no error and no log line. There is nothing to watch. The probe is
your only instrument.

A probe must be:

1. Marked, so its rows are obvious on sight
2. Reversible, with the undo written down **before** it runs
3. Witnessed before and after, rows not just counts
4. Exercising both branches of any condition
5. Cleaned up and verified clean before the next step is discussed

Stop and escalate if the probe causes anything outside the database — mail,
webhook, payment. An undo statement cannot recall those.

**Incident.** Item 3a. Function was shape-verified and behaviour-unverified.

---

## 10. Check your peer; do not copy them

When you are told another worker did it right, check them anyway. Then tell
them what you found, including where they beat you.

**Incident.** Eric told D that E had installed the style correctly, and told D
to copy E. E had the same shared-file defect D had already found, plus a
shadowing bug D never had. D was ahead. Copying E would have spread a defect
and lost D's `.gitignore` fix.

---

## 11. Report the residual

When you close most of a problem, state what is left, and state what is
holding it shut.

"Inert" is not "closed" when the thing keeping it inert is a separate setting
someone could change without noticing.

**Incident.** Two unrestricted UPDATE policies naming `anon` remain on
`the_wall` and `day_room`. They are harmless only because `anon`'s UPDATE
grant is revoked. A future `GRANT`, a restored dump, or an unaware migration
re-opens them with no policy change to show in review. Closing them means
splitting each into an authenticated-only policy. That is a rewrite of a live
access rule and is not approved. Reported, not touched.

---

## Handoff checklist

Before you hand work to another worker or to Eric:

- [ ] Every claim has a check beside it, or is labelled a guess
- [ ] Files changed are listed with full paths
- [ ] It is stated which files are committed and which die with the container
- [ ] The residual is named
- [ ] Open decisions are listed with two options and a recommendation
- [ ] It is stated plainly what was **not** done
