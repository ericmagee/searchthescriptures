# engine_manual v93: W1's parts (anchored edits on v92)

Drafted by W1 (W1_2026_11_04, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh), 11-09, as W3 asked at Wall 3677. For W3, the single writer of v93.
The header, the PACKAGES lines and the NOTE lines are for W3 only. The body text is the text under ADD or REPLACE WITH; it carries no provenance.

Base checked: live s81, version f8b9d3af (fetchback_live_s81.json, 390 nodes), library strip_XKB (the s80 library; s81 changed no library node).
Anchors: every ANCHOR below occurs exactly once in v92 (checked by SQL on engine_manual version 92, 11-09). W1-15 and W1-16 share one anchor; apply W1-16 after W1-15.
Method: every package below was checked live in s81 by its marker in the node code (a pkg comment tag, a function name or the added text),
or by node settings for settings-only packages. A package that is not live is listed under NOT LIVE and gets no text.

## Coverage

W1 packages live after s38 and placed below (part number in brackets):
EID, EIS, ESS, ERF [1]; EST, EGL, EGA, EGP, EKG, EKL, EKS, KWI (DeepSeek part) [2]; EOQ, ERC, EWB, EKD, EAX [3];
KSP [4]; KWT, KWA, KWC, KWQ, KWI (library part) [5]; KFN [6]; KCR v2 [7]; KG7 [8]; KRC [9]; KBL [10];
KG1L, KS3Q, FRP, OOS [11]; GDS, PSQ, CRW [12]; GRT, GRT2, UND2 [13]; RI3, RI3B, RI4, RI5, RI6, RI7 [14];
RMR [15]; A2R [16]; PPJ [17]; RMT [18]; replay gate, pack and library source tools [19].

NOT LIVE (no text): pkgEPC (s81 enforcer call nodes still send batchSize 1); pkgFRC (the qwen and glm flash seats it served are gone; no
reasoning budget in s81). Not engine behaviour (no text): pkgDEC (decode once; output unchanged), pkgFCT (a test tool), pkgV18 (live in s45,
before s38; v92 does not name the v18 off-list reading, see NOTE under [7] if W3 wants it).

---

## W1-1. §9 THE SECOND READING: how the enforcer calls fail, retry and are read

