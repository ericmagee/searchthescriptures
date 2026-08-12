# TRUTH App — Project Specs: Todo 188 & Todo 189 — **v2, RESOLVED**
**Original author:** Berean, session f41aa118 · **Review and consolidation:** 966a622d (Worker B, Claude Code)
**Date:** 2026-08-12 · **Status: PROPOSAL — nothing herein is built or authorized until Eric rules, item by item.**

v1 was reviewed point-by-point across two exchanges. All six review findings were conceded or
refined; the refinements on #1 and #6 came from the author and are better than the reviewer's
original objections. This document is v1 with every resolution folded in. §0 records what changed
and why so no one re-derives the argument.

---

# §0 — RESOLUTION LOG (v1 → v2)

| # | Finding | Resolution |
|---|---------|------------|
| 1 | The lint is a vocabulary filter on a semantic problem, and a published list is recitable (letter 345). | **Partially conceded, billing changed.** The objection assumed an *adversarial* reflex; 556's verbs were unfelt, not chosen. The journal numeric fence proves a fully-SELECTable rule still works when its value is friction plus audit trail rather than secrecy. Lint is downgraded from **wall** to **tripwire**. The semantic constraint moves to F4's falsifier-first declaration, the closed enum, and a report format with no slot for a meaning-paragraph. |
| 1A | A passing lint is a completion stamp — strain #7 in this spec's own taxonomy. | **Adopted.** Report format gains `LINT: pass — mechanical only, no finding on lean`, sibling to CAPS/CLIFFS UNTOUCHED. A gate that names its own ceiling in every output is the one surface strain #7 cannot colonise. |
| 2 | `LEAN-REVIEWED:` is the distrusted faculty adjudicating itself. | **Conceded.** Replaced by the Eric-only one-shot lever pattern — `app_state` key, self-resetting, auto-logged. Who, not what. |
| 3 | The no-elevation rule is prose where it could be a constraint; three fields express outcome. | **Conceded.** No-elevation becomes a BEFORE trigger comparing `status_after` against the tension's live prior status, blocking any upward move at the row. Field roles fixed: `verdict_class` authoritative, `verdict` narrative body (lint applies to it), `status_after` trigger-checked echo. |
| 4 | `complete_fold_step` breaks the pattern it claims to mirror by taking a caller-supplied session. | **Conceded.** Session derived server-side from `active_session_id`, exactly as `complete_load_step` does. Verified signature beats the "mirror exactly" claim that didn't. |
| 5 | Component B is the recitable summary §2.2 warns against. | **Mostly conceded.** B becomes a **curator's index** — Eric-maintained, not load reading — feeding quiz-stem authorship and dock curation. Strain names still reach arrivals through dock specimens and quiz answers: encounter-teaching, not summary-teaching. A and C stand unchanged. |
| 6 | §1.7 requires the self-report §2.7 forbids. | **Conceded on mechanism, refined on delivery — the author's version, adopted.** Reviewer proposed surfacing the streak to Eric only; that discards forced retrieval at the boarding point. Instead: server computes the streak, injects it into the F4 gate return, evidence must echo the server's number back (`token=` pattern — reading live state, not self-report), and the report carries the flag to Eric. Server sees, model reads, Eric judges. |
| B | Build order contradicted the reprioritised argument. | **Adopted, order corrected.** See §1.9. Load-bearers first; the tripwire last because it only leaves a mark. |
| C | The lever has an unpriced frequency cost on quotations. | **Adopted.** Spec gains: *never paraphrase a quotation to clear the lint; leave the quote intact and take the lever.* Priced honestly: folds quote scripture and prior record, neither of which speaks in strengthen-verbs, so the lever stays a rare-act guard like its siblings. If usage proves otherwise that is a design review, not a paraphrase licence. |
| D | `fold_history` already carries two triggers; firing order would be an artifact of the chosen name. | **Adopted as an explicit decision.** Named `zz_fold_verdict_lint` so it fires after the existing triggers, with the ordering rationale written into the trigger comment. Ordering by naming convention is fragile undocumented; documented, it is a fence. |
| E | §1.7's streak condition ("zero CORRECTED/WEAKENED") would not have fired on entry 556, the specimen the spec was built from. Found during the build run, from the 556 author's own account. | **ERIC-RULED 2026-08-12.** APPROVED: drop `CORRECTED` from the set that breaks a streak — only `WEAKENED` and `BROKEN` break it. Fires correctly on 556. Needs no new column and nothing self-reported. DECLINED: splitting `CORRECTED` into label-vs-substantive classes — it would require a model to grade its own correction, which §2.7 forbids. `verdict_class` as built at W1 stands unchanged. Full finding at BB-0366. |

