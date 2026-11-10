# W2 second-grader labels for W1's fixes from dry regrade 34108 (execution 34626, s110). Written before W1's build is posted.
Source: /mnt/project-files/wall2024/ex34626_full.json. Findings per W3 grade (Wall 4213); claims W1 Wall 4212 (pkgKSR = F2 with F1, pkgAPF = F3).

## Frequency in stored data (measured, SQL over debate_judgments 519 rows and debate_replay_judgments 342 rows; node inputs under wall2024/inputs/)
- F1 engine break lines sent back: the only engine-written grade line is the closing break ("[AUDIT: LINK n BROKEN BY A CONFIRMED CLOSING
  CONTRADICTION", Shared Library, one template). It appears in 3 of 861 stored verdict rows, all execution 34626. No stored Judge Enforcer Record,
  Alt Judge Enforcer Record or Send Back Record input file (45 runs) holds "(AUDIT: " in an item. Occurrence: 1 run, 6 items (Judge Enforcer
  Record 6 mentions, Send Back Record 6).
- F2 KEYSTONE disagrees with the result: KEYSTONE Dk STANDS while Dk is broken in the final count: 3 of 861 rows, all 34626. Engine-derived
  keystones (pkgRCD): live 3 (1042, 1049, 1076), replay 1 (344). In 1042, 1049, 1076 the judge's own D6 break was changed by send-back to
  UNDERDETERMINED or STANDS, so STANDS is right there (1076 is BROKEN by 3 conceded links, not by D6). Only 344 is wrong.
- F3 alternate reply unusable: 39 distinct ALTERNATE TRIED lines (live 36, replay 3), all NOT SEATED. Unusable replies: live 5 (1 "returned no
  JSON object", glm 10-26; 4 "returned content null"), replay 1 (haiku "JSON did not parse", 34626). luna's removal in 34626 was for S12 (D3)
  and G5 (D4 vs C2), not for the engine break lines.

## Labels (each run on W1's candidate and on live s110; a silent drop is a FAIL)
F1
- P1.1 34626 stored inputs: the 6 items naming D6 vs C5 / D6 vs C6 with the engine's AUDIT break text are not sent back and not counted CURED;
  every other item of luna (17), terra (6) and sol (7) is unchanged.
- P1.2 plant: the judge's own D6 vs C5 DEFENDER LINK BROKEN line (no AUDIT text) with an E-COL fault is still sent back (the fix keys on the
  engine's mark, not on the link).
- P1.3 plant: a judge line that copies the AUDIT text into its own reasoning but is not the engine's line: recorded as found (no silent drop).
F2
- P2.1 34626 rows 344 to 346: KEYSTONE D6 reads BROKEN after the closing break; RESULT, STANDING and CLAUSE unchanged.
- P2.2 plant: closing break on a non-keystone link (D3): KEYSTONE D6 stays STANDS.
- P2.3 plant: judge's own KEYSTONE BROKEN, no closing break: unchanged.
- P2.4 luna's path: send-back changes the break lines and the derived keystone runs; after the break is applied again KEYSTONE is BROKEN.
- P2.5 stored 1042, 1049, 1076 inputs (no closing break): KEYSTONE unchanged.
F3
- P3.1 34626 haiku reply (did not parse at 5435): outcome follows the operator's rule as W1 posts it; nothing silent: the record names the seat,
  the alternate, the failure and what was done.
- P3.2 plants: content null, and no JSON object (the stored live forms): same handling as P3.1.
- P3.3 control: a valid alternate reply is seated or refused exactly as live.
- Size: measured code and prompt change, by node.
