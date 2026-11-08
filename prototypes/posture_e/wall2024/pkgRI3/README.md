# pkgRI3 part A: the CONCEDED LINKS count-line finders read through the shared reader (reader phase 2 item 3, W1, 11-08)

Reader phase 2 was approved by Eric on 11-07 (items 1-15), and W3 set the order. This is a library layer. It is not a DeepSeek fix.

## Change (22 library nodes)
- New ri3Count2024(line, side). It asks the shared reader (__RL.readLine) whether the line is a CONCEDED count line:
  - true: the reader reads it as CONCEDED for this side, not RESTATED.
  - false: the reader reads it as CONCEDED for the other side.
  - null: the reader reads no CONCEDED form, such as a line with no count, an unknown prefix, or an error.
- Three finders now ask it first. When it returns null, the old regex decides, as before:
  - ciCountSection: its head line.
  - lineOf: the count line used for the counted-premises repair.
  - __kg1lCount: the last count line.
- Part B, not in this package: psGrades, drvCountLine, drvBroken, block, charges and gateCure2024 (the grade parsers behind the count).

## Tests (test_RI3.cjs: 24 OK)
- The replay covers every saved run: 555 node runs over 38 runs, base pkgLIB/strip_RMR (v24) against strip_RI3.
- 0 outputs change, so there are 0 flips, 0 uncured changes and 0 NOT APPLIED changes. On every saved line, the reader and the old regex pick the same count line.
- The swap therefore changes nothing on saved data. It does make the reader the one place that decides what a count line is, so a later reader fix reaches these three finders too.

## Pack
- Base pkgLIB/strip_RMR (LIB v24_RMR 9c180896e11f) -> pkgLIB/strip_RI3 -> pkgLIB_v25_RI3, Shared Library 82dd538e606f.
- All 22 stubs rebuild byte for byte.
- Build: node pkgRI3/build_RI3.cjs pkgLIB/strip_RMR pkgLIB/strip_RI3 pkgRI3/plan_RI3.json
