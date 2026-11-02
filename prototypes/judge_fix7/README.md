# judge_fix7: fixes to ORACLE_DEBATE_V1 from run 32302 (offline only; nothing written to n8n, the database or git)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version 9165fb8a (confirmed by GET on 2026-11-02, updatedAt 23:05:19Z; data/workflow_live.json;
  67 code nodes in data/live_code/). The 30 nodes fix set 6 changed are byte-identical to judge_fix6/new; connections (481) and node count (262)
  equal fix set 6's base read. base/ holds the live code of the 29 nodes changed; new/<node>.js is built by `python3 patch.py` from base/ and lib/
  (kg4.js, void.js, cited_void.js, linkform.js), anchored, refusing on a wrong count.
- No node or connection is added or removed. write_package.py: one guarded PUT (versionId, base md5 of all 29 nodes, live connections and node
  count equal the base read). Run only with --dry: write_dry.txt (guards passed; 481 connections, 262 nodes, unchanged).
- Database read with SELECT only (columns looked up in information_schema first): data/run32302.json (row and its three judgments),
  data/enforcer_log_32302.json (rows 87 to 111), data/kjv_32302.json (the 49 verses cited), data/model_config.json. 32293 and 32284 copied from judge_fix6.

## Changes
- J1 K-G4 per witness (14 cure nodes, lib/kg4.js kg4Split): the witnesses a BROKEN line rests on as unanswered are the pressed witnesses its
  GROUND names, else all pressed witnesses; the grade is unanswered-false only when every one of them is named in a later round of the holding
  side. While one is unanswered the grade stands and the cure line names it. The cure prompt's K-G4 sentence says so. Row 92 (GLM, Luke 3:31) is now CURED.
- J2 VOID premises: K-G6 (drvLedger) and K-G9 (drvCited) skip premises the seat ruled VOID (lbVoid). A K-G9 verse belongs to the listed premise
  whose line carries it or holds the ruling's quotation; a verse of no listed premise is still marked. lbVoid now reads "Premises 1, 4, and 5"
  (the serial comma stopped ChatGPT's list at 4). The K-G6, K-G9 and K-LB items carry the seat's VOID set; no cured count may exceed L less the
  VOID premises (kCount and K-G9). Rows 97 and 108 no longer fire; ChatGPT's count of 4 would be refused.
- J3 Sol's rows: 107 (K-C) was a false check: the line was retracted under a counted RETRACTED line and restated UNDERDETERMINED on a weighing
  ground, with the footing in the STATEMENT. K-C now cures a retracted line (restated without the stating ground) or reads the STATEMENT's layer
  kinds. 109 (K-G9) was a false check: the STATEMENT re-ruled the charges VOID and quoted the transcript. K-G9 now accepts such a re-ruling for the
  verses of those premises (and for verses of no listed premise). The single judge's rows 102 (UNCURED) and 101, 103 (CURED) are unchanged.
- J4 (narrowed by the coordinator; D1, D2, C1, C2 Build only): (a) the DEFENSE DISCIPLINE block moves, unchanged, from the D1 and D2 system to the
  end of the D1 and D2 user turn (before the verse sheet), so each seat's system is one block, byte-identical in all four rounds (D3 system_changed).
  (b) C1 stores its opening message as sent (opening_user, verse sheet included) and C2 sends it unchanged as message 0, as D2 already does with
  D1's (C2 messages_changed). Rounds 3 and 4 are untouched. Markers: one system block and the last message, two breakpoints (limit four), ttl 1h.
- J5 Link-round format check (lib/linkform.js in D3 and C3 Extract, Build Save Body, Panel Build, Build Independent Verdict, Failure Salvage): no
  "LINK n:" block, or a first heading naming another round (the stored round label is skipped), is a format fault. The Extracts record
  link_format; review_notes gets "[AUDIT v27: LINK-ROUND FORMAT CHECK (C3) ...]"; the judges get one line after the round that grades nothing;
  ciRounds ends the round before it. 32302's challenger link round: both faults; every other link round of 32302, 32293 and 32284: none.
- J6 Engine opus: Init Seats opus:{fam:'openrouter',mc:'opus'} beside haiku; Format Markdown and Failure Salvage name it Claude Opus.

## Tests (test/)
compile_out.txt (29 compile); unit7_out.txt (50 fixtures, 0 bad: J1, J2, J3, J5, J6); cache7_out.txt (J4 harness, 16 checks, 0 bad; base
faults shown as WAS); replay7_out.txt (32302, 32293, 32284, base and new: items, uncured, counted seats, outcome); seats7_out.txt (J6).
- Replay: 32302 base (fix set 6) GLM not counted (K-G4 row 92), HELD 2-0, DEFENDER PREVAILS; new GLM counted, HELD 3-0, DEFENDER PREVAILS;
  ChatGPT PROP-DEPENDENT 2 in both (live row: COLLAPSED 4). 32293 and 32284: items, seats and outcome unchanged (UNDERDETERMINED).
- Cache (32302 rounds; system sizes as measured; text at a ratio fitted on D2 and C2; the live-code estimate matches the measured calls):
  read / written per run, live estimate 196,321 / 132,513, new 212,183 / 130,307; base-input equivalents (write 2x, read 0.1x) 284,658 live,
  281,832 new, about 2,800 saved. C2 reads C1's 79,024 instead of 63,162; D2 writes the DD block (about 590 tokens) it used to read; D3 still
  reads only the system (1,226), now as a hit. Rounds 3 and 4 equal the live bodies (D4 about 8,000, C4 about 71,500 tokens).
- Limits: the stored panel JSON holds the fields as the cure set them; the replay restores the first fields from the CORRECTED STANDING lines,
  but retracted collision lines are already rewritten in the stored text. Replies predate H5, so K-G9 (TRIAL) fires on every seat for reasonless
  NOT PRESSED lines. The seats' system prompts are not stored; the C1 served-row sheet is carried as a token count.

## What a debater now sees differently (J4)
- D1, D2: the DEFENSE DISCIPLINE block sits at the end of the user turn instead of the system (same text, same rounds).
- C2: its first message is C1's as sent, so it keeps the C1 verse sheet (the Oracle seat's served rows), which C2 used to drop. Nothing else.

## Needs the operator
- J4 now saves little (about 1% of the debaters' base-input equivalents on 32302): rounds 3 and 4 remain fresh conversations, so their misses stay.
- Opus 5.5 cannot run without thinking: with no thinking or effort field it runs adaptive thinking at its default effort (medium), billed as output.
- Open since 32293 B1: verses pressed in round 2 against no listed premise (Luke 1:13, Matthew 1:21) stay marked by K-G9.
