# pkgASM: E-ASM, an inferred act is never an ASSUMES (TRIAL; W1 Wall 2724, W3 2726 (4))

Rule source: the judges' own instruction (Panel Build, live s16): "What a link INFERS from its rows is its [L4] ... an inferred act, such as
a begetting or a knowing, is never an ASSUMES." No enforcer checked it.

Rule (TRIAL, side-neutral). A premise counted UNEXHIBITED on an ASSUMES ground, whose answering block exhibits two or more layer kinds,
raises when the assumed fact (the text after ASSUMES:, up to ROWS GIVE) names a knowing, begetting or conceiving (knew, know(s), known,
knowing, begat, begot, beget(s), begotten, begetting, conceive(d/s), conceiving; not "begetter", not "known as/that/of"). When K-UNX-A raises
on the same premise, one item is sent naming both, counted once (W3 2726 (4)). Otherwise it is a K-UNX item with a:'ASM'.

Cure. A CORRECTED COUNT below the count read; or a STATEMENT whose ASSUMES: names a given fact with no such act. When K-UNX-A is also on
the item, that STATEMENT must meet the K-UNX-A cure as well (quote the block's [L1] and say what it lacks). A KEEP does not cure it.

Edits: 22 nodes, on pkgUNXA/patched (build pkgUNXA first). Library: unxaAct, and unxaCheck's ASSUMES branch. kunxLines: the item's why,
asm field and line. Cure (in the 19 nodes that hold the K-UNX-A cure): the E-ASM branch before it. Hashes are in plan_ASM.json.

Replay (replay_ASM.txt, 142 verdicts, 47 runs): no K-UNX-A item is lost or changed. E-ASM alone adds 0 items. 4 K-UNX-A items now also
name the act, and these are the 4 found by hand at Wall 2724: 32924 gemini C1 ("knowing") and C6 ("begot"), 33218 gemini C1, 33222 gemini C1.
So on stored data this package raises nothing new. What it changes is the cure for those items: quoting the [L1] no longer cures an
ASSUMES that names a knowing.

Test: `node pkgUNXA/build_UNXA.cjs && node pkgASM/build_ASM.cjs && node pkgASM/replay_ASM.cjs && node pkgASM/test_ASM.cjs` gives 18 OK.
That includes the real 33222 Panel Payloads node through the pkgGSL harness.
Write order: after pkgUNXA. Revert: pkgASM/base/ (= the pkgUNXA finals).
