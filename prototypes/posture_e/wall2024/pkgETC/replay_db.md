# pkgETC replay on every stored DeepSeek verdict (debate_enforcer_log, kind enforcer_check, "right:" label): 6166 rows, 30 runs
SQL port of etc_lib.js (same three conclusion patterns, same quote masking, same families), run 14:28Z 11-07.
Flagged (label contradicts own reason), both DISAGREE, both 33311 gemini:
- 13335 E-PREM defender premise 4: right COUNTED, reason concludes "the correct ruling is SPARED".
- 13350 E-PREM challenger premise 3: right VOID, reason concludes "so it is not VOID; the right ruling is SPARED".
No other row flagged. Earlier draft false positives fixed and kept as unit tests: 1375 ("is spared by silence, but"), 7108 ("STANDS does not follow"), E-KEY "STANDS follows" x4.
