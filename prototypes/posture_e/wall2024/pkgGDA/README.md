# pkgGDA: a gate change that repeats an applied original change is cured (W2, 11-08; 33627 gemini)

Engine fix (gate cure). It is not a DeepSeek fix, so it rides with a gap's graded DeepSeek fix. W1 confirmed the cause (Wall 3131).

## Fault (33627 gemini, removed with drv_uncured 4)
- Send-back: S5/S7/S9/S11 retracted the FORCED lines of D2 vs C3, D4 vs C5, D5 vs C1 and D5 vs C6. pkgRFL refused them, because those collisions were still CHALLENGER LINK BROKEN. That refusal made gate items G6-G9 (NOT APPLIED, E-APPLY S5...).
- Gate: G1-G4 regraded the collisions UNDERDETERMINED, and G6-G9 repeated "RETRACTED: D2 vs C3" and the rest.
- gateCure2024 applies the original items and the gate changes in one pass. S5 now passes pkgRFL and removes the FORCED line first, so G6's copy finds no FORCED line and reads "no line form". The NOT APPLIED branch then scored G6 "the gate change was not applied", UNCURED, LIVE. Gemini's stored end text has exactly the asked state: UNDERDETERMINED collisions and no FORCED lines.

## Change (gateCure2024, NOT APPLIED branch; 6 nodes)
`gdaDup2024(x,a,its,applied)`: an uncured NOT APPLIED item from E-APPLY of S<n> is cured when its gate CHANGE equals S<n>'s own change word for word (markdown, quotes, spacing and a final period ignored) and S<n> is applied in the same pass. The reason says "the gate change repeats S<n> word for word, and S<n> was applied in the same pass (pkgGDA)". Nothing else changes.

## Builds
- Rides alone on live LIB v15_R1B: pkgLIB/strip_GDA -> pkgLIB_v15_GDA (Shared Library json_sha 185b2101c840e48d; 22/22 stubs rebuild). Gate_Build 725f11466838 -> see plan_GDA.json.
- Stacked on D38+CRG+G4R: pkgLIB/strip_GDA19 -> pkgLIB_v19_GDA (json_sha a0cb875227e2847e; 22/22). plan_GDA_v19.json.

## Test (node pkgGDA/test_GDA.cjs [base] [patched] [plan]): 26 OK, 0 FAIL on both bases
- 136 node runs over 36 runs: 1 changed output (33627 Gate Record). The flips are G6, G7, G8 and G9 (UNCURED -> CURED, pkgGDA reason), and no other row changes.
- 33627 gate.seats[gemini].uncured_counted goes from 4 to 0.

## Live bar
A gate item that repeats an applied original change is never counted in drv_uncured.
