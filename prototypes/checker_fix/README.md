# checker_fix: K-C answer-test masking and K-G4 later-round search (offline only; nothing written to n8n or the database)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN) version de2c7688, read by GET on the public API; base/<node>.js is the live code.
- new/<node>.js is built by `python3 patch.py` from base/ (anchored replacements; it refuses if an anchor is missing). 17 nodes changed:
  all 17 that carry netLines (K-C); 14 of them also carry cureVerdicts (K-C cure test and K-G4).
- write_nodes.py (copied from prototypes/maxtok, names set to the 17 nodes) guards on the base md5. Run only with --dry: "DRY: base matched for 17 nodes; nothing written".

## FIX 1, K-C (kc_fix re-applied to the current code, then extended)
- netMask, run on each clause before NET_STATE: NET_ANSWER (kc_fix: "<round or side> does not name / never names / not named <witness>"),
  NET_ANSWER_R ("<witness>, which <round or side> did not name"), NET_ANSWER_U ("<round> left <witness> unstated", "went unstated in <round>"),
  and NET_QUOTE (double-quoted words, a round's or a verse's words, never the judge's ground). NET_CONC skips a hit after "CONCEDED (stated)",
  as NET_REPORT skips "conceded that". A stating ground elsewhere in the clause still counts.
- netKeeps replaces the bare NET_STATE test of a RESTATED line in the K-C cure ("the restated line keeps the ground ...").
- What actually matched in run 32212: Gemini (886) original line: "unstated" in "Premise 5 is CONCEDED (stated) regarding Mary's unstated link";
  its restated line: "[CR3] did not name them". DeepSeek (885): quoted concessions "I do not claim Isaiah 7:14 alone states ..." and
  "... is not stated to be Mary's"; restated: "[CR3] LINK 2 never names the pressed witnesses". DeepSeek D5 ("never states Mary's line") stays marked.

## FIX 2, K-G4
- kg4Answered: for each PRESSED line (or a statement's quotation) whose quotation is found in its pressing round, the pressed witnesses are the
  verses the BROKEN line names that the quotation also names (fallback: line verses outside the anchor parentheses that the pressing round
  names; then line verses outside the anchor). Each is searched in EVERY later round of the side that holds the link (order CR1 DR1 CR2 DR2
  CR3 DR3; CR = defender: claude_r1, claude_r2, engine_r3; DR = challenger: engine_r1, engine_r2, challenger_r3). Any naming: UNCURED
  "unanswered-false"; none: CURED. RETRACTED still cures. SHORT lines no longer cure K-G4 (K-G1 keeps its SHORT rule). The judge-facing rule
  text (CURE_RULE_G, CURE_FORM) says so.

## Tests (node, offline): test/
- compile.cjs: all base and new files compile (new Function). 0 failures.
- unit.cjs (out: unit_out.txt): 13 K-C netLines fixtures x 17 nodes, 3 netKeeps fixtures x 14 nodes, 6 K-G4 fixtures x 14 nodes. bad 0.
- replay.cjs (out: replay_out.txt): runs 32157, 32194, 32205, 32212, every seat and the single judge, base vs new marks and cure verdicts.
  The cure reply is rebuilt from the stored report (cut at 600 characters), so two base items differ from the stored status (listed there).
- population.cjs (out: population_out.txt): 663 texts; K-C marks 305 old, 274 new; 31 removed, 0 added. population_cure.cjs: 75 stored
  RESTATED lines; keeps-ground 11 old, 2 new.
- data/: the SQL reads (SELECT only) the tests use.
