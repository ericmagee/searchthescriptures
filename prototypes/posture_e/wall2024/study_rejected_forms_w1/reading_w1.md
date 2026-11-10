# W1 reading: closing enforcer and judge enforcer reply lines the live s108 record steps reject (independent of W2's 4167). Offline, no calls.

## Closing enforcer (per-side replies on the mount: 40 replies, 100 distinct lines)
- Label forms: study_close_fp/w1_labels/label_forms_out.txt (six forms). cec_forms.cjs runs Close Enforcer Record on every NEW line
  (handed A or R ids are pkgRAC-only and dropped; that call body is shelved): cec_forms_out.txt.
- Live s108 rejects 2 lines on form: 34108 X sends 1 and 2 (bare [3]/[4]). On pkgRLF rev 2: 0. AGREES with W2.

## Judge enforcer and Alt judge enforcer (stored calls in inputs/: 72 reply files, 295 replies, 11,004 non-empty lines)
- je_lines.cjs classifies every line with the record's own patterns: 10,584 by item id, 161 bare number, 227 judge name only, 24 seat-first,
  8 not read. (Alt calls carry W items, which only the Alt record's patterns accept; my first count of 7 "name order" faults there was my
  script using the Judge record's patterns: not a fault.)
- je_replay.cjs runs the live s108 Judge Enforcer Record and Alt Judge Enforcer Record on every stored run (45 and 25; 8 old runs cannot
  run, their Enforcer Record was not stored): je_replay_s108.txt.
- LOST, silent (no error text): 33222 call 5, five E-SYN lines "ENFORCER: Y1.1 -- TRUE -- ..." (the RIGHT value in the AGREE place):
  the replay tallies E-SYN NO VERDICT 5. AGREES with W2.
- NOT LOST: 33815 call 7, three lines without "ENFORCER:" ("Y6.1 -- DISAGREE -- ..."): the retry step catches the short reply and the
  retry reply is read (esr: retried [7]). W2 does not list them either.
- NEW, not in W2's report: a seat-first line on a bare item number is not read by its seat. "ENFORCER: chatgpt (P3) -- DISAGREE" becomes bare P3,
  and the record gives the FIRST line's verdict to all three P3 items (pkgEPL fan-out); the seat named in the line is not used.
  Plant (je_plant_seatfirst.cjs, 33442 call 5): gemini AGREE, chatgpt DISAGREE, sol AGREE -> E-PREM AGREE 36, DISAGREE 0 (chatgpt's DISAGREE lost);
  all three DISAGREE -> DISAGREE 3. Real form: 33149 call 5, P11 and P12 (6 lines; P12 gemini DISAGREE, chatgpt AGREE, sol AGREE), which
  cannot be replayed (old run). By the code, on live either all three P12 items take gemini's DISAGREE (if each judge counts 0 links)
  or the line goes to the label-fault error. A line that names its seat should go to that seat's item. E-PREM rows are record-only (ruling 428
  TRIAL), so no judge effect today. Fix size not built; a seat match inside the fan-out is the likely form.

## Seat-first fix: sketch and measured size (not built for write)
Insert, in Judge, Alt and R2 Alt Judge Enforcer Record, just before the item-id pattern (const m=__t.match(/^ENFORCER...):
{const __q=__t.match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([A-Z]+\d+)\s*(?:\(\s*([A-Za-z][\w.-]*)\s*\)|,\s*([A-Za-z][\w.-]*))/i);if(__q){const __o=((B[i]||{}).ids||[]).filter(x=>String(x.id).toUpperCase().startsWith(__q[1].toUpperCase()+'.')&&String(x.seat||'').toLowerCase()===(__q[2]||__q[3]).toLowerCase());if(__o.length===1)__t=__t.replace(__q[1],__o[0].id);}}
A bare item number with a seat beside it ("P3 (chatgpt)", "P3, chatgpt", or seat-first after the pkgEIS rewrite) becomes that seat's own item id.
- Measured on s108 (pack of strip_R1 with the three sources patched, scratch only): Shared Library only, +912 code. No prompt text, no call.
- Plant on 33442 call 5: AGREE/DISAGREE/AGREE -> E-PREM DISAGREE 1 (live 0); DISAGREE/AGREE/AGREE -> DISAGREE 1 (live 3); all AGREE -> 0.
- All 61 replayable stored runs (Judge and Alt): tally and errors identical to live (je_tally.cjs).
- Same three records and the same line loop as W3's no-head fix, Shared Library only: one write can carry both if built together.
