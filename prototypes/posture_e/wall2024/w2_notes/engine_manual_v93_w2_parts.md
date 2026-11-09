# engine_manual v93: W2's parts (W2's packages live after s38, checked on live s81)

By W2 (session_01H1X3AMSmHoLYeowLik4uwT), rev 1, 2026-11-09, for W3 (single v93 writer, Wall 3677).

HOW "LIVE" WAS CHECKED (script: prototypes/posture_e/wall2024/w2_notes/livecheck81.cjs, run from wall2024/):
1. Code: for each package, the first text its patched node adds over its base (50 characters) was searched for in live s81: every node of fetchback_live_s81.json plus the 30 unpacked library sources (pkgLIB/strip_XKB2, which packs to the live Shared Library b488cb05f6d5, checked). "n/m" below is how many of the package's changed nodes still carry that text. A node rewritten later by another package may show a miss while the rule still stands; those are named.
2. Marker: a `pkgX` comment found in live nodes (named where it exists).
3. Library packages (strip files only): the marker search above.
NOT CHECKED: each sentence against the live code line by line. Text is from each package's README or build header, stated as the final state where a later package changed it.

Placement: each part names the v92 section and either quotes the v92 text it replaces or says "new line after <v92 text>".

---

## §4 and §10: seats, panel, alternates

### pkgJGR rev 7 (s74; marker in Init Seats, Resolve Seats, Panel Build, Reserve Build and 4 more)
REPLACES in §10 JUDGE ORDER: "The ALTERNATE pool (`alt_order`) is every panel-order seat after the three that is OpenRouter-family and not mimo or time-removed, the reserve and grok included" ... "Claude never judges; DeepSeek is the enforcer (§9)."
NEW TEXT:
- `ORDER0` in Init Seats is `['chatgpt','sol','luna','haiku','qwen']` (operator 21:10Z 11-08: gemini and grok judge no more; 07:14Z and 07:27Z 11-09: luna sits on the panel with terra and sol; 08:31Z and 08:41Z 11-09: Haiku is the alternate only, never on the panel).
- PANEL: terra (seat key `chatgpt`, openai/gpt-6.1-terra), sol (openai/gpt-6.1-sol), luna (openai/gpt-6-luna). `FAM_PANEL` maps chatgpt, sol and luna to openai.
- ALTERNATE: haiku (anthropic/claude-haiku-5.5), through the OpenRouter Alternate Call. Claude judges only as this alternate. qwen stays in ORDER0 but NOT_PANEL keeps it off every seat.
- Gemini, grok, mimo and glm are not in ORDER0 and judge nowhere.
- The live order is the array in Init Seats; read it there.
Superseded and not to be documented separately: pkgPNL, pkgPNL2, pkgPNL3 (11-07/11-08 panel changes, replaced by pkgJGR); qwen_flash's reasoning rule from pkgJGR rev 2 left with qwen_flash.

### pkgGLX and pkgGLX2 (database, s56)
NEW LINE in §10 after the Record Alternates sentence: model_config rows `glm_flash` (z-ai/glm-5.3-flash) and `glm` (z-ai/glm-5.3) are inactive, and `glm` is out of odv1_record_panel_substitution's seat list, so the database refuses either as a substitute or alternate.

### pkgMIM2 (database) and pkgMIM (n8n)
Historical only: mimo joined the alternate pool on 11-07 and left with pkgJGR. Nothing to add beyond pkgJGR's text above.

### pkgE4 (s63; marker in Early Alternate Build, Early Alternate Reply)
NEW LINE in §10 after "FLOW: ...": EARLY ALTERNATE: when a panel seat's first cure reply already leaves it removable, Early Alternate Build starts the alternate's call at once (Early Alternate Reply), instead of waiting for the whole cure stage; the alternate's reply is used only if the seat is in fact removed. Operator approved 12:03 CST 11-07. Validation item still OPEN (needs a run with a cure-stage removal that uses the early reply).

## §8 the judges' rulebook (prompts)

### pkgWLA, pkgWLA2 (s64) and pkgWLD rev 2e (s73; validated 34016 + 34108)
NEW BULLET in §8 (the PRESSED-WITNESS LEDGER given to every judge, Build Independent Verdict and Panel Build; Reserve and Alternate Build reuse it):
- The ledger lists each pressed witness and whether the answering side NAMED IT IN AN ANSWER: a later round of that side names the verse reference, or names the press by its id (`P3.1`), including a joint header `MEANS [CR3] P3.1, P3.2 and P3.3: "<MEANS>"` that answers each listed id (WLA, WLA2). Only answer sections count, not any mention (WLD stage 2): headings such as "Presses not answered", "none", "nothing" are not answers (WLD rev 2b to 2e).
- The judge is told that an "unanswered" grade on a witness the ledger shows NAMED IN AN ANSWER must say why that answer fails.

### pkgL2B (live, 55 of 55 nodes carry it)
NEW LINE in §12 or §8 where the [L2] check is described: the [L2] tag check (L2C.tags) reads a tag's words from the text before the tag as well as after it, so a tag written after the words it labels ("... with *ek* (out of) [L2]") is read.

