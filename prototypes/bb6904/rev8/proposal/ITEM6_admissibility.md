# BB-6904 revision 8, proposal item 6 (7199): the admissible rows on this topic, an exact and reversible change, for the operator.
Topic: "Did Christ have a biological father?". debate_admissible = debate_results WHERE data_class = 'study' AND quarantine_reason IS NULL.
WHICH RULE EACH ROW WAS GIVEN (measured 2026-10-21): the pressing-sentence rule (b) is absent from Panel Build and Build Independent Verdict
in version af3c8f7c (live from about 17:23Z 20 Oct) and present in db281705 (published 19:39:00Z 20 Oct, BB-6880) and every version since.
  27259  20 Oct 20:47Z  judged under (b)   CHALLENGER PREVAILS  study, admissible  13 to 15 BROKEN lines, none meets (b)
  27208  20 Oct 18:22Z  before (b)         CHALLENGER PREVAILS  study, admissible  7 lines; none would meet (b) as written today
  27191  20 Oct 17:06Z  before (b)         CHALLENGER PREVAILS  study, admissible  12 lines; same; Gemini D5/D6 class 1 under rule (a), which it had
  26986  19 Oct 20:23Z  before (b)         CHALLENGER PREVAILS  study, admissible  6 lines; same
So only 27259 is a row whose verdict contradicts the rule its judges were given (operational_doc 27 class 2). The other three were judged
before (b) existed; their outcome is still the reading DG-8 forbids, but "fails (b)" is today's measure, not their rule.
THE CHANGE (exact; the operator chooses the rows: 27259 alone, or all four):
  UPDATE debate_results SET quarantine_reason = 'BB-6904 rev 8: outcome rests on BROKEN lines that do not meet the pressing-sentence rule (BB-7184, BB-7186); held out of debate_admissible pending re-grade'
  WHERE id IN (<chosen ids>) AND data_class = 'study' AND quarantine_reason IS NULL RETURNING id;
  ids: 27259 56e75954-c776-4e7e-8d26-94e3a46a5c09; 27208 0d80d311-5ff2-4d64-8a20-c66a0f14cc4f; 27191 c12a1af1-91ac-448e-a409-30a4c28ddd64; 26986 31ac4ccd-8108-4401-8b56-48c1ec6f82a1
BEFORE (md5(row(d.*)::text), 2026-10-21): 27259 0140290d; 27208 6160f88b; 27191 b33fc2a8; 26986 d72660b0. All four quarantine_reason NULL.
TRIGGER WRITES: one table_snapshot_queue row per updated row (snapshot_debate_results); no other UPDATE trigger on debate_results.
UNDO (exact): UPDATE debate_results SET quarantine_reason = NULL WHERE id IN (<chosen ids>) AND quarantine_reason = '<the text above>' RETURNING id;
  then md5(row(d.*)::text) equals each BEFORE value.
Nothing moves before the operator's word (7199 item 1).