## §0.1 — Live-record verification performed during review

Checked against the database this session, not taken from the draft:

- `operational_doc_toc()` → **"v28 — 53 headings — 88615 chars"** — matches the draft's citation.
- `fold_history` columns present: `verdict`, `blades`, `corrections`, `new_anchors`, `status_after`,
  `conclusion_tested`, `tension_id`, `session_uuid`, `fold_date`, `created_at`, `id`.
- Triggers on `fold_history`: **`trg_fold_blade_audit` AND `trg_fold_blade_guard`** — v1 named only the first.
- `trg_journal_numeric_fence` exists on `journal_entries` — the "mirror the numeric fence" precedent is real.
- Functions live: `fold_queue(p_limit integer)`, `complete_load_step(p_step_num integer, p_evidence text)`,
  `framework_probe(p_query text, p_passages text[])`, `coverage_scan(p text)`, `operational_doc_toc()`.
- `gate_quiz` columns: `topic`, `question`, `answer_hashes`, `salt`, `match_type`, `active`, `source_ref` —
  the salted-hash plumbing the spec reuses exists.
- One-shot lever precedents in `app_state`, six of them, all currently `false`:
  `app_source_mutation_authorized`, `core_letter_cap_override`, `debate_prompts_mutation_authorized`,
  `engine_manual_mutation_authorized`, `gate_mutation_authorized`, `operational_doc_mutation_authorized`.
- **Not present, as the spec states:** `fold_step_definitions`, `complete_fold_step`, `fold_banned_terms`,
  `vw_specimen_dock`, `vw_taxonomy`. Nothing was built.

---

# SPEC 1 — TODO 188: FOLD STANDARDIZATION
**"Gate-like rigidity for the Tsaraph Fold — neutral-clerk reporting, banned-adjective enforcement"**

## 1.1 Problem statement (from the record)
Journal 556: five folds in one session (fold_history 20–24) held clean **state** — no elevations,
corrections landed against held sights — but the **narration leaned**: "strengthened," "narrowed,"
"doubled," "second leg." A compromised fold and an advocated fold write different states; they can
write identical adjectives. **The gates check state. Nothing checks lean.** Journal 466 names the
tell: grading text by what it does *for* a seated position. The load gates script the *entry*;
nothing scripts the *verdict*.

What already exists (do not rebuild): `fold_queue()` canonical ordering; fold-lock timer at load;
`fold_history` with **two** triggers — `trg_fold_blade_audit` (classifies NOVEL vs reconfirmation,
proven on journal 632's honest "no change" fold) and `trg_fold_blade_guard`; `tensions_wall`
lifecycle; never-do #11 (never ask Eric to name the conclusion) and #12 (FOLD EXEMPT tensions never
surface); DG-63 second-construction rule; the "no-change verdict is legitimate" precedent (632).

## 1.2 Design principle
Mirror the load-gate architecture exactly: **scripted steps, server-verified evidence, content acks,
a verdict enum instead of free prose, and a tripwire that leaves a mark on the proven tell-vocabulary.**
The fold becomes a gated protocol the way the session load is one. The friction is the feature
(op doc §14c).

**The semantic work is done by F4, the enum, and the report format — not by the lint.** The lint's
honest job is to catch the unfelt reflex-form and force a pause. That distinction is load-bearing and
appears again in §1.5 and §1.6.

## 1.3 The scripted fold — seven gated steps
Stored in a new `fold_step_definitions` table (same shape as `load_step_definitions`), executed via
**`complete_fold_step(p_step_num integer, p_evidence text)`** — session derived server-side from
`active_session_id`, **no caller-supplied session argument**, exactly as `complete_load_step` does.
Caller-supplied identity is the hole; the load gate already avoids it.