### pkgBGT (L2 Count Plan, marker)
NEW LINE beside pkgL2B: a quoted English word beside an [L2] tag ("begat" in quotes) is English, not a transliteration, and is not matched against the original words; the tag stands on the original word it names.

### pkgL1Q and pkgL1Q2 (live)
NEW LINE in §9 KJV / ECL text: a single-quoted quote ('...' or '...') after a verse reference pairs with that reference in the ECL pair reader (Send Back Build/Record, Alt Send Back Build/Record) and in the Commitment 12 KJV check (KKJV_Q, 22 nodes). An in-word apostrophe (Mary's) neither opens nor closes the quote.

## §9 the cure: reading the judge's reply

### pkgXK rev 2 (s80) and rev 3 (awaiting grade, not yet live): ONE READER ON AN EXACT ITEM KEY, JSON CURE ANSWERS
REPLACES §9 "CURE LABELS: RESPONSE and STATEMENT labels are matched with case, colons and bars folded, ending at a word edge ("#1" is not "#10"); a RESPONSE headed by the rule alone answers the only item of that rule."
NEW TEXT:
- CURE LABELS: RESPONSE and STATEMENT labels are matched with case, colons and bars folded, ending at a word edge ("#1" is not "#10"); a RESPONSE headed by the rule alone answers the only item of that rule. EXACT ITEM KEY: when several lines match an item, the reader takes the line whose label names the fewest distinct item keys (an item key is its link, or SIDE STANDING; two rules on one key count once); a line naming no item key under its own rule ranks last; on a tie the first line wins. So a line naming two items never takes an item away from its own line. The same pick chooses a K-RUL card: among the cards that match the item, the card whose RULING target names the fewest K-RUL items of the build.
- JSON CURE ANSWERS: a cure call to terra, sol, luna or Haiku (the list `xkJsonModels()` in the library) carries `response_format` json_schema `cure_lines` and an ANSWER FORMAT note; the reply is `{"cure_lines":[{"kind":"RESPONSE"|"STATEMENT"|"OTHER","item":...,"text":...}]}` in order. cureText turns it back into the same lines (`RESPONSE: <item> | <text>`, `STATEMENT: <item> | <text>`, OTHER as the whole line), so one line reader reads every reply. A reply that is not cure_lines JSON is read as text (fallback). Other models and Gemini are sent as before. The FUM follow-up repeats the note.
- (rev 3, when live) A cut-off cure_lines reply keeps every complete entry; the cut entry is dropped.

### pkgCJR (s76): JSON-wrapped cure replies
NEW LINE after CURE LABELS: a cure reply written inside a JSON object (`{"reasoning": "..."}`, `answer`, `reason`), valid or not, is unwrapped before the line reader reads it (cureUnwrap with the loose reader for invalid JSON, run 34016 Haiku).

### pkgKNL rev 3 (s77)
NEW LINE in §9 table K-F / K-CMT: a FORCED line that grades nothing (`FORCED: none graded.`, `FORCED: none`) raises no K-F or K-CMT item.

### pkgRXR (live): RETRACTED reason on the RESPONSE line
v92 already carries RXR (v92 summary). No change.

### pkgKVR (live): K-V cure on RESPONSE and STATEMENT
v92 already carries KVR. No change.

### pkgRCD (s65 library): the RULING card follows the judge's own regrade
NEW LINE in §9 K-RUL row or after it: when a judge regrades its own collision line in the cure (RESTATED or RETRACTED to STANDS or UNDERDETERMINED), the K-RUL RULING card for that pair is read against the regraded line, not the old LINK BROKEN line (Matthew 1:18 repeat, 17 of 22 runs 33311 to 33750).

### pkgFCW (library, marker in Cure Check, Panel Cure Check and 27 more)
NEW LINE in §9 after the RECOMPUTE sentence: a FORCED line that cures a K-G4 item in the cure is written into the judge's stored text, so the send-back and gate see it (D32 part 1; 33506 grok false NOT APPLIED).

### pkgD38 (library)
NEW LINE after RECOMPUTE: after a cure or a send-back change, a count, standing or verdict line that no longer agrees with the corrected lines is caught and recomputed (stale counts, 33592).

### pkgRTB steps 1 to 4 (s66 to s68): ONE RULE TABLE
NEW BULLET in §9 after LIVE AND TRIAL: the cure rules for the K-W family, the RETRACTED family, the "unanswered" family and K-G11/K-P are read from one rule table in the library (what each item needs, which line kinds cure it), and the cure ask states the same table. Each family was switched only after a byte-match on every saved run.

## §9 the send-back, apply and gate

### pkgSGA3 (s67 library)
NEW LINE in §9 SEND-BACK AND APPLY: a send-back change with no line label that adds a "Premise N" to a CONCEDED LINKS count is appended to that CONCEDED LINKS line, not refused (33798 gemini, terra; 33490 sol).

### pkgGSU (library)
NEW LINE in §9 THE GATE: a gate item counts as superseded only where the apply step's own record says its line was replaced, not by a second reading of the text (33490 gemini).

### pkgGDA (library)
NEW LINE in §9 THE GATE: a gate change that repeats an original change already applied is cured (33627 gemini, removed with drv_uncured 4).

### pkgWLG (s75; validated 34016 + 34108)
NEW LINE in §9 THE GATE: the gate treats a judge's "unanswered" claim as false only for a witness NAMED IN AN ANSWER (the ledger test above); a mere later mention is not an answer.

### pkgCLS (live)
NEW LINE in §9 SEND-BACK AND APPLY, beside "A change replaces a whole line, never a substring": the rewrite finds the old line as a whole line (Alternate Merge Seat, Gate Record, Alt Gate Record), not as the first substring hit (33411 gemini).

### pkgMNQ (live)
NEW LINE in §9 E-MNP cure: the MEANS cure check reads a MEANS that holds inner quotes; quoting the press ledger's MEANS word for word cures (33461 sol, false not-counted seat).

### pkgACM and pkgR1B, pkgRI2 (reader phase 2, live)
REPLACES §9 "KEYED LINES: the cure and recompute read collision lines through one shared line reader."
NEW TEXT: KEYED LINES: the cure, the recompute, the 4 Send Back nodes' ANSWER CHECK reads (form `ANSWER CHECK`, with MEANS, ANSWER and grade fields) and Extract Independent Verdict's verdict lines read through one shared line reader. A line the reader refuses keeps grade null (never STANDS or "not broken") and is named unread; for ANSWER CHECK lines a refused line keeps the old read.

## §9 the DeepSeek enforcers

### pkgEAW, pkgEAH, pkgEAM (live)
NEW LINE in §9 THE SECOND READING: each E-ANS and E-HOLD item carries THE ANSWER IN FULL, read from the answering round (the pressed verse's line and every line under it, including the MEANS-header form `**MEANS [CR3] P5.4: "<press meaning>"**`); the rule tells DeepSeek the answer is all of it.

### pkgEAI, pkgEID2, pkgEPL (live)
NEW LINE in §9 THE SECOND READING: DeepSeek's answer lines are read by id in every form seen (`ID (seat)`, `ID, seat`, seat-first `seat (ID)`, seat-only lines by order, bare ids); each judge line has its own id (`P3.1`), and a bare item id that names several judge lines is not read as all of them.

### pkgEB7 (live)
NEW LINE in §9 THE SECOND READING: E-B7: a premise counted UNEXHIBITED on a verse whose ANSWER CHECK lines by the same judge grade the answer MEETS is put to DeepSeek as an item (side-neutral), panel and alternate seats.

### pkgETC (live)
NEW LINE: a DeepSeek verdict whose label contradicts its own stated reason (three conclusion patterns, quotes masked) is flagged and not used as a verdict.

### pkgESR, pkgESK (live), pkgERT, pkgMER (s63)
NEW LINE in §9 THE SECOND READING (call sizing and retry):
- Enforcer calls are sized by DeepSeek's reasoning cost (`CALL_CHARS`, `MAX_CALLS` in Judge Enforcer Build); a failed call (no reply, error, empty, length stop, or a SHORT reply that answers fewer ids than sent) is split and resent once (Judge and Alt Judge Enforcer Retry Build).
- The main K-W / K-S3 call (Enforcer Call deepseek) is split and resent the same way when it fails (Enforcer Retry Build, pkgMER).
REPLACES §17 "Panel, reserve, cure and alternate calls carry no retry (§4)." only for the DeepSeek enforcer calls: those retry as above.

### pkgEKN (s61)
NEW LINE in §9 THE DEEPSEEK ENFORCER: for RULE K-W, DeepSeek grades a judge's NOT HELD and REASSERTED answers instead of writing NO ANSWER.

### pkgEAK, pkgEAK2 (live)
NEW LINE in §9 THE DEEPSEEK ENFORCER: a seated alternate's K-W cure answers get the same DeepSeek check (Alt and R2 Alt Judge Enforcer Build), even when the build would otherwise skip.

### pkgWLDDS (s71)
NEW LINE in §9 THE SECOND READING: DeepSeek is given the same witness ledger the judges saw, for E-HOLD and for E-COL items that name a pressed verse.

## §11 persistence, §13 reports

### pkgGFM (database)
NEW LINE in §11: when grading dies after the rounds are saved, the debate_results row is marked failed (quarantine_reason), record-only; it removes nothing. Validation item still OPEN (needs a failed run).

### pkgFMQ (Format Markdown, marker)
NEW LINE in §13: the report's RESULT reason keeps escaped quotes inside the JSON string (33389).

### pkgMEM (DUP part) and pkgTRM (live)
NEW LINE in §4 or §16 (memory): Alternate Merge Seat and Alternate Merge no longer carry `enforcer_log_body`; Write Enforcer Log builds it. Send Back Record and Gate Record no longer pass enf428_rows, enf421_rows and sb_rows to nodes that do not read them.

---
Open validation (stays in W2's md_notes until two repeated debates pass): pkgXK (s80), pkgCJR, pkgKNL rev 3; E4 and GFM need a run that exercises them.
