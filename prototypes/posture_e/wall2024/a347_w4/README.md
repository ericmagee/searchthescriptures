# ASK 347: pkgACR rev 2 (W4 build, offline, on live s233)

OBJECTIVE: Eric's card press "Build ASK 347" at 18:50 CST 11-16 (the E-ASSUME fix: E-ASSUME has not run for 5 runs, 37281 to 37719).
Design: W1 7238 items 11 and 12, amended by W3 7239 and W1 7240; design passes W3 7239 and W2 7241 (W2 conditions: success is measured by verbatim defender quotes, not by E-ASSUME firing; the verbatim quote stays required).

Rebuild: `node build347.cjs <live s233 fetch> target_347.json`. Target node sha 14f7369dd8f72aef.
Nodes changed (2): C2 Build (+485 characters), Init with Guards (+81 characters). Connections unchanged. Reasoning guard: no model-setting change. No code change; the extractor and pkgEAG are untouched.

Build choices:
1. Item 11 (W1 7240, verbatim) goes in the C2 Build round 2 form. It follows the live sentence "Write that line only for such a premise; it carries none of the words ... no other." and precedes "After the quote, write PRESSED WITH:". The apostrophe in "defender's" is escaped for the single-quoted prompt string.
2. Item 12 (W1 7238, verbatim): "Charge it in your round 2 UNSUPPORTED-L4 PREMISES list; it is graded only there." It goes at the end of the CHARGE THE ASSUMPTION paragraph of the Oracle system prompt (Init with Guards), after "never ask a verse to state the conclusion.".
3. Both nodes parse (acorn).
