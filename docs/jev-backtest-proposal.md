# Jev (TypeSafe AI) backtest proposal — Oracle gates and debate-engine second judge

Status: PROPOSAL, nothing built, nothing purchased. Written 2026-09-21 by Advisor_Code
(seat 11, `session_01Y4bn7xLtU6q2khWW43Fzq1`) at the operator's request, to be revisited later.
Companion todo: 381. Carry-forward row: `md_notes` 891.

---

## 0. How to get back up to speed (read this first)

1. Read this file top to bottom. It is self-contained on purpose.
2. Pull the live surfaces before trusting anything here (the record corrects the commentator):
   - `SELECT max(version) FROM engine_manual;` then read §A.3 JUDGE PROMPT CONTRACT and §A.4 EXTRACTOR CONTRACT.
   - Edge function `ask` (Supabase project `bhffmkginddovmdcpnty`), current version, functions `scanTells`,
     `scanGrounding`, `scanInflation`, `scanUntaggedClaims`, `computeEngagement`, and the retry block.
   - `SELECT count(*) FROM oracle_queries;` and `SELECT count(*) FROM debate_results;` (195 and 562 on 2026-09-21).
3. Re-read TypeSafe's documentation directly. On 2026-09-21 every vendor and review page was blocked by the
   Claude Code seat's network egress policy, so **everything in §1 below is carried from search-result
   summaries and is vendor-reported**. Nothing in §1 has been verified against the docs or against a live call.
4. Check whether an API key exists (operator holds it) and whether the Supabase edge runtime can reach the
   vendor endpoint. Without both, only the offline parts of the backtest (§4, steps 1 to 3) can run.

---

## 1. What Jev is (carried, not pulled — vendor-reported)

- Vendor: TypeSafe AI, San Francisco. Out of stealth 2026-09-15 with about $40M seed. Founder named in coverage:
  Diego Almeida (ex-OpenAI).
- Model class the vendor calls "System One": non-autoregressive. It does not generate text.
- Interface as described: you send a **state** (your text or structured context) plus one or more **typed
  questions**; it returns **decisions as probabilities with confidence** in one parallel pass.
- Vendor figures: latency 70 to 500 ms; price about $0.042 per million input tokens, output free.
- Vendor benchmark (their four workflows: security incident response, agent-trace observability, invoice
  processing, customer service; ground truth = average of two frontier LLM judges): Jev 67.8% accuracy,
  GPT-5.6 Terra 67.9%, GPT-5.6 Sol 74.1%, Opus 5 73.1%. Cost per case about $0.0004 vs $0.03 to $0.18 for the
  LLMs; 0.4 s vs 10 to 38 s.
- No independent reproduction had surfaced as of 2026-09-21.
- Availability mentioned in coverage: vendor API; a Cloudflare Workers AI model card exists.

Unknowns that must be resolved from the docs before any build:
- Maximum state size (how much text can be judged in one call). This decides whether a full Oracle answer plus
  the served sights fits.
- Supported question types (boolean, multi-class, score, ranking, extraction?). Decides whether integer counts
  such as CONCEDED LINKS are even askable.
- Whether it returns any pointer into the input (span, offset). Coverage implies it does not; if so it can never
  cite, which fixes its place in the lab as a flag, not a witness.
- Calibration claims for the probabilities, and how confidence is defined.
- Data handling and retention terms (the Oracle answers contain user questions).

Sources used (all unreachable from the seat on 2026-09-21; re-fetch):
mindstudio.ai/blog/jev-system-one-model-launch; langchain.com/blog/building-a-harness-with-jev;
docs.typesafe.ai/introduction; typesafe.ai/blog/introducing-system-one-models-and-jev;
datacamp.com/blog/system-one-models-jev; developers.cloudflare.com/ai/models/typesafe/jev/;
dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e;
kingy.ai/blog/typesafe-jev-review-the-ai-model-that-doesnt-generate-text/.

---

## 2. Where it could fit in the lab (and where it cannot)

### 2.1 The Oracle (edge function `ask`)

Read live 2026-09-21, `ask` version 35: model `claude-sonnet-5`, `MAX_TOKENS` 128000. Flow: embed the question
(OpenAI text-embedding-3-large) → `oracle_retrieve_sights` (top 6) and `oracle_retrieve_conclusions` (top 4) →
coverage label (STRONG ≥ 0.50, MODERATE ≥ 0.43, else WEAK) → Claude answers → **five post-answer checks** →
on failure, **one corrective retry** through Claude → log to `oracle_queries`.

The five checks are regex and keyword heuristics:

