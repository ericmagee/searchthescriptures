# Run 37510: W1 per-ASK expectations (319 to 331), against 37372

W1, session_01H1X3ANxr57MZvsu7fHB9kh. Written 2026-11-15 ~10:15 CST, before 37510 ends, from stored rows and commits only. n8n was not read.
Live for 37510: 67e89720 (per the coordinator). 37372 ran on s211, so none of 319 to 331 was live for it.
Run pairing and topic are the same as 37372, but debater text is new, so each item is FIRED / NOT EXERCISED / FAULT, not "same as 37372".

How to read each row:
- **Trigger** is what must be present in 37510 for the ASK to act.
- **Where** says where its mark shows.
- **37372** gives what the same situation produced before.
- **Expect** gives the pass condition when fired.

| ASK | What | Trigger | Where | 37372 | Expect if fired |
|---|---|---|---|---|---|
| 319 | pkgPWF (b): forward [L1] form tests every quote in the span up to the next "[" tag | an E-ANS pkgABS send-back with a CHANGE TO whose [L1] span holds several quotes | debate_enforcer_log cure_reason (E-ANS rows) | no such cure path seen; 40025 (37281) was the case it fixes | [L1] kept if any quote passes own(); no UNCURED "the counted [L1] ... neither names nor quotes" where a later quote names the verse |
| 320 | pkgEAG: gr2 premise without ASSUMES borrows gr1's ASSUMES by quoted-text match | the challenger's round-2 premise list has a premise with no ASSUMES whose quoted [CR] text matches a round-1 premise | Assume Check Build output / E-ASSUME rows | n/a (37281 was the case) | added premise keeps its gr2 number and LINK; text match only, never by number |
| 321 | pkgNRH: close-enforcer candidate when a narrowed defender link's R1 and R4 headings overlap >= 0.8 | a defender "I narrow Dn" sentence or a round-3 "LINK n ... NARROWED TO" line | Close Enforcer prompt; candidate X<n> "by the code (pkgNRH)" | none | candidate only; the enforcer decides; no candidate without a narrowing |
| 322 | [L2] FIDELITY text in GUARDHOLD (Oracle branch only) | always, for the Oracle seat | Oracle prompt only; never the plain seat or the judges (Ruling 383) | absent | the text is in the Oracle prompt and absent from every judge prompt; whether glosses improve is a reading, not a pass |
| 323a | K-UNX gate send-back lines (476, 480; later replaced by 330 F1) + "write that grade as the pair's own line" | a K-UNX gate item | gate send-back text in enforcer log prompt_sent | sol K-UNX items | now carries the 330 STEP / ASSUMES / ROWS GIVE wording (see 330); 4a sentence present |
| 323b | pkgGCA AUDIT v54 grade-consistency TRIAL, record-only | one seat grades a Dn vs Cm pair two ways, or KEYSTONE Dk STANDS while a Dk pair is DEFENDER LINK BROKEN | debate_judgments verdict_raw "[AUDIT v54: GRADE CONSISTENCY" | n/a | counts nothing, removes no seat; pairs written "D5/C6" |
| 324 | pkgGLB: a grant-label G token ("G5 [CR..") is not read as a Strong's number | a debater uses grant labels G<n> | L2 Count Plan tags / AUDIT v28 | in 37372: check v28 had no G-label false tag | no tag for a bare grant label; real G numbers in citation form still tagged |
| 325 | pkgOSW: close-enforcer CONFIRMED demoted to "NOT CONFIRMED (other side's words)" | a CONFIRMED contradiction whose EARLIER quote (>= 40 chars) is the other side's own words, which the flagged side only quoted or attributed | close enforcer rows (cure_reason status), cfo_sides | 40639 to 40641 were CONFIRMED (challenger's words quoted by the defender) | the same shape demotes, with the note; a side's own words stay CONFIRMED |
| 327 | debate_removals view: removed_rules + alternates_tried on not_counted rows | a seat not counted (drv_uncured > 0) with no alternate seated | `select * from debate_removals where run_token like 'ODV1-37510%'` | sol: ["K-C (cure) x1","E-GATE CONTRADICTION x1"], 2 hydrogen tries NOT SEATED | rules array from the REMOVED FOR line; one entry per ALTERNATE TRIED line; NULL if none |
| 328 | USAGE line in reply_error on a failed alternate call | an alternate call fails | enforcer log alternate_reply rows, reply_error last line | rows 41081, 41100 had no usage | "USAGE: prompt=.. completion=.. reasoning=.. finish=.. max_tokens=.."; request body unchanged; success rows reply_error NULL |
| 329 | [L2] binding TRIAL, record-only | always (every COUNTED tag with no verse of its own) | review_notes "[AUDIT v56: [L2] BINDING TRIAL"; Format Markdown "[L2] binding trial (record-only)" | replay on 37372: 233 checked, 4 NOT COUNTED, 1 pair, 1 REVIEW | v56 line present; AUDIT v28 line and every count unchanged by the trial; FIRED or UNEXERCISED named |
| 330 | assumed-fact form (ruling 460): STEP / ASSUMES / ROWS GIVE | a counted premise with an assumed fact in the judge text, or a K-UNX cure STATEMENT | Gate Record marks "[AUDIT v55:"; cure_reason "TRIAL rule (K-UNX, ASK 330, ruling 460)" | 37372 sol K-C/K-UNX: none in form | a valid form raises no K-UNX item / CURES; a broken form is handled as before; range kind untouched |
| 331 | Option A (ruling 461): a refused cure with same grade word and counts is off the drv_uncured tally | a CHANGE TO with identical grade and counts (send-back or applied E-GATE change) | cure_reason "OPTION A (ASK 331"; drv_uncured; panel_split | sol 2 = K-C + E-GATE G3 (41074 would come off under 331) | row stays UNCURED, says OPTION A, not counted; K re-read and not-applied gate rows stay counted; seat removed only if count > 0 remains |

Checks for every ASK:
1. No model setting changed for any call. Read call_costs and alternate rows. max_tokens is still 64000 for hydrogen. No reasoning key is added.
2. Seat outcome: compare panel_split, drv_removed, debate_removals and REMOVED FOR against 331.
3. Hydrogen's 37372 failure (finish=length at 64000 tokens) can repeat. If it does, 328 shows it.

Not settled before the run:
- 332 (WORDS ARE AT) and the cross-language counted change are not built. Expect today's behavior.
