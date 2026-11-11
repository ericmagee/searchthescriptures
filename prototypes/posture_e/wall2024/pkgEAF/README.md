# pkgEAF (W2): THE ANSWER IN FULL served to the answer check for every quoted answer it can find

Cause B of Wall 4729/4730 (W1 and W2): at item level (E-ANS, Shared Library lines 3195-3196, used by Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build) the full answer block is served only when the judge's quote opens with a grant or is under 60 characters. Judges quoting different sentences of one answer get different texts checked (34852: Matthew 1:6, B12 MISSES, B57 MEETS). Terra's quotes with backslash-escaped marks are never found.

Forms (build: `node pkgEAF/build.cjs <fetch-back> <out> <AU|SU|A|S>`), base live s125:
- AU: gate dropped (block served when longer than the quote + 60), backslash marks removed before the finders read the quote. Code +69 (MEASURED).
- SU: gate kept, and also passed when 2+ items press one verse in one round; same backslash fix. Code +216 (MEASURED).

Measurements: measure_out.txt (items, full blocks, prompt chars), classify_out.txt (served / found not served / not found), calls_out.txt (DeepSeek calls and sizes), same_out.txt (every item outside THE ANSWER IN FULL and the system text byte-equal to live).