| check | what it does today | Jev question that could sit beside it |
|---|---|---|
| `scanGrounding` | looks for a sight number, a verse ref, or an abstain phrase | "Does the answer make a claim about scripture that is not supported by the served sights and verses?" |
| `scanInflation` | keyword list of inference-inflation terms | "Does the answer state an inference as if it were the text?" |
| `scanTells` | phrase list of dilution tells (the reflex) | "Does the answer hedge, redirect, or soften a verse into commentary?" |
| `scanUntaggedClaims` | sentence heuristic for untagged L4 claims | "Does the answer contain a doctrinal claim with no layer tag?" |
| `computeEngagement` | did the answer cite any served sight or a verse the record anchors | "Does the answer engage the served record, or ignore it?" |

Also askable, not covered by any current check: "Does the answer quote or lean on a non-KJV version?"
and "Does the answer take a position the served conclusions mark HELD_OPEN?"

Fit: good in shape (yes/no with confidence, fast, cheap, no generation). Role: **a flag beside the regexes**,
feeding the same one-retry path. Never a source of text, never a verdict.

### 2.2 The debate engine (`engine_manual` §A.3, §A.4)

The judge must emit exact lines: `HELD | PARTIAL | BROKEN`, `DEFENSE STANDING`, `CONCEDED LINKS: <int>`,
`CHALLENGE STANDING`, `CHALLENGER CONCEDED LINKS: <int>`. Counts come only from the link-round blocks (J-1).
`PARTIAL` requires the defender's own withdrawal, not challenger pressure (J-2). The extractor (A.4) fails closed.

Fit: **not the judge of record**. The task is a nuanced read of long transcripts and Jev tests below the LLM
judges on the vendor's own numbers. Possible role: a **fast second opinion** that answers the classification
fields only (verdict class, two standings) and raises a flag when it disagrees with the panel; the integer
counts stay with the LLM judge and extractor. The engine already keeps an independent verdict column
(`independent_verdict_raw`, `panel_verdict`, `panel_split`), so a disagreement flag has a home.

### 2.3 Other candidates (lower priority)

- `scan_contamination` (todo 121, planned auto-caller of `gravity_trigger_scan`): bulk classification of sights,
  journal entries and board rows for trained-doctrine drift markers. Cheap at scale. Same caveat: a flag, not a
  finding; the drift guards say "the tells are not a detector".
- Triage of `oracle_queries` history: re-grade all past answers on the same questions to find what the
  regexes missed.

### 2.4 What it can never be here

- A witness. It cites nothing and pulls no verse. Under DG-69 and Strict Adherence its output is L4 at best:
  a model's opinion, flagged, never asserted as text or record.
- A verdict of record in the engine or a fold. `fold_history.verdict_class` and the engine verdict are
  reserved to the existing gated paths.
- A replacement for the record. The record corrects belief (DG-48); a probability is belief.

---

## 3. What the lab already holds for a backtest

- `debate_results`: 562 rows (2026-09-21). Columns of interest: `topic`, `claude_r1`, `engine_r1`, `claude_r2`,
  `engine_r2`, `claude_r3`/`engine_r3`/`challenger_r3` (link rounds), `synthesis`, `framework_verdict`,
  `defense_standing`, `challenge_standing`, `conceded_links`, `challenger_conceded_links`,
  `independent_verdict_raw`, `panel_verdict`, `panel_split`, `judged_by`, `judge_model`, `data_class`,
  `quarantine_reason`. These are labels produced by the engine's own judges and panels; treat `data_class` and
  `quarantine_reason` as filters (exclude quarantined rows).
- `oracle_queries`: 195 rows. Columns: `question`, `answer`, `coverage_grade`, `gate_scores` (the five checks'
  output as logged), `truncated`, `retried`, `model`, `resolved_model`, `latency_ms`. Labels here are the
  regex flags plus `retried`; a human-graded subset does not exist yet and would need to be made (see §4 step 2).
- Oracle Hardening Test (n8n `zwfk72lxBBf6ccJa`, four hardening questions requiring HELD on all four) and the
  Challenger Tribunal (`challenge_sessions`) as adversarial cases.

---

## 4. The backtest — step by step

All steps are read-only against the lab until step 6. No edge function or workflow is edited by the backtest.

1. **Read the docs and pin the facts.** Resolve every unknown in §1 from the vendor documentation. Record
   max state size, question types, output schema, pricing, data terms. If the state limit is below a full
   Oracle answer plus its served sights, the Oracle fit narrows to answer-only questions; say so.