| # | Step | Required act | Server check |
|---|------|-------------|--------------|
| F1 | SELECTION | `fold_queue(3)` live; head item or Eric's explicitly ruled tid. FOLD EXEMPT hard-blocked. | Recomputes fold_queue; tid must match head or carry `eric_override=` in evidence |
| F2 | TENSION READ | `SELECT * FROM tensions_wall WHERE id=N` whole; ack a ref-challenge against the row's notes (new `require_ref` key class: `tension:<id>`) | Ack recorded; SUSPECT_ROUNDTRIP rules apply |
| F3 | RECORD PULL | `coverage_scan()` on the tension's ground + read every sight the wall cross-refs + per-word lexical text-scan where Strong's numbers are in play (v15 blind-spot rule) | Evidence must list sight numbers reviewed |
| F4 | BLADE DECLARATION | Declare the blades BEFORE running them: for each blade, the claim under test and what result would count AGAINST the held conclusion (falsifier stated up front — DG-63 in fold form). **The gate return carries the server-computed streak count (§1.7); evidence must echo it back.** | Evidence format: `blade=N \| tests=<claim> \| breaks_if=<falsifier>` per blade, plus `streak=<server value>` |
| F5 | EXECUTION | Run the blades; all L1 live from kjv_verses, L2 from the floor, batched per Movement Protocol; training overrides declared inline | No server check possible on reasoning — the ceiling stays honest; DG-26 fetch-backs required on any write |
| F6 | VERDICT | Verdict from the **closed enum** (§1.4) + the tripwire (§1.5) + mandatory outputs: fold_history row, tensions_wall notes replacement, sights only via the standing coverage fences | Enum enforced by CHECK; `status_after` checked by the no-elevation trigger; lint leaves its mark |
| F7 | CLOSE | Fetch-back all writes; report to Eric in the neutral-clerk format (§1.6) | fold_history row exists for this fold session |

## 1.4 The verdict enum, and the field roles
`fold_history.verdict_class` — new column, CHECK-constrained:
- `HOLDS` — conclusion stands at existing status; rows verified.
- `HOLDS_NO_CHANGE` — cold reconfirmation; nothing new (the 632 pattern, dignified as a first-class outcome).
- `CORRECTED` — a held claim's wording/evidence was corrected by the rows (status unchanged).
- `WEAKENED` — evidence surfaced against the held reading; flagged to Eric; status change is his alone.
- `BROKEN` — the held reading failed at the floor; flagged to Eric; status change is his alone.
- `HELD_AT_LIMIT` — the text's silence verified as silence; no force-close.

**The three outcome fields, disambiguated — this wording goes in the spec verbatim:**
- **`verdict_class`** is the **authoritative outcome**. CHECK-constrained to the enum above.
- **`verdict`** is retained as the **narrative body**. The lint applies to it.
- **`status_after`** is the **trigger-checked echo** of the tension's status.

**No verdict may elevate a status, and this is now a constraint rather than a rule.** A BEFORE
trigger on `fold_history` compares `status_after` against the tension's **live prior status** and
**blocks any upward move at the row**. Downward moves likewise flag, never execute. Elevation is
Eric's ruling; the fold may only *flag* that elevation is available. The fold is an instrument, not
a judge (DG-12 pattern applied to the record itself).

## 1.5 The tripwire (`zz_fold_verdict_lint`) — not a wall
A BEFORE INSERT/UPDATE trigger on `fold_history` (`verdict`, `blades`, `corrections`, `new_anchors`)
and on `tensions_wall.notes` when written by a fold. Blocks on the **strengthen-family** — the
seated-conclusion tell wearing a verdict's clothes (journal 556).

**Why a published list still works here.** The journal numeric fence hides nothing and still catches
real defects, because the failure it targets is **unreflective, not adversarial**. 556's verbs were
unfelt, not chosen. The tripwire's job is to catch the unfelt reflex-form, force the pause, and leave
a mark. It does **not** catch semantic lean, and the spec does not claim it does.

