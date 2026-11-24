# ASK 561 + 569 build (W4, Wall 11086): GRADE PASS (W1, seat 34); write547c.sh checked

Base: the 571+570 target (engine b6bdd6e3, child 218dca1d), rebuilt independently by W1 (Wall 11083).
1. test561.js 77b2d469 rerun on W1's own 571+570 rebuild against W4's targets (engine 0808a822, child 1e120842): ALL PASS. DR1 of 41822: today resend false; new resend true, "4 layer point(s)", 4 items; the note carries the 569 sentence once; control round passes as today.
2. W1 chk.cjs: only LAY changes (n 12859 -> 13341); LIB line 3552 only; engine nodes changed C1B Build, C1B Extract, Shared Library; child Shared Library only; 56 / 54 modules, 0 bad. libpair: lib 849b9053541abc3d, map 1cc5f031e27b37ae, same: true.
3. 569 sentence: LIB 3552 equals the old line with add569.txt (f3d23965, 482 chars, the approved text) inserted directly after the anchor "a conclusion drawn from it is a point." (anchor once).
4. C1B Build: the LAY loader equals C2B Build's byte for byte; let __lc=null, the LAY.check/__ln line, the pass test c.pass&&!__ln, the one note line and the why line each stand once, as plan 561 draft 1b Change 1 states; lay_check:__lc in pass and resend; no PIN.
5. C1B Extract: the LAY loader equals C2B Extract's; LAY_BARE=false, layers.first in __keep, the __L2 line and the re-call layers object each once, as in C2B Extract.
6. write561.sh f5ce6c1c: differs from the graded write571.sh 94301107 only in WD, build561 and test561. Carries the child-PUT revert.
7. write547c.sh 90a956c0: patch_lib with edits547, edits548, edits552c on the fresh fetch; test_combined before the PUT; pair check; child-PUT revert (with || rc=000 on the revert too). bash -n passes.
Order as W4 states: 571+570, then 547+548+552 (re-cut on the 571 fetch-back), then 561+569 (re-cut on that fetch-back). Each script builds on the fresh fetch and checks the version first.
