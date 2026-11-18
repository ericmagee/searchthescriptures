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