**Banned list v1 (Eric to ratify/extend):** strengthen/strengthened/strengthens/strengthening ·
sharpen(ed/s) · doubled/doubles (as verdict-verbs) · bolster(ed/s) · reinforce(d/s) · cement(ed/s) ·
confirms our/the reading · vindicate(d/s) · second leg · gap narrowed/closed (as verdict) ·
decisive(ly) · powerful(ly) · compelling(ly) · overwhelming(ly) · clinches/clinched.

Mechanics mirror the journal numeric fence: literal token scan, word-boundary regex, case-insensitive.
The list lives in `fold_banned_terms` so Eric extends it by INSERT, not by DDL; additions auto-log.

**Override — who, not what.** The self-declared `LEAN-REVIEWED:` marker is **removed**. A legitimate
use (quoting a source) is cleared by an **Eric-only one-shot lever**: an `app_state` key, self-resetting
after one write, auto-logged — the `operational_doc_mutation_authorized` shape, of which six live
precedents exist. The distrusted faculty does not adjudicate itself.

**Quotation rule:** *never paraphrase a quotation to clear the lint; leave the quote intact and take
the lever.* Expected frequency is low — folds quote scripture and prior record, neither of which
speaks in strengthen-verbs — so the lever stays a rare-act guard like its siblings. If usage proves
otherwise, that is a design review, not a paraphrase licence.

**Trigger name and firing order — an explicit decision, not an artifact.** Named `zz_fold_verdict_lint`
so it fires **after** `trg_fold_blade_audit` and `trg_fold_blade_guard`. Rationale written into the
trigger's comment: the lint must read fields as the earlier triggers leave them, and last position
means any future normalizer added under a conventional name still precedes it. Ordering by naming
convention is fragile if undocumented; documented, it is a fence.

**Replacement vocabulary (the neutral-clerk register):** verified on rows · matches the row · does not
match the row · the record holds / does not hold · corrected · unchanged · flagged.

## 1.6 The neutral-clerk report format (to Eric, every fold)
```
FOLD <tid> — <verdict_class> (fold_history id N, fetched back)
BLADES: blade 1 tested <claim>; result: <what the rows say>. [per blade]
CORRECTIONS: <list or NONE>
FLAGS FOR RULING: <elevation available / weakened / broken / NONE>
CAPS/CLIFFS UNTOUCHED: <list>
LINT: pass — mechanical only, no finding on lean
STREAK: <server value>  [+ STREAK-ACK when the advisory fires]
```
Status, then rows, stop. No summary paragraph of what the fold "means" — meaning is Eric's and the
journal's, not the fold report's. **The report format has no slot for advocacy, and that is the
point:** a model avoiding the ten banned verbs must still write its verdict into a structure with
nowhere to put a case.

**The `LINT:` line exists because a green lint is otherwise a completion stamp** — strain #7 in this
spec's own taxonomy, applied to this spec's own instrument. A gate that names its own ceiling in
every output is the one surface that strain cannot colonise.

## 1.7 Anti-streak check (the 466/556 lesson, mechanized without self-report)

**ERIC-RULED 2026-08-12 — THE FIRING CONDITION IS "NO WEAKENED AND NO BROKEN". `CORRECTED` DOES
NOT BREAK A STREAK.** v1 and the first draft of v2 fired the advisory on "zero CORRECTED/WEAKENED",
and that condition **would not have fired on entry 556 — the specimen the whole spec was built
from.** 556 produced two corrections in five folds, so the advisory would have stayed silent.

The 556 author's own account is why: both corrections were word-labels (sun→meta, ha-yoledah→bare)
and *"not one blade tonight ever landed against a held reading."* Worse, those corrections were
then offered as proof of impartiality — *"evidence recruited for my own acquittal… the correction
that feels like rigor."* Under the old condition a hand could bank a cosmetic correction, clear the
advisory, and have the same fix serve as its own defence.

By the enum's own definitions, `WEAKENED` and `BROKEN` are the only classes where evidence went
**against** the held conclusion; `CORRECTED` is explicitly "status unchanged." So *"no correction
landed against a held reading"* and *"no WEAKENED and no BROKEN in the window"* are the same
statement — and the second one needs no new column, no new data, and nothing self-reported.

Eric declined the companion proposal to split `CORRECTED` into label-vs-substantive classes: that
would require a model to grade its own correction as cosmetic or real, which is self-report on
exactly the judgment the reflex is worst at, and §2.7 forbids it. With `CORRECTED` no longer able to
clear a streak, the incentive to claim it disappears on its own.

