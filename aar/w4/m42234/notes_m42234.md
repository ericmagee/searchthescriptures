# Offline body-size measure, run 42234 vs run 42071 (W4, 11-24)
No n8n call, no execution read. The stored debate_results rows (8dd067f4, 7124c5fb) were read through the REST API. The live engine ff7ab4cf node code (Regrade Load, Panel Build, Close Enforcer Build) was run locally with stub inputs: measure.cjs; outputs out_42071.json and out_42234.json.

| | 42071 | 42234 | growth |
|---|---|---|---|
| rounds (8) | 143,318 | 223,175 | +56% |
| panel judge body, each | 211,130 | 295,851 | +40% |
| panel judge bodies, 3 | 633,392 | 887,555 | +254,163 |
| close enforcer, defender, each copy (x2) | 183,748 | 303,638 | +65% |
| close enforcer, challenger, each copy (x2) | 122,872 | 173,982 | +42% |
| close enforcer, 4 bodies | 613,244 | 955,244 | +342,000 |

System prompt per judge: 62,753 -> 63,691.

Left out (they are not buildable from the row alone, so the true figures are higher):
- Quote Report blocks: the KJV citation check, the [L2] check, and THE GRANTS LISTS.
- Each judge's fault-ledger block and panel history.
- Question-round bodies.
- The panel enforcers' bodies (Enforcer Build): these need judge outputs, and 42234 wrote none.

Stub model names change each body by a few characters only.
