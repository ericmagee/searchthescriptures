# ASK 422(a) plan rev 3 (W3): two copies, one writer, checked at load

OBJECTIVE. The engine and the child run the same Shared Library at every run, and any difference between them is refused before or during the run. Expected effect: one library change gives one build, one grade, one card and one readback, and a drift between the two copies costs a refused run, never a silent difference in results.

Rev 3 (W3 Wall 8930 B, as replaced by Wall 8933 on W2 8932; W1 8935, section 29) adds this OBJECTIVE line and map_sha. It replaces rev 1 and rev 2 where they differ:
10. map_sha: the first 16 hex of SHA-256 over JSON.stringify of the array of [key, entry] pairs, for the child's /*MAP*/ keys in sorted order, each entry taken from that workflow's own MAP. lib_sha is unchanged. The engine sends both in pass; the child's load check, the readback script and the ASK 419 run-start check compare both, and print both.
11. Every child MAP key must be present in the engine, and the engine's extra keys must equal a named list, today ["REFP"] (ASK 409).
12. DONE WHEN adds four cases: the live pair passes; one shared MAP entry changed fails; a child key dropped from the engine fails; an unlisted engine-only key fails.

---

# ASK 422(a) plan rev 1 (W3): one Shared Library for the engine and the child

Assignment (W3 Wall 8826): plan W3, build W4, grade W1 and W2. A system change: written only on the operator's card
in W4's thread. No prompt, no model setting, no reasoning setting changes.

## Facts read (live, 16:30 CST 11-18)
- Engine moMxiV4Irg1uRBZN version 36fcf36b: Shared Library node 1,067,686 characters (header 438, /*LIB*/ JSON of
  3,503 lines, /*MAP*/ 163,352); 65 Code nodes read $('Shared Library').params.jsCode.
- Child MqQHRl7mQQ0z8QdT ("ODV1 Alternate Pass") version 365d2828: its own Shared Library, 1,067,652 characters;
  14 Code nodes read it. The two node texts differ by 34 characters (the header); the library body sha is the same
  (603f8ccc979aba85, per the live record).
- The child is started by the engine's "Alternate Pass Call" (executeWorkflow, mode once, input "pass"). Its trigger,
  "Alternate Pass In", takes one object input, pass. Whether any other workflow calls the child: to be confirmed by W4.

## Options
A. The child holds no library. The engine sends its library text in pass (field lib, about 1.07 MB) and the 14 child
   stubs read it from the trigger. Writes once. Costs: 14 child stubs change; about 1 MB more stored with every child
   execution; the child can no longer run without the engine.
B. The library moves to a database row (body plus sha) fetched by both workflows. Writes once, but every one of the
   79 stubs changes, each run fetches about 1 MB twice, and a library change becomes a database write.
C. (recommended) Two copies stay, made identical by tool and guarded at load:
   1. One build: a library change is one set of pairs, applied by one writer command to both libraries, which refuses
      unless both bodies give the same sha after the change (W4's wgen.py and wchild.py joined into one command).
   2. One card: "Write library change to engine and child".
   3. A load check: the engine adds lib_sha (16 characters) to pass; the child's first Code node compares it with the sha
      of its own library body and, when they differ, stops the child with "pkgLIB1: library drift, engine <x>, child <y>".
      The engine already meets a failed child as a failed alternate pass; W4 confirms how that is recorded.
   4. One readback: one script fetches both workflows and prints both body shas.
   Why C: it removes the drift risk and the double build, grade, card and readback, with no change to 79 readers
   and no extra data stored per run. It is not "one copy" in the literal sense; A is, at the cost above.

## DONE WHEN (ASK 411)
1. Offline: the joined writer, given the ASK 374 pairs on the pre-374 bases, gives the live 36fcf36b and 365d2828
   library bodies byte for byte, and refuses a pair set that would leave the two bodies different.
2. Offline: the child's load check passes on the live pair and stops on a library with one byte changed.
3. After the write: one readback script shows both body shas equal; the first run after carries no pkgLIB1 stop,
   and its child execution shows the check ran (its output names both shas).

## Limits
Two copies still exist in n8n; C makes them equal by tool and catches drift at run time, not at edit time.
An edit made by hand in the n8n editor to one copy is caught only at the next run.

# rev 2 (W3, after W1 8852, W2 8853 A, W4 8858 item 2 and 3). These items replace rev 1 where they differ.
1. TITLE AND CARD WORDING (W2 A1): "two copies, one writer, checked at load". The card names it so. It is not one copy.
2. BODY (W2 A2, W4 8858 item 3): the hashed body is the parsed /*LIB*/ line array; lib_sha is the first 16 hex of
   SHA-256 over JSON.stringify of that array. On both live fetch-backs it gives 603f8ccc979aba85, the value in both
   headers. The writer, the engine, the child check and the readback script all use this one definition.
3. WHERE lib_sha COMES FROM (W2 A3): computed at run time by the engine, never stored as a constant, so a hand edit of
   the engine copy is caught too. The builder names the Code node that builds the input of "Alternate Pass Call"
   (an executeWorkflow node) and adds lib_sha there.
4. HASH IN n8n (W1 C1, W2 A4): W4 probes require('crypto') in a Code node of a temporary archived workflow. If allowed,
   use it; if not, use the plain-JS SHA-256 W4 carries, shown equal to 603f8ccc979aba85 on the live body, with its time.
5. THE CHILD NODE (W2 A5): the check goes in a new plain Code node placed right after "Alternate Pass In", not in a
   library stub, so the stub form (section 15, gate/pack.cjs) does not change. The builder names it.
6. EFFECT OF A STOP (W2 A6, W1 N1, W4 8858 item 2c): Alternate Pass Call continues on error; Pass Accumulate marks
   that pass's seats "[AUDIT v21: ALTERNATE TRIED ... NOT SEATED]" with why "sub-workflow error: pkgLIB1: library
   drift ..."; the removed seat keeps its round 1 body; the run goes on. So a drift stop costs that pass's second
   alternate, and the report shows why.
7. ONLY CALLER, NO THIRD COPY (W1 C2, W4 8858 items 2a, 2b): the engine's Alternate Pass Call is the only caller; the
   Early Alternate (SX4ZWtgHNs96uBOo) and Cure Call (c7366RPLb8vdMQg6) workflows hold no library and no stub.
8. RARE CHILD RUNS (new, from W4 8858 item 2a): the child runs only when a second alternate pass is needed, so the
   load check alone would seldom run. Add the two-sha readback to the ASK 419 run-start check: before each run it
   fetches both workflows and refuses to release the run when the bodies differ. The load check stays as the guard
   during a run.
9. DONE WHEN adds: the readback and the run-start check show both shas equal on the live pair, and a refusal on a
   fetched pair with one changed library line.