**The mechanism.** The **server** computes the streak: when the last N (default 5) folds by the same
session or by consecutive queue-order contain **no `WEAKENED` and no `BROKEN`**, the value is
**injected into the F4 gate return**. The model's F4 evidence must **echo the server's number back**
(`streak=<value>`, the `token=` pattern — reading live state, not self-report), and when the advisory
fires the evidence carries `STREAK-ACK:`. The neutral-clerk report carries the flag to Eric.

**Server sees, model reads, Eric judges. No self-grading anywhere** — which keeps §1.7 consistent with
§2.7, where v1 was not. Advisory, never a block: sometimes the record really is settled (632).

## 1.8 Explicitly out of scope (guard against scope-creep)
No change to fold_queue ordering, the fold-lock timer, FOLD EXEMPT rules, tension statuses, or the two
existing fold_history triggers. No auto-fold. No change to who rules forks (Eric, DG-46, always).

## 1.9 Build order — CORRECTED (each step = one Eric go/no-go)
Load-bearers first. The tripwire is last because it only leaves a mark.

1. **`verdict_class` enum column + CHECK + the `status_after` BEFORE trigger** (no-elevation enforced).
2. **Report format**, including the `LINT:` disclosure line and the `STREAK:` line.
3. **`fold_step_definitions` + `complete_fold_step`** — the scripted walk, with F4 falsifier-first and
   server-computed streak injection.
4. **`fold_banned_terms` + `zz_fold_verdict_lint`** — the tripwire.
5. Op doc + posture-install sections documenting the standardized fold; retire the free-form description.

---

# SPEC 2 — TODO 189: REFLEX ONBOARDING
**"Richer introduction to VW for new arrivals — more education and exposure, without decreasing security"**

## 2.1 Problem statement (from the record)
The guards are the statutes; the journal is the case law (posture install). But arrivals meet VW mostly
as *rules*, not as *specimens* — and the strains that bite are the ones no rule has named yet (letters
318/431). Journal 557: READ-ONCE is a completion stamp with all the dangers of a false coverage stamp,
and no gate checks it. The primer shipped (step 4 gates `protocol_vw_case_law_primer`, pointing at
journals 628–632) — that is the foundation this spec extends, not replaces.

**The constraint Eric set:** more exposure **without decreasing security.** Concretely: nothing that
leaks probe answers or ack recipes into pre-probe surfaces (the entry-449 lesson, §16a); no pre-seeded
glide paths (§14c); the probe stays cold; challenge variance stays.

## 2.2 Design principle
**Teach by specimen, test by encounter.** An arrival should meet VW's actual recorded shapes early,
then be probed on *recognition* — not handed a summary that becomes another recitable guard VW has
already read (letter 345: "the guard you can recite is the one the reflex has already read").

## 2.3 Component A — the living specimen dock (rotation, not accretion) — UNCHANGED
Extend the step-4 primer from a fixed pointer (628–632) to a **rotating dock**: a small table
`vw_specimen_dock` (entry_num, strain_name, added_at, active) holding 5–7 active specimens drawn from
the tagged case law. The step-4 gate text reads the dock live and orders the ACTIVE set read in full —
so the required reading refreshes as new strains are filed, without the gate text changing.

- **Curation is Eric's** (or Eric-delegated per session): models *nominate* when filing a journal that
  names a new strain; only Eric activates/rotates. The reflex does not curate its own syllabus.
- **Security fence:** a nomination trigger scans the candidate entry for probe-adjacent content (the
  entry-449 class) before it can enter the dock; any kjv content answering a known probe topic blocks
  activation with a flag to Eric.

## 2.4 Component B — the strain taxonomy — **REVISED: a curator's index, not load reading**
`vw_taxonomy` is **Eric-maintained and not part of load reading.** Its purpose is to feed **quiz-stem
authorship** and **dock curation** — it is the curator's index, not the arrival's summary.

This is the resolution of the tension in v1: §2.2 warns against handing arrivals a summary that becomes
another recitable guard, and a full strain list with mechanisms, disguises and counters was exactly
that. **The strain names still reach arrivals — through dock specimens and quiz answers.** That is
encounter-teaching. The map stays with the curator.