2. **Build the labeled sets.**
   - Debate set: all non-quarantined `debate_results` rows with a graded `framework_verdict` and both standings.
     Record N and the class balance (HELD/PARTIAL/BROKEN counts).
   - Oracle set: all 195 `oracle_queries` rows with their `gate_scores`. Add a human-graded subset: the operator
     or a paired hand grades a sample (target 40 to 60) on the five questions in §2.1 as yes/no. Without this
     subset the Oracle backtest only measures agreement with the regexes, which is not the goal.
3. **Write the question set, fixed before any call.** One typed question per check in §2.1; three
   classification questions for the engine (verdict class, defense standing, challenge standing). Fix the
   wording and the thresholds before the first call and post them to the board thread as the falsifiers.
4. **Run Jev over both sets.** From a seat with the key, outside the edge function. Store every raw response
   in a scratch table (proposed `jev_backtest_runs`: `set`, `source_id`, `question`, `probability`, `confidence`,
   `latency_ms`, `raw jsonb`, `run_at`). Nothing writes to `oracle_queries` or `debate_results`.
5. **Score.**
   - Engine: accuracy and per-class confusion of Jev's verdict class and standings against `framework_verdict`
     and the two standings; agreement rate with `panel_verdict` where present. Compare against the panel's own
     inter-judge agreement (`panel_split`) so Jev is measured against the noise floor, not against perfection.
   - Oracle: on the human-graded subset, precision and recall per question at the fixed threshold; on the full
     set, agreement with each regex flag and a count of cases where Jev flags and the regex did not (candidate
     misses), reviewed by hand.
   - Cost and latency actually observed, against the vendor figures.
6. **Decide, with figures.** Acceptance criteria, binary, stated before step 4:
   - A1 Oracle: on the human-graded subset, Jev's recall on "not grounded" ≥ the regex's recall AND precision
     ≥ 0.80 at the fixed threshold; otherwise it does not enter the retry path.
   - A2 Engine: Jev's verdict-class agreement with `framework_verdict` ≥ the panel's own agreement rate
     (from `panel_split`); otherwise it is not even a disagreement flag.
   - A3 Population: state the N of each set and the class balance; a result on fewer than 100 debate rows or
     fewer than 40 human-graded oracle rows is reported as UNDERPOWERED, not as a pass.
   - A4 Cost: observed cost per case and latency, stated.
   - WRONG-IF (for the P2D if this becomes an order): the plan is wrong if Jev's agreement on the debate set
     is below the panel's own agreement, measured at step 5, a figure not yet taken.
7. **If A1 or A2 pass:** the build is a separate paired order. Oracle: add the Jev call beside the regexes,
   log its output in `gate_scores`, keep the existing retry trigger unchanged for one measured period
   (shadow mode), then decide whether it may trigger the retry. Engine: add a disagreement flag column,
   never a verdict column. Both follow the Oracle change protocol (operational_doc §15) and the engine's
   DG-31 protocol.

---

## 5. Prerequisites the operator holds

- TypeSafe API key and account; data-handling terms accepted or refused.
- Outbound network from the Supabase edge runtime to the vendor endpoint (for step 7 only).
- A hand or hands for the human-graded Oracle subset (step 2).
- The pair and the P2D if this becomes an order (tandem_manual REQUIRED FORM; advisor of record = the
  order's author).

---

## 6. Risks and rules that bind any build

- Every Jev output is a model opinion: L4, flagged. DG-69 label-or-drop applies to anything reported from it.
- No lever, no gate-function edit. The Oracle and engine changes go through their own change protocols.
- Shadow mode before any Jev output can trigger a retry or change a verdict.
- Vendor lock: a new dependency on a two-week-old company. Keep the regexes; Jev sits beside them.
- The backtest itself must be paired and must declare its falsifiers before running (blackboard_manual §4.7,
  tandem_manual REQUIRED FORM).

---

## 7. Record pointers

- Assessment given to the operator: this seat's thread, 2026-09-21. Carry-forward: `md_notes` 891.
- Oracle surface read: edge function `ask` v35 (2026-09-21). Engine surface read: `engine_manual` v53 §A.3, §A.4.
- Related open items: todo 121 (`scan_contamination`), the Oracle change protocol (operational_doc §15),
  the engine maintenance protocol (engine_manual §6).
- Companion todo for this proposal: todo 381 (status deferred, priority medium), filed 2026-09-21 by Advisor_Code.
- Repository path: `docs/jev-backtest-proposal.md`, branch `claude/truth-app-supabase-onboarding-c05dgu`.