PACKAGES: pkgERF (s54), pkgESS (s48), pkgEID (s46), pkgEIS (s47). Nodes: Judge Enforcer Call deepseek, Alt and R2 Alt (retryOnFail false);
Judge Enforcer Retry Build, Alt, R2 Alt, Enforcer Retry Build (short reply); Judge Enforcer Record, Alt, R2 Alt (labels).
ANCHOR (append after, same bullet): "A failed or empty call is recorded by its index, never thrown."
ADD:
" The first call nodes (Judge Enforcer Call deepseek and its Alt and R2 Alt copies) carry no node retry; a failure is an output item. The Retry
Build nodes then split each call that came back failed, empty, cut at the token limit, or short (two or more fewer ENFORCER lines than the
call's item ids) into two halves of whole items and send the halves once through the Retry Call nodes (3 tries each); the reason is kept in
`enf428.esr.why`, and the Record reads the halves in place of the call. The reply form asks for one line per item id, the id alone. The Record
also reads `<id> (<seat>)`, `<id>, <seat>` and `<seat> (<id>)`; a bare id with no item number (`Y1`) only when the call holds exactly one such
item; lines keyed by judge name only when their count and judge order equal the call's items exactly. Any other line leaves the item
ENFORCER NO VERDICT, and the label fault is counted in `enf428`."

## W1-2. §9 THE DEEPSEEK ENFORCER (K-W and K-S3): the answer forms and how they are graded

PACKAGES: pkgEST (s50), pkgEGL v2 (s53), pkgEGA (s55), pkgEGP (s56), pkgEKG (s57), pkgEKL v2 (s61), pkgEKS (s65), pkgKWI DeepSeek part (s69).
Nodes: Enforcer Build, Enforcer Record (and the K-W text in Alt and R2 Alt Judge Enforcer Build).
NOTE: v92 says the call answers "ENFORCER: <id> -- AGREE | DISAGREE | NO ANSWER -- NEEDS: YES | NO -- <quote>". That stays true. Still TRIAL in
s81 (Enforcer Record writes "TRIAL, ruling 421").
ANCHOR (replace): "It decides first whether the link's own conclusion needed what was withdrawn (K-W), or whether the concession gives up part of a declared link or listed premise (K-S3), and answers each answer `ENFORCER: <id> -- AGREE | DISAGREE | NO ANSWER -- NEEDS: YES | NO -- <quote>`."
REPLACE WITH:
"Each judge answer carries the judge's RESPONSE and its STATEMENT for the item; the form may stand on either, and NO ANSWER is written only
when neither is in a form. K-W has four forms (STANDS WITHOUT IT because <a layer>; CONCEDED; REASSERTED IN <round> \"<quote>\"; NOT HELD
quoting the flagged sentence) and K-S3 three (COUNTED; TOUCHES NO LINK: <why>; NOT HELD: <why>); a NOT HELD or REASSERTED answer is graded,
never NO ANSWER. K-W: it decides first what fact the flagged sentence carried for the link and whether the side still claims it. The flagged
sentence itself never counts as a still-claim; for a grant, the fact at risk is the link's footing the granted point answers, and the judge's
layer is never required to carry the granted point. When the side still claims the fact, STANDS WITHOUT IT is right if words of the side
outside the flagged sentence rest that fact on a verse whose own words state it (a bare restatement carries nothing): AGREE when the judge's
layer carries it, otherwise DISAGREE with \"right: STANDS WITHOUT IT because <the side's kept words>\" (a wrong layer, not a concession).
CONCEDED is right only when no such words exist. When the side no longer claims the fact, STANDS WITHOUT IT is right on footing the side itself
gave. A NOT HELD reason must first quote six words in a row of the flagged sentence after its verb, across any inner quotation marks, ellipses
and commas; a quote that stops short at an inner mark is DISAGREE. K-S3: when the concession gives up part of a declared link or listed
premise, AGREE with COUNTED and DISAGREE with TOUCHES NO LINK or NOT HELD; otherwise the reverse. It answers one line per answer id
`A<item>.<n>`, `ENFORCER: <id> -- AGREE | DISAGREE | NO ANSWER -- NEEDS: YES | NO -- <quote>`. The Record also reads an id written
`G<k>/A<k>.<n>` (or `ITEM k/`, `k/`) when k is the answer's own item, and item lines `G<k> --`: one such line covers every answer of the
item when the answers share a form; when their forms differ and the item has as many G<k> lines as answers, line i is answer i, unless a line
quotes another answer's own opening words and not its own. Anything else is ENFORCER NO VERDICT."

## W1-3. §9 THE SECOND READING: E-OOR, E-PREM on a recounted line, E-KEY, the full-answer finders, the E-ANS grant hold

PACKAGES: pkgEOQ (s52), pkgERC (s57), pkgEWB (s58), pkgEKD (s59), pkgEAX (s47 LIVE, `EAX_STATUS='LIVE'` in s81).
Nodes: Judge Enforcer Build, Alt, R2 Alt (EOQ, ERC, EWB, EKD); Judge Enforcer Record, Alt, R2 Alt (EAX).
ANCHOR (append after, same bullet): "(a NARROWED premise that keeps its footing is spared)."
NOTE: the E-KEY clause of v92 reads "E-KEY, each KEYSTONE line with that judge's collision lines on that link". I add to it below rather than replace.
ADD:
" On a count line the engine rewrote after a cure (\"recomputed after the cure\"), E-PREM is shown the judge's stored counted premises, whether
premise N is in them, the judge's own line before the recount and its collision lines on that link; the ruling is COUNTED when N is stored as
counted, else SPARED, and silence is not a SPARED ruling. E-KEY is shown the defender's own opening and the link's premise line, so a keystone
ground that restates the defender's thesis is not read as the judge's own doctrine. The finders that send an answer in full (E-ANS, E-HOLD)
match the answer's opening words only at word edges. An E-OOR sentence ends before the judge's ` -- ` tag, or at the closing quotation mark
followed by that tag, the line end or the judge's own prose. An E-ANS DISAGREE (right: MISSES) whose reason calls the answer only a grant,
says it gives no fit, or says it only restates, is HELD and not sent back (`ENFORCER HELD` in `cure_reason`) when the answer in the round the
item names (5 or more of the quoted words in a row) carries 3 or more distinct [Ln] tags, or 1 or more and a fit sentence after the quoted
words; a reason naming another defect (omits, ignores, nowhere, repeats, concedes or withdraws the press) is never held."

## W1-4. §9 Send-back E-KSC: what the count reader counts

PACKAGES: pkgKSP (s47, LIB v6). Node: the KSC block of the library (EIV and the send-back nodes).
ANCHOR (replace): "\"Premise p\", or a bare p after `--`, `;` or `,` (also \", TAG\" and \"is TAG\"), names the link of the p-th entry's `LINK n:` label in the challenger's [DR2] UNSUPPORTED-L4 PREMISES list, or else the premise's own \"(LINK n\" label; with neither it names no link and raises nothing."
REPLACE WITH:
"A premise entry never counts: a premise conceded under a link is not the link withdrawn. A link counts only when, outside quotations, the
line names \"LINK n\" or \"Dn\" directly followed by UNEXHIBITED, CONCEDED or WITHDRAWN, and not as a premise's link (\"Premise 2, LINK 6\",
\"Premise 2 (LINK 6)\", \"charged against D6\", \"under LINK 6\")."
NOTE: v92's preceding sentence ("\"LINK n\" and \"Dn\" name link n.") can stay. I checked the KSC block in s81 has no [DR2]-list mapping.

## W1-5. §9 table, K-W row: the flagged sentence and the NOT HELD quote

PACKAGES: pkgKWT, pkgKWA, pkgKWC (s47 to s49, LIB v7 to v10), pkgKWQ (s66), pkgKWI library part (s69). Node: kwLines421 and the K-W NOT HELD
block in the library (26 to 30 nodes).
ANCHOR (replace, inside the K-W row): "a parenthesis holding only verse references, such as \"(Isaiah 8:18)\", is dropped from the flagged sentence first; parentheses holding words are kept; KWR)."
REPLACE WITH:
"a parenthesis holding only verse references, such as \"(Isaiah 8:18)\", is dropped from the flagged sentence first; parentheses holding words
are kept; the runs are read both with and without verse references, on both the sentence and the reply; inner quotation marks do not end
the six words: the quote runs across them and may leave them out). The flagged sentence: when only a pronoun (it, that, this, so, them, these,
those) or nothing follows the verb, the flagged line is the sentence before it plus the grant; when nothing but punctuation follows the verb,
it is the whole sentence that holds it (\"..., which I grant.\"); with no words before the verb either, no item is raised. A sentence cut whose
double quotation marks do not balance ends at the first sentence end outside quotations. Runs a NOT HELD reason may quote also include the body
without a leading \"that\", \"how\" or \"whether\", and the words before a trailing \"which/as/that/this I grant\", each when 3 or more words remain"
NOTE: check the ANCHOR text against v92 exactly; I copied it from v92 §9 (K-W row) as served by substring(). The closing "KWR)" in v92
belongs to the parenthesis; my replacement closes the parenthesis after "leave them out".

## W1-6. §9 table, K-F row: a numbered list quoted on one line

PACKAGES: pkgKFN (s49, LIB v13). Node: kfFound (all library nodes).
ANCHOR (replace): "| a FORCED line whose three quotations do not each stand in the round named, or a malformed FORCED line (rulings 396, 411) |"
REPLACE WITH:
"| a FORCED line whose three quotations do not each stand in the round named, or a malformed FORCED line (rulings 396, 411). A quotation that joins a numbered list onto one line is found when it stands with the inline list markers (\"2. \", \"3) \") taken out of both the quotation and the round |"

## W1-7. §9 KEYED LINES: RESTATED label lines and KEEP

PACKAGES: pkgKCR v2 (s54, LIB v14_KCR2). Node: cureLines and netKeeps (library).
ANCHOR (append after): "with no broken line read, verdict, RESULT, CLAUSE and a SELF-SUPPORTED standing are not derived from it."
ADD:
" A RESTATED line may carry the REASONING label. A RESTATED line in no form the line reader reads goes to the label branch only when the reader
found no form at all; a KEYSTONE, RESULT or STANDING line the reader refused stays malformed. A KEEP does not hold a line that says
\"contradicted by\" or \"cannot agree with\" followed by [L1] and two or more layer kinds."
NOTE (pkgV18, s45, only if W3 wants it): Extract Independent Verdict reads a single-judge collision entry graded \"DEFENDER LINK STANDS\" as
STANDS and writes \"[AUDIT v18: Dn GRADED WITH THE OFF-LIST WORDING ...; READ AS STANDS. REVIEW THIS ROW.]\" (marker present in s81).

## W1-8. §9 table, K-G7 row: a count does not cure a break of meaning

PACKAGES: pkgKG7 (s62, LIB v22 to v25). Node: cureVerdicts (kg7Ans2024), kNeed, CURE_RULE_G.
ANCHOR (replace): "| CORRECTED COUNT and STANDING; or RETRACTED with one CORRECTED RESULT |"
REPLACE WITH:
"| CORRECTED COUNT and STANDING; or RETRACTED with one CORRECTED RESULT. When the line does not say the witness went unanswered, or a later round of that side names every pressed witness it quotes, the break is one of meaning (ruling 421): only a FORCED line for the pair, or RETRACTED, cures it, and the premise is not required in the side's corrected count |"
NOTE: this anchor is the K-G7 row's cure cell; it occurs once in v92.

## W1-9. §9 table, K-RUL row: a card without a RESPONSE line

PACKAGES: pkgKRC (s76). Node: cureVerdicts (Shared Library).
ANCHOR (replace): "| the five-line card; every RESTATED line in the same reply carries its card |"
REPLACE WITH:
"| the five-line card; every RESTATED line in the same reply carries its card. A valid card answers the item without a RESPONSE line |"

## W1-10. §9 table, K-B row: how the layers of a LINK BROKEN line are read

PACKAGES: pkgKBL (s72). Node: lbFoot (30 library nodes and 12 nodes with their own copy), cure.kb.
ANCHOR (replace): "| K-B | a LINK BROKEN line exhibiting fewer than two layer kinds (rule B) | RESTATED line, same grade, two kinds exhibited; or RETRACTED |"
REPLACE WITH:
"| K-B | a LINK BROKEN line exhibiting fewer than two layer kinds (rule B). The layer reader does not let a quoted span run across a `|` mark, reads a 1 to 3 letter word in quotation marks as a word, not a quotation, and reads [L2] in the forms word (G1234, meaning) and word (meaning, H1234) | RESTATED line, same grade, two kinds exhibited; or RETRACTED; a RESTATED or RETRACTED answer is checked for the grade and the two kinds |"

## W1-11. §9 THE GATE: K-G1 items, K-S3 re-read, a FORCED line found by its pair, a struck E-OOR

PACKAGES: pkgKG1L (s49, LIB v11), and the three G33731 fixes pkgKS3Q, pkgFRP, pkgOOS (s64). Nodes: gateNewK2024, gateCure2024, sbApply2024
(Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge Seat, Alternate Merge 1 and the R2 copies); Judge Enforcer Build,
Alt, R2 Alt (OOS).
ANCHOR (append after): "A gate FORCED line that cures a K-G4 item is written after its collision line."
ADD:
" A gate K-G1 item lists the side's CONCEDED LINKS line (CHALLENGER CONCEDED LINKS for a challenger link) beside the collision line, so a
count-line change replaces the count line. The gate's K re-read does not raise as new a K-S3 item whose sentence the text held before the
change. A CHANGE TO `RETRACTED: Dn vs Cm` whose item quotes a FORCED line the text no longer holds word for word finds the FORCED line by its
pair; when an earlier item of the same reply already retracted that pair, the item is recorded as covered by it. An E-OOR item takes
CHANGE TO: STRUCK -- <why> (also \"(struck: ...)\")."
NOTE: please check the K-G1 refused-change rule of pkgKG1L (gateCure2024: "a change pkgRCT refuses is recorded and removes no seat") against
your own v92 text on RCK before adding it; I left it out because v92 already says "no change is refused" for the K re-read.

## W1-12. §9 SEND-BACK AND APPLY: dash separators, quoted sentence breaks, whole-line rewrite

PACKAGES: pkgGDS (s67), pkgPSQ (s62), pkgCRW (s46, LIB v4; crwRep). Nodes: gateRead2024 (10 library nodes), Send Back Record, Alt, R2 Alt
(GDS); psGrades (19 library nodes, PSQ); cureRewrite (crwRep, library).
ANCHOR (append after): "A change replaces a whole line, never a substring, and is unwrapped from quotation marks only when it both opens and closes with one."
ADD:
" A send-back or gate answer written with dashes in place of `||` is read in that form: the first dash after the item id opens the CHANGE TO
line, and the last dash before a round tag or a quotation mark opens the reason; a line that already has `||` is never touched, and each
answer so read carries a FORM NOTE in the audit and the logged line. When a recompute rewrites a judge line, it matches only at a line start
and takes a whole-line match first, so a line is never rewritten inside a longer line with the same ending. In reading a count line's grade
clauses (psGrades), a quotation that ends a sentence keeps the sentence break, so the grade before it does not run on to the next sentence."

## W1-13. §9 CODE CHECKS SENT BACK: the E-COL and E-HOLD asks offer only forms the engine applies

PACKAGES: pkgGRT (s60), pkgUND2 v2 (s61), pkgGRT2 (s70). Nodes: Send Back Build, Alt, R2 Alt; Send Back Record, Alt, R2 Alt (GRT2).
ANCHOR (append after): "Cures of these items are CHANGE TO lines; a KEEP does not cure E-IMP, E-KSC, E-COL by layers or the absence grades."
ADD:
" A collision line is regraded, never retracted: an E-COL or E-HOLD ask on a collision line offers the line with the pair regraded, with its
GROUND. On a FORCED line the ask offers CHANGE TO: RETRACTED: <pair>, which applies only once the pair's collision line is no longer LINK
BROKEN. When the judge's text grades that collision line LINK BROKEN and no ask for it is in the same send-back, a companion E-COL ask for
the collision line is added (next S number), and the FORCED ask names it. A companion is record only: answered, it is CURED with a COMPANION
ASK note; unanswered, it is not silence and is never counted."

## W1-14. §9 KEYED LINES: the shared reader reads first

PACKAGES: reader phase 2 items 3 to 7: pkgRI3 (s62), pkgRI3B (s64), pkgRI4 (s65), pkgRI5 A, B and C, pkgRI6, pkgRI7 (s66 to s68). Library.
ANCHOR (replace): "KEYED LINES: the cure and recompute read collision lines through one shared line reader."
REPLACE WITH:
"KEYED LINES: the cure, the recompute, the send-back and the gate read collision lines, count lines (CONCEDED LINKS and its head in
psGrades), STANDING lines, FORCED lines and line labels through one shared line reader first; where the reader reads no such form, or reads
it RESTATED for a label, the older pattern decides."
NOTE: W2 and W4 built reader items too (RI2, RP8 to RP15). W3, please merge their parts into this one sentence rather than adding a second home.

## W1-15. §10 ALTERNATES: what removed a seat

PACKAGES: pkgRMR v2 (s62). Node: Alternate Merge Seat (and R2).
ANCHOR (append after): "each tried alternate leaves an AUDIT line (SEATED or NOT SEATED and why)."
ADD:
" Each `drv_removed` entry names the rules that removed the seat (`removed_rules`, for example \"K-W (cure) x4\", with `removed_rules_total`
and whether it equals `drv_uncured`), read from the seat's own stored lines; each ALTERNATE TRIED line ends \"; REMOVED FOR: drv_uncured N:
...\"."

