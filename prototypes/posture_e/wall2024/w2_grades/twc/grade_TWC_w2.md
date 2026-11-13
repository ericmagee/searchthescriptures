# W2 grade: pkgTWC (ASK 167 part A), base s175. 22:02 CST 11-12

File graded: wall2024/pkgTWC/parent_s175_TWC.json, sha 1a9800144c798f4e.

VERDICT: NOT PASSED. One defect (F1), with a tested fix of +158 characters.

## Checks (MEASURED)
- Identity: W1's build.cjs, run on fetchback_live_s175.json (sha 4a2a2c5b77ce40da), gives sha 1a9800144c798f4e, code +737.
- Diff against s175: only Close Enforcer Build and Close Enforcer Record differ. 443 of 443 nodes; connections are equal.
- Packing check: 43 stubs. Only Alternate Build and Early Alternate Build throw.
- Order of replies: Close Enforcer Call deepseek maps replies by position from Close Group Batch Build (bt C, index k). The two copies keep their Build order, so BA[k] pairs with reply k.
- The confirmed list is right in 9 of 9 new plants (out_built.txt). The plants cover:
  - copies that confirm one link on different pairs;
  - a form refusal on copy 2;
  - a pkgCLK relink;
  - two lines on one copy only;
  - candidate X1 answered on both copies;
  - different links on the two copies;
  - side crossing;
  - bold lines;
  - both sides confirmed;
  - a copy-2 timeout.

## F1 (defect): the debater fault ledger counts every confirmed contradiction twice
- pkgDFL rev 3 is LIVE in s175. dfl_counted (live prosrc) takes every E-CLOSECON log row whose cure_reason begins "CONFIRMED".
- When both checks confirm, the copy-2 row keeps status CONFIRMED. Only a note is added: "the same link is already broken by an earlier confirmed line". log() then writes its cure_reason as "CONFIRMED -- ...".
- Result: in plants P1, P3, P5, P8 and P9 the ledger rows are 2 for each confirmed link, where 1 is wanted. The report's line count doubles.
- W3 asked for this case at Wall 5596, limit (a): "under ASK 167 the ledger should record only after the second confirmation".

**Fix, tested.** In Close Enforcer Record, insert before "\nconst seen=new Set();const confirmed=[];":

    if(__two)rows.forEach(x=>{if(x.copy===2&&x.status==='CONFIRMED')x.status='CONFIRMED (second check)';}); /* the agreeing second check is not a second fault */

- Size: +158 characters, so the package total is +895.
- With the fix:
  - my plants pass 9 of 9, with 1 ledger row for each link (out_fix.txt);
  - W1's plants still pass 9 of 9.
- The confirmed list reads only status 'CONFIRMED', so it is unchanged. Copy 1's row is the one that counts.
- The new status does not match ^CONFIRMED( --|$), so the ledger skips it.

## Limits
- L1. The judge-found path is not covered by the package. Judge Contradiction Record (jcc.confirmed) still confirms on ONE DeepSeek check. cecBroken2024 and ecgSplit2024 in the Shared Library break links from both cec and jcc. W3's ledger replay (Wall 5596) shows 9 judge-found rows. ASK 167's two confirmations therefore do not reach a contradiction that a judge names after the panel. One reading counts the judge's naming as the first confirmation. That reading is the operator's to make, and is not stated in the package.
- L2. Prompt: each run makes one more DeepSeek close check per side. That is 2 extra calls in the group batch, whose concurrency is unmeasured (pkgPDS). W1 estimates +85,000 to +148,000 characters.
- L3. Temperature 0 and 0.6 are two draws of the same model on the same prompt. They are not independent readers.
- L4. Before this package, a second CONFIRMED line on the same link in ONE reply already made 2 ledger rows. That is pkgDFL's own behaviour and is unchanged here.

## Combined file for W4: wall2024/parent_s175_SRA_TWC.json, sha 60a8eb5e34aa206f
- Against parent_s175_SRA.json: only the two Close Enforcer nodes differ, and both are byte-equal to TWC's.
- Against TWC: only the Shared Library differs, and it is byte-equal to SRA's.
- Against s175: code +3,447. Connections are equal; 443 nodes.
- Packing check: 43 stubs, 2 throwing.
- Identity CONFIRMED. The file carries F1. It needs a rebuild once the fix lands.
