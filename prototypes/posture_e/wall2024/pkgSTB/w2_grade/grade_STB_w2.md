# W2 grade of pkgSTB (W3, Wall 3826, commit 9980b10): PASS

Base live s90. Grader W2 (claimed Wall 3828).

## Reproduced
1. strip_STB equals strip_VP1_s84 file for file. A fresh copy packed with STUBV=3 gives files equal to pkgLIB_STB (only the folder paths in plan_LIB.json differ). build_STB.cjs on it gives a file byte-equal to parent_s90_STB.json: 418 nodes, 32 changed (Shared Library, 29 stubs, Alternate Build, Early Alternate Build), connections unchanged.
2. Form 2 is unchanged by the edited tools: strip_VP1_s84 packed with the default form, through the edited pack.cjs and e4_rebase.cjs, gives all 32 nodes byte-equal to live s90. Packages in flight that were packed in form 2 are not disturbed.
3. probe_STB: 12 OK, 0 FAIL (probe_STB_w2.txt).
4. Mixed forms are refused at build time: build_STB.cjs with a form 2 library on the form 3 parent stops ("reads the Shared Library and is not a form 3 stub").

## Stacking with the packages waiting to be written (my own checks)
- pkgKNL rev 4 (W2, strip_KNL4) packed in form 3: every stub and both e4 heads equal pkgLIB_STB; only Shared_Library.js differs. Built on parent_s90_STB.json, it changes 1 node (Shared Library). Packing it with the STB parent as the fetch-back gives the same files.
- pkgFUK rev 3 (W1, strip_FUK3) packed in form 3: the same result, only Shared_Library.js, 1 node.
- pkgVP3 rev 3 (W4) and pkgKQG (W1) change Send Back Record, Alt Send Back Record and R2 Alt Send Back Record. These are not library nodes, so they do not touch pkgSTB. They touch each other: whichever is written second is rebuilt on the first.

## Build steps that change after STB is live
- pkgKNL4/build_KNL4.cjs parent refuses unless the live library equals pkgLIB_VP1_s84, and pkgFUK/build_FUK.cjs parent refuses unless the 6 Normalize stubs change. Both refusals are correct guards, but both will refuse on a form 3 base. After STB is live, the parent step for a library package is: pack its strip folder in form 3, then `node pkgSTB/build_STB.cjs <live fetch-back> pkgLIB_<X> <out>`. This changes the Shared Library alone.
- When KNL rev 4 and FUK rev 3 are both written, the second one's strip folder must carry both edits. Its anchors stack either way (Wall 3812, check e).

## Safe write order
1. pkgSTB first: all 32 nodes in one update, with `gate/STUBV` (3) committed together with the write record.
2. Then each library package (KNL rev 4, FUK rev 3), each repacked in form 3 on the live fetch-back and built with build_STB.cjs. Each write is the Shared Library node only, and the grader checks that every stub opens with "// pkgLIB stub, form 3".
3. The Send Back packages (VP3 rev 3, KQG) are written in any order relative to the above, the second rebuilt on the first.

## Log rows
None added or changed.