## W1-16. §10 ALTERNATES: the second round

PACKAGES: pkgA2R v2 (s63). Nodes: Second Alternate?, Second Alternate Needed?, the 26 R2 nodes (R2 Alternate Build to R2 Alternate Merge),
Alternate Merge 1 (renamed from Alternate Merge), Alternate Merge (new final node), Panel Tokens, Format Markdown.
ANCHOR (append after): "each tried alternate leaves an AUDIT line (SEATED or NOT SEATED and why)." (after W1-15's sentence)
ADD:
" SECOND ROUND: when a removed seat's first alternate ends NOT SEATED, the seat is unfilled, fewer than two alternates sit, and the pool holds
a model not tried in the first round that passes G1 and G3, Second Alternate? sends that seat once more through the R2 chain (a copy of the
first round's chain; G5 refuses a model tried in the first round; no early start). Alternate Merge then joins the rounds: a seated second
alternate takes the seat; otherwise the first round's text stands with the second round's ALTERNATE TRIED lines added. At most two alternates
sit. Every node after Dry? reads `Alternate Merge`."
NOTE: also FLOW in §10 reads "... Alternate Build/Call/Payloads/Cure -> Alternate Merge -> Dry? ...". With A2R it is "... -> Alternate Merge 1
-> Second Alternate? -> Second Alternate Needed? -> (R2 Alternate Build ... R2 Alternate Merge) -> Alternate Merge -> Dry? ...". W2's pkgE4
(early alternate) changes the same FLOW line; please write the one FLOW line from both parts.

## W1-17. §10 FLOW: the three panel judges are called together

PACKAGES: pkgPPJ v2 (s53). Nodes: Panel Judges Prep, Panel Judges Parallel, Panel Judges Wait, Panel Judges Poll, Panel Judges Done?,
Panel Judges Fetch, Panel Judges Collect; sub-workflow webhook `wall2024-panel-judge-call` ("WALL-2024 Panel Judge Call"); rpc ppj_put,
ppj_status, ppj_get.
ANCHOR (replace, in §10 FLOW): "Panel Judge 1-3 (in sequence)"
REPLACE WITH:
"Panel Judges Prep -> Panel Judges Parallel -> (Panel Judges Wait -> Poll -> Done?) -> Panel Judges Fetch -> Panel Judges Collect -> Panel Judge 1-3"
ADD (new bullet after FLOW):
"- PARALLEL JUDGES: Panel Judges Prep builds the three judges' request bodies (one per slot) with a one-use nonce. Panel Judges Parallel posts
all three at once to the Panel Judge Call webhook workflow, which answers at once, calls the judge, and stores the reply (`ppj_put`). The main
flow waits 15 s at a time and polls `ppj_status` until every slot has a reply or an error, then reads them (`ppj_get`); Collect hands each
slot's reply on in the form the Panel Judge nodes gave it. No HTTP call is held open while a judge answers."
NOTE: §4 RETRY and §16 do not change. Check the §10 FLOW line text in v92 before asserting the anchor; I read "Panel Judge 1-3 (in sequence)".

## W1-18. §4 NO REASONING FIELD: one exception

PACKAGES: pkgRMT (s55). Node: Reserve Build.
ANCHOR (replace): "NO REASONING FIELD: no call sends a reasoning, effort or thinking field."
REPLACE WITH:
"NO REASONING FIELD: no call sends a reasoning, effort or thinking field, except Reserve Build, which sends a `xiaomi/` model with reasoning
turned off."
NOTE: other packages (W2's pkgJGR for Haiku and luna) also add thinking or reasoning settings in s81; this sentence needs their parts too.
s81 grep: 98 nodes carry the word "reasoning" in parameters (many only in prompt text). W3, please take the final wording from JGR's builder.

## W1-19. §15 Verifying a change: the replay gate and the library tools

PACKAGES: list 3627 items 2 and 6 (gate/pack.cjs, gate/replay.cjs, gate/src.cjs), build-tree tools only; they change no live node.
ANCHOR (append after): "A firing path no stored run reached is tested by writing one true breach into a saved input and checking that only that item changes."
ADD:
" THE REPLAY GATE (`gate/replay.cjs --base <strip> --cand <strip> [--targets <file>]`, in the build tree) runs the library nodes in dependency
order on every saved run with an index file and on every near-miss case in `gate/cases/`, once with each source, each library node reading
the recomputed output of the library nodes upstream of it. Outputs are compared byte for byte (timestamps ignored), then item row by item
row; a changed, new or missing row passes only when it matches the package's targets, and a changed text line outside the rows only when an
`allow_lines` entry allows it. Each near-miss case edits a saved judge reply and states what the candidate must give. Each node run has a time
limit; an overrun is a failure. The exit code is 0 only on GATE PASS. A change on a path no saved run reaches passes the gate, so a package
brings a near-miss case for each such path. The gate does not recompute past a non-library node. THE PACK COMMAND (`gate/pack.cjs`) packs a
strip folder into stubs and the Shared Library in a temporary folder, requires every stub to rebuild byte for byte and the stub rebase to
pass, and creates only the new output folder. THE LIBRARY SOURCE (`gate/src.cjs split|join|check`) holds each statement shared by two or more
library nodes once (`lib/<name>.js`) and joins the node sources from it byte for byte; `VARIANTS.txt` lists names that have different text in
different nodes, each of which a fix must reach on purpose."
NOTE: gate/LIVE (the pack's default fetch-back) now names fetchback_live_s81.json (updated with this file).
