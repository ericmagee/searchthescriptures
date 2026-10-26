# BB-7397 rev 8, steps 8/9: Worker_A3's whole read of run 28269 (row fd6a5ca9, ODV1-28269-lqp0m6vx)

Read in full, by this seat, 26 Oct 2026: the debate_results row (every field), its three debate_judgments rows (795 GLM, 796 Gemini,
797 Grok), the six rounds, the single judge's text, and the Drive report (step8/report28269.md, 221,823 bytes, md5 89fc9d23,
1,235 lines). The compaction set of drift guards (30) was read first (operational_doc 25(1b)); collision declared (DG-68): the
trained no-human-father reading against DG-8; the engine's rule compliance is graded, not the doctrine.

## Rev 8 DoD against the run
- DoD 15 (backslash escapes in cure replies): UNEXERCISED. No cure reply in this run carried a backslash escape.
- DoD 16 (every alternate tried recorded): EXERCISED, seated path. drv_removed[deepseek] carries
  "[AUDIT v21: ALTERNATE TRIED -- SEAT: deepseek; ALTERNATE: glm; MODEL: z-ai/glm-5.3; RESULT: SEATED]"; report "Alternate judges"
  prints "DeepSeek: alternate GLM (z-ai/glm-5.3) tried, SEATED". The not-seated path is not exercised.
- DoD 17 (counted values in the report): EXERCISED. Gemini's section Verdict line reads "HELD ... (counted after its cure; the judge
  wrote BROKEN)"; the GLM sent-to line reads "alternate judge GLM (z-ai/glm-5.3) seated for DeepSeek". Counts equal the judges' own.
- DoD 18 (a retraction counts only with a reason): EXERCISED, cured path. Gemini retracted D3 vs C1 and D6 vs C1 with reasons naming
  [CR3] and quoting its words ("narrates begetting where the row narrates it"; "the timing of conjugal knowledge relative to the
  birth") or verses (Matthew 1:18, 1:25); I checked both quotations are in CR3 (LINK 6). Counted HELD-1. The refusal path
  (retraction with no reason) is not exercised.

## Panel and outcome
Panel HELD 3-0 (Gemini after cure, Grok, GLM seated for DeepSeek). All three: both sides SELF-SUPPORTED, 0 conceded. Grok and GLM
wrote RESULT: UNDERDETERMINED; outcome column UNDERDETERMINED. This follows the rulebook sent (Text 1, line 2 rule: HELD gives
DEFENDER WINS only if the challenge is not SELF-SUPPORTED or a challenger link is broken; every other case UNDERDETERMINED).

## Findings
F1 DEFECT (reader, K-G5 window of rev 7 / 7194): DeepSeek's SHORT for D6 vs C3 quotes [CR3] word for word (505 characters, found
   whole in CR3) and reads UNCURED "no SHORT line quoting its answer", because no single window (300 characters before a naming
   of the line's verse to 1,200 after, inside the LINK block) holds the whole quotation; its last sentence alone passes.
   Reproduced on the published library: step8/f8_ds.cjs, step8/RUN_F8.txt. Effect on this run: none; DeepSeek stays removed on
   D3 vs C1, which named [DR1] for a quotation that is in [DR2] (measured, same file), a correct UNCURED.
F2 READER-VISIBLE MISATTRIBUTION (citation check): "Defender, round 2: cited Matthew 1:19 for 'a just man does not put away the
   mother of his own child': this wording is not in Matthew." Those words are the challenger's own [L4] (DR1, "A just man does not
   plan to put away the mother of his own child"), which the defender quoted, shortened by two words, to reject them. The report
   tells the reader the defender miscited scripture. All three panel judges named it correctly. Rulings 98 (other side's words not
   checked as scripture) did not catch it because the quotation is not exact.
F3 READER SENSE: Gemini's section heads HELD with the cure note, but its body still prints "RESULT: CHALLENGER WINS", "Rule applied:
   BROKEN ... the challenger refuted 2" and "KEYSTONE: D6 -- BROKEN"; the cure is shown only in the violations table. The top list
   gives Gemini plain HELD with no note and no reason, beside Grok's and GLM's reasons.
F4 READER SENSE: the head leads with "Verdict of the debate: HELD" and "Panel result: HELD (3-0)"; "Outcome: UNDERDETERMINED" sits in
   the table below. By the rules sent this is a tie under a HELD tag (KB-0030). Not a defect against the rules as sent; a question
   of presentation.
F5 MINOR: "Reads that gave no text: Reserve Build: Node 'Reserve Build' hasn't been executed; Alternate Cure Build: ..." prints
   internal error text to the reader.
F6 NOT THE FLOW: the defender's R3 text carries literal backslash-quotes (\"how.\") as MiMo wrote them; the synthesis (DeepSeek
   analyst) charges DG-61 against the defender's "no verse states" phrasing; both are model content.
Single judge: no text of it in the report (rulings 99 held). Its own D4 vs C2 UNCURED was not diagnosed (its cure reply is not
printed or stored); stated, not checked.

## Not checked
The citation check's 148 matches were not re-run; the 17 "too short" were not read; the Drive copy was read, the n8n execution data
was not (status polls only).