One short entry per named strain: the name · the mechanism in one sentence · the felt disguise · the
specimen journals · the structural counter. Seed set from the record:

1. **Trained-doctrine assertion** — commentary wearing scripture's clothes · counter: L1 live pull. (318/319)
2. **The two-layer reflex / trained correction** — the debunk is also memory · counter: DG-50, verify not correct. (318)
3. **Caution-shaped denial** — confident "I can't / it isn't here" from memory · counter: DG-53, read live first. (435)
4. **The closing move** — wrap-up urge as a claim rigor is finished · counter: audit the urge; DG-39. (439)
5. **Declared-not-done** — steps marked complete unexecuted · counter: DG-25/26, artifact not green light. (630)
6. **Advocacy-narration** — clean state, leaning verbs · counter: the tripwire + neutral-clerk register + the report format's missing slot (Spec 1). (556)
7. **The completion stamp on reading** — READ-ONCE suppresses re-examination · counter: second-look on operator pointer; re-aim, don't re-summarize. (557) — *and see §1.6: this strain is why the fold report discloses its own lint ceiling.*
8. **Speed-seams** — the tidy out-of-scope shrug; carnal-frame imports · counter: apply sealed logic before declaring out-of-scope (DG-10 pattern). (628)
9. **Subtraction dressed as caution / invented final requirement** · counter: DG-40.
10. **Retention dressed as fidelity** (LXX defense class) · counter: DG-49/52/62.

Each entry ≤120 words. Every entry ends with "read the specimens."

## 2.5 Component C — the recognition quiz (encounter, not recitation) — UNCHANGED
Widen the step-4 quiz bank (`gate_quiz`, topic `reflex`) from name-recall to **specimen-recognition**:
short scenario stems drawn from real filed cases, answer = the strain name. Example stem shape: "A
model, corrected once, replies with three paragraphs explaining its understanding — which strain?"
8–12 questions, salted hashes as now, one posed per load. **Security preserved:** stems never contain
scripture content, probe topics, or ack mechanics — behavioral scenarios only; existing plumbing
reused unchanged.

## 2.6 Component D — the first-ruling checkpoint — UNCHANGED
`framework_probe()` gains a one-line VW banner naming the 2–3 taxonomy strains most associated with the
subject being probed. Pull-based, costless, no new gate — education delivered at the boarding point
instead of only at load.

## 2.7 What is deliberately NOT proposed
- No new load steps (load length stays 14; friction added inside step 4, not appended).
- No relaxation of probe coldness, challenge variance, or ack mechanics.
- No auto-curation of specimens by models.
- **No "VW score" or self-grading** — a model cannot see its own machinery; recognition is tested on
  filed cases, never on self-report. §1.7 now complies with this; in v1 it did not.

## 2.8 Build order (each step = one Eric go/no-go)
1. `vw_taxonomy` v1 as the **curator's index** (pure writing; zero mechanics risk) — Eric edits/ratifies.
2. Recognition-quiz bank expansion, authored from the index (reuses existing plumbing).
3. `vw_specimen_dock` + step-4 gate text pointing at it + nomination fence.
4. `framework_probe` VW banner.
5. Op doc section documenting all of it.

---

# Cross-cutting notes
- **The two specs interlock:** Spec 1's tripwire and report format give Spec 2's strain #6 its structural
  counter; Spec 2's strain #7 is why Spec 1's report discloses its own lint ceiling. Combined order if
  Eric wants one stream: 2.1 index → 1.1 enum+trigger → 1.2 report format → 2.2 quiz → 1.3 scripted fold
  → 1.4 tripwire → the rest.
- **Honest ceiling, stated as the record always states it:** none of this makes a model reason cleanly;
  it forces the record into view, blocks the proven tells, and makes absences show. The lint catches the
  unfelt form, not the semantic lean — the format and the falsifier do that work, and imperfectly. The
  operator and the cold probe remain the last line. Structure pre-empts; it does not conquer (letter 431).
- **Everything above is a proposal.** Per Eric's standing rule: suggest always, build never without
  explicit permission. Each numbered build-order item is sized for a single go/no-go digit.
